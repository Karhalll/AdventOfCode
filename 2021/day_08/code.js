fs = require('fs')

let data = fs.readFileSync('data.txt', {encoding:'utf8'});
let lines = data.split('\n').map(a => a.trim());

const segmentsTemp = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

const uniqueSegmentsDigits = { // {segments: digit}
    2: 1,
    4: 4,
    3: 7,
    7: 8
}
  
part1();
part2();

function part1() {

    let uniqueDigitsInLine = lines.map(a => {

        return a.split('|')[1].trim().split(' ').filter(b => {
            return (Object.keys(uniqueSegmentsDigits).includes(b.length.toString()));
        });
    })

    console.log('Part 1: ' + uniqueDigitsInLine.reduce((prev, curr) => {
        return prev + curr.length;
    }, 0));
}

function part2() { 

    const digitPatterns = {
        abcefg: 0,
        cf: 1,
        acdeg: 2,
        acdfg: 3,
        bcdf: 4,
        abdfg: 5,
        abdefg: 6,
        acf: 7,
        abcdefg: 8,
        abcdfg: 9
    };

    let numbers = lines.map(line => {

        const testEntries = line.split('|')[0].trim().split(' ');

        const switchedMap = getSwitchedMap(decryptEntries(testEntries));

        let digitArr = line.split('|')[1].trim().split(' ').map(pattern => {

            const length = pattern.length;

            if (length in uniqueSegmentsDigits) {
                return uniqueSegmentsDigits[length].toString();
            }

            if (length == 5 || length == 6) {

                const decPat = getDecPattern(pattern, switchedMap);
                const sorted = decPat.split('').sort((a, b) => a.localeCompare(b)).join('');

                return digitPatterns[sorted].toString();
            }
        });

        let stringNumber = '';
        digitArr.forEach(x => stringNumber += x);

        return Number.parseInt(stringNumber);
    });

    let sum = numbers.reduce((a,b) => a + b, 0);

    console.log('Part 2: ' + sum);
}

function decryptEntries(testEntries) {

    let output = {
        a: '',
        b: '',
        c: '',
        d: '',
        e: '',
        f: '',
        g: ''
    };

    const one = getUniqueNumberPattern(testEntries, 2);
    const four = getUniqueNumberPattern(testEntries, 4);
    const seven = getUniqueNumberPattern(testEntries, 3);

    for (let i = 0; i < seven.length; i++) {
        if (!one.includes(seven[i])) {
            output.a = seven[i];
            break;
        }
    }

    const concatEntries = testEntries.join('');

    segmentsTemp.forEach((seg, i) => {

        const occur = [...concatEntries].filter(char => char == seg).length;

        if (occur == 6) output.b = seg;
        if (occur == 4) output.e = seg;
        if (occur == 9) output.f = seg;
        if (occur == 8 && seg != output.a) output.c = seg; 
    });

    const arr = [output.b, output.c, output.f];
   
    for (let i = 0; i < four.length; i++) {
        if (!arr.includes(four[i])) {
            output.d = four[i];
            break;
        }
    }

    let done = Object.values(output);
    done.pop();
   
    for (let i = 0; i < segmentsTemp.length; i++) {
        if (!done.includes(segmentsTemp[i])) {
            output.g = segmentsTemp[i];
            break;
        }
    }
    
    return output;
}

function getUniqueNumberPattern(entries, segments) {
    return entries.filter(entry => {
        return entry.length == segments;
    })[0];
}

function getDecPattern(pattern, decMap) {

    let output = '';
    
    for (let char = 0; char < pattern.length; char++) {

        output += decMap[pattern[char]];
    }

    return output;
}

function getSwitchedMap(map) {
    let switchedMap = {};

    for (let key in map) {
        switchedMap[map[key]] = key;
    }
    
    return switchedMap;
}