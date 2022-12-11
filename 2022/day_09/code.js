fs = require("fs");
path = require("path");
const data = fs.readFileSync(path.resolve(__dirname, "data.txt"), { encoding: "utf8" });

class Step {
  constructor(stepArr) {
    this.direction = stepArr[0];
    this.distance = stepArr[1];
    this.properties = JSON.stringify(stepArr);
  }
}

class Knot {
  constructor(x, y) {
    this._setCoordinates(x, y);
  }

  attachTail(tail) {
    this.tail = tail;
  }

  moveByStep(step) {
    // console.log("== " + step.properties + " ==");
    var currentDistance = 1;
    while (currentDistance <= step.distance) {
      this._moveByOnePosition(step.direction);
      this._checkTail();
      currentDistance++;
    }
  }

  _moveByOnePosition(direction) {
    switch (direction) {
      case "L":
        this._moveByDistance(-1, 0);
        break;
      case "R":
        this._moveByDistance(1, 0);
        break;
      case "U":
        this._moveByDistance(0, 1);
        break;
      case "D":
        this._moveByDistance(0, -1);
        break;
      default:
        break;
    }
  }

  _checkTail() {
    var tailDeltas = this._getTailDeltas();
    var tailDX = tailDeltas.dx;
    var tailDY = tailDeltas.dy;

    // console.log("H: " + this.position);

    if (tailDX > 1 || tailDY > 1) {
      this.tail.snapTailTo(this._x, this._y);
    }

    // console.log("T: " + this.tail.position);
  }

  _getTailDeltas() {
    return {
      dx: Math.abs(this._x - this.tail._x),
      dy: Math.abs(this._y - this.tail._y)
    }
  }

  _moveByDistance(dX, dY) {
    this._setCoordinates(this._x + dX, this._y + dY);
    if (this.tail != undefined) this._checkTail();
  }

  _setCoordinates(x, y) {
    this._x = x;
    this._y = y;
    this._setPosition();
  }

  _setPosition() {
    this.position = this._x + "," + this._y;
  }
}

class Tail extends Knot {
  constructor(x, y) {
    super(x, y);
    this.positionsVisited = {}

    this._markPosition();
  }

  snapTailTo(x, y) {
    var dirX = x - this._x;
    var dirY = y - this._y;

    var dX = this._getUnitDelta(dirX);
    var dY = this._getUnitDelta(dirY);
    this._moveByDistance(dX, dY);

    this._markPosition();
  }

  _markPosition() {
    this.positionsVisited[this.position] = true;
  }

  _getUnitDelta(delta) {
    return delta != 0 ? delta / Math.abs(delta) : delta;
  }
}

var outputs = getOutputs();
console.log("Part 1: " + outputs.part1);
console.log("Part 2: " + outputs.part2);

function getOutputs() {
  var steps = getSteps(data);
  var knot0 = new Knot(0, 0);

  var numberOfTails = 9;
  for(i = 1; i <= numberOfTails; i++) {
    eval('var knot' + i + '= new Tail(0, 0);');
    eval('knot' + (i-1) + '.attachTail(knot' + i + ');'); 
  }

  steps.forEach((step) => {
    knot0.moveByStep(step);
  });

  return {
    part1: Object.keys(knot1.positionsVisited).length,
    part2: Object.keys(knot9.positionsVisited).length
  };
}

function getSteps(dataToConvert) {
  return dataToConvert.split("\r\n").map((line) => {
    var line = line.trim();
    var step = line.split(" ");
    step[1] = Number.parseInt(step[1]);
    stepObj = new Step(step);
    return stepObj;
  });
}
