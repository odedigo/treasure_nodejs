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
    el = findElement("cngPass")
    if (el != null) {
        el.addEventListener("submit", function(e){
            sendChangePassForm(this)
            e.preventDefault();    //stop form from submitting
        });    
    }
    el = findElement("cngRole")
    if (el != null) {
        el.addEventListener("submit", function(e){
            sendChangeRoleForm(this)
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
        //errMsg.innerHTML = resp.msg
        intermediateMsgElem(errMsg, resp.msg)
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
        intermediateMsgElem(errMsg,resp.msg)     
    }
    else {
        intermediateMsgElem(errMsg,resp.msg)
        resetFormInputs()
    }
}

async function sendChangePassForm(form) {
    var errMsg = findElement('errMsg')
    errMsg.innerHTML = ""
    var body = {
        password: form.password.value,
        username: form.username.value
    }
    const response = await fetch('/api/user/chgpass', {
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
    var modalErrMsg = findElement('modalErrMsg')
    if (response.status != 200) { // failed        
        intermediateMsgElem(modalErrMsg,resp.msg)   
    }
    else {
        intermediateMsgElem(errMsg,resp.msg)
        showModal(false,'changePassModal')
    }
}

async function sendChangeRoleForm(form) {
    var errMsg = findElement('errMsg')
    errMsg.innerHTML = ""
    var body = {
        role: form.role.value,
        username: form.username.value
    }
    const response = await fetch('/api/user/role', {
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
    var modalErrMsg = findElement('modalErrRoleMsg')
    if (response.status != 200) { // failed        
        intermediateMsgElem(modalErrMsg,resp.msg)   
    }
    else {
        intermediateMsgElem(errMsg,resp.msg)
        showModal(false,'changeRoleModal')
        setTimeout(window.location.reload(), 5000)
    }
}

function resetFormInputs() {
    var allInputs = document.querySelectorAll('input');
    allInputs.forEach(singleInput => singleInput.value = '');
}

function delUser(username) {
    var errMsg = findElement('errMsg')
    errMsg.innerHTML = ""

    if (!confirm("למחוק את המשתמש?")) 
        return


    var body = {
        username
    }
    
    const response = fetch('/api/user/del', {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(body), // body data type must match "Content-Type" header
    })
    .then (response => {
        response.json()
        .then (resp => {
            console.log(resp)
            if (response.status != 200) { // failed        
                intermediateMsgElem(errMsg,resp.msg)
            }
            else {
                intermediateMsgElem(errMsg,resp.msg)
                setTimeout(window.location.reload(), 3000)
            }    
        })
    })
    .catch(err => {
        console.log(err)
    })

}
