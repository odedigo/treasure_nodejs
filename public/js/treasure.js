/**
 * treasure.js
 * 
 * This file includes functions that handle the game's logic
 * 
 * Written by: Oded Cnaan
 * Date: March 2024
 */

// Globals
let riddles = {}
let strings = {}
let team = ""
let rindex = ""
let debugMode = false 
let deltaAngle = 5;
let deltaSize = 5;
let vectorJson = "vectors_rasha.json"

/**
 * Prints data only if in debug mode
 * @param {*} msg 
 */
function debugLog(msg) {
    if (debugMode) 
        for (var i=0; i<arguments.length; i++) console.log(arguments[i]);
}

 
/**
 * gets a param from the URL
 * @param {*} param 
 * @returns string
 */
function getParameterValues(param) {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0] == param) {
            return urlparam[1];
        }
    }
}

/**
 * Checks if the URL params are valid
 * @param {*} team 
 * @param {*} index 
 * @returns boolean
 */
function isValidParams(team,index) {
    if (team != "blue" && team != "green" && team != "red")
        return false;
    if (index <= 0 || index > 5)
        return false;
    return true
}

/**
 * Loads the riddles' json
 */
function loadRiddles(callbk) {
    fetch("https://odedigo.github.io/treasurehunt/assets/data/"+vectorJson)
    .then((response) => response.json())
    .then((json) => {
        riddles = json
        callbk()        
    })
    .catch(err => {
        console.log("TREASURE: Could not load data JSON")
        console.log(err)
    }); 
}

/**
 * Loads the riddles' json
 */
function loadStrings() {
    fetch("https://odedigo.github.io/treasurehunt/assets/lang/he.json")
    .then((response) => response.json())
    .then((json) => {
        strings = json
    })
    .catch(function() {
        console.log("TREASURE: Could not load strings")
    }); 
}



