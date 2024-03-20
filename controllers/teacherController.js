"use strict";
const renderTeacher = (req, res) => {
    res.render('teacher', { jsscript: './js/teacher.js'});
}

module.exports = {
    renderTeacher
};