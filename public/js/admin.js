/**
 * admin.js
 * 
 * This file includes functions that display the admin's view
 * 
 * Written by: Oded Cnaan
 * Date: March 2024
 */


/**************** WINDOW ONLOAD ***********************/

let reloadDelay = 2500

/**
 * Listens to the window loading event and subscribing to 
 * various events
 */
window.addEventListener('load', () => {
    
    const spinner = findElement("spinner")
    if (spinner != null) {
        for (var i=0 ; i<spinner.children.length; i++)
            spinner.children[i].style.display = "none"
        spinner.style.display = "none"
    }

    // Add rules to Iodine
    window.Iodine.rule('someUppercase', (value) => {
        return value !== value.toUpperCase() &&
            value !== value.toLowerCase();
    });
    window.Iodine.setErrorMessage('someUppercase', "השדה חייב להכיל לפחות אות אחת גדולה באנגלית");
    window.Iodine.rule('specialChars', (value) => {
        var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        return format.test(value)
    });
    window.Iodine.setErrorMessage('specialChars', "השדה חייב להכיל לפחות תו אחד מיוחד");
    window.Iodine.rule('english', (value) => {
        var english = /^[A-Za-z]*$/;
        return english.test(value)
    })
    window.Iodine.setErrorMessage('english', "השדה חייב להכיל רק אותיות אנגליות, ללא רווחים");
    /******** END IODINE **************/

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
    el = findElement("gameEditor")
    if (el != null) {
        el.addEventListener("submit", function(e){
            e.preventDefault();    //stop form from submitting
            saveGame(this)
        });    
    }
    el = findElement("mapUpload")
    if (el != null) {
        el.addEventListener("submit", function(e){
            e.preventDefault();    //stop form from submitting
            uploadMap(this)
        });    
    }
    
});

/**************** USER ACTIONS ***********************/

/**
 * Login submission
 * @param {*} form 
 * @returns 
 */
async function sendLoginForm(form) {
    var errMsg = findElement('errMsg')
    errMsg.innerHTML = ""

    // validations
    const items = {
        email    : form.username.value.trim(),
        password : form.password.value.trim(),
    };
    const rules = {
        email    : ['required', 'email'],
        password : ['required', 'minLength:6','someUppercase','specialChars'],
    };
    const v = window.Iodine.assert(items, rules)
    /**
     *   fields: 
     *      email: {valid: false, rule: 'required', error: 'השדה לא יכול להיות ריק'}
     *      password: {valid: false, rule: 'required', error: 'השדה לא יכול להיות ריק'}
     *   valid: false
     */
    if (!v.valid) {
        if (!v.fields.email.valid)
            intermediateMsg("usernameError",v.fields.email.error)
        if (!v.fields.password.valid)
            intermediateMsg("passwordError",v.fields.password.error)
        return
    }
    // End Validations

    var body = {
        username: form.username.value.trim(),
        password: form.password.value.trim()
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

/**
 * User registration submission
 * @param {*} form 
 * @returns 
 */
async function sendRegisterForm(form) {
    var errMsg = findElement('errMsg')
    errMsg.innerHTML = ""

    // validations
    const items = {
        email    : form.username.value.trim(),
        password : form.password.value.trim(),
        name     : form.name.value.trim()
    };
    const rules = {
        email    : ['required', 'email'],
        password : ['required', 'minLength:6','someUppercase','specialChars'],
        name     : ['required', 'minLength:3', 'string']
    };

    const v = window.Iodine.assert(items, rules)    
    if (!v.valid) {
        if (!v.fields.email.valid)
            intermediateMsg("usernameError",v.fields.email.error)
        if (!v.fields.password.valid)
            intermediateMsg("passwordError",v.fields.password.error)
        if (!v.fields.name.valid)
            intermediateMsg("nameError",v.fields.name.error)
        return
    }
    // End Validations

    var body = {
        username: form.username.value.trim(),
        password: form.password.value.trim(),
        role: form.role.value,
        name: form.name.value.trim(),
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

/**
 * Change password submission
 * @param {*} form 
 * @returns 
 */

async function sendChangePassForm(form) {
    var errMsg = findElement('errMsg')
    errMsg.innerHTML = ""

    // validations
    const items = {
        email    : form.usernameChg.value.trim(),
        password : form.passwordChg.value.trim(),
    };
    const rules = {
        email    : ['required', 'email'],
        password : ['required', 'minLength:6','someUppercase','specialChars'],
    };
    const v = window.Iodine.assert(items, rules)
    /**
     *   fields: 
     *      email: {valid: false, rule: 'required', error: 'השדה לא יכול להיות ריק'}
     *      password: {valid: false, rule: 'required', error: 'השדה לא יכול להיות ריק'}
     *   valid: false
     */
    if (!v.valid) {
        if (!v.fields.email.valid)
            intermediateMsg("usernameChgError",v.fields.email.error)
        if (!v.fields.password.valid)
            intermediateMsg("passwordChgError",v.fields.password.error)
        return
    }
    // End Validations

    var body = {
        password: form.passwordChg.value.trim(),
        username: form.usernameChg.value.trim()
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

/**
 * Change role submission
 * @param {*} form 
 * @returns 
 */
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
        setTimeout(() => {window.location.reload()}, reloadDelay)
    }
}

/**
 * Delete user submission
 * @param {*} form 
 * @returns 
 */
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
            if (response.status != 200) { // failed        
                intermediateMsgElem(errMsg,resp.msg)
            }
            else {
                intermediateMsgElem(errMsg,resp.msg)
                setTimeout(() => {window.location.reload()}, reloadDelay)
            }    
        })
    })
    .catch(err => {
        console.log(err)
    })
}

/**************** GAME ACTIONS ***********************/

function createNewGame(nameId, branchId, msgId) {
    var nameEl = findElement(nameId)
    if (nameEl === undefined) {
        return
    }
    var branch = ""
    var branchEl = findElement(branchId)
    if (branchEl && branchEl !== undefined) {
        branch = branchEl.value
    }
    if (nameEl.value.trim() === '') {
        intermediateMsgElem(findElement(msgId), "שם המשחק לא יכול להיות ריק")
        return
    }

    var errMsg = findElement('errMsg')
    if (errMsg)
        errMsg.innerHTML = ""

    var body = {
        name : nameEl.value.trim(),
        branch
    }

    const response = fetch('/api/game/create', {
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
                setTimeout(() => {window.location.reload()}, reloadDelay)
            }    
        })
    })
    .catch(err => {
        console.log(err)
    })
}

function cloneGame(form) {    
    var errMsg = findElement('errMsg')
    if (errMsg)
        errMsg.innerHTML = ""

    var body = {
        origGame : form.origName.value.trim(),
        newGame : form.newName.value.trim()
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
            if (response.status != 200) { // failed        
                intermediateMsgElem(errMsg,resp.msg)
            }
            else {
                intermediateMsgElem(errMsg,resp.msg)
                setTimeout(() => {window.location.reload()}, reloadDelay)
            }    
        })
    })
    .catch(err => {
        console.log(err)
    })
}

function deleteGame(gameName, uid, branch) {
    var errMsg = findElement('errMsg')
    if (errMsg)
        errMsg.innerHTML = ""

    var body = {
        gameName,
        uid,
        branch
    }

    if (body.gameName === "") {
        errMsg.innerHTML = "שם המשחק חייב לא יכול להיות ריק"
        return
    }    

    if (!confirm(`${gameName} למחוק את המשחק?`)) 
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
                setTimeout(() => {window.location.reload()}, reloadDelay)
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

function saveGame(form) {

    if (!confirm("לשמור את השינויים?"))
        return

    var errMsg = findElement('errMsg')
    if (errMsg)
        errMsg.innerHTML = ""

    var body = {
        gameName: form.gameName.value.trim(),
        version: form.version.value,
        branch: form.branch.value,
        active: form.active.value,
        readableName: form.readableName.value.trim(),

        red : {
            team: form.teamRed.value.trim(),
            color: form.colorRed.value,
            bgColor: form.bgColorRed.value,
            riddles: getRiddles(form,'red')
        },
        blue : {
            team: form.teamBlue.value.trim(),
            color: form.colorBlue.value,
            bgColor: form.bgColorBlue.value,
            riddles: getRiddles(form,'blue')
        },
        green : {
            team: form.teamGreen.value.trim(),
            color: form.colorGreen.value,
            bgColor: form.bgColorGreen.value,
            riddles: getRiddles(form,'green')
        }
    }

    const response = fetch('/api/game/save', {
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
                setTimeout(() => {window.location = resp.path}, 1000)
            }    
        })
    })
    .catch(err => {
        console.log(err)
    })
}

function uploadMap(form) {
    var mapMsg = findElement('mapMsg')
    if (mapMsg)
    mapMsg.innerHTML = ""

    var mapFiles = findElement('mapfile').files
    if (mapFiles.length === 0) {
        mapMsg.innerHTML = "יש לבחור קובץ תמונה מסוג PNG"
        return
    }    
    var formData = new FormData();
    var data = {team: form.mapTeam.value, uid: form.mapUid.value, game: form.mapGame.value}
    mapFiles[0].name = `${data.uid}_${data.team}.png`
    formData.append("file", mapFiles[0])
    formData.append("info",data)
    const response = fetch('/api/game/upmap', {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          //"Content-Type": "multipart/form-data",
          'Content-Length': mapFiles[0].length,
          'x-path-name': `${data.uid}_${data.team}.png`,
          'x-branch-code': form.branchCode.value
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: formData
    })
    .then (response => {
        response.json()
        .then (resp => {
            if (response.status != 200) { // failed        
                intermediateMsgElem(errMsg,resp.msg)
            }
            else {
                intermediateMsgElem(mapMsg,"הקובץ עלה בהצלחה")
                findElement('newmap').src = ""
                reloadImg('curMap')
                //findElement('curMap').src = findElement('curMap').src + "/" + new Date().getTime();
            }    
        })
    })
    .catch(err => {
        console.log(err)
    })
}

/**
 * start game
 * @param {*} form 
 * @returns 
 */
async function startGame(gameCode, branch) {
    var errMsg = findElement('errMsg')
    errMsg.innerHTML = ""

    var body = {
        gameCode,
        branch
    }
    const response = await fetch('/api/game/start', {
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
        intermediateMsgElem(errMsg, resp.msg)
    }
    else {        
        intermediateMsgElem(errMsg, resp.msg)
        setTimeout(() => {window.location.reload()}, reloadDelay)
    }
}

/**
 * stop game
 * @param {*} form 
 * @returns 
 */
async function stopGame(gameCode, branch) {
    var errMsg = findElement('errMsg')
    errMsg.innerHTML = ""

    var body = {
        gameCode,
        branch
    }
    const response = await fetch('/api/game/stop', {
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
        intermediateMsgElem(errMsg, resp.msg)
    }
    else {
        intermediateMsgElem(errMsg, resp.msg)
        setTimeout(() => {window.location.reload()}, reloadDelay)
    }
}

/**************** MODAL ***********************/

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
    return {imgElement: imgObj, name:selectedImage.substring(selectedImage.lastIndexOf("/")+1)}
}

/*function setMarkedThumbnail(thumbId) {
    var imgName = findMarkedThmbnail().name
    var elem = findElement(thumbId)
    if (elem)
        elem.src = `/img/rdl/${imgName}`
}*/

function clearModalSelection() {
    var imgs = document.querySelectorAll(".img-thumbnail")
    if (imgs != null) {
        imgs.forEach(im => {
            im.style.border = "1px solid lightGray"
        })
    }
}

function getImageFilenameFromSrc(src) {
    var index = src.lastIndexOf('/')
    if (index == -1)
        return ""
    return src.substring(index+1)
}

function closeModalGameEdit(id,reason,branch) {
    if (reason == 'save') {
        var modalSelection = findMarkedThmbnail()
        clearModalSelection()
        // set the img.src to the selected image
        if (modalSelection.name !== '')
            modalLink.children[0].src = `/img/rdl/${branch}/${modalSelection.name}`
    }
}

function closeModal(id) {
    var el = findElement(id)
    if (el == null) {
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

/**************** RIDDLES ***********************/

function getRiddles(form, color) {
    var riddles = []

    for (var i=1; i <=5 ; i++) {
        var rdl = {
            index: i,
            img: removeImgPath(form[`${color}Img${i}`].value),
            vecSize: getVecSize(form,color,i),
            vecAngle: getVecAngle(form, color,i),
            riddle: getRiddle(form, color,i)                    
        }
        riddles.push(rdl)
    }
    return riddles
}

// red{{rdl.index}}VecSize3
function getVecSize(form, color, index) {
    var sizes = []
    for (var i=1; i<=3 ; i++) {
        var val = Number(form[`${color}${index}VecSize${i}`].value.trim())
        if (val !== 0)
            sizes.push(val)
    }
    return sizes
}

// red{{rdl.index}}VecAngle3
function getVecAngle(form, color, index) {
    var sizes = []
    for (var i=1; i<=3 ; i++) {
        var val = Number(form[`${color}${index}VecAngle${i}`].value.trim())
        var size = Number(form[`${color}${index}VecSize${i}`].value.trim())
        if (size !== 0)
            sizes.push(val)
    }
    return sizes
}

// riddleBlue{{rdl.index}}
function getRiddle(form, color, index) {
    var riddle = []
    var text = form[`riddle${color}${index}`].value.trim()
    var splitText = text.split("\n")
    splitText.forEach( t => {
        if (t.trim() !== '')
            riddle.push(t.trim())
    })
    return riddle    
}

function removeImgPath(src) {
    if (src !== undefined && src !== '')
        return src.substring(src.lastIndexOf("/")+1)
    return "empty.png"
}

function increaseMajorVersion() {
    var el = findElement("version")
    var v = (Number(el.value) + 1.0).toFixed(0) + ".0"
    el.value = v;
}

function copyToClipboard(text, id) {
    navigator.clipboard.writeText(text);
    if (id) {
        var el = findElement(id)
        intermediateMsgElem(el, "הועתק לזכרון")
    }
}

function showInTab(url) {
    window.open(url,"game")
}

function reloadImg(id) {
    var el = findElement(id)
    if (!el)
        return
    var src= el.src
    var index = src.indexOf(".png")
    if (index != -1) {
        src = src.substring(0, index + 4)
    }
    el.src = src + "/" + new Date().getTime()
}

/****************** BRANCHES *******************/
function actionBranch(data) {
    var errMsg = findElement(data.msgId)
    if (errMsg)
        errMsg.innerHTML = "&nbsp;"

    var body = {        
        action: data.action
    }

    if (data.action === 'new') {                
        // validations
        const items = {
            name    : findElement(data.newNameId).value.trim(),
            nick    : findElement(data.newNickId).value.trim(),
        };
        const rules = {
            name    : ['required', 'string','minLength:3'],
            nick    : ['required', 'string','minLength:3','maxLength:6','english'],
        };
        const v = window.Iodine.assert(items, rules)
        if (!v.valid) {
            if (!v.fields.name.valid)
                intermediateMsg(data.newNameId+"Error",v.fields.email.error)
            if (!v.fields.password.valid)
                intermediateMsg(data.newNameId+"Error",v.fields.password.error)
            return
        }
        // End Validations        
        
        body['name'] = findElement(data.newNameId).value.trim()
        body['nick'] = findElement(data.newNickId).value.trim()
    }
    else if (data.action === 'del') {
        body['nick'] = data.nick
        if (body.nick === "") {
            errMsg.innerHTML = "כינוי הסניף לא יכול להיות ריק"
            return
        }    
    }


    const response = fetch('/api/mng/brnch', {
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
                setTimeout(() => {window.location.reload()}, reloadDelay)
            }    
        })
    })
    .catch(err => {
        console.log(err)
    })    
}

function createBranch(newNameId, newNickId, msgId) {
    actionBranch({newNameId, newNickId, msgId,action:'new'})
}

function deleteBranch(nick, msgId) {
    if (!confirm("למחוק את הסניף "+nick+" ?"))
        return
    actionBranch({nick, msgId, action:'del'})
}

function deleteGalImg(id, branchCode) {
    const errMsg = findElement('msg')
    const img = findElement(id)
    if (!img)
        return

    if (!confirm("בטוח שאתם רוצים למחוק את התמונה?"))
        return

    var body = {        
        action: 'del',
        name: id,
        branchCode
    }

    const response = fetch('/api/mng/galdel', {
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
                setTimeout(() => {window.location.reload()}, reloadDelay)
            }    
        })
    })
    .catch(err => {
        console.log(err)
    })       
}

function changeBranchGal(root, sel) {
    var newBranchCode = (sel.options[sel.selectedIndex].value)
    
    window.location = `/admin/gallery/${newBranchCode}`
}

function cancelChanges(url) {
    if (confirm("בטוחים שרוצים לצאת בלי לשמור את השינויים?"))
        window.location = url
}

function password_show_hide(id) {
    var x = document.getElementById(id);
    var show_eye = document.getElementById("show_eye");
    var hide_eye = document.getElementById("hide_eye");
    hide_eye.classList.remove("d-none");
    if (x.type === "password") {
      x.type = "text";
      show_eye.style.display = "none";
      hide_eye.style.display = "block";
    } else {
      x.type = "password";
      show_eye.style.display = "block";
      hide_eye.style.display = "none";
    }
  }