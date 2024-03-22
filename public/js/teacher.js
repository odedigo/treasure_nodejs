/**
 * teacher.js
 * 
 * This file includes functions that display the teacher's view
 * 
 * Written by: Oded Cnaan
 * Date: March 2024
 */

/**
 * Displays the enlatged image
 * @param {*} img 
 */
function showZoom(img) { 
    findElement("imgBig").src = img.src
    findElement("overlay").style.display = "inline"
    findElement("overlayContent").style.display = "inline"
}

/**
 * Event handler - page loaded
 */
window.addEventListener('load', () => {

    let el = findElement("imgBig")
    el.addEventListener("click", function(e){        
        findElement("overlay").style.display = "none"
        findElement("overlayContent").style.display = "none"
    }); 
    el = findElement("bluemap")
    el.addEventListener("click", function(e){        
        showZoom(this)
    });    
    el = findElement("greenmap")
    el.addEventListener("click", function(e){        
        showZoom(this)
    });    
    el = findElement("redmap")
    el.addEventListener("click", function(e){        
        showZoom(this)
    });    
});
