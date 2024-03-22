/**
 * --------------------------
 * Treasure Hunt Application
 * --------------------------
 * 
 * @desc Status model
 * 
 * Org: Mashar / Kfar-Sava
 * By: Oded Cnaan
 * Date: March 2024
 */
"use strict";
//================ IMPORTS =================
import { Schema, model } from 'mongoose';

const TeamStatus = new Schema({
    branch: String,
    teacher: String,    
    status: Number,
    startTime: Date
})

var StatusSchema = new Schema({
    team: {
        type: String,
        required: true
    },
    game: [TeamStatus]
});
StatusSchema.set('collection', 'status');

// Compile model from schema
const StatusModel = model('StatusModel', StatusSchema);
export {StatusModel}