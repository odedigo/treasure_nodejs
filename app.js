/**
 * --------------------------
 * Treasure Hunt Application
 * --------------------------
 * 
 * @desc Main NodeJS application 
 * 
 * Org: Mashar / Kfar-Sava
 * By: Oded Cnaan
 * Date: March 2024
 */
"use strict";
//================ IMPORTS =================
import express from 'express'; 
import { engine } from 'express-handlebars'; 
import * as hbs_helpers from './public/js/helpers.js'
//import http from 'http';
import { connectDB } from './db/db.js';
import routing from './routes/index.js'; 
import __dirname from 'fs'

//Additional
import { HTTPS } from 'express-sslify'; 
import { config } from 'dotenv'; 
import bodyParser from 'body-parser';
import {loadBranchesFromDB} from "./utils/util.js";

config({ path: './config.env' });

//Start
const app = express();
if (process.env.ENVIROMENT != "local") {
    app.use(HTTPS({ trustProtoHeader: true })); 
}

//Middlewares
app.use(express.static('./public')); //Deliver static content directly. Do not specify /public/ in the sites paths!
app.use('/fa', express.static(__dirname + '/node_modules/font-awesome/css'));
app.use('/fonts', express.static(__dirname + '/node_modules/font-awesome/fonts'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Handlebars Config
app.engine('.html', engine({ 
    extname: '.html',
    helpers: hbs_helpers, // these are the delper functions for generating the page content
})); 

app.set('view engine', '.html');
app.set('views', './views');

//Routing
app.use('/', routing); // routing module with all routes, which in turn points to controllers

// DB Status
app.set('db_connected', false); 

//Express-Server
const port = process.env.PORT || 3030;

connectDB(function(status) {
    // Start server (listen)
    app.listen(port, () => {
        console.log(`Server running on port ${port}.`);
    });
    app.set('db_connected', status);  // mark connected or not
    loadBranchesFromDB()
});

