/**
 * helpers.js
 * 
 * Handelbars helper functins
 * 
 * Written by: Oded Cnaan
 * Date: March 2024
 */
import * as util from "../../utils/util.js";

/**
 * Generate the riddle in the student site
 * @param {*} teamData 
 * @param {*} index 
 * @returns 
 */
export function student_generateRiddle(teamData, index) {
    const rdl = teamData.riddles.filter((rdl) => (rdl.index == index))[0];
    var i = 1;
    var first = rdl.riddle[0]
    if (rdl.riddle.length === 1) {
        first = ""
        i = 0
    }
    if (first === undefined)
        first = ""
    var str = `<p class="fst-italic">
                ${first}
            </p>
            <ul>`;

    
    for (; i < rdl.riddle.length - 1; i++) {
        if (rdl.riddle[i] !== undefined)
            str += `<li><i class="bi bi-check-circle"> ${rdl.riddle[i]}</i></li>`;
        else
            str += `<li><i class="bi bi-check-circle">&nbsp;</i></li>`;
    }

    var lst = rdl.riddle[i]
    if (lst === undefined)
        lst = ""
    str += `</ul>
            <p class="final-inst">
                ${lst}
            </p>`;

    return str;
}

/**
 * Generate the riddle in the teacher site
 * @param {*} gameData 
 * @param {*} team 
 * @returns 
 */
export function teacher_generateTeamRiddles(gameData, team) {
    var innerHtml = ""
    var html = `<div class="swiper-slide">
                    <div class="testimonial-item">
                    <p>
                        <i class="bx bxs-quote-alt-left quote-icon-left"></i>
                        {0}
                        <i class="bx bxs-quote-alt-right quote-icon-right"></i>
                    </p>
                    <img src="https://mashar.s3.eu-north-1.amazonaws.com{1}" class="testimonial-img" alt="">
                    <h3>חידה {2}</h3>
                    <h4>{3}</h4>
                    </div>
                </div>`

    const data = gameData[team];

    for (var i=1 ; i <= 5 ; i++) {
        const rdl = data.riddles.filter((rdl) => (rdl.index == i) )[0]
        var vectors = calcVectors(rdl.vecSize, rdl.vecAngle)
        innerHtml += util.formatString(html, rdl.riddle, "/riddles/"+gameData.branch+"/"+rdl.img, i, vectors)
    }
    return innerHtml
}

/**
 * Generates a string with all response vectors
 * @param {*} vecSize 
 * @param {*} vecAngle 
 * @returns 
 */
function calcVectors(vecSize, vecAngle) {
    var result = ""
    for (var i=0; i < vecSize.length ; i++) {
        result += `(${vecSize[i]}, ${vecAngle[i]}°)`
        if (i<vecSize.length-1)
            result += "<br/>"
    }
    return result
}

/**
 * Check if equal
 * @param {*} arg1 
 * @param {*} arg2 
 * @param {*} options 
 * @returns 
 */
export function ifEquals(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
}

/**
 * Compares 2 variables
 * @param {*} v1 
 * @param {*} operator 
 * @param {*} v2 
 * @param {*} options 
 * @returns 
 */
export function compare (v1, operator, v2, options) {
    if (v1 === undefined || v2 === undefined)
        return options.fn(this);
    'use strict';
    var operators = {
      '==': v1 == v2 ? true : false,
      '===': v1 === v2 ? true : false,
      '!=': v1 != v2 ? true : false,
      '!==': v1 !== v2 ? true : false,
      '>': v1 > v2 ? true : false,
      '>=': v1 >= v2 ? true : false,
      '<': v1 < v2 ? true : false,
      '<=': v1 <= v2 ? true : false,
      '||': v1 || v2 ? true : false,
      '&&': v1 && v2 ? true : false
    }
    if (operators.hasOwnProperty(operator)) {
      if (operators[operator]) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
    return console.error('Error: Expression "' + operator + '" not found');
  }

  export function isdef(v1) {
    return (v1 !== undefined)
  }
/**
 * Checks if a value is in the given array
 * @param {*} value 
 * @param {*} arr 
 * @param {*} options 
 * @returns 
 */  
export function includes(value, arr, options) {
    if (!Array.isArray(arr)) {
        return options.inverse(this);
    }
    if(arr.includes(value)) {   
        return options.fn(this);
    }    
    return options.inverse(this);
} 

/**
 * Converts a list to an array
 * (toArray "apps" "mng") will become ["apps","mng"]
 * @param  {...any} values 
 * @returns 
 */
export function toArray (...values) {
    return values
}

export function json(value) {
    return JSON.stringify(value)
}

export function arr(value) {
    return Array.from(value)
}

/**
 * Handle pagination bottom options
 * @param {*} totalDocs 
 * @param {*} numPerPage 
 * @param {*} currPage 
 * @param {*} url 
 * @returns 
 */
export function pagination(totalDocs, numPerPage, currPage, url) {
    currPage = parseInt(currPage)
    if (totalDocs < numPerPage)
        return
    var numBlocks = Math.ceil(totalDocs / numPerPage)
    if (numBlocks == 1)
        return

    var prev = `<nav aria-label="...">
                  <ul class="pagination">`
    /*if (numBlocks > 1 && currPage > 1)
        prev = `${prev}<li class="page-item"><a class="page-link" href="${url}/1">ראשון</a></li>`
    else 
        prev = `${prev}<li class="page-item disabled"><span class="page-link">ראשון</span></li>`*/

    if (currPage == 1) {
        prev = `${prev}<li class="page-item disabled"><span class="page-link">קודם</span></li>`
    }
    else 
        prev = `${prev}<li class="page-item"><a class="page-link" href="${url}/${currPage-1}">הקודם</a></li>`

    var before = ''    
    for (var i=1; i<currPage; i++) {
        before = `${before}<li class="page-item"><a class="page-link" href="${url}/${i}">${i}</a></li>`
    }
    
    var active = `<li class="page-item active"><span class="page-link">${currPage}<span class="sr-only">(current)</span></span></li>`
    
    var after = ''
    var j = 0
    for (j=currPage+1; j<=numBlocks; j++) {
        after = `${after}<li class="page-item"><a class="page-link" href="${url}/${j}">${j}</a></li>`      
    }
    var nextp = `<li class="page-item`
    if (currPage == numBlocks) {
        nextp = `${nextp} disabled"><span class="page-link">הבא</span></li>`
        nextp = `${nextp}<li class="page-item disabled"><span class="page-link">אחרון</span></li>`
    }
    else {
        nextp = `${nextp}"><a class="page-link" href="${url}/${currPage+1}">הבא</a></li>`
        /*if (numBlocks > 1)
          nextp = `${nextp}<a class="page-link" href="${url}/${numBlocks}">אחרון</a></li>`
        else
          nextp = `${nextp}<li class="page-item disabled"><span class="page-link">אחרון</span></li>`*/
        nextp = `${nextp}</ul></nav>`
    }

    return `${prev}${before}${active}${after}${nextp}`
}