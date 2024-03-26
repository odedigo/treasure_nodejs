/**
 * --------------------------
 * Treasure Hunt Application
 * --------------------------
 * 
 * @desc User model
 * 
 * Org: Mashar / Kfar-Sava
 * By: Oded Cnaan
 * Date: March 2024
 */
"use strict";
//================ IMPORTS =================
import { Schema, model } from 'mongoose';

let Roles = {
    ADMIN: 'ADMIN',
    TEACHER: 'TEACHER'
}

var UserSchema = new Schema({
    username: String,
    password: String,
    created: Date,
    name: String,
    branch: String,
    token: String,
    role: { // teacher, admin
        type:String,
        required: true,
        default: Roles.TEACHER
    }
});
UserSchema.set('collection', 'user');

// Compile model from schema
const UserModel = model('UserModel', UserSchema);
export {UserModel, Roles}