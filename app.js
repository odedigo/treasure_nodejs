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
import express from 'express'; //https://expressjs.com/ 
import { engine } from 'express-handlebars'; //engine MUST be called engine... https://www.npmjs.com/package/express-handlebars?activeTab=readme 
import * as hbs_helpers from './public/js/helpers.js'
//import http from 'http';
import { connectDB } from './db/db.js';
import routing from './routes/index.js'; 
import __dirname from 'fs'

//Additional
import { HTTPS } from 'express-sslify'; //https://www.npmjs.com/package/express-sslify 
import { config } from 'dotenv'; //https://www.npmjs.com/package/dotenv
import bodyParser from 'body-parser';

config({ path: './config.env' });

//Start
const app = express();
if (process.env.ENVIROMENT != "local") {
    app.use(HTTPS({ trustProtoHeader: true })); //http nach httpS rewriten
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
});

