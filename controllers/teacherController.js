"use strict";
import {GameModel} from "../db/models/GameModel.js";
import * as logger from "../utils/logger.js"
import * as util from "../utils/util.js";

export function renderTeacher (req, res) {
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    // Find relevant document in DB that describes the game
    var {gameName} = req.params

    var query = {
        gameName, 
        active:true
    }
    
    logger.debugM("Get game data query:", query)

    // Async Query
    GameModel.findOne(query)
    .then (gameData => {
        if (gameData) {            
            // All good
            var gameJson = JSON.parse(JSON.stringify(gameData))
                                  
            // render teacher page with received content
            res.render('teacher' , { 
                jsscript: ['/js/teacher.js'], 
                gameData,
                gameName,
                branch: util.codeToBranch(gameData.branch),
                date: new Date(gameData.date).toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }),
                readableName: gameData.readableName,
                uid: gameData.uid
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
