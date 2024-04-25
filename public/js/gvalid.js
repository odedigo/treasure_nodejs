/**
 * gvalid.js
 * 
 * Helper functions to validate input data
 * 
 * Written by: Oded Cnaan
 * Date: March 2024
 */

/**
 * General validation
 * @param {*} value 
 * @param {*} fieldId 
 * @param {*} fieldRules 
 * @returns 
 */
function validate(value, fieldId, fieldRules) {
    console.log("validate")
    const rules = {
        field : fieldRules
    };
    const items = {
        field : value
    }
    var el = document.getElementById(fieldId+"Error")
    el.innerHTML = "&nbsp;"
    const v = window.Iodine.assert(items, rules)
    if (!v.valid) {
        if (el != null)
            el.innerHTML = v.fields.field.error
    }
    return v.valid
}

/**
 * Vector validation
 * @param {*} sizeId 
 * @param {*} angleId 
 * @param {*} errId 
 * @returns 
 */
function validateVectors(sizeId, angleId, errId) {
    const size = document.getElementById(sizeId).value.trim()
    const angle = document.getElementById(angleId).value.trim()
    document.getElementById(errId).innerHTML = "&nbsp;"
    if (size === '' && angle === '')
        return true
    if (size === '' && angle !== '') {
        intermediateMsg(errId,fstrings.game.blankVecSize)
        return false
    }
    if (size !== '' && angle === '') {
        intermediateMsg(errId,fstrings.game.blankVecAngle)
        return false
    }
    if (angle < 0 || angle > 360) {
        intermediateMsg(errId,fstrings.game.invalidVecAngle)
    }
}