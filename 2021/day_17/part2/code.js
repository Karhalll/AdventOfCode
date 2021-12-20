fs = require('fs')

class Vector2 {
    x;
    y

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static addition(vectorA, vectorB) {

        let x = vectorA.x + vectorB.x;
        let y = vectorA.y + vectorB.y;

        return new Vector2(x, y);
    }
}

class Probe {
    position;
    velocity

    constructor(position, velocity) {
        this.position = position;
        this.velocity = velocity;
    }
}

const DATA = fs.readFileSync('data_test.txt', {encoding:'utf8'});
const TARGET_AREA = getTargetAreaRange();

part2();

function part2() {

    let output = 0;
    let validProbes = 0;

    // let minX = minValidX();
    // console.log(minX);

    for (let x = 0; x <= TARGET_AREA.x[1]; x++) {

        for (let y = TARGET_AREA.y[1]; y <= 1000; y++) {

            let velocity = new Vector2(x,y);

            let maxY = lunchProbe(velocity);

            if (maxY > 0) {
                validProbes++;
                
                if (maxY > output) {
                    output = maxY;
                }
            }
        }
    }

    console.log(output);
    console.log(validProbes);
}

function getTargetAreaRange() {

    let areaString = DATA.split('target area: ')[1];
    let coordsStrings = areaString.split(', ');

    let targetArea = {
        x: [],
        y: []
    }

    coordsStrings.forEach(coordString => {

        let axis = coordString.split('=')[0]
        let range = coordString.split('=')[1];

        let rangeArr = range.split('..').map(Number);

        targetArea[axis] = rangeArr;

    });

    return targetArea;
}

function isInTargetArea(vector2) {

    // console.log(vector2);

    let x = vector2.x;
    let y = vector2.y;

    return x >= TARGET_AREA.x[0] && x <= TARGET_AREA.x[1] && y >= TARGET_AREA.y[0] && y <= TARGET_AREA.y[1];
}

function isValidStep(vector2) {

    // console.log(vector2);

    let x = vector2.x;
    let y = vector2.y;

    // console.log(x <= TARGET_AREA.x[1] && y >= TARGET_AREA.y[0]);

    return x <= TARGET_AREA.x[1] && y >= TARGET_AREA.y[0];
}

function lunchProbe(initialVelocity) {

    // console.log(initialVelocity);

    let defaultPos = new Vector2(0, 0);
    let probe = new Probe(defaultPos, initialVelocity);

    let maxY = 0;

    // console.log(probe);

    let nextProbe = nextStepProbe(probe);

    while (isValidStep(nextProbe.position)) {

        let probeY = probe.position.y;

        if (probeY > maxY) {
            maxY = probe.position.y;
        }

        probe = nextProbe;
        nextProbe = nextStepProbe(probe);
    }

    // console.log(probe);

    if (isInTargetArea(probe.position)) {
        return maxY;
    } else {
        return false;
    }
}

function nextStepProbe(probe) {

    let probePos = probe.position;
    let probeVel = probe.velocity;

    let newPosition = Vector2.addition(probePos, probeVel);
    let newVelocity = velocityCorelation(probeVel);

    return new Probe(newPosition, newVelocity);
}

function velocityCorelation(vector2) {

    let x = vector2.x;
    let y = vector2.y;

    if (x > 0) x--;
    y--;

    return new Vector2(x,y);
}

// function minValidX() {

//     let x = 0

//     while (x <= TARGET_AREA.x[1]) {

//         x

//         x++;
//     }
// }