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
import { renderTeacher } from '../controllers/teacherController.js';
import { renderErr } from '../controllers/errController.js';


// Students game
router.get('/game/:branch/:team/:index/:teacher?', (req, res) => { //Game Site 
    var {branch,team,index,teacher} = req.params
    if ((team === undefined || index === undefined || branch === undefined) ||
        (team != 'red' && team != 'green' && team != 'blue') ||
        (index > 5 || index < 0)) {
        res.redirect('/err')
    }
    else
        renderGame(req, res);
});

// Teacher's site
router.get('/teacher/:brnch/', (req, res) => { //Teacher Site
    renderTeacher(req, res);
});

// Error page
router.get('/err', (req, res) => { //Err Site
    renderErr(req, res);
});


export default router;
