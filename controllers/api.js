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

export function validateVector(req, res) {
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    // Find relevant document in DB that describes the game
    var {branch,team,index,teacher,vectorSize,vectorAngle} = req.body
    var query = {
        branch, 
        active:true
    }
    if (isValidFormValue(teacher)) {
        query["teacher"] = teacher
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

            if (!isValidFormValue(vectorAngle) || !isValidFormValue(vectorSize)) {
                errMsg = strings.js.formEmpty
                res.status(200).json({result: {errMsg, infoMsg}})
            }
            else {
                [success, errMsg, infoMsg] = checkVector(req.body, gameData[team])
                res.status(200).json({result: {errMsg, infoMsg}})
            }       
        }
        else {
            res.status(500)
        }                                           
    })
    .catch(err => {
        console.log(err)
        res.status(500)
    }) 
}

function isValidFormValue(val) {
    return (val !== undefined && val !== "")
}

/**
 * Validates if the queried vector (size and angle) are correct
 * @param {*} form 
 * @returns boolean
 */
function checkVector(body, teamData) {
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
        success = checkAnswer(vs, va, rdl.vecSize[0], rdl.vecAngle[0], 1) ? 0 : -1
    }
    else {        
        // multiple vectors in this riddle
        for (; i < rdl.vecSize.length; i++) {
            if (checkAnswer(vs,va,  rdl.vecSize[i], rdl.vecAngle[i], i+1)) {
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
 * @param {*} formSize 
 * @param {*} formAngle 
 * @param {*} jsonSize 
 * @param {*} jsonAngle 
 * @param {*} index 
 * @returns boolean
 */
function checkAnswer(formSize, formAngle, jsonSize, jsonAngle, index) {
    var deltaSize = 5
    var deltaAngle = 5
    if(Math.abs(formSize - jsonSize) > deltaSize || Math.abs(formAngle - jsonAngle) > deltaAngle) {
        return false;
    }
    return true
}