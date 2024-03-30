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
import {StatusModel} from "../db/models/StatusModel.js"
import {Roles} from "../db/models/UserModel.js";
import strings from "../public/lang/strings.js"
import config from "../config/config.js"
import * as util from "../utils/util.js";
import * as func from "../utils/func.js"
import { Types } from 'mongoose';
/**
 * Checks if the result vector is valid or not
 * Called by the student's form
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function validateVector(req, res) {
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    // Find relevant document in DB that describes the game
    var {gameName,team,vectorSize,vectorAngle} = req.body
    if (!util.isValidValue(vectorAngle) || !util.isValidValue(vectorSize)) {
        errMsg = strings.js.formEmpty
        res.status(200).json({result: {errMsg, infoMsg:""}})
        return
    }
    
    var query = {
        gameName, 
        active:true
    }
    
    // Async Query
    GameModel.findOne(query)
    .then (gameData => {
        if (gameData) {
            // All good
            var gameJson = JSON.parse(JSON.stringify(gameData))
            var errMsg = ''
            var infoMsg = ''
            var success = -1

            var [success, errMsg, infoMsg] = func._checkVector(req.body, gameJson[team])
            if (success > -1)
                func._reportStatus({success: true, status:"Correct vector", index: req.body.index},team,req.body)
            else
            func._reportStatus({success: false, status:"Bad vector", index: req.body.index},team,req.body)
                
            res.status(200).json({result: {errMsg, infoMsg}})
        }
        else {
            res.status(500).json({result: {errMsg: "Failed to retrieve game data", infoMsg:""}})
        }                                           
    })
    .catch(err => {
        console.log(err)
        res.status(500)
    }) 
}

/**
 * get game list
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export async function getGameList(req, res, jwt) {
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    var {branch, gameName} = req.body
    var filter = {
    }       

    if (jwt.role === Roles.TEACHER || jwt.role === Roles.ADMIN) {
        if (util.isValidValue(branch) && branch !== jwt.branch) {
            res.status(400).json({msg: "פעולה לא חוקית"})
            return 
        }
    }
    else { // super admins can search for other branches
        if (util.isValidValue(branch))
            filter[branch] = branch
    } 

    if (util.isValidValue(gameName))
        filter[gameName] = gameName

    // send query
    const games = await GameModel.find(filter)
    return games
}

/**
 * Clones a game
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function cloneGame(req, res, jwt) {
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    var {origGame, newGame} = req.body
    var filter = {
        gameName: origGame
    }       

    if (jwt.role !== Roles.SUPERADMIN) {
        filter[branch] = jwt.branch
    } 

    // send query
    GameModel.find(filter)
    .then(game => {
        if (!game || game.length != 1) {
            res.status(400).json({msg: "המשחק לא נמצא"})
            return
        }
        game[0].gameName = newGame
        game[0].version = "1.0"
        game[0].active = false
        game[0]._id = new Types.ObjectId();
        game[0].date = util.getCurrentDateTime()
        
        game[0].isNew = true
        delete game[0]._id
        var theGame = new GameModel(game[0])
        theGame.save()
        .then (ngame => {
            if (ngame)
                res.status(200).json({msg: "המשחק שוכפל בהצלחה", game: ngame})
            else
                res.status(400).json({msg: "המשחק לא שוכפל"})
        }) 
        .catch (error => {
            console.log(error)
            res.status(400).json({msg: "המשחק לא נמצא"})
        })
    })
    .catch(err => {
        console.log(err)
        res.status(400).json({msg: "המשחק לא נמצא"})
    })
}

/**
 * Reset the game
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function resetGame(req, res, jwt) {
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    var {gameName} = req.body
    if (!util.isValidValue(gameName)) {
        res.status(200).json({result: {sucess:false, msg: "חסרים נתונים"}})
        return
    }

    var filter = {
        gameName
    }       

    var now = util.getCurrentDateTime()
    var update = {
        $set: {"stage": 0, startTime: 0, "events": []}
    }

    const options = { 
        upsert: true,
        returnOriginal: false
    };

    // send query
    StatusModel.findOneAndUpdate(
        filter, 
        update,
        options
    )
    .then(doc => {
        if(!doc) {
            logger.error("Failed to update team statusReport")
            res.status(500).json({Error: "[1] Failed to update statusReport"})
        }
        else   
            res.status(200)
    })
    .catch(err => {
        logger.errorM("catch in statusReport",err)
        res.status(500).json({Error: "[2] Failed to update statusReport"})
    })
}

/**
 * Start a new game
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function startGame(req, res, jwt) {
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    var {gameName} = req.body
    if (!util.isValidValue(gameName)) {
        res.status(200).json({result: {sucess:false, msg: "חסרים נתונים"}})
        return
    }

    var filter = {
        gameName
    }       

    var now = util.getCurrentDateTime()
    var update = {
        $set: {"stage": 0, startTime: util.getCurrentDateTime(), "events": []}
    }

    const options = { 
        upsert: true,
        returnOriginal: false
    };

    // send query
    StatusModel.updateMany(
        filter, 
        update,
        options
    )
    .then(doc => {
        if(!doc) {
            logger.error("Failed to update team statusReport")
            res.status(500).json({Error: "[1] Failed to update statusReport"})
        }
        else
            res.status(200)
    })
    .catch(err => {
        logger.errorM("catch in statusReport",err)
        res.status(500).json({Error: "[2] Failed to update statusReport"})
    })
}

/**
 * Creates a new game
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export async function createGame(req, res, jwt) {
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    var {gameName} = req.body
    if (!util.isValidValue(gameName)) {
        res.status(200).json({result: {sucess:false, msg: "חסרים נתונים"}})
        return
    }  

    gameName = 'oded'
    await func._createTeamDoc(gameName, 'red')
    await func._createTeamDoc(gameName, 'green')
    await func._createTeamDoc(gameName, 'blue')

    res.status(200)
}

/**
 * Creates a new game
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export async function deleteGame(req, res, jwt) {
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    var {gameName} = req.body
    if (!util.isValidValue(gameName)) {
        res.status(200).json({result: {sucess:false, msg: "חסרים נתונים"}})
        return
    }  

    var filter = {
        gameName,
        branch: util.branchToCode(jwt.branch)
    }       

    const options = {         
    };

    // send query
    await GameModel.deleteOne(
        filter, 
        options
    )
    .then(doc => {
        if(!doc) {         
            res.status(400).json({msg: "מחיקת המשחק נכשלה"})   
        }
        else {
            res.status(200).json({msg: "מחיקת המשחק הצליחה"})
        }
    })
    .catch(err => {
        res.status(400).json({msg: "מחיקת המשחק נכשלה"})   
    })
}

export function createGameList(games) {
    var res = []
    games.forEach(game => {
        var branch = util.codeToBranch(game.branch)
        var active = game.active ? "כן" : "לא"
        res.push({gameName:game.gameName, branch , date: game.date, version:game.version, active})
    });
    return res;
}
