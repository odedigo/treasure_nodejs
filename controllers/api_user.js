/**
 * --------------------------
 * Treasure Hunt Application
 * --------------------------
 * 
 * @desc Controller for the student's game
 * 
 * Org: Mashar / Kfar-Sava
 * By: Oded Cnaan
 * Date: March 2024
 */
"use strict";
//================ IMPORTS =================
import * as logger from "../utils/logger.js"
import * as util from "../utils/util.js";
import { UserModel, Roles } from "../db/models/UserModel.js";
import bcrypt from 'bcrypt'
import config from "../config/config.js"

export async function logoutUser(req, res) {
    res.cookie('cred', "", {maxAge: 9000000000, httpOnly: true, secure: true });
    res.redirect("/")
}

export async function loginUser(req, res) {
    // Find relevant document in DB that describes the game
    var {username,password} = req.body

    var query = {
        username
    }

    // Async Query
    await UserModel.findOne(query)
    .then (user => {
        if (user) {
            bcrypt.compare(password, user.password).then(async function (result) {
                if (result) {
                    var jwt = util.getOneTimeToken(user)
                    res.cookie('cred', jwt.token , {maxAge: 9000000000, httpOnly: true, secure: true });
                    res.status(200).json({msg: "", redirect:"/admin"})
                }
                else {
                    res.status(400).json({msg: "שם משתמש או סיסמה לא תקינים", redirect:"/login", name: user.name, branch: user.branch})
                }
            })
        }
        else {
            res.status(400).json({msg: "שם משתמש או סיסמה לא תקינים", redirect:"/login"})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({success: false, msg: "תקלה במציאת המשתמש", redirect:"/login"})
    })        
}

export async function registerUser(req, res) {
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    // Find relevant document in DB that describes the game
    var {username,password, name, branch, role} = req.body
    if (!util.isValidValue(username) || !util.isValidValue(password) || 
        !util.isValidValue(name) || !util.isValidValue(branch) || !util.isValidValue(role)
        || (role !== Roles.ADMIN && role !== Roles.TEACHER)) {
            return res.status(400).json({msg: "יש למלא את כל הפרטים בטופס"})    
        }

    if (!util.validateEmail(username)) {
        return res.status(400).json({ msg: "שם המשתמש אינו אימייל חוקי" })
    }

    if (password.length < 6) {
        return res.status(400).json({ msg: "סיסמה צריכה להכיל לפחות 6 תווים" })
    }

    await UserModel.findOne({
        username
    }).then(user => {
        if (user) {
            res.status(400).json({ msg: "שם המשתמש כבר תפוס" })
            return
        }
        bcrypt.hash(password, 10).then(async (hash) => {
            await UserModel.create({
                username,
                password: hash,
                name,
                branch,
                role,
                token: '',
                created: util.getCurrentDateTime()
            })
            .then((user) =>
                res.status(200).json({ msg: "משתמש חדש נרשם בהצלחה" })
            )
            .catch((error) =>
                res.status(400).json({ msg: "רישום המשתמש נכשל" })
            );
        })
    })
    .catch (err =>  {
        console.log(err)
        res.status(400).json({ msg: "רישום המשתמש נכשל" })
    })
}

export async function getUserList(param, jwt) {
    const numPerPage = config.app.userListPerPage
    var page = param
    if (!util.isValidValue(page))
        page = 1
    var filter = {}
    if (jwt.role !== Roles.SUPERADMIN)
        filter['branch'] = jwt.branch
    const users = await UserModel.find(filter)
        .limit(numPerPage)
        .skip(numPerPage*(page-1))
        .sort({ branch:'desc', name:'asc'})
    var numUsers = await UserModel.countDocuments(filter)
    return {users, numUsers}
}

export function createUserList(users) {
    var res = []
    users.forEach(user => {
        var dt = util.getDateIL(user.created)
        res.push({name:user.name, branch: user.branch, username: user.username, role: user.role, created: dt})
    });
    return res;
}

export function deleteUser(req, res) {
    var {username} = req.body
    if (username === undefined) {
        res.status(400).json({msg: "שם משתמש לא חוקי"} )
        return
    }
    UserModel.deleteOne({ username })
    .then(resp => {
            res.status(200).json({msg: "משתמש נמחק"})
    })
    .catch(err => {
        console.log(err)
        res.status(500)
    })
}

export async function changePassword(req, res) {
    var {username, password} = req.body
    if (username === undefined || password === undefined) {
        res.status(400).json({msg: "נתונים לא חוקיים"} )
        return
    }
    if (!util.validateEmail(username)) {
        return res.status(400).json({ msg: "שם המשתמש אינו אימייל חוקי" })
    }

    if (password.length < 6) {
        return res.status(400).json({ msg: "סיסמה צריכה להכיל לפחות 6 תווים" })
    }

    var filter = {
        username
    }       

    const options = { 
        upsert: true,
        returnOriginal: false
    };

    bcrypt.hash(password, 10).then(async (hash) => {
        await UserModel.findOneAndUpdate(
            filter, 
            {$set: {"password": hash}},
            options
        ).then(user => {
            if (!user) {
                res.status(400).json({ msg: "שגיאה בעדכון המשתמש" })
                return
            }
            res.status(200).json({ msg: "הסיסמה עודכנה בהצלחה" })
        })
        .catch (err =>  {
            console.log(err)
            res.status(400).json({ msg: "עדכון הסיסמה נכשל" })
        })   
    })    
}

export function changeRole(req, res) {
    var {username, role} = req.body
    if (username === undefined || role === undefined) {
        res.status(400).json({msg: "נתונים לא חוקיים"} )
        return
    }
    if (!util.validateEmail(username)) {
        return res.status(400).json({ msg: "שם המשתמש אינו אימייל חוקי" })
    }

    var filter = {
        username
    }       

    const options = { 
        upsert: true,
        returnOriginal: false
    };

    UserModel.findOneAndUpdate(
        filter, 
        {$set: {"role": role}},
        options
    ).then(user => {
        if (!user) {
            res.status(400).json({ msg: "שגיאה בעדכון המשתמש" })
            return
        }
        res.status(200).json({ msg: "התפקיד עודכן בהצלחה" })
    })
    .catch (err =>  {
        console.log(err)
        res.status(400).json({ msg: "עדכון התפקיד נכשל" })
    })   
}