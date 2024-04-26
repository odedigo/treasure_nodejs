/**
 * --------------------------
 * Lesson Application
 * --------------------------
 * 
 * @desc Controller for the admin section for lessons
 * 
 * Org: Mashar / Kfar-Sava
 * By: Oded Cnaan
 * Date: March 2024
 */
"use strict";
//================ IMPORTS =================
import * as api_lesson from '../controllers/api_lesson.js';
import * as api_game from '../controllers/api_game.js';
import * as api_user from '../controllers/api_user.js';
import * as util from "../utils/util.js";
import { Roles } from '../db/models/UserModel.js';
import config from "../config/config.js"
import strings from "../public/lang/strings.js"

/**************** Lessons *********************/

/**
 * Lesson list
 * @param {*} req 
 * @param {*} res 
 * @param {*} jwtUser 
 * @param {*} data 
 * @returns 
 */
export async function renderAdminLessonlist(req, res, jwtUser, data) {
    var branchCode = req.params.param
    if (!util.isValidValue(branchCode)) {
        res.redirect("/err")
        return
    }
    // SUPER-ADMIN can see all images.
    // Others can view only from their branch so we redirect
    // them to their section
    if (jwtUser.role !== Roles.SUPERADMIN) {
        if (branchCode != jwtUser.branch) {
            res.redirect("/admin/lsn/lsnlist/"+jwtUser.branch)
            return
        }
    }

    const {users, numUsers} = await api_user.getUserList(1, jwtUser, config.app.lessonLisrPerPage, branchCode)
    data.data = {}
    data.data.users = api_user.createUserList(users)
    const {groups, branch} = await api_lesson.getLessonGroupList(req, res,jwtUser, branchCode)
    data.data.groups = api_lesson.createLsnGroupArray(groups)
    data.data.branch = req.params.param
    data.jsscript.push('/js/gvalid.js')
    // pagination
    data.numUsers = numUsers
    data.numPerPage = config.app.userListPerPage
    if (!util.isValidValue(req.params.param))
        data.page = 1
    else
        data.page = req.params.param    
    res.render('admin' , data);
}

/**
 * Group list
 * @param {*} req 
 * @param {*} res 
 * @param {*} jwtUser 
 * @param {*} data 
 * @returns 
 */
export async function renderLessonGroupList(req, res, jwtUser, data) {
    var branchCode = req.params.param
    if (!util.isValidValue(branchCode)) {
        res.redirect("/err")
        return
    }
    // SUPER-ADMIN can see all images.
    // Others can view only from their branch so we redirect
    // them to their section
    if (jwtUser.role !== Roles.SUPERADMIN) {
        if (branchCode != jwtUser.branch) {
            res.redirect("/admin/lsn/grplist/"+jwtUser.branch)
            return
        }
    }
    const {groups, branch} = await api_lesson.getLessonGroupList(req, res, jwtUser, branchCode)
    data.branch = branch
    data.branchName = util.codeToBranch(branch)
    data.groups = api_lesson.createLsnGroupArray(groups, branch)
    data.jsscript.push('/js/gvalid.js')
    res.render('admin' , data);
}

/**
 * Form list
 * @param {*} req 
 * @param {*} res 
 * @param {*} jwtUser 
 * @param {*} data 
 * @returns 
 */
export async function renderAdminFormlist(req, res, jwtUser, data) {
    var branchCode = req.params.param
    if (!util.isValidValue(branchCode)) {
        res.redirect("/err")
        return
    }
    // SUPER-ADMIN can see all images.
    // Others can view only from their branch so we redirect
    // them to their section
    if (jwtUser.role !== Roles.SUPERADMIN) {
        if (branchCode != jwtUser.branch) {
            res.redirect("/admin/lsn/grplist/"+jwtUser.branch)
            return
        }
    }
    const {forms, group, branch} = await api_lesson.getFormList(req, res, jwtUser, branchCode)
    data.branch = branch
    data.data = api_lesson.createLsnFormList(forms, group)
    data.qr = {imgSize:"200x200", color: "black"}
    data.rootEncoded = encodeURIComponent (`${req.protocol}://${req.get('host')}`)
    data.root = `${req.protocol}://${req.get('host')}`
    data.url = req.url

    res.render('admin' , data);
}

/**
 * Edit form
 * @param {*} req 
 * @param {*} res 
 * @param {*} jwtUser 
 * @param {*} data 
 * @returns 
 */
export async function renderAdminEditForm(req, res, jwtUser, data) {
    var uid = req.params.param
    if (!util.isValidValue(uid)) {
        return res.status(400).json({msg: strings.err.invalidData})
    }
    
    var branch = ""
    // new form
    if (uid === "-1") {
        branch = req.query.branch
        data.form = api_lesson.createEmptyForm(branch)
    }
    else {
        const theForm = await api_lesson.getForm(uid)    
        var form = api_lesson.createLsnFormList(theForm)
        if (form.length !== 1) {
            return res.status(400).json({msg: strings.err.invalidData})
        }
        data.form = form[0]
        branch = data.form.branchCode
    }
    var groups = await api_lesson.getLessonGroupList(req, res, jwtUser, branch)
    groups = api_lesson.createLsnGroupArray(groups.groups, groups.branch)
    if (util.isValidValue(groups)) {
        data.groups = groups
    }
    else
        data.groups = []
    
    data.jsscript.push('/js/gvalid.js')
    res.render('admin' , data);
}