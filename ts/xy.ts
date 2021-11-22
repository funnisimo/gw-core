import { clamp } from './utils';
import { Loc, XY, Size } from './types';

export { Loc, XY, Size };

// DIRS are organized clockwise
// - first 4 are arrow directions
//   >> rotate 90 degrees clockwise ==>> newIndex = (oldIndex + 1) % 4
//   >> opposite direction ==>> oppIndex = (index + 2) % 4
// - last 4 are diagonals
//   >> rotate 90 degrees clockwise ==>> newIndex = 4 + (oldIndex + 1) % 4;
//   >> opposite diagonal ==>> newIndex = 4 + (index + 2) % 4;
export const DIRS: Loc[] = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
    [1, -1],
    [1, 1],
    [-1, 1],
    [-1, -1],
];

export const NO_DIRECTION = -1;
export const UP = 0;
export const RIGHT = 1;
export const DOWN = 2;
export const LEFT = 3;
export const RIGHT_UP = 4;
export const RIGHT_DOWN = 5;
export const LEFT_DOWN = 6;
export const LEFT_UP = 7;

// CLOCK DIRS are organized clockwise, starting at UP
// >> opposite = (index + 4) % 8
// >> 90 degrees rotate right = (index + 2) % 8
// >> 90 degrees rotate left = (8 + index - 2) % 8
export const CLOCK_DIRS: Loc[] = [
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
];

export function isLoc(a: any): a is Loc {
    return (
        Array.isArray(a) &&
        a.length == 2 &&
        typeof a[0] === 'number' &&
        typeof a[1] === 'number'
    );
}

export function isXY(a: any): a is XY {
    return a && typeof a.x === 'number' && typeof a.y === 'number';
}

export function x(src: XY | Loc) {
    // @ts-ignore
    return src.x || src[0] || 0;
}

export function y(src: XY | Loc) {
    // @ts-ignore
    return src.y || src[1] || 0;
}

export function contains(size: Size, x: number, y: number) {
    return x >= 0 && y >= 0 && x < size.width && y < size.height;
}

export class Bounds {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x = 0, y = 0, w = 0, h = 0) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    get left() {
        return this.x;
    }
    set left(v: number) {
        this.x = v;
    }
    get right() {
        return this.x + this.width;
    }
    set right(v: number) {
        this.x = v - this.width;
    }
    get top() {
        return this.y;
    }
    set top(v: number) {
        this.y = v;
    }
    get bottom() {
        return this.y + this.height;
    }
    set bottom(v: number) {
        this.y = v - this.height;
    }

    clone(): Bounds {
        return new Bounds(this.x, this.y, this.width, this.height);
    }

    contains(x: number, y: number): boolean;
    contains(loc: Loc | XY): boolean;
    contains(...args: any[]) {
        let i = args[0];
        let j = args[1];
        if (typeof i !== 'number') {
            j = y(i);
            i = x(i);
        }
        return (
            this.x <= i &&
            this.y <= j &&
            this.x + this.width > i &&
            this.y + this.height > j
        );
    }

    toString() {
        return `[${this.x},${this.y} -> ${this.right},${this.bottom}]`;
    }
}

export function copyXY(dest: XY, src: XY | Loc) {
    dest.x = x(src);
    dest.y = y(src);
}

export function addXY(dest: XY, src: XY | Loc) {
    dest.x += x(src);
    dest.y += y(src);
}

export function equalsXY(
    dest: XY | Loc | null | undefined,
    src: XY | Loc | null | undefined
) {
    if (!dest && !src) return true;
    if (!dest || !src) return false;
    return x(dest) == x(src) && y(dest) == y(src);
}

export function lerpXY(a: XY | Loc, b: XY | Loc, pct: number) {
    if (pct > 1) {
        pct = pct / 100;
    }
    pct = clamp(pct, 0, 1);
    const dx = x(b) - x(a);
    const dy = y(b) - y(a);
    const x2 = x(a) + Math.floor(dx * pct);
    const y2 = y(a) + Math.floor(dy * pct);
    return [x2, y2];
}

export type XYFunc = (x: number, y: number) => any;

export function eachNeighbor(
    x: number,
    y: number,
    fn: XYFunc,
    only4dirs = false
) {
    const max = only4dirs ? 4 : 8;
    for (let i = 0; i < max; ++i) {
        const dir = DIRS[i];
        const x1 = x + dir[0];
        const y1 = y + dir[1];
        fn(x1, y1);
    }
}

export async function eachNeighborAsync(
    x: number,
    y: number,
    fn: XYFunc,
    only4dirs = false
) {
    const max = only4dirs ? 4 : 8;
    for (let i = 0; i < max; ++i) {
        const dir = DIRS[i];
        const x1 = x + dir[0];
        const y1 = y + dir[1];
        await fn(x1, y1);
    }
}

export type XYMatchFunc = (x: number, y: number) => boolean;

export function matchingNeighbor(
    x: number,
    y: number,
    matchFn: XYMatchFunc,
    only4dirs = false
): Loc {
    const maxIndex = only4dirs ? 4 : 8;
    for (let d = 0; d < maxIndex; ++d) {
        const dir = DIRS[d];
        const i = x + dir[0];
        const j = y + dir[1];
        if (matchFn(i, j)) return [i, j];
    }
    return [-1, -1];
}

export function straightDistanceBetween(
    x1: number,
    y1: number,
    x2: number,
    y2: number
) {
    const x = Math.abs(x1 - x2);
    const y = Math.abs(y1 - y2);
    return x + y;
}

export function maxAxisFromTo(a: XY | Loc, b: XY | Loc): number {
    const xa = Math.abs(x(a) - x(b));
    const ya = Math.abs(y(a) - y(b));
    return Math.max(xa, ya);
}

export function maxAxisBetween(
    x1: number,
    y1: number,
    x2: number,
    y2: number
): number {
    const xa = Math.abs(x1 - x2);
    const ya = Math.abs(y1 - y2);
    return Math.max(xa, ya);
}

export function distanceBetween(
    x1: number,
    y1: number,
    x2: number,
    y2: number
) {
    const x = Math.abs(x1 - x2);
    const y = Math.abs(y1 - y2);
    const min = Math.min(x, y);
    return x + y - 0.6 * min;
}

export function distanceFromTo(a: XY | Loc, b: XY | Loc) {
    return distanceBetween(x(a), y(a), x(b), y(b));
}

export function calcRadius(x: number, y: number) {
    return distanceBetween(0, 0, x, y);
}

export function dirBetween(x: number, y: number, toX: number, toY: number) {
    let diffX = toX - x;
    let diffY = toY - y;
    if (diffX && diffY) {
        const absX = Math.abs(diffX);
        const absY = Math.abs(diffY);
        if (absX >= 2 * absY) {
            diffY = 0;
        } else if (absY >= 2 * absX) {
            diffX = 0;
        }
    }
    return [Math.sign(diffX), Math.sign(diffY)];
}

export function dirFromTo(a: XY | Loc, b: XY | Loc) {
    return dirBetween(x(a), y(a), x(b), y(b));
}

export function dirIndex(dir: XY | Loc) {
    const x0 = x(dir);
    const y0 = y(dir);
    return DIRS.findIndex((a) => a[0] == x0 && a[1] == y0);
}

export function isOppositeDir(a: Loc, b: Loc) {
    if (Math.sign(a[0]) + Math.sign(b[0]) != 0) return false;
    if (Math.sign(a[1]) + Math.sign(b[1]) != 0) return false;
    return true;
}

export function isSameDir(a: Loc, b: Loc) {
    return (
        Math.sign(a[0]) == Math.sign(b[0]) && Math.sign(a[1]) == Math.sign(b[1])
    );
}

export function dirSpread(dir: Loc) {
    const result = [dir];
    if (dir[0] == 0) {
        result.push([1, dir[1]]);
        result.push([-1, dir[1]]);
    } else if (dir[1] == 0) {
        result.push([dir[0], 1]);
        result.push([dir[0], -1]);
    } else {
        result.push([dir[0], 0]);
        result.push([0, dir[1]]);
    }
    return result;
}

export function stepFromTo(
    a: XY | Loc,
    b: XY | Loc,
    fn: (x: number, y: number) => any
) {
    const x0 = x(a);
    const y0 = y(a);
    const diff = [x(b) - x0, y(b) - y0];
    const steps = Math.abs(diff[0]) + Math.abs(diff[1]);
    const c = [0, 0];
    const last = [99999, 99999];

    for (let step = 0; step <= steps; ++step) {
        c[0] = x0 + Math.floor((diff[0] * step) / steps);
        c[1] = y0 + Math.floor((diff[1] * step) / steps);
        if (c[0] != last[0] || c[1] != last[1]) {
            fn(c[0], c[1]);
        }
        last[0] = c[0];
        last[1] = c[1];
    }
}

// LINES

export function forLine(
    x: number,
    y: number,
    dir: Loc,
    length: number,
    fn: (x: number, y: number) => any
) {
    for (let l = 0; l < length; ++l) {
        fn(x + l * dir[0], y + l * dir[1]);
    }
}

const FP_BASE = 16;
const FP_FACTOR = 1 << 16;

export function forLineBetween(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    stepFn: (x: number, y: number) => boolean | void
): boolean {
    let targetVector = [],
        error = [],
        currentVector = [],
        previousVector = [],
        quadrantTransform = [];
    let largerTargetComponent, i;
    let currentLoc: Loc = [-1, -1],
        previousLoc: Loc = [-1, -1];

    if (fromX == toX && fromY == toY) {
        return true;
    }

    const originLoc: Loc = [fromX, fromY];
    const targetLoc: Loc = [toX, toY];

    // Neither vector is negative. We keep track of negatives with quadrantTransform.
    for (i = 0; i <= 1; i++) {
        targetVector[i] = (targetLoc[i] - originLoc[i]) << FP_BASE; // FIXME: should use parens?
        if (targetVector[i] < 0) {
            targetVector[i] *= -1;
            quadrantTransform[i] = -1;
        } else {
            quadrantTransform[i] = 1;
        }
        currentVector[i] = previousVector[i] = error[i] = 0;
        currentLoc[i] = originLoc[i];
    }

    // normalize target vector such that one dimension equals 1 and the other is in [0, 1].
    largerTargetComponent = Math.max(targetVector[0], targetVector[1]);
    // targetVector[0] = Math.floor( (targetVector[0] << FP_BASE) / largerTargetComponent);
    // targetVector[1] = Math.floor( (targetVector[1] << FP_BASE) / largerTargetComponent);
    targetVector[0] = Math.floor(
        (targetVector[0] * FP_FACTOR) / largerTargetComponent
    );
    targetVector[1] = Math.floor(
        (targetVector[1] * FP_FACTOR) / largerTargetComponent
    );

    do {
        for (i = 0; i <= 1; i++) {
            previousLoc[i] = currentLoc[i];

            currentVector[i] += targetVector[i] >> FP_BASE;
            error[i] += targetVector[i] == FP_FACTOR ? 0 : targetVector[i];

            if (error[i] >= Math.floor(FP_FACTOR / 2)) {
                currentVector[i]++;
                error[i] -= FP_FACTOR;
            }

            currentLoc[i] = Math.floor(
                quadrantTransform[i] * currentVector[i] + originLoc[i]
            );
        }
        const r = stepFn(...currentLoc);
        if (r === false) {
            return false;
        } else if (
            r !== true &&
            currentLoc[0] === toX &&
            currentLoc[1] === toY
        ) {
            return true;
        }
    } while (true);
}

export function forLineFromTo(
    a: XY | Loc,
    b: XY | Loc,
    stepFn: (x: number, y: number) => boolean | void
) {
    return forLineBetween(x(a), y(a), x(b), y(b), stepFn);
}

// ADAPTED FROM BROGUE 1.7.5
// Simple line algorithm (maybe this is Bresenham?) that returns a list of coordinates
// that extends all the way to the edge of the map based on an originLoc (which is not included
// in the list of coordinates) and a targetLoc.
// Returns the number of entries in the list, and includes (-1, -1) as an additional
// terminus indicator after the end of the list.
export function getLine(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
): Loc[] {
    const line: Array<Loc> = [];

    forLineBetween(fromX, fromY, toX, toY, (x: number, y: number) => {
        line.push([x, y]);
    });

    return line;
}

// ADAPTED FROM BROGUE 1.7.5
// Simple line algorithm (maybe this is Bresenham?) that returns a list of coordinates
// that extends all the way to the edge of the map based on an originLoc (which is not included
// in the list of coordinates) and a targetLoc.
export function getLineThru(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    width: number,
    height: number
): Loc[] {
    const line: Array<Loc> = [];

    forLineBetween(fromX, fromY, toX, toY, (x: number, y: number) => {
        if (x < 0 || y < 0 || x >= width || y >= height) return false;
        line.push([x, y]);
        return true;
    });

    return line;
}

// CIRCLE

export function forCircle(x: number, y: number, radius: number, fn: XYFunc) {
    let i, j;

    for (i = x - radius - 1; i < x + radius + 1; i++) {
        for (j = y - radius - 1; j < y + radius + 1; j++) {
            if (
                (i - x) * (i - x) + (j - y) * (j - y) <
                radius * radius + radius
            ) {
                // + radius softens the circle
                fn(i, j);
            }
        }
    }
}

// RECT
export function forRect(width: number, height: number, fn: XYFunc): void;
export function forRect(
    x: number,
    y: number,
    width: number,
    height: number,
    fn: XYFunc
): void;
export function forRect(...args: any[]) {
    let left = 0;
    let top = 0;
    if (arguments.length > 3) {
        left = args.shift();
        top = args.shift();
    }
    const right = left + args[0];
    const bottom = top + args[1];
    const fn = args[2];

    for (let i = left; i < right; ++i) {
        for (let j = top; j < bottom; ++j) {
            fn(i, j);
        }
    }
}

export function forBorder(width: number, height: number, fn: XYFunc): void;
export function forBorder(
    x: number,
    y: number,
    width: number,
    height: number,
    fn: XYFunc
): void;
export function forBorder(...args: any[]) {
    let left = 0;
    let top = 0;
    if (arguments.length > 3) {
        left = args.shift();
        top = args.shift();
    }
    const right = left + args[0] - 1;
    const bottom = top + args[1] - 1;
    const fn = args[2];

    for (let x = left; x <= right; ++x) {
        fn(x, top);
        fn(x, bottom);
    }
    for (let y = top; y <= bottom; ++y) {
        fn(left, y);
        fn(right, y);
    }
}

// ARC COUNT
// Rotates around the cell, counting up the number of distinct strings of neighbors with the same test result in a single revolution.
//		Zero means there are no impassable tiles adjacent.
//		One means it is adjacent to a wall.
//		Two means it is in a hallway or something similar.
//		Three means it is the center of a T-intersection or something similar.
//		Four means it is in the intersection of two hallways.
//		Five or more means there is a bug.
export function arcCount(x: number, y: number, testFn: XYMatchFunc) {
    let oldX, oldY, newX, newY;

    // brogueAssert(grid.hasXY(x, y));

    let arcCount = 0;
    let matchCount = 0;
    for (let dir = 0; dir < CLOCK_DIRS.length; dir++) {
        oldX = x + CLOCK_DIRS[(dir + 7) % 8][0];
        oldY = y + CLOCK_DIRS[(dir + 7) % 8][1];
        newX = x + CLOCK_DIRS[dir][0];
        newY = y + CLOCK_DIRS[dir][1];
        // Counts every transition from passable to impassable or vice-versa on the way around the cell:
        const newOk = testFn(newX, newY);
        const oldOk = testFn(oldX, oldY);
        if (newOk) ++matchCount;
        if (newOk != oldOk) {
            arcCount++;
        }
    }
    if (arcCount == 0 && matchCount) return 1;
    return Math.floor(arcCount / 2); // Since we added one when we entered a wall and another when we left.
}
