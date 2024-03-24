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

const StatusEvent = new Schema({
    created: String,
    stage: Number,
    status: String,
    success: Boolean
}, { _id : false })

var StatusSchema = new Schema({
    gameName: String,
    team: String,
    startTime: String,
    stage: Number,
    events: [StatusEvent]
});
StatusSchema.set('collection', 'status');

// Compile model from schema
const StatusModel = model('StatusModel', StatusSchema);
export {StatusModel}