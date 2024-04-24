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
    data.data = api_lesson.createLsnGroupList(groups, branch)
    res.render('admin' , data);
}