fs = require('fs')

fs.readFile('data.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
  
    const measures = dataToSeatIDs(data);
    
    console.log('Part 1 result: ' + part1(measures));
    console.log('Part 2 result: ' + part2(measures));
});

function dataToSeatIDs(data) {

    const lines = data.split('\n');

    let numbers = [];

    for (let line in lines) {

        const number = Number.parseInt(lines[line].trim());

        numbers.push(number);
    }

    return numbers;
}

function part1(measures) {

    let increased = 0;

    for (let i = 1; i < measures.length; i++) {

        if (measures[i] > measures[i - 1]) {
            increased++;
        }
    }

    return increased;
}

function part2(measures) {

    let before = 0;
    let now = 0;

    let count = 0;

    for (let i = 2; i < measures.length; i++) {

        const sum = measures[i] + measures[i - 1] + measures[i - 2];

        if (i == 2) {
            before = sum;
            continue;
        }

        now = sum;

        if (now > before) {
            count++;
        }

        before = now;
    }

    return count;
}