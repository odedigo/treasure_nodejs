let uploadProgress = []
let progressBar = document.getElementById('progress-bar')
let dropArea = document.getElementById('drop-area')
var gallery = document.getElementById('gallery')
let fileList = []

  ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
  })
  
  function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
  }

  ;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
  })
  
  ;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
  })
  
  function highlight(e) {
    dropArea.classList.add('highlight')
  }
  
  function unhighlight(e) {
    dropArea.classList.remove('highlight')
  }

  dropArea.addEventListener('drop', handleDrop, false)

  function handleDrop(e) {
    let dt = e.dataTransfer
    let files = dt.files
    handleFiles(files)
  }

  function handleFiles(files) {
    var f = [...files]
    fileList = fileList.concat(f)
    //initializeProgress(fileList.length) 
    //files.forEach(uploadFile)
    f.forEach(file => {
        if (file.name !== 'empty.png')
            previewFile(file)
        else {
            document.getElementById('msg').innerHTML = fstrings.err.uploadEmptyErr
        }
    })
  }
  
  function previewFile(file) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
      let img = document.createElement('img')
      img.src = reader.result
      img.id = file.name
      gallery.appendChild(img)
    }
  }
  
  function initializeProgress(numFiles) {
    progressBar.value = 0
    uploadProgress = []
  
    for(let i = numFiles; i > 0; i--) {
      uploadProgress.push(0)
    }
  }
  
  function updateProgress(fileNumber, percent) {
    uploadProgress[fileNumber] = percent
    let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length
    progressBar.value = total
  }
  
    function uploadAllFiles(branchCode) {
        var i = 1
        fileList.forEach(file => {
            uploadFile(file,i++, branchCode)
         })
    }

  function uploadFile(file, i, branchCode) { 
    var url = '/api/mng/gal'
    var xhr = new XMLHttpRequest()
    var formData = new FormData()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('x-branch-code', branchCode)
  
    // Add following event listener
    xhr.upload.addEventListener("progress", function(e) {
      var f = fileList.pop()
      removeFromGallery(f.name)
      //updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
    })
  
    xhr.addEventListener('readystatechange', function(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        document.getElementById('msg').innerHTML = fstrings.ok.allUploadOK
        setTimeout(() => {
            window.location.reload()
          }, reloadDelay);
      }
      else if (xhr.readyState == 4 && xhr.status != 200) {        
        var resp = JSON.parse(xhr.response)
        console.log(resp.msg )
        if (resp.msg !== undefined)
          intermediateMsg('msg',resp.msg)
        else
          intermediateMsg('msg',fstrings.err.allUploadErr)
      }
    })
  
    formData.append('file', file)
    xhr.send(formData)
  }
  
  function removeFromGallery(name) {
    for (var i=0; i < gallery.children.length; i++) {
        var ch = gallery.children[i]
        if (ch.id === name)
            gallery.removeChild(gallery.childNodes[i])
    }
  }

  