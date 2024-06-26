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
import {GameModel} from "../db/models/GameModel.js";
import config from "../config/config.js";
import strings from "../public/lang/strings.js"

export function renderHome(req, res) {
    res.render('home' , { 
        title: strings.title.home
    });
}


/**
 * Main rendering function
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export function renderGame(req, res, obj) {
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    // Find relevant document in DB that describes the game
    var {team,index,gameName} = req.params

    var query = {
        gameName,
        active:true,
    }
    
    // Async Query
    GameModel.findOne(query)
    .then (gameData => {
        if (gameData) {
            // All good
            var gameJson = JSON.parse(JSON.stringify(gameData))
            var errMsg = ''
            var infoMsg = ''

            var rdl = gameJson[team].riddles.filter((rdl) => (rdl.index == index) )[0]

            // render game page with received content
            res.render('th/game' , { 
                jsscript: ['/js/student.js'], 
                teamData: gameJson[team],   
                rdl,
                team,
                index,
                gameName,
                branch: gameJson["branch"],
                errMsg,
                infoMsg,
                title: strings.title.studentArea,
                imgRoot: config.s3.root
            });
        }
        else {
            res.redirect('/err')
        }
    })
    .catch(err => {
        console.log(err)
        res.redirect('/err')
    }) 
}

