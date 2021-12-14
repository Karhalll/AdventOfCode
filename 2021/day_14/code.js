fs = require('fs')
const DATA = fs.readFileSync('data.txt', {encoding:'utf8'});

const LINES = DATA.split('\n').map(a => a.trim())

const TEMPLATE = getTemplate();
const RULES = getRules();

let charsCount;

part1();
part2();

function part1() {

    charsCount = getDefaultLetterCount();
    let polymer = getDefaultPolymer();

    polymer = simXPolymerization(polymer, 10);

    answerForPart("Part 1", charsCount);
}

function part2() {

    charsCount = getDefaultLetterCount();
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

    let newRules = createEmpty();

    for (let pair of Object.keys(polymer)) {

        charsCount[polymer[pair].char] += polymer[pair].count;
    }

    for (let pair of Object.keys(polymer)) {

        let newPairs = getNewTwoPairs(pair, polymer[pair].char);

        
        for (let i in newPairs) { 

            let newPairKey = newPairs[i]; 

            let count = polymer[pair].count;

            newRules[newPairKey].count += count;
        }
    }

    return newRules;
}

function answerForPart(part, charsCount) {
    let counts = []

    for (let pair of Object.keys(charsCount)) {

        counts.push(charsCount[pair]);
    }

    let sortedCounts = counts.sort((a, b) => a - b);

    console.log(part + ": " + (sortedCounts[sortedCounts.length - 1] - sortedCounts[0]));
}

function getTemplate() {
    return LINES[0];
}

function getRules() {

    let temp = [];
    for (let i = 2; i < LINES.length; i++) {
        temp.push(LINES[i]);
    }

    return temp.map(a => a.split(" -> "));
}

function getDefaultPolymer() {

    let rules = {};

    for (let rule of RULES) {

        let ruleObject = createRule(rule);
        
        let key = getKeyFromRule(ruleObject);

        rules[key] = ruleObject[key];
    }

    for (let i = 0; i < TEMPLATE.length - 1; i++) {

        let pair = TEMPLATE[i] + TEMPLATE[i + 1];

        if (pair in rules) {
            rules[pair].count += 1;
        } else {
            rules[pair].count = 1;
        }
    }

    return rules;
}

function createRule(pair) {

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

function getKeyFromRule(rule) {

    return Object.keys(rule)[0];
}

function getDefaultLetterCount() {
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

function createEmpty() {
    let rules = {};

    for (let rule of RULES) {

        let ruleObject = createRule(rule);
        
        let key = getKeyFromRule(ruleObject);

        rules[key] = ruleObject[key];
    }

    return rules;
}