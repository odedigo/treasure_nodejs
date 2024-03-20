"use strict";
const express = require('express'); //https://expressjs.com/ 
const { engine } = require('express-handlebars'); //engine MUSS engine heissen... https://www.npmjs.com/package/express-handlebars?activeTab=readme 
var bodyParser = require('body-parser'); //Formulardaten parsen https://www.npmjs.com/package/body-parser 
var http = require('http');

const routing = require('./routes/index'); //Eigenes Routing-Modul. .js muss nicht angegeben werden

//Zusätzliche
var enforce = require('express-sslify'); //https://www.npmjs.com/package/express-sslify 
const dotenv = require('dotenv'); //https://www.npmjs.com/package/dotenv
dotenv.config({ path: './config.env' });

//Start
const app = express();
if (process.env.ENVIROMENT != "local") {
    app.use(enforce.HTTPS({ trustProtoHeader: true })); //http nach httpS rewriten
}

//Middlewares
app.use(express.static('./public')); //Statische Inhalte direkt ausliefern. /public/ in den Sites-Pfaden nicht angeben!
app.use(bodyParser.urlencoded({ extended: false })); //Formulardaten parsen

//Handlebars Config
app.engine('.html', engine({ extname: '.html' })); //Achtung .html mit PUNKT
app.set('view engine', '.html');
app.set('views', './views');

//Routing
app.use('/', routing); //Eigenes Routing-Modul mit allen Routes, das wiederum auf Controllers verweist

//Express-Server
const port = process.env.PORT || 5500;
app.listen(port, () => {
    console.log(`server is runing at port ${port}`)
});

