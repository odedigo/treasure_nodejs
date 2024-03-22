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
export function bar() {
    return "BAR!";
}