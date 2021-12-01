fs = require('fs')

fs.readFile('data.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
  
    const seatIDs = dataToSeatIDs(data);

    console.log('Phase 1 result: ' + Math.max(...seatIDs));

    seatIDs.sort((a, b) => a - b);
    
    const minID = Math.min(...seatIDs);

    for (let i = 0; i < seatIDs.length; i++) {

        if (seatIDs[i] != i + minID) {
            console.log('Phase 2 result: ' + (i + minID));
            break;
        }
    }
});

function dataToSeatIDs(data) {

    const lines = data.split('\n');

    let seatIDs = [];

    for (let line in lines) {

        const pattern = [...lines[line].trim()];

        const row = decryptPattern(pattern, 0, 6, 127, 'F');
        const seat = decryptPattern(pattern, 7, 9, 7, 'L');

        seatIDs.push(row * 8 + seat);
    }

    return seatIDs;
}

function decryptPattern(pattern, startIndex, endIndex, upperLimit, lowerLimitSymbol) {

    let rowRange = [0, upperLimit];

    for (let i = startIndex; i <= endIndex; i++) {

        const symbol = pattern[i];
        const newLimit = (rowRange[1] - rowRange[0] + 1) / 2;

        if (symbol === lowerLimitSymbol) {
            rowRange[1] -= newLimit;
        } else {
            rowRange[0] += newLimit;
        }
    }

    return rowRange[0];
}