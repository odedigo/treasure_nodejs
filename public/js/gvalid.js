
function validate(value, fieldId, fieldRules) {
    const rules = {
        field : fieldRules
    };
    const items = {
        field : value
    }
    const v = window.Iodine.assert(items, rules)
    if (!v.valid) {
        var el = document.getElementById(fieldId+"Error")
        if (el != null)
            el.innerHTML = v.fields.field.error
    }
    return v.valid
}

function validateVectors(sizeId, angleId, errId) {
    const size = document.getElementById(sizeId).value.trim()
    const angle = document.getElementById(angleId).value.trim()
    document.getElementById(errId).innerHTML = ""
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