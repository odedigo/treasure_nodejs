/**
 * --------------------------
 * Treasure Hunt Application
 * --------------------------
 * 
 * @desc Controller for the admin section
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
import config from "../config/config.js"

/**
 * Main rendering function.
 * This function renders all admin pages
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

    /**
     * partial is the sub-page to be presented
     * within the admin framework
     */
    if (partial === undefined) {
        partial = 'admin_main' // default - main entrance page
    }

    // Read all branches from DB
    const branches = Object.assign({},util.getBranchesForUser(jwtUser))

    /**
     * This data is used by handibars
     * to render the page with its placeholders and
     * helper functions
     */
    var data = { 
        jsscript: ['/js/admin.js'], // the JS files to be added to the page
        jwtUser,                    // JWT token data
        section: partial,           // the sub page
        data: {},                   // each page has additional data based on its context
                                    // will be added later, before actual rendering
        root: `${req.protocol}://${req.get('host')}`,   // root of the site
        url: req.url,               // the page URL
        branches: branches,         // the branches
        title: "אזור ניהול",
        imgRoot: config.s3.root,
        helpers: {
            whichPartial: function() {  // used by handibars to render the sub-page
                return partial  
            }
        }
    }

    /**
     * based on the requested admin page, we render 
     * differently
     */

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

    // if none of the above, render 'admin' with 'main_admin' as partial
    res.render('admin' , data);
}

/**
 * Renders the gallery, where images can managed for the riddles
 * @param {*} req 
 * @param {*} res 
 * @param {*} jwtUser 
 * @param {*} data 
 * @returns 
 */
export async function renderAdminGallery(req, res, jwtUser, data) {    
    // branch code must be in the request
    var branchCode = req.params.param
    if (!util.isValidValue(branchCode)) {
        res.redirect("/err")
        return
    }
    // SUPER-ADMIN can see all images.
    // Others can view only from their branch so we redirect
    // them to their section
    if (jwtUser.role !== Roles.SUPERADMIN) {
        if (branchCode != jwtUser.branchCode) {
            res.redirect("/admin/gallery/"+jwtUser.branchCode)
            return
        }
    }

    // set up the data for this page
    data.jsscript.push('/js/upload.js') // manage image uploads
    // list of images for this branch
    util.getRiddleImages(branchCode, function(list) {
        data.branchCode = branchCode
        data.branch = util.codeToBranch(branchCode)
        data.imgs = list
        // render
        res.render('admin' , data);            
    })
}

/**
 * renders the branch list
 * @param {*} req 
 * @param {*} res 
 * @param {*} jwtUser 
 * @param {*} data 
 * @returns 
 */
export async function renderAdminBranches(req, res, jwtUser, data) {    
    // only SUPER-ADMINs are allowed on this page
    if (jwtUser.role !== Roles.SUPERADMIN) {
        res.redirect("/admin")
        return
    }
    // Get all the games to check if branches are associated with games.
    // If so, you cannot delete them
    const {games,status, numGames} = await api_game.getGameList(req, res, jwtUser)
    games.forEach(game => {
        data.branches[game.branch].used = true // mark if used
    });
    data.jsscript.push('/js/gvalid.js') // form validation script
    // render
    res.render('admin' , data);        
}

/**
 * renders the game edit page
 * @param {*} req 
 * @param {*} res 
 * @param {*} jwtUser 
 * @param {*} data 
 */
export async function renderAdminGameEdit(req, res, jwtUser, data) {    
    const game = await api_game.getGame(req.params.param,jwtUser)
    // check that the game exists
    if (game == null) {
        res.redirect('/admin/gamelist')
        return
    }
    data.game = api_game.createGameObj(game)
    data.jsscript.push('/js/gvalid.js')
    util.getRiddleImages(game.branch, function(list) {
        data.imgs = list
        // render
        res.render('admin' , data);            
    })
}

/**
 * renders the user list
 * @param {*} req 
 * @param {*} res 
 * @param {*} jwtUser 
 * @param {*} data 
 */
export async function renderAdminUserlist(req, res, jwtUser, data) {
    const {users, numUsers} = await api_user.getUserList(req.params.param, jwtUser)
    data.data = api_user.createUserList(users)
    data.jsscript.push('/js/gvalid.js')
    // pagination
    data.numUsers = numUsers
    data.numPerPage = config.app.userListPerPage
    if (!util.isValidValue(req.params.param))
        data.page = 1
    else
        data.page = req.params.param    
    res.render('admin' , data);
}

/**
 * renders the game list page
 * @param {*} req 
 * @param {*} res 
 * @param {*} jwtUser 
 * @param {*} data 
 */
export async function renderAdminGamelist(req, res, jwtUser, data) {
    const {games,status, numGames} = await api_game.getGameList(req, res, jwtUser)
    data.data = api_game.createGameList(games, status)
    // pagination
    data.numGames = numGames
    data.numPerPage = config.app.gameListPerPage
    if (!util.isValidValue(req.params.param))
        data.page = 1
    else
        data.page = req.params.param
    res.render('admin' , data);
}

/**
 * renders the QR page
 * @param {*} req 
 * @param {*} res 
 * @param {*} jwt 
 * @returns 
 */
export async function renderAdminQR(req, res, jwt) {
    const {gameName, branch} = req.params
    if (!util.isValidValue(branch) || !util.isValidValue(gameName)) {
        res.redirect("/admin")
        return
    }

    const game = await api_game.getGame(gameName,jwt)    
    if (game == null) {
        res.redirect("/err")
        return
    }

    var data = { 
        jsscript: ['/js/admin.js'],
        jwtUser: jwt,
        data: {
            gameName,
            readableName : game.readableName,
            branch: game.branch,
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
