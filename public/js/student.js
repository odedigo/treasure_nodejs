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
    var body = {
        vecorSize: form.vectorSize.value,
        vecorAngle: form.vectorAngle.value,
    }
    const response = await fetch('/vector', {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      });
      var res = response.json();
      console.log(res)
}