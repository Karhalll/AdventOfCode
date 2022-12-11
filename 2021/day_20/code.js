fs = require('fs')

var DATA = fs.readFileSync('data_test.txt', {encoding: "UTF-8"});
var IMAGE_ENHANCEMENT_ALGORYTHM = DATA.split('\n')[0].trim();
var image = getImage(DATA);


enlargeImage(image);

for (var x = 0; x < image.length; x++) {
    for (var y = 0; y < image[0].length; y++) {
        binaryValue(x, y);
    }
}

console.log(image);

function getImage(data) {

    data = data.split('\n');

    var arr = [];

    for (var i = 2; i < data.length; i++) {
        arr.push(data[i].trim());
    }

    return arr;
}

function enlargeImage(image) {

    var imageWidth = image[0].length;

    for (var i = 0; i < imageWidth; i++) {
        image[i] = '.' + image[i] + '.';
    }

    var emptyEnlargedLine = '';
    for (var i = 0; i < image[0].length; i++) {
        emptyEnlargedLine += '.';
    }

    image.unshift(emptyEnlargedLine);
    image.push(emptyEnlargedLine)
}

function binaryValue(line, column) {

    const adjacent = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
        [1, 0],
        [1, -1],
        [0, -1]
    ];

    var binaryString = '';

    for (let pos of adjacent) {

        const adjLine = line + pos[0];
        const adjColumn = column + pos[1];

        let symbol;

        if (isInBounds(adjLine, adjColumn)) {
            symbol = image[adjLine].charAt(adjColumn);
        } else {
            symbol = '.';
        }

        if (symbol === '.') {
            binaryString += '0';
        } else {
            binaryString += '1';
        }
    }

    console.log(Number.parseInt(binaryString, 2));
}

function isInBounds(line, column) {
    return (
        image[line] !== undefined && 
        image[line][column] !== undefined
    );
}