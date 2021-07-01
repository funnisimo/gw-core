/**
 * GW.utils
 * @module utils
 */

import { BasicObject, Loc, XY, Chainable } from './types';

export { BasicObject, Loc, XY, Chainable };

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

export function NOOP() {}
export function TRUE() {
    return true;
}
export function FALSE() {
    return false;
}
export function ONE() {
    return 1;
}
export function ZERO() {
    return 0;
}
export function IDENTITY(x: any) {
    return x;
}
export function IS_ZERO(x: number) {
    return x == 0;
}
export function IS_NONZERO(x: number) {
    return x != 0;
}

/**
 * clamps a value between min and max (inclusive)
 * @param v {Number} the value to clamp
 * @param min {Number} the minimum value
 * @param max {Number} the maximum value
 * @returns {Number} the clamped value
 */
export function clamp(v: number, min: number, max: number) {
    if (v < min) return min;
    if (v > max) return max;
    return v;
}

export function x(src: XY | Loc) {
    // @ts-ignore
    return src.x || src[0] || 0;
}

export function y(src: XY | Loc) {
    // @ts-ignore
    return src.y || src[1] || 0;
}

export class Bounds {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    get left() {
        return this.x;
    }
    get right() {
        return this.x + this.width - 1;
    }
    get top() {
        return this.y;
    }
    get bottom() {
        return this.y + this.height - 1;
    }

    contains(x: number, y: number): boolean;
    contains(loc: Loc | XY): boolean;
    contains(...args: any[]) {
        let x = args[0];
        let y = args[1];
        if (typeof x !== 'number') {
            y = y(x);
            x = x(x);
        }
        return (
            this.x <= x &&
            this.y <= y &&
            this.x + this.width > x &&
            this.y + this.height > y
        );
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
    if (a[0] + b[0] != 0) return false;
    if (a[1] + b[1] != 0) return false;
    return true;
}

export function isSameDir(a: Loc, b: Loc) {
    return a[0] == b[0] && a[1] == b[1];
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

// Draws the smooth gradient that appears on a button when you hover over or depress it.
// Returns the percentage by which the current tile should be averaged toward a hilite color.
export function smoothHiliteGradient(currentXValue: number, maxXValue: number) {
    return Math.floor(100 * Math.sin((Math.PI * currentXValue) / maxXValue));
}

// export function extend(obj, name, fn) {
//   const base = obj[name] || NOOP;
//   const newFn = fn.bind(obj, base.bind(obj));
//   newFn.fn = fn;
//   newFn.base = base;
//   obj[name] = newFn;
// }

// export function rebase(obj, name, newBase) {
//   const fns = [];
//   let fn = obj[name];

//   while(fn && fn.fn) {
//     fns.push(fn.fn);
//     fn = fn.base;
//   }

//   obj[name] = newBase;

//   while(fns.length) {
//     fn = fns.pop();
//     extend(obj, name, fn);
//   }
// }

// export function cloneObject(obj:object) {
//   const other = Object.create(obj.__proto__);
//   assignObject(other, obj);
//   return other;
// }

function assignField(dest: any, src: any, key: string) {
    const current = dest[key];
    const updated = src[key];
    if (current && current.copy && updated) {
        current.copy(updated);
    } else if (current && current.clear && !updated) {
        current.clear();
    } else if (current && current.nullify && !updated) {
        current.nullify();
    } else if (updated && updated.clone) {
        dest[key] = updated.clone(); // just use same object (shallow copy)
    } else if (updated && Array.isArray(updated)) {
        dest[key] = updated.slice();
    } else if (current && Array.isArray(current)) {
        current.length = 0;
    } else {
        dest[key] = updated;
    }
}

export function copyObject(dest: any, src: any) {
    Object.keys(dest).forEach((key) => {
        assignField(dest, src, key);
    });
}

export function assignObject(dest: any, src: any) {
    Object.keys(src).forEach((key) => {
        assignField(dest, src, key);
    });
}

export function assignOmitting(omit: string | string[], dest: any, src: any) {
    if (typeof omit === 'string') {
        omit = omit.split(/[,|]/g).map((t) => t.trim());
    }
    Object.keys(src).forEach((key) => {
        if (omit.includes(key)) return;
        assignField(dest, src, key);
    });
}

export function setDefault(obj: any, field: string, val: any) {
    if (obj[field] === undefined) {
        obj[field] = val;
    }
}

export type AssignCallback = (
    dest: any,
    key: string,
    current: any,
    def: any
) => boolean;

export function setDefaults(
    obj: any,
    def: any,
    custom: AssignCallback | null = null
) {
    let dest;
    if (!def) return;
    Object.keys(def).forEach((key) => {
        const origKey = key;
        let defValue = def[key];
        dest = obj;

        // allow for => 'stats.health': 100
        const parts = key.split('.');
        while (parts.length > 1) {
            key = parts.shift()!;
            if (dest[key] === undefined) {
                dest = dest[key] = {};
            } else if (typeof dest[key] !== 'object') {
                ERROR(
                    'Trying to set default member on non-object config item: ' +
                        origKey
                );
            } else {
                dest = dest[key];
            }
        }

        key = parts.shift()!;
        let current = dest[key];

        // console.log('def - ', key, current, defValue, obj, dest);

        if (custom && custom(dest, key, current, defValue)) {
            // do nothing
        } else if (current === undefined) {
            if (defValue === null) {
                dest[key] = null;
            } else if (Array.isArray(defValue)) {
                dest[key] = defValue.slice();
            } else if (typeof defValue === 'object') {
                dest[key] = defValue; // Object.assign({}, defValue); -- this breaks assigning a Color object as a default...
            } else {
                dest[key] = defValue;
            }
        }
    });
}

export function setOptions(obj: any, opts: any) {
    setDefaults(obj, opts, (dest, key, _current, opt) => {
        if (opt === null) {
            dest[key] = null;
        } else if (Array.isArray(opt)) {
            dest[key] = opt.slice();
        } else if (typeof opt === 'object') {
            dest[key] = opt; // Object.assign({}, opt); -- this breaks assigning a Color object as a default...
        } else {
            dest[key] = opt;
        }
        return true;
    });
}

export function kindDefaults(obj: any, def: any) {
    function custom(dest: any, key: string, current: any, defValue: any) {
        if (key.search(/[fF]lags$/) < 0) return false;

        if (!current) {
            current = [];
        } else if (typeof current == 'string') {
            current = current.split(/[,|]/).map((t) => t.trim());
        } else if (!Array.isArray(current)) {
            current = [current];
        }

        if (typeof defValue === 'string') {
            defValue = defValue.split(/[,|]/).map((t) => t.trim());
        } else if (!Array.isArray(defValue)) {
            defValue = [defValue];
        }

        // console.log('flags', key, defValue, current);

        dest[key] = defValue.concat(current);
        return true;
    }

    return setDefaults(obj, def, custom);
}

export function pick(obj: any, ...fields: string[]) {
    const data: any = {};
    fields.forEach((f) => {
        const v = obj[f];
        if (v !== undefined) {
            data[f] = v;
        }
    });
    return data;
}

export function clearObject(obj: any) {
    Object.keys(obj).forEach((key) => (obj[key] = undefined));
}

export function ERROR(message: string) {
    throw new Error(message);
}

export function WARN(...args: string[]) {
    console.warn(...args);
}

export function first(...args: any[]) {
    return args.find((v) => v !== undefined);
}

export function getOpt(obj: BasicObject, member: string, _default: any) {
    const v = obj[member];
    if (v === undefined) return _default;
    return v;
}

export function firstOpt(field: string, ...args: any[]) {
    for (let arg of args) {
        if (typeof arg !== 'object' || Array.isArray(arg)) {
            return arg;
        }
        if (arg[field] !== undefined) {
            return arg[field];
        }
    }
    return undefined;
}

export function arraysIntersect(a: any[], b: any[]) {
    return a.some((av) => b.includes(av));
}

export function sum(arr: number[]) {
    return arr.reduce((a, b) => a + b);
}

// CHAIN

export function chainLength<T extends Chainable>(root: T | null) {
    let count = 0;
    while (root) {
        count += 1;
        root = root.next;
    }
    return count;
}

export function chainIncludes<T extends Chainable>(chain: T | null, entry: T) {
    while (chain && chain !== entry) {
        chain = chain.next;
    }
    return chain === entry;
}

export function eachChain<T extends Chainable>(
    item: T | null,
    fn: (item: T, index: number) => any
) {
    let index = 0;
    while (item) {
        const next = item.next;
        fn(item, index++);
        item = next;
    }
    return index; // really count
}

export function addToChain<T extends Chainable>(
    obj: any,
    name: string,
    entry: T
) {
    entry.next = obj[name] || null;
    obj[name] = entry;
    return true;
}

export function removeFromChain<T extends Chainable>(
    obj: any,
    name: string,
    entry: T
) {
    const root = obj[name];
    if (root === entry) {
        obj[name] = entry.next || null;
        entry.next = null;
        return true;
    } else if (!root) {
        return false;
    } else {
        let prev = root;
        let current = prev.next;
        while (current && current !== entry) {
            prev = current;
            current = prev.next;
        }
        if (current === entry) {
            prev.next = current.next || null;
            entry.next = null;
            return true;
        }
    }
    return false;
}

// LINES

const FP_BASE = 16;
const FP_FACTOR = 1 << 16;

export function forLine(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    stepFn: (x: number, y: number) => boolean
) {
    let targetVector = [],
        error = [],
        currentVector = [],
        previousVector = [],
        quadrantTransform = [];
    let largerTargetComponent, i;
    let currentLoc: Loc = [-1, -1],
        previousLoc: Loc = [-1, -1];

    if (fromX == toX && fromY == toY) {
        return;
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

        if (stepFn(...currentLoc)) {
            break;
        }
    } while (true);
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

    forLine(fromX, fromY, toX, toY, (x: number, y: number) => {
        line.push([x, y]);
        return x == toX && y == toY;
    });

    return line;
}

// ADAPTED FROM BROGUE 1.7.5
// Simple line algorithm (maybe this is Bresenham?) that returns a list of coordinates
// that extends all the way to the edge of the map based on an originLoc (which is not included
// in the list of coordinates) and a targetLoc.
// Returns the number of entries in the list, and includes (-1, -1) as an additional
// terminus indicator after the end of the list.
export function getLineThru(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    width: number,
    height: number
): Loc[] {
    const line: Array<Loc> = [];

    forLine(fromX, fromY, toX, toY, (x: number, y: number) => {
        if (x < 0 || y < 0 || x >= width || y >= height) return true;
        line.push([x, y]);
        return false;
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
