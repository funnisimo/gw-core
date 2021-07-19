import { random } from './random';
import * as Utils from './utils';

type Loc = Utils.Loc;
const DIRS = Utils.DIRS;

// var GRID = {};
// export { GRID as grid };

export type ArrayInit<T> = (i: number) => T;

export function makeArray<T>(l: number, fn?: T | ArrayInit<T>): Array<T> {
    if (fn === undefined) return new Array(l).fill(0);
    fn = (fn as ArrayInit<T>) || (() => 0);
    const arr = new Array(l);
    for (let i = 0; i < l; ++i) {
        arr[i] = fn(i);
    }
    return arr;
}

function _formatGridValue(v: any) {
    if (v === false) {
        return ' ';
    } else if (v === true) {
        return 'T';
    } else if (v < 10) {
        return '' + v;
    } else if (v < 36) {
        return String.fromCharCode('a'.charCodeAt(0) + v - 10);
    } else if (v < 62) {
        return String.fromCharCode('A'.charCodeAt(0) + v - 10 - 26);
    } else if (typeof v === 'string') {
        return v[0];
    } else {
        return '#';
    }
}

export type GridInit<T> = (x: number, y: number) => T;
export type GridEach<T> = (
    value: T,
    x: number,
    y: number,
    grid: Grid<T>
) => any;
export type AsyncGridEach<T> = (
    value: T,
    x: number,
    y: number,
    grid: Grid<T>
) => Promise<any>;

export type GridUpdate<T> = (
    value: T,
    x: number,
    y: number,
    grid: Grid<T>
) => T;
export type GridMatch<T> = (
    value: T,
    x: number,
    y: number,
    grid: Grid<T>
) => boolean;
export type GridFormat<T> = (value: T, x: number, y: number) => string;

export class Grid<T> extends Array<Array<T>> {
    protected _width: number;
    protected _height: number;

    constructor(w: number, h: number, v: GridInit<T> | T) {
        super(w);
        for (let x = 0; x < w; ++x) {
            if (typeof v === 'function') {
                this[x] = new Array(h)
                    .fill(0)
                    .map((_: any, i: number) => (v as GridInit<T>)(x, i));
            } else {
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

    get(x: number, y: number) {
        if (!this.hasXY(x, y)) return undefined;
        return this[x][y];
    }

    set(x: number, y: number, v: T) {
        if (!this.hasXY(x, y)) return false;
        this[x][y] = v;
        return true;
    }

    /**
     * Calls the supplied function for each cell in the grid.
     * @param fn - The function to call on each item in the grid.
     * TSIGNORE
     */
    // @ts-ignore
    forEach(fn: GridEach<T>) {
        let i, j;
        for (i = 0; i < this.width; i++) {
            for (j = 0; j < this.height; j++) {
                fn(this[i][j], i, j, this);
            }
        }
    }

    async forEachAsync(fn: AsyncGridEach<T>) {
        let i, j;
        for (i = 0; i < this.width; i++) {
            for (j = 0; j < this.height; j++) {
                await fn(this[i][j], i, j, this);
            }
        }
    }

    eachNeighbor(x: number, y: number, fn: GridEach<T>, only4dirs = false) {
        Utils.eachNeighbor(
            x,
            y,
            (i, j) => {
                if (this.hasXY(i, j)) {
                    fn(this[i][j], i, j, this);
                }
            },
            only4dirs
        );
    }

    async eachNeighborAsync(
        x: number,
        y: number,
        fn: AsyncGridEach<T>,
        only4dirs = false
    ) {
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

    forRect(x: number, y: number, w: number, h: number, fn: GridEach<T>) {
        Utils.forRect(x, y, w, h, (i, j) => {
            if (this.hasXY(i, j)) {
                fn(this[i][j], i, j, this);
            }
        });
    }

    randomEach(fn: GridEach<T>) {
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
    map(fn: GridEach<T>) {
        // @ts-ignore
        const other = new this.constructor(this.width, this.height);
        other.copy(this);
        other.update(fn);
        return other;
    }

    forCircle(x: number, y: number, radius: number, fn: GridEach<T>) {
        Utils.forCircle(x, y, radius, (i, j) => {
            if (this.hasXY(i, j)) fn(this[i][j], i, j, this);
        });
    }

    hasXY(x: number, y: number) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    isBoundaryXY(x: number, y: number) {
        return (
            this.hasXY(x, y) &&
            (x == 0 || x == this.width - 1 || y == 0 || y == this.height - 1)
        );
    }

    calcBounds() {
        const bounds = {
            left: this.width,
            top: this.height,
            right: 0,
            bottom: 0,
        };
        this.forEach((v, i, j) => {
            if (!v) return;
            if (bounds.left > i) bounds.left = i;
            if (bounds.right < i) bounds.right = i;
            if (bounds.top > j) bounds.top = j;
            if (bounds.bottom < j) bounds.bottom = j;
        });
        return bounds;
    }

    update(fn: GridUpdate<T>) {
        Utils.forRect(this.width, this.height, (i, j) => {
            if (this.hasXY(i, j)) this[i][j] = fn(this[i][j], i, j, this);
        });
    }

    updateRect(
        x: number,
        y: number,
        width: number,
        height: number,
        fn: GridUpdate<T>
    ) {
        Utils.forRect(x, y, width, height, (i, j) => {
            if (this.hasXY(i, j)) this[i][j] = fn(this[i][j], i, j, this);
        });
    }

    updateCircle(x: number, y: number, radius: number, fn: GridUpdate<T>) {
        Utils.forCircle(x, y, radius, (i, j) => {
            if (this.hasXY(i, j)) {
                this[i][j] = fn(this[i][j], i, j, this);
            }
        });
    }

    /**
     * Fills the entire grid with the supplied value
     * @param v - The fill value or a function that returns the fill value.
     * TSIGNORE
     */
    // @ts-ignore
    fill(v: T | GridUpdate<T>) {
        const fn: GridUpdate<T> =
            typeof v === 'function' ? (v as GridUpdate<T>) : () => v;
        this.update(fn);
    }

    fillRect(x: number, y: number, w: number, h: number, v: T | GridUpdate<T>) {
        const fn: GridUpdate<T> =
            typeof v === 'function' ? (v as GridUpdate<T>) : () => v;
        this.updateRect(x, y, w, h, fn);
    }

    fillCircle(x: number, y: number, radius: number, v: T | GridUpdate<T>) {
        const fn: GridUpdate<T> =
            typeof v === 'function' ? (v as GridUpdate<T>) : () => v;
        this.updateCircle(x, y, radius, fn);
    }

    replace(findValue: T, replaceValue: T) {
        this.update((v) => (v == findValue ? replaceValue : v));
    }

    copy(from: Grid<T>) {
        // TODO - check width, height?
        this.update((_: any, i: number, j: number) => from[i][j]);
    }

    count(match: GridMatch<T> | T) {
        const fn: GridMatch<T> =
            typeof match === 'function'
                ? (match as GridMatch<T>)
                : (v: T) => v == match;
        let count = 0;
        this.forEach((v, i, j) => {
            if (fn(v, i, j, this)) ++count;
        });
        return count;
    }

    dump(fmtFn?: GridFormat<T>) {
        this.dumpRect(0, 0, this.width, this.height, fmtFn);
    }

    dumpRect(
        left: number,
        top: number,
        width: number,
        height: number,
        fmtFn?: GridFormat<T>
    ) {
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

    dumpAround(x: number, y: number, radius: number) {
        this.dumpRect(x - radius, y - radius, 2 * radius, 2 * radius);
    }

    // TODO - Use for(radius) loop to speed this up (do not look at each cell)
    closestMatchingLoc(x: number, y: number, v: T | GridMatch<T>): Loc {
        let bestLoc: Loc = [-1, -1];
        let bestDistance = 100 * (this.width + this.height);

        const fn: GridMatch<T> =
            typeof v === 'function'
                ? (v as GridMatch<T>)
                : (val: T) => val == v;

        this.forEach((v, i, j) => {
            if (fn(v, i, j, this)) {
                const dist = Math.floor(
                    100 * Utils.distanceBetween(x, y, i, j)
                );
                if (dist < bestDistance) {
                    bestLoc[0] = i;
                    bestLoc[1] = j;
                    bestDistance = dist;
                } else if (dist == bestDistance && random.chance(50)) {
                    bestLoc[0] = i;
                    bestLoc[1] = j;
                }
            }
        });

        return bestLoc;
    }

    firstMatchingLoc(v: T | GridMatch<T>): Loc {
        const fn: GridMatch<T> =
            typeof v === 'function'
                ? (v as GridMatch<T>)
                : (val: T) => val == v;

        for (let i = 0; i < this.width; ++i) {
            for (let j = 0; j < this.height; ++j) {
                if (fn(this[i][j], i, j, this)) {
                    return [i, j];
                }
            }
        }
        return [-1, -1];
    }

    randomMatchingLoc(v: T | GridMatch<T>): Loc {
        const fn: Utils.XYMatchFunc =
            typeof v === 'function'
                ? (x, y) => (v as GridMatch<T>)(this[x][y], x, y, this)
                : (x, y) => this.get(x, y) === v;

        return random.matchingXY(this.width, this.height, fn);
    }

    matchingLocNear(x: number, y: number, v: T | GridMatch<T>): Loc {
        const fn: Utils.XYMatchFunc =
            typeof v === 'function'
                ? (x, y) => (v as GridMatch<T>)(this[x][y], x, y, this)
                : (x, y) => this.get(x, y) === v;

        return random.matchingXYNear(x, y, fn);
    }

    // Rotates around the cell, counting up the number of distinct strings of neighbors with the same test result in a single revolution.
    //		Zero means there are no impassable tiles adjacent.
    //		One means it is adjacent to a wall.
    //		Two means it is in a hallway or something similar.
    //		Three means it is the center of a T-intersection or something similar.
    //		Four means it is in the intersection of two hallways.
    //		Five or more means there is a bug.
    arcCount(x: number, y: number, testFn: GridMatch<T>) {
        return Utils.arcCount(x, y, (i, j) => {
            return this.hasXY(i, j) && testFn(this[i][j], i, j, this);
        });
    }
}

const GRID_CACHE: NumGrid[] = [];

// @ts-ignore
let GRID_ACTIVE_COUNT = 0;
// @ts-ignore
let GRID_ALLOC_COUNT = 0;
// @ts-ignore
let GRID_CREATE_COUNT = 0;
// @ts-ignore
let GRID_FREE_COUNT = 0;

export class NumGrid extends Grid<number> {
    public x?: number;
    public y?: number;

    static alloc(w: number, h: number, v: GridInit<number> | number): NumGrid;
    static alloc(w: number, h: number): NumGrid;
    static alloc(source: NumGrid): NumGrid;
    static alloc(...args: any[]): NumGrid {
        let w = args[0] || 0;
        let h = args[1] || 0;
        let v = args[2] || 0;

        if (args.length == 1) {
            // clone from NumGrid
            w = args[0].width;
            h = args[0].height;
            v = args[0].get.bind(args[0]);
        }

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

    static free(grid: NumGrid) {
        if (grid) {
            if (GRID_CACHE.indexOf(grid) >= 0) return;

            GRID_CACHE.push(grid);
            ++GRID_FREE_COUNT;
            --GRID_ACTIVE_COUNT;
        }
    }

    constructor(w: number, h: number, v: GridInit<number> | number = 0) {
        super(w, h, v);
    }

    protected _resize(
        width: number,
        height: number,
        v: GridInit<number> | number = 0
    ) {
        const fn: GridInit<number> =
            typeof v === 'function' ? (v as GridInit<number>) : () => v;

        while (this.length < width) this.push([]);
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

    findReplaceRange(
        findValueMin: number,
        findValueMax: number,
        fillValue: number
    ) {
        this.update((v: number) => {
            if (v >= findValueMin && v <= findValueMax) {
                return fillValue;
            }
            return v;
        });
    }

    // Flood-fills the grid from (x, y) along cells that are within the eligible range.
    // Returns the total count of filled cells.
    floodFillRange(
        x: number,
        y: number,
        eligibleValueMin = 0,
        eligibleValueMax = 0,
        fillValue = 0
    ) {
        let dir;
        let newX,
            newY,
            fillCount = 1;

        if (fillValue >= eligibleValueMin && fillValue <= eligibleValueMax) {
            throw new Error('Invalid grid flood fill');
        }

        const ok = (x: number, y: number) => {
            return (
                this.hasXY(x, y) &&
                this[x][y] >= eligibleValueMin &&
                this[x][y] <= eligibleValueMax
            );
        };

        if (!ok(x, y)) return 0;
        this[x][y] = fillValue;
        for (dir = 0; dir < 4; dir++) {
            newX = x + DIRS[dir][0];
            newY = y + DIRS[dir][1];
            if (ok(newX, newY)) {
                fillCount += this.floodFillRange(
                    newX,
                    newY,
                    eligibleValueMin,
                    eligibleValueMax,
                    fillValue
                );
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

    randomLeastPositiveLoc(): Loc {
        const targetValue = this.leastPositiveValue();
        return this.randomMatchingLoc(targetValue);
    }

    valueBounds(value: number, bounds?: Utils.Bounds) {
        let foundValueAtThisLine = false;
        let i: number, j: number;
        let left = this.width - 1,
            right = 0,
            top = this.height - 1,
            bottom = 0;

        // Figure out the top blob's height and width:
        // First find the max & min x:
        for (i = 0; i < this.width; i++) {
            foundValueAtThisLine = false;
            for (j = 0; j < this.height; j++) {
                if (this[i][j] == value) {
                    foundValueAtThisLine = true;
                    break;
                }
            }
            if (foundValueAtThisLine) {
                if (i < left) {
                    left = i;
                }
                if (i > right) {
                    right = i;
                }
            }
        }

        // Then the max & min y:
        for (j = 0; j < this.height; j++) {
            foundValueAtThisLine = false;
            for (i = 0; i < this.width; i++) {
                if (this[i][j] == value) {
                    foundValueAtThisLine = true;
                    break;
                }
            }
            if (foundValueAtThisLine) {
                if (j < top) {
                    top = j;
                }
                if (j > bottom) {
                    bottom = j;
                }
            }
        }

        bounds = bounds || new Utils.Bounds(0, 0, 0, 0);
        bounds.x = left;
        bounds.y = top;
        bounds.width = right - left + 1;
        bounds.height = bottom - top + 1;
        return bounds;
    }

    // Marks a cell as being a member of blobNumber, then recursively iterates through the rest of the blob
    floodFill(
        x: number,
        y: number,
        matchValue: number | GridMatch<number>,
        fillValue: number | GridUpdate<number>
    ) {
        let dir;
        let newX,
            newY,
            numberOfCells = 1;

        const matchFn =
            typeof matchValue == 'function'
                ? matchValue
                : (v: any) => v == matchValue;
        const fillFn =
            typeof fillValue == 'function' ? fillValue : () => fillValue;

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
}

// Grid.fillBlob = fillBlob;

export const alloc = NumGrid.alloc.bind(NumGrid);
export const free = NumGrid.free.bind(NumGrid);

export function make<T>(
    w: number,
    h: number,
    v?: number | GridInit<number>
): NumGrid;
export function make<T>(w: number, h: number, v?: T | GridInit<T>): Grid<T>;
export function make<T>(w: number, h: number, v?: T | GridInit<T>) {
    if (v === undefined) return new NumGrid(w, h, 0);
    if (typeof v === 'number') return new NumGrid(w, h, v);
    return new Grid<T>(w, h, v);
}

export type GridZip<T, U> = (
    destVal: T,
    sourceVal: U,
    destX: number,
    destY: number,
    sourceX: number,
    sourceY: number,
    destGrid: Grid<T>,
    sourceGrid: Grid<U>
) => void;

export function offsetZip<T, U>(
    destGrid: Grid<T>,
    srcGrid: Grid<U>,
    srcToDestX: number,
    srcToDestY: number,
    value: T | GridZip<T, U>
) {
    const fn: GridZip<T, U> =
        typeof value === 'function'
            ? (value as GridZip<T, U>)
            : (_d: T, _s: U, dx: number, dy: number) =>
                  (destGrid[dx][dy] = value);
    srcGrid.forEach((c, i, j) => {
        const destX = i + srcToDestX;
        const destY = j + srcToDestY;
        if (!destGrid.hasXY(destX, destY)) return;
        if (!c) return;
        fn(destGrid[destX][destY], c, destX, destY, i, j, destGrid, srcGrid);
    });
}

// Grid.offsetZip = offsetZip;

export function intersection(onto: NumGrid, a: NumGrid, b?: NumGrid) {
    b = b || onto;
    // @ts-ignore
    onto.update((_, i, j) => (a[i][j] && b[i][j]) || 0);
}

// Grid.intersection = intersection;

export function unite(onto: NumGrid, a: NumGrid, b?: NumGrid) {
    b = b || onto;
    // @ts-ignore
    onto.update((_, i, j) => b[i][j] || a[i][j]);
}
