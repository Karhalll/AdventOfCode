fs = require("fs");
let data = fs.readFileSync("data.txt", { encoding: "utf8" });

console.log("Part 1: " + findMarker(data, 4));
console.log("Part 2: " + findMarker(data, 14));

function findMarker(datastream, disChars) {
  for (var i = disChars - 1; i < datastream.length; i++) {
    var disCharsStr = datastream.slice(i - disChars + 1, i);
    if (!disCharsStr.includes(datastream[i]) && !disCharsStr.split("").some((v, i) => disCharsStr.indexOf(v) < i)) {
      return i + 1;
    }
  }
}
