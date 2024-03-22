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



