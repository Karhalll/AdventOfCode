fs = require('fs')

let data = fs.readFileSync('data.txt', {encoding:'utf8'});
let lines = data.split('\n').map(a => a.trim());

const opens = ['(', '[', '{', '<'];
const close = [')', ']', '}', '>'];


part1();
part2();

function part1() { 
    
    const scoreTable = {
        ')': 3,
        ']': 57,
        '}': 1197,
        '>': 25137
    }

    let score = {
        ')': 0,
        ']': 0,
        '}': 0,
        '>': 0
    }
    
    for (let line of lines) {

        let tempChunk = [];

        for (let bracket of line) {
            if (opens.indexOf(bracket) > -1) {
                tempChunk.push(bracket);
            } else {
                
                const i = close.indexOf(bracket);
                if (tempChunk[tempChunk.length - 1] === opens[i]) {
                    tempChunk.pop();
                } else {
                    score[bracket] += 1;
                    break;
                }
            }
        }
    }

    let scoreSum = 0;

    for (key in scoreTable) {
        scoreSum += scoreTable[key] * score[key];
    }

    console.log("Part 1: " + scoreSum);
}

function part2() {

    const incompleteLines = lines.filter((line => {

        let tempChunk = [];

        for (let bracket of line) {
            if (opens.indexOf(bracket) > -1) {
                tempChunk.push(bracket);
            } else {
                
                const i = close.indexOf(bracket);
                if (tempChunk[tempChunk.length - 1] === opens[i]) {
                    tempChunk.pop();
                } else {
                    return false;
                }
            }
        }
        
        return true;
    }));

    const scoreTable = {
        ')': 1,
        ']': 2,
        '}': 3,
        '>': 4
    }

    let scores = [];

    for (let line of incompleteLines) {

        let tempChunk = [];

        for (let bracket of line) {
            if (opens.indexOf(bracket) > -1) {
                tempChunk.push(bracket);
            } else {
                
                const i = close.indexOf(bracket);
                if (tempChunk[tempChunk.length - 1] === opens[i]) {
                    tempChunk.pop();
                } else {
                    break;
                }
            }
        }

        let comChunks = [];

        while (tempChunk.length > 0) {
            let i = opens.indexOf(tempChunk.pop())
            comChunks.push(close[i]);
        }

        let score = 0;

        for (let bracket of comChunks) {
            score *= 5;
            score += scoreTable[bracket];
        }

        scores.push(score);
    }

    scores.sort((a, b) => a - b);

    console.log("Part 2: " + scores[(scores.length - 1) / 2]);   
}