
function validate(value, fieldId, fieldRules) {
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

function validateVectors(sizeId, angleId, errId) {
    const size = document.getElementById(sizeId).value.trim()
    const angle = document.getElementById(angleId).value.trim()
    document.getElementById(errId).innerHTML = "&nbsp;"
    if (size === '' && angle === '')
        return true
    if (size === '' && angle !== '') {
        intermediateMsg(errId,"גודל הוקטור לא יכול להיות ריק")
        return false
    }
    if (size !== '' && angle === '') {
        intermediateMsg(errId,"כיוון הוקטור לא יכול להיות ריק")
        return false
    }
    if (angle < 0 || angle > 360) {
        intermediateMsg(errId,"כיוון הוקטור בין 0 ל 360 מעלות")
    }
}