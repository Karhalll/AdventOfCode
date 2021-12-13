fs = require('fs')
const DATA = fs.readFileSync('data.txt', {encoding:'utf8'});

const LINES = DATA.split('\n').map(a => a.trim())

const COORDS = getCoords();
const FOLDS = getFolds();

part1();
part2();

function part1() {

    let paper = [...COORDS];

    paper = foldPaper(FOLDS[0], paper);

    console.log('Part 1: ' + paper.length);
}

function part2() {

    let paper = [...COORDS];
    
    for (let fold of FOLDS) {

        paper = foldPaper(fold, paper);       
    }

    
    let coordsArrs = paper.map(a => strCoordToNum(a));
    let Xs = coordsArrs.map(a => a[0]);
    let Ys = coordsArrs.map(a => a[1]);
    

    let Xmax = Math.max(...Xs);
    let Ymax = Math.max(...Ys);

    console.log('Part 2:');

    for (let y = 0; y <= Ymax; y++) {

        let line = '';
        
        for (let x = 0; x <= Xmax; x++) {

            if(paper.indexOf(numCoordToString([x, y])) == -1) {
                line += '.';
            } else {
                line += '#';
            }
        }
       
        console.log(line);
    }
}

function foldPaper(fold, paper) {

    const FOLD_AXIS = fold[0];
    const FOLD_INDEX = fold[1];


    let index;
    if (FOLD_AXIS === 'x') {
        index = 0;
    }
    if (FOLD_AXIS === 'y') {
        index = 1;
    }

    let base = [];
    let flipped = [];

    for (let coords of paper) {

        let numCoors = strCoordToNum(coords);

        if (numCoors[index] < FOLD_INDEX) {
            base.push(coords);
        }

        if (numCoors[index] > FOLD_INDEX) {
            
            let newAxis = Math.abs(numCoors[index] - 2*FOLD_INDEX);
            numCoors[index] = newAxis;

            flipped.push(numCoordToString(numCoors));
        }
    }

    for (let coords of flipped) {

        if (base.indexOf(coords) == -1) {
            base.push(coords);
        }
    }

    return [...base];
}

function getCoords() {
    return LINES.filter(line => Number.isInteger(parseInt(line[0])));
}

function getFolds() {
    return LINES.filter(line => line[0] === 'f').map(a => {
        
        const fold = a.split(' ')[2].split('=');
        return [fold[0], Number.parseInt(fold[1])];
    });
}

function strCoordToNum(strCoord) {

    return strCoord.split(',').map(Number);
}

function numCoordToString(numCoord) {

    return numCoord[0].toString() + ',' + numCoord[1].toString();
}