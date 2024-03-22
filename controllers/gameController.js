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
import * as logger from "../utils/logger.js"

/**
 * Main rendering function
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export function renderGame(req, res, next) {
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    // Find relevant document in DB that describes the game
    var {branch,team,index,teacher} = req.params
    var query = {
        branch, 
        active:true
    }
    if (teacher !== undefined) {
        query["teacher"] = teacher
    }
    
    logger.debugM("Get game data query:", query)

    // Async Query
    GameModel.findOne(query)
    .then (gameData => {
        if (gameData) {
            // All good
            var gameJson = JSON.parse(JSON.stringify(gameData))
                                   
            // render game page with received content
            res.render('game' , { 
                jsscript: '/js/student.js', 
                teamData: gameJson[team],   
                rdl : gameJson[team].riddles.filter((rdl) => (rdl.index == index) )[0],
                team,
                index,
                branch,
                teacher
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

