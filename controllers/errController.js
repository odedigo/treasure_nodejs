import strings from "../public/lang/strings.js"

"use strict";
export function renderErr(req, res) {
    res.render('err' , { 
        title: strings.title.error
    });
}

