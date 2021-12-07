fs = require('fs')

let data = fs.readFileSync('data.txt', {encoding:'utf8'});
positions = data.split(',').map(Number);
  
part1(positions);
part2(positions);

function part1(positions) {

    const min = Math.min(...positions);
    const max = Math.max(...positions);

    let fuelMin = Number.MAX_SAFE_INTEGER;

    for (let target = min; target <= max; target++) {

        let fuelSpend = positions.reduce((sum, current) => {
            return sum + Math.abs(current - target);
        }, 0);

        if (fuelSpend < fuelMin) {
            fuelMin = fuelSpend;
        }
    }

    console.log('Part1: ' + fuelMin);
}

function part2(positions) {

    const min = Math.min(...positions);
    const max = Math.max(...positions);

    let fuelMin = Number.MAX_SAFE_INTEGER;

    for (let target = min; target <= max; target++) {

        let fuelSpend = positions.reduce((sum, current) => {

            const path = Math.abs(current - target);
            let pathCost = 0;

            for (let step = 1; step <= path;step++) {
                pathCost += step;
            }

            return sum + pathCost;
        }, 0);

        if (fuelSpend < fuelMin) {
            fuelMin = fuelSpend;
        }
    }

    console.log('Part1: ' + fuelMin);
}