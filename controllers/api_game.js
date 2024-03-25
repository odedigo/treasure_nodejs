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
import strings from "../public/lang/strings.js"
import * as util from "../utils/util.js";
import * as func from "../utils/func.js"

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
 * Reset the game
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function resetGame(req, res) {
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
export function startGame(req, res) {
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
export async function createGame(req, res) {
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
export async function deleteGame(req, res) {
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
    var filter = {
        gameName
    }       

    const options = {         
    };

    // send query
    await StatusModel.deleteMany(
        filter, 
        options
    )
    .then(doc => {
        if(!doc) {
            logger.error("Failed to update team statusReport")
        }
    })
    .catch(err => {
        logger.errorM("catch in statusReport",err)
    })
    res.status(200)
}
