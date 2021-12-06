fs = require('fs')

const newDays = 8;
const afterRepDays = 6;
const days = 256;

let data = fs.readFileSync('data.txt', {encoding:'utf8'});
fishes = data.split(',').map(Number);
  
part1(fishes);

function part1(fishes) {

    let fishesToBorn = new Array(newDays + 1).fill(0);

    for (const fish of fishes) {
        fishesToBorn[fish]++;
    }

    for (let day = 0; day < days; day++) {
        const newFishes = fishesToBorn.shift();
        fishesToBorn.push(newFishes);
        fishesToBorn[afterRepDays] += newFishes;
    }

    console.log(fishesToBorn.reduce((sum, current) => sum + current));
}