"use strict";
import config from "../config/config.js";
import {GameModel} from "../db/models/GameModel.js";
import {StatusModel} from "../db/models/StatusModel.js";
import * as util from "../utils/util.js";
import strings from "../public/lang/strings.js"

export async function renderTeacher (req, res) {
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    // Find relevant document in DB that describes the game
    var {gameName, branchCode} = req.params

    var query = {
        gameName, 
        branch: branchCode,
        active:true
    }
    
    var gameStatus = await _calcGameStatus(gameName)

    // Async Query
    GameModel.findOne(query)
    .then (gameData =>  {
        if (gameData) {            
            // All good
            var gameJson = JSON.parse(JSON.stringify(gameData))                           

            // render teacher page with received content
            res.render('teacher' , { 
                jsscript: ['/js/teacher.js'], 
                gameData,
                gameName,
                gameStatus,
                branchCode: gameData.branch,
                branch: util.codeToBranch(gameData.branch),
                date: util.getDateIL(gameData.date),
                readableName: gameData.readableName,
                uid: gameData.uid,
                title: strings.title.teacherArea,
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

async function _getGameStatus(gameCode, branchCode) {
    var info = {
        active: false,
        startTime: "",
        red: [],
        blue: [],
        green :[]
    }
    // check if DB properly connected
    if (!util.isValidValue(gameCode)) {
        return info
    }

    var filter = {
        gameCode
    }       

    const status = await StatusModel.find(filter)
    if (status.length !== 1)
        return info

    return {
        active: status[0].active,
        startTime: util.getDateIL(status[0].startTime),
        red: status[0].red,
        blue: status[0].blue,
        green: status[0].green
    }
}

async function _calcGameStatus(gameCode, branchCode) {
    const status = await _getGameStatus(gameCode,branchCode)
    if (!status.active) {
        return {started: false}
    }
    return {
        started: true,
        startTime: status.startTime,
        red: await _calcTeamStatus(status.red),
        blue: await _calcTeamStatus(status.blue),
        green: await _calcTeamStatus(status.green)
    }
}

async function _calcTeamStatus(team) {
    var teamInfo = {
        stage: 1,
        success: false,
        numTries: 0
    }

    if (team.length == 0)
        return teamInfo

    teamInfo.stage = team[team.length-1].stage
    for (var i=team.length-1; i >=0 ;i--) {
        if (team[i].stage < teamInfo.stage)
            break
        if (team[i].success) {
            teamInfo.success = true            
        }
        teamInfo.numTries++
    }  
    return teamInfo
}