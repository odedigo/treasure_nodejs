/**
 * admin.js
 * 
 * This file includes functions that display the admin's view
 * 
 * Written by: Oded Cnaan
 * Date: March 2024
 */


/**************** WINDOW ONLOAD ***********************/
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
    el = findElement("cloneGameForm")
    if (el != null) {
        el.addEventListener("submit", function(e){
            e.preventDefault();    //stop form from submitting
            cloneGame(this)
        });    
    }
});

/**************** USER ACTIONS ***********************/

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

/**************** GAME ACTIONS ***********************/

function cloneGame(form) {    
    var errMsg = findElement('errMsg')
    if (errMsg)
        errMsg.innerHTML = ""

    var body = {
        origGame : form.origName.value,
        newGame : form.newName.value
    }

    if (body.origGame === body.newGame || body.newGame === "") {
        errMsg.innerHTML = "שם המשחק חייב להיות ייחודי ולא ריק"
        return
    }    

    const response = fetch('/api/game/clone', {
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

function deleteGame(name) {
    var errMsg = findElement('errMsg')
    if (errMsg)
        errMsg.innerHTML = ""

    var body = {
        gameName : name
    }

    if (body.gameName === "") {
        errMsg.innerHTML = "שם המשחק חייב לא יכול להיות ריק"
        return
    }    

    if (!confirm(`${name} למחוק את המשחק?`)) 
        return

    const response = fetch('/api/game/remove', {
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

function editeGame(name) {
    var errMsg = findElement('errMsg')
    if (errMsg)
        errMsg.innerHTML = ""

    var body = {
        gameName : name
    }

    if (body.gameName === "") {
        errMsg.innerHTML = "שם המשחק חייב לא יכול להיות ריק"
        return
    }    

    const response = fetch('/api/game/edit', {
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
            if (response.status != 200) { // failed        
                intermediateMsgElem(errMsg,resp.msg)
            }
            else {
                window.location = resp.path
            }    
        })
    })
    .catch(err => {
        console.log(err)
    })
}

function markThumbnail(link) {
    clearModalSelection()
    var img = link.children[0]
    img.style.border = "3px solid darkBlue"
}

function findMarkedThmbnail() {
    var selectedImage = ""
    var imgObj = null
    var imgs = document.querySelectorAll(".img-thumbnail")
    if (imgs != null) {
        imgs.forEach(im => {
            if (im.style.borderWidth == "3px") {
                selectedImage = im.src
                imgObj = im
            }
        })
    }
    return {imgElement: imgObj, name:selectedImage.substring(selectedImage.indexOf("/rdl/")+5)}
}

function setMarkedThumbnail(thumbId) {
    var imgName = findMarkedThmbnail().name
    var elem = findElement(thumbId)
    if (elem)
        elem.src = `/img/rdl/${imgName}`
}

function clearModalSelection() {
    var imgs = document.querySelectorAll(".img-thumbnail")
    if (imgs != null) {
        imgs.forEach(im => {
            im.style.border = "1px solid lightGray"
        })
    }
}

function getImageFilenameFromSrc(src) {
    var index = src.indexOf("/rdl/")
    if (index == -1)
        return ""
    return src.substring(index+5)
}

function closeModalGameEdit(id,reason) {
    if (reason == 'save') {
        var modalSelection = findMarkedThmbnail()
        clearModalSelection()
        // set the img.src to the selected image
        if (modalSelection.name !== '')
            modalLink.children[0].src = `/img/rdl/${modalSelection.name}`
    }
}

function closeModal(id) {
    console.log("close modal")
    var el = findElement(id)
    if (el == null) {
        console.log("element is null")
        return
    }
    // close modal
    var modal = bootstrap.Modal.getInstance(el)
    modal.hide();

    // hide backdrop
    const backdrops = document.querySelectorAll('.modal-backdrop')
    backdrops.forEach(bd => {
        bd.remove()
    })

    el = document.getElementsByTagName("body")[0];
    el.classList.remove(".modal-open")
}