fs = require("fs");
path = require("path");
var data = fs.readFileSync(path.resolve(__dirname, "data.txt"), { encoding: "utf8" });

var monkeyRoof = 1;
console.log("Part 2: " + part2(data));

function part2(data) {

  var monkeysDefs = generateDefinitionObject(data);
  var keepAwayGame = setUpGame(monkeysDefs);

  for (let monkey in monkeysDefs) {
    monkeyRoof *= monkeysDefs[monkey]['test'];
  }

  var roundsToSimulate = 10000;
  for (var round = 1; round <= roundsToSimulate; round++) {
    simulateRound(keepAwayGame, monkeysDefs);
  }

  var inspectionsArr = [];
  for (const monkeyKey in keepAwayGame) {
    var monkey = keepAwayGame[monkeyKey];
    inspectionsArr.push(monkey.inspections);
  }

  var mostFirst = Math.max(...inspectionsArr);
  inspectionsArr.splice(inspectionsArr.indexOf(mostFirst), 1);

  var mostSecond = Math.max(...inspectionsArr);
  inspectionsArr.splice(inspectionsArr.indexOf(mostSecond), 1);
  
  return mostFirst * mostSecond;
}

function simulateRound(state, monkeysDefs) {

  for (const monkeyKey in state) {

    var monkeyDef = monkeysDefs[monkeyKey];
    var items = state[monkeyKey]['items'];

    items.forEach((worryLvl) => {
      var newWorryLvl = monkeyDef['operation'](worryLvl);
      var worryAfterBored = newWorryLvl % monkeyRoof;
      var test = worryAfterBored / monkeyDef['test'];

      test = Number.isInteger(test);
      var nextMonkeyKey;
      if (test) {
        nextMonkeyKey = monkeyDef['true'];
      } else {
        nextMonkeyKey = monkeyDef['false'];
      }

      state[nextMonkeyKey]['items'].push(worryAfterBored);
      state[monkeyKey]['inspections']++;
    });

    state[monkeyKey]['items'] = [];
  }
}

function setUpGame(monkeysDefs) {

  var process = {};
  for (const monkeyKey in monkeysDefs) {
    process[monkeyKey] = {};
    process[monkeyKey]['items'] = monkeysDefs[monkeyKey].start_items;
    process[monkeyKey]['inspections'] = 0;
  }

  return process;
}

function generateDefinitionObject(inputData) {

  data = inputData.split('\r\n\r\n');

  var monkeysDefs = {};
  data.forEach(definition => {

    var monkeyKey;
    var defData = definition.split("\r\n");
    defData.forEach((line, lineIndex) => {
      
      switch (lineIndex) {
        case 0:
          monkeyKey = line[7];
          monkeysDefs[monkeyKey] = {
            start_items: [],
          };
          break;
        case 1:
          line.trim().split(": ")[1].split(", ").forEach(value => {
            monkeysDefs[monkeyKey]['start_items'].push(Number.parseInt(value.trim()));
          });
          break;
        case 2:
          var operation = line.split('n: ')[1].trim().replaceAll('new = ', '');
          monkeysDefs[monkeyKey]['operation'] = function(old) {
            return eval(operation);
          };
          break;
        case 3:
          monkeysDefs[monkeyKey]['test'] = Number.parseInt(line.split(' by ')[1]);
          break;
        case 4:
          monkeysDefs[monkeyKey]['true'] = Number.parseInt(line.split(' monkey ')[1]);
          break;
        case 5:
          monkeysDefs[monkeyKey]['false'] = Number.parseInt(line.split(' monkey ')[1]);
          break;
        default:
          break;
      }
    });
  });

  return monkeysDefs;
}

