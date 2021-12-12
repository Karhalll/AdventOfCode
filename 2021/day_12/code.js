fs = require('fs')
let data = fs.readFileSync('data.txt', {encoding:'utf8'});

const pathArrs = data
    .split('\n')
    .map(a => a.trim())
    .map(line => {
        return line.split('-');
    })
;

let pathCount = 0;

part1();
part2();

function part1() {

    calculatePaths();
    console.log("Part 1: " + pathCount);
}

function part2() {

    pathCount = 0;

    calculatePaths(true);
    console.log("Part 2: " + pathCount);
}

function calculatePaths(part2) {
    for (let pathArr of pathArrs) {

        let next;

        if (pathArr[0] === 'start') {
            next = pathArr[1];
        } else if (pathArr[1] === 'start') {
            next = pathArr[0];
        } else {
            continue;
        }

        if (part2) {
            nextStep2(next, [], false);
        } else {
            nextStep(next, []);
        }
    }
}

function nextStep(next, visits) {

    if (!canContinue(next)) return;
    
    if (next === next.toLowerCase()) {

        if (visits.indexOf(next) > -1) return;

        visits.push(next);
    }

    for (let pathArr of pathArrs) {

        if (pathArr[0] === next) {     
            nextStep(pathArr[1], [...visits]);
        }
        if (pathArr[1] === next) {       
            nextStep(pathArr[0], [...visits]);
        }
    } 
}


function nextStep2(next, visits, smallCaveVisitedTwice) {

    if (!canContinue(next)) return;

    if (next === next.toLowerCase()) {

        if (visits.indexOf(next) > -1) {

            if (smallCaveVisitedTwice) return;

            smallCaveVisitedTwice = true;

        }

        visits.push(next);
    }

    for (let pathArr of pathArrs) {

        if (pathArr[0] === next) {   
            nextStep2(pathArr[1], [...visits], smallCaveVisitedTwice);
        }

        if (pathArr[1] === next) {    
            nextStep2(pathArr[0], [...visits], smallCaveVisitedTwice);
        }
    } 
}

function canContinue(next) {
    if (next === 'start') return false;

    if (next === 'end') {
        pathCount++;
        return false;
    }

    return true;
}
