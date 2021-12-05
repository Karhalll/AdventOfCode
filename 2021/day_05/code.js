fs = require('fs')

fs.readFile('data.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
  
    const coords = dataToCoords(data);

    part1(coords);
    
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

function part1(coords) {

    let map = {};

    coords = coords.filter(function(ele) {
        const x1 = ele[0][0];
        const y1 = ele[0][1];

        const x2 = ele[1][0];
        const y2 = ele[1][1];

        const dx = x2 - x1;
        const dy = y2 - y1;

        if (x1 == x2) {

            let lineRange = [y1, y2];
            lineRange.sort((a, b) => a - b);

            for (let y = lineRange[0]; y <= lineRange[1]; y++) {

                const key = [x1, y].join(',');

                if (key in map) {
                    map[key] += 1;
                } else {
                    map[key] = 1;
                }   
            }

            return true;
        } else if (y1 == y2) {

            let lineRange = [x1, x2];
            lineRange.sort((a, b) => a - b);

            for (let x = lineRange[0]; x <= lineRange[1]; x++) {

                const key = [x, y1].join(',');

                if (key in map) {
                    map[key] += 1;
                } else {
                    map[key] = 1;
                }   
            }

            return true;
        } else {

            delta = Math.abs(dx);
            deltaX = dx / Math.abs(dx);
            deltaY = dy / Math.abs(dy);

            for (let d = 0; d < delta; d++) {

                const key = [x1 + (deltaX * d) , y1 + (deltaY * d)].join(',');

                if (key in map) {
                    map[key] += 1;
                } else {
                    map[key] = 1;
                }  
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