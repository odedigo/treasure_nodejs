"use strict";
const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController'); //.js muss nicht angegeben werden
const teacherController = require('../controllers/teacherController');
const errController = require('../controllers/errController');

router.get('/', (req, res) => { //Home Site
    var team = req.query.team;
    var index = req.query.index;
    if ((team === undefined || index === undefined) ||
        (team != 'red' && team != 'green' && team != 'blue') ||
        (index > 5 || index < 0)) {
        res.redirect('err')
    }
    else
        homeController.renderHome(req, res);
});

router.get('/index.html', (req, res) => { //Teacher Site
    var team = req.query.team;
    var index = req.query.index;
    var url = "/"
    if (team !== undefined && index !== undefined) {
        url += `?team=${team}&index=${index}`
    }
    res.redirect(url)
});

router.get('/teacher', (req, res) => { //Teacher Site
    teacherController.renderTeacher(req, res);
});

router.get('/teacher.html', (req, res) => { //Teacher Site
    teacherController.renderTeacher(req, res);
});

router.get('/err', (req, res) => { //Err Site
    errController.renderErr(req, res);
});

module.exports = router;
