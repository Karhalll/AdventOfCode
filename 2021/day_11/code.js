fs = require('fs')
let data = fs.readFileSync('data.txt', {encoding:'utf8'});

let energyLvLs;

const adjacent = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1]
];

part1();
part2();

function part1() {

    const steps = 100;

    energyLvLs = getDefaultEnergyLvLs();

    let flashCount = 0;
    for (let step = 0; step < steps; step++) {
        simulateStep();
        flashCount += countFlashes();
    }

    console.log('Part 1: ' + flashCount);
}

function part2() {

    energyLvLs = getDefaultEnergyLvLs();

    let step = 1;
    while (true) {

        simulateStep();

        if (countFlashes() == 100) break;

        step++;
    }

    console.log('Part 2: ' + step);
}

function getDefaultEnergyLvLs() {

    let lines = data.split('\n').map(a => a.trim());

    return lines.map(line => {
        return line.split('').map(Number);
    });
}

function simulateStep() {
    for (let line = 0; line < energyLvLs.length; line++) {
        for (let column = 0; column < energyLvLs[line].length; column++) {   
            addEnergy(line, column);
        }      
    }
}

function countFlashes() {

    let counter = 0;

    for (let line = 0; line < energyLvLs.length; line++) {
        for (let column = 0; column < energyLvLs[line].length; column++) {   
            if (energyLvLs[line][column] > 9) {
                counter++;
                energyLvLs[line][column] = 0;
            }
        }      
    }

    return counter;
}

function addEnergy(line, column) {
    energyLvLs[line][column] += 1;

    if (willFlash(line, column)) {
        transferEnergy(line, column);
    }
}

function willFlash(line, column) {
    return energyLvLs[line][column] == 10;
}

function transferEnergy(line, column) {
    for (let pos of adjacent) {

        const adjLine = line + pos[0];
        const adjColumn = column + pos[1];

        if (isInBounds(adjLine, adjColumn)) {
            addEnergy(adjLine, adjColumn);
        }
    }
}

function isInBounds(line, column) {
    return (
        energyLvLs[line] !== undefined && 
        energyLvLs[line][column] !== undefined
    );
}