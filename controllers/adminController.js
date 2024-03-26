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
import * as api_user from '../controllers/api_user.js';

/**
 * Main rendering function
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export async function renderAdmin(req, res, partial, jwtUser) {
    
    // check if DB properly connected
    if(!req.app.get("db_connected")) {
        return res.status(500);
    }

    if (partial === undefined) {
        partial = 'admin_main'
    }

    var data = { 
        jsscript: '/js/admin.js',
        jwtUser,
        section: partial,
        data: {},
        helpers: {
            whichPartial: function() {
                return partial
            }
        }
    }

    if (partial === 'userlist') {
        renderAdminUserlist(req, res, data)
        return
    }

    // main_admin
    res.render('admin' , data);

}

export async function renderAdminUserlist(req, res, data) {
    var extra = {}
    const users = await api_user.getUserList()
    if (users) {
        data.data = api_user.createUserList(users)
    }
    // main_admin
    res.render('admin' , data);
}


