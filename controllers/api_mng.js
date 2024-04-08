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
        if (branches[nick] === undefined)
            branches[nick] = {name}
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
        if (branches[nick] !== undefined)
            delete branches[nick] 
        else {
            res.status(400).json({msg: "כינוי הסניף כבר קיים"})
            return
        }
    }
    fs.writeFileSync('./config/branches.json',JSON.stringify(branches))
    res.status(200).json({msg: "הפעולה בוצעה בהצלחה"});
}

export function handleGallery(req, res, jwt) {
   res.status(200).json({msg: "הפעולה בוצעה בהצלחה"});
}

export function handleGalleryDelete(req, res, jwt) {
    var folder = util.getMapGalleryFolder()
    const {name, action} = req.body
    if (name === 'empty.png') {
        res.status(400).json({msg: "אי אפשר למחוק את התמונה הזאת"});    
        return
    }
    fs.unlinkSync(folder+name)
    res.status(200).json({msg: "הפעולה בוצעה בהצלחה"});
}