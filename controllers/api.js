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
import strings from "../public/lang/strings.js"
import * as util from "../utils/util.js";
import { StatusModel } from "../db/models/StatusModel.js";
import config from "../config/config.js"

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

    deleteGame(req, res) 
    return

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

            var [success, errMsg, infoMsg] = _checkVector(req.body, gameJson[team])
            if (success > -1)
                _reportStatus({success: true, status:"Correct vector", index: req.body.index},team,req.body)
            else
                _reportStatus({success: false, status:"Bad vector", index: req.body.index},team,req.body)
                
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
    await _createTeamDoc(gameName, 'red')
    await _createTeamDoc(gameName, 'green')
    await _createTeamDoc(gameName, 'blue')

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

/***********************INTERNAL FUNCTIONS********************************/

/**
 * Validates if the queried vector (size and angle) are correct
 * Internal function
 * @param {*} form 
 * @returns boolean
 */
function _checkVector(body, teamData) {
    var errMsg = ''
    var infoMsg = ''

    // form data
    var vs = body.vectorSize
    var va = body.vectorAngle

    // filter the riddle in the given index
    const rdl = teamData.riddles.filter((rdl) => (rdl.index == body.index) )[0]
    var i = 0

    var success = -1; // may be -1 (error), 0 (success of a single vector) or 1-5 (success of multiple vectors)
    if (rdl.vecSize.length == 1) {
        // single vector 
        success = _checkAnswer(vs, va, rdl.vecSize[0], rdl.vecAngle[0]) ? 0 : -1
    }
    else {        
        // multiple vectors in this riddle
        for (; i < rdl.vecSize.length; i++) {
            if (_checkAnswer(vs,va,  rdl.vecSize[i], rdl.vecAngle[i])) {
                success = i+1 // mark the index of this vector in the array
            }
        }
    }

    // Add message on the page    
    if (success == -1) {
        infoMsg = strings.js.badVector
    }
    else {
        var num = 0
        infoMsg = strings.js.goodVector
        if (success > 0) {
            num = success-1
            infoMsg += `<p>שימו לב שזהו הוקטור ה ${success} ברשימה מתוך ${rdl.vecSize.length}</p>`
        }
        infoMsg += `<p class='vector' style='color:${teamData.color}'> (${rdl.vecSize[num]},${rdl.vecAngle[num]}°)</p>` 
    }
    return [success, errMsg, infoMsg];
}
 
/**
 * Checks if the angle and size in the form match those in the json for this riddle
 * Intenal function
 * 
 * @param {*} formSize 
 * @param {*} formAngle 
 * @param {*} jsonSize 
 * @param {*} jsonAngle 
 * @param {*} index 
 * @returns boolean
 */
function _checkAnswer(formSize, formAngle, jsonSize, jsonAngle) {
    var deltaSize = 5
    var deltaAngle = 5
    if(Math.abs(formSize - jsonSize) > deltaSize || Math.abs(formAngle - jsonAngle) > deltaAngle) {
        return false;
    }
    return true
}

/**
 * Report the status of the last vector check
 * @param {*} data 
 * @param {*} team 
 * @param {*} body 
 * @returns 
 */
function _reportStatus( data, team, body) {
    if (!config.config.app.report_status)
        return

    var {gameName,index} = body

    if (!util.isValidValue(gameName) || !util.isValidValue(index)) {
        logger.error("Invalid data (branch or index) in _reportStatus")
        return;
    }

    var filter = {
        team,
        gameName
    }       

    var update = {
        $push: {"events": {success:data.success, status:data.status, "stage": index,"created": util.getCurrentDateTime()}}
    }
    if (data.suucess) {
        update["$set"] = {stage: index}
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
        }
    })
    .catch(err => {
        logger.errorM("catch in statusReport",err)
    })
}

/**
 * 
 * @param {*} teamName 
 * @param {*} team 
 */
async function _createTeamDoc(gameName, team) {
    var filter = {
        gameName,
        team
    }       

    var update = {
        $setOnInsert: {"gameName": gameName, "team": team, "stage": 0, startTime: 0, "events": []}
    }

    const options = { 
        upsert: true,
        returnOriginal: false
    };

    // send query
    await StatusModel.updateMany(
        filter, 
        update,
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
}
