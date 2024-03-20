"use strict";
const renderHome = (req, res) => {
    res.render('home' , { jsscript: './js/student.js'});
}

module.exports = {
    renderHome
};
