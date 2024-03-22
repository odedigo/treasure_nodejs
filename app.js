"use strict";
import express from 'express'; //https://expressjs.com/ 
import { engine } from 'express-handlebars'; //engine MUSS engine heissen... https://www.npmjs.com/package/express-handlebars?activeTab=readme 
import pkg from 'body-parser';
const { urlencoded } = pkg;
import http from 'http';
import { connectDB } from './db/db.js';

import routing from './routes/index.js'; 

//Zusätzliche
import { HTTPS } from 'express-sslify'; //https://www.npmjs.com/package/express-sslify 
import { config } from 'dotenv'; //https://www.npmjs.com/package/dotenv
config({ path: './config.env' });

//Start
const app = express();
if (process.env.ENVIROMENT != "local") {
    app.use(HTTPS({ trustProtoHeader: true })); //http nach httpS rewriten
}

//Middlewares
app.use(express.static('./public')); //Statische Inhalte direkt ausliefern. /public/ in den Sites-Pfaden nicht angeben!
app.use(urlencoded({ extended: false })); //Formulardaten parsen

//Handlebars Config
app.engine('.html', engine({ extname: '.html' })); //Achtung .html mit PUNKT
app.set('view engine', '.html');
app.set('views', './views');

//Routing
app.use('/', routing); // routing module with all routes, which in turn points to controllers
/*app.get('*',function (req, res) {
    res.redirect('/err');
});*/

// Status
app.set('db_connected', false); 

//Express-Server
const port = process.env.PORT || 5500;
console.log(process.env.NODE_ENV)

connectDB(function(status) {
    // Start server (listen)
    app.listen(port, () => {
        console.log(`Server running on port ${port}.`);
    });
    app.set('db_connected', status);  // mark connected or not
});

