/**
 * --------------------------
 * Mashar Lesson Application
 * --------------------------
 * 
 * @desc Lesson Group model
 * 
 * Org: Mashar / Kfar-Sava
 * By: Oded Cnaan
 * Date: March 2024
 */
"use strict";
//================ IMPORTS =================
import { Schema, model } from 'mongoose';

var LsnGroupSchema = new Schema({
    branch: String,
    groups: [String]
});
LsnGroupSchema.set('collection', 'lesson_groups');

// Compile model from schema
const LsnGroupModel = model('LsnGroupModel', LsnGroupSchema);
export {LsnGroupModel}