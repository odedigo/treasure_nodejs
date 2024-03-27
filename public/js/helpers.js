import * as util from "../../utils/util.js";


export function student_generateRiddle(teamData, index) {
    const rdl = teamData.riddles.filter((rdl) => (rdl.index == index))[0];
    var str = `<p class="fst-italic">
                ${rdl.riddle[0]}
            </p>
            <ul>`;

    var i = 1;
    for (; i < rdl.riddle.length - 1; i++) {
        str += `<li><i class="bi bi-check-circle"> ${rdl.riddle[i]}</i></li>`;
    }

    str += `</ul>
            <p class="final-inst">
                ${rdl.riddle[i]}
            </p>`;

    return str;
}
export function teacher_generateTeamRiddles(gameData, team) {
    var innerHtml = ""
    var html = `<div class="swiper-slide">
                    <div class="testimonial-item">
                    <p>
                        <i class="bx bxs-quote-alt-left quote-icon-left"></i>
                        {0}
                        <i class="bx bxs-quote-alt-right quote-icon-right"></i>
                    </p>
                    <img src="{1}" class="testimonial-img" alt="">
                    <h3>חידה {2}</h3>
                    <h4>{3}</h4>
                    </div>
                </div>`

    const data = gameData[team];

    for (var i=1 ; i <= 5 ; i++) {
        const rdl = data.riddles.filter((rdl) => (rdl.index == i) )[0]
        var vectors = calcVectors(rdl.vecSize, rdl.vecAngle)
        innerHtml += util.formatString(html, rdl.riddle, "/img/rdl/"+rdl.img, i, vectors)
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

export function ifEquals(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
}

export function compare (v1, operator, v2, options) {
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