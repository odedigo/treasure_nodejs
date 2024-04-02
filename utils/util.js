import crypto from "crypto"
import emailValidator from "email-validator"
import config from "../config/config.js"
import jwt from 'jsonwebtoken'
import fs from "fs"
import path from "path"

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
            str = str.replace("{"+(i-1)+"}", arguments[i]);
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

export function getOneTimeToken(user) {
    const token = jwt.sign({ username: user.username, role: user.role, branch: user.branch, name: user.name }, process.env.JWTSECRET, {
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
        console.log("Cannot decode token")
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
    var pages = ['gamelist','register','userlist','editgame']
    if (req.params.page == undefined)
        return true
    return pages.includes(req.params.page)
}


export function branchToCode(branch) {
    const code = Object.keys(config.data.branches).find(key => config.data.branches[key] === branch);
    return code
}

export function codeToBranch(code) {
    return config.data.branches[code]
}
    
export function getRiddleImages() {
    const list = fs.readdirSync('./public/img/rdl/', {withFileTypes: true})
    .filter(item => !item.isDirectory() && (path.extname(item.name) === '.png' || path.extname(item.name) === '.jpg'))
    .map(item => item.name)
    return list
}