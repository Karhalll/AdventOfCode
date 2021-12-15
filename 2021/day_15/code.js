fs = require('fs')
const DATA = fs.readFileSync('data.txt', {encoding:'utf8'});

class BinaryHeap {
    constructor(scoreFunction) {
        this.content = [];
        this.scoreFunction = scoreFunction;
    }
    push(element) {
        this.content.push(element);
        this.sinkDown(this.content.length - 1);
    }
    pop() {

        var result = this.content[0];
        var end = this.content.pop();
        
        if (this.content.length > 0) {
            this.content[0] = end;
            this.bubbleUp(0);
        }

        return result;
    }
    remove(node) {
        var i = this.content.indexOf(node);
        var end = this.content.pop();

        if (i !== this.content.length - 1) {
            this.content[i] = end;

            if (this.scoreFunction(end) < this.scoreFunction(node)) {
                this.sinkDown(i);
            } else {
                this.bubbleUp(i);
            }
        }
    }
    size() {
        return this.content.length;
    }
    rescoreElement(node) {
        this.sinkDown(this.content.indexOf(node));
    }
    sinkDown(n) {

        var element = this.content[n];

        while (n > 0) {

            var parentN = ((n + 1) >> 1) - 1;
            var parent = this.content[parentN];

            if (this.scoreFunction(element) < this.scoreFunction(parent)) {

                this.content[parentN] = element;
                this.content[n] = parent;

                n = parentN;

            } else {
                break;
            }
        }
    }
    bubbleUp(n) {

        var length = this.content.length;
        var element = this.content[n];
        var elemScore = this.scoreFunction(element);

        while (true) {
            
            var child2N = (n + 1) << 1;
            var child1N = child2N - 1;
            
            var swap = null;
            var child1Score;
            
            if (child1N < length) {
               
                var child1 = this.content[child1N];
                child1Score = this.scoreFunction(child1);

                if (child1Score < elemScore) {
                    swap = child1N;
                }
            }

            if (child2N < length) {
                var child2 = this.content[child2N];
                var child2Score = this.scoreFunction(child2);
                if (child2Score < (swap === null ? elemScore : child1Score)) {
                    swap = child2N;
                }
            }

            if (swap !== null) {

                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap;

            } else {
                break;
            }
        }
    }
}

part1();
part2();

function part1() {

    const LINES = DATA.split('\n').map(a => a.trim())
    const GRID = LINES.map(line => line.split('').map(Number));

    let path = search(GRID);

    answer(path, 'Part 1');
}

function part2() {

    const GRID_SIZE = 5;

    let newLines = getScalingSquareGridLines(GRID_SIZE);
    const LARGE_GRID = newLines.map(line => line.split('').map(Number));

    let path = search(LARGE_GRID);

    answer(path, 'Part 2'); 
}

function answer(path, part) {

    let costSum = path.reduce((sum , node) => sum += node.cost,0);

    console.log(part + ": " + costSum);
}

function getScalingSquareGridLines(gridSize) {

    let newLines = [];

    for (let gX = 0; gX < gridSize; gX++) {

        DATA.split('\n')
            .map(a => a.trim())
            .forEach(originalLine => {

                let outputLine = '';

                for (let gY = 0; gY < gridSize; gY++) {
                    
                    let newLineNumbers = '';

                    let lineNumbers = originalLine.split('').map(Number);

                    lineNumbers.forEach(number => {
                        let newNumber = ((number + gY + gX));

                        if (newNumber > 9) {

                            newNumber = newNumber % 9;
                        }
                        newLineNumbers += newNumber.toString();
                    });

                    outputLine += newLineNumbers;
                }

                newLines.push(outputLine);
        });
    }

    return newLines
}

function init(grid) {
    for(var x = 0; x < grid.length; x++) {
        for(var y = 0; y < grid[x].length; y++) {
            var cost = grid[x][y];
            grid[x][y] = {};
            var node = grid[x][y];

            node.pos = {};
            node.pos.x = x;
            node.pos.y = y;
            node.f = 0;
            node.g = 0;
            node.h = 0;
            node.cost = cost;
            node.visited = false;
            node.closed = false;
            node.parent = null;
        }
    }
}

function heap() {
    return new BinaryHeap(function(node) {
        return node.f;
    });
}

function search(grid) {

    init(grid);

    let start = grid[0][0];
    let end = grid[grid.length - 1][grid[0].length - 1];
    
    let heuristic = manhattan;

    var openHeap = heap();

    openHeap.push(start);

    while(openHeap.size() > 0) {

        var currentNode = openHeap.pop();

        if(currentNode === end) {
            var curr = currentNode;
            var ret = [];
            while(curr.parent) {
                ret.push(curr);
                curr = curr.parent;
            }
            return ret.reverse();
        }

        currentNode.closed = true;

        var neighbors = getNeighbors(grid, currentNode);

        for(var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];

            if(neighbor.closed) {
                continue;
            }

            var gScore = currentNode.g + neighbor.cost;
            var beenVisited = neighbor.visited;

            if(!beenVisited || gScore < neighbor.g) {

                neighbor.visited = true;
                neighbor.parent = currentNode;
                neighbor.h = neighbor.h || heuristic(neighbor.pos, end.pos);
                neighbor.g = gScore;
                neighbor.f = neighbor.g + neighbor.h;

                if (!beenVisited) {
                    openHeap.push(neighbor);
                }
                else {
                    openHeap.rescoreElement(neighbor);
                }
            }
        }
    }

    return [];
}

function manhattan(pos0, pos1) {

    var d1 = Math.abs (pos1.x - pos0.x);
    var d2 = Math.abs (pos1.y - pos0.y);
    return d1 + d2;
}

function getNeighbors(grid, node) {

    var ret = [];
    var x = node.pos.x;
    var y = node.pos.y;

    if(grid[x-1] && grid[x-1][y]) {
        ret.push(grid[x-1][y]);
    }

    if(grid[x+1] && grid[x+1][y]) {
        ret.push(grid[x+1][y]);
    }

    if(grid[x] && grid[x][y-1]) {
        ret.push(grid[x][y-1]);
    }

    if(grid[x] && grid[x][y+1]) {
        ret.push(grid[x][y+1]);
    }

    return ret;
}