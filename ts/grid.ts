import { Random, random } from './rng';
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

export type WalkFromCb<T> = (
    x: number,
    y: number,
    data: T,
    distance: number
) => boolean;

export class Grid<T> {
    protected _width: number;
    protected _height: number;
    _data: T[][] = []; // TODO - Can this stay protected?

    constructor(w: number, h: number, v: GridInit<T> | T) {
        const grid = this;
        for (let x = 0; x < w; ++x) {
            if (typeof v === 'function') {
                this._data[x] = new Array(h)
                    .fill(0)
                    .map((_: any, i: number) => (v as GridInit<T>)(x, i, grid));
            } else {
                this._data[x] = new Array(h).fill(v);
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

    get(x: number, y: number): T | undefined {
        if (!this.hasXY(x, y)) {
            return undefined;
        }
        return this._data[x][y];
    }

    set(x: number, y: number, v: T) {
        if (!this.hasXY(x, y)) return false;
        this._data[x][y] = v;
        return true;
    }

    /**
     * Calls the supplied function for each cell in the grid.
     * @param fn - The function to call on each item in the grid.
     */
    forEach(fn: GridEach<T>) {
        let i, j;
        for (i = 0; i < this.width; i++) {
            for (j = 0; j < this.height; j++) {
                fn(this._data[i][j], i, j, this);
            }
        }
    }

    async forEachAsync(fn: AsyncGridEach<T>) {
        let i, j;
        for (i = 0; i < this.width; i++) {
            for (j = 0; j < this.height; j++) {
                await fn(this._data[i][j], i, j, this);
            }
        }
    }

    eachNeighbor(x: number, y: number, fn: GridEach<T>, only4dirs = false) {
        XY.eachNeighbor(
            x,
            y,
            (i, j) => {
                if (this.hasXY(i, j)) {
                    fn(this._data[i][j], i, j, this);
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
                await fn(this._data[i][j], i, j, this);
            }
        }
    }

    forRect(x: number, y: number, w: number, h: number, fn: GridEach<T>) {
        XY.forRect(x, y, w, h, (i, j) => {
            if (this.hasXY(i, j)) {
                fn(this._data[i][j], i, j, this);
            }
        });
    }

    randomEach(fn: GridEach<T>, rng?: Random): boolean {
        rng = rng || random;
        const sequence = rng.sequence(this.width * this.height);
        for (let i = 0; i < sequence.length; ++i) {
            const n = sequence[i];
            const x = n % this.width;
            const y = Math.floor(n / this.width);
            if (fn(this._data[x][y], x, y, this) === true) return true;
        }
        return false;
    }

    /**
     * Returns a new Grid with the cells mapped according to the supplied function.
     * @param fn - The function that maps the cell values
     * TODO - Do we need this???
     * TODO - Should this only be in NumGrid?
     * TODO - Should it alloc instead of using constructor?
     */
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
     */
    some(fn: GridMatch<T>): boolean {
        return this._data.some((col, x) =>
            col.some((data, y) => fn(data, x, y, this))
        );
    }

    forCircle(x: number, y: number, radius: number, fn: GridEach<T>) {
        XY.forCircle(x, y, radius, (i, j) => {
            if (this.hasXY(i, j)) fn(this._data[i][j], i, j, this);
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

    calcBounds(val?: T | ((t: T) => boolean), bounds?: XY.Bounds): XY.Bounds {
        bounds = bounds || new XY.Bounds(0, 0, this.width, this.height);
        let fn: (t: T) => boolean;
        if (val === undefined) {
            fn = (v) => !!v;
        } else if (typeof val !== 'function') {
            fn = (t) => t == val;
        } else {
            fn = val as (t: T) => boolean;
        }
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
                if (fn(this._data[i][j])) {
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
                if (fn(this._data[i][j])) {
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
        if (right > 0) {
            bounds.x = left;
            bounds.width = right - left + 1;
        } else {
            bounds.x = 0;
            bounds.width = 0;
        }
        if (bottom > 0) {
            bounds.y = top;
            bounds.height = bottom - top + 1;
        } else {
            bounds.y = 0;
            bounds.height = 0;
        }
        return bounds;
    }

    update(fn: GridUpdate<T>): void;
    update(x: number, y: number, fn: GridUpdate<T>): void;
    update(...args: any[]): void {
        if (args.length > 1) {
            const [x, y, fn] = args;
            this._data[x][y] = fn(this._data[x][y], x, y, this);
            return;
        }
        const fn = args[0];
        XY.forRect(this.width, this.height, (i, j) => {
            this._data[i][j] = fn(this._data[i][j], i, j, this);
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
            if (this.hasXY(i, j))
                this._data[i][j] = fn(this._data[i][j], i, j, this);
        });
    }

    updateCircle(x: number, y: number, radius: number, fn: GridUpdate<T>) {
        XY.forCircle(x, y, radius, (i, j) => {
            if (this.hasXY(i, j)) {
                this._data[i][j] = fn(this._data[i][j], i, j, this);
            }
        });
    }

    /**
     * Fills the entire grid with the supplied value
     * @param v - The fill value or a function that returns the fill value.
     */
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
        this.update((_: any, i: number, j: number) => from._data[i][j]);
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
     */
    find(match: GridMatch<T> | T): XY.Loc | null {
        const fn: GridMatch<T> =
            typeof match === 'function'
                ? (match as GridMatch<T>)
                : (v: T) => v == match;
        for (let x = 0; x < this.width; ++x) {
            for (let y = 0; y < this.height; ++y) {
                const v = this._data[x][y];
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
            2 * radius + 1,
            2 * radius + 1,
            fmtFn,
            log
        );
    }

    // TODO - Use for(radius) loop to speed this up (do not look at each cell)
    closestMatchingLocs(
        x: number,
        y: number,
        match: T | GridMatch<T>
    ): Loc[] | null {
        // let bestLoc: Loc = [-1, -1];
        // let bestDistance = 100 * (this.width + this.height);

        const fn: GridMatch<T> =
            typeof match === 'function'
                ? (match as GridMatch<T>)
                : (val: T) => val == match;

        // this.forEach((v, i, j) => {
        //     if (fn(v, i, j, this)) {
        //         const dist = Math.floor(100 * XY.distanceBetween(x, y, i, j));
        //         if (dist < bestDistance) {
        //             bestLoc[0] = i;
        //             bestLoc[1] = j;
        //             bestDistance = dist;
        //         } else if (dist == bestDistance && random.chance(50)) {
        //             bestLoc[0] = i;
        //             bestLoc[1] = j;
        //         }
        //     }
        // });

        // return bestLoc;
        return XY.closestMatchingLocs(x, y, (x, y) => {
            if (!this.hasXY(x, y)) return false;
            return fn(this.get(x, y)!, x, y, this);
        });
    }

    firstMatchingLoc(v: T | GridMatch<T>): Loc {
        const fn: GridMatch<T> =
            typeof v === 'function'
                ? (v as GridMatch<T>)
                : (val: T) => val == v;

        for (let i = 0; i < this.width; ++i) {
            for (let j = 0; j < this.height; ++j) {
                if (fn(this._data[i][j], i, j, this)) {
                    return [i, j];
                }
            }
        }
        return [-1, -1];
    }

    randomMatchingLoc(v: T | GridMatch<T>): Loc {
        const fn: XY.XYMatchFunc =
            typeof v === 'function'
                ? (x, y) => (v as GridMatch<T>)(this._data[x][y], x, y, this)
                : (x, y) => this.get(x, y) === v;

        return random.matchingLoc(this.width, this.height, fn);
    }

    matchingLocNear(x: number, y: number, v: T | GridMatch<T>): Loc {
        const fn: XY.XYMatchFunc =
            typeof v === 'function'
                ? (x, y) => (v as GridMatch<T>)(this._data[x][y], x, y, this)
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
            return this.hasXY(i, j) && testFn(this._data[i][j], i, j, this);
        });
    }

    walkFrom(x: number, y: number, callback: WalkFromCb<T>): void;
    walkFrom(
        x: number,
        y: number,
        withDiagonals: boolean,
        callback: WalkFromCb<T>
    ): void;
    walkFrom(
        x: number,
        y: number,
        withDiagonals: boolean | WalkFromCb<T>,
        callback?: WalkFromCb<T>
    ) {
        if (typeof withDiagonals === 'function') {
            callback = withDiagonals;
            withDiagonals = true;
        }
        const seen = alloc(this.width, this.height);

        seen.set(x, y, 1);
        let nextSteps = [{ x, y }];
        let distance = 0;

        const dirs = withDiagonals ? DIRS : DIRS.slice(0, 4);

        while (nextSteps.length) {
            const current = nextSteps;
            nextSteps = [];
            for (let step of current) {
                seen.set(step.x, step.y, 1);

                const data = this.get(step.x, step.y)!;
                if (callback!(step.x, step.y, data, distance)) {
                    for (let dir of dirs) {
                        const x2 = step.x + dir[0];
                        const y2 = step.y + dir[1];
                        if (!seen.hasXY(x2, y2)) continue;
                        if (!seen.get(x2, y2)) {
                            seen.set(x2, y2, 1);
                            nextSteps.push({ x: x2, y: y2 });
                        }
                    }
                }
            }
            ++distance;
        }
        free(seen);
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

        while (this._data.length < width) this._data.push([]);
        this._data.length = width;

        let x = 0;
        let y = 0;
        for (x = 0; x < width; ++x) {
            const col = this._data[x];
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

    increment(x: number, y: number, inc: number = 1): number {
        this._data[x][y] += inc;
        return this._data[x][y];
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
                this._data[x][y] >= eligibleValueMin &&
                this._data[x][y] <= eligibleValueMax
            );
        };

        if (!ok(x, y)) return 0;
        this._data[x][y] = fillValue;
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

    // valueBounds(value: number | ((v: number) => boolean), bounds?: XY.Bounds) {
    //     let fn: (v: number) => boolean;
    //     if (typeof value === 'number') {
    //         fn = (v) => v == value;
    //     } else {
    //         fn = value;
    //     }
    //     let foundValueAtThisLine = false;
    //     let i: number, j: number;
    //     let left = this.width - 1,
    //         right = 0,
    //         top = this.height - 1,
    //         bottom = 0;

    //     // Figure out the top blob's height and width:
    //     // First find the max & min x:
    //     for (i = 0; i < this.width; i++) {
    //         foundValueAtThisLine = false;
    //         for (j = 0; j < this.height; j++) {
    //             if (fn(this._data[i][j])) {
    //                 foundValueAtThisLine = true;
    //                 break;
    //             }
    //         }
    //         if (foundValueAtThisLine) {
    //             if (i < left) {
    //                 left = i;
    //             }
    //             if (i > right) {
    //                 right = i;
    //             }
    //         }
    //     }

    //     // Then the max & min y:
    //     for (j = 0; j < this.height; j++) {
    //         foundValueAtThisLine = false;
    //         for (i = 0; i < this.width; i++) {
    //             if (fn(this._data[i][j])) {
    //                 foundValueAtThisLine = true;
    //                 break;
    //             }
    //         }
    //         if (foundValueAtThisLine) {
    //             if (j < top) {
    //                 top = j;
    //             }
    //             if (j > bottom) {
    //                 bottom = j;
    //             }
    //         }
    //     }

    //     bounds = bounds || new XY.Bounds(0, 0, 0, 0);
    //     bounds.x = left;
    //     bounds.y = top;
    //     bounds.width = right - left + 1;
    //     bounds.height = bottom - top + 1;
    //     return bounds;
    // }

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

            if (!this.hasXY(x, y) || done._data[x][y]) continue;
            if (!matchFn(this._data[x][y], x, y, this)) continue;
            this._data[x][y] = fillFn(this._data[x][y], x, y, this);
            done._data[x][y] = 1;
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
                  (destGrid._data[dx][dy] = value);
    srcGrid.forEach((c, i, j) => {
        const destX = i + srcToDestX;
        const destY = j + srcToDestY;
        if (!destGrid.hasXY(destX, destY)) return;
        if (!c) return;
        fn(
            destGrid._data[destX][destY],
            c,
            destX,
            destY,
            i,
            j,
            destGrid,
            srcGrid
        );
    });
}

// Grid.offsetZip = offsetZip;

export function intersection(onto: NumGrid, a: NumGrid, b?: NumGrid) {
    b = b || onto;
    // @ts-ignore
    onto.update((_, i, j) => (a.get(i, j) && b!.get(i, j)) || 0);
}

// Grid.intersection = intersection;

export function unite(onto: NumGrid, a: NumGrid, b?: NumGrid) {
    b = b || onto;
    // @ts-ignore
    onto.update((_, i, j) => b!.get(i, j) || a.get(i, j));
}

export interface ClosestMatchingOpts {
    rng?: Random;
    maxRadius?: number;
}

// //////////////////////
// export function closestMatchingLoc<T>(
//     loc: XY.XY | XY.Loc,
//     source: (x: number, y: number) => T | undefined,
//     match: (v: T, x: number, y: number) => boolean,
//     opts: ClosestMatchingOpts | Random = {}
// ): Loc | undefined {
//     if (opts instanceof Random) {
//         opts = { rng: opts };
//     }
//     const maxRadius = opts.maxRadius || 100;
//     const rng = opts.rng || random;

//     let radius = 0;
//     while (radius < maxRadius) {
//         let matches: XY.Loc[] = [];
//         XY.forRadius(XY.x(loc), XY.y(loc), radius, (x, y) => {
//             const v = source(x, y);
//             if (v !== undefined && match(v, x, y)) {
//                 matches.push([x, y]);
//             }
//         });
//         if (matches.length) {
//             return rng.item(matches);
//         }
//         radius += 1;
//     }
// }
