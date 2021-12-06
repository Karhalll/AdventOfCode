fs = require('fs')

const degRepDays = 8;
const daysAfterRepro = 6;
const daysOfRepro = 256;

fs.readFile('data_test.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }

    part1(data, 1);  
});

function part1(data, days) {

    
    let fishes = data.split(',').map(Number);
    console.log('Initial State: ' + fishes);

    let fishCount = 5;

    let fishSchool = [[...fishes]];

    while (days <= 80) {

        let range = fishes.length;

        for (let j = 0; j < range; j++) {

            if (fishes[j] == 0) {
                fishes.push(degRepDays);
                fishes[j] = daysAfterRepro;
            } else {
                fishes[j] -= 1;
            }
        }

        // console.log('Day: ' + days);
         console.log('Day ' + days + ': ' + fishes.length);
        // console.log('Day ' + days + ': ' + fishes.toString());
        days++;
    }

    // for (let i = 0; i < 80; i = i + 8) {

    //     fishCount = fishCount * fishCount;
    //     console.log('FOR Day ' + days + ': ' + fishCount);
    // }



    console.log("Fish Total: " + fishes.length);
}