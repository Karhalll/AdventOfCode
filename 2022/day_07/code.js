fs = require("fs");
path = require("path");
var data = fs.readFileSync(path.resolve(__dirname, "data.txt"), { encoding: "utf8" });
data = data.split('\n');

var structureObj = {};
var currentPath = "";
createStructure();

var part1Output = 0;
console.log("Part 1: " + part1());
console.log("Part 2: " + part2());

function part1() {

  getSizeOfDir(structureObj);
  return part1Output;
}

function part2() {

  var totalDiscSize = 70000000;
  var neededSpace = 30000000;
  var mainDirSize = getSizeOfDir(structureObj);

  var freeSpace = totalDiscSize - mainDirSize;
  var spaceToClear = neededSpace - freeSpace;

  var dirsToDelete = {dirs:[]};
  fillDirsToDelete(structureObj, dirsToDelete, spaceToClear);

  var dirsToDeleteArr = dirsToDelete.dirs;

  return Math.min(...dirsToDeleteArr);
}

function getSizeOfDir(directory) {

  var sizeSum = 0;

  for (const property in directory) {
    if (property == "type") {
      continue;
    }

    var subItem = directory[property];

    if (subItem.type == "file") {
      sizeSum += subItem.size;
    } else {
      var subDirSize = getSizeOfDir(subItem);
      sizeSum += subDirSize;
    }
  }

  if (sizeSum <= 100000) {
    part1Output += sizeSum;
  }

  return sizeSum;
}

function fillDirsToDelete(directory, dirsToDelete, spaceToClear, propertyName) {

  var sizeSum = 0;

  for (const property in directory) {

    if (property == "type") {
      continue;
    }

    var subItem = directory[property];

    if (subItem.type == "file") {
      sizeSum += subItem.size;
    } else {
      var subDirSize = fillDirsToDelete(subItem, dirsToDelete, spaceToClear, property);
      sizeSum += subDirSize;
    }
  }
  
  if (sizeSum >= spaceToClear && propertyName != undefined) {
    dirsToDelete.dirs.push(sizeSum);
  }

  return sizeSum;
}

function createStructure() {

  var ls = [];

  for (var lineIndex = 0; lineIndex < data.length; lineIndex++) {

    var line = data[lineIndex];
    if (line[0] == "$") {

      if (ls.length != 0) {
        processLs(ls);
        ls = [];
      }
      processCommand(line.slice(2));
    } else {
      ls.push(line);
    }
  }

  processLs(ls);
}

function processCommand(commandLine) {

  var command = commandLine.slice(0,2);
  if (command == "cd") {

    var cdCommand = commandLine.slice(3).trim();
    if (cdCommand == "/") {
      currentPath = "/";
    } else if (cdCommand == "..") {
      stepUpOfCurrentDir();
    } else {
      currentPath = currentPath + '.' + cdCommand;
    }
  }
}

function processLs(lsArr) {

  var pathArr = currentPath.split('.');
  var dir = getDirToSaveIn(structureObj, pathArr, 0);

  lsArr.forEach(line => {
    if (line.slice(0, 3) == 'dir') {
      var dirName = line.slice(4).trim();
      dir[dirName] = {
        type: "dir"
      };
    } else {
      var fileLineArr = line.split(' ');
      var size = fileLineArr[0];
      var name = fileLineArr[1].trim(); 
      dir[name] = {
        size: +size,
        type: "file"
      }
    }
  });
}

function getDirToSaveIn(currentDir, pathArr, index) {

  if (index >= pathArr.length) {   
    return currentDir;
  }

  var dirName = pathArr[index];
  if (!currentDir.hasOwnProperty(dirName)){
    currentDir[dirName] = {};
  }
  return getDirToSaveIn(currentDir[dirName], pathArr, ++index);
}

function stepUpOfCurrentDir() {
  for (var i = currentPath.length - 1; i > 0; i--) {
    if (currentPath[i] == ".") {
      currentPath = currentPath.slice(0, i);
      break;
    }
  }
}