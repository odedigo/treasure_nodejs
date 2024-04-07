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
import fs from 'fs'
import * as util from "../utils/util.js";

export function handleBranch(req, res, jwt) {
    const {action, name, nick} = req.body

    const branches = JSON.parse(fs.readFileSync('./config/branches.json'))
    if (action === 'new') {
        if (!util.isValidValue(name) || !util.isValidValue(nick)) {
            res.status(400).json({msg: "שם או כינוי סניף לא חוקיים"})
            return
        }
        if (branches.branches[nick] === undefined)
            branches.branches[nick] = name
        else {
            res.status(400).json({msg: "סניף זה כבר מוגדר"})
            return
        }
    }
    else if (action === 'del') {
        if (!util.isValidValue(nick)) {
            res.status(400).json({msg: "כינוי הסניף לא חוקי"})
            return
        }
        if (branches.branches[nick] !== undefined)
            delete branches.branches[nick] 
        else {
            res.status(400).json({msg: "כינוי הסניף כבר קיים"})
            return
        }
    }
    fs.writeFileSync('./config/branches.json',JSON.stringify(branches))
    res.status(200).json({msg: "הפעולה בוצעה בהצלחה"});
}