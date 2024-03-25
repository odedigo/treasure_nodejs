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
import bcrypt from "bcrypt"

/**
 * Main rendering function
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export function renderAdmin(req, res, partial) {
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    if (partial === undefined) {
        partial = 'admin_main'
    }

    res.render('admin' , { 
        jsscript: '/js/admin.js',
        helpers: {
            whichPartial: function() {
                return partial
            }
        }
    });

}


