fs = require("fs");
path = require("path");
const data = fs.readFileSync(path.resolve(__dirname, "data.txt"), { encoding: "utf8" });

console.log("Part 2: " + part2());

function part2() {

  var treeArr = [];
  data.split('\r\n').map(line => {
    var lineArr = [];
    line.split('').forEach(tree => {
      lineArr.push(Number.parseInt(tree))
    });
    treeArr.push(lineArr);
  })

  var bestScenicScore = 0;
  treeArr.forEach((treeRow, rowIndex) => {

    treeRow.forEach((treeHeight, columIndex) => {

      var scenicScore = {};

      // Left check
      for (var column = columIndex - 1; column >= 0; column--) {

        var treeToCompare = treeArr[rowIndex][column];
        var isBlocking = treeToCompare >= treeHeight;

        if (isBlocking) {
          scenicScore.left = columIndex - column;
          break;
        }
      }
      if (scenicScore.left == undefined) scenicScore.left = columIndex;

      // Right check
      for (var column = columIndex + 1; column < treeRow.length; column++) {

        var treeToCompare = treeArr[rowIndex][column];
        var isBlocking = treeToCompare >= treeHeight;

        if (isBlocking) {
          scenicScore.right = column - columIndex;
          break;
        }
      }
      if (scenicScore.right == undefined) scenicScore.right = column - columIndex - 1;

      // Up check
      for (var row = rowIndex - 1; row >= 0; row--) {

        var treeToCompare = treeArr[row][columIndex];
        var isBlocking = treeToCompare >= treeHeight;

        if (isBlocking) {
          scenicScore.up = rowIndex - row;
          break;
        }
      }
      if (scenicScore.up == undefined) scenicScore.up = rowIndex;

      // Down check
      for (var row = rowIndex + 1; row < treeArr.length; row++) {

        var treeToCompare = treeArr[row][columIndex];
        var isBlocking = treeToCompare >= treeHeight;

        if (isBlocking) {
          scenicScore.down = row - rowIndex;
          break;
        }
      }
      if (scenicScore.down == undefined) scenicScore.down = row - rowIndex - 1;

      var treeScenicScore = scenicScore.left * scenicScore.right * scenicScore.up * scenicScore.down;

      if ((rowIndex == 1 && columIndex == 2) || (rowIndex == 3 && columIndex == 2)) {
        console.log(`${rowIndex}${columIndex}: ${scenicScore.up} * ${scenicScore.left} * ${scenicScore.right} * ${scenicScore.down}`)
      }

      if (treeScenicScore > bestScenicScore) bestScenicScore = treeScenicScore;
    });
  });

  return bestScenicScore;
}