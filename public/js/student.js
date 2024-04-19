/**
 * student.js
 * 
 * This file includes functions that display the sudent's view
 * 
 * Written by: Oded Cnaan
 * Date: March 2024
 */

window.addEventListener('load', () => {
    let el = findElement("checkForm")
    el.addEventListener("submit", function(e){
        sendForm(this)
        e.preventDefault();    //stop form from submitting
    });    
});

/**
 * Check student responses (validation)
 * @param {*} form 
 */
async function sendForm(form) {
    var errMsg = findElement('errorMsg')
    var infoMsg = findElement('instructions')
    errMsg.innerHTML = ""
    infoMsg.innerHTML = ""

    var body = {
        vectorSize: form.vectorSize.value,
        vectorAngle: form.vectorAngle.value,
        index: form.index.value,
        team: form.team.value,
        gameName: form.gameName.value
    }
    const response = await fetch('/api/vector', {
        method: "POST", 
        cache: "no-cache", 
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", 
        referrerPolicy: "no-referrer", 
        body: JSON.stringify(body), 
      })
    
      const resp = await response.json()
      
    errMsg.innerHTML = resp.result.errMsg
    infoMsg.innerHTML = resp.result.infoMsg
}