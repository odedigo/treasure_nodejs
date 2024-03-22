/**
 * Status Model
 * 
 * By: Oded Cnaan
 * March 2024
 */

'use strict';

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