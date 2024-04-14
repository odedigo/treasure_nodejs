/**
 * --------------------------
 * Treasure Hunt Application
 * --------------------------
 * 
 * @desc Controller for management actions
 * 
 * Org: Mashar / Kfar-Sava
 * By: Oded Cnaan
 * Date: March 2024
 */
"use strict";
//================ IMPORTS =================
import fs from 'fs'
import * as util from "../utils/util.js";
import {Roles} from "../db/models/UserModel.js";

/**
 * Create a new branch or delete an existing one
 * @param {*} req 
 * @param {*} res 
 * @param {*} jwt 
 * @returns 
 */
export async function handleBranch(req, res, jwt) {
    const {action, name, nick} = req.body

    const branches = await util.getBranchesForUser(jwt)
    if (action === 'new') {
        if (!util.isValidValue(name) || !util.isValidValue(nick)) {
            res.status(400).json({msg: "שם או כינוי סניף לא חוקיים"})
            return
        }
        if (branches[nick] === undefined) 
            util.addBranch(nick,name)
        else {
            res.status(400).json({msg: "סניף זה כבר מוגדר"})
            return
        }
        createBranchFolders(nick)
    }
    else if (action === 'del') {
        if (!util.isValidValue(nick)) {
            res.status(400).json({msg: "כינוי הסניף לא חוקי"})
            return
        }
        if (branches[nick] !== undefined)
            util.deleteBranch(nick)
        else {
            res.status(400).json({msg: "כינוי הסניף כבר קיים"})
            return
        }
        deleteBranchFolders(nick)
    }
    res.status(200).json({msg: "הפעולה בוצעה בהצלחה"});
}

/**
 * Gallery upload. Handled by Multer
 * @param {*} req 
 * @param {*} res 
 * @param {*} jwt 
 */
export function handleGallery(req, res, jwt) {
   res.status(200).json({msg: "הפעולה בוצעה בהצלחה"});
}

/**
 * Deletes an image from the riddle gallery
 * @param {*} req 
 * @param {*} res 
 * @param {*} jwt 
 * @returns 
 */
export function handleGalleryDelete(req, res, jwt) {
    const branchCode = req.body.branchCode
    if (jwt.role !== Roles.SUPERADMIN) {
        if (branchCode !== util.branchToCode(jwt.branch)) {
            res.redirect("/err")
            return
        }
    }
    var folder = util.getGalleryFolder(branchCode)
    const {name, action} = req.body
    if (name === 'empty.png') {
        res.status(400).json({msg: "אי אפשר למחוק את התמונה הזאת"});    
        return
    }
    fs.unlinkSync(folder+name)
    res.status(200).json({msg: "הפעולה בוצעה בהצלחה"});
}

/**
 * Not in use!
 * Gets a QR code image from an external API
 * API Documentation: https://goqr.me/api/doc/create-qr-code/
 * 
 * Examples:
 * https://api.qrserver.com/v1/create-qr-code/?data=http%3A%2F%2Flocalhost%3A5500%2Fgen%2F%2Fred%2F1&size=300x300&color=ff0000&qzone=1&format=png
 * https://api.qrserver.com/v1/create-qr-code/?data=http%3A%2F%2Flocalhost%3A5500%2Fgen%2F%2Fred%2F1&size=300x300&color=red&qzone=1&format=png
 * @param {*} url 
 * @param {*} color 
 * @returns 
 */
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

/**
 * Creates a folder for the new branch
 * @param {*} branchCode 
 */
function createBranchFolders(branchCode) {
    const galleyFolder = util.getGalleryFolder(branchCode)
    if (!fs.existsSync(galleyFolder)) {
        fs.mkdirSync(galleyFolder);
    }
    fs.copyFileSync(util.concatFile(util.upFolder(galleyFolder), 'empty.png'),util.concatFile(galleyFolder, 'empty.png'))

    const mapsFolder = util.getMapImagesFolder(branchCode)
    if (!fs.existsSync(mapsFolder)) {
        fs.mkdirSync(mapsFolder);
    }
    fs.copyFileSync(util.concatFile(util.upFolder(mapsFolder), 'empty.png'),util.concatFile(mapsFolder, 'empty.png'))
    
}

function deleteBranchFolders(branchCode) {
    const galleyFolder = util.getGalleryFolder(branchCode)
    fs.rmSync(galleyFolder,{recursive: true, force: true,})
    const mapsFolder = util.getMapImagesFolder(branchCode)
    fs.rmSync(mapsFolder,{recursive: true, force: true,})
}