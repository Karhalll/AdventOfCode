fs = require('fs')

fs.readFile('data.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
  
    const coords = dataToCoords(data);

    part1(coords, false);
    part1(coords, true);
    
});

function dataToCoords(data) {

    const lines = data.split('\n');

    let output = [];

    for (let i in lines) {

        const line = lines[i].trim();

        let coords = line.split(' -> ');
        coords = coords.map(ele => {
            return ele.split(',').map(Number);
        });

        output.push(coords);
    }

    return output;
}

function part1(coords, calcDiagonals) {

    let map = {};

    coords = coords.filter(function(ele) {
        const x1 = ele[0][0];
        const y1 = ele[0][1];

        const x2 = ele[1][0];
        const y2 = ele[1][1];

        const dx = x2 - x1;
        const dy = y2 - y1;

        const delta = Math.max(Math.abs(dx), Math.abs(dy));
        const stepX = (dx / Math.abs(dx)) || 0;
        const stepY = (dy / Math.abs(dy)) || 0;

        if (!calcDiagonals && (stepX != 0 && stepY != 0)) {
            return false;
        }

        for (let d = 0; d <= delta; d++) {

            const key = [x1 + (stepX * d) , y1 + (stepY * d)].join(',');

            if (key in map) {
                map[key] += 1;
            } else {
                map[key] = 1;
            }  
        }
    });

    let count = 0;

    Object.values(map).forEach(ele => {
        if (ele >= 2) {
            count++;
        }
    });

    console.log(count);
}