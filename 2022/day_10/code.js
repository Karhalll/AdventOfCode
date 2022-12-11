fs = require("fs");
path = require("path");
const data = fs.readFileSync(path.resolve(__dirname, "data.txt"), { encoding: "utf8" });

class CrtPanel {
  constructor() {
    this.crtDisplay = [];
    this.crtString = "";
    this.cycle = 1;
    this.X = 1;

    this._drawPixel();
  }

  increaseCycle() {
    this.cycle++;
    this._drawPixel();
  }

  _drawPixel() {
    var position = (this.cycle - 1) % 40;
    if (position >= this.X - 1 && position <= this.X + 1) {
      this.crtString += "#";
    } else {
      this.crtString += ".";
    }

    if (this.crtString.length >= 40) {
      this.crtDisplay.push(this.crtString);
      this.crtString = "";
    }
  }

  printDisplay() {
    this.crtDisplay.forEach((line) => {
      console.log(line);
    });
  }
}

console.log("Part 1: " + part1());
part2();

function part1() {
  var instructions = getInstructions(data);

  var cycles = [20, 60, 100, 140, 180, 220];

  var mapOfX = {};

  var X = 1;
  var currentCycle = 1;
  for (var i = 0; i < instructions.length; i++) {
    var commandObj = instructions[i];
    var command = commandObj.command;

    if (command == "noop") {
      mapOfX[currentCycle] = X;
      currentCycle++;
      continue;
    } else {
      currentCycle++;
      currentCycle++;
      X += commandObj.value;
      mapOfX[currentCycle] = X;
    }

    if (currentCycle > Math.max(...cycles)) {
      break;
    }
  }

  var signalStrengths = cycles.map((cycle) => {
    var xValue = Number.parseInt(mapOfX[cycle]);

    var cycleToCheck = cycle;
    while (!xValue) {
      xValue = Number.parseInt(mapOfX[cycleToCheck]);
      cycleToCheck--;
    }

    var strength = xValue * cycle;
    return strength;
  });

  return signalStrengths.reduce((a, b) => a + b, 0);
}

function part2() {
  var crtPanel = new CrtPanel();
  
  var instructions = getInstructions(data);
  for (var i = 0; i < instructions.length; i++) {
    var commandObj = instructions[i];
    var command = commandObj.command;

    if (command == "noop") {
      crtPanel.increaseCycle();
      continue;
    } else {
      crtPanel.increaseCycle();
      crtPanel.X += commandObj.value;
      crtPanel.increaseCycle();
    }

    if (crtPanel.cycle > 240) {
      break;
    }
  }

  console.log("Part 2:");
  crtPanel.printDisplay();
}

function getInstructions(dataToConvert) {
  return dataToConvert.split("\r\n").map((line) => {
    var line = line.trim();
    var command = line.split(" ");

    var commandObj = {};
    commandObj.command = command[0];
    if (command.length == 2) {
      command[1] = Number.parseInt(command[1]);
      commandObj.value = command[1];
    }

    return commandObj;
  });
}
