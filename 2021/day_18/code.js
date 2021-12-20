fs = require('fs')
const DATA = fs.readFileSync('data.txt', {encoding:'utf8'});
const LINES = DATA.split('\n').map(line => line.trim());

class Pair {
    left;
    right;

    lvl;
    parent;

    magnitude;
    magL;
    magR;

    toString() {
        return '[' + this.left + ',' + this.right + ']';
    }
}

function createPair(array, parent, lvl) {

    let pair = new Pair();
    pair.parent = parent;
    pair.lvl = lvl;

    if (Array.isArray(array[0])) {
        pair.left = createPair(array[0], pair, lvl + 1);
        pair.magL = pair.left.magnitude;  
    } else {
        pair.left = array[0];
        pair.magL = array[0];
    } 

    if (Array.isArray(array[1])) {
        pair.right = createPair(array[1], pair, lvl + 1);
        pair.magR = pair.right.magnitude;
    } else {
        pair.right = array[1];
        pair.magR = array[1];
    }

    pair.magnitude = 3*pair.magL + 2*pair.magR;

    return pair;
}

let lineSum = LINES[0];

for (let lineI = 1; lineI < LINES.length; lineI++) {

    let nextLine = LINES[lineI];
    let numberToReduce = '[' + lineSum + ',' + nextLine + ']';

    lineSum = reduceNumber(numberToReduce);
}

let sumMagnitude = magnitude(lineSum);
console.log(sumMagnitude);

let maxMagnitude = 0;

for (let first = 0; first < LINES.length - 1; first++) {

    for (let second = first + 1; second < LINES.length; second++) {

        let firstLine = LINES[first];
        let secondLine = LINES[second];

        let numberToReduce1 = '[' + firstLine + ',' + secondLine + ']';
        let numberToReduce2 = '[' + secondLine + ',' + firstLine + ']';

        let reduced1 = reduceNumber(numberToReduce1);
        let reduced2 = reduceNumber(numberToReduce2);

        let magnitude1 = magnitude(reduced1);
        if (maxMagnitude < magnitude1) {
            maxMagnitude = magnitude1;
        }

        let magnitude2 = magnitude(reduced2);
        if (maxMagnitude < magnitude2) {
            maxMagnitude = magnitude2;
        }

    }
}

console.log(maxMagnitude);


function magnitude(string) {

    let arr = JSON.parse(string);
    let pair = createPair(arr, undefined, 0);

    return pair.magnitude;
}


function reduceNumber(number) {

    let explodedNumber = explodeAll(number);
    let splittedNumber = splitIfCan(explodedNumber);

    while (splittedNumber != explodedNumber) {
        explodedNumber = explodeAll(splittedNumber);
        splittedNumber = splitIfCan(explodedNumber);
    }

    return splittedNumber;
}

function explodeAll(number) {

    let newNumber = explodeIfCan(number);

    while (number != newNumber) {
        number = newNumber;
        newNumber = explodeIfCan(number)
    }

    return newNumber;
}

function explodeIfCan(string) {

    let openBrackets = 0;

    for (let i = 0; i < string.length; i++) {

        if (string[i] === '[') {
            openBrackets++;

            if (openBrackets === 5) {

                let res =  getArrayToExplode(string, i);
                
                let leftSide = string.slice(0, i);
                let leftNumber = res.array[0];
                leftSide = changeNextLeft(leftSide, leftNumber);
                
                let endI = res.endI;
                let rightSide = string.slice(endI+1, string.length);
                let rightNumber = res.array[1];
                rightSide = changeNextRight(rightSide, rightNumber);

                let finalString = leftSide + '0' + rightSide;

                return finalString;
            }

            continue;
        }
        if (string[i] === ']') {
            openBrackets--;
            continue;
        }
    }

    return string;
}

function getArrayToExplode(string, startI) {

    let staringArr = '';

    for (let i = startI; i < string.length; i++) {

        if (string[i] === ']') {
            staringArr += string[i];

            return {
                array: JSON.parse(staringArr),
                endI: i
            };
        }

        staringArr += string[i];
    }
}

function changeNextRight(string, number) {

    let stringNumber = '';
    let numberStarted = false;

    let startI;
    let endI;

    
    for (let i = 0; i < string.length; i++) {

        if (numberStarted) {

            if (isNaN(Number.parseInt(string[i]))) {
                endI = i - 1;
                break;
            }

            stringNumber += string[i];
        }

        if (!numberStarted && !isNaN(Number.parseInt(string[i]))) {
            numberStarted = true;
            stringNumber += string[i];

            startI = i;
        }
    }

    if (!numberStarted) return string;

    let newNumber = (Number.parseInt(stringNumber) + number).toString();
    let output = string.slice(0,startI) + newNumber + string.slice(endI+1, string.length);

    return output;
}

function changeNextLeft(string, number) {

    let stringNumber = '';
    let numberStarted = false;

    let startI;
    let endI;

    for (let i = string.length - 1; i >= 0; i--) {

        if (numberStarted) {

            if (isNaN(Number.parseInt(string[i]))) {
                startI = i + 1;
                break;
            }

            stringNumber = string[i] + stringNumber;
        }

        if (!numberStarted && !isNaN(Number.parseInt(string[i]))) {
            numberStarted = true;
            stringNumber += string[i];

            endI = i;
        }
    }

    if (!numberStarted) return string;

    let newNumber = (Number.parseInt(stringNumber) + number).toString();
    let output = string.slice(0,startI) + newNumber + string.slice(endI+1, string.length);

    return output;
}

function splitIfCan(string) {
   
    let stringNumber = '';
    let numberStarted = false;

    let startI;
    let endI;

    let numberFind;

    
    for (let i = 0; i < string.length; i++) {

        if (numberStarted) {

            if (isNaN(Number.parseInt(string[i]))) {

                // console.log(stringNumber);
                
                let number = Number.parseInt(stringNumber);
                if (number >= 10) {

                    numberFind = number;
                    endI = i - 1;
                    break;

                } else {

                    stringNumber = '';
                    numberStarted = false;
                }

            } else {
                stringNumber += string[i];
            }

        }

        if (!numberStarted && !isNaN(Number.parseInt(string[i]))) {
            numberStarted = true;
            stringNumber += string[i];

            startI = i;
        }
    }

    if (numberFind === undefined) return string;

    let splittedArr = split(numberFind);
    let output = string.slice(0,startI) + splittedArr + string.slice(endI+1, string.length);

    return output;
}

function split(number) {

    let output = [];

    let left = Math.floor(number/2);
    let right = Math.ceil(number/2);

    output.push(left);
    output.push(right);

    return JSON.stringify(output);
}