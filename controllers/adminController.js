/**
 * --------------------------
 * Treasure Hunt Application
 * --------------------------
 * 
 * @desc Controller for Login
 * 
 * Org: Mashar / Kfar-Sava
 * By: Oded Cnaan
 * Date: March 2024
 */
"use strict";
//================ IMPORTS =================
import * as api_user from '../controllers/api_user.js';
import * as api_game from '../controllers/api_game.js';
import * as util from "../utils/util.js";
import { Roles } from '../db/models/UserModel.js';
import fs from 'fs'

/**
 * Main rendering function
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export async function renderAdmin(req, res, partial, jwtUser) {
    
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    if (partial === undefined) {
        partial = 'admin_main'
    }

    const branches = util.getBranchesForUser(jwtUser)

    var data = { 
        jsscript: ['/js/admin.js'],
        jwtUser,
        section: partial,
        data: {},
        root: `${req.protocol}://${req.get('host')}`,
        url: req.url,
        branches: branches, 
        helpers: {
            whichPartial: function() {
                return partial  
            }
        }
    }

    if (partial === 'userlist') {
        renderAdminUserlist(req, res, jwtUser, data)
        return
    }
    if (partial === 'gamelist') {
        renderAdminGamelist(req, res, jwtUser, data)
        return
    }
    if (partial === 'editgame') {
        renderAdminGameEdit(req, res, jwtUser, data)
        return
    }
    if (partial === 'brnch') {
        renderAdminBranches(req, res, jwtUser, data)
        return
    }
    if (partial === 'gallery') {
        renderAdminGallery(req, res, jwtUser, data)
        return
    }

    // main_admin
    res.render('admin' , data);
}

export async function renderAdminGallery(req, res, jwtUser, data) {    
    if (jwtUser.role === Roles.TEACHER) {
        res.redirect("/admin")
        return
    }
    const branchCode = req.params.param
    if (!util.isValidValue(branchCode)) {
        res.redirect("/err")
        return
    }
    if (jwtUser.role !== Roles.SUPERADMIN) {
        if (branchCode != jwtUser.branch) {
            branchCode = util.branchToCode(jwtUser.branch)
        }
    }

    data.jsscript.push('/js/upload.js')
    data.imgs = util.getRiddleImages(branchCode)
    data.branchCode = branchCode
    data.branch = util.codeToBranch(branchCode)
    res.render('admin' , data);        
}

export async function renderAdminBranches(req, res, jwtUser, data) {    
    if (jwtUser.role !== Roles.SUPERADMIN) {
        res.redirect("/admin")
        return
    }
    const games = await api_game.getGameList(req, res, jwtUser)
    games.forEach(game => {
        data.branches[game.branch].used = true
    });

    res.render('admin' , data);        
}

export async function renderAdminGameEdit(req, res, jwtUser, data) {    
    const game = await api_game.getGame(req.params.param,jwtUser)
    if (game == null) {
        data.error = "המשחק לא נמצא"
    }
    else {
        data.game = api_game.createGameObj(game)
        data.imgs = util.getRiddleImages(game.branch)
        res.render('admin' , data);        
    }
}

export async function renderAdminUserlist(req, res, jwtUser, data) {
    const users = await api_user.getUserList()
    if (users) {
        data.data = api_user.createUserList(users)
    }
    // main_admin
    res.render('admin' , data);
}


export async function renderAdminGamelist(req, res, jwtUser, data) {
    const games = await api_game.getGameList(req, res, jwtUser)
    if (games) {
        data.data = api_game.createGameList(games)
    }
    // main_admin
    res.render('admin' , data);
}


export function renderAdminQR(req, res, jwt) {
    const {gameName, branch, readableName} = req.params
    if (!util.isValidValue(branch) || !util.isValidValue(gameName)) {
        res.redirect("/admin")
        return
    }

    var data = { 
        jsscript: ['/js/admin.js'],
        jwtUser: jwt,
        data: {
            gameName,
            readableName,
            branch,
            branchName: util.codeToBranch(branch),
            green: "9bba59",
            red: "ff0000",
            blue: "4f81bd",
            imgSize: "200x200"
        },
        rootEncoded: encodeURIComponent (`${req.protocol}://${req.get('host')}`),        
        root: `${req.protocol}://${req.get('host')}`,
        url: req.url
    }
    res.render('qr', data)
}
