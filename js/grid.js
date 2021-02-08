import { random } from './random';
import * as Utils from './utils';
import { make as Make } from './gw';
const DIRS = Utils.DIRS;
const CDIRS = Utils.CLOCK_DIRS;
export function makeArray(l, fn) {
    if (fn === undefined)
        return new Array(l).fill(0);
    fn = fn || (() => 0);
    const arr = new Array(l);
    for (let i = 0; i < l; ++i) {
        arr[i] = fn(i);
    }
    return arr;
}
function _formatGridValue(v) {
    if (v === false) {
        return ' ';
    }
    else if (v === true) {
        return 'T';
    }
    else if (v < 10) {
        return '' + v;
    }
    else if (v < 36) {
        return String.fromCharCode('a'.charCodeAt(0) + v - 10);
    }
    else if (v < 62) {
        return String.fromCharCode('A'.charCodeAt(0) + v - 10 - 26);
    }
    else if (typeof v === 'string') {
        return v[0];
    }
    else {
        return '#';
    }
}
export class Grid extends Array {
    constructor(w, h, v) {
        super(w);
        for (let x = 0; x < w; ++x) {
            if (typeof v === 'function') {
                this[x] = new Array(h)
                    .fill(0)
                    .map((_, i) => v(x, i));
            }
            else {
                this[x] = new Array(h).fill(v);
            }
        }
        this._width = w;
        this._height = h;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get(x, y) {
        if (!this.hasXY(x, y))
            return undefined;
        return this[x][y];
    }
    set(x, y, v) {
        if (!this.hasXY(x, y))
            return false;
        this[x][y] = v;
        return true;
    }
    /**
     * Calls the supplied function for each cell in the grid.
     * @param fn - The function to call on each item in the grid.
     * TSIGNORE
     */
    // @ts-ignore
    forEach(fn) {
        let i, j;
        for (i = 0; i < this.width; i++) {
            for (j = 0; j < this.height; j++) {
                fn(this[i][j], i, j, this);
            }
        }
    }
    async forEachAsync(fn) {
        let i, j;
        for (i = 0; i < this.width; i++) {
            for (j = 0; j < this.height; j++) {
                await fn(this[i][j], i, j, this);
            }
        }
    }
    eachNeighbor(x, y, fn, only4dirs = false) {
        const maxIndex = only4dirs ? 4 : 8;
        for (let d = 0; d < maxIndex; ++d) {
            const dir = DIRS[d];
            const i = x + dir[0];
            const j = y + dir[1];
            if (this.hasXY(i, j)) {
                fn(this[i][j], i, j, this);
            }
        }
    }
    async eachNeighborAsync(x, y, fn, only4dirs = false) {
        const maxIndex = only4dirs ? 4 : 8;
        for (let d = 0; d < maxIndex; ++d) {
            const dir = DIRS[d];
            const i = x + dir[0];
            const j = y + dir[1];
            if (this.hasXY(i, j)) {
                await fn(this[i][j], i, j, this);
            }
        }
    }
    forRect(x, y, w, h, fn) {
        w = Math.min(this.width - x, w);
        h = Math.min(this.height - y, h);
        for (let i = x; i < x + w; ++i) {
            for (let j = y; j < y + h; ++j) {
                fn(this[i][j], i, j, this);
            }
        }
    }
    randomEach(fn) {
        const sequence = random.sequence(this.width * this.height);
        sequence.forEach((n) => {
            const x = n % this.width;
            const y = Math.floor(n / this.width);
            fn(this[x][y], x, y, this);
        });
    }
    /**
     * Returns a new Grid with the cells mapped according to the supplied function.
     * @param fn - The function that maps the cell values
     * TODO - Do we need this???
     * TODO - Should this only be in NumGrid?
     * TODO - Should it alloc instead of using constructor?
     * TSIGNORE
     */
    // @ts-ignore
    map(fn) {
        // @ts-ignore
        const other = new this.constructor(this.width, this.height);
        other.copy(this);
        other.update(fn);
        return other;
    }
    forCircle(x, y, radius, fn) {
        let i, j;
        for (i = Math.max(0, x - radius - 1); i < Math.min(this.width, x + radius + 1); i++) {
            for (j = Math.max(0, y - radius - 1); j < Math.min(this.height, y + radius + 1); j++) {
                if (this.hasXY(i, j) &&
                    (i - x) * (i - x) + (j - y) * (j - y) <
                        radius * radius + radius) {
                    // + radius softens the circle
                    fn(this[i][j], i, j, this);
                }
            }
        }
    }
    hasXY(x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }
    isBoundaryXY(x, y) {
        return (this.hasXY(x, y) &&
            (x == 0 || x == this.width - 1 || y == 0 || y == this.height - 1));
    }
    calcBounds() {
        const bounds = {
            left: this.width,
            top: this.height,
            right: 0,
            bottom: 0,
        };
        this.forEach((v, i, j) => {
            if (!v)
                return;
            if (bounds.left > i)
                bounds.left = i;
            if (bounds.right < i)
                bounds.right = i;
            if (bounds.top > j)
                bounds.top = j;
            if (bounds.bottom < j)
                bounds.bottom = j;
        });
        return bounds;
    }
    update(fn) {
        let i, j;
        for (i = 0; i < this.width; i++) {
            for (j = 0; j < this.height; j++) {
                this[i][j] = fn(this[i][j], i, j, this);
            }
        }
    }
    updateRect(x, y, width, height, fn) {
        let i, j;
        for (i = x; i < x + width; i++) {
            for (j = y; j < y + height; j++) {
                if (this.hasXY(i, j)) {
                    this[i][j] = fn(this[i][j], i, j, this);
                }
            }
        }
    }
    updateCircle(x, y, radius, fn) {
        let i, j;
        for (i = Math.max(0, x - radius - 1); i < Math.min(this.width, x + radius + 1); i++) {
            for (j = Math.max(0, y - radius - 1); j < Math.min(this.height, y + radius + 1); j++) {
                if (this.hasXY(i, j) &&
                    (i - x) * (i - x) + (j - y) * (j - y) <
                        radius * radius + radius) {
                    // + radius softens the circle
                    this[i][j] = fn(this[i][j], i, j, this);
                }
            }
        }
    }
    /**
     * Fills the entire grid with the supplied value
     * @param v - The fill value or a function that returns the fill value.
     * TSIGNORE
     */
    // @ts-ignore
    fill(v) {
        const fn = typeof v === 'function' ? v : () => v;
        this.update(fn);
    }
    fillRect(x, y, w, h, v) {
        const fn = typeof v === 'function' ? v : () => v;
        this.updateRect(x, y, w, h, fn);
    }
    fillCircle(x, y, radius, v) {
        const fn = typeof v === 'function' ? v : () => v;
        this.updateCircle(x, y, radius, fn);
    }
    replace(findValue, replaceValue) {
        this.update((v) => (v == findValue ? replaceValue : v));
    }
    copy(from) {
        // TODO - check width, height?
        this.update((_, i, j) => from[i][j]);
    }
    count(match) {
        const fn = typeof match === 'function'
            ? match
            : (v) => v == match;
        let count = 0;
        this.forEach((v, i, j) => {
            if (fn(v, i, j, this))
                ++count;
        });
        return count;
    }
    dump(fmtFn) {
        this.dumpRect(0, 0, this.width, this.height, fmtFn);
    }
    dumpRect(left, top, width, height, fmtFn) {
        let i, j;
        fmtFn = fmtFn || _formatGridValue;
        left = Utils.clamp(left, 0, this.width - 2);
        top = Utils.clamp(top, 0, this.height - 2);
        const right = Utils.clamp(left + width, 1, this.width - 1);
        const bottom = Utils.clamp(top + height, 1, this.height - 1);
        let output = [];
        for (j = top; j <= bottom; j++) {
            let line = ('' + j + ']').padStart(3, ' ');
            for (i = left; i <= right; i++) {
                if (i % 10 == 0) {
                    line += ' ';
                }
                const v = this[i][j];
                line += fmtFn(v, i, j)[0];
            }
            output.push(line);
        }
        console.log(output.join('\n'));
    }
    dumpAround(x, y, radius) {
        this.dumpRect(x - radius, y - radius, 2 * radius, 2 * radius);
    }
    // TODO - Use for(radius) loop to speed this up (do not look at each cell)
    closestMatchingLoc(x, y, v) {
        let bestLoc = [-1, -1];
        let bestDistance = 100 * (this.width + this.height);
        const fn = typeof v === 'function'
            ? v
            : (val) => val == v;
        this.forEach((v, i, j) => {
            if (fn(v, i, j, this)) {
                const dist = Math.floor(100 * Utils.distanceBetween(x, y, i, j));
                if (dist < bestDistance) {
                    bestLoc[0] = i;
                    bestLoc[1] = j;
                    bestDistance = dist;
                }
                else if (dist == bestDistance && random.chance(50)) {
                    bestLoc[0] = i;
                    bestLoc[1] = j;
                }
            }
        });
        return bestLoc;
    }
    firstMatchingLoc(v) {
        const fn = typeof v === 'function'
            ? v
            : (val) => val == v;
        for (let i = 0; i < this.width; ++i) {
            for (let j = 0; j < this.height; ++j) {
                if (fn(this[i][j], i, j, this)) {
                    return [i, j];
                }
            }
        }
        return [-1, -1];
    }
    randomMatchingLoc(v, deterministic = false) {
        let locationCount = 0;
        let i, j, index;
        const fn = typeof v === 'function'
            ? v
            : (val) => val == v;
        locationCount = 0;
        this.forEach((v, i, j) => {
            if (fn(v, i, j, this)) {
                locationCount++;
            }
        });
        if (locationCount == 0) {
            return [-1, -1];
        }
        else if (deterministic) {
            index = Math.floor(locationCount / 2);
        }
        else {
            index = random.range(0, locationCount - 1);
        }
        for (i = 0; i < this.width && index >= 0; i++) {
            for (j = 0; j < this.height && index >= 0; j++) {
                if (fn(this[i][j], i, j, this)) {
                    if (index == 0) {
                        return [i, j];
                    }
                    index--;
                }
            }
        }
        return [-1, -1];
    }
    matchingLocNear(x, y, v, deterministic = false) {
        let loc = [-1, -1];
        let i, j, k, candidateLocs, randIndex;
        const fn = typeof v === 'function'
            ? v
            : (val) => val == v;
        candidateLocs = 0;
        // count up the number of candidate locations
        for (k = 0; k < Math.max(this.width, this.height) && !candidateLocs; k++) {
            for (i = x - k; i <= x + k; i++) {
                for (j = y - k; j <= y + k; j++) {
                    if (this.hasXY(i, j) &&
                        (i == x - k ||
                            i == x + k ||
                            j == y - k ||
                            j == y + k) &&
                        fn(this[i][j], i, j, this)) {
                        candidateLocs++;
                    }
                }
            }
        }
        if (candidateLocs == 0) {
            return [-1, -1];
        }
        // and pick one
        if (deterministic) {
            randIndex = 1 + Math.floor(candidateLocs / 2);
        }
        else {
            randIndex = 1 + random.number(candidateLocs);
        }
        for (k = 0; k < Math.max(this.width, this.height); k++) {
            for (i = x - k; i <= x + k; i++) {
                for (j = y - k; j <= y + k; j++) {
                    if (this.hasXY(i, j) &&
                        (i == x - k ||
                            i == x + k ||
                            j == y - k ||
                            j == y + k) &&
                        fn(this[i][j], i, j, this)) {
                        if (--randIndex == 0) {
                            loc[0] = i;
                            loc[1] = j;
                            return loc;
                        }
                    }
                }
            }
        }
        // brogueAssert(false);
        return [-1, -1]; // should never reach this point
    }
    // Rotates around the cell, counting up the number of distinct strings of neighbors with the same test result in a single revolution.
    //		Zero means there are no impassable tiles adjacent.
    //		One means it is adjacent to a wall.
    //		Two means it is in a hallway or something similar.
    //		Three means it is the center of a T-intersection or something similar.
    //		Four means it is in the intersection of two hallways.
    //		Five or more means there is a bug.
    arcCount(x, y, testFn) {
        let oldX, oldY, newX, newY;
        // brogueAssert(grid.hasXY(x, y));
        testFn = testFn || Utils.IS_NONZERO;
        let arcCount = 0;
        let matchCount = 0;
        for (let dir = 0; dir < CDIRS.length; dir++) {
            oldX = x + CDIRS[(dir + 7) % 8][0];
            oldY = y + CDIRS[(dir + 7) % 8][1];
            newX = x + CDIRS[dir][0];
            newY = y + CDIRS[dir][1];
            // Counts every transition from passable to impassable or vice-versa on the way around the cell:
            const newOk = this.hasXY(newX, newY) &&
                testFn(this[newX][newY], newX, newY, this);
            const oldOk = this.hasXY(oldX, oldY) &&
                testFn(this[oldX][oldY], oldX, oldY, this);
            if (newOk)
                ++matchCount;
            if (newOk != oldOk) {
                arcCount++;
            }
        }
        if (arcCount == 0 && matchCount)
            return 1;
        return Math.floor(arcCount / 2); // Since we added one when we entered a wall and another when we left.
    }
}
const GRID_CACHE = [];
// @ts-ignore
let GRID_ACTIVE_COUNT = 0;
// @ts-ignore
let GRID_ALLOC_COUNT = 0;
// @ts-ignore
let GRID_CREATE_COUNT = 0;
// @ts-ignore
let GRID_FREE_COUNT = 0;
export class NumGrid extends Grid {
    constructor(w, h, v = 0) {
        super(w, h, v);
    }
    static alloc(w, h, v = 0) {
        if (!w || !h)
            throw new Error('Grid alloc requires width and height parameters.');
        ++GRID_ACTIVE_COUNT;
        ++GRID_ALLOC_COUNT;
        let grid = GRID_CACHE.pop();
        if (!grid) {
            ++GRID_CREATE_COUNT;
            return new NumGrid(w, h, v);
        }
        grid._resize(w, h, v);
        return grid;
    }
    static free(grid) {
        if (grid) {
            if (GRID_CACHE.indexOf(grid) >= 0)
                return;
            GRID_CACHE.push(grid);
            ++GRID_FREE_COUNT;
            --GRID_ACTIVE_COUNT;
        }
    }
    _resize(width, height, v = 0) {
        const fn = typeof v === 'function' ? v : () => v;
        while (this.length < width)
            this.push([]);
        this.length = width;
        let x = 0;
        let y = 0;
        for (x = 0; x < width; ++x) {
            const col = this[x];
            for (y = 0; y < height; ++y) {
                col[y] = fn(x, y);
            }
            col.length = height;
        }
        this._width = width;
        this._height = height;
        if (this.x !== undefined) {
            this.x = undefined;
            this.y = undefined;
        }
    }
    findReplaceRange(findValueMin, findValueMax, fillValue) {
        this.update((v) => {
            if (v >= findValueMin && v <= findValueMax) {
                return fillValue;
            }
            return v;
        });
    }
    // Flood-fills the grid from (x, y) along cells that are within the eligible range.
    // Returns the total count of filled cells.
    floodFillRange(x, y, eligibleValueMin = 0, eligibleValueMax = 0, fillValue = 0) {
        let dir;
        let newX, newY, fillCount = 1;
        if (fillValue >= eligibleValueMin && fillValue <= eligibleValueMax) {
            throw new Error('Invalid grid flood fill');
        }
        const ok = (x, y) => {
            return (this.hasXY(x, y) &&
                this[x][y] >= eligibleValueMin &&
                this[x][y] <= eligibleValueMax);
        };
        if (!ok(x, y))
            return 0;
        this[x][y] = fillValue;
        for (dir = 0; dir < 4; dir++) {
            newX = x + DIRS[dir][0];
            newY = y + DIRS[dir][1];
            if (ok(newX, newY)) {
                fillCount += this.floodFillRange(newX, newY, eligibleValueMin, eligibleValueMax, fillValue);
            }
        }
        return fillCount;
    }
    invert() {
        this.update((v) => (v ? 0 : 1));
    }
    leastPositiveValue() {
        let least = Number.MAX_SAFE_INTEGER;
        this.forEach((v) => {
            if (v > 0 && v < least) {
                least = v;
            }
        });
        return least;
    }
    randomLeastPositiveLoc(deterministic = false) {
        const targetValue = this.leastPositiveValue();
        return this.randomMatchingLoc(targetValue, deterministic);
    }
    // Marks a cell as being a member of blobNumber, then recursively iterates through the rest of the blob
    floodFill(x, y, matchValue, fillValue) {
        let dir;
        let newX, newY, numberOfCells = 1;
        const matchFn = typeof matchValue == 'function'
            ? matchValue
            : (v) => v == matchValue;
        const fillFn = typeof fillValue == 'function' ? fillValue : () => fillValue;
        this[x][y] = fillFn(this[x][y], x, y, this);
        // Iterate through the four cardinal neighbors.
        for (dir = 0; dir < 4; dir++) {
            newX = x + DIRS[dir][0];
            newY = y + DIRS[dir][1];
            if (!this.hasXY(newX, newY)) {
                continue;
            }
            if (matchFn(this[newX][newY], newX, newY, this)) {
                // If the neighbor is an unmarked region cell,
                numberOfCells += this.floodFill(newX, newY, matchFn, fillFn); // then recurse.
            }
        }
        return numberOfCells;
    }
    _cellularAutomataRound(birthParameters /* char[9] */, survivalParameters /* char[9] */) {
        let i, j, nbCount, newX, newY;
        let dir;
        let buffer2;
        buffer2 = NumGrid.alloc(this.width, this.height);
        buffer2.copy(this); // Make a backup of this in buffer2, so that each generation is isolated.
        let didSomething = false;
        for (i = 0; i < this.width; i++) {
            for (j = 0; j < this.height; j++) {
                nbCount = 0;
                for (dir = 0; dir < DIRS.length; dir++) {
                    newX = i + DIRS[dir][0];
                    newY = j + DIRS[dir][1];
                    if (this.hasXY(newX, newY) && buffer2[newX][newY]) {
                        nbCount++;
                    }
                }
                if (!buffer2[i][j] && birthParameters[nbCount] == 't') {
                    this[i][j] = 1; // birth
                    didSomething = true;
                }
                else if (buffer2[i][j] &&
                    survivalParameters[nbCount] == 't') {
                    // survival
                }
                else {
                    this[i][j] = 0; // death
                    didSomething = true;
                }
            }
        }
        NumGrid.free(buffer2);
        return didSomething;
    }
    // Loads up **grid with the results of a cellular automata simulation.
    fillBlob(roundCount, minBlobWidth, minBlobHeight, maxBlobWidth, maxBlobHeight, percentSeeded = 50, birthParameters = 'ffffffttt', survivalParameters = 'ffffttttt') {
        let i, j, k;
        let blobNumber, blobSize, topBlobNumber, topBlobSize;
        let topBlobMinX, topBlobMinY, topBlobMaxX, topBlobMaxY, blobWidth, blobHeight;
        let foundACellThisLine;
        birthParameters = birthParameters.toLowerCase();
        survivalParameters = survivalParameters.toLowerCase();
        if (minBlobWidth >= maxBlobWidth) {
            minBlobWidth = Math.round(0.75 * maxBlobWidth);
            maxBlobWidth = Math.round(1.25 * maxBlobWidth);
        }
        if (minBlobHeight >= maxBlobHeight) {
            minBlobHeight = Math.round(0.75 * maxBlobHeight);
            maxBlobHeight = Math.round(1.25 * maxBlobHeight);
        }
        const left = Math.floor((this.width - maxBlobWidth) / 2);
        const top = Math.floor((this.height - maxBlobHeight) / 2);
        // Generate blobs until they satisfy the minBlobWidth and minBlobHeight restraints
        do {
            // Clear buffer.
            this.fill(0);
            // Fill relevant portion with noise based on the percentSeeded argument.
            for (i = 0; i < maxBlobWidth; i++) {
                for (j = 0; j < maxBlobHeight; j++) {
                    this[i + left][j + top] = random.chance(percentSeeded)
                        ? 1
                        : 0;
                }
            }
            // Some iterations of cellular automata
            for (k = 0; k < roundCount; k++) {
                if (!this._cellularAutomataRound(birthParameters, survivalParameters)) {
                    k = roundCount; // cellularAutomataRound did not make any changes
                }
            }
            // Now to measure the result. These are best-of variables; start them out at worst-case values.
            topBlobSize = 0;
            topBlobNumber = 0;
            topBlobMinX = this.width;
            topBlobMaxX = 0;
            topBlobMinY = this.height;
            topBlobMaxY = 0;
            // Fill each blob with its own number, starting with 2 (since 1 means floor), and keeping track of the biggest:
            blobNumber = 2;
            for (i = 0; i < this.width; i++) {
                for (j = 0; j < this.height; j++) {
                    if (this[i][j] == 1) {
                        // an unmarked blob
                        // Mark all the cells and returns the total size:
                        blobSize = this.floodFill(i, j, 1, blobNumber);
                        if (blobSize > topBlobSize) {
                            // if this blob is a new record
                            topBlobSize = blobSize;
                            topBlobNumber = blobNumber;
                        }
                        blobNumber++;
                    }
                }
            }
            // Figure out the top blob's height and width:
            // First find the max & min x:
            for (i = 0; i < this.width; i++) {
                foundACellThisLine = false;
                for (j = 0; j < this.height; j++) {
                    if (this[i][j] == topBlobNumber) {
                        foundACellThisLine = true;
                        break;
                    }
                }
                if (foundACellThisLine) {
                    if (i < topBlobMinX) {
                        topBlobMinX = i;
                    }
                    if (i > topBlobMaxX) {
                        topBlobMaxX = i;
                    }
                }
            }
            // Then the max & min y:
            for (j = 0; j < this.height; j++) {
                foundACellThisLine = false;
                for (i = 0; i < this.width; i++) {
                    if (this[i][j] == topBlobNumber) {
                        foundACellThisLine = true;
                        break;
                    }
                }
                if (foundACellThisLine) {
                    if (j < topBlobMinY) {
                        topBlobMinY = j;
                    }
                    if (j > topBlobMaxY) {
                        topBlobMaxY = j;
                    }
                }
            }
            blobWidth = topBlobMaxX - topBlobMinX + 1;
            blobHeight = topBlobMaxY - topBlobMinY + 1;
        } while (blobWidth < minBlobWidth ||
            blobHeight < minBlobHeight ||
            topBlobNumber == 0);
        // Replace the winning blob with 1's, and everything else with 0's:
        for (i = 0; i < this.width; i++) {
            for (j = 0; j < this.height; j++) {
                if (this[i][j] == topBlobNumber) {
                    this[i][j] = 1;
                }
                else {
                    this[i][j] = 0;
                }
            }
        }
        // Populate the returned variables.
        return {
            x: topBlobMinX,
            y: topBlobMinY,
            width: blobWidth,
            height: blobHeight,
        };
    }
}
// Grid.fillBlob = fillBlob;
export const alloc = NumGrid.alloc.bind(NumGrid);
export const free = NumGrid.free.bind(NumGrid);
export function make(w, h, v) {
    if (v === undefined)
        return new NumGrid(w, h, 0);
    if (typeof v === 'number')
        return new NumGrid(w, h, v);
    return new Grid(w, h, v);
}
Make.grid = make;
export function offsetZip(destGrid, srcGrid, srcToDestX, srcToDestY, value) {
    const fn = typeof value === 'function'
        ? value
        : (_d, _s, dx, dy) => (destGrid[dx][dy] = value);
    srcGrid.forEach((c, i, j) => {
        const destX = i + srcToDestX;
        const destY = j + srcToDestY;
        if (!destGrid.hasXY(destX, destY))
            return;
        if (!c)
            return;
        fn(destGrid[destX][destY], c, destX, destY, i, j, destGrid, srcGrid);
    });
}
// Grid.offsetZip = offsetZip;
// If the indicated tile is a wall on the room stored in grid, and it could be the site of
// a door out of that room, then return the outbound direction that the door faces.
// Otherwise, return def.NO_DIRECTION.
export function directionOfDoorSite(grid, x, y, isOpen) {
    let dir, solutionDir;
    let newX, newY, oppX, oppY;
    const fnOpen = typeof isOpen === 'function'
        ? isOpen
        : (v) => v == isOpen;
    solutionDir = Utils.NO_DIRECTION;
    for (dir = 0; dir < 4; dir++) {
        newX = x + DIRS[dir][0];
        newY = y + DIRS[dir][1];
        oppX = x - DIRS[dir][0];
        oppY = y - DIRS[dir][1];
        if (grid.hasXY(oppX, oppY) &&
            grid.hasXY(newX, newY) &&
            fnOpen(grid[oppX][oppY], oppX, oppY, grid)) {
            // This grid cell would be a valid tile on which to place a door that, facing outward, points dir.
            if (solutionDir != Utils.NO_DIRECTION) {
                // Already claimed by another direction; no doors here!
                return Utils.NO_DIRECTION;
            }
            solutionDir = dir;
        }
    }
    return solutionDir;
}
// Grid.directionOfDoorSite = directionOfDoorSite;
export function intersection(onto, a, b) {
    b = b || onto;
    // @ts-ignore
    onto.update((_, i, j) => (a[i][j] && b[i][j]) || 0);
}
// Grid.intersection = intersection;
export function unite(onto, a, b) {
    b = b || onto;
    // @ts-ignore
    onto.update((_, i, j) => b[i][j] || a[i][j]);
}
//# sourceMappingURL=grid.js.map