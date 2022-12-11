fs = require("fs");
path = require("path");
const data = fs.readFileSync(path.resolve(__dirname, "data.txt"), { encoding: "utf8" });

console.log("Part 1: " + part1());

function part1() {
  var visibleTreesCount = 0;

  var treeArr = [];
  data.split('\r\n').map(line => {
    var lineArr = [];
    line.split('').forEach(tree => {
      lineArr.push(Number.parseInt(tree))
    });
    treeArr.push(lineArr);
  })

  // var treeMap = {};
  treeArr.forEach((treeRow, rowIndex) => {
    if (rowIndex == 0 || rowIndex == treeArr.length - 1) {
      visibleTreesCount += treeRow.length;
      return;
    }

    visibleTreesCount += 2;

    treeRow.forEach((treeHeight, columIndex) => {
      if (columIndex == 0 || columIndex == treeArr.length - 1) return;

      var treeObj = {
        left: true,
        right: true,
        up: true,
        down: true
      };
      treeObj.height = treeHeight;

      // Horizontal check
      for (var column = 0; column < treeRow.length; column++) {
        if (column == columIndex) continue;

        var treeToCompare = treeArr[rowIndex][column];
        var isBlocking = treeToCompare >= treeHeight;

        if (isBlocking) {
          // Left
          if (column < columIndex) {
            treeObj.left = false;
            
          // Right
          } else {
            treeObj.right = false;
          }
        }
      }

      // Vertical check
      for (var row = 0; row < treeArr.length; row++) {
        if (row == rowIndex) continue;

        var treeToCompare = treeArr[row][columIndex];
        var isBlocking = treeToCompare >= treeHeight;

        if (isBlocking) {
          // UP
          if (row < rowIndex) {
            treeObj.up = false;
            
          // Down
          } else {
            treeObj.down = false;
          }
        }
      }

      if (treeObj.left || treeObj.right || treeObj.up || treeObj.down) {
        visibleTreesCount++;
      }
      
    });

  });

  // console.log(treeArr);
  // console.log(treeMap);
  return visibleTreesCount;
}

// function checkUp()

