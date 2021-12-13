fs = require('fs')
const DATA = fs.readFileSync('data.txt', {encoding:'utf8'});

const LINES = DATA.split('\n').map(a => a.trim())

const COORDS = getCoords();
const FOLDS = getFolds();

part1();
part2();

function part1() {

    const FOLD_INS = FOLDS[0];
    const FOLD_AXIS = FOLD_INS[0];
    const FOLD_INDEX = FOLD_INS[1];


    let index;
    if (FOLD_AXIS === 'x') {
        index = 0;
    }
    if (FOLD_AXIS === 'y') {
        index = 1;
    }

    let base = [];
    let flipped = [];

    for (let coords of COORDS) {

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

    console.log('Part 1: ' + base.length);
}

function part2() {

    let final = COORDS;
    
    for (let fold of FOLDS) {
    
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

        for (let coords of final) {

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

        final = base;
    }

    let finalArr = final.map(a => strCoordToNum(a));

    let Xs = finalArr.map(a => a[0]);
    let Ys = finalArr.map(a => a[1]);

    let Xmin = Math.min(...Xs);
    let Ymin = Math.min(...Ys);

    let Xmax = Math.max(...Xs);
    let Ymax = Math.max(...Ys);

    console.log('Part 2:');

    for (let y = Xmin; y <= Ymax; y++) {

        let line = '';
        
        for (let x = Ymin; x <= Xmax; x++) {

            if(final.indexOf(numCoordToString([x, y])) == -1) {
                line += '.';
            } else {
                line += '#';
            }
        }

       
        console.log(line);
    }
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