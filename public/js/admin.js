/**
 * admin.js
 * 
 * This file includes functions that display the admin's view
 * 
 * Written by: Oded Cnaan
 * Date: March 2024
 */


/**************** WINDOW ONLOAD ***********************/

let reloadDelay = 1000

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
    
    window.addEventListener('resize', function(event) {
        var el = findElement("wrapper")
        if (el === undefined || el == null)
            return
        if (window.innerWidth <= 768)
            el.classList.remove("toggled")
        else
            el.classList.add("toggled")
    }, true);

    var togg = findElement("menu-toggle");
    if (togg !== null) {
        togg.addEventListener("click", (event) => {
            event.preventDefault();
            var el = findElement("wrapper")
            if (el === undefined || el == null)
                return
            if(el.classList[0] === undefined)
                el.classList.add("toggled")
            else
            el.classList.remove("toggled")
        });
    }
    
    // Add rules to Iodine
    window.Iodine.rule('someUppercase', (value) => {
        return value !== value.toUpperCase() &&
            value !== value.toLowerCase();
    });
    window.Iodine.setErrorMessage('someUppercase', fstrings.err.userEnChar);
    window.Iodine.rule('specialChars', (value) => {
        var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        return format.test(value)
    });
    window.Iodine.setErrorMessage('specialChars', fstrings.err.userSpecialChar);
    window.Iodine.rule('english', (value) => {
        var english = /^[A-Za-z]*$/;
        return english.test(value)
    })
    window.Iodine.setErrorMessage('english', fstrings.err.userOnlyEnglish);
    window.Iodine.rule('validchars', (value) => {
        var notallowed = /[\'\"\,-]+/;
        return !notallowed.test(value)
    })
    window.Iodine.setErrorMessage('validchars', fstrings.err.specialChars);
    
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
    el = findElement("editUser")
    if (el != null) {
        el.addEventListener("submit", function(e){
            sendEditUserForm(this)
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
    el = findElement("lessonEditor")
    if (el != null) {
        el.addEventListener("submit", function(e){
            e.preventDefault();    //stop form from submitting
            saveLessonsList(this)
        });    
    }    
    el = findElement("lsnGroups")
    if (el != null) {
        el.addEventListener("submit", function(e){
            e.preventDefault();    //stop form from submitting
            saveLessonsGroups(this)
        });    
    }    
    el = findElement("formEditor")
    if (el != null) {
        el.addEventListener("submit", function(e){
            e.preventDefault();    //stop form from submitting
            saveForm(this)
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
        username    : form.username.value.trim(),
        password : form.password.value.trim(),
        name     : form.name.value.trim(),
        uemail    : form.uemail.value.trim()
    };
    const rules = {
        username    : ['required', 'email'],
        password : ['required', 'minLength:6','someUppercase','specialChars'],
        name     : ['required', 'minLength:3', 'string'],
        uemail       : ['required', 'email']
    };
    console.log("email",items)
    const v = window.Iodine.assert(items, rules)    
    if (!v.valid) {
        if (!v.fields.username.valid)
            intermediateMsg("usernameError",v.fields.username.error)
        if (!v.fields.uemail.valid)
            intermediateMsg("uemailError",v.fields.uemail.error)
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
        email: form.uemail.value.trim().toLowerCase(),
    }
    const response = await fetch('/api/register', {
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
 * Edit User submission
 * @param {*} form 
 * @returns 
 */
async function sendEditUserForm(form) {
    var errMsg = findElement('errMsg')
    errMsg.innerHTML = ""

    // validations
    const items = {
        email    : form.uemail.value.trim().toLowerCase()
    };
    const rules = {
        email    : ['required', 'email']
    };
    const v = window.Iodine.assert(items, rules)
    if (!v.valid) {
        if (!v.fields.email.valid)
            intermediateMsg("uemailError",v.fields.email.error)
        return
    }
    // End Validations

    var body = {
        role: form.role.value,
        username: form.username.value,
        email: form.uemail.value.trim().toLowerCase()
    }
    
    const response = await fetch('/api/user/edit', {
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
        method: "POST", 
        cache: "no-cache", 
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow", 
        referrerPolicy: "no-referrer", 
        body: JSON.stringify(body), 
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
        intermediateMsgElem(findElement(msgId), fstrings.err.blankGameName)
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
        method: "POST", 
        cache: "no-cache", 
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow", 
        referrerPolicy: "no-referrer", 
        body: JSON.stringify(body), 
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
        newGame : form.newName.value.trim(),
    }
    if (form.newBranchClone !== null && form.newBranchClone !== undefined && form.newBranchClone.value !== undefined) {
        body.newBranch = form.newBranchClone.value.trim()
    }


    if (body.origGame === body.newGame || body.newGame === "") {
        errMsg.innerHTML = fstrings.err.uniqueGameName
        return
    }    

    const response = fetch('/api/game/clone', {
        method: "POST", 
        cache: "no-cache", 
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow", 
        referrerPolicy: "no-referrer", 
        body: JSON.stringify(body), 
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
        errMsg.innerHTML = fstrings.err.blankGameName
        return
    }    

    if (!confirm(`${fstrings.q.deleteGame} "${gameName}" (${uid})?`)) 
        return

    const response = fetch('/api/game/remove', {
        method: "POST", 
        cache: "no-cache", 
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow", 
        referrerPolicy: "no-referrer", 
        body: JSON.stringify(body), 
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
        errMsg.innerHTML = fstrings.err.blankGameName
        return
    }    

    const response = fetch('/api/game/edit', {
        method: "POST", 
        cache: "no-cache", 
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow", 
        referrerPolicy: "no-referrer", 
        body: JSON.stringify(body), 
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

    if (!confirm(fstrings.q.saveChanges))
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
        method: "POST", 
        cache: "no-cache", 
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow", 
        referrerPolicy: "no-referrer", 
        body: JSON.stringify(body), 
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
        mapMsg.innerHTML = fstrings.err.imageType
        return
    }    
    var formData = new FormData();
    var data = {team: form.mapTeam.value, uid: form.mapUid.value, game: form.mapGame.value}
    mapFiles[0].name = `${data.uid}_${data.team}.png`
    formData.append("file", mapFiles[0])
    formData.append("info",data)
    const response = fetch('/api/game/upmap', {
        method: "POST", 
        cache: "no-cache", 
        headers: {
          //"Content-Type": "multipart/form-data",
          'Content-Length': mapFiles[0].length,
          'x-path-name': `${data.uid}_${data.team}.png`,
          'x-branch-code': form.branchCode.value
        },
        redirect: "follow", 
        referrerPolicy: "no-referrer", 
        body: formData
    })
    .then (response => {
        response.json()
        .then (resp => {
            if (response.status != 200) { // failed        
                intermediateMsgElem(errMsg,resp.msg)
            }
            else {
                intermediateMsgElem(mapMsg,fstrings.ok.uploadedOK)
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
        if (modalSelection.name !== '') {
            modalLink.children[0].src = `https://mashar.s3.eu-north-1.amazonaws.com/riddles/${branch}/${modalSelection.name}`
            modalLink.children[1].value = `${branch}/${modalSelection.name}`
        }
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
    el.src = src + "?d=" + new Date().getTime()
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
            errMsg.innerHTML = fstrings.err.blankBranch
            return
        }    
    }


    const response = fetch('/api/mng/brnch', {
        method: "POST", 
        cache: "no-cache", 
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow", 
        referrerPolicy: "no-referrer", 
        body: JSON.stringify(body), 
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
    if (!confirm(fstrings.q.deleteBranch+" "+nick+" ?"))
        return
    actionBranch({nick, msgId, action:'del'})
}

function deleteGalImg(id, branchCode) {
    const errMsg = findElement('msg')
    const img = findElement(id)
    if (!img)
        return

    if (!confirm(fstrings.q.deleteImage))
        return

    var body = {        
        action: 'del',
        name: id,
        branchCode
    }

    const response = fetch('/api/mng/galdel', {
        method: "POST", 
        cache: "no-cache", 
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow", 
        referrerPolicy: "no-referrer", 
        body: JSON.stringify(body), 
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

function changeBranchReload(root, sel, url) {
    var newBranchCode = (sel.options[sel.selectedIndex].value)
    
    window.location = `${url}${newBranchCode}`
}

function cancelChanges(url) {
    if (confirm(fstrings.q.exitNoSave))
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

  /******************** LESSONS *****************************/

  /**
   * Add a lesson
   * @param {*} id 
   * @returns 
   */
  function addLesson(id) {
    var tbl = findElement(id)
    if (tbl == null)
        return

    var max = 0
    for( var i = 1; i<tbl.rows.length ; i++){    
        if (parseInt(tbl.rows[i].id) >= max)
            max = parseInt(tbl.rows[i].id)
    }
    var newRow = tbl.insertRow(-1)
    newRow.id = ++max
    newRow.innerHTML = `<tr><td><img src="/img/ops/del.png" class="ops-icon" onclick="delLesson('${id}','${max}')" data-toggle="tooltip" data-placement="top" title="מחיקת תגבור"/></td>
                        <td><select id="wd-{{@index}}" class="form-select form-select-sm">
                        <option value="1" selected>ראשון</option>
                        <option value="2">שני</option>
                        <option value="3">שלישי</option>
                        <option value="4">רביעי</option>
                        <option value="5">חמישי</option>
                        <option value="6">שישי</option>
                        <option value="7">שבת</option>
                        </select></td>
        <td><input id="tm-${max}" type="time" class="form-control form-control-sm" value="18:00"/></td>
        <td><input id="du-${max}"  type="number" min="07:00" class="form-control form-control-sm" style="max-width:60px" value="60"/></td>
        </tr>`
  }

  /**
   * Delete specific lesson
   * @param {*} id 
   * @param {*} index 
   * @returns 
   */
  function deleteLesson(id, index) {
    var tbl = findElement(id)
    if (tbl == null)
        return

    for( var i = 1; i<tbl.rows.length ; i++){    
        if (tbl.rows[i].id === index) {
            tbl.deleteRow(i)
            break;
        }
    }
  }

  /**
   * Add a lesson group to a specific user
   * @param {*} userId 
   * @returns 
   */
  function addLessonGroup(username, userId, groups) {
    if (groups === null || groups == undefined)
        return
    groups = groups.split(",")
    var section = findElement("groups-"+username)
    if (section === null)
        return
    var arr = section.querySelectorAll("table")
    var id = 0
    var max = 0
    if (arr !== undefined && arr !== null && arr.length !== 0) {
        for (var i=0; i< arr.length; i++) {
            var lst = arr[i].id.split("-")
            var num = parseInt(lst[lst.length-1])
            if (num > max)
                max = num+1
        }
        id = max
    }

    var e = `<div class="input-group mb-3" style="align-items:safe center">
            <img src="/img/ops/del.png" class="ops-icon" onclick="deleteLessonGroup('${userId}-${id}')" data-toggle="tooltip" data-placement="top" title="מחיקת קבוצה"/>   
            <span class="pe-2 ps-2" id="basic-addon2">שם קבוצת התגבור</span>
            <select class="form-select form-select-sm" id="grp-${userId}-${id}" >`
    var sel = ""            
    for (var i=0; i < groups.length; i++) {
        sel = sel + `<option value="${groups[i]}">${groups[i]}</option>`
    }
    e = `${e}${sel}</select>
            </div>
            
            <table id="lessons-${userId}-${id}" class="table table-striped table-success">
                <thead>
                <tr>
                    <th>פעולות</th>
                    <th>יום</th>
                    <th>שעה</th>
                    <th>משך בדקות</th>
                </tr>
                </thead>
                <tbody>                  
                <tr id="${id}">
                <td>
                    <img src="/img/ops/del.png" class="ops-icon" onclick="deleteLesson('lessons-${userId}-${id}','${id}')" data-toggle="tooltip" data-placement="top" title="מחיקת תגבור"/>
                </td>
                <td><select id="wd-{{@index}}" class="form-select form-select-sm">
                    <option value="1" selected>ראשון</option>
                    <option value="2" >שני</option>
                    <option value="3" >שלישי</option>
                    <option value="4" >רביעי</option>
                    <option value="5" >חמישי</option>
                    <option value="6" >שישי</option>
                    <option value="7" >שבת</option>
                    </select>
                </td>
                <td><input id="tm-${id}" type="time" value="18:00" class="form-control form-control-sm"/></td>
                <td><input id="du-${id}" type="number" min="07:00" value="60" class="form-control form-control-sm" style="max-width:60px"/></td>
                </tr>
                </tbody>
            </table>   
            <img src="/img/ops/plus.png" class="ops-icon" style="margin-top:-20px" onclick="addLesson('lessons-${userId}-${id}')" data-toggle="tooltip" data-placement="top" title="הוספת תגבור"/><span style="vertical-align:super"> הוספת שעת תגבור</span>
            <hr>`
    var myDiv = document.createElement("div")     
    myDiv.id = `gindex-${userId}-${id}`
    myDiv.innerHTML = e
    section.append(myDiv) 
  }

  /**
   * Delete a lesson group from a specific user
   * @param {*} id 
   * @returns 
   */
  function deleteLessonGroup(id) {
    var section = findElement("gindex-"+id)
    if (section === null)
        return
    section.remove()
  }

  /**
   * Save lessons in this page
   * @param {*} form 
   */
  function saveLessonsList(form) {
    if (!confirm(fstrings.q.saveChanges))
        return

    var errMsg = findElement('errMsg')
    if (errMsg)
        errMsg.innerHTML = "&nbsp;"

    var errorsFound = false
    var userGroups = form.querySelectorAll('[id^="groups-"]')
    if (userGroups == null)
        return
    var gindex = form.querySelectorAll('[id^="gindex-"]')
    if (gindex == null)
        return        

    var body = { users: [] }

    userGroups.forEach( grp => {
        var lessons = []
        var username = grp.id.split("-")[1]  
        gindex.forEach( gind => {
            if (gind.parentElement === undefined || gind.parentElement.id !== `groups-${username}`) 
                return
            var gindexIds = gind.id.split("-")
            var name = document.querySelector(`[id^="grp-${gindexIds[1]}-${gindexIds[2]}"]`)
            if (name === undefined)
                return
            errorsFound = checkIfFormError(name) ? true : errorsFound
            name = name.value
            var tbl = document.querySelector(`[id^="lessons-${gindexIds[1]}-${gindexIds[2]}"]`)
            var obj = {group: name, timing: []}
            for (var row of tbl.rows) {
                if (row.id == "") // header
                    continue
                var cellNum = 0
                var timing = {}
                for(let cell of row.cells) {                                        
                    if (cellNum == 0) {
                        cellNum++
                        continue
                    }
                    var list = getElementChildInputs(cell)
                    if(cellNum == 1) {
                        errorsFound = checkIfFormError(list[0]) ? true : errorsFound
                        timing.weekday = list[0].value
                    }
                    else if(cellNum == 2) {
                        errorsFound = checkIfFormError(list[0]) ? true : errorsFound
                        timing.time = list[0].value
                    }
                    else if(cellNum == 3) {
                        errorsFound = checkIfFormError(list[0]) ? true : errorsFound
                        timing.duration = list[0].value
                        obj.timing.push(timing)
                    }
                    cellNum++
                }                
            }
            lessons.push(obj)
        })      
        body.users.push({user:username, lessons})
    })

    if (errorsFound) {
        errMsg.innerHTML = fstrings.err.formError
        return
    }
    const response = fetch('/api/lsn/savelist', {
        method: "POST", 
        cache: "no-cache", 
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow", 
        referrerPolicy: "no-referrer", 
        body: JSON.stringify(body), 
    })
    .then (response => {
        response.json()
        .then (resp => {
            if (response.status != 200) { // failed        
                intermediateMsgElem(errMsg,resp.msg)
            }
            else {
                intermediateMsgElem(errMsg,resp.msg)
                setTimeout(() => {window.location.reload()}, 1000)
            }    
        })
    })
    .catch(err => {
        console.log(err)
    })

  }

function saveLessonsGroups(form) {
    var el = findElement("groups")
    if (el == null)
        return
    var br = findElement("branch")
    if (br == null)
        return

    if (!confirm(fstrings.q.saveChanges))
        return

    var groups = [...el.options].map(o => o.value)
    
    var body = {branch: br.value, groups}

    const response = fetch('/api/lsn/savegroups', {
        method: "POST", 
        cache: "no-cache", 
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow", 
        referrerPolicy: "no-referrer", 
        body: JSON.stringify(body), 
    })
    .then (response => {
        response.json()
        .then (resp => {
            if (response.status != 200) { // failed        
                intermediateMsgElem(errMsg,resp.msg)
            }
            else {
                intermediateMsgElem(errMsg,resp.msg)
                setTimeout(() => {window.location.reload()}, 1000)
            }    
        })
    })
    .catch(err => {
        console.log(err)
    })
}

  /*** */

  function getElementChildInputs(el) {
    if (el == null)
        return null
    var list = []
    for (var i=0; i < el.children.length ; i++) {
        if(el.children[i] instanceof HTMLSelectElement) {
            list.push(el.children[i])
        }
        else if (el.children[i] instanceof HTMLInputElement) {
            list.push(el.children[i])            
        }
    }
    return list;
  }

  function checkIfFormError(element) {
    if (element.value.trim() === "") {
        element.classList.add("errInput")
        return true
    }
    element.classList.remove("errInput")
  }
  

  function editeForm(uid) {
    var errMsg = findElement('errMsg')
    if (errMsg)
        errMsg.innerHTML = ""

    var body = {
        uid
    }

    if (body.gameName === "") {
        errMsg.innerHTML = fstrings.err.invalidData
        return
    }    

    const response = fetch('/api/lsn/formedit', {
        method: "POST", 
        cache: "no-cache", 
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow", 
        referrerPolicy: "no-referrer", 
        body: JSON.stringify(body), 
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