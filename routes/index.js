/**
 * --------------------------
 * Treasure Hunt Application
 * --------------------------
 * 
 * @desc The main router
 * 
 * Org: Mashar / Kfar-Sava
 * By: Oded Cnaan
 * Date: March 2024
 */
"use strict";
//================ IMPORTS =================
import { Router } from 'express';
const router = Router();
import { renderGame, renderHome } from '../controllers/gameController.js'; 
import * as api_user from '../controllers/api_user.js';
import * as api_game from '../controllers/api_game.js';
import * as api_mng from '../controllers/api_mng.js';
import { renderTeacher } from '../controllers/teacherController.js';
import { renderErr } from '../controllers/errController.js';
import { renderLogin } from '../controllers/loginController.js'
import { renderAdmin, renderAdminQR } from '../controllers/adminController.js'
import * as util from "../utils/util.js";
import { Roles } from '../db/models/UserModel.js';
import multer from 'multer'

const storageMap = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, util.getMapImagesFolder(req.headers['x-branch-code']));
    },
    filename: (req, file, cb) => {
        var fn = req.headers['x-path-name']
        cb(null, fn);
    },
});
const storageGal = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, util.getGalleryFolder(req.headers['x-branch-code']));
    },
    filename: (req, file, cb) => {
        var fn = file.originalname
        cb(null, fn);
    },
});
const uploadMap = multer({ storage: storageMap })
const uploadGal = multer({ storage: storageGal })

/********************** PAGES ****************************************/

router.get('/', (req, res) => {
    renderHome(req, res)
})

router.get('/img/maps/:branch/:file/:tag?', (req, res) => {
    res.sendFile(util.getMapImagesFolder(req.params.branch) + req.params.file)
})

// Error page
router.get('/err', (req, res) => { //Err Site
    renderErr(req, res);
});

// Login page
router.get('/login', (req, res) => { //Err Site
    renderLogin(req, res);
});

// Logout page
router.get('/logout', (req, res) => { //Err Site
    api_user.logoutUser(req, res);
});


/********************** PLAYER / TEACHER PAGES ****************************************/

// Students game
router.get('/game/:gameName/:team/:index/', (req, res) => { //Game Site 
    var {team,index,gameName} = req.params
    if ((team === undefined || index === undefined || gameName === undefined) ||
        (team != 'red' && team != 'green' && team != 'blue') ||
        (index > 5 || index < 0)) {
        res.redirect('/err')
    }
    else
        renderGame(req, res, {method: 'get'});
});

// Teacher's site
router.get('/teacher/:gameName', (req, res) => { //Teacher Site
    if (!validateRoleAllowed(req, [Roles.ADMIN, Roles.TEACHER])) {
        res.status(400).json({msg: "הפעולה נכשלה"} )
        return
    }
    renderTeacher(req, res);
});


// Admin pages
router.get('/admin/:page?/:param?', (req, res) => { 
    const jwt = util.validateAdminUser(req, true)
    if (!jwt.valid || !validateRoleAllowed(req, [Roles.ADMIN, Roles.TEACHER])) {
        res.redirect("/login")
        return
    }
    renderAdmin(req, res, req.params.page, jwt.jwtUser);
});

// Admin pages
router.get('/admin/qr/:branch/:gameName', (req, res) => { //QR
    const jwt = util.validateAdminUser(req, true)
    if (!jwt.valid || !validateRoleAllowed(req, [Roles.ADMIN, Roles.TEACHER])) {
        res.redirect("/login")
        return
    }
    renderAdminQR(req, res, jwt.jwtUser);
});

/********* API ********** LOGIN / LOGOUT / REGISTER ****************************************/

router.post('/api/register', (req, res) => { //Err Site
    const jwt = util.validateAdminUser(req, true)
    if (!jwt.valid || !validateRoleAllowed(req, [Roles.ADMIN])) {
        res.redirect("/err")
        return
    }
    api_user.registerUser(req, res, jwt.jwtUser)
});

router.post('/api/login', (req, res) => {
    api_user.loginUser(req,res)
});

router.post('/api/logout', (req, res) => {
    if (!util.validateAdminUser(req, false).valid) {
        res.redirect("/err")
        return
    }
    api_user.logoutUser(req,res)
});

/********* API ********** USER ACTIONS ****************************************/

router.post('/api/user/del', (req, res) => {
    const jwt = util.validateAdminUser(req, true)
    if (!jwt.valid  || !validateRoleAllowed(req, [Roles.SUPERADMIN])) {
        res.redirect("/err")
        return
    }
    if (req.body.username === undefined) {
        res.status(400).json({msg: "שם משתמש לא חוקי"} )
        return
    }
    api_user.deleteUser(req, res, jwt.jwtUser)
});

router.post('/api/user/chgpass', (req, res) => {
    const jwt = util.validateAdminUser(req, true)
    if (!jwt.valid || !validateRoleAllowed(req, [Roles.ADMIN])) {
        res.redirect("/err")
        return
    }
    api_user.changePassword(req, res, jwt.jwtUser)
});

router.post('/api/user/role', (req, res) => {
    const jwt = util.validateAdminUser(req, true)
    if (!jwt.valid || !validateRoleAllowed(req, [Roles.ADMIN])) {
        res.redirect("/err")
        return
    }
    const {username, role} = req.body
    if (username === undefined || role === undefined) {
        res.status(400).json({msg: "הפעולה נכשלה"} )
        return
    }
    api_user.changeRole(req, res, jwt.jwtUser)
});

/********* API ********** GAME ACTIONS ****************************************/

/** 
 * Player request to validate a vector 
 */
router.post('/api/vector', (req, res) => {
    api_game.validateVector(req,res)
});

/**
 * get game list
 */
router.post('/api/game/list', (req, res) => {
    const jwt = util.validateAdminUser(req, true)
    if (!jwt.valid || !validateRoleAllowed(req, [Roles.ADMIN, Roles.TEACHER])) {
        res.status(400).json({msg: "הפעולה נכשלה"} )
        return
    }
    api_game.getGameList(req,res, jwt.jwtUser)
});

/**
 * reset a game
 */
router.post('/api/game/edit', (req, res) => {
    const jwt = util.validateAdminUser(req, true)
    if (!jwt.valid || !validateRoleAllowed(req, [Roles.ADMIN])) {
        res.status(400).json({msg: "הפעולה נכשלה"} )
        return
    }
    api_game.editGame(req,res, jwt.jwtUser)
});

/**
 * reset a game
 */
router.post('/api/game/reset', (req, res) => {
    const jwt = util.validateAdminUser(req, true)
    if (!jwt.valid || !validateRoleAllowed(req, [Roles.ADMIN, Roles.TEACHER])) {
        res.status(400).json({msg: "הפעולה נכשלה"} )
        return
    }
    api_game.resetGame(req,res, jwt.jwtUser)
});

/**
 * start a game
 */
router.post('/api/game/start', (req, res) => {
    const jwt = util.validateAdminUser(req, true)
    if (!jwt.valid || !validateRoleAllowed(req, [Roles.ADMIN, Roles.TEACHER])) {
        res.status(400).json({msg: "הפעולה נכשלה"} )
        return
    }
    api_game.startGame(req,res, jwt.jwtUser)
});

/**
 * Create a new game
 */
router.post('/api/game/create', (req, res) => {
    const jwt = util.validateAdminUser(req, true)
    if (!jwt.valid || !validateRoleAllowed(req, [Roles.ADMIN, Roles.TEACHER])) {
        res.status(400).json({msg: "הפעולה נכשלה"} )
        return
    }
    api_game.createGame(req,res, jwt.jwtUser)
});

/**
 * Delete a game
 */
router.post('/api/game/remove', (req, res) => {
    const jwt = util.validateAdminUser(req, true)
    if (!jwt.valid || !validateRoleAllowed(req, [Roles.ADMIN])) {
        res.status(400).json({msg: "הפעולה נכשלה"} )
        return
    }
    api_game.deleteGame(req,res, jwt.jwtUser)
});

/**
 * Delete a game
 */
router.post('/api/game/clone', (req, res) => {
    const jwt = util.validateAdminUser(req, true)
    if (!jwt.valid || !validateRoleAllowed(req, [Roles.ADMIN])) {
        res.status(400).json({msg: "הפעולה נכשלה"} )
        return
    }
    api_game.cloneGame(req,res, jwt.jwtUser)
});

/**
 * Save a game
 */
router.post('/api/game/save', (req, res) => {
    const jwt = util.validateAdminUser(req, true)
    if (!jwt.valid || !validateRoleAllowed(req, [Roles.ADMIN])) {
        res.status(400).json({msg: "הפעולה נכשלה"} )
        return
    }
    api_game.saveGame(req,res, jwt.jwtUser)
});

/**
 * Upload map image
 */
router.post('/api/game/upmap' , uploadMap.single('file'), (req, res) => {
    const jwt = util.validateAdminUser(req, true)
    if (!jwt.valid || !validateRoleAllowed(req, [Roles.ADMIN])) {
        res.status(400).json({msg: "הפעולה נכשלה"} )
        return
    }
    api_game.uploadMap(req,res, jwt.jwtUser)
});

/********************** MANAGEMENT ***********************************/
router.post('/api/mng/brnch', (req, res) => {
    const jwt = util.validateAdminUser(req, true)
    if (!jwt.valid || !validateRoleAllowed(req, [Roles.SUPERADMIN])) {
        res.status(400).json({msg: "הפעולה נכשלה"} )
        return
    }
    api_mng.handleBranch(req,res, jwt.jwtUser)
});

router.post('/api/mng/gal', uploadGal.single('file'), (req, res) => {
    const jwt = util.validateAdminUser(req, true)
    if (!jwt.valid || !validateRoleAllowed(req, [Roles.TEACHER, Roles.ADMIN])) {
        res.status(400).json({msg: "הפעולה נכשלה"} )
        return
    }
    api_mng.handleGallery(req,res, jwt.jwtUser)
});

router.post('/api/mng/galdel', (req, res) => {
    const jwt = util.validateAdminUser(req, true)
    if (!jwt.valid || !validateRoleAllowed(req, [Roles.ADMIN])) {
        res.status(400).json({msg: "הפעולה נכשלה"} )
        return
    }
    api_mng.handleGalleryDelete(req,res, jwt.jwtUser)
});
/********************** TOOLS ****************************************/

/**
 * Checks that the current user has the right to perform the action
 * by his role
 * 
 * @param {*} req 
 * @param {*} roles 
 * @returns 
 */
export function validateRoleAllowed(req, roles) {
    const jwtUser = util.validateToken(req.headers.cookie)
    if (!jwtUser) {
        return false
    }
    return (jwtUser.role == Roles.SUPERADMIN || roles.includes(jwtUser.role))
}


export default router;


