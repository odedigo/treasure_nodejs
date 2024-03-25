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
import { renderGame } from '../controllers/gameController.js'; 
import * as api_user from '../controllers/api_user.js';
import * as api_game from '../controllers/api_game.js';
import { renderTeacher } from '../controllers/teacherController.js';
import { renderErr } from '../controllers/errController.js';
import { renderLogin } from '../controllers/loginController.js'
import { renderAdmin } from '../controllers/adminController.js'

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
    renderTeacher(req, res);
});

// Error page
router.get('/err', (req, res) => { //Err Site
    renderErr(req, res);
});


// Login page
router.get('/login', (req, res) => { //Err Site
    renderLogin(req, res);
});

// Login page
router.get('/admin/:page?', (req, res) => { //Err Site
    renderAdmin(req, res, req.params.page);
});

// ********* user **********

router.post('/api/register', (req, res) => { //Err Site
    api_user.registerUser(req, res)
});

router.post('/api/login', (req, res) => {
    api_user.loginUser(req,res)
});


/** game */
router.post('/api/vector', (req, res) => {
    api_game.validateVector(req,res)
});

router.post('/api/reset/:gameName', (req, res) => {
    api_game.resetGame(req,res)
});

router.post('/api/start/:gameName', (req, res) => {
    api_game.startGame(req,res)
});


router.post('/api/create/:gameName', (req, res) => {
    api_game.createGame(req,res)
});

router.post('/api/remove/:gameName', (req, res) => {
    api_game.deleteGame(req,res)
});

export default router;
