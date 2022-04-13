import { random } from './rng';
import * as XY from './xy';

type Loc = XY.Loc;
const DIRS = XY.DIRS;

// var GRID = {};
// export { GRID as grid };

export type ArrayInit<T> = (i: number) => T;

export function makeArray<T>(l: number, fn?: T | ArrayInit<T>): Array<T> {
    if (fn === undefined) return new Array(l).fill(0);
    let initFn: ArrayInit<T>;
    if (typeof fn !== 'function') {
        initFn = () => fn;
    } else {
        initFn = fn as ArrayInit<T>;
    }
    const arr = new Array(l);
    for (let i = 0; i < l; ++i) {
        arr[i] = initFn(i);
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

export type GridInit<T> = (x: number, y: number, grid: Grid<T>) => T;
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
        const grid = this;
        for (let x = 0; x < w; ++x) {
            if (typeof v === 'function') {
                this[x] = new Array(h)
                    .fill(0)
                    .map((_: any, i: number) => (v as GridInit<T>)(x, i, grid));
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
        XY.eachNeighbor(
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
        XY.forRect(x, y, w, h, (i, j) => {
            if (this.hasXY(i, j)) {
                fn(this[i][j], i, j, this);
            }
        });
    }

    randomEach(fn: GridEach<T>): boolean {
        const sequence = random.sequence(this.width * this.height);
        for (let i = 0; i < sequence.length; ++i) {
            const n = sequence[i];
            const x = n % this.width;
            const y = Math.floor(n / this.width);
            if (fn(this[x][y], x, y, this) === true) return true;
        }
        return false;
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

    /**
     * Returns whether or not an item in the grid matches the provided function.
     * @param fn - The function that matches
     * TODO - Do we need this???
     * TODO - Should this only be in NumGrid?
     * TODO - Should it alloc instead of using constructor?
     * TSIGNORE
     */
    // @ts-ignore
    some(fn: GridMatch<T>): boolean {
        return super.some((col, x) =>
            col.some((data, y) => fn(data, x, y, this))
        );
    }

    forCircle(x: number, y: number, radius: number, fn: GridEach<T>) {
        XY.forCircle(x, y, radius, (i, j) => {
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
        XY.forRect(this.width, this.height, (i, j) => {
            this[i][j] = fn(this[i][j], i, j, this);
        });
    }

    updateRect(
        x: number,
        y: number,
        width: number,
        height: number,
        fn: GridUpdate<T>
    ) {
        XY.forRect(x, y, width, height, (i, j) => {
            if (this.hasXY(i, j)) this[i][j] = fn(this[i][j], i, j, this);
        });
    }

    updateCircle(x: number, y: number, radius: number, fn: GridUpdate<T>) {
        XY.forCircle(x, y, radius, (i, j) => {
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

    /**
     * Finds the first matching value/result and returns that location as an xy.Loc
     * @param v - The fill value or a function that returns the fill value.
     * @returns xy.Loc | null - The location of the first cell matching the criteria or null if not found.
     * TSIGNORE
     */
    // @ts-ignore
    find(match: GridMatch<T> | T): XY.Loc | null {
        const fn: GridMatch<T> =
            typeof match === 'function'
                ? (match as GridMatch<T>)
                : (v: T) => v == match;
        for (let x = 0; x < this.width; ++x) {
            for (let y = 0; y < this.height; ++y) {
                const v = this[x][y];
                if (fn(v, x, y, this)) return [x, y] as XY.Loc;
            }
        }
        return null;
    }

    dump(fmtFn?: GridFormat<T>, log = console.log) {
        this.dumpRect(0, 0, this.width, this.height, fmtFn, log);
    }

    dumpRect(
        left: number,
        top: number,
        width: number,
        height: number,
        fmtFn?: GridFormat<T>,
        log = console.log
    ) {
        fmtFn = fmtFn || _formatGridValue;

        const format = (x: number, y: number) => {
            return fmtFn!(this.get(x, y)!, x, y);
        };

        return XY.dumpRect(left, top, width, height, format, log);
    }

    dumpAround(
        x: number,
        y: number,
        radius: number,
        fmtFn?: GridFormat<T>,
        log = console.log
    ) {
        this.dumpRect(
            x - radius,
            y - radius,
            2 * radius,
            2 * radius,
            fmtFn,
            log
        );
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
                const dist = Math.floor(100 * XY.distanceBetween(x, y, i, j));
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
        const fn: XY.XYMatchFunc =
            typeof v === 'function'
                ? (x, y) => (v as GridMatch<T>)(this[x][y], x, y, this)
                : (x, y) => this.get(x, y) === v;

        return random.matchingLoc(this.width, this.height, fn);
    }

    matchingLocNear(x: number, y: number, v: T | GridMatch<T>): Loc {
        const fn: XY.XYMatchFunc =
            typeof v === 'function'
                ? (x, y) => (v as GridMatch<T>)(this[x][y], x, y, this)
                : (x, y) => this.get(x, y) === v;

        return random.matchingLocNear(x, y, fn);
    }

    // Rotates around the cell, counting up the number of distinct strings of neighbors with the same test result in a single revolution.
    //		Zero means there are no impassable tiles adjacent.
    //		One means it is adjacent to a wall.
    //		Two means it is in a hallway or something similar.
    //		Three means it is the center of a T-intersection or something similar.
    //		Four means it is in the intersection of two hallways.
    //		Five or more means there is a bug.
    arcCount(x: number, y: number, testFn: GridMatch<T>) {
        return XY.arcCount(x, y, (i, j) => {
            return this.hasXY(i, j) && testFn(this[i][j], i, j, this);
        });
    }
}

const GRID_CACHE: NumGrid[] = [];

export const stats = {
    active: 0,
    alloc: 0,
    create: 0,
    free: 0,
};

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

        ++stats.active;
        ++stats.alloc;

        let grid = GRID_CACHE.pop();
        if (!grid) {
            ++stats.create;
            return new NumGrid(w, h, v);
        }
        grid._resize(w, h, v);
        return grid;
    }

    static free(grid: NumGrid) {
        if (grid) {
            if (GRID_CACHE.indexOf(grid) >= 0) return;

            GRID_CACHE.push(grid);
            ++stats.free;
            --stats.active;
        }
    }

    constructor(w: number, h: number, v: GridInit<number> | number = 0) {
        super(w, h, v);
    }

    protected _resize(
        width: number,
        height: number,
        v: GridInit<number> | number
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
                col[y] = fn(x, y, this);
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
        eligibleValueMin: number,
        eligibleValueMax: number,
        fillValue: number
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

    valueBounds(value: number, bounds?: XY.Bounds) {
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

        bounds = bounds || new XY.Bounds(0, 0, 0, 0);
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
        const matchFn =
            typeof matchValue == 'function'
                ? matchValue
                : (v: any) => v == matchValue;
        const fillFn =
            typeof fillValue == 'function' ? fillValue : () => fillValue;

        let done = NumGrid.alloc(this.width, this.height);
        let newX, newY;

        const todo: XY.Loc[] = [[x, y]];
        const free: XY.Loc[] = [];

        let count = 1;

        while (todo.length) {
            const item = todo.pop()!;
            [x, y] = item;
            free.push(item);

            if (!this.hasXY(x, y) || done[x][y]) continue;
            if (!matchFn(this[x][y], x, y, this)) continue;
            this[x][y] = fillFn(this[x][y], x, y, this);
            done[x][y] = 1;
            ++count;

            // Iterate through the four cardinal neighbors.
            for (let dir = 0; dir < 4; dir++) {
                newX = x + DIRS[dir][0];
                newY = y + DIRS[dir][1];
                // If the neighbor is an unmarked region cell,
                const item = free.pop() || [-1, -1];
                item[0] = newX;
                item[1] = newY;
                todo.push(item);
            }
        }

        NumGrid.free(done);
        return count;
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
