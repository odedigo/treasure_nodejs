/**
 * --------------------------
 * Treasure Hunt Application
 * --------------------------
 * 
 * @desc Controller for Login
 * 
 * Org: Mashar / Kfar-Sava
 * By: Oded Cnaan
 * Date: March 2024
 */
"use strict";
//================ IMPORTS =================
import {UserModel} from "../db/models/UserModel.js";
import * as logger from "../utils/logger.js"
import * as util from "../utils/util.js";
import strings from "../public/lang/strings.js"
import bcrypt from "bcrypt"

/**
 * Main rendering function
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export function renderLogin(req, res, obj) {
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    res.render('login' , { 
        jsscript: '/js/admin.js'
    });
}




