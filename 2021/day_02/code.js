fs = require('fs')

fs.readFile('data.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
  
    const directions = dataToSeatIDs(data);
    
    console.log('Part 1 result: ' + part1(directions));
    console.log('Part 2 result: ' + part2(directions));
});

function dataToSeatIDs(data) {

    const lines = data.split('\n');

    let numbers = [];

    for (let line in lines) {

        const number = lines[line].trim();

        numbers.push(number);
    }

    return numbers;
}

function part1(directions) {

    let position = [0, 0];

    for (let i = 0; i < directions.length; i++) {

        const direction = directions[i].split(' ');

        const way = direction[0][0];
        const moveStep = Number.parseInt(direction[1]);

        if (way === 'f') {
            position[0] += moveStep;
        } else if (way === 'd') {
            position[1] += moveStep;
        } else if (way === 'u') {
            position[1] -= moveStep;
        }
    }

    return position[0] * position[1];
}

function part2(directions) {

    let position = [0, 0];
    let aim = 0;

    for (let i = 0; i < directions.length; i++) {

        const direction = directions[i].split(' ');

        const way = direction[0][0];
        const moveStep = Number.parseInt(direction[1]);

        if (way === 'f') {
            position[0] += moveStep;
            position[1] += aim * moveStep;
        } else if (way === 'd') {
            aim += moveStep;
        } else if (way === 'u') {
            aim -= moveStep;
        }
    }

    return position[0] * position[1];
}