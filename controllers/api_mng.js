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

    const branches = util.getBranchesForUser(jwt)
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

//https://api.qrserver.com/v1/create-qr-code/?data=http%3A%2F%2Flocalhost%3A5500%2Fgen%2F%2Fred%2F1&size=300x300&color=ff0000&qzone=1&format=png
//https://api.qrserver.com/v1/create-qr-code/?data=http%3A%2F%2Flocalhost%3A5500%2Fgen%2F%2Fred%2F1&size=300x300&color=red&qzone=1&format=png
// https://goqr.me/api/doc/create-qr-code/
//    api_mng.getQRcode("http://localhost:5500/game//blue/1",'blue')

export async function getQRcode(url, color) {
    var uri = encodeURI(url)
    var c = "94c4ff" // blue
    if (color == 'red')
        c = "ff8f9a"
    else if (color == 'green')   
        c = "96dd89" 
                
    var apiQR = `https://api.qrserver.com/v1/create-qr-code/?data=${uri}&size=300x300&color=${c}&qzone=1&format=png`  
    const response = await fetch(apiQR, {
        method: "GET", 
        cache: "no-cache", 
        referrerPolicy: "no-referrer"
      })
    
    const image = await response.blob()
    const imgSrc = URL.createObjectURL(image)
    return imgSrc
}