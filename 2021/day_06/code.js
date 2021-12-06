fs = require('fs')

const degRepDays = 8;
const daysAfterRepro = 6;
const daysOfRepro = 256;

fs.readFile('data.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }

    part1(data);  
});

function part1(data) {

    
    let fishes = data.split(',').map(Number);

    let fishSchool = [[...fishes], []];

    let length = 5;

    for (let i = 1; i <= 256; i++) {

        const dailyRange = fishSchool.length;

        for (let x = 0; x < dailyRange; x++) {

            const packageRange = fishSchool[x].length;
    
            for (let j = 0; j < packageRange; j++) {

                if (fishSchool[x][j] == 0) {
                
                    fishSchool[fishSchool.length - 1].push(degRepDays + 1);
                    fishSchool[x][j] = daysAfterRepro;
                } else {
                    fishSchool[x][j] -= 1;
                }
            }
        }

        if (i == 0) {continue;}

        if (i % 6 == 0) {   

            length += fishSchool[fishSchool.length - 1].length    
            fishSchool.push([]);
        }

        // console.log('Day report: ' + fishSchool);

        // console.log('Day: ' + days);
         console.log('Day ' + i + ': ' + length);
        // console.log('Day ' + days + ': ' + fishes.toString());
    }

    console.log("Fish Total: " + (length + fishSchool[fishSchool.length - 1].length));
}