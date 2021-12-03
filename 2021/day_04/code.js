fs = require('fs')

fs.readFile('data.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
  
    const lines = dataToSeatIDs(data);
    
    console.log('Part 1 result: ' + part1(lines));
    console.log('Part 2 result: ' + part2(lines));
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

function part1(lines) {

    let occurrences = [];

    for (let i = 0; i < lines[0].length; i++) {
        occurrences.push(occurrence(lines, i));
    }

    let binaryRates = ['',''];

    for (let i = 0; i < occurrences.length; i++) {

        if (occurrences[i][0] > occurrences[i][1]) {
            binaryRates[0] += '0';
            binaryRates[1] += '1';
        } else {
            binaryRates[0] += '1';
            binaryRates[1] += '0';
        }
    }

    let gamaRate = Number.parseInt(binaryRates[0], 2);
    let epsilonRate = Number.parseInt(binaryRates[1], 2);

    return gamaRate * epsilonRate;
}

function part2(lines) {

    const oxygenBinary = BinaryNumber(lines, 0, '0', '1');
    const CO2Binary = BinaryNumber(lines, 0, '1', '0');

    const oxygenNumber = Number.parseInt(oxygenBinary, 2);
    const CO2Number = Number.parseInt(CO2Binary, 2);

    return oxygenNumber * CO2Number;
}

function BinaryNumber(lines, digitIndex, maxDigit, minDigit) {

    if (lines.length == 1) {
        return lines[0];
    }

    let currentOccurrences = occurrence(lines, digitIndex);
    let filteredLines = [];

    for (let j = 0; j < lines.length; j++) {

        const digit = lines[j][digitIndex];

        if (currentOccurrences[0] > currentOccurrences[1]) {
            if (digit === maxDigit) {
                filteredLines.push(lines[j]);
            }
        } else {
            if (digit === minDigit) {
                filteredLines.push(lines[j]);
            }
        }
    }

    return BinaryNumber(filteredLines, digitIndex + 1, maxDigit, minDigit);
}

function occurrence(lines, digitIndex) {
    
    let occurrence = [0,0];

    for (let i = 0; i < lines.length; i++) {

        const digit = lines[i][digitIndex];

        if (digit === '0') {
            occurrence[0] += 1;
        } else if (digit === '1') {
            occurrence[1] += 1;
        }
    }

    return occurrence;
}