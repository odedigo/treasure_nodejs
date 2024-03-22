"use strict";
import {GameModel} from "../db/models/GameModel.js";
import * as logger from "../utils/logger.js"

export function renderGame(req, res, next) {
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    var {branch,team,index,teacher} = req.params
    var query = {
        branch, 
        active:true
    }
    if (teacher !== undefined) {
        query["teacher"] = teacher
    }
    
    logger.debugM("Get game data query:", query)

    GameModel.findOne(query)
    .then (gameData => {
        if (gameData) {
            var gameJson = JSON.parse(JSON.stringify(gameData))
                          
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
            return res.status(400)
        }
    })
    .catch(err => {
        console.log(err)
        return res.status(400)
    })


    
}

