/**
 * --------------------------
 * Lesson App
 * --------------------------
 * 
 * @desc Controller for lesson operations
 * 
 * Org: Mashar / Kfar-Sava
 * By: Oded Cnaan
 * Date: March 2024
 */
"use strict";
//================ IMPORTS =================
import {Roles, UserModel} from "../db/models/UserModel.js";
import {LsnGroupModel} from "../db/models/LsnGroupModel.js";
import {LsnFormModel} from "../db/models/LsnFormModel.js"
import strings from "../public/lang/strings.js"
import config from "../config/config.js"
import * as util from "../utils/util.js";

export function saveLessonGroups(req, res, jwt) {
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    var {branch, groups} = req.body
    if (!util.isValidValue(branch) || !util.isValidValue(groups)) {
        return res.status(400).json({msg: strings.err.invalidData})
    }

    var filter = {
        branch
    }       
    const options = { 
        upsert: true,
        returnOriginal: false,
        new: true
    }
    var update = {
        $set: {groups}
    }

    LsnGroupModel.findOneAndUpdate(filter, update,options)
    .then(doc => {
        if(!doc) {
            res.status(400).json({Error: strings.err.actionFailed})
        }
        else
            res.status(200).json({msg: strings.ok.actionOK})
    })
    .catch(err => {
        logger.errorM("catch in statusReport",err)
        res.status(400).json({Error: strings.err.actionFailed})
    })
}

/**
 * Save lesson list per user
 * @param {*} req 
 * @param {*} res 
 * @param {*} jwt 
 * @returns 
 */
export function saveLessonList(req, res, jwt) {
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    var {users} = req.body
    if (!util.isValidValue(users)) {
        return res.status(400).json({msg: strings.err.invalidData})
    }

    var command = []

    for(var i=0; i< users.length; i++) {
        var cmd = { updateOne :
            {
               "filter": {username: users[i].user},
               "update": {"$set": {"lessons": users[i].lessons}}
            }
         }
        command.push(cmd)
    }


    // send query
    UserModel.bulkWrite( command )
    .then(users => {
        res.status(200).json({msg: strings.ok.lsnListSavedOK})
    })
    .catch(err => {
        console.log(err)
        res.status(400).json({msg: strings.err.actionFailed})
    })
}

export async function getLessonGroupList(req, res, jwt, branchCode) {
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    var filter = {branch: branchCode}           
    // send query with pagination
    var groups = await LsnGroupModel.find(filter)
        .sort({ branch:'desc'})
    return {groups, branch:filter["branch"]}
}

export function createLsnGroupList(groups, branchCode) {
    var list = ""    
    if (groups.length === 1) {            
        groups[0].groups.forEach(element => {
            list = `${list}\n${element}`
        });    
    }
    return {branchCode: branchCode,branch: util.codeToBranch(branchCode), groups: list}
}

export function createLsnGroupArray(groups) {
    var list = []   
    if (groups.length === 1) {       
        groups[0].groups.forEach(element => {
            list.push(element)
        });    
    }
    return list
}

export async function getFormList(req, res, jwt, branchCode) {
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    var filter = {branch: branchCode}           
    // send query with pagination
    var forms = await LsnFormModel.find(filter)
        .sort({ branch:'desc'})
    return {forms, branch:filter["branch"]}
}

export function createLsnFormList(forms, branchCode) {
    if (forms == null)
        return {}
    var frms = []
    for (var i=0; i < forms.length; i++) {
        var f = {uid: forms[i].uid, name: forms[i].name, active: forms[i].active, branch: util.codeToBranch(forms[i].branch), date: util.getDateIL(forms[i].date),
                group: forms[i].group, name: forms[i].name, qa: util.getQAFromForm(forms[i].qa) }
        frms.push(f)
    }
    return frms
}

export async function getForm(uid) {
    var filter = {uid}           
    // send query with pagination
    var form = await LsnFormModel.find(filter)
    return form
}

/**
 * Edit a game
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export function editForm(req, res, jwt) {
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    var {uid} = req.body
    var filter = {
        uid
    }       

    // only super-admins can edit games outside their branch
    if (jwt.role !== Roles.SUPERADMIN) {
        filter["branch"] = jwt.branch
    } 

    // send query
    LsnFormModel.findOne(filter)
    .then(form => {
        if (!form) {
            res.status(400).json({msg: strings.err.formNotFound})
            return
        }
        res.status(200).json({path:`/admin/lsn/editform/${encodeURI(uid)}`})
    }) 
    .catch (error => {
        console.log(error)
        res.status(400).json({msg: strings.err.formNotFound})
    })
}
