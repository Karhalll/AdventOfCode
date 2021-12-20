fs = require('fs')
const DATA = fs.readFileSync('test1.txt', {encoding:'utf8'});
const LINES = DATA.split('\n').map(line => JSON.parse(line.trim()));

let sum = hardCopyArr(LINES[0]);

// for (let i = 1; i < LINES.length; i++) {

//     let output = [];

//     output.push(hardCopyArr(sum));
//     output.push(hardCopyArr(LINES[i]));

//     reduction(output);

//     sum = output;
// }

function reduction(array) {

}

function hardCopyArr(array) {
    return JSON.parse(JSON.stringify(array));
}


//split TEST
// console.log(split(10));
// console.log(split(11));
// console.log(split(12));

function split(number) {

    let output = [];

    let left = Math.floor(number/2);
    let right = Math.ceil(number/2);

    output.push(left);
    output.push(right);

    return output;
}

//willExplode TEST
console.log(JSON.stringify(explode([[[[[9,8],1],2],3],4], 0)));
console.log(JSON.stringify(explode([7,[6,[5,[4,[3,2]]]]], 0)));
console.log(JSON.stringify(explode([[6,[5,[4,[3,2]]]],1], 0)));
console.log(JSON.stringify(explode([[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]], 0)));
console.log(JSON.stringify(explode([[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]], 0)));

// console.log(JSON.stringify(explode([[[[1,1],[2,2]],[3,3]],[4,4]], 0)));

function explode(array, lvl) {

    if (Array.isArray(array[0])) {

        if (willExplode(lvl + 1)) {
            array[1] += array[0][1];
            array[0] = 0;
        } else {
            array[0] = explode(array[0], lvl + 1);
        }
    }
    if (Array.isArray(array[1])) {

        if (willExplode(lvl + 1)) {
            array[0] += array[1][0];
            array[1] = 0;
        } else {
            array[1] = explode(array[1], lvl + 1);
        }
    }

    return array;
}

function willExplode(lvl) {
    if (lvl == 4) return true;
}