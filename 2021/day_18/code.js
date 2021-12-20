fs = require('fs')
const DATA = fs.readFileSync('test1.txt', {encoding:'utf8'});
const LINES = DATA.split('\n').map(line => JSON.parse(line.trim()));

class Pair {
    left;
    right;

    lvl;
    parent;

    toString() {
        return '[' + this.left + ',' + this.right + ']';
    }
}

// let pair = createPair([[[[[9,8],1],2],3],4], undefined, 0);

// console.log(pair.toString());
// explodeIfCan(pair);

// // while (splitIfCan(pair) === true) {
// //     explodeIfCan(pair);
// // }

// console.log(pair.toString());

function explodeIfCan(pair) {

    if (typeof pair === 'number') {
        return false;
    }

    if (pair.lvl >= 4) {

        explode(pair);
        return true;

    } else {

        if (explodeIfCan(pair.left) === true) {
            pair.left = 0;
            return false;
        }

        if (explodeIfCan(pair.right) === true) {
            pair.right = 0;
            return false;
        }

        return false;
    }
}

function splitIfCan(pair) {

    if (typeof pair.left === 'number') {
        if (pair.left >= 10) {
            pair.left = split(pair.left, pair, pair.lvl);
            return true;
        } else {
            return;
        }
    }    

    if (typeof pair.right === 'number') {
        if (pair.right >= 10) {
            pair.right = split(pair.right, pair, pair.lvl);
            return true;
        } else {
            return;
        }
    } 

    if (splitIfCan(pair.left) === true) return true;
    if (splitIfCan(pair.right) === true) return true;

    return false;
}

function explode(pair) {

    let left = pair.left;
    let right = pair.right;

    let parent = pair.parent;
    
    transferUP(parent, left, right);
}

function transferUP(pair, left, right) {

    transferLeft(pair.left, left);
    transferRight(pair.right, right);
}

function transferLeft(pair, left) {

    if (typeof pair.left === 'number') {
        pair.left += left;
    } else {
        if (pair.parent === undefined) return;
        transferLeft(pair.parent, left);
    }
}

function transferRight(pair, right) {

    if (typeof pair.right === 'number') {
        pair.right += right;
    } else {
        if (pair.parent === undefined) return;
        transferRight(pair.parent, right);
    }
}

function createPair(array, parent, lvl) {

    let pair = new Pair();
    pair.parent = parent;
    pair.lvl = lvl;

    if (Array.isArray(array[0])) {
        pair.left = createPair(array[0], pair, lvl + 1);   
    } else {
        pair.left = array[0];
    }

    if (Array.isArray(array[1])) {
        pair.right = createPair(array[1], pair, lvl + 1);
    } else {
        pair.right = array[1];
    }

    return pair;
}


let sNumber = '[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]';
console.log(sNumber);

let reducesNumber = reduceNumber(sNumber);

console.log(reducesNumber);

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

    for (let i = startI; i < sNumber.length; i++) {

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