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

const DATA = fs.readFileSync('data.txt', {encoding:'utf8'});
const TARGET_AREA = getTargetAreaRange();

part2();

function part2() {

    let output = 0;
    let validProbes = 0;

    for (let x = 5; x <= TARGET_AREA.x[1]; x++) {

        for (let y = TARGET_AREA.y[0]; y <= -TARGET_AREA.y[0]; y++) {

            let velocity = new Vector2(x,y);

            // console.log(velocity);

            let maxY = lunchProbe(velocity);

            if (maxY != false) {
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

    let defaultPos = new Vector2(0, 0);
    let probe = new Probe(defaultPos, initialVelocity);

    let maxY;

    let nextProbe = nextStepProbe(probe);

    while (isValidStep(nextProbe.position)) {

        let probeY = probe.position.y;

        if (probeY > maxY) {
            maxY = probe.position.y;
        }

        probe = nextProbe;

        if (isInTargetArea(probe.position)) {
            return maxY;
        }

        nextProbe = nextStepProbe(probe);
    }

    return false;
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