"use strict";
import { Router } from 'express';
const router = Router();
import { renderGame } from '../controllers/gameController.js'; 
import { renderTeacher } from '../controllers/teacherController.js';
import { renderErr } from '../controllers/errController.js';


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

router.get('/teacher/:brnch/', (req, res) => { //Teacher Site
    renderTeacher(req, res);
});

router.get('/err', (req, res) => { //Err Site
    renderErr(req, res);
});


export default router;
