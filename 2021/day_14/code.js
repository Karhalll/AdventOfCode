fs = require('fs')
const DATA = fs.readFileSync('data.txt', {encoding:'utf8'});
const LINES = DATA.split('\n').map(a => a.trim())

const TEMPLATE = LINES[0];
const RULES = getRules();

let charsCount;

part1();
part2();

function part1() {

    charsCount = defaultLetterCount();
    let polymer = getDefaultPolymer();

    polymer = simXPolymerization(polymer, 10);

    answerForPart("Part 1", charsCount);
}

function part2() {

    charsCount = defaultLetterCount();
    let polymer = getDefaultPolymer();

    polymer = simXPolymerization(polymer, 40);

    answerForPart("Part 2", charsCount);
}

function simXPolymerization(polymer, cycles) {

    for (let step = 1; step <= cycles; step++) {

        polymer = polymerization(polymer);
    }

    return polymer;
}

function polymerization(polymer) {

    let newPolymer = emptyPolymer();

    for (let pair of Object.keys(polymer)) {

        charsCount[polymer[pair].char] += polymer[pair].count;
    }

    for (let pair of Object.keys(polymer)) {

        let newPairs = getNewTwoPairs(pair, polymer[pair].char);
        
        newPolymer[newPairs[0]].count += polymer[pair].count;
        newPolymer[newPairs[1]].count += polymer[pair].count;
    }

    return newPolymer;
}

function answerForPart(part, charsCount) {
  
    let sortedCounts = Object.values(charsCount).sort((a, b) => a - b);

    console.log(part + ": " + (sortedCounts[sortedCounts.length - 1] - sortedCounts[0]));
}

function getRules() {

    return LINES.filter((a,i) => i > 1).map(a => a.split(" -> "));
}

function getDefaultPolymer() {

    let newPolymer = emptyPolymer();

    for (let i = 0; i < TEMPLATE.length - 1; i++) {

        let pair = TEMPLATE[i] + TEMPLATE[i + 1];

        if (pair in newPolymer) {
            newPolymer[pair].count += 1;
        } else {
            newPolymer[pair].count = 1;
        }
    }

    return newPolymer;
}

function createPairObj(pair) {

    return {
        [pair[0]]: {
            char: pair[1],
            count: 0
        } 
    }
}

function getNewTwoPairs(key, char) {

    return [key[0] + char, char + key[1]];
}

function defaultLetterCount() {
    let output = {};

    for (let rule of RULES) {
       
        output[rule[1]] = 0;
    }

    for (let char of TEMPLATE) {
        if (char in output) {
            output[char] += 1;
        }
    }

    return output;
}

function emptyPolymer() {

    let emptyPolymer = {};

    for (let rule of RULES) {

        let pairObj = createPairObj(rule); 
        let key = Object.keys(pairObj)[0];

        emptyPolymer[key] = pairObj[key];
    }

    return emptyPolymer;
}