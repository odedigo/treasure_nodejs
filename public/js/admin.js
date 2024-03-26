/**
 * admin.js
 * 
 * This file includes functions that display the admin's view
 * 
 * Written by: Oded Cnaan
 * Date: March 2024
 */

window.addEventListener('load', () => {
    let el = findElement("login")
    if (el != null) {
        saveTokens("") // delete tokens
        el.addEventListener("submit", function(e){
            sendLoginForm(this)
            e.preventDefault();    //stop form from submitting
        }); 
    }
    el = findElement("register")
    if (el != null) {
        el.addEventListener("submit", function(e){
            sendRegisterForm(this)
            e.preventDefault();    //stop form from submitting
        });    
    }
});

async function sendLoginForm(form) {
    var errMsg = findElement('errMsg')
    errMsg.innerHTML = ""

    var body = {
        username: form.username.value,
        password: form.password.value
    }
    const response = await fetch('/api/login', {
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
    if (response.status != 200) { // failed        
        errMsg.innerHTML = resp.msg
    }
    else {
        window.location = resp.redirect
    }
}

async function sendRegisterForm(form) {
    var errMsg = findElement('errMsg')
    errMsg.innerHTML = ""

    var body = {
        username: form.username.value,
        password: form.password.value,
        role: form.role.value,
        name: form.name.value,
        branch: form.branch.value,
    }
    const response = await fetch('/api/register', {
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
    if (response.status != 200) { // failed        
        errMsg.innerHTML = resp.msg        
    }
    else {
        errMsg.innerHTML = resp.msg
        resetFormInputs()
    }
}

function resetFormInputs() {
    var allInputs = document.querySelectorAll('input');
    allInputs.forEach(singleInput => singleInput.value = '');
}