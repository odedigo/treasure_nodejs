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
import * as util from "../utils/util.js";
import strings from "../public/lang/strings.js"
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
    var {branch,team,index,teacher} = req.params
    if (!util.isValidValue(branch) || !util.isValidValue(team) || !util.isValidValue(index)) {
        res.redirect("/err")
        return
    }

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
            var errMsg = ''
            var infoMsg = ''
            var success = -1

            var rdl = gameJson[team].riddles.filter((rdl) => (rdl.index == index) )[0]

            // render game page with received content
            res.render('game' , { 
                jsscript: '/js/student.js', 
                teamData: gameJson[team],   
                rdl,
                team,
                index,
                branch,
                teacher,
                errMsg,
                infoMsg
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


