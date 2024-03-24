/**
 * --------------------------
 * Treasure Hunt Application
 * --------------------------
 * 
 * @desc Game model
 * 
 * Org: Mashar / Kfar-Sava
 * By: Oded Cnaan
 * Date: March 2024
 */
"use strict";
//================ IMPORTS =================

import { Schema , model } from 'mongoose';


var RiddleSchema = new Schema({
    index: Number,
    img: String,
    vecSize: [Number],
    vecAngle: [Number],
    riddle: [String]
});

var TeamSchema = new Schema({
    team: String,
    color: String,
    bgColor: String,
    riddles: [RiddleSchema]
});

var GameSchema = new Schema({
    version: String,
    date: String,
    active: Boolean,
    branch: String,
    teacher: String,
    blue: TeamSchema,
    green: TeamSchema,
    red: TeamSchema
});
GameSchema.set('collection', 'treasure');

// Compile model from schema
const GameModel = model('gameModel', GameSchema );
export {GameModel}