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

  _moveByDistance(dX, dY) {
    this._setCoordinates(this._x + dX, this._y + dY);
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

class Head extends Knot {
  constructor(x, y) {
    super(x, y);
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

console.log("Part 1: " + part1());

function part1() {
  var steps = getSteps(data);
  var head = new Head(0, 0);
  var tail = new Tail(0, 0);
  var tail2 = new Tail(0, 0);
  var tail3 = new Tail(0, 0);
  var tail4 = new Tail(0, 0);
  var tail5 = new Tail(0, 0);
  var tail6 = new Tail(0, 0);
  var tail7 = new Tail(0, 0);
  var tail8 = new Tail(0, 0);

  head.attachTail(tail);

  steps.forEach((step) => {
    head.moveByStep(step);
  });

  return Object.keys(tail.positionsVisited).length;
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
