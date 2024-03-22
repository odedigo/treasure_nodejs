/**
 * teacher.js
 * 
 * This file includes functions that display the student's view
 * 
 * Written by: Oded Cnaan
 * Date: March 2024
 */

/**
 * Event handler - page loaded
 */
window.addEventListener('load', () => {
    //populateData(); // Load the riddle data from Json file
    loadStrings();

    // Register for form submission events (checking vector correctness)
    let el = findElement("checkForm")
    el.addEventListener("submit", function(e){
        checkVector(this)
        e.preventDefault();    //stop form from submitting
    });    
});

/**
 * Validates if the queried vector (size and angle) are correct
 * @param {*} form 
 * @returns boolean
 */
function checkVector(form) {
    clearMsgs();
    //var data = riddles[team];
    let data = getTeamData();

    // form data
    var vs = form.vectorSize.value
    var va = form.vectorAngle.value

    // Form fields cannot be empty
    if (vs === "" || va === "") {
        var el = findElement("errorMsg")
        el.innerHTML = strings.js.formEmpty
        el = findElement("instructions")
        el.innerHTML = ""
        return false;
    }

    // filter the riddle in the given index
    const rdl = data.riddles.filter((rdl) => (rdl.index == rindex) )[0]
    var i = 0

    var success = -1; // may be -1 (error), 0 (success of a single vector) or 1-5 (success of multiple vectors)
    if (rdl.vecSize.length == 1) {
        // single vector 
        success = checkAnswer(vs, va, rdl.vecSize[0], rdl.vecAngle[0], 1) ? 0 : -1
    }
    else {        
        // multiple vectors in this riddle
        for (; i < rdl.vecSize.length; i++) {
            if (checkAnswer(vs,va,  rdl.vecSize[i], rdl.vecAngle[i], i+1)) {
                success = i+1 // mark the index of this vector in the array
            }
        }
    }

    // Add message on the page
    el = findElement("instructions")
    if (success == -1) {
        el.innerHTML = strings.js.badVector
    }
    else {
        var num = 0
        el.innerHTML = strings.js.goodVector
        if (success > 0) {
            num = success-1
            el.innerHTML += `<p>שימו לב שזהו הוקטור ה ${success} ברשימה מתוך ${rdl.vecSize.length}</p>`
        }
        el.innerHTML += `<p class='vector' style='color:${data.color}'> (${rdl.vecSize[num]},${rdl.vecAngle[num]}°)</p>` 
    }
    return success;
}
 
/**
 * Checks if the angle and size in the form match those in the json for this riddle
 * @param {*} formSize 
 * @param {*} formAngle 
 * @param {*} jsonSize 
 * @param {*} jsonAngle 
 * @param {*} index 
 * @returns boolean
 */
function checkAnswer(formSize, formAngle, jsonSize, jsonAngle, index) {
    if(Math.abs(formSize - jsonSize) > deltaSize || Math.abs(formAngle - jsonAngle) > deltaAngle) {
        return false;
    }
    return true
}
  
/**
 * Clears the message from page labels
 */
function clearMsgs() {
    var el = findElement("errorMsg")
    el.innerHTML = ""
    el = findElement("instructions")
    el.innerHTML = ""
}

