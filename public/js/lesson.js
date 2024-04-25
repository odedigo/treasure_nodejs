


window.addEventListener('load', () => {
    var el = findElement("lessonEditor")
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
})
    
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

    var groups = []
    Array.from(el.options).forEach(function(opt) {
        groups.push({name: opt.text, gid: opt.value})
    })
    
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
        else if (el.children[i] instanceof HTMLTextAreaElement) {
            list.push(el.children[i])            
        }
    }
    return list;
  }

  function getElementChildInputsDeep(el, list) {
    if (el == null || el.children == undefined)
        return
    for (var i=0; i < el.children.length ; i++) {
      if (el.children[i] instanceof HTMLInputElement || el.children[i] instanceof HTMLTextAreaElement || el.children[i] instanceof HTMLSelectElement) {
        list.push(el.children[i])
      }
      getElementChildInputsDeep(el.children[i], list);
    }
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

/*** FORM EDIT */
function typeSelected(type) {
    var sel = document.getElementById("response")
    switch(type) {
        case 'text':
        sel.style.display = "none"
        break
        case 'select':
        case 'checkbox':
        case 'radio':
        sel.style.display = "block"
        break
        default:
        sel.style.display = "none"
        break
    }
}

function addFormQuestion(e) {
    var qa = findElement("qa")
    var q = findElement("new_question")
    var type = findElement("new_qtype")
    var opt = findElement("new_options")

    var type_text = type.options[type.selectedIndex].text
    var type_value = type.value
    var options = opt.value.trim()
    var question = q.value.trim()
    var show = type_value == 'text' ? "none" : "block"

    if (question === "" || (type_value !== 'text' && options === "")) {
        findElement("errMsg").innerHTML = fstrings.err.invalidData
        return
    }

    var html = `<div class="qa container w-75 shadow me-0 mt-4 p-3 border-end border-primary border-3" style="background-color:white"
                draggable="true" ondragleave="editForm_dragLeave(event)" ondragenter="editForm_dragEnter(event)" ondragend="editForm_dragEnd(event)" 
                ondragover="editForm_dragOver(event)" ondragstart="editForm_dragStart(event)" ondrop="editForm_drop(event)">
    <button type="button" class="btn-close" aria-label="Close" onclick="editForm_deleteQA(this)"></button>
    <div class="row mt-4">
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon3">סוג התשובה</span>
        <select draggable="true" class="form-select" id="qatype" aria-label="" disabled>
            <option value="${type_value}">${type_text}</option>
        </select>     
      </div>
    </div> 
    <div class="row">
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon3">השאלה</span>
        <input draggable="true" name="qaquestion" type="input" id="qaquestion" value="${question}" class="form-control w-75" aria-describedby="basic-addon3">              
      </div>
    </div> 
    <div class="row" id="response" style="display:${show}">
      <label id="usernameError" class="form-text text-muted">רשימה של אפשרויות לבחירה, אחת בכל שורה</label>
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon3">אפשרויות</span>
        <textarea draggable="true" id="qaoptions" class="form-control" style="min-height:200px">${options}</textarea>
      </div>
    </div>
  </div>`
  qa.insertAdjacentHTML("beforeend", html)
}

function editForm_deleteQA(but) {
    if (!confirm(fstrings.q.removeQuestion))
        return
    but.parentElement.remove()
}

function editForm_dragEnter(event) {
    if (event.target.classList.contains("qa"))
        event.target.classList.add('over');
}

function editForm_dragOver(event) {
    event.preventDefault();
    return false;
}

function editForm_dragLeave(event) {
    if (event.target.classList.contains("qa"))
        event.target.classList.remove('over');
}

function editForm_dragStart(event) {
    if (event.target.classList.contains("qa")) {
        event.target.style.opacity = '0.4';
        dragSrcEl = event.currentTarget;
       
        var list = []
        getElementChildInputsDeep(event.currentTarget, list)

        list.forEach(item =>  {
            item.setAttribute("value",item.value)
            item.setAttribute("data-qavalue",item.value)
        })
        event.dataTransfer.clearData();
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', event.currentTarget.innerHTML);
    }
}

function editForm_dragEnd(event) {
    event.target.style.opacity = '1';
    var items = document.querySelectorAll(".qa")
    items.forEach(function (item) {
        item.classList.remove('over');
        item.style.opacity = '1';
    });
}

function editForm_drop(event) {
    if (event.target.classList.contains("qa")) {
        event.stopPropagation(); // stops the browser from redirecting.

        if (dragSrcEl !== null && dragSrcEl !== event.target) {
            
            var list = []
            getElementChildInputsDeep(event.currentTarget, list)
            list.forEach(item =>  {
                item.setAttribute("value",item.value)
                item.setAttribute("data-qavalue",item.value)
            })
            dragSrcEl.innerHTML = event.currentTarget.innerHTML;
            event.currentTarget.innerHTML = event.dataTransfer.getData('text/html');
            var list = []
            getElementChildInputsDeep(dragSrcEl, list)
            list.forEach(item =>  {
                var v = item.getAttribute("data-qavalue")
                item.value = v
            })
        }

        return false;
    }
}

function saveForm(uid) {
    if (!confirm(fstrings.q.saveChanges))
        return

    var foundErrors = false;
    var form = []
    var qa = document.querySelectorAll(".qa")
    qa.forEach( qaItem => {
        var list = []
        getElementChildInputsDeep(qaItem, list)
        var obj = {}
        list.forEach(item => {
            if (item.id === 'qatype') {
                obj.type = item.value.trim()
            }
            else if (item.id == 'qaquestion') {
                obj.q = item.value.trim()
                if (obj.q === "")
                    foundErrors = true
            }
            else if (item.id == 'qaoptions' && obj.type !== 'text') {
                var opts = item.value.split("\n")
                var options = []
                opts.forEach(o => {
                    if (o.trim() !== "")
                        options.push({value: o.trim() , option: o.trim()})
                })
                if (options.length == 0)
                    foundErrors = true
                obj.options = options 
            }
        })
        form.push(obj)
    })

    var name = findElement("name").value.trim()
    var group = findElement("group").value
    console.log(findElement("group"), findElement("group").value)
    var active = findElement("active").value
    var title = findElement("title").value.trim()

    if (name === "" || title === "")
        foundErrors = true

    if (foundErrors) {
        findElement("errMsg").innerHTML = fstrings.err.invalidData
        return
    }


    var uid = findElement("uid").value
    var body = {uid, form, name, group, active, title}

    const response = fetch('/api/lsn/saveform', {
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
