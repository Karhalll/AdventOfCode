Array.prototype.hasCave = function(cave) {
    return this[0] === cave || this[1] === cave;
}

Array.prototype.getOtherCave = function(cave) {
    if (this[0] === cave) {
        return this [1];
    }
    return this[0];
}

fs = require('fs')
const DATA = fs.readFileSync('data.txt', {encoding:'utf8'});

const CONNECTIONS = DATA.split('\n').map(a => a.trim()).map(l => l.split('-'));

let pathCount = 0;

part1();
part2();

function part1() {

    findConnectedCaves('start', [], true);
    console.log("Part 1: " + pathCount);
}

function part2() {

    pathCount = 0;

    findConnectedCaves('start', [], false);
    console.log("Part 2: " + pathCount);
}

function findConnectedCaves(currentCave, visitedSmallCaves, someSmallCaveVisitedTwice) {

    for (let connection of CONNECTIONS) {

        if (connection.hasCave(currentCave)) {

            const connectedCave = connection.getOtherCave(currentCave);
            tryCave(connectedCave, [...visitedSmallCaves], someSmallCaveVisitedTwice);
        }
    }   
}

function tryCave(cave, visitedSmallCaves, someSmallCaveVisitedTwice) {

    if (isEndOrStart(cave)) return;

    if (isSmallCave(cave)) {

        if (visitedSmallCaves.indexOf(cave) > -1) { // is already visited small cave

            if (someSmallCaveVisitedTwice) return;

            someSmallCaveVisitedTwice = true; 
        }

        visitedSmallCaves.push(cave);
    }
    
    findConnectedCaves(cave, [...visitedSmallCaves], someSmallCaveVisitedTwice);
}



function isEndOrStart(cave) {
    if (cave === 'start') return true;

    if (cave === 'end') {
        pathCount++;
        return true;
    }

    return false;
}

function isSmallCave(cave) {
    return cave === cave.toLowerCase();
}