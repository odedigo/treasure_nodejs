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
        teacher: form.teacher.value,
        branch: form.branch.value
    }
    console.log(body)
    const response = await fetch('/vector', {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(body), // body data type must match "Content-Type" header
      })
    
      const resp = await response.json()
      
    errMsg.innerHTML = resp.result.errMsg
    infoMsg.innerHTML = resp.result.infoMsg
}