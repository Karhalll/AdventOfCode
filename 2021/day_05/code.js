fs = require('fs')

let draw = [];

fs.readFile('data.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
  
    const bingos = dataToSeatIDs(data);

    part1(bingos);
    
    // console.log(bingos);
    // console.log('Part 2 result: ' + part2(lines));
});

function dataToSeatIDs(data) {

    const lines = data.split('\n');

    let output = [];
    let bingo = [];

    for (let line in lines) {

        let number = lines[line].trim();

        if (line == 0) {
            draw = number.split(',').map(Number)
            continue;
        }

        if (number === ''){
            if (bingo.length != 0) {
                output.push(bingo);
                bingo = [];
            }
           
            continue;
        }

        bingo.push(number.split('  ').join(',').split(' ').join(',').split(',').map(string => {
                let obj = {};
                obj[Number.parseInt(string)] = false;
                return obj;
            }));
    }

    output.push(bingo);

    return output;
}

function part1(bingos) {
   
    for (let index in draw) {

        
        if (bingos.length == 0) {
            console.log('stopping');
            console.log(bingos);
            break;
        }
        
        const drawnNumber = draw[index];
        const isWinning = markBingos(bingos, drawnNumber);

        if (isWinning.length > 0) {
            console.log(isWinning);
            bingos = bingos.filter(function(el, i) {
                return !(isWinning.indexOf(i) > -1);
            });
        }
    }   
}

function markBingos(bingos, drawnNumber) {

    let bingosIs = [];

    for (let bingosI in bingos) {

        let bingo = bingos[bingosI];

        for (let lineI in bingo) {
            for (let columnI in bingo[lineI]) {
                if (drawnNumber in bingo[lineI][columnI]) {
                    
                    bingo[lineI][columnI][drawnNumber] = true;
                
                    let isWinningBingo = checkBingo(bingo, lineI, columnI);       
                    if (isWinningBingo) {
                        calculateBingo(bingo, drawnNumber);
                        bingosIs.push(Number.parseInt(bingosI));
                    }
                }
            }
        }
    }

    return bingosIs;
}

function checkBingo(bingo, lineI, columnI) {

    const lineCheck = checkLine(bingo, lineI);
    const columnCheck = checkColumn(bingo, columnI);
    
    if (lineCheck === true || columnCheck === true) {
        return true;
    }

    return false;
}

function checkLine(bingo, lineI) {
    for (let numberI in bingo[lineI]) {

        let numObj = bingo[lineI][numberI];
        if (numObj[Object.keys(numObj)[0]] == false) {
            return false;
        }
    }

    return true;
}

function checkColumn(bingo, columnI) {
    for (let line in bingo) {

        let numObj = bingo[line][columnI];
        if (numObj[Object.keys(numObj)[0]] == false) {
            return false;
        }
    }

    return true;
}

function calculateBingo(bingo, drawnNumber) {

    let sum = 0;

    for (let lineI in bingo) {
        for (let columnI in bingo[lineI]) {

            const numObj = bingo[lineI][columnI];

            if (numObj[Object.keys(numObj)[0]] == false) {
                
                sum += Number.parseInt(Object.keys(numObj)[0]);
            }
        }
    }

    console.log("answer: " + (sum * drawnNumber) + ' sum: ' + sum + ' num: ' + drawnNumber);
}