fs = require('fs')

let data = fs.readFileSync('data.txt', {encoding:'utf8'});
let lines = data.split('\n').map(a => a.trim());

const hightArr = lines.map(line => {
    return line.split('').map(Number);
});
  
let tempBasin = {};

part1and2();

function part1and2() {
    
    let riskLvlSum = 0;
    let basins = [];

    hightArr.forEach((line, lineI) => {
        line.forEach((hight, columnI) => {
    
            if (isLowPoint(hight, lineI, columnI)) {
                riskLvlSum += 1 + hight;

                tempBasin = {};
                basins.push(calculateBasin(lineI, columnI));
            }
        });  
    });
    
    console.log("Part 1: " + riskLvlSum);
    
    basins.sort((a, b) => b - a); 
    console.log("Part 2: " + basins[0] * basins[1] * basins[2]);
}

function isLowPoint(hight, line, column) {

    const left = getHight(line, column - 1);
    const up = getHight(line - 1, column);
    const right = getHight(line, column + 1);
    const down = getHight(line + 1, column);

    return hight < Math.min(left, up, right, down);
}

function getHight(line, column) {
   
    if (hightArr[line] !== undefined) {
        if (hightArr[line][column] !== undefined) {
            return hightArr[line][column];
        }
    }

    return 100;
}

function calculateBasin(line, column) {

    const position = line.toString() + column.toString();
    if (position in tempBasin) {
        return 0;
    }

    const hight = getHight(line, column);
    if (hight > 8) {
        return 0;
    }
    
    tempBasin[position] = 0;

    const leftBasin = calculateBasin(line, column - 1);
    const upBasin = calculateBasin(line - 1, column);
    const rightBasin = calculateBasin(line, column + 1);
    const downBasin = calculateBasin(line + 1, column);

    return 1 + leftBasin + upBasin + rightBasin + downBasin;
}