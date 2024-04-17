import crypto from "crypto"
import emailValidator from "email-validator"
import jwt from 'jsonwebtoken'
import fs from "fs"
import path from "path"
import { Roles } from '../db/models/UserModel.js';
import {BranchModel} from '../db/models/BranchModel.js'
import * as aws from '../utils/awsS3.js'

export function isValidValue(val) {
    return (val !== undefined && val !== "")
}

/**
 * Replaces {0}, {1} inside string with given arguments
 * First argument is the string
 * @returns string
 */
export function formatString() {
    try {
        let str = arguments[0]
        for (let i = 1; i < arguments.length; i++) {
            if (isValidValue(arguments[i]))
                str = str.replace("{"+(i-1)+"}", arguments[i]);
            else
                str = str.replace("{"+(i-1)+"}","");
        }    
        return str;
    }
    catch(err) {
      console.log(err)
        return "N/A"
    }
  }
  
  
/**
 * Formats local date and time in the IL timezone
 * @returns 
 */
export function getCurrentDateTime() {
    const now = new Date().toLocaleString('en', {timeZone: 'Asia/Jerusalem'})
    return new Date(now).toISOString();
}

export function getHash(str) {
    //creating hash object 
    var hash = crypto.createHash('sha512');
    //passing the data to be hashed
    data = hash.update(str, 'utf-8');
    //Creating the hash in the required format
    gen_hash= data.digest('hex');
    return gen_hash;
}

export function validateEmail(email) {
    return emailValidator.validate(email)
}

export async function getOneTimeToken(user) {
    var branchCode = branchToCode(user.branch)
    const token = jwt.sign({ username: user.username, role: user.role, branch: user.branch, branchCode, name: user.name }, process.env.JWTSECRET, {
        expiresIn: '10h',
    });    
    return {token, expires: getTokenExpiration({hour: 10})}
}

export function getTokenExpiration(delta) {
    const now = new Date()
    var advanced = null
    if (delta.min !== undefined)
        advanced = now.getMinutes() + delta.min
    if (delta.hour !== undefined)
        advanced = now.getHours() + delta.hour
    if (delta.day !== undefined)
        advanced = now.getDate() + delta.day
    if (delta.month !== undefined)
        advanced = now.getMonth() + delta.month
    now.setDate(advanced)
    return now.toISOString();
}

export function validateToken(token) {
    if (token === undefined || token == null)
        return null
    var s = token.substring(token.indexOf("=")+1)
    try {
        const decoded = jwt.verify(s, process.env.JWTSECRET);
        return decoded
    }
    catch(error) {
        return null
    }
}

export function getJwt(req) {
    const jwtUser = validateToken(req.headers.cookie)
    return jwtUser
}

export function validateAdminUser(req, validatePage = false) {
    const jwtUser = validateToken(req.headers.cookie)
    if (!jwtUser) {
        return {valid:false, jwt:null}
    }
    if (validatePage)
        return {valid: validateAdminPage(req), jwtUser}
    return {valid:true, jwt:jwtUser}
}

export function validateAdminPage(req) {
    var pages = ['gamelist','register','userlist','editgame','brnch','gallery']
    if (req.params.page == undefined)
        return true
    return pages.includes(req.params.page)
}


export function branchToCode(branch) {
    if (isValidValue(global.huntBranches))
        return Object.keys(global.huntBranches).find(key => global.huntBranches[key].name === branch);
    return "N/A"
}

export function codeToBranch(code) {
    if (isValidValue(global.huntBranches))
        return global.huntBranches[code].name
    return "N/A"
}

export function loadBranchesFromDB() {
    if (!isValidValue(global.huntBranches)) {
        BranchModel.find()
        .then(branches => {
            global.huntBranches = {}
            branches.forEach(brch => {
                global.huntBranches[brch.code] = {"name": brch.name}
            })    
        })
    }
}

export function clearBranchesCache() {
    global.huntBranches = undefined
}

export function addBranch(code, name) {
    BranchModel.create({name, code})
    .then(doc => {
        clearBranchesCache()
        loadBranchesFromDB()
    })
    .catch(err => {
        console.log(err)
    })
}

export function deleteBranch(code) {
    BranchModel.findOneAndDelete({code})
    .then(doc => {
        clearBranchesCache()
        loadBranchesFromDB()
    })
    .catch(err => {
        console.log(err)
    })
}

export function getBranchesForUser(jwt) {    
    if (jwt.role === Roles.SUPERADMIN)
        return global.huntBranches
    var code = branchToCode(jwt.branch)
    return {code : global.huntBranches[code]}
}
    
export function getRiddleImages(branch, cb) {
    aws.listFolder("riddles/"+branch, function(err, keyList, options){
        var list = keyList.Objects.filter((item) => {
           return (item.Key.endsWith('.png') || item.Key.endsWith('.jpg'))}
        ).map(item => {
            return item.Key.substring(item.Key.lastIndexOf("/")+1)
        })
       cb(list)
    }, null) 
}

export function getUniqueGameUID() {
    //var id = "id" + Math.random().toString(16).slice(2)
    var id = Math.floor(1000000 + Math.random() * 9000000).toString(16)
    return id
}

/**
 * NOT IN USE
 * @param {*} branchCode 
 * @returns 
 */
export function getMapImagesFolder(branchCode) {
    var str = process.argv[1]
    var index = str.lastIndexOf(path.sep)
    if (index == -1) {
        return null
    }
    str = str.substring(0, index)
    var p = `${str}${path.sep}public${path.sep}img${path.sep}maps${path.sep}${branchCode}${path.sep}`
    return p
}

/**
 * NOT IN USE
 * @param {*} branchCode 
 * @returns 
 */
export function getGalleryFolder(branchCode) {
    var str = process.argv[1]
    var index = str.lastIndexOf(path.sep)
    if (index == -1) {
        return null
    }
    str = str.substring(0, index)
    var p = `${str}${path.sep}public${path.sep}img${path.sep}rdl${path.sep}${branchCode}${path.sep}`
    return p
}

export function deleteMapFiles(uid, branchCode) {    
    var keyList = {Objects: [{Key: `maps/${branchCode}/${uid}_red.png`},
                            {Key: `maps/${branchCode}/${uid}_blue.png`},
                            {Key: `maps/${branchCode}/${uid}_green.png`}]}
    aws.deleteMultipleObjects(keyList, function(err, numDeleted) {

    })
}

export function createMapFiles(uid, branchCode) {
    aws.copyEmptyToFolder(`maps/${branchCode}`,`${uid}_red.png`, function(err, success) {
        aws.copyEmptyToFolder(`maps/${branchCode}`,`${uid}_blue.png`, function(err, success) {
            aws.copyEmptyToFolder(`maps/${branchCode}`,`${uid}_green.png`, function(err, success) {
            })
        })
    })
}

export function upFolder(folder) {
    var index = folder.lastIndexOf(path.sep, folder.length-2)
    return folder.substring(0,index+1)
}

export function concatFile(folder,file) {
    return `${folder}${path.sep}${file}`
}

export function getDateIL(dt) {
    return new Date(dt).toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })
}

export function setImagesToEmpty(team) {
    team.riddles.forEach(rdl => {
        rdl.img = "empty.png"
    })
    return team
}