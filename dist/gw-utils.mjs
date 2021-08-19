import * as ROT from 'rot-js';

// CHAIN
function chainLength(root) {
    let count = 0;
    while (root) {
        count += 1;
        root = root.next;
    }
    return count;
}
function chainIncludes(chain, entry) {
    while (chain && chain !== entry) {
        chain = chain.next;
    }
    return chain === entry;
}
function eachChain(item, fn) {
    let index = 0;
    while (item) {
        const next = item.next;
        fn(item, index++);
        item = next;
    }
    return index; // really count
}
function addToChain(obj, name, entry) {
    entry.next = obj[name] || null;
    obj[name] = entry;
    return true;
}
function removeFromChain(obj, name, entry) {
    const root = obj[name];
    if (root === entry) {
        obj[name] = entry.next || null;
        entry.next = null;
        return true;
    }
    else if (!root) {
        return false;
    }
    else {
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
function findInChain(root, cb) {
    while (root && !cb(root)) {
        root = root.next;
    }
    return root;
}
class Chain {
    constructor(sort, onchange) {
        this.data = null;
        this.sort = sort || (() => -1);
        this.onchange = onchange || (() => { });
    }
    copy(other) {
        this.data = other.data;
        this.sort = other.sort;
        this.onchange = other.onchange;
    }
    get length() {
        let count = 0;
        this.forEach(() => ++count);
        return count;
    }
    add(obj) {
        if (!this.data || this.sort(this.data, obj) < 0) {
            obj.next = this.data;
            this.data = obj;
            return true;
        }
        let prev = this.data;
        let current = this.data.next;
        while (current && this.sort(current, obj) < 0) {
            prev = current;
            current = current.next;
        }
        obj.next = current;
        prev.next = obj;
        this.onchange();
        return true;
    }
    has(obj) {
        return this.find((o) => o === obj) !== null;
    }
    remove(obj) {
        if (!removeFromChain(this, 'data', obj)) {
            return false;
        }
        this.onchange();
        return true;
    }
    find(cb) {
        return findInChain(this.data, cb);
    }
    forEach(cb) {
        return eachChain(this.data, cb);
    }
    reduce(cb, out) {
        let current = this.data;
        if (!current)
            return out;
        if (out === undefined) {
            out = current;
            current = current.next;
        }
        while (current) {
            cb(out, current);
            current = current.next;
        }
        return out;
    }
    some(cb) {
        let current = this.data;
        while (current) {
            if (cb(current))
                return true;
            current = current.next;
        }
        return false;
    }
    every(cb) {
        let current = this.data;
        while (current) {
            if (!cb(current))
                return false;
            current = current.next;
        }
        return true;
    }
}

/**
 * GW.utils
 * @module utils
 */
// DIRS are organized clockwise
// - first 4 are arrow directions
//   >> rotate 90 degrees clockwise ==>> newIndex = (oldIndex + 1) % 4
//   >> opposite direction ==>> oppIndex = (index + 2) % 4
// - last 4 are diagonals
//   >> rotate 90 degrees clockwise ==>> newIndex = 4 + (oldIndex + 1) % 4;
//   >> opposite diagonal ==>> newIndex = 4 + (index + 2) % 4;
const DIRS$2 = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
    [1, -1],
    [1, 1],
    [-1, 1],
    [-1, -1],
];
const NO_DIRECTION = -1;
const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;
const RIGHT_UP = 4;
const RIGHT_DOWN = 5;
const LEFT_DOWN = 6;
const LEFT_UP = 7;
// CLOCK DIRS are organized clockwise, starting at UP
// >> opposite = (index + 4) % 8
// >> 90 degrees rotate right = (index + 2) % 8
// >> 90 degrees rotate left = (8 + index - 2) % 8
const CLOCK_DIRS = [
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
];
function NOOP() { }
function TRUE() {
    return true;
}
function FALSE() {
    return false;
}
function ONE() {
    return 1;
}
function ZERO() {
    return 0;
}
function IDENTITY(x) {
    return x;
}
function IS_ZERO(x) {
    return x == 0;
}
function IS_NONZERO(x) {
    return x != 0;
}
/**
 * clamps a value between min and max (inclusive)
 * @param v {Number} the value to clamp
 * @param min {Number} the minimum value
 * @param max {Number} the maximum value
 * @returns {Number} the clamped value
 */
function clamp(v, min, max) {
    if (v < min)
        return min;
    if (v > max)
        return max;
    return v;
}
function x(src) {
    // @ts-ignore
    return src.x || src[0] || 0;
}
function y(src) {
    // @ts-ignore
    return src.y || src[1] || 0;
}
class Bounds {
    constructor(x, y, w, h) {
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
    contains(...args) {
        let x = args[0];
        let y = args[1];
        if (typeof x !== 'number') {
            y = y(x);
            x = x(x);
        }
        return (this.x <= x &&
            this.y <= y &&
            this.x + this.width > x &&
            this.y + this.height > y);
    }
}
function copyXY(dest, src) {
    dest.x = x(src);
    dest.y = y(src);
}
function addXY(dest, src) {
    dest.x += x(src);
    dest.y += y(src);
}
function equalsXY(dest, src) {
    if (!dest && !src)
        return true;
    if (!dest || !src)
        return false;
    return x(dest) == x(src) && y(dest) == y(src);
}
function lerpXY(a, b, pct) {
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
function eachNeighbor(x, y, fn, only4dirs = false) {
    const max = only4dirs ? 4 : 8;
    for (let i = 0; i < max; ++i) {
        const dir = DIRS$2[i];
        const x1 = x + dir[0];
        const y1 = y + dir[1];
        fn(x1, y1);
    }
}
async function eachNeighborAsync(x, y, fn, only4dirs = false) {
    const max = only4dirs ? 4 : 8;
    for (let i = 0; i < max; ++i) {
        const dir = DIRS$2[i];
        const x1 = x + dir[0];
        const y1 = y + dir[1];
        await fn(x1, y1);
    }
}
function matchingNeighbor(x, y, matchFn, only4dirs = false) {
    const maxIndex = only4dirs ? 4 : 8;
    for (let d = 0; d < maxIndex; ++d) {
        const dir = DIRS$2[d];
        const i = x + dir[0];
        const j = y + dir[1];
        if (matchFn(i, j))
            return [i, j];
    }
    return [-1, -1];
}
function distanceBetween(x1, y1, x2, y2) {
    const x = Math.abs(x1 - x2);
    const y = Math.abs(y1 - y2);
    const min = Math.min(x, y);
    return x + y - 0.6 * min;
}
function distanceFromTo(a, b) {
    return distanceBetween(x(a), y(a), x(b), y(b));
}
function calcRadius(x, y) {
    return distanceBetween(0, 0, x, y);
}
function dirBetween(x, y, toX, toY) {
    let diffX = toX - x;
    let diffY = toY - y;
    if (diffX && diffY) {
        const absX = Math.abs(diffX);
        const absY = Math.abs(diffY);
        if (absX >= 2 * absY) {
            diffY = 0;
        }
        else if (absY >= 2 * absX) {
            diffX = 0;
        }
    }
    return [Math.sign(diffX), Math.sign(diffY)];
}
function dirFromTo(a, b) {
    return dirBetween(x(a), y(a), x(b), y(b));
}
function dirIndex(dir) {
    const x0 = x(dir);
    const y0 = y(dir);
    return DIRS$2.findIndex((a) => a[0] == x0 && a[1] == y0);
}
function isOppositeDir(a, b) {
    if (a[0] + b[0] != 0)
        return false;
    if (a[1] + b[1] != 0)
        return false;
    return true;
}
function isSameDir(a, b) {
    return a[0] == b[0] && a[1] == b[1];
}
function dirSpread(dir) {
    const result = [dir];
    if (dir[0] == 0) {
        result.push([1, dir[1]]);
        result.push([-1, dir[1]]);
    }
    else if (dir[1] == 0) {
        result.push([dir[0], 1]);
        result.push([dir[0], -1]);
    }
    else {
        result.push([dir[0], 0]);
        result.push([0, dir[1]]);
    }
    return result;
}
function stepFromTo(a, b, fn) {
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
function smoothHiliteGradient(currentXValue, maxXValue) {
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
function assignField(dest, src, key) {
    const current = dest[key];
    const updated = src[key];
    if (current && current.copy && updated) {
        current.copy(updated);
    }
    else if (current && current.clear && !updated) {
        current.clear();
    }
    else if (current && current.nullify && !updated) {
        current.nullify();
    }
    else if (updated && updated.clone) {
        dest[key] = updated.clone(); // just use same object (shallow copy)
    }
    else if (updated && Array.isArray(updated)) {
        dest[key] = updated.slice();
    }
    else if (current && Array.isArray(current)) {
        current.length = 0;
    }
    else {
        dest[key] = updated;
    }
}
function copyObject(dest, src) {
    Object.keys(dest).forEach((key) => {
        assignField(dest, src, key);
    });
}
function assignObject(dest, src) {
    Object.keys(src).forEach((key) => {
        assignField(dest, src, key);
    });
}
function assignOmitting(omit, dest, src) {
    if (typeof omit === 'string') {
        omit = omit.split(/[,|]/g).map((t) => t.trim());
    }
    Object.keys(src).forEach((key) => {
        if (omit.includes(key))
            return;
        assignField(dest, src, key);
    });
}
function setDefault(obj, field, val) {
    if (obj[field] === undefined) {
        obj[field] = val;
    }
}
function setDefaults(obj, def, custom = null) {
    let dest;
    if (!def)
        return;
    Object.keys(def).forEach((key) => {
        const origKey = key;
        let defValue = def[key];
        dest = obj;
        // allow for => 'stats.health': 100
        const parts = key.split('.');
        while (parts.length > 1) {
            key = parts.shift();
            if (dest[key] === undefined) {
                dest = dest[key] = {};
            }
            else if (typeof dest[key] !== 'object') {
                ERROR('Trying to set default member on non-object config item: ' +
                    origKey);
            }
            else {
                dest = dest[key];
            }
        }
        key = parts.shift();
        let current = dest[key];
        // console.log('def - ', key, current, defValue, obj, dest);
        if (custom && custom(dest, key, current, defValue)) ;
        else if (current === undefined) {
            if (defValue === null) {
                dest[key] = null;
            }
            else if (Array.isArray(defValue)) {
                dest[key] = defValue.slice();
            }
            else if (typeof defValue === 'object') {
                dest[key] = defValue; // Object.assign({}, defValue); -- this breaks assigning a Color object as a default...
            }
            else {
                dest[key] = defValue;
            }
        }
    });
}
function setOptions(obj, opts) {
    setDefaults(obj, opts, (dest, key, _current, opt) => {
        if (opt === null) {
            dest[key] = null;
        }
        else if (Array.isArray(opt)) {
            dest[key] = opt.slice();
        }
        else if (typeof opt === 'object') {
            dest[key] = opt; // Object.assign({}, opt); -- this breaks assigning a Color object as a default...
        }
        else {
            dest[key] = opt;
        }
        return true;
    });
}
function kindDefaults(obj, def) {
    function custom(dest, key, current, defValue) {
        if (key.search(/[fF]lags$/) < 0)
            return false;
        if (!current) {
            current = [];
        }
        else if (typeof current == 'string') {
            current = current.split(/[,|]/).map((t) => t.trim());
        }
        else if (!Array.isArray(current)) {
            current = [current];
        }
        if (typeof defValue === 'string') {
            defValue = defValue.split(/[,|]/).map((t) => t.trim());
        }
        else if (!Array.isArray(defValue)) {
            defValue = [defValue];
        }
        // console.log('flags', key, defValue, current);
        dest[key] = defValue.concat(current);
        return true;
    }
    return setDefaults(obj, def, custom);
}
function pick(obj, ...fields) {
    const data = {};
    fields.forEach((f) => {
        const v = obj[f];
        if (v !== undefined) {
            data[f] = v;
        }
    });
    return data;
}
function clearObject(obj) {
    Object.keys(obj).forEach((key) => (obj[key] = undefined));
}
function ERROR(message) {
    throw new Error(message);
}
function WARN(...args) {
    console.warn(...args);
}
function first(...args) {
    return args.find((v) => v !== undefined);
}
function getOpt(obj, member, _default) {
    const v = obj[member];
    if (v === undefined)
        return _default;
    return v;
}
function firstOpt(field, ...args) {
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
function arraysIntersect(a, b) {
    return a.some((av) => b.includes(av));
}
function sum(arr) {
    return arr.reduce((a, b) => a + b);
}
// LINES
const FP_BASE = 16;
const FP_FACTOR = 1 << 16;
function forLine(fromX, fromY, toX, toY, stepFn) {
    let targetVector = [], error = [], currentVector = [], previousVector = [], quadrantTransform = [];
    let largerTargetComponent, i;
    let currentLoc = [-1, -1], previousLoc = [-1, -1];
    if (fromX == toX && fromY == toY) {
        return;
    }
    const originLoc = [fromX, fromY];
    const targetLoc = [toX, toY];
    // Neither vector is negative. We keep track of negatives with quadrantTransform.
    for (i = 0; i <= 1; i++) {
        targetVector[i] = (targetLoc[i] - originLoc[i]) << FP_BASE; // FIXME: should use parens?
        if (targetVector[i] < 0) {
            targetVector[i] *= -1;
            quadrantTransform[i] = -1;
        }
        else {
            quadrantTransform[i] = 1;
        }
        currentVector[i] = previousVector[i] = error[i] = 0;
        currentLoc[i] = originLoc[i];
    }
    // normalize target vector such that one dimension equals 1 and the other is in [0, 1].
    largerTargetComponent = Math.max(targetVector[0], targetVector[1]);
    // targetVector[0] = Math.floor( (targetVector[0] << FP_BASE) / largerTargetComponent);
    // targetVector[1] = Math.floor( (targetVector[1] << FP_BASE) / largerTargetComponent);
    targetVector[0] = Math.floor((targetVector[0] * FP_FACTOR) / largerTargetComponent);
    targetVector[1] = Math.floor((targetVector[1] * FP_FACTOR) / largerTargetComponent);
    do {
        for (i = 0; i <= 1; i++) {
            previousLoc[i] = currentLoc[i];
            currentVector[i] += targetVector[i] >> FP_BASE;
            error[i] += targetVector[i] == FP_FACTOR ? 0 : targetVector[i];
            if (error[i] >= Math.floor(FP_FACTOR / 2)) {
                currentVector[i]++;
                error[i] -= FP_FACTOR;
            }
            currentLoc[i] = Math.floor(quadrantTransform[i] * currentVector[i] + originLoc[i]);
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
function getLine(fromX, fromY, toX, toY) {
    const line = [];
    forLine(fromX, fromY, toX, toY, (x, y) => {
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
function getLineThru(fromX, fromY, toX, toY, width, height) {
    const line = [];
    forLine(fromX, fromY, toX, toY, (x, y) => {
        if (x < 0 || y < 0 || x >= width || y >= height)
            return true;
        line.push([x, y]);
        return false;
    });
    return line;
}
// CIRCLE
function forCircle(x, y, radius, fn) {
    let i, j;
    for (i = x - radius - 1; i < x + radius + 1; i++) {
        for (j = y - radius - 1; j < y + radius + 1; j++) {
            if ((i - x) * (i - x) + (j - y) * (j - y) <
                radius * radius + radius) {
                // + radius softens the circle
                fn(i, j);
            }
        }
    }
}
function forRect(...args) {
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
function forBorder(...args) {
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
function arcCount(x, y, testFn) {
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
// ALGOS
async function asyncForEach(iterable, fn) {
    for (let t of iterable) {
        await fn(t);
    }
}

var index$c = {
    __proto__: null,
    DIRS: DIRS$2,
    NO_DIRECTION: NO_DIRECTION,
    UP: UP,
    RIGHT: RIGHT,
    DOWN: DOWN,
    LEFT: LEFT,
    RIGHT_UP: RIGHT_UP,
    RIGHT_DOWN: RIGHT_DOWN,
    LEFT_DOWN: LEFT_DOWN,
    LEFT_UP: LEFT_UP,
    CLOCK_DIRS: CLOCK_DIRS,
    NOOP: NOOP,
    TRUE: TRUE,
    FALSE: FALSE,
    ONE: ONE,
    ZERO: ZERO,
    IDENTITY: IDENTITY,
    IS_ZERO: IS_ZERO,
    IS_NONZERO: IS_NONZERO,
    clamp: clamp,
    x: x,
    y: y,
    Bounds: Bounds,
    copyXY: copyXY,
    addXY: addXY,
    equalsXY: equalsXY,
    lerpXY: lerpXY,
    eachNeighbor: eachNeighbor,
    eachNeighborAsync: eachNeighborAsync,
    matchingNeighbor: matchingNeighbor,
    distanceBetween: distanceBetween,
    distanceFromTo: distanceFromTo,
    calcRadius: calcRadius,
    dirBetween: dirBetween,
    dirFromTo: dirFromTo,
    dirIndex: dirIndex,
    isOppositeDir: isOppositeDir,
    isSameDir: isSameDir,
    dirSpread: dirSpread,
    stepFromTo: stepFromTo,
    smoothHiliteGradient: smoothHiliteGradient,
    copyObject: copyObject,
    assignObject: assignObject,
    assignOmitting: assignOmitting,
    setDefault: setDefault,
    setDefaults: setDefaults,
    setOptions: setOptions,
    kindDefaults: kindDefaults,
    pick: pick,
    clearObject: clearObject,
    ERROR: ERROR,
    WARN: WARN,
    first: first,
    getOpt: getOpt,
    firstOpt: firstOpt,
    arraysIntersect: arraysIntersect,
    sum: sum,
    forLine: forLine,
    getLine: getLine,
    getLineThru: getLineThru,
    forCircle: forCircle,
    forRect: forRect,
    forBorder: forBorder,
    arcCount: arcCount,
    asyncForEach: asyncForEach,
    chainLength: chainLength,
    chainIncludes: chainIncludes,
    eachChain: eachChain,
    addToChain: addToChain,
    removeFromChain: removeFromChain,
    findInChain: findInChain,
    Chain: Chain
};

function lotteryDrawArray(rand, frequencies) {
    let i, maxFreq, randIndex;
    maxFreq = 0;
    for (i = 0; i < frequencies.length; i++) {
        maxFreq += frequencies[i];
    }
    if (maxFreq <= 0) {
        // console.warn(
        //     'Lottery Draw - no frequencies',
        //     frequencies,
        //     frequencies.length
        // );
        return -1;
    }
    randIndex = rand.range(0, maxFreq - 1);
    for (i = 0; i < frequencies.length; i++) {
        if (frequencies[i] > randIndex) {
            return i;
        }
        else {
            randIndex -= frequencies[i];
        }
    }
    console.warn('Lottery Draw failed.', frequencies, frequencies.length);
    return 0;
}
function lotteryDrawObject(rand, weights) {
    const entries = Object.entries(weights);
    const frequencies = entries.map(([_, weight]) => weight);
    const index = lotteryDrawArray(rand, frequencies);
    return entries[index][0];
}
class Random {
    // static configure(opts: Partial<RandomConfig>) {
    //     if (opts.make) {
    //         if (typeof opts.make !== 'function')
    //             throw new Error('Random make parameter must be a function.');
    //         if (typeof opts.make(12345) !== 'function')
    //             throw new Error(
    //                 'Random make function must accept a numeric seed and return a random function.'
    //             );
    //         RANDOM_CONFIG.make = opts.make;
    //         random.seed();
    //         cosmetic.seed();
    //     }
    // }
    constructor() {
        this._fn = ROT.RNG.clone();
    }
    seed(val) {
        this._fn.setSeed(val);
    }
    value() {
        return this._fn.getUniform();
    }
    float() {
        return this.value();
    }
    number(max) {
        // @ts-ignore
        if (max <= 0)
            return 0;
        max = max || Number.MAX_SAFE_INTEGER;
        return Math.floor(this.value() * max);
    }
    int(max = 0) {
        return this.number(max);
    }
    range(lo, hi) {
        if (hi <= lo)
            return hi;
        const diff = hi - lo + 1;
        return lo + this.number(diff);
    }
    dice(count, sides, addend = 0) {
        let total = 0;
        let mult = 1;
        if (count < 0) {
            count = -count;
            mult = -1;
        }
        addend = addend || 0;
        for (let i = 0; i < count; ++i) {
            total += this.range(1, sides);
        }
        total *= mult;
        return total + addend;
    }
    weighted(weights) {
        if (Array.isArray(weights)) {
            return lotteryDrawArray(this, weights);
        }
        return lotteryDrawObject(this, weights);
    }
    item(list) {
        if (!Array.isArray(list)) {
            list = Object.values(list);
        }
        return list[this.range(0, list.length - 1)];
    }
    key(obj) {
        return this.item(Object.keys(obj));
    }
    shuffle(list, fromIndex = 0, toIndex = 0) {
        if (arguments.length == 2) {
            toIndex = fromIndex;
            fromIndex = 0;
        }
        let i, r, buf;
        toIndex = toIndex || list.length;
        fromIndex = fromIndex || 0;
        for (i = fromIndex; i < toIndex; i++) {
            r = this.range(fromIndex, toIndex - 1);
            if (i != r) {
                buf = list[r];
                list[r] = list[i];
                list[i] = buf;
            }
        }
        return list;
    }
    sequence(n) {
        const list = [];
        for (let i = 0; i < n; i++) {
            list[i] = i;
        }
        return this.shuffle(list);
    }
    chance(percent, outOf = 100) {
        if (percent <= 0)
            return false;
        if (percent >= outOf)
            return true;
        return this.number(outOf) < percent;
    }
    // Get a random int between lo and hi, inclusive, with probability distribution
    // affected by clumps.
    clumped(lo, hi, clumps) {
        if (hi <= lo) {
            return lo;
        }
        if (clumps <= 1) {
            return this.range(lo, hi);
        }
        let i, total = 0, numSides = Math.floor((hi - lo) / clumps);
        for (i = 0; i < (hi - lo) % clumps; i++) {
            total += this.range(0, numSides + 1);
        }
        for (; i < clumps; i++) {
            total += this.range(0, numSides);
        }
        return total + lo;
    }
    matchingLoc(width, height, matchFn) {
        let locationCount = 0;
        let i, j, index;
        locationCount = 0;
        forRect(width, height, (i, j) => {
            if (matchFn(i, j)) {
                locationCount++;
            }
        });
        if (locationCount == 0) {
            return [-1, -1];
        }
        else {
            index = this.range(0, locationCount - 1);
        }
        for (i = 0; i < width && index >= 0; i++) {
            for (j = 0; j < height && index >= 0; j++) {
                if (matchFn(i, j)) {
                    if (index == 0) {
                        return [i, j];
                    }
                    index--;
                }
            }
        }
        return [-1, -1];
    }
    matchingLocNear(x, y, matchFn) {
        let loc = [-1, -1];
        let i, j, k, candidateLocs, randIndex;
        candidateLocs = 0;
        // count up the number of candidate locations
        for (k = 0; k < 50 && !candidateLocs; k++) {
            for (i = x - k; i <= x + k; i++) {
                for (j = y - k; j <= y + k; j++) {
                    if ((i == x - k ||
                        i == x + k ||
                        j == y - k ||
                        j == y + k) &&
                        matchFn(i, j)) {
                        candidateLocs++;
                    }
                }
            }
        }
        if (candidateLocs == 0) {
            return [-1, -1];
        }
        // and pick one
        randIndex = 1 + this.number(candidateLocs);
        for (k = 0; k < 50; k++) {
            for (i = x - k; i <= x + k; i++) {
                for (j = y - k; j <= y + k; j++) {
                    if ((i == x - k ||
                        i == x + k ||
                        j == y - k ||
                        j == y + k) &&
                        matchFn(i, j)) {
                        if (--randIndex == 0) {
                            loc[0] = i;
                            loc[1] = j;
                            return loc;
                        }
                    }
                }
            }
        }
        return [-1, -1]; // should never reach this point
    }
}
const random = new Random();
const cosmetic = new Random();

class Range {
    constructor(lower, upper = 0, clumps = 1, rng) {
        this._rng = rng || null;
        if (Array.isArray(lower)) {
            clumps = lower[2];
            upper = lower[1];
            lower = lower[0];
        }
        if (upper < lower) {
            [upper, lower] = [lower, upper];
        }
        this.lo = lower || 0;
        this.hi = upper || this.lo;
        this.clumps = clumps || 1;
    }
    value() {
        const rng = this._rng || random;
        return rng.clumped(this.lo, this.hi, this.clumps);
    }
    copy(other) {
        this.lo = other.lo;
        this.hi = other.hi;
        this.clumps = other.clumps;
        this._rng = other._rng;
        return this;
    }
    toString() {
        if (this.lo >= this.hi) {
            return '' + this.lo;
        }
        return `${this.lo}-${this.hi}`;
    }
}
function make$b(config, rng) {
    if (!config)
        return new Range(0, 0, 0, rng);
    if (config instanceof Range)
        return config; // don't need to clone since they are immutable
    // if (config.value) return config;  // calc or damage
    if (typeof config == 'function')
        throw new Error('Custom range functions not supported - extend Range');
    if (config === undefined || config === null)
        return new Range(0, 0, 0, rng);
    if (typeof config == 'number')
        return new Range(config, config, 1, rng);
    // @ts-ignore
    if (config === true || config === false)
        throw new Error('Invalid random config: ' + config);
    if (Array.isArray(config)) {
        return new Range(config[0], config[1], config[2], rng);
    }
    if (typeof config !== 'string') {
        throw new Error('Calculations must be strings.  Received: ' + JSON.stringify(config));
    }
    if (config.length == 0)
        return new Range(0, 0, 0, rng);
    const RE = /^(?:([+-]?\d*)[Dd](\d+)([+-]?\d*)|([+-]?\d+)-(\d+):?(\d+)?|([+-]?\d+)~(\d+)|([+-]?\d+\.?\d*))/g;
    let results;
    while ((results = RE.exec(config)) !== null) {
        if (results[2]) {
            let count = Number.parseInt(results[1]) || 1;
            const sides = Number.parseInt(results[2]);
            const addend = Number.parseInt(results[3]) || 0;
            const lower = addend + count;
            const upper = addend + count * sides;
            return new Range(lower, upper, count, rng);
        }
        else if (results[4] && results[5]) {
            const min = Number.parseInt(results[4]);
            const max = Number.parseInt(results[5]);
            const clumps = Number.parseInt(results[6]);
            return new Range(min, max, clumps, rng);
        }
        else if (results[7] && results[8]) {
            const base = Number.parseInt(results[7]);
            const std = Number.parseInt(results[8]);
            return new Range(base - 2 * std, base + 2 * std, 3, rng);
        }
        else if (results[9]) {
            const v = Number.parseFloat(results[9]);
            return new Range(v, v, 1, rng);
        }
    }
    throw new Error('Not a valid range - ' + config);
}
const from$6 = make$b;
function asFn(config, rng) {
    const range = make$b(config, rng);
    return () => range.value();
}

var range = {
    __proto__: null,
    Range: Range,
    make: make$b,
    from: from$6,
    asFn: asFn
};

///////////////////////////////////
// FLAG
function fl(N) {
    return 1 << N;
}
function toString(flagObj, value) {
    const inverse = Object.entries(flagObj).reduce((out, entry) => {
        const [key, value] = entry;
        if (typeof value === 'number') {
            if (out[value]) {
                out[value] += ' | ' + key;
            }
            else {
                out[value] = key;
            }
        }
        return out;
    }, []);
    const out = [];
    for (let index = 0; index < 32; ++index) {
        const fl = 1 << index;
        if (value & fl) {
            out.push(inverse[fl]);
        }
    }
    return out.join(' | ');
}
function from$5(obj, ...args) {
    let result = 0;
    for (let index = 0; index < args.length; ++index) {
        let value = args[index];
        if (value === undefined)
            continue;
        if (typeof value == 'number') {
            result |= value;
            continue; // next
        }
        else if (typeof value === 'string') {
            value = value
                .split(/[,|]/)
                .map((t) => t.trim())
                .map((u) => {
                const n = Number.parseInt(u);
                if (n >= 0)
                    return n;
                return u;
            });
        }
        if (Array.isArray(value)) {
            value.forEach((v) => {
                if (typeof v == 'string') {
                    v = v.trim();
                    if (v.startsWith('!')) {
                        // @ts-ignore
                        const f = obj[v.substring(1)];
                        result &= ~f;
                    }
                    else {
                        // @ts-ignore
                        const f = obj[v];
                        if (f) {
                            result |= f;
                        }
                    }
                }
                else if (v === 0) {
                    // to allow clearing flags when extending objects
                    result = 0;
                }
                else {
                    result |= v;
                }
            });
        }
    }
    return result;
}

var flag = {
    __proto__: null,
    fl: fl,
    toString: toString,
    from: from$5
};

const DIRS$1 = DIRS$2;
function makeArray(l, fn) {
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
class Grid extends Array {
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
        eachNeighbor(x, y, (i, j) => {
            if (this.hasXY(i, j)) {
                fn(this[i][j], i, j, this);
            }
        }, only4dirs);
    }
    async eachNeighborAsync(x, y, fn, only4dirs = false) {
        const maxIndex = only4dirs ? 4 : 8;
        for (let d = 0; d < maxIndex; ++d) {
            const dir = DIRS$1[d];
            const i = x + dir[0];
            const j = y + dir[1];
            if (this.hasXY(i, j)) {
                await fn(this[i][j], i, j, this);
            }
        }
    }
    forRect(x, y, w, h, fn) {
        forRect(x, y, w, h, (i, j) => {
            if (this.hasXY(i, j)) {
                fn(this[i][j], i, j, this);
            }
        });
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
    /**
     * Returns whether or not an item in the grid matches the provided function.
     * @param fn - The function that matches
     * TODO - Do we need this???
     * TODO - Should this only be in NumGrid?
     * TODO - Should it alloc instead of using constructor?
     * TSIGNORE
     */
    // @ts-ignore
    some(fn) {
        return super.some((col, x) => col.some((data, y) => fn(data, x, y, this)));
    }
    forCircle(x, y, radius, fn) {
        forCircle(x, y, radius, (i, j) => {
            if (this.hasXY(i, j))
                fn(this[i][j], i, j, this);
        });
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
        forRect(this.width, this.height, (i, j) => {
            if (this.hasXY(i, j))
                this[i][j] = fn(this[i][j], i, j, this);
        });
    }
    updateRect(x, y, width, height, fn) {
        forRect(x, y, width, height, (i, j) => {
            if (this.hasXY(i, j))
                this[i][j] = fn(this[i][j], i, j, this);
        });
    }
    updateCircle(x, y, radius, fn) {
        forCircle(x, y, radius, (i, j) => {
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
    dump(fmtFn, log = console.log) {
        this.dumpRect(0, 0, this.width, this.height, fmtFn, log);
    }
    dumpRect(left, top, width, height, fmtFn, log = console.log) {
        let i, j;
        fmtFn = fmtFn || _formatGridValue;
        left = clamp(left, 0, this.width - 2);
        top = clamp(top, 0, this.height - 2);
        const right = clamp(left + width, 1, this.width - 1);
        const bottom = clamp(top + height, 1, this.height - 1);
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
        log(output.join('\n'));
    }
    dumpAround(x, y, radius, fmtFn, log = console.log) {
        this.dumpRect(x - radius, y - radius, 2 * radius, 2 * radius, fmtFn, log);
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
                const dist = Math.floor(100 * distanceBetween(x, y, i, j));
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
    randomMatchingLoc(v) {
        const fn = typeof v === 'function'
            ? (x, y) => v(this[x][y], x, y, this)
            : (x, y) => this.get(x, y) === v;
        return random.matchingLoc(this.width, this.height, fn);
    }
    matchingLocNear(x, y, v) {
        const fn = typeof v === 'function'
            ? (x, y) => v(this[x][y], x, y, this)
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
    arcCount(x, y, testFn) {
        return arcCount(x, y, (i, j) => {
            return this.hasXY(i, j) && testFn(this[i][j], i, j, this);
        });
    }
}
const GRID_CACHE = [];
class NumGrid extends Grid {
    constructor(w, h, v = 0) {
        super(w, h, v);
    }
    static alloc(...args) {
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
        let grid = GRID_CACHE.pop();
        if (!grid) {
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
            newX = x + DIRS$1[dir][0];
            newY = y + DIRS$1[dir][1];
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
    randomLeastPositiveLoc() {
        const targetValue = this.leastPositiveValue();
        return this.randomMatchingLoc(targetValue);
    }
    valueBounds(value, bounds) {
        let foundValueAtThisLine = false;
        let i, j;
        let left = this.width - 1, right = 0, top = this.height - 1, bottom = 0;
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
        bounds = bounds || new Bounds(0, 0, 0, 0);
        bounds.x = left;
        bounds.y = top;
        bounds.width = right - left + 1;
        bounds.height = bottom - top + 1;
        return bounds;
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
            newX = x + DIRS$1[dir][0];
            newY = y + DIRS$1[dir][1];
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
const alloc = NumGrid.alloc.bind(NumGrid);
const free = NumGrid.free.bind(NumGrid);
function make$a(w, h, v) {
    if (v === undefined)
        return new NumGrid(w, h, 0);
    if (typeof v === 'number')
        return new NumGrid(w, h, v);
    return new Grid(w, h, v);
}
function offsetZip(destGrid, srcGrid, srcToDestX, srcToDestY, value) {
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
function intersection(onto, a, b) {
    b = b || onto;
    // @ts-ignore
    onto.update((_, i, j) => (a[i][j] && b[i][j]) || 0);
}
// Grid.intersection = intersection;
function unite(onto, a, b) {
    b = b || onto;
    // @ts-ignore
    onto.update((_, i, j) => b[i][j] || a[i][j]);
}

var grid = {
    __proto__: null,
    makeArray: makeArray,
    Grid: Grid,
    NumGrid: NumGrid,
    alloc: alloc,
    free: free,
    make: make$a,
    offsetZip: offsetZip,
    intersection: intersection,
    unite: unite
};

var commands = {};
function addCommand(id, fn) {
    commands[id] = fn;
}
let KEYMAP = {};
const DEAD_EVENTS = [];
const KEYPRESS = 'keypress';
const MOUSEMOVE = 'mousemove';
const CLICK = 'click';
const TICK = 'tick';
const MOUSEUP = 'mouseup';
const CONTROL_CODES = [
    'ShiftLeft',
    'ShiftRight',
    'ControlLeft',
    'ControlRight',
    'AltLeft',
    'AltRight',
    'MetaLeft',
    'MetaRight',
];
function setKeymap(keymap) {
    KEYMAP = keymap;
}
async function dispatchEvent(ev, km) {
    let result;
    let command;
    km = km || KEYMAP;
    if (typeof km === 'function') {
        command = km;
    }
    else if (ev.dir) {
        command = km.dir;
    }
    else if (ev.type === KEYPRESS) {
        // @ts-ignore
        command = km[ev.key] || km[ev.code] || km.keypress;
    }
    else if (km[ev.type]) {
        command = km[ev.type];
    }
    if (command) {
        if (typeof command === 'function') {
            result = await command.call(km, ev);
        }
        else if (commands[command]) {
            result = await commands[command](ev);
        }
        else {
            WARN('No command found: ' + command);
        }
    }
    if ('next' in km && km.next === false) {
        result = false;
    }
    recycleEvent(ev);
    return result;
}
function recycleEvent(ev) {
    DEAD_EVENTS.push(ev);
}
// TICK
function makeTickEvent(dt) {
    const ev = DEAD_EVENTS.pop() || {};
    ev.shiftKey = false;
    ev.ctrlKey = false;
    ev.altKey = false;
    ev.metaKey = false;
    ev.type = TICK;
    ev.key = null;
    ev.code = null;
    ev.x = -1;
    ev.y = -1;
    ev.dir = null;
    ev.dt = dt;
    return ev;
}
// KEYBOARD
function makeKeyEvent(e) {
    let key = e.key;
    let code = e.code.toLowerCase();
    if (e.shiftKey) {
        key = key.toUpperCase();
        code = code.toUpperCase();
    }
    if (e.ctrlKey) {
        key = '^' + key;
        code = '^' + code;
    }
    if (e.metaKey) {
        key = '#' + key;
        code = '#' + code;
    }
    if (e.altKey) {
        code = '/' + code;
    }
    const ev = DEAD_EVENTS.pop() || {};
    ev.shiftKey = e.shiftKey;
    ev.ctrlKey = e.ctrlKey;
    ev.altKey = e.altKey;
    ev.metaKey = e.metaKey;
    ev.type = KEYPRESS;
    ev.key = key;
    ev.code = code;
    ev.x = -1;
    ev.y = -1;
    ev.clientX = -1;
    ev.clientY = -1;
    ev.dir = keyCodeDirection(e.code);
    ev.dt = 0;
    return ev;
}
function keyCodeDirection(key) {
    const lowerKey = key.toLowerCase();
    if (lowerKey === 'arrowup') {
        return [0, -1];
    }
    else if (lowerKey === 'arrowdown') {
        return [0, 1];
    }
    else if (lowerKey === 'arrowleft') {
        return [-1, 0];
    }
    else if (lowerKey === 'arrowright') {
        return [1, 0];
    }
    return null;
}
function ignoreKeyEvent(e) {
    return CONTROL_CODES.includes(e.code);
}
function onkeydown(e) {
    if (ignoreKeyEvent(e))
        return;
    if (e.code === 'Escape') {
        loop.clearEvents(); // clear all current events, then push on the escape
    }
    const ev = makeKeyEvent(e);
    loop.pushEvent(ev);
    e.preventDefault();
}
// MOUSE
function makeMouseEvent(e, x, y) {
    const ev = DEAD_EVENTS.pop() || {};
    ev.shiftKey = e.shiftKey;
    ev.ctrlKey = e.ctrlKey;
    ev.altKey = e.altKey;
    ev.metaKey = e.metaKey;
    ev.type = e.type;
    if (e.buttons && e.type !== 'mouseup') {
        ev.type = CLICK;
    }
    ev.key = null;
    ev.code = null;
    ev.x = x;
    ev.y = y;
    ev.clientX = e.clientX;
    ev.clientY = e.clientY;
    ev.dir = null;
    ev.dt = 0;
    return ev;
}
class Loop {
    constructor() {
        this.running = false;
        this.events = [];
        this.mouse = { x: -1, y: -1 };
        this.CURRENT_HANDLER = null;
        this.PAUSED = null;
        this.LAST_CLICK = { x: -1, y: -1 };
    }
    hasEvents() {
        return this.events.length;
    }
    clearEvents() {
        while (this.events.length) {
            const ev = this.events.shift();
            DEAD_EVENTS.push(ev);
        }
    }
    pushEvent(ev) {
        if (this.PAUSED) {
            console.log('PAUSED EVENT', ev.type);
        }
        if (this.events.length) {
            const last = this.events[this.events.length - 1];
            if (last.type === ev.type) {
                if (last.type === MOUSEMOVE) {
                    last.x = ev.x;
                    last.y = ev.y;
                    recycleEvent(ev);
                    return;
                }
            }
        }
        // Keep clicks down to one per cell if holding down mouse button
        if (ev.type === CLICK) {
            if (this.LAST_CLICK.x == ev.x && this.LAST_CLICK.y == ev.y) {
                recycleEvent(ev);
                return;
            }
            this.LAST_CLICK.x = ev.x;
            this.LAST_CLICK.y = ev.y;
        }
        else if (ev.type == MOUSEUP) {
            this.LAST_CLICK.x = -1;
            this.LAST_CLICK.y = -1;
            recycleEvent(ev);
            return;
        }
        if (this.CURRENT_HANDLER) {
            this.CURRENT_HANDLER(ev);
        }
        else if (ev.type === TICK) {
            const first = this.events[0];
            if (first && first.type === TICK) {
                first.dt += ev.dt;
                recycleEvent(ev);
                return;
            }
            this.events.unshift(ev); // ticks go first
        }
        else {
            this.events.push(ev);
        }
    }
    nextEvent(ms, match) {
        match = match || TRUE;
        let elapsed = 0;
        while (this.events.length) {
            const e = this.events.shift();
            if (e.type === MOUSEMOVE) {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            }
            if (match(e)) {
                return Promise.resolve(e);
            }
            recycleEvent(e);
        }
        let done;
        if (ms === undefined) {
            ms = -1; // wait forever
        }
        if (ms == 0)
            return Promise.resolve(null);
        if (this.CURRENT_HANDLER) {
            console.warn('OVERWRITE HANDLER - nextEvent');
        }
        else if (this.events.length) {
            console.warn('SET HANDLER WITH QUEUED EVENTS - nextEvent');
        }
        this.CURRENT_HANDLER = (e) => {
            if (e.type === MOUSEMOVE) {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            }
            if (e.type === TICK && ms > 0) {
                elapsed += e.dt;
                if (elapsed < ms) {
                    return;
                }
            }
            else if (!match(e))
                return;
            this.CURRENT_HANDLER = null;
            e.dt = elapsed;
            done(e);
        };
        return new Promise((resolve) => (done = resolve));
    }
    async run(keymap, ms = -1) {
        const interval = setInterval(() => {
            const e = makeTickEvent(16);
            this.pushEvent(e);
        }, 16);
        this.running = true;
        while (this.running) {
            const ev = await this.nextEvent(ms);
            if (ev && (await dispatchEvent(ev, keymap))) {
                this.running = false;
            }
            if (keymap.draw && typeof keymap.draw === 'function') {
                // @ts-ignore
                keymap.draw();
            }
        }
        clearInterval(interval);
    }
    stop() {
        this.running = false;
    }
    pauseEvents() {
        if (this.PAUSED)
            return;
        this.PAUSED = this.CURRENT_HANDLER;
        this.CURRENT_HANDLER = null;
        // io.debug('events paused');
    }
    resumeEvents() {
        if (!this.PAUSED)
            return;
        if (this.CURRENT_HANDLER) {
            console.warn('overwrite CURRENT HANDLER!');
        }
        this.CURRENT_HANDLER = this.PAUSED;
        this.PAUSED = null;
        // io.debug('resuming events');
        if (this.events.length && this.CURRENT_HANDLER) {
            const e = this.events.shift();
            // io.debug('- processing paused event', e.type);
            this.CURRENT_HANDLER(e);
            // io.recycleEvent(e);	// DO NOT DO THIS B/C THE HANDLER MAY PUT IT BACK ON THE QUEUE (see tickMs)
        }
        // io.debug('events resumed');
    }
    // IO
    async tickMs(ms = 1) {
        let done;
        setTimeout(() => done(), ms);
        return new Promise((resolve) => (done = resolve));
    }
    async nextKeyPress(ms, match) {
        if (ms === undefined)
            ms = -1;
        match = match || TRUE;
        function matchingKey(e) {
            if (e.type !== KEYPRESS)
                return false;
            return match(e);
        }
        return this.nextEvent(ms, matchingKey);
    }
    async nextKeyOrClick(ms, matchFn) {
        if (ms === undefined)
            ms = -1;
        matchFn = matchFn || TRUE;
        function match(e) {
            if (e.type !== KEYPRESS && e.type !== CLICK)
                return false;
            return matchFn(e);
        }
        return this.nextEvent(ms, match);
    }
    async pause(ms) {
        const e = await this.nextKeyOrClick(ms);
        return e && e.type !== TICK;
    }
    waitForAck() {
        return this.pause(5 * 60 * 1000); // 5 min
    }
}
function make$9() {
    return new Loop();
}
// Makes a default global loop that you access through these funcitons...
const loop = make$9();

var io = {
    __proto__: null,
    commands: commands,
    addCommand: addCommand,
    KEYPRESS: KEYPRESS,
    MOUSEMOVE: MOUSEMOVE,
    CLICK: CLICK,
    TICK: TICK,
    MOUSEUP: MOUSEUP,
    setKeymap: setKeymap,
    dispatchEvent: dispatchEvent,
    makeTickEvent: makeTickEvent,
    makeKeyEvent: makeKeyEvent,
    keyCodeDirection: keyCodeDirection,
    ignoreKeyEvent: ignoreKeyEvent,
    onkeydown: onkeydown,
    makeMouseEvent: makeMouseEvent,
    Loop: Loop,
    make: make$9,
    loop: loop
};

var FovFlags;
(function (FovFlags) {
    FovFlags[FovFlags["VISIBLE"] = fl(0)] = "VISIBLE";
    FovFlags[FovFlags["WAS_VISIBLE"] = fl(1)] = "WAS_VISIBLE";
    FovFlags[FovFlags["CLAIRVOYANT_VISIBLE"] = fl(2)] = "CLAIRVOYANT_VISIBLE";
    FovFlags[FovFlags["WAS_CLAIRVOYANT_VISIBLE"] = fl(3)] = "WAS_CLAIRVOYANT_VISIBLE";
    FovFlags[FovFlags["TELEPATHIC_VISIBLE"] = fl(4)] = "TELEPATHIC_VISIBLE";
    FovFlags[FovFlags["WAS_TELEPATHIC_VISIBLE"] = fl(5)] = "WAS_TELEPATHIC_VISIBLE";
    FovFlags[FovFlags["ITEM_DETECTED"] = fl(6)] = "ITEM_DETECTED";
    FovFlags[FovFlags["WAS_ITEM_DETECTED"] = fl(7)] = "WAS_ITEM_DETECTED";
    FovFlags[FovFlags["MONSTER_DETECTED"] = fl(8)] = "MONSTER_DETECTED";
    FovFlags[FovFlags["WAS_MONSTER_DETECTED"] = fl(9)] = "WAS_MONSTER_DETECTED";
    FovFlags[FovFlags["REVEALED"] = fl(10)] = "REVEALED";
    FovFlags[FovFlags["MAGIC_MAPPED"] = fl(11)] = "MAGIC_MAPPED";
    FovFlags[FovFlags["IN_FOV"] = fl(12)] = "IN_FOV";
    FovFlags[FovFlags["WAS_IN_FOV"] = fl(13)] = "WAS_IN_FOV";
    FovFlags[FovFlags["ALWAYS_VISIBLE"] = fl(14)] = "ALWAYS_VISIBLE";
    FovFlags[FovFlags["ANY_KIND_OF_VISIBLE"] = FovFlags.VISIBLE | FovFlags.CLAIRVOYANT_VISIBLE | FovFlags.TELEPATHIC_VISIBLE] = "ANY_KIND_OF_VISIBLE";
    FovFlags[FovFlags["IS_WAS_ANY_KIND_OF_VISIBLE"] = FovFlags.VISIBLE |
        FovFlags.WAS_VISIBLE |
        FovFlags.CLAIRVOYANT_VISIBLE |
        FovFlags.WAS_CLAIRVOYANT_VISIBLE |
        FovFlags.TELEPATHIC_VISIBLE |
        FovFlags.WAS_TELEPATHIC_VISIBLE] = "IS_WAS_ANY_KIND_OF_VISIBLE";
    FovFlags[FovFlags["WAS_ANY_KIND_OF_VISIBLE"] = FovFlags.WAS_VISIBLE |
        FovFlags.WAS_CLAIRVOYANT_VISIBLE |
        FovFlags.WAS_TELEPATHIC_VISIBLE] = "WAS_ANY_KIND_OF_VISIBLE";
    FovFlags[FovFlags["PLAYER"] = FovFlags.IN_FOV] = "PLAYER";
    FovFlags[FovFlags["CLAIRVOYANT"] = FovFlags.CLAIRVOYANT_VISIBLE] = "CLAIRVOYANT";
    FovFlags[FovFlags["TELEPATHIC"] = FovFlags.TELEPATHIC_VISIBLE] = "TELEPATHIC";
    FovFlags[FovFlags["VIEWPORT_TYPES"] = FovFlags.PLAYER |
        FovFlags.CLAIRVOYANT |
        FovFlags.TELEPATHIC |
        FovFlags.ITEM_DETECTED |
        FovFlags.MONSTER_DETECTED] = "VIEWPORT_TYPES";
})(FovFlags || (FovFlags = {}));

// CREDIT - This is adapted from: http://roguebasin.roguelikedevelopment.org/index.php?title=Improved_Shadowcasting_in_Java
class FOV {
    constructor(strategy) {
        this._setVisible = null;
        this._startX = -1;
        this._startY = -1;
        this._maxRadius = 100;
        this._isBlocked = strategy.isBlocked;
        this._calcRadius = strategy.calcRadius || calcRadius;
        this._hasXY = strategy.hasXY || TRUE;
        this._debug = strategy.debug || NOOP;
    }
    calculate(x, y, maxRadius = 10, setVisible) {
        this._setVisible = setVisible;
        this._setVisible(x, y, 1);
        this._startX = x;
        this._startY = y;
        this._maxRadius = maxRadius + 1;
        // uses the diagonals
        for (let i = 4; i < 8; ++i) {
            const d = DIRS$2[i];
            this.castLight(1, 1.0, 0.0, 0, d[0], d[1], 0);
            this.castLight(1, 1.0, 0.0, d[0], 0, 0, d[1]);
        }
    }
    // NOTE: slope starts a 1 and ends at 0.
    castLight(row, startSlope, endSlope, xx, xy, yx, yy) {
        if (row >= this._maxRadius) {
            this._debug('CAST: row=%d, start=%d, end=%d, row >= maxRadius => cancel', row, startSlope.toFixed(2), endSlope.toFixed(2));
            return;
        }
        if (startSlope < endSlope) {
            this._debug('CAST: row=%d, start=%d, end=%d, start < end => cancel', row, startSlope.toFixed(2), endSlope.toFixed(2));
            return;
        }
        this._debug('CAST: row=%d, start=%d, end=%d, x=%d,%d, y=%d,%d', row, startSlope.toFixed(2), endSlope.toFixed(2), xx, xy, yx, yy);
        let nextStart = startSlope;
        let blocked = false;
        let deltaY = -row;
        let currentX, currentY, outerSlope, innerSlope, maxSlope, minSlope = 0;
        for (let deltaX = -row; deltaX <= 0; deltaX++) {
            currentX = Math.floor(this._startX + deltaX * xx + deltaY * xy);
            currentY = Math.floor(this._startY + deltaX * yx + deltaY * yy);
            outerSlope = (deltaX - 0.5) / (deltaY + 0.5);
            innerSlope = (deltaX + 0.5) / (deltaY - 0.5);
            maxSlope = deltaX / (deltaY + 0.5);
            minSlope = (deltaX + 0.5) / deltaY;
            if (!this._hasXY(currentX, currentY)) {
                blocked = true;
                // nextStart = innerSlope;
                continue;
            }
            this._debug('- test %d,%d ... start=%d, min=%d, max=%d, end=%d, dx=%d, dy=%d', currentX, currentY, startSlope.toFixed(2), maxSlope.toFixed(2), minSlope.toFixed(2), endSlope.toFixed(2), deltaX, deltaY);
            if (startSlope < minSlope) {
                blocked = this._isBlocked(currentX, currentY);
                continue;
            }
            else if (endSlope > maxSlope) {
                break;
            }
            //check if it's within the lightable area and light if needed
            const radius = this._calcRadius(deltaX, deltaY);
            if (radius < this._maxRadius) {
                const bright = 1 - radius / this._maxRadius;
                this._setVisible(currentX, currentY, bright);
                this._debug('       - visible');
            }
            if (blocked) {
                //previous cell was a blocking one
                if (this._isBlocked(currentX, currentY)) {
                    //hit a wall
                    this._debug('       - blocked ... nextStart: %d', innerSlope.toFixed(2));
                    nextStart = innerSlope;
                    continue;
                }
                else {
                    blocked = false;
                }
            }
            else {
                if (this._isBlocked(currentX, currentY) &&
                    row < this._maxRadius) {
                    //hit a wall within sight line
                    this._debug('       - blocked ... start:%d, end:%d, nextStart: %d', nextStart.toFixed(2), outerSlope.toFixed(2), innerSlope.toFixed(2));
                    blocked = true;
                    this.castLight(row + 1, nextStart, outerSlope, xx, xy, yx, yy);
                    nextStart = innerSlope;
                }
            }
        }
        if (!blocked) {
            this.castLight(row + 1, nextStart, endSlope, xx, xy, yx, yy);
        }
    }
}

// import * as GW from 'gw-utils';
class FovSystem {
    constructor(site, opts = {}) {
        this.site = site;
        this.flags = make$a(site.width, site.height, FovFlags.VISIBLE);
        this._changed = true;
        this.viewportChanged = false;
        this.fov = new FOV({
            isBlocked(x, y) {
                return site.blocksVision(x, y);
            },
            hasXY(x, y) {
                return x >= 0 && y >= 0 && x < site.width && y < site.height;
            },
        });
        // we want fov, so do not reveal the map initially
        if (opts.fov === true) {
            this.flags.fill(0);
        }
        if (opts.visible) {
            this.makeAlwaysVisible();
        }
        else if (opts.visible === false) {
            this.flags.fill(0);
        }
        else if (opts.revealed) {
            this.revealAll();
        }
    }
    get changed() {
        return this._changed;
    }
    isVisible(x, y) {
        return !!((this.flags.get(x, y) || 0) & FovFlags.VISIBLE);
    }
    isAnyKindOfVisible(x, y) {
        return !!((this.flags.get(x, y) || 0) & FovFlags.ANY_KIND_OF_VISIBLE);
    }
    isInFov(x, y) {
        return !!((this.flags.get(x, y) || 0) & FovFlags.IN_FOV);
    }
    isDirectlyVisible(x, y) {
        const flags = FovFlags.VISIBLE | FovFlags.IN_FOV;
        return ((this.flags.get(x, y) || 0) & flags) === flags;
    }
    isMagicMapped(x, y) {
        return !!((this.flags.get(x, y) || 0) & FovFlags.MAGIC_MAPPED);
    }
    isRevealed(x, y) {
        return !!((this.flags.get(x, y) || 0) & FovFlags.REVEALED);
    }
    makeAlwaysVisible() {
        this.flags.update((v) => v |
            (FovFlags.ALWAYS_VISIBLE | FovFlags.REVEALED | FovFlags.VISIBLE));
    }
    makeCellAlwaysVisible(x, y) {
        this.flags[x][y] |= FovFlags.ALWAYS_VISIBLE | FovFlags.REVEALED;
    }
    revealAll() {
        this.flags.update((v) => v | FovFlags.REVEALED | FovFlags.VISIBLE);
    }
    revealCell(x, y) {
        const flag = FovFlags.REVEALED;
        this.flags[x][y] |= flag;
    }
    hideCell(x, y) {
        this.flags[x][y] &= ~(FovFlags.MAGIC_MAPPED | FovFlags.REVEALED);
    }
    magicMapCell(x, y) {
        this.flags[x][y] |= FovFlags.MAGIC_MAPPED;
    }
    demoteCellVisibility(flag) {
        flag &= ~(FovFlags.WAS_ANY_KIND_OF_VISIBLE | FovFlags.WAS_IN_FOV);
        if (flag & FovFlags.IN_FOV) {
            flag &= ~FovFlags.IN_FOV;
            flag |= FovFlags.WAS_IN_FOV;
        }
        if (flag & FovFlags.VISIBLE) {
            flag &= ~FovFlags.VISIBLE;
            flag |= FovFlags.WAS_VISIBLE;
        }
        if (flag & FovFlags.CLAIRVOYANT_VISIBLE) {
            flag &= ~FovFlags.CLAIRVOYANT_VISIBLE;
            flag |= FovFlags.WAS_CLAIRVOYANT_VISIBLE;
        }
        if (flag & FovFlags.TELEPATHIC_VISIBLE) {
            flag &= ~FovFlags.TELEPATHIC_VISIBLE;
            flag |= FovFlags.WAS_TELEPATHIC_VISIBLE;
        }
        if (flag & FovFlags.ALWAYS_VISIBLE) {
            flag |= FovFlags.VISIBLE;
        }
        return flag;
    }
    updateCellVisibility(flag, x, y) {
        const isVisible = !!(flag & FovFlags.VISIBLE);
        const wasVisible = !!(flag & FovFlags.WAS_ANY_KIND_OF_VISIBLE);
        if (isVisible && wasVisible) ;
        else if (isVisible && !wasVisible) {
            // if the cell became visible this move
            if (!(flag & FovFlags.REVEALED) /* && DATA.automationActive */) {
                this.site.onCellRevealed(x, y);
                // if (cell.item) {
                //     const theItem: GW.types.ItemType = cell.item;
                //     if (
                //         theItem.hasLayerFlag(ObjectFlags.L_INTERRUPT_WHEN_SEEN)
                //     ) {
                //         GW.message.add(
                //             '§you§ §see§ ΩitemMessageColorΩ§item§∆.',
                //             {
                //                 item: theItem,
                //                 actor: DATA.player,
                //             }
                //         );
                //     }
                // }
                // if (
                //     !(flag & FovFlags.MAGIC_MAPPED) &&
                //     this.site.hasObjectFlag(
                //         x,
                //         y,
                //         ObjectFlags.L_INTERRUPT_WHEN_SEEN
                //     )
                // ) {
                //     const tile = cell.tileWithLayerFlag(
                //         ObjectFlags.L_INTERRUPT_WHEN_SEEN
                //     );
                //     if (tile) {
                //         GW.message.add(
                //             '§you§ §see§ ΩbackgroundMessageColorΩ§item§∆.',
                //             {
                //                 actor: DATA.player,
                //                 item: tile.name,
                //             }
                //         );
                //     }
                // }
                this.flags[x][y] |= FovFlags.REVEALED;
            }
            // this.site.redrawCell(x, y);
        }
        else ;
        return isVisible;
    }
    updateCellClairyvoyance(flag, x, y) {
        const isClairy = !!(flag & FovFlags.CLAIRVOYANT_VISIBLE);
        const wasClairy = !!(flag & FovFlags.WAS_CLAIRVOYANT_VISIBLE);
        if (isClairy && wasClairy) ;
        else if (!isClairy && wasClairy) {
            // ceased being clairvoyantly visible
            this.site.storeMemory(x, y);
            this.site.redrawCell(x, y);
        }
        else if (!wasClairy && isClairy) {
            // became clairvoyantly visible
            this.site.redrawCell(x, y, true);
        }
        return isClairy;
    }
    updateCellTelepathy(flag, x, y) {
        const isTele = !!(flag & FovFlags.TELEPATHIC_VISIBLE);
        const wasTele = !!(flag & FovFlags.WAS_TELEPATHIC_VISIBLE);
        if (isTele && wasTele) ;
        else if (!isTele && wasTele) {
            // ceased being telepathically visible
            this.site.storeMemory(x, y);
            this.site.redrawCell(x, y);
        }
        else if (!wasTele && isTele) {
            // became telepathically visible
            // if (
            //     !(flag & FovFlags.REVEALED) &&
            //     !cell.hasTileFlag(Flags.Tile.T_PATHING_BLOCKER)
            // ) {
            //     DATA.xpxpThisTurn++;
            // }
            this.site.redrawCell(x, y, true);
        }
        return isTele;
    }
    updateCellDetect(flag, x, y) {
        const isMonst = !!(flag & FovFlags.MONSTER_DETECTED);
        const wasMonst = !!(flag & FovFlags.WAS_MONSTER_DETECTED);
        if (isMonst && wasMonst) ;
        else if (!isMonst && wasMonst) {
            // ceased being detected visible
            this.site.redrawCell(x, y, true);
            // cell.storeMemory();
        }
        else if (!wasMonst && isMonst) {
            // became detected visible
            this.site.redrawCell(x, y, true);
            // cell.storeMemory();
        }
        return isMonst;
    }
    promoteCellVisibility(flag, x, y) {
        if (flag & FovFlags.IN_FOV &&
            this.site.hasVisibleLight(x, y) // &&
        // !(cell.flags.cellMech & FovFlagsMech.DARKENED)
        ) {
            flag = this.flags[x][y] |= FovFlags.VISIBLE;
        }
        if (this.updateCellVisibility(flag, x, y))
            return;
        if (this.updateCellClairyvoyance(flag, x, y))
            return;
        if (this.updateCellTelepathy(flag, x, y))
            return;
        if (this.updateCellDetect(flag, x, y))
            return;
    }
    update(cx, cy, cr) {
        // if (!this.site.usesFov()) return false;
        if (!this.viewportChanged &&
            cx === undefined &&
            !this.site.lightingChanged()) {
            return false;
        }
        this.flags.update(this.demoteCellVisibility.bind(this));
        this.site.eachViewport((x, y, radius, type) => {
            const flag = type & FovFlags.VIEWPORT_TYPES;
            if (!flag)
                throw new Error('Received invalid viewport type: ' + type);
            if (radius == 0) {
                this.flags[x][y] |= flag;
                return;
            }
            this.fov.calculate(x, y, radius, (x, y, v) => {
                if (v) {
                    this.flags[x][y] |= flag;
                }
            });
        });
        if (cx !== undefined && cy !== undefined) {
            this.fov.calculate(cx, cy, cr, (x, y, v) => {
                if (v) {
                    this.flags[x][y] |= FovFlags.PLAYER;
                }
            });
        }
        // if (PLAYER.bonus.clairvoyance < 0) {
        //   discoverCell(PLAYER.xLoc, PLAYER.yLoc);
        // }
        //
        // if (PLAYER.bonus.clairvoyance != 0) {
        // 	updateClairvoyance();
        // }
        //
        // updateTelepathy();
        // updateMonsterDetection();
        // updateLighting();
        this.flags.forEach(this.promoteCellVisibility.bind(this));
        // if (PLAYER.status.hallucinating > 0) {
        // 	for (theItem of DUNGEON.items) {
        // 		if ((pmap[theItem.xLoc][theItem.yLoc].flags & DISCOVERED) && refreshDisplay) {
        // 			refreshDungeonCell(theItem.xLoc, theItem.yLoc);
        // 		}
        // 	}
        // 	for (monst of DUNGEON.monsters) {
        // 		if ((pmap[monst.xLoc][monst.yLoc].flags & DISCOVERED) && refreshDisplay) {
        // 			refreshDungeonCell(monst.xLoc, monst.yLoc);
        // 		}
        // 	}
        // }
        return true;
    }
}

var index$b = {
    __proto__: null,
    get FovFlags () { return FovFlags; },
    FOV: FOV,
    FovSystem: FovSystem
};

// var PATH = {};
// export { PATH as path };
const FORBIDDEN = -1;
const OBSTRUCTION = -2;
const AVOIDED = 10;
const NO_PATH = 30000;
function makeCostLink(i) {
    return {
        distance: 0,
        cost: 0,
        index: i,
        left: null,
        right: null,
    };
}
function makeDijkstraMap(w, h) {
    return {
        eightWays: false,
        front: makeCostLink(-1),
        links: makeArray(w * h, (i) => makeCostLink(i)),
        width: w,
        height: h,
    };
}
function getLink(map, x, y) {
    return map.links[x + map.width * y];
}
const DIRS = DIRS$2;
function update(map) {
    let dir, dirs;
    let linkIndex;
    let left = null, right = null, link = null;
    dirs = map.eightWays ? 8 : 4;
    let head = map.front.right;
    map.front.right = null;
    while (head != null) {
        for (dir = 0; dir < dirs; dir++) {
            linkIndex = head.index + (DIRS[dir][0] + map.width * DIRS[dir][1]);
            if (linkIndex < 0 || linkIndex >= map.width * map.height)
                continue;
            link = map.links[linkIndex];
            // verify passability
            if (link.cost < 0)
                continue;
            let diagCost = 0;
            if (dir >= 4) {
                diagCost = 0.4142;
                let way1, way1index, way2, way2index;
                way1index = head.index + DIRS[dir][0];
                if (way1index < 0 || way1index >= map.width * map.height)
                    continue;
                way2index = head.index + map.width * DIRS[dir][1];
                if (way2index < 0 || way2index >= map.width * map.height)
                    continue;
                way1 = map.links[way1index];
                way2 = map.links[way2index];
                if (way1.cost == OBSTRUCTION || way2.cost == OBSTRUCTION)
                    continue;
            }
            if (head.distance + link.cost + diagCost < link.distance) {
                link.distance = head.distance + link.cost + diagCost;
                // reinsert the touched cell; it'll be close to the beginning of the list now, so
                // this will be very fast.  start by removing it.
                if (link.right != null)
                    link.right.left = link.left;
                if (link.left != null)
                    link.left.right = link.right;
                left = head;
                right = head.right;
                while (right != null && right.distance < link.distance) {
                    left = right;
                    right = right.right;
                }
                if (left != null)
                    left.right = link;
                link.right = right;
                link.left = left;
                if (right != null)
                    right.left = link;
            }
        }
        right = head.right;
        head.left = null;
        head.right = null;
        head = right;
    }
}
function clear(map, maxDistance, eightWays) {
    let i;
    map.eightWays = eightWays;
    map.front.right = null;
    for (i = 0; i < map.width * map.height; i++) {
        map.links[i].distance = maxDistance;
        map.links[i].left = map.links[i].right = null;
    }
}
// function pdsGetDistance(map, x, y) {
// 	update(map);
// 	return getLink(map, x, y).distance;
// }
function setDistance(map, x, y, distance) {
    let left, right, link;
    if (x > 0 && y > 0 && x < map.width - 1 && y < map.height - 1) {
        link = getLink(map, x, y);
        if (link.distance > distance) {
            link.distance = distance;
            if (link.right != null)
                link.right.left = link.left;
            if (link.left != null)
                link.left.right = link.right;
            left = map.front;
            right = map.front.right;
            while (right != null && right.distance < link.distance) {
                left = right;
                right = right.right;
            }
            link.right = right;
            link.left = left;
            left.right = link;
            if (right != null)
                right.left = link;
        }
    }
}
// function pdsSetCosts(map: DijkstraMap, costMap: Grid.NumGrid) {
// 	let i, j;
// 	for (i=0; i<map.width; i++) {
// 		for (j=0; j<map.height; j++) {
// 			if (i != 0 && j != 0 && i < map.width - 1 && j < map.height - 1) {
// 				getLink(map, i, j).cost = costMap[i][j];
// 			} else {
// 				getLink(map, i, j).cost = FORBIDDEN;
// 			}
// 		}
// 	}
// }
function isBoundaryXY(data, x, y) {
    if (x <= 0 || y <= 0)
        return true;
    if (x >= data.length - 1 || y >= data[0].length - 1)
        return true;
    return false;
}
// function pdsBatchInput(
//   map: DijkstraMap,
//   distanceMap: Grid.NumGrid,
//   costMap: Grid.NumGrid,
//   maxDistance: number,
//   eightWays: boolean
// ) {
//   let i, j;
//   map.eightWays = eightWays;
//   let left: CostLink | null = map.front;
//   let right: CostLink | null = map.front.right;
//   map.front.right = null;
//   for (i = 0; i < map.width; i++) {
//     for (j = 0; j < map.height; j++) {
//       let link = getLink(map, i, j);
//       if (distanceMap != null) {
//         link.distance = distanceMap[i][j];
//       } else {
//         if (costMap != null) {
//           // totally hackish; refactor
//           link.distance = maxDistance;
//         }
//       }
//       let cost;
//       if (isBoundaryXY(costMap, i, j)) {
//         cost = OBSTRUCTION;
//       } else {
//         cost = costMap[i][j];
//       }
//       link.cost = cost;
//       if (cost > 0) {
//         if (link.distance < maxDistance) {
//           if (right === null || right.distance > link.distance) {
//             // left and right are used to traverse the list; if many cells have similar values,
//             // some time can be saved by not clearing them with each insertion.  this time,
//             // sadly, we have to start from the front.
//             left = map.front;
//             right = map.front.right;
//           }
//           while (right !== null && right.distance < link.distance) {
//             left = right;
//             right = right.right;
//           }
//           link.right = right;
//           link.left = left;
//           left.right = link;
//           if (right != null) right.left = link;
//           left = link;
//         } else {
//           link.right = null;
//           link.left = null;
//         }
//       } else {
//         link.right = null;
//         link.left = null;
//       }
//     }
//   }
// }
function batchOutput(map, distanceMap) {
    let i, j;
    update(map);
    // transfer results to the distanceMap
    for (i = 0; i < map.width; i++) {
        for (j = 0; j < map.height; j++) {
            distanceMap[i][j] = getLink(map, i, j).distance;
        }
    }
}
var DIJKSTRA_MAP;
// function dijkstraScan(
//   distanceMap: Grid.NumGrid,
//   costMap: Grid.NumGrid,
//   useDiagonals = false
// ) {
//   // static makeDijkstraMap map;
//   const width = distanceMap.length;
//   const height = distanceMap[0].length;
//   if (
//     !DIJKSTRA_MAP ||
//     DIJKSTRA_MAP.width < width ||
//     DIJKSTRA_MAP.height < height
//   ) {
//     DIJKSTRA_MAP = makeDijkstraMap(width, height);
//   }
//   DIJKSTRA_MAP.width = width;
//   DIJKSTRA_MAP.height = height;
//   pdsBatchInput(DIJKSTRA_MAP, distanceMap, costMap, NO_PATH, useDiagonals);
//   batchOutput(DIJKSTRA_MAP, distanceMap);
// }
//
// function populateGenericCostMap(costMap, map) {
//   let i, j;
//
// 	for (i=0; i<map.width; i++) {
// 		for (j=0; j<map.height; j++) {
//       if (map.hasTileFlag(i, j, def.T_OBSTRUCTS_PASSABILITY)
//           && (!map.hasTileMechFlag(i, j, def.TM_IS_SECRET) || (map.discoveredTileFlags(i, j) & def.T_OBSTRUCTS_PASSABILITY)))
// 			{
// 				costMap[i][j] = map.hasTileFlag(i, j, def.T_OBSTRUCTS_DIAGONAL_MOVEMENT) ? OBSTRUCTION : FORBIDDEN;
//       } else if (map.hasTileFlag(i, j, def.T_PATHING_BLOCKER & ~def.T_OBSTRUCTS_PASSABILITY)) {
// 				costMap[i][j] = FORBIDDEN;
//       } else {
//         costMap[i][j] = 1;
//       }
//     }
//   }
// }
//
// GW.path.populateGenericCostMap = populateGenericCostMap;
//
//
// function baseCostFunction(blockingTerrainFlags, traveler, canUseSecretDoors, i, j) {
// 	let cost = 1;
// 	monst = GW.MAP.actorAt(i, j);
// 	const monstFlags = (monst ? (monst.info ? monst.info.flags : monst.flags) : 0) || 0;
// 	if ((monstFlags & (def.MONST_IMMUNE_TO_WEAPONS | def.MONST_INVULNERABLE))
// 			&& (monstFlags & (def.MONST_IMMOBILE | def.MONST_GETS_TURN_ON_ACTIVATION)))
// 	{
// 			// Always avoid damage-immune stationary monsters.
// 		cost = FORBIDDEN;
// 	} else if (canUseSecretDoors
// 			&& GW.MAP.hasTileMechFlag(i, j, TM_IS_SECRET)
// 			&& GW.MAP.hasTileFlag(i, j, T_OBSTRUCTS_PASSABILITY)
// 			&& !(GW.MAP.hasDiscoveredFlag(i, j) & T_OBSTRUCTS_PASSABILITY))
// 	{
// 		cost = 1;
// 	} else if (GW.MAP.hasTileFlag(i, j, T_OBSTRUCTS_PASSABILITY)
// 				 || (traveler && traveler === GW.PLAYER && !(GW.MAP.hasCellFlag(i, j, (REVEALED | MAGIC_MAPPED)))))
// 	{
// 		cost = GW.MAP.hasTileFlag(i, j, T_OBSTRUCTS_DIAGONAL_MOVEMENT) ? OBSTRUCTION : FORBIDDEN;
// 	} else if ((traveler && GW.actor.avoidsCell(traveler, i, j)) || GW.MAP.hasTileFlag(i, j, blockingTerrainFlags)) {
// 		cost = FORBIDDEN;
// 	}
//
// 	return cost;
// }
//
// GW.path.costFn = baseCostFunction;
// GW.path.simpleCost = baseCostFunction.bind(undefined, 0, null, false);
// GW.path.costForActor = ((actor) => baseCostFunction.bind(undefined, GW.actor.forbiddenFlags(actor), actor, actor !== GW.PLAYER));
function calculateDistances(distanceMap, destinationX, destinationY, costMap, eightWays = false, maxDistance = NO_PATH) {
    const width = distanceMap.length;
    const height = distanceMap[0].length;
    if (maxDistance <= 0)
        maxDistance = NO_PATH;
    if (!DIJKSTRA_MAP ||
        DIJKSTRA_MAP.width < width ||
        DIJKSTRA_MAP.height < height) {
        DIJKSTRA_MAP = makeDijkstraMap(width, height);
    }
    DIJKSTRA_MAP.width = width;
    DIJKSTRA_MAP.height = height;
    let i, j;
    for (i = 0; i < width; i++) {
        for (j = 0; j < height; j++) {
            getLink(DIJKSTRA_MAP, i, j).cost = isBoundaryXY(costMap, i, j)
                ? OBSTRUCTION
                : costMap[i][j];
        }
    }
    clear(DIJKSTRA_MAP, maxDistance, eightWays);
    setDistance(DIJKSTRA_MAP, destinationX, destinationY, 0);
    batchOutput(DIJKSTRA_MAP, distanceMap);
    // TODO - Add this where called!
    //   distanceMap.x = destinationX;
    //   distanceMap.y = destinationY;
}
// function pathingDistance(x1, y1, x2, y2, blockingTerrainFlags, actor) {
// 	let retval;
// 	const distanceMap = GW.grid.alloc(DUNGEON.width, DUNGEON.height, 0);
// 	const costFn = baseCostFunction.bind(undefined, blockingTerrainFlags, actor, true);
// 	calculateDistances(distanceMap, x2, y2, costFn, true);
// 	retval = distanceMap[x1][y1];
// 	GW.grid.free(distanceMap);
// 	return retval;
// }
//
// GW.path.distanceFromTo = pathingDistance;
// function monstTravelDistance(monst, x2, y2, blockingTerrainFlags) {
// 	let retval;
// 	const distanceMap = GW.grid.alloc(DUNGEON.width, DUNGEON.height, 0);
// 	calculateDistances(distanceMap, x2, y2, blockingTerrainFlags, monst, true, true);
// 	retval = distanceMap[monst.x][monst.y];
// 	GW.grid.free(distanceMap);
// 	return retval;
// }
//
// GW.actor.travelDistance = monstTravelDistance;
// Returns null if there are no beneficial moves.
// If preferDiagonals is true, we will prefer diagonal moves.
// Always rolls downhill on the distance map.
// If monst is provided, do not return a direction pointing to
// a cell that the monster avoids.
function nextStep(distanceMap, x, y, isBlocked, useDiagonals = false) {
    let newX, newY, bestScore;
    let dir, bestDir;
    let blocked;
    // brogueAssert(coordinatesAreInMap(x, y));
    bestScore = 0;
    bestDir = NO_DIRECTION;
    for (dir = 0; dir < (useDiagonals ? 8 : 4); ++dir) {
        newX = x + DIRS$2[dir][0];
        newY = y + DIRS$2[dir][1];
        blocked = isBlocked(newX, newY, x, y, distanceMap);
        if (!blocked &&
            distanceMap[x][y] - distanceMap[newX][newY] > bestScore) {
            bestDir = dir;
            bestScore = distanceMap[x][y] - distanceMap[newX][newY];
        }
    }
    return DIRS$2[bestDir] || null;
}
function getClosestValidLocationOnMap(distanceMap, x, y) {
    let i, j, dist, closestDistance, lowestMapScore;
    let locX = -1;
    let locY = -1;
    const width = distanceMap.length;
    const height = distanceMap[0].length;
    closestDistance = 10000;
    lowestMapScore = 10000;
    for (i = 1; i < width - 1; i++) {
        for (j = 1; j < height - 1; j++) {
            if (distanceMap[i][j] >= 0 && distanceMap[i][j] < NO_PATH) {
                dist = (i - x) * (i - x) + (j - y) * (j - y);
                if (dist < closestDistance ||
                    (dist == closestDistance &&
                        distanceMap[i][j] < lowestMapScore)) {
                    locX = i;
                    locY = j;
                    closestDistance = dist;
                    lowestMapScore = distanceMap[i][j];
                }
            }
        }
    }
    if (locX >= 0)
        return [locX, locY];
    return null;
}
// Populates path[][] with a list of coordinates starting at origin and traversing down the map. Returns the number of steps in the path.
function getPath(distanceMap, originX, originY, isBlocked) {
    // actor = actor || GW.PLAYER;
    let x = originX;
    let y = originY;
    let steps = 0;
    if (distanceMap[x][y] < 0 || distanceMap[x][y] >= NO_PATH) {
        const loc = getClosestValidLocationOnMap(distanceMap, x, y);
        if (loc) {
            x = loc[0];
            y = loc[1];
        }
    }
    const path = [[x, y]];
    let dir;
    do {
        dir = nextStep(distanceMap, x, y, isBlocked, true);
        if (dir) {
            x += dir[0];
            y += dir[1];
            // path[steps][0] = x;
            // path[steps][1] = y;
            path.push([x, y]);
            steps++;
            // brogueAssert(coordinatesAreInMap(x, y));
        }
    } while (dir);
    return steps ? path : null;
}
//
// GW.path.from = getMonsterPathOnMap;

var path = {
    __proto__: null,
    FORBIDDEN: FORBIDDEN,
    OBSTRUCTION: OBSTRUCTION,
    AVOIDED: AVOIDED,
    NO_PATH: NO_PATH,
    calculateDistances: calculateDistances,
    nextStep: nextStep,
    getPath: getPath
};

/**
 * Data for an event listener.
 */
class Listener {
    /**
     * Creates a Listener.
     * @param {Function} fn The listener function.
     * @param {Object} [context=null] The context to invoke the listener with.
     * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
     */
    constructor(fn, context, once = false) {
        this.fn = fn;
        this.context = context || null;
        this.once = once || false;
        this.next = null;
    }
    /**
     * Compares this Listener to the parameters.
     * @param {Function} fn - The function
     * @param {Object} [context] - The context Object.
     * @param {Boolean} [once] - Whether or not it is a one time handler.
     * @returns Whether or not this Listener matches the parameters.
     */
    matches(fn, context, once) {
        return (this.fn === fn &&
            (once === undefined || once == this.once) &&
            (!context || this.context === context));
    }
}
var EVENTS = {};
/**
 * Add a listener for a given event.
 *
 * @param {String} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {Listener}
 */
function addListener(event, fn, context, once = false) {
    if (typeof fn !== 'function') {
        throw new TypeError('The listener must be a function');
    }
    const listener = new Listener(fn, context || null, once);
    addToChain(EVENTS, event, listener);
    return listener;
}
/**
 * Add a listener for a given event.
 *
 * @param {String} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {Listener}
 */
function on(event, fn, context, once = false) {
    return addListener(event, fn, context, once);
}
/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
function once(event, fn, context) {
    return addListener(event, fn, context, true);
}
/**
 * Remove the listeners of a given event.
 *
 * @param {String} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
function removeListener(event, fn, context, once = false) {
    if (!EVENTS[event])
        return false;
    if (!fn)
        return false;
    let success = false;
    eachChain(EVENTS[event], (obj) => {
        if (obj.matches(fn, context, once)) {
            removeFromChain(EVENTS, event, obj);
            success = true;
        }
    });
    return success;
}
/**
 * Remove the listeners of a given event.
 *
 * @param {String} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
function off(event, fn, context, once = false) {
    return removeListener(event, fn, context, once);
}
/**
 * Clear event by name.
 *
 * @param {String} evt The Event name.
 */
function clearEvent(event) {
    if (EVENTS[event]) {
        EVENTS[event] = null;
    }
}
/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
function removeAllListeners(event) {
    if (event) {
        clearEvent(event);
    }
    else {
        EVENTS = {};
    }
}
/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {String} event The event name.
 * @param {...*} args The additional arguments to the event handlers.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
async function emit(...args) {
    const event = args[0];
    if (!EVENTS[event])
        return false; // no events to send
    let listener = EVENTS[event];
    while (listener) {
        let next = listener.next;
        if (listener.once)
            removeFromChain(EVENTS, event, listener);
        await listener.fn.apply(listener.context, args);
        listener = next;
    }
    return true;
}

var events = {
    __proto__: null,
    Listener: Listener,
    addListener: addListener,
    on: on,
    once: once,
    removeListener: removeListener,
    off: off,
    clearEvent: clearEvent,
    removeAllListeners: removeAllListeners,
    emit: emit
};

function make$8(v) {
    if (v === undefined)
        return () => 100;
    if (v === null)
        return () => 0;
    if (typeof v === 'number')
        return () => v;
    if (typeof v === 'function')
        return v;
    let base = {};
    if (typeof v === 'string') {
        const parts = v.split(/[,|]/).map((t) => t.trim());
        base = {};
        parts.forEach((p) => {
            let [level, weight] = p.split(':');
            base[level] = Number.parseInt(weight) || 100;
        });
    }
    else {
        base = v;
    }
    const parts = Object.entries(base);
    const funcs = parts.map(([levels, frequency]) => {
        let value = 0;
        if (typeof frequency === 'string') {
            value = Number.parseInt(frequency);
        }
        else {
            value = frequency;
        }
        if (levels.includes('-')) {
            let [start, end] = levels
                .split('-')
                .map((t) => t.trim())
                .map((v) => Number.parseInt(v));
            return (level) => level >= start && level <= end ? value : 0;
        }
        else if (levels.endsWith('+')) {
            const found = Number.parseInt(levels);
            return (level) => (level >= found ? value : 0);
        }
        else {
            const found = Number.parseInt(levels);
            return (level) => (level === found ? value : 0);
        }
    });
    if (funcs.length == 1)
        return funcs[0];
    return (level) => funcs.reduce((out, fn) => out || fn(level), 0);
}

var frequency = {
    __proto__: null,
    make: make$8
};

class Scheduler {
    constructor() {
        this.next = null;
        this.time = 0;
        this.cache = null;
    }
    clear() {
        while (this.next) {
            const current = this.next;
            this.next = current.next;
            current.next = this.cache;
            this.cache = current;
        }
    }
    push(fn, delay = 1) {
        let item;
        if (this.cache) {
            item = this.cache;
            this.cache = item.next;
            item.next = null;
        }
        else {
            item = { fn: null, time: 0, next: null };
        }
        item.fn = fn;
        item.time = this.time + delay;
        if (!this.next) {
            this.next = item;
        }
        else {
            let current = this;
            let next = current.next;
            while (next && next.time <= item.time) {
                current = next;
                next = current.next;
            }
            item.next = current.next;
            current.next = item;
        }
        return item;
    }
    pop() {
        const n = this.next;
        if (!n)
            return null;
        this.next = n.next;
        n.next = this.cache;
        this.cache = n;
        this.time = Math.max(n.time, this.time); // so you can schedule -1 as a time uint
        return n.fn;
    }
    remove(item) {
        if (!item || !this.next)
            return;
        if (this.next === item) {
            this.next = item.next;
            return;
        }
        let prev = this.next;
        let current = prev.next;
        while (current && current !== item) {
            prev = current;
            current = current.next;
        }
        if (current === item) {
            prev.next = current.next;
        }
    }
}
// export const scheduler = new Scheduler();

var scheduler = {
    __proto__: null,
    Scheduler: Scheduler
};

// Based on: https://github.com/ondras/fastiles/blob/master/ts/shaders.ts (v2.1.0)
const VS = `
#version 300 es
in uvec2 position;
in uvec2 uv;
in uint style;
out vec2 fsUv;
flat out uint fsStyle;
uniform highp uvec2 tileSize;
uniform uvec2 viewportSize;
void main() {
	ivec2 positionPx = ivec2(position * tileSize);
	vec2 positionNdc = (vec2(positionPx * 2) / vec2(viewportSize))-1.0;
	positionNdc.y *= -1.0;
	gl_Position = vec4(positionNdc, 0.0, 1.0);
	fsUv = vec2(uv);
	fsStyle = style;
}`.trim();
const FS = `
#version 300 es
precision highp float;
in vec2 fsUv;
flat in uint fsStyle;
out vec4 fragColor;
uniform sampler2D font;
uniform highp uvec2 tileSize;
void main() {
	uvec2 fontTiles = uvec2(textureSize(font, 0)) / tileSize;

	uint glyph = (fsStyle & uint(0xFF000000)) >> 24;
	uint glyphX = (glyph & uint(0xF));
	uint glyphY = (glyph >> 4);
	uvec2 fontPosition = uvec2(glyphX, glyphY);

	uvec2 fontPx = (tileSize * fontPosition) + uvec2(vec2(tileSize) * fsUv);
	vec3 texel = texelFetch(font, ivec2(fontPx), 0).rgb;

	float s = 15.0;
	uint fr = (fsStyle & uint(0xF00)) >> 8;
	uint fg = (fsStyle & uint(0x0F0)) >> 4;
	uint fb = (fsStyle & uint(0x00F)) >> 0;
	vec3 fgRgb = vec3(fr, fg, fb) / s;
  
	uint br = (fsStyle & uint(0xF00000)) >> 20;
	uint bg = (fsStyle & uint(0x0F0000)) >> 16;
	uint bb = (fsStyle & uint(0x00F000)) >> 12;
	vec3 bgRgb = vec3(br, bg, bb) / s;
  
	fragColor = vec4(mix(bgRgb, fgRgb, texel), 1.0);
}`.trim();

class Glyphs {
    constructor(opts = {}) {
        this._tileWidth = 12;
        this._tileHeight = 16;
        this.needsUpdate = true;
        this._map = {};
        opts.font = opts.font || 'monospace';
        this._node = document.createElement('canvas');
        this._ctx = this.node.getContext('2d');
        this._configure(opts);
    }
    static fromImage(src) {
        if (typeof src === 'string') {
            if (src.startsWith('data:'))
                throw new Error('Glyph: You must load a data string into an image element and use that.');
            const el = document.getElementById(src);
            if (!el)
                throw new Error('Glyph: Failed to find image element with id:' + src);
            src = el;
        }
        const glyph = new this({
            tileWidth: src.width / 16,
            tileHeight: src.height / 16,
        });
        glyph._ctx.drawImage(src, 0, 0);
        return glyph;
    }
    static fromFont(src) {
        if (typeof src === 'string') {
            src = { font: src };
        }
        const glyphs = new this(src);
        const basicOnly = src.basicOnly || src.basic || false;
        glyphs._initGlyphs(basicOnly);
        return glyphs;
    }
    get node() {
        return this._node;
    }
    get ctx() {
        return this._ctx;
    }
    get tileWidth() {
        return this._tileWidth;
    }
    get tileHeight() {
        return this._tileHeight;
    }
    get pxWidth() {
        return this._node.width;
    }
    get pxHeight() {
        return this._node.height;
    }
    forChar(ch) {
        if (!ch || !ch.length)
            return -1;
        return this._map[ch] || -1;
    }
    _configure(opts) {
        this._tileWidth = opts.tileWidth || this.tileWidth;
        this._tileHeight = opts.tileHeight || this.tileHeight;
        this.node.width = 16 * this.tileWidth;
        this.node.height = 16 * this.tileHeight;
        this._ctx.fillStyle = 'black';
        this._ctx.fillRect(0, 0, this.pxWidth, this.pxHeight);
        const size = opts.fontSize ||
            opts.size ||
            Math.max(this.tileWidth, this.tileHeight);
        this._ctx.font = '' + size + 'px ' + opts.font;
        this._ctx.textAlign = 'center';
        this._ctx.textBaseline = 'middle';
        this._ctx.fillStyle = 'white';
    }
    draw(n, ch) {
        if (n > 256)
            throw new Error('Cannot draw more than 256 glyphs.');
        const x = (n % 16) * this.tileWidth;
        const y = Math.floor(n / 16) * this.tileHeight;
        const cx = x + Math.floor(this.tileWidth / 2);
        const cy = y + Math.floor(this.tileHeight / 2);
        this._ctx.save();
        this._ctx.beginPath();
        this._ctx.rect(x, y, this.tileWidth, this.tileHeight);
        this._ctx.clip();
        this._ctx.fillStyle = 'black';
        this._ctx.fillRect(x, y, this.tileWidth, this.tileHeight);
        this._ctx.fillStyle = 'white';
        if (typeof ch === 'function') {
            ch(this._ctx, x, y, this.tileWidth, this.tileHeight);
        }
        else {
            if (this._map[ch] === undefined)
                this._map[ch] = n;
            this._ctx.fillText(ch, cx, cy);
        }
        this._ctx.restore();
        this.needsUpdate = true;
    }
    _initGlyphs(basicOnly = false) {
        for (let i = 32; i < 127; ++i) {
            this.draw(i, String.fromCharCode(i));
        }
        [
            ' ',
            '\u263a',
            '\u263b',
            '\u2665',
            '\u2666',
            '\u2663',
            '\u2660',
            '\u263c',
            '\u2600',
            '\u2605',
            '\u2606',
            '\u2642',
            '\u2640',
            '\u266a',
            '\u266b',
            '\u2638',
            '\u25b6',
            '\u25c0',
            '\u2195',
            '\u203c',
            '\u204b',
            '\u262f',
            '\u2318',
            '\u2616',
            '\u2191',
            '\u2193',
            '\u2192',
            '\u2190',
            '\u2126',
            '\u2194',
            '\u25b2',
            '\u25bc',
        ].forEach((ch, i) => {
            this.draw(i, ch);
        });
        if (!basicOnly) {
            // [
            // '\u2302',
            // '\u2b09', '\u272a', '\u2718', '\u2610', '\u2611', '\u25ef', '\u25ce', '\u2690',
            // '\u2691', '\u2598', '\u2596', '\u259d', '\u2597', '\u2744', '\u272d', '\u2727',
            // '\u25e3', '\u25e4', '\u25e2', '\u25e5', '\u25a8', '\u25a7', '\u259a', '\u265f',
            // '\u265c', '\u265e', '\u265d', '\u265b', '\u265a', '\u301c', '\u2694', '\u2692',
            // '\u25b6', '\u25bc', '\u25c0', '\u25b2', '\u25a4', '\u25a5', '\u25a6', '\u257a',
            // '\u257b', '\u2578', '\u2579', '\u2581', '\u2594', '\u258f', '\u2595', '\u272d',
            // '\u2591', '\u2592', '\u2593', '\u2503', '\u252b', '\u2561', '\u2562', '\u2556',
            // '\u2555', '\u2563', '\u2551', '\u2557', '\u255d', '\u255c', '\u255b', '\u2513',
            // '\u2517', '\u253b', '\u2533', '\u2523', '\u2501', '\u254b', '\u255e', '\u255f',
            // '\u255a', '\u2554', '\u2569', '\u2566', '\u2560', '\u2550', '\u256c', '\u2567',
            // '\u2568', '\u2564', '\u2565', '\u2559', '\u2558', '\u2552', '\u2553', '\u256b',
            // '\u256a', '\u251b', '\u250f', '\u2588', '\u2585', '\u258c', '\u2590', '\u2580',
            // '\u03b1', '\u03b2', '\u0393', '\u03c0', '\u03a3', '\u03c3', '\u03bc', '\u03c4',
            // '\u03a6', '\u03b8', '\u03a9', '\u03b4', '\u221e', '\u03b8', '\u03b5', '\u03b7',
            // '\u039e', '\u00b1', '\u2265', '\u2264', '\u2234', '\u2237', '\u00f7', '\u2248',
            // '\u22c4', '\u22c5', '\u2217', '\u27b5', '\u2620', '\u2625', '\u25fc', '\u25fb'
            // ].forEach( (ch, i) => {
            //   this.draw(i + 127, ch);
            // });
            [
                '\u2302',
                '\u00C7',
                '\u00FC',
                '\u00E9',
                '\u00E2',
                '\u00E4',
                '\u00E0',
                '\u00E5',
                '\u00E7',
                '\u00EA',
                '\u00EB',
                '\u00E8',
                '\u00EF',
                '\u00EE',
                '\u00EC',
                '\u00C4',
                '\u00C5',
                '\u00C9',
                '\u00E6',
                '\u00C6',
                '\u00F4',
                '\u00F6',
                '\u00F2',
                '\u00FB',
                '\u00F9',
                '\u00FF',
                '\u00D6',
                '\u00DC',
                '\u00A2',
                '\u00A3',
                '\u00A5',
                '\u20A7',
                '\u0192',
                '\u00E1',
                '\u00ED',
                '\u00F3',
                '\u00FA',
                '\u00F1',
                '\u00D1',
                '\u00AA',
                '\u00BA',
                '\u00BF',
                '\u2310',
                '\u00AC',
                '\u00BD',
                '\u00BC',
                '\u00A1',
                '\u00AB',
                '\u00BB',
                '\u2591',
                '\u2592',
                '\u2593',
                '\u2502',
                '\u2524',
                '\u2561',
                '\u2562',
                '\u2556',
                '\u2555',
                '\u2563',
                '\u2551',
                '\u2557',
                '\u255D',
                '\u255C',
                '\u255B',
                '\u2510',
                '\u2514',
                '\u2534',
                '\u252C',
                '\u251C',
                '\u2500',
                '\u253C',
                '\u255E',
                '\u255F',
                '\u255A',
                '\u2554',
                '\u2569',
                '\u2566',
                '\u2560',
                '\u2550',
                '\u256C',
                '\u2567',
                '\u2568',
                '\u2564',
                '\u2565',
                '\u2559',
                '\u2558',
                '\u2552',
                '\u2553',
                '\u256B',
                '\u256A',
                '\u2518',
                '\u250C',
                '\u2588',
                '\u2584',
                '\u258C',
                '\u2590',
                '\u2580',
                '\u03B1',
                '\u00DF',
                '\u0393',
                '\u03C0',
                '\u03A3',
                '\u03C3',
                '\u00B5',
                '\u03C4',
                '\u03A6',
                '\u0398',
                '\u03A9',
                '\u03B4',
                '\u221E',
                '\u03C6',
                '\u03B5',
                '\u2229',
                '\u2261',
                '\u00B1',
                '\u2265',
                '\u2264',
                '\u2320',
                '\u2321',
                '\u00F7',
                '\u2248',
                '\u00B0',
                '\u2219',
                '\u00B7',
                '\u221A',
                '\u207F',
                '\u00B2',
                '\u25A0',
                '\u00A0',
            ].forEach((ch, i) => {
                this.draw(i + 127, ch);
            });
        }
    }
}

function toColorInt(r, g, b, base256) {
    if (base256) {
        r = Math.max(0, Math.min(255, Math.round(r * 2.550001)));
        g = Math.max(0, Math.min(255, Math.round(g * 2.550001)));
        b = Math.max(0, Math.min(255, Math.round(b * 2.550001)));
        return (r << 16) + (g << 8) + b;
    }
    r = Math.max(0, Math.min(15, Math.round((r / 100) * 15)));
    g = Math.max(0, Math.min(15, Math.round((g / 100) * 15)));
    b = Math.max(0, Math.min(15, Math.round((b / 100) * 15)));
    return (r << 8) + (g << 4) + b;
}
const colors = {};
class Color extends Int16Array {
    constructor(r = -1, g = 0, b = 0, rand = 0, redRand = 0, greenRand = 0, blueRand = 0, dances = false) {
        super(7);
        this.dances = false;
        this.set([r, g, b, rand, redRand, greenRand, blueRand]);
        this.dances = dances;
    }
    get r() {
        return Math.round(this[0] * 2.550001);
    }
    get _r() {
        return this[0];
    }
    set _r(v) {
        this[0] = v;
    }
    get g() {
        return Math.round(this[1] * 2.550001);
    }
    get _g() {
        return this[1];
    }
    set _g(v) {
        this[1] = v;
    }
    get b() {
        return Math.round(this[2] * 2.550001);
    }
    get _b() {
        return this[2];
    }
    set _b(v) {
        this[2] = v;
    }
    get _rand() {
        return this[3];
    }
    get _redRand() {
        return this[4];
    }
    get _greenRand() {
        return this[5];
    }
    get _blueRand() {
        return this[6];
    }
    // luminosity (0-100)
    get l() {
        return Math.round(0.5 *
            (Math.min(this._r, this._g, this._b) +
                Math.max(this._r, this._g, this._b)));
    }
    // saturation (0-100)
    get s() {
        if (this.l >= 100)
            return 0;
        return Math.round(((Math.max(this._r, this._g, this._b) -
            Math.min(this._r, this._g, this._b)) *
            (100 - Math.abs(this.l * 2 - 100))) /
            100);
    }
    // hue (0-360)
    get h() {
        let H = 0;
        let R = this.r;
        let G = this.g;
        let B = this.b;
        if (R >= G && G >= B) {
            H = 60 * ((G - B) / (R - B));
        }
        else if (G > R && R >= B) {
            H = 60 * (2 - (R - B) / (G - B));
        }
        else if (G >= B && B > R) {
            H = 60 * (2 + (B - R) / (G - R));
        }
        else if (B > G && G > R) {
            H = 60 * (4 - (G - R) / (B - R));
        }
        else if (B > R && R >= G) {
            H = 60 * (4 + (R - G) / (B - G));
        }
        else {
            H = 60 * (6 - (B - G) / (R - G));
        }
        return Math.round(H);
    }
    isNull() {
        return this._r < 0;
    }
    equals(other) {
        if (typeof other === 'string') {
            if (!other.startsWith('#'))
                return this.name == other;
            return this.css(other.length > 4) == other;
        }
        else if (typeof other === 'number') {
            return this.toInt() == other || this.toInt(true) == other;
        }
        const O = from$4(other);
        if (this.isNull())
            return O.isNull();
        return this.every((v, i) => {
            return v == O[i];
        });
    }
    copy(other) {
        if (other instanceof Color) {
            this.dances = other.dances;
        }
        else if (Array.isArray(other)) {
            if (other.length === 8) {
                this.dances = other[7];
            }
        }
        else {
            other = from$4(other);
            this.dances = other.dances;
        }
        for (let i = 0; i < this.length; ++i) {
            this[i] = other[i] || 0;
        }
        if (other instanceof Color) {
            this.name = other.name;
        }
        else {
            this._changed();
        }
        return this;
    }
    _changed() {
        this.name = undefined;
        return this;
    }
    clone() {
        // @ts-ignore
        const other = new this.constructor();
        other.copy(this);
        return other;
    }
    assign(_r = -1, _g = 0, _b = 0, _rand = 0, _redRand = 0, _greenRand = 0, _blueRand = 0, dances) {
        for (let i = 0; i < this.length; ++i) {
            this[i] = arguments[i] || 0;
        }
        if (dances !== undefined) {
            this.dances = dances;
        }
        return this._changed();
    }
    assignRGB(_r = -1, _g = 0, _b = 0, _rand = 0, _redRand = 0, _greenRand = 0, _blueRand = 0, dances) {
        for (let i = 0; i < this.length; ++i) {
            this[i] = Math.round((arguments[i] || 0) / 2.55);
        }
        if (dances !== undefined) {
            this.dances = dances;
        }
        return this._changed();
    }
    nullify() {
        this[0] = -1;
        this.dances = false;
        return this._changed();
    }
    blackOut() {
        for (let i = 0; i < this.length; ++i) {
            this[i] = 0;
        }
        this.dances = false;
        return this._changed();
    }
    toInt(base256 = false) {
        if (this.isNull())
            return -1;
        if (!this.dances) {
            return toColorInt(this._r, this._g, this._b, base256);
        }
        const rand = cosmetic.number(this._rand);
        const redRand = cosmetic.number(this._redRand);
        const greenRand = cosmetic.number(this._greenRand);
        const blueRand = cosmetic.number(this._blueRand);
        const r = this._r + rand + redRand;
        const g = this._g + rand + greenRand;
        const b = this._b + rand + blueRand;
        return toColorInt(r, g, b, base256);
    }
    toLight() {
        return [this._r, this._g, this._b];
    }
    clamp() {
        if (this.isNull())
            return this;
        this._r = Math.min(100, Math.max(0, this._r));
        this._g = Math.min(100, Math.max(0, this._g));
        this._b = Math.min(100, Math.max(0, this._b));
        return this._changed();
    }
    mix(other, percent) {
        const O = from$4(other);
        if (O.isNull())
            return this;
        if (this.isNull()) {
            this.blackOut();
        }
        percent = Math.min(100, Math.max(0, percent));
        const keepPct = 100 - percent;
        for (let i = 0; i < this.length; ++i) {
            this[i] = Math.round((this[i] * keepPct + O[i] * percent) / 100);
        }
        this.dances = this.dances || O.dances;
        return this._changed();
    }
    // Only adjusts r,g,b
    lighten(percent) {
        if (this.isNull())
            return this;
        percent = Math.min(100, Math.max(0, percent));
        if (percent <= 0)
            return;
        const keepPct = 100 - percent;
        for (let i = 0; i < 3; ++i) {
            this[i] = Math.round((this[i] * keepPct + 100 * percent) / 100);
        }
        return this._changed();
    }
    // Only adjusts r,g,b
    darken(percent) {
        if (this.isNull())
            return this;
        percent = Math.min(100, Math.max(0, percent));
        if (percent <= 0)
            return;
        const keepPct = 100 - percent;
        for (let i = 0; i < 3; ++i) {
            this[i] = Math.round((this[i] * keepPct + 0 * percent) / 100);
        }
        return this._changed();
    }
    bake(clearDancing = false) {
        if (this.isNull())
            return this;
        if (this.dances && !clearDancing)
            return;
        this.dances = false;
        const d = this;
        if (d[3] + d[4] + d[5] + d[6]) {
            const rand = cosmetic.number(this._rand);
            const redRand = cosmetic.number(this._redRand);
            const greenRand = cosmetic.number(this._greenRand);
            const blueRand = cosmetic.number(this._blueRand);
            this._r += rand + redRand;
            this._g += rand + greenRand;
            this._b += rand + blueRand;
            for (let i = 3; i < this.length; ++i) {
                this[i] = 0;
            }
            return this._changed();
        }
        return this;
    }
    // Adds a color to this one
    add(other, percent = 100) {
        const O = from$4(other);
        if (O.isNull())
            return this;
        if (this.isNull()) {
            this.blackOut();
        }
        for (let i = 0; i < this.length; ++i) {
            this[i] += Math.round((O[i] * percent) / 100);
        }
        this.dances = this.dances || O.dances;
        return this._changed();
    }
    scale(percent) {
        if (this.isNull() || percent == 100)
            return this;
        percent = Math.max(0, percent);
        for (let i = 0; i < this.length; ++i) {
            this[i] = Math.round((this[i] * percent) / 100);
        }
        return this._changed();
    }
    multiply(other) {
        if (this.isNull())
            return this;
        let data = other;
        if (!Array.isArray(other)) {
            if (other.isNull())
                return this;
            data = other;
        }
        const len = Math.max(3, Math.min(this.length, data.length));
        for (let i = 0; i < len; ++i) {
            this[i] = Math.round((this[i] * (data[i] || 0)) / 100);
        }
        return this._changed();
    }
    // scales rgb down to a max of 100
    normalize() {
        if (this.isNull())
            return this;
        const max = Math.max(this._r, this._g, this._b);
        if (max <= 100)
            return this;
        this._r = Math.round((100 * this._r) / max);
        this._g = Math.round((100 * this._g) / max);
        this._b = Math.round((100 * this._b) / max);
        return this._changed();
    }
    /**
     * Returns the css code for the current RGB values of the color.
     * @param base256 - Show in base 256 (#abcdef) instead of base 16 (#abc)
     */
    css(base256 = false) {
        const v = this.toInt(base256);
        return '#' + v.toString(16).padStart(base256 ? 6 : 3, '0');
    }
    toString(base256 = false) {
        if (this.name)
            return this.name;
        if (this.isNull())
            return 'null color';
        return this.css(base256);
    }
}
function fromArray(vals, base256 = false) {
    while (vals.length < 3)
        vals.push(0);
    if (base256) {
        for (let i = 0; i < 7; ++i) {
            vals[i] = Math.round(((vals[i] || 0) * 100) / 255);
        }
    }
    return new Color(...vals);
}
function fromCss(css) {
    if (!css.startsWith('#')) {
        throw new Error('Color CSS strings must be of form "#abc" or "#abcdef" - received: [' +
            css +
            ']');
    }
    const c = Number.parseInt(css.substring(1), 16);
    let r, g, b;
    if (css.length == 4) {
        r = Math.round(((c >> 8) / 15) * 100);
        g = Math.round((((c & 0xf0) >> 4) / 15) * 100);
        b = Math.round(((c & 0xf) / 15) * 100);
    }
    else {
        r = Math.round(((c >> 16) / 255) * 100);
        g = Math.round((((c & 0xff00) >> 8) / 255) * 100);
        b = Math.round(((c & 0xff) / 255) * 100);
    }
    return new Color(r, g, b);
}
function fromName(name) {
    const c = colors[name];
    if (!c) {
        throw new Error('Unknown color name: ' + name);
    }
    return c;
}
function fromNumber(val, base256 = false) {
    const c = new Color();
    for (let i = 0; i < c.length; ++i) {
        c[i] = 0;
    }
    if (val < 0) {
        c.assign(-1);
    }
    else if (base256 || val > 0xfff) {
        c.assign(Math.round((((val & 0xff0000) >> 16) * 100) / 255), Math.round((((val & 0xff00) >> 8) * 100) / 255), Math.round(((val & 0xff) * 100) / 255));
    }
    else {
        c.assign(Math.round((((val & 0xf00) >> 8) * 100) / 15), Math.round((((val & 0xf0) >> 4) * 100) / 15), Math.round(((val & 0xf) * 100) / 15));
    }
    return c;
}
function make$7(...args) {
    let arg = args[0];
    let base256 = args[1];
    if (args.length == 0)
        return new Color();
    if (args.length > 2) {
        arg = args;
        base256 = false; // TODO - Change this!!!
    }
    if (arg === undefined || arg === null)
        return new Color(-1);
    if (arg instanceof Color) {
        return arg.clone();
    }
    if (typeof arg === 'string') {
        if (arg.startsWith('#')) {
            return fromCss(arg);
        }
        return fromName(arg).clone();
    }
    else if (Array.isArray(arg)) {
        return fromArray(arg, base256);
    }
    else if (typeof arg === 'number') {
        return fromNumber(arg, base256);
    }
    throw new Error('Failed to make color - unknown argument: ' + JSON.stringify(arg));
}
function from$4(...args) {
    const arg = args[0];
    if (arg instanceof Color)
        return arg;
    if (arg === undefined)
        return new Color(-1);
    if (typeof arg === 'string') {
        if (!arg.startsWith('#')) {
            return fromName(arg);
        }
    }
    return make$7(arg, args[1]);
}
// adjusts the luminosity of 2 colors to ensure there is enough separation between them
function separate(a, b) {
    if (a.isNull() || b.isNull())
        return;
    const A = a.clone().clamp();
    const B = b.clone().clamp();
    // console.log('separate');
    // console.log('- a=%s, h=%d, s=%d, l=%d', A.toString(), A.h, A.s, A.l);
    // console.log('- b=%s, h=%d, s=%d, l=%d', B.toString(), B.h, B.s, B.l);
    let hDiff = Math.abs(A.h - B.h);
    if (hDiff > 180) {
        hDiff = 360 - hDiff;
    }
    if (hDiff > 45)
        return; // colors are far enough apart in hue to be distinct
    const dist = 40;
    if (Math.abs(A.l - B.l) >= dist)
        return;
    // Get them sorted by saturation ( we will darken the more saturated color and lighten the other)
    const [lo, hi] = [A, B].sort((a, b) => a.s - b.s);
    // console.log('- lo=%s, hi=%s', lo.toString(), hi.toString());
    while (hi.l - lo.l < dist) {
        hi.mix(WHITE, 5);
        lo.mix(BLACK, 5);
    }
    a.copy(A);
    b.copy(B);
    // console.log('=>', a.toString(), b.toString());
}
function swap(a, b) {
    const temp = a.clone();
    a.copy(b);
    b.copy(temp);
}
function relativeLuminance(a, b) {
    return Math.round((100 *
        ((a.r - b.r) * (a.r - b.r) * 0.2126 +
            (a.g - b.g) * (a.g - b.g) * 0.7152 +
            (a.b - b.b) * (a.b - b.b) * 0.0722)) /
        65025);
}
function distance(a, b) {
    return Math.round((100 *
        ((a.r - b.r) * (a.r - b.r) * 0.3333 +
            (a.g - b.g) * (a.g - b.g) * 0.3333 +
            (a.b - b.b) * (a.b - b.b) * 0.3333)) /
        65025);
}
function install$5(name, ...args) {
    let info = args;
    if (args.length == 1) {
        info = args[0];
    }
    const c = info instanceof Color ? info : make$7(info);
    colors[name] = c;
    c.name = name;
    return c;
}
function installSpread(name, ...args) {
    let c;
    if (args.length == 1) {
        c = install$5(name, args[0]);
    }
    else {
        c = install$5(name, ...args);
    }
    install$5('light_' + name, c.clone().lighten(25));
    install$5('lighter_' + name, c.clone().lighten(50));
    install$5('lightest_' + name, c.clone().lighten(75));
    install$5('dark_' + name, c.clone().darken(25));
    install$5('darker_' + name, c.clone().darken(50));
    install$5('darkest_' + name, c.clone().darken(75));
    return c;
}
const NONE = install$5('NONE', -1);
const BLACK = install$5('black', 0x000);
const WHITE = install$5('white', 0xfff);
installSpread('teal', [30, 100, 100]);
installSpread('brown', [60, 40, 0]);
installSpread('tan', [80, 70, 55]); // 80, 67,		15);
installSpread('pink', [100, 60, 66]);
installSpread('gray', [50, 50, 50]);
installSpread('yellow', [100, 100, 0]);
installSpread('purple', [100, 0, 100]);
installSpread('green', [0, 100, 0]);
installSpread('orange', [100, 50, 0]);
installSpread('blue', [0, 0, 100]);
installSpread('red', [100, 0, 0]);
installSpread('amber', [100, 75, 0]);
installSpread('flame', [100, 25, 0]);
installSpread('fuchsia', [100, 0, 100]);
installSpread('magenta', [100, 0, 75]);
installSpread('crimson', [100, 0, 25]);
installSpread('lime', [75, 100, 0]);
installSpread('chartreuse', [50, 100, 0]);
installSpread('sepia', [50, 40, 25]);
installSpread('violet', [50, 0, 100]);
installSpread('han', [25, 0, 100]);
installSpread('cyan', [0, 100, 100]);
installSpread('turquoise', [0, 100, 75]);
installSpread('sea', [0, 100, 50]);
installSpread('sky', [0, 75, 100]);
installSpread('azure', [0, 50, 100]);
installSpread('silver', [75, 75, 75]);
installSpread('gold', [100, 85, 0]);

var index$a = {
    __proto__: null,
    colors: colors,
    Color: Color,
    fromArray: fromArray,
    fromCss: fromCss,
    fromName: fromName,
    fromNumber: fromNumber,
    make: make$7,
    from: from$4,
    separate: separate,
    swap: swap,
    relativeLuminance: relativeLuminance,
    distance: distance,
    install: install$5,
    installSpread: installSpread,
    NONE: NONE
};

class Mixer {
    constructor(base) {
        this.ch = first(base === null || base === void 0 ? void 0 : base.ch, -1);
        this.fg = from$4(base === null || base === void 0 ? void 0 : base.fg);
        this.bg = from$4(base === null || base === void 0 ? void 0 : base.bg);
    }
    _changed() {
        return this;
    }
    copy(other) {
        this.ch = other.ch;
        this.fg.copy(other.fg);
        this.bg.copy(other.bg);
        return this._changed();
    }
    clone() {
        const other = new Mixer();
        other.copy(this);
        return other;
    }
    equals(other) {
        return (this.ch == other.ch &&
            this.fg.equals(other.fg) &&
            this.bg.equals(other.bg));
    }
    get dances() {
        return this.fg.dances || this.bg.dances;
    }
    nullify() {
        this.ch = -1;
        this.fg.nullify();
        this.bg.nullify();
        return this._changed();
    }
    blackOut() {
        this.ch = 0;
        this.fg.blackOut();
        this.bg.blackOut();
        return this._changed();
    }
    draw(ch = -1, fg = -1, bg = -1) {
        if (ch && ch !== -1) {
            this.ch = ch;
        }
        if (fg !== -1 && fg !== null) {
            fg = from$4(fg);
            this.fg.copy(fg);
        }
        if (bg !== -1 && bg !== null) {
            bg = from$4(bg);
            this.bg.copy(bg);
        }
        return this._changed();
    }
    drawSprite(src, opacity) {
        if (src === this)
            return this;
        // @ts-ignore
        if (opacity === undefined)
            opacity = src.opacity;
        if (opacity === undefined)
            opacity = 100;
        if (opacity <= 0)
            return;
        if (src.ch)
            this.ch = src.ch;
        if ((src.fg && src.fg !== -1) || src.fg === 0)
            this.fg.mix(src.fg, opacity);
        if ((src.bg && src.bg !== -1) || src.bg === 0)
            this.bg.mix(src.bg, opacity);
        return this._changed();
    }
    invert() {
        [this.bg, this.fg] = [this.fg, this.bg];
        return this._changed();
    }
    multiply(color, fg = true, bg = true) {
        color = from$4(color);
        if (fg) {
            this.fg.multiply(color);
        }
        if (bg) {
            this.bg.multiply(color);
        }
        return this._changed();
    }
    scale(multiplier, fg = true, bg = true) {
        if (fg)
            this.fg.scale(multiplier);
        if (bg)
            this.bg.scale(multiplier);
        return this._changed();
    }
    mix(color, fg = 50, bg = fg) {
        color = from$4(color);
        if (fg > 0) {
            this.fg.mix(color, fg);
        }
        if (bg > 0) {
            this.bg.mix(color, bg);
        }
        return this._changed();
    }
    add(color, fg = 100, bg = fg) {
        color = from$4(color);
        if (fg > 0) {
            this.fg.add(color, fg);
        }
        if (bg > 0) {
            this.bg.add(color, bg);
        }
        return this._changed();
    }
    separate() {
        separate(this.fg, this.bg);
        return this._changed();
    }
    bake(clearDancing = false) {
        this.fg.bake(clearDancing);
        this.bg.bake(clearDancing);
        this._changed();
        return {
            ch: this.ch,
            fg: this.fg.toInt(),
            bg: this.bg.toInt(),
        };
    }
    toString() {
        // prettier-ignore
        return `{ ch: ${this.ch}, fg: ${this.fg.toString(true)}, bg: ${this.bg.toString(true)} }`;
    }
}
function makeMixer(base) {
    return new Mixer(base);
}

var options = {
    colorStart: 'Ω',
    colorEnd: '∆',
    field: '§',
    defaultFg: null,
    defaultBg: null,
};
// const RE_RGB = /^[a-fA-F0-9]*$/;
// 
// export function parseColor(color:string) {
//   if (color.startsWith('#')) {
//     color = color.substring(1);
//   }
//   else if (color.startsWith('0x')) {
//     color = color.substring(2);
//   }
//   if (color.length == 3) {
//     if (RE_RGB.test(color)) {
//       return Number.parseInt(color, 16);
//     }
//   }
//   if (color.length == 6) {
//     if (RE_RGB.test(color)) {
//       const v = Number.parseInt(color, 16);
//       const r = Math.round( ((v & 0xFF0000) >> 16) / 17);
//       const g = Math.round( ((v & 0xFF00) >> 8) / 17);
//       const b = Math.round((v & 0xFF) / 17);
//       return (r << 8) + (g << 4) + b;
//     }
//   }
//   return 0xFFF;
// }
var helpers = {
    eachColor: (() => { }),
    default: ((name, _, value) => {
        if (value !== undefined)
            return `${value}.!!${name}!!`;
        return `!!${name}!!`;
    }),
};
function addHelper(name, fn) {
    helpers[name] = fn;
}

function compile(template) {
    const F = options.field;
    const parts = template.split(F);
    const sections = parts.map((part, i) => {
        if (i % 2 == 0)
            return textSegment(part);
        if (part.length == 0)
            return textSegment(F);
        return makeVariable(part);
    });
    return function (args = {}) {
        return sections.map((f) => f(args)).join("");
    };
}
function apply(template, args = {}) {
    const fn = compile(template);
    const result = fn(args);
    return result;
}
function textSegment(value) {
    return () => value;
}
function baseValue(name) {
    return function (args) {
        const h = helpers[name];
        if (h)
            return h(name, args);
        const v = args[name];
        if (v !== undefined)
            return v;
        return helpers.default(name, args);
    };
}
function fieldValue(name, source) {
    return function (args) {
        const obj = source(args);
        if (!obj)
            return helpers.default(name, args, obj);
        const value = obj[name];
        if (value === undefined)
            return helpers.default(name, args, obj);
        return value;
    };
}
function helperValue(name, source) {
    const helper = helpers[name] || helpers.default;
    return function (args) {
        const base = source(args);
        return helper(name, args, base);
    };
}
function stringFormat(format, source) {
    const data = /%(-?\d*)s/.exec(format) || [];
    const length = Number.parseInt(data[1] || "0");
    return function (args) {
        let text = "" + source(args);
        if (length < 0) {
            text = text.padEnd(-length);
        }
        else if (length) {
            text = text.padStart(length);
        }
        return text;
    };
}
function intFormat(format, source) {
    const data = /%([\+-]*)(\d*)d/.exec(format) || ["", "", "0"];
    let length = Number.parseInt(data[2] || "0");
    const wantSign = data[1].includes("+");
    const left = data[1].includes("-");
    return function (args) {
        const value = Number.parseInt(source(args) || 0);
        let text = "" + value;
        if (value > 0 && wantSign) {
            text = "+" + text;
        }
        if (length && left) {
            return text.padEnd(length);
        }
        else if (length) {
            return text.padStart(length);
        }
        return text;
    };
}
function floatFormat(format, source) {
    const data = /%([\+-]*)(\d*)(\.(\d+))?f/.exec(format) || ["", "", "0"];
    let length = Number.parseInt(data[2] || "0");
    const wantSign = data[1].includes("+");
    const left = data[1].includes("-");
    const fixed = Number.parseInt(data[4]) || 0;
    return function (args) {
        const value = Number.parseFloat(source(args) || 0);
        let text;
        if (fixed) {
            text = value.toFixed(fixed);
        }
        else {
            text = "" + value;
        }
        if (value > 0 && wantSign) {
            text = "+" + text;
        }
        if (length && left) {
            return text.padEnd(length);
        }
        else if (length) {
            return text.padStart(length);
        }
        return text;
    };
}
function makeVariable(pattern) {
    const data = /((\w+) )?(\w+)(\.(\w+))?(%[\+\.\-\d]*[dsf])?/.exec(pattern) || [];
    const helper = data[2];
    const base = data[3];
    const field = data[5];
    const format = data[6];
    let result = baseValue(base);
    if (field && field.length) {
        result = fieldValue(field, result);
    }
    if (helper && helper.length) {
        result = helperValue(helper, result);
    }
    if (format && format.length) {
        if (format.endsWith("s")) {
            result = stringFormat(format, result);
        }
        else if (format.endsWith("d")) {
            result = intFormat(format, result);
        }
        else {
            result = floatFormat(format, result);
        }
    }
    return result;
}

function eachChar(text, fn, fg, bg) {
    if (text === null || text === undefined)
        return;
    if (!fn)
        return;
    text = "" + text; // force string
    if (!text.length)
        return;
    const colors = [];
    const colorFn = helpers.eachColor;
    if (fg === undefined)
        fg = options.defaultFg;
    if (bg === undefined)
        bg = options.defaultBg;
    const ctx = {
        fg,
        bg,
    };
    const CS = options.colorStart;
    const CE = options.colorEnd;
    colorFn(ctx);
    let n = 0;
    for (let i = 0; i < text.length; ++i) {
        const ch = text[i];
        if (ch == CS) {
            let j = i + 1;
            while (j < text.length && text[j] != CS) {
                ++j;
            }
            if (j == text.length) {
                console.warn(`Reached end of string while seeking end of color start section.\n- text: ${text}\n- start @: ${i}`);
                return; // reached end - done (error though)
            }
            if (j == i + 1) {
                // next char
                ++i; // fall through
            }
            else {
                colors.push([ctx.fg, ctx.bg]);
                const color = text.substring(i + 1, j);
                const newColors = color.split("|");
                ctx.fg = newColors[0] || ctx.fg;
                ctx.bg = newColors[1] || ctx.bg;
                colorFn(ctx);
                i = j;
                continue;
            }
        }
        else if (ch == CE) {
            if (text[i + 1] == CE) {
                ++i;
            }
            else {
                const c = colors.pop(); // if you pop too many times colors still revert to what you passed in
                [ctx.fg, ctx.bg] = c || [fg, bg];
                // colorFn(ctx);
                continue;
            }
        }
        fn(ch, ctx.fg, ctx.bg, n, i);
        ++n;
    }
}

function length(text) {
    if (!text || text.length == 0)
        return 0;
    let len = 0;
    const CS = options.colorStart;
    const CE = options.colorEnd;
    for (let i = 0; i < text.length; ++i) {
        const ch = text[i];
        if (ch == CS) {
            const end = text.indexOf(CS, i + 1);
            i = end;
        }
        else if (ch == CE) ;
        else {
            ++len;
        }
    }
    return len;
}
function advanceChars(text, start, count) {
    const CS = options.colorStart;
    const CE = options.colorEnd;
    let i = start;
    while (count > 0) {
        const ch = text[i];
        if (ch === CS) {
            ++i;
            if (text[i] === CS) {
                --count;
            }
            else {
                while (text[i] !== CS)
                    ++i;
            }
            ++i;
        }
        else if (ch === CE) {
            if (text[i + 1] === CE) {
                --count;
                ++i;
            }
            ++i;
        }
        else {
            --count;
            ++i;
        }
    }
    return i;
}
function firstChar(text) {
    const CS = options.colorStart;
    const CE = options.colorEnd;
    let i = 0;
    while (i < text.length) {
        const ch = text[i];
        if (ch === CS) {
            if (text[i + 1] === CS)
                return CS;
            ++i;
            while (text[i] !== CS)
                ++i;
            ++i;
        }
        else if (ch === CE) {
            if (text[i + 1] === CE)
                return CE;
            ++i;
        }
        else {
            return ch;
        }
    }
    return null;
}
function padStart(text, width, pad = ' ') {
    const colorLen = text.length - length(text);
    return text.padStart(width + colorLen, pad);
}
function padEnd(text, width, pad = ' ') {
    const colorLen = text.length - length(text);
    return text.padEnd(width + colorLen, pad);
}
function center(text, width, pad = ' ') {
    const rawLen = text.length;
    const len = length(text);
    const padLen = width - len;
    if (padLen <= 0)
        return text;
    const left = Math.floor(padLen / 2);
    return text.padStart(rawLen + left, pad).padEnd(rawLen + padLen, pad);
}
function capitalize(text) {
    const CS = options.colorStart;
    const CE = options.colorEnd;
    let i = 0;
    while (i < text.length) {
        const ch = text[i];
        if (ch == CS) {
            ++i;
            while (text[i] != CS && i < text.length) {
                ++i;
            }
            ++i;
        }
        else if (ch == CE) {
            ++i;
            while (text[i] == CE && i < text.length) {
                ++i;
            }
        }
        else if (/[A-Za-z]/.test(ch)) {
            return text.substring(0, i) + ch.toUpperCase() + text.substring(i + 1);
        }
        else {
            ++i;
        }
    }
    return text;
}
function removeColors(text) {
    const CS = options.colorStart;
    const CE = options.colorEnd;
    let out = '';
    let start = 0;
    for (let i = 0; i < text.length; ++i) {
        const k = text[i];
        if (k === CS) {
            if (text[i + 1] == CS) {
                ++i;
                continue;
            }
            out += text.substring(start, i);
            ++i;
            while (text[i] != CS && i < text.length) {
                ++i;
            }
            start = i + 1;
        }
        else if (k === CE) {
            if (text[i + 1] == CE) {
                ++i;
                continue;
            }
            out += text.substring(start, i);
            start = i + 1;
        }
    }
    if (start == 0)
        return text;
    out += text.substring(start);
    return out;
}

function nextBreak(text, start) {
    const CS = options.colorStart;
    const CE = options.colorEnd;
    let i = start;
    let l = 0;
    let count = true;
    while (i < text.length) {
        const ch = text[i];
        if (ch == " ") {
            while (text[i + 1] == " ") {
                ++i;
                ++l; // need to count the extra spaces as part of the word
            }
            return [i, l];
        }
        if (ch == "-") {
            return [i, l];
        }
        if (ch == "\n") {
            return [i, l];
        }
        if (ch == CS) {
            if (text[i + 1] == CS && count) {
                l += 1;
                i += 2;
                continue;
            }
            count = !count;
            ++i;
            continue;
        }
        else if (ch == CE) {
            if (text[i + 1] == CE) {
                l += 1;
                ++i;
            }
            i++;
            continue;
        }
        l += count ? 1 : 0;
        ++i;
    }
    return [i, l];
}
function splice(text, start, len, add = "") {
    return text.substring(0, start) + add + text.substring(start + len);
}
function hyphenate(text, width, start, end, wordWidth, spaceLeftOnLine) {
    // do not need to hyphenate
    if (spaceLeftOnLine >= wordWidth)
        return [text, end];
    // do not have a strategy for this right now...
    if (wordWidth + 1 > width * 2) {
        throw new Error("Cannot hyphenate - word length > 2 * width");
    }
    // not much room left and word fits on next line
    if (spaceLeftOnLine < 4 && wordWidth <= width) {
        text = splice(text, start - 1, 1, "\n");
        return [text, end + 1];
    }
    // will not fit on this line + next, but will fit on next 2 lines...
    // so end this line and reset for placing on next 2 lines.
    if (spaceLeftOnLine + width <= wordWidth) {
        text = splice(text, start - 1, 1, "\n");
        spaceLeftOnLine = width;
    }
    // one hyphen will work...
    // if (spaceLeftOnLine + width > wordWidth) {
    const hyphenAt = Math.min(Math.floor(wordWidth / 2), spaceLeftOnLine - 1);
    const w = advanceChars(text, start, hyphenAt);
    text = splice(text, w, 0, "-\n");
    return [text, end + 2];
    // }
    // if (width >= wordWidth) {
    //     return [text, end];
    // }
    // console.log('hyphenate', { text, start, end, width, wordWidth, spaceLeftOnLine });
    // throw new Error('Did not expect to get here...');
    // wordWidth >= spaceLeftOnLine + width
    // text = splice(text, start - 1, 1, "\n");
    // spaceLeftOnLine = width;
    // const hyphenAt = Math.min(wordWidth, width - 1);
    // const w = Utils.advanceChars(text, start, hyphenAt);
    // text = splice(text, w, 0, "-\n");
    // return [text, end + 2];
}
function wordWrap(text, width, indent = 0) {
    if (!width)
        throw new Error("Need string and width");
    if (text.length < width)
        return text;
    if (length(text) < width)
        return text;
    if (text.indexOf("\n") == -1) {
        return wrapLine(text, width, indent);
    }
    const lines = text.split("\n");
    const split = lines.map((line, i) => wrapLine(line, width, i ? indent : 0));
    return split.join("\n");
}
// Returns the number of lines, including the newlines already in the text.
// Puts the output in "to" only if we receive a "to" -- can make it null and just get a line count.
function wrapLine(text, width, indent) {
    if (text.length < width)
        return text;
    if (length(text) < width)
        return text;
    let spaceLeftOnLine = width;
    width = width - indent;
    let printString = text;
    // Now go through and replace spaces with newlines as needed.
    // console.log('wordWrap - ', text, width, indent);
    let removeSpace = true;
    let i = -1;
    while (i < printString.length) {
        // wordWidth counts the word width of the next word without color escapes.
        // w indicates the position of the space or newline or null terminator that terminates the word.
        let [w, wordWidth] = nextBreak(printString, i + (removeSpace ? 1 : 0));
        let hyphen = false;
        if (printString[w] == "-") {
            w++;
            wordWidth++;
            hyphen = true;
        }
        // console.log('- w=%d, width=%d, space=%d, word=%s', w, wordWidth, spaceLeftOnLine, printString.substring(i, w));
        if (wordWidth > width) {
            [printString, w] = hyphenate(printString, width, i + 1, w, wordWidth, spaceLeftOnLine);
        }
        else if (wordWidth == spaceLeftOnLine) {
            const nl = w < printString.length ? "\n" : "";
            const remove = hyphen ? 0 : 1;
            printString = splice(printString, w, remove, nl); // [i] = '\n';
            w += 1 - remove; // if we change the length we need to advance our pointer
            spaceLeftOnLine = width;
        }
        else if (wordWidth > spaceLeftOnLine) {
            const remove = removeSpace ? 1 : 0;
            printString = splice(printString, i, remove, "\n"); // [i] = '\n';
            w += 1 - remove; // if we change the length we need to advance our pointer
            const extra = hyphen ? 0 : 1;
            spaceLeftOnLine = width - wordWidth - extra; // line width minus the width of the word we just wrapped and the space
            //printf("\n\n%s", printString);
        }
        else {
            const extra = hyphen ? 0 : 1;
            spaceLeftOnLine -= wordWidth + extra;
        }
        removeSpace = !hyphen;
        i = w; // Advance to the terminator that follows the word.
    }
    return printString;
}
// Returns the number of lines, including the newlines already in the text.
// Puts the output in "to" only if we receive a "to" -- can make it null and just get a line count.
function splitIntoLines(source, width, indent = 0) {
    const CS = options.colorStart;
    const output = [];
    let text = wordWrap(source, width, indent);
    let start = 0;
    let fg0 = null;
    let bg0 = null;
    eachChar(text, (ch, fg, bg, _, n) => {
        if (ch == "\n") {
            let color = fg0 || bg0 ? `${CS}${fg0 ? fg0 : ""}${bg0 ? "|" + bg0 : ""}${CS}` : "";
            output.push(color + text.substring(start, n));
            start = n + 1;
            fg0 = fg;
            bg0 = bg;
        }
    });
    let color = fg0 || bg0 ? `${CS}${fg0 ? fg0 : ""}${bg0 ? "|" + bg0 : ""}${CS}` : "";
    output.push(color + text.substring(start));
    return output;
}

function configure$1(opts = {}) {
    if (opts.fg !== undefined) {
        options.defaultFg = opts.fg;
    }
    if (opts.bg !== undefined) {
        options.defaultBg = opts.bg;
    }
    if (opts.colorStart) {
        options.colorStart = opts.colorStart;
    }
    if (opts.colorEnd) {
        options.colorEnd = opts.colorEnd;
    }
    if (opts.field) {
        options.field = opts.field;
    }
}

var index$9 = {
    __proto__: null,
    compile: compile,
    apply: apply,
    eachChar: eachChar,
    length: length,
    padStart: padStart,
    padEnd: padEnd,
    center: center,
    firstChar: firstChar,
    capitalize: capitalize,
    removeColors: removeColors,
    wordWrap: wordWrap,
    splitIntoLines: splitIntoLines,
    configure: configure$1,
    addHelper: addHelper,
    options: options
};

class DataBuffer {
    constructor(width, height) {
        this._width = width;
        this._height = height;
        this._data = new Uint32Array(width * height);
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    resize(width, height) {
        const orig = this._data;
        this._width = width;
        this._height = height;
        if (orig.length < width * height) {
            this._data = new Uint32Array(width * height);
            this._data.set(orig, 0);
        }
        else {
            this._data = orig.slice(width * height);
        }
    }
    get(x, y) {
        let index = y * this.width + x;
        const style = this._data[index] || 0;
        const glyph = style >> 24;
        const bg = (style >> 12) & 0xfff;
        const fg = style & 0xfff;
        return { glyph, fg, bg };
    }
    toGlyph(ch) {
        if (typeof ch === 'number')
            return ch;
        if (!ch || !ch.length)
            return -1; // 0 handled elsewhere
        return ch.charCodeAt(0);
    }
    draw(x, y, glyph = -1, fg = -1, // TODO - White?
    bg = -1 // TODO - Black?
    ) {
        let index = y * this.width + x;
        const current = this._data[index] || 0;
        if (typeof glyph !== 'number') {
            glyph = this.toGlyph(glyph);
        }
        if (typeof fg !== 'number') {
            fg = from$4(fg).toInt();
        }
        if (typeof bg !== 'number') {
            bg = from$4(bg).toInt();
        }
        glyph = glyph >= 0 ? glyph & 0xff : current >> 24;
        bg = bg >= 0 ? bg & 0xfff : (current >> 12) & 0xfff;
        fg = fg >= 0 ? fg & 0xfff : current & 0xfff;
        const style = (glyph << 24) + (bg << 12) + fg;
        this._data[index] = style;
        return this;
    }
    // This is without opacity - opacity must be done in Mixer
    drawSprite(x, y, sprite) {
        const ch = sprite.ch === null ? -1 : sprite.ch;
        const fg = sprite.fg === null ? -1 : sprite.fg;
        const bg = sprite.bg === null ? -1 : sprite.bg;
        return this.draw(x, y, ch, fg, bg);
    }
    blackOut(...args) {
        if (args.length == 0) {
            return this.fill(0, 0, 0);
        }
        return this.draw(args[0], args[1], 0, 0, 0);
    }
    fill(glyph = 0, fg = 0xfff, bg = 0) {
        if (typeof glyph == 'string') {
            glyph = this.toGlyph(glyph);
        }
        glyph = glyph & 0xff;
        fg = fg & 0xfff;
        bg = bg & 0xfff;
        const style = (glyph << 24) + (bg << 12) + fg;
        this._data.fill(style);
        return this;
    }
    copy(other) {
        this._data.set(other._data);
        return this;
    }
    drawText(x, y, text, fg = 0xfff, bg = -1) {
        if (typeof fg !== 'number')
            fg = from$4(fg);
        if (typeof bg !== 'number')
            bg = from$4(bg);
        eachChar(text, (ch, fg0, bg0, i) => {
            if (x + i >= this.width)
                return;
            this.draw(i + x, y, ch, fg0, bg0);
        }, fg, bg);
        return ++y;
    }
    wrapText(x, y, width, text, fg = 0xfff, bg = -1, indent = 0) {
        if (typeof fg !== 'number')
            fg = from$4(fg);
        if (typeof bg !== 'number')
            bg = from$4(bg);
        width = Math.min(width, this.width - x);
        text = wordWrap(text, width, indent);
        let xi = x;
        eachChar(text, (ch, fg0, bg0) => {
            if (ch == '\n') {
                while (xi < x + width) {
                    this.draw(xi++, y, 0, 0x000, bg0);
                }
                ++y;
                xi = x + indent;
                return;
            }
            this.draw(xi++, y, ch, fg0, bg0);
        }, fg, bg);
        while (xi < x + width) {
            this.draw(xi++, y, 0, 0x000, bg);
        }
        return ++y;
    }
    fillRect(x, y, w, h, ch = -1, fg = -1, bg = -1) {
        if (ch === null)
            ch = -1;
        if (typeof ch !== 'number')
            ch = this.toGlyph(ch);
        if (typeof fg !== 'number')
            fg = from$4(fg).toInt();
        if (typeof bg !== 'number')
            bg = from$4(bg).toInt();
        for (let i = x; i < x + w; ++i) {
            for (let j = y; j < y + h; ++j) {
                this.draw(i, j, ch, fg, bg);
            }
        }
        return this;
    }
    blackOutRect(x, y, w, h, bg = 0) {
        if (typeof bg !== 'number')
            bg = from$4(bg);
        return this.fillRect(x, y, w, h, 0, 0, bg);
    }
    highlight(x, y, color, strength) {
        if (typeof color !== 'number') {
            color = from$4(color);
        }
        const mixer = new Mixer();
        const data = this.get(x, y);
        mixer.drawSprite(data);
        mixer.fg.add(color, strength);
        mixer.bg.add(color, strength);
        this.drawSprite(x, y, mixer);
        return this;
    }
    mix(color, percent) {
        if (typeof color !== 'number')
            color = from$4(color);
        const mixer = new Mixer();
        for (let x = 0; x < this.width; ++x) {
            for (let y = 0; y < this.height; ++y) {
                const data = this.get(x, y);
                mixer.drawSprite(data);
                mixer.fg.mix(color, percent);
                mixer.bg.mix(color, percent);
                this.drawSprite(x, y, mixer);
            }
        }
        return this;
    }
    dump() {
        const data = [];
        let header = '    ';
        for (let x = 0; x < this.width; ++x) {
            if (x % 10 == 0)
                header += ' ';
            header += x % 10;
        }
        data.push(header);
        data.push('');
        for (let y = 0; y < this.height; ++y) {
            let line = `${('' + y).padStart(2)}] `;
            for (let x = 0; x < this.width; ++x) {
                if (x % 10 == 0)
                    line += ' ';
                const data = this.get(x, y);
                const glyph = data.glyph;
                line += String.fromCharCode(glyph || 32);
            }
            data.push(line);
        }
        console.log(data.join('\n'));
    }
}
function makeDataBuffer(width, height) {
    return new DataBuffer(width, height);
}
class Buffer extends DataBuffer {
    constructor(canvas) {
        super(canvas.width, canvas.height);
        this._target = canvas;
        canvas.copyTo(this._data);
    }
    // get canvas() { return this._target; }
    toGlyph(ch) {
        return this._target.toGlyph(ch);
    }
    render() {
        this._target.copy(this._data);
        return this;
    }
    load() {
        this._target.copyTo(this._data);
        return this;
    }
}
function makeBuffer(...args) {
    if (args.length == 1) {
        return new Buffer(args[0]);
    }
    return new DataBuffer(args[0], args[1]);
}

const VERTICES_PER_TILE = 6;
class NotSupportedError extends Error {
    constructor(...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        // @ts-ignore
        if (Error.captureStackTrace) {
            // @ts-ignore
            Error.captureStackTrace(this, NotSupportedError);
        }
        this.name = 'NotSupportedError';
    }
}
class BaseCanvas {
    constructor(width, height, glyphs) {
        this.mouse = { x: -1, y: -1 };
        this._renderRequested = false;
        this._width = 50;
        this._height = 25;
        this._node = this._createNode();
        this._createContext();
        this._configure(width, height, glyphs);
        this._buffer = new Buffer(this);
    }
    get node() {
        return this._node;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get tileWidth() {
        return this._glyphs.tileWidth;
    }
    get tileHeight() {
        return this._glyphs.tileHeight;
    }
    get pxWidth() {
        return this.node.clientWidth;
    }
    get pxHeight() {
        return this.node.clientHeight;
    }
    get glyphs() {
        return this._glyphs;
    }
    set glyphs(glyphs) {
        this._setGlyphs(glyphs);
    }
    toGlyph(ch) {
        if (typeof ch === 'number')
            return ch;
        return this._glyphs.forChar(ch);
    }
    get buffer() {
        return this._buffer;
    }
    _createNode() {
        return document.createElement('canvas');
    }
    _configure(width, height, glyphs) {
        this._width = width;
        this._height = height;
        this._setGlyphs(glyphs);
    }
    _setGlyphs(glyphs) {
        if (glyphs === this._glyphs)
            return false;
        this._glyphs = glyphs;
        this.resize(this._width, this._height);
        return true;
    }
    resize(width, height) {
        this._width = width;
        this._height = height;
        if (this._buffer) {
            this._buffer.resize(width, height);
        }
        const node = this.node;
        node.width = this._width * this.tileWidth;
        node.height = this._height * this.tileHeight;
    }
    // draw(x: number, y: number, glyph: number, fg: number, bg: number) {
    //     glyph = glyph & 0xff;
    //     bg = bg & 0xfff;
    //     fg = fg & 0xfff;
    //     const style = glyph * (1 << 24) + bg * (1 << 12) + fg;
    //     this._set(x, y, style);
    //     return this;
    // }
    // fill(bg: number): this;
    // fill(glyph: number, fg: number, bg: number): this;
    // fill(...args: number[]): this {
    //     let g = 0,
    //         fg = 0,
    //         bg = 0;
    //     if (args.length == 1) {
    //         bg = args[0];
    //     } else if (args.length == 3) {
    //         [g, fg, bg] = args;
    //     }
    //     for (let x = 0; x < this._width; ++x) {
    //         for (let y = 0; y < this._height; ++y) {
    //             this.draw(x, y, g, fg, bg);
    //         }
    //     }
    //     return this;
    // }
    _requestRender() {
        if (this._renderRequested)
            return;
        this._renderRequested = true;
        requestAnimationFrame(() => this._render());
    }
    // protected _set(x: number, y: number, style: number) {
    //     let index = y * this.width + x;
    //     const current = this._data[index];
    //     if (current !== style) {
    //         this._data[index] = style;
    //         this._requestRender();
    //         return true;
    //     }
    //     return false;
    // }
    copy(data) {
        this._data.set(data);
        this._requestRender();
    }
    copyTo(data) {
        data.set(this._data);
    }
    render() {
        this.buffer.render();
    }
    hasXY(x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }
    set onclick(fn) {
        if (fn) {
            this.node.onclick = (e) => {
                const x = this._toX(e.offsetX);
                const y = this._toY(e.offsetY);
                const ev = makeMouseEvent(e, x, y);
                fn(ev);
            };
        }
        else {
            this.node.onclick = null;
        }
    }
    set onmousemove(fn) {
        if (fn) {
            this.node.onmousemove = (e) => {
                const x = this._toX(e.offsetX);
                const y = this._toY(e.offsetY);
                if (x == this.mouse.x && y == this.mouse.y)
                    return;
                this.mouse.x = x;
                this.mouse.y = y;
                const ev = makeMouseEvent(e, x, y);
                fn(ev);
            };
        }
        else {
            this.node.onmousemove = null;
        }
    }
    set onmouseup(fn) {
        if (fn) {
            this.node.onmouseup = (e) => {
                const x = this._toX(e.offsetX);
                const y = this._toY(e.offsetY);
                const ev = makeMouseEvent(e, x, y);
                fn(ev);
            };
        }
        else {
            this.node.onmouseup = null;
        }
    }
    _toX(offsetX) {
        return clamp(Math.floor(this.width * (offsetX / this.node.clientWidth)), 0, this.width - 1);
    }
    _toY(offsetY) {
        return clamp(Math.floor(this.height * (offsetY / this.node.clientHeight)), 0, this.height - 1);
    }
}
// Based on: https://github.com/ondras/fastiles/blob/master/ts/scene.ts (v2.1.0)
class Canvas extends BaseCanvas {
    constructor(width, height, glyphs) {
        super(width, height, glyphs);
    }
    _createContext() {
        let gl = this.node.getContext('webgl2');
        if (!gl) {
            throw new NotSupportedError('WebGL 2 not supported');
        }
        this._gl = gl;
        this._buffers = {};
        this._attribs = {};
        this._uniforms = {};
        const p = createProgram(gl, VS, FS);
        gl.useProgram(p);
        const attributeCount = gl.getProgramParameter(p, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < attributeCount; i++) {
            gl.enableVertexAttribArray(i);
            let info = gl.getActiveAttrib(p, i);
            this._attribs[info.name] = i;
        }
        const uniformCount = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            let info = gl.getActiveUniform(p, i);
            this._uniforms[info.name] = gl.getUniformLocation(p, info.name);
        }
        gl.uniform1i(this._uniforms['font'], 0);
        this._texture = createTexture(gl);
    }
    _createGeometry() {
        const gl = this._gl;
        this._buffers.position && gl.deleteBuffer(this._buffers.position);
        this._buffers.uv && gl.deleteBuffer(this._buffers.uv);
        let buffers = createGeometry(gl, this._attribs, this.width, this.height);
        Object.assign(this._buffers, buffers);
    }
    _createData() {
        const gl = this._gl;
        const attribs = this._attribs;
        const tileCount = this.width * this.height;
        this._buffers.style && gl.deleteBuffer(this._buffers.style);
        this._data = new Uint32Array(tileCount * VERTICES_PER_TILE);
        const style = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, style);
        gl.vertexAttribIPointer(attribs['style'], 1, gl.UNSIGNED_INT, 0, 0);
        Object.assign(this._buffers, { style });
    }
    _setGlyphs(glyphs) {
        if (!super._setGlyphs(glyphs))
            return false;
        const gl = this._gl;
        const uniforms = this._uniforms;
        gl.uniform2uiv(uniforms['tileSize'], [this.tileWidth, this.tileHeight]);
        this._uploadGlyphs();
        return true;
    }
    _uploadGlyphs() {
        if (!this._glyphs.needsUpdate)
            return;
        const gl = this._gl;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._glyphs.node);
        this._requestRender();
        this._glyphs.needsUpdate = false;
    }
    resize(width, height) {
        super.resize(width, height);
        const gl = this._gl;
        const uniforms = this._uniforms;
        gl.viewport(0, 0, this.node.width, this.node.height);
        gl.uniform2ui(uniforms['viewportSize'], this.node.width, this.node.height);
        this._createGeometry();
        this._createData();
    }
    // protected _set(x: number, y: number, style: number) {
    //     let index = y * this.width + x;
    //     index *= VERTICES_PER_TILE;
    //     const current = this._data[index + 2];
    //     if (current !== style) {
    //         this._data[index + 2] = style;
    //         this._data[index + 5] = style;
    //         this._requestRender();
    //         return true;
    //     }
    //     return false;
    // }
    copy(data) {
        data.forEach((style, i) => {
            const index = i * VERTICES_PER_TILE;
            this._data[index + 2] = style;
            this._data[index + 5] = style;
        });
        this._requestRender();
    }
    copyTo(data) {
        const n = this.width * this.height;
        for (let i = 0; i < n; ++i) {
            const index = i * VERTICES_PER_TILE;
            data[i] = this._data[index + 2];
        }
    }
    _render() {
        const gl = this._gl;
        if (this._glyphs.needsUpdate) {
            // auto keep glyphs up to date
            this._uploadGlyphs();
        }
        else if (!this._renderRequested) {
            return;
        }
        this._renderRequested = false;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.style);
        gl.bufferData(gl.ARRAY_BUFFER, this._data, gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, this._width * this._height * VERTICES_PER_TILE);
    }
}
class Canvas2D extends BaseCanvas {
    constructor(width, height, glyphs) {
        super(width, height, glyphs);
    }
    _createContext() {
        const ctx = this.node.getContext('2d');
        if (!ctx) {
            throw new NotSupportedError('2d context not supported!');
        }
        this._ctx = ctx;
    }
    // protected _set(x: number, y: number, style: number) {
    //     const result = super._set(x, y, style);
    //     if (result) {
    //         this._changed[y * this.width + x] = 1;
    //     }
    //     return result;
    // }
    resize(width, height) {
        super.resize(width, height);
        this._data = new Uint32Array(width * height);
        this._changed = new Int8Array(width * height);
    }
    copy(data) {
        for (let i = 0; i < this._data.length; ++i) {
            if (this._data[i] !== data[i]) {
                this._data[i] = data[i];
                this._changed[i] = 1;
            }
        }
        this._requestRender();
    }
    _render() {
        this._renderRequested = false;
        for (let i = 0; i < this._changed.length; ++i) {
            if (this._changed[i])
                this._renderCell(i);
            this._changed[i] = 0;
        }
    }
    _renderCell(index) {
        const x = index % this.width;
        const y = Math.floor(index / this.width);
        const style = this._data[index];
        const glyph = (style / (1 << 24)) >> 0;
        const bg = (style >> 12) & 0xfff;
        const fg = style & 0xfff;
        const px = x * this.tileWidth;
        const py = y * this.tileHeight;
        const gx = (glyph % 16) * this.tileWidth;
        const gy = Math.floor(glyph / 16) * this.tileHeight;
        const d = this.glyphs.ctx.getImageData(gx, gy, this.tileWidth, this.tileHeight);
        for (let di = 0; di < d.width * d.height; ++di) {
            const pct = d.data[di * 4] / 255;
            const inv = 1.0 - pct;
            d.data[di * 4 + 0] =
                pct * (((fg & 0xf00) >> 8) * 17) +
                    inv * (((bg & 0xf00) >> 8) * 17);
            d.data[di * 4 + 1] =
                pct * (((fg & 0xf0) >> 4) * 17) +
                    inv * (((bg & 0xf0) >> 4) * 17);
            d.data[di * 4 + 2] =
                pct * ((fg & 0xf) * 17) + inv * ((bg & 0xf) * 17);
            d.data[di * 4 + 3] = 255; // not transparent anymore
        }
        this._ctx.putImageData(d, px, py);
    }
}
function make$6(...args) {
    let width = args[0];
    let height = args[1];
    let opts = args[2];
    if (args.length == 1) {
        opts = args[0];
        height = opts.height || 34;
        width = opts.width || 80;
    }
    opts = opts || { font: 'monospace' };
    let glyphs;
    if (opts.image) {
        glyphs = Glyphs.fromImage(opts.image);
    }
    else {
        glyphs = Glyphs.fromFont(opts);
    }
    let canvas;
    try {
        canvas = new Canvas(width, height, glyphs);
    }
    catch (e) {
        if (!(e instanceof NotSupportedError))
            throw e;
    }
    if (!canvas) {
        canvas = new Canvas2D(width, height, glyphs);
    }
    if (opts.div) {
        let el;
        if (typeof opts.div === 'string') {
            el = document.getElementById(opts.div);
            if (!el) {
                console.warn('Failed to find parent element by ID: ' + opts.div);
            }
        }
        else {
            el = opts.div;
        }
        if (el && el.appendChild) {
            el.appendChild(canvas.node);
        }
    }
    if (opts.io || opts.loop) {
        let loop$1 = opts.loop || loop;
        canvas.onclick = (e) => loop$1.pushEvent(e);
        canvas.onmousemove = (e) => loop$1.pushEvent(e);
        canvas.onmouseup = (e) => loop$1.pushEvent(e);
    }
    return canvas;
}
// export function withImage(image: ImageOptions | HTMLImageElement | string) {
//     let opts = {} as CanvasOptions;
//     if (typeof image === 'string') {
//         opts.glyphs = Glyphs.fromImage(image);
//     } else if (image instanceof HTMLImageElement) {
//         opts.glyphs = Glyphs.fromImage(image);
//     } else {
//         if (!image.image) throw new Error('You must supply the image.');
//         Object.assign(opts, image);
//         opts.glyphs = Glyphs.fromImage(image.image);
//     }
//     let canvas;
//     try {
//         canvas = new Canvas(opts);
//     } catch (e) {
//         if (!(e instanceof NotSupportedError)) throw e;
//     }
//     if (!canvas) {
//         canvas = new Canvas2D(opts);
//     }
//     return canvas;
// }
// export function withFont(src: FontOptions | string) {
//     if (typeof src === 'string') {
//         src = { font: src } as FontOptions;
//     }
//     src.glyphs = Glyphs.fromFont(src);
//     let canvas;
//     try {
//         canvas = new Canvas(src);
//     } catch (e) {
//         if (!(e instanceof NotSupportedError)) throw e;
//     }
//     if (!canvas) {
//         canvas = new Canvas2D(src);
//     }
//     return canvas;
// }
// Copy of: https://github.com/ondras/fastiles/blob/master/ts/utils.ts (v2.1.0)
const QUAD = [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1];
function createProgram(gl, ...sources) {
    const p = gl.createProgram();
    [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].forEach((type, index) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, sources[index]);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader));
        }
        gl.attachShader(p, shader);
    });
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(p));
    }
    return p;
}
function createTexture(gl) {
    let t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    return t;
}
function createGeometry(gl, attribs, width, height) {
    let tileCount = width * height;
    let positionData = new Uint16Array(tileCount * QUAD.length);
    let uvData = new Uint8Array(tileCount * QUAD.length);
    let i = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            QUAD.forEach((value) => {
                positionData[i] = (i % 2 ? y : x) + value;
                uvData[i] = value;
                i++;
            });
        }
    }
    const position = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, position);
    gl.vertexAttribIPointer(attribs['position'], 2, gl.UNSIGNED_SHORT, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
    const uv = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uv);
    gl.vertexAttribIPointer(attribs['uv'], 2, gl.UNSIGNED_BYTE, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, uvData, gl.STATIC_DRAW);
    return { position, uv };
}

var index$8 = {
    __proto__: null,
    NotSupportedError: NotSupportedError,
    BaseCanvas: BaseCanvas,
    Canvas: Canvas,
    Canvas2D: Canvas2D,
    make: make$6,
    Glyphs: Glyphs,
    DataBuffer: DataBuffer,
    makeDataBuffer: makeDataBuffer,
    Buffer: Buffer,
    makeBuffer: makeBuffer
};

class Sprite {
    constructor(ch, fg, bg, opacity = 100) {
        if (!ch)
            ch = null;
        this.ch = ch;
        this.fg = from$4(fg);
        this.bg = from$4(bg);
        this.opacity = opacity >= 0 ? opacity : 100;
    }
    clone() {
        return new Sprite(this.ch, this.fg, this.bg, this.opacity);
    }
    toString() {
        // prettier-ignore
        return `{ ch: ${this.ch}, fg: ${this.fg.toString(true)}, bg: ${this.bg.toString(true)}, opacity: ${this.opacity} }`;
    }
}
const sprites = {};
function make$5(...args) {
    let ch = null, fg = -1, bg = -1, opacity;
    if (args.length == 0) {
        return new Sprite(null, -1, -1);
    }
    else if (args.length == 1 && Array.isArray(args[0])) {
        args = args[0];
    }
    if (args.length > 3) {
        opacity = args[3];
        args.pop();
    }
    else if (args.length == 2 &&
        typeof args[1] == 'number' &&
        args[0].length > 1) {
        opacity = args.pop();
    }
    if (args.length > 1) {
        ch = args[0] || null;
        fg = args[1];
        bg = args[2];
    }
    else {
        if (typeof args[0] === 'string' && args[0].length == 1) {
            ch = args[0];
            fg = 'white'; // white is default?
        }
        else if ((typeof args[0] === 'string' && args[0].length > 1) ||
            typeof args[0] === 'number') {
            bg = args[0];
        }
        else if (args[0] instanceof Color) {
            bg = args[0];
        }
        else {
            const sprite = args[0];
            ch = sprite.ch || null;
            fg = sprite.fg || -1;
            bg = sprite.bg || -1;
            opacity = sprite.opacity;
        }
    }
    if (typeof fg === 'string')
        fg = from$4(fg);
    else if (Array.isArray(fg))
        fg = make$7(fg);
    else if (fg === undefined || fg === null)
        fg = -1;
    if (typeof bg === 'string')
        bg = from$4(bg);
    else if (Array.isArray(bg))
        bg = make$7(bg);
    else if (bg === undefined || bg === null)
        bg = -1;
    return new Sprite(ch, fg, bg, opacity);
}
function from$3(...args) {
    if (args.length == 1 && typeof args[0] === 'string') {
        const sprite = sprites[args[0]];
        if (!sprite)
            throw new Error('Failed to find sprite: ' + args[0]);
        return sprite;
    }
    return make$5(args);
}
function install$4(name, ...args) {
    let sprite;
    // @ts-ignore
    sprite = make$5(...args);
    sprite.name = name;
    sprites[name] = sprite;
    return sprite;
}

var index$7 = {
    __proto__: null,
    Sprite: Sprite,
    sprites: sprites,
    make: make$5,
    from: from$3,
    install: install$4,
    Mixer: Mixer,
    makeMixer: makeMixer
};

// export interface ObjectFlags {
//     readonly object: number;
// }
// export interface GameObjectType {
//     readonly sprite: SpriteData;
//     readonly priority: number;
//     readonly depth: number;
//     // readonly light: LightType | null;
//     readonly flags: ObjectFlags;
//     hasObjectFlag(flag: number): boolean;
// }
// export interface TileFlags extends ObjectFlags {
//     readonly tile: number;
//     readonly tileMech: number;
// }
// export interface TileType extends GameObjectType {
//     readonly id: string;
//     readonly flags: TileFlags;
// }
// export interface ActorFlags extends ObjectFlags {
//     actor: number;
// }
// export interface ActorType
//     extends XY,
//         Chainable<GameObjectType>,
//         GameObjectType {
//     isPlayer: () => boolean;
//     isVisible: () => boolean;
//     isDetected: () => boolean;
//     blocksVision: () => boolean; // kind.flags & Flags.ActorKind.AK_BLOCKS_VISION
//     layerFlags: () => number;
//     avoidsCell: (cell: CellType) => boolean;
//     // if (cell.flags & Flags.Cell.HAS_ACTOR) return false;
//     // return !cell.hasTileFlag(forbidTileFlags);
//     forbidsCell: (cell: CellType) => boolean;
//     delete: () => void;
//     rememberedInCell: CellType | null;
//     readonly flags: ActorFlags;
//     next: GameObjectType | null;
// }
// export interface ItemFlags extends ObjectFlags {
//     item: number;
// }
// export interface ItemType
//     extends XY,
//         Chainable<GameObjectType>,
//         GameObjectType {
//     quantity: number;
//     readonly flags: ItemFlags;
//     layerFlags: () => number;
//     blocksMove: () => boolean;
//     avoidsCell: (cell: CellType) => boolean;
//     forbidsCell: (cell: CellType) => boolean;
//     // if (cell.flags & Flags.Cell.HAS_ITEM) return false;
//     // return !cell.hasTileFlag(theItem.kind.forbiddenTileFlags());
//     isDetected: () => boolean; // flags & Flags.Item.ITEM_MAGIC_DETECTED && GW.item.magicChar(theItem)
//     delete: () => void;
//     clone: () => this;
//     next: GameObjectType | null;
// }
// export interface FxType extends XY, Chainable<GameObjectType>, GameObjectType {
//     next: GameObjectType | null;
// }

var types = {
    __proto__: null
};

const data = {};
const config$1 = {};
// export const make: any = {};
// export const flags: any = {};

const templates = {};
config$1.message = config$1.message || {};
function install$3(id, msg) {
    const template = compile(msg);
    templates[id] = template;
}
function installAll$3(config) {
    Object.entries(config).forEach(([id, msg]) => install$3(id, msg));
}
// messages
const ARCHIVE = [];
const CONFIRMED = [];
var ARCHIVE_LINES = 30;
var MSG_WIDTH = 80;
var NEXT_WRITE_INDEX = 0;
var NEEDS_UPDATE = false;
let COMBAT_MESSAGE = null;
function needsUpdate(needs) {
    if (needs) {
        NEEDS_UPDATE = true;
    }
    return NEEDS_UPDATE;
}
function configure(opts) {
    if (!opts)
        opts = {};
    ARCHIVE_LINES = opts.length || 30;
    MSG_WIDTH = opts.width || 80;
    for (let i = 0; i < ARCHIVE_LINES; ++i) {
        ARCHIVE[i] = null;
        CONFIRMED[i] = false;
    }
}
////////////////////////////////////
// Messages
function add(msg, args) {
    const template = templates[msg];
    if (template) {
        msg = template(args);
    }
    else if (args) {
        msg = apply(msg, args);
    }
    commitCombatMessage();
    addMessage(msg);
}
function fromActor(actor, msg, args) {
    if (actor.isPlayer() || actor.isVisible()) {
        add(msg, args);
    }
}
function forPlayer(actor, msg, args) {
    if (!actor.isPlayer())
        return;
    add(msg, args);
}
function addCombat(actor, msg, args) {
    if (actor.isPlayer() || actor.isVisible()) {
        const template = templates[msg];
        if (template) {
            msg = template(args);
        }
        else if (args) {
            msg = apply(msg, args);
        }
        addCombatMessage(msg);
    }
}
// function messageWithoutCaps(msg, requireAcknowledgment) {
function addMessageLine(msg) {
    if (!length(msg)) {
        return;
    }
    // Add the message to the archive.
    ARCHIVE[NEXT_WRITE_INDEX] = msg;
    CONFIRMED[NEXT_WRITE_INDEX] = false;
    NEXT_WRITE_INDEX = (NEXT_WRITE_INDEX + 1) % ARCHIVE_LINES;
}
function addMessage(msg) {
    var _a;
    msg = capitalize(msg);
    // // Implement the American quotation mark/period/comma ordering rule.
    // for (i=0; text.text[i] && text.text[i+1]; i++) {
    //     if (text.charCodeAt(i) === COLOR_ESCAPE) {
    //         i += 4;
    //     } else if (text.text[i] === '"'
    //                && (text.text[i+1] === '.' || text.text[i+1] === ','))
    // 		{
    // 			const replace = text.text[i+1] + '"';
    // 			text.spliceRaw(i, 2, replace);
    //     }
    // }
    const lines = splitIntoLines(msg, MSG_WIDTH);
    if ((_a = config$1.message) === null || _a === void 0 ? void 0 : _a.reverseMultiLine) {
        lines.reverse();
    }
    lines.forEach((l) => addMessageLine(l));
    // display the message:
    NEEDS_UPDATE = true;
    // if (GAME.playbackMode) {
    // 	GAME.playbackDelayThisTurn += GAME.playbackDelayPerTurn * 5;
    // }
}
function addCombatMessage(msg) {
    if (!COMBAT_MESSAGE) {
        COMBAT_MESSAGE = msg;
    }
    else {
        COMBAT_MESSAGE += ', ' + capitalize(msg);
    }
    NEEDS_UPDATE = true;
}
function commitCombatMessage() {
    if (!COMBAT_MESSAGE)
        return false;
    addMessage(COMBAT_MESSAGE + '.');
    COMBAT_MESSAGE = null;
    return true;
}
function confirmAll() {
    for (let i = 0; i < CONFIRMED.length; i++) {
        CONFIRMED[i] = true;
    }
    NEEDS_UPDATE = true;
}
function forEach(fn) {
    commitCombatMessage();
    for (let i = 0; i < ARCHIVE_LINES; ++i) {
        const n = (ARCHIVE_LINES - i + NEXT_WRITE_INDEX - 1) % ARCHIVE_LINES;
        const msg = ARCHIVE[n];
        if (!msg)
            return;
        if (fn(msg, CONFIRMED[n], i) === false)
            return;
    }
}

var message = {
    __proto__: null,
    templates: templates,
    install: install$3,
    installAll: installAll$3,
    needsUpdate: needsUpdate,
    configure: configure,
    add: add,
    fromActor: fromActor,
    forPlayer: forPlayer,
    addCombat: addCombat,
    confirmAll: confirmAll,
    forEach: forEach
};

///////////////////////////////////////////////////////
// TILE EVENT
var Effect;
(function (Effect) {
    // E_ALWAYS_FIRE = Fl(10), // Fire even if the cell is marked as having fired this turn
    Effect[Effect["E_NEXT_ALWAYS"] = fl(0)] = "E_NEXT_ALWAYS";
    Effect[Effect["E_NEXT_EVERYWHERE"] = fl(1)] = "E_NEXT_EVERYWHERE";
    Effect[Effect["E_FIRED"] = fl(2)] = "E_FIRED";
    Effect[Effect["E_NO_MARK_FIRED"] = fl(3)] = "E_NO_MARK_FIRED";
    // MUST_REPLACE_LAYER
    // NEEDS_EMPTY_LAYER
    Effect[Effect["E_PROTECTED"] = fl(4)] = "E_PROTECTED";
    // E_NO_REDRAW_CELL = Fl(),
    Effect[Effect["E_TREAT_AS_BLOCKING"] = fl(5)] = "E_TREAT_AS_BLOCKING";
    Effect[Effect["E_PERMIT_BLOCKING"] = fl(6)] = "E_PERMIT_BLOCKING";
    Effect[Effect["E_ABORT_IF_BLOCKS_MAP"] = fl(7)] = "E_ABORT_IF_BLOCKS_MAP";
    Effect[Effect["E_BLOCKED_BY_ITEMS"] = fl(8)] = "E_BLOCKED_BY_ITEMS";
    Effect[Effect["E_BLOCKED_BY_ACTORS"] = fl(9)] = "E_BLOCKED_BY_ACTORS";
    Effect[Effect["E_BLOCKED_BY_OTHER_LAYERS"] = fl(10)] = "E_BLOCKED_BY_OTHER_LAYERS";
    Effect[Effect["E_SUPERPRIORITY"] = fl(11)] = "E_SUPERPRIORITY";
    Effect[Effect["E_SPREAD_CIRCLE"] = fl(13)] = "E_SPREAD_CIRCLE";
    Effect[Effect["E_SPREAD_LINE"] = fl(14)] = "E_SPREAD_LINE";
    Effect[Effect["E_EVACUATE_CREATURES"] = fl(15)] = "E_EVACUATE_CREATURES";
    Effect[Effect["E_EVACUATE_ITEMS"] = fl(16)] = "E_EVACUATE_ITEMS";
    Effect[Effect["E_BUILD_IN_WALLS"] = fl(17)] = "E_BUILD_IN_WALLS";
    Effect[Effect["E_MUST_TOUCH_WALLS"] = fl(18)] = "E_MUST_TOUCH_WALLS";
    Effect[Effect["E_NO_TOUCH_WALLS"] = fl(19)] = "E_NO_TOUCH_WALLS";
    Effect[Effect["E_CLEAR_GROUND"] = fl(21)] = "E_CLEAR_GROUND";
    Effect[Effect["E_CLEAR_SURFACE"] = fl(22)] = "E_CLEAR_SURFACE";
    Effect[Effect["E_CLEAR_LIQUID"] = fl(23)] = "E_CLEAR_LIQUID";
    Effect[Effect["E_CLEAR_GAS"] = fl(24)] = "E_CLEAR_GAS";
    Effect[Effect["E_CLEAR_TILE"] = fl(25)] = "E_CLEAR_TILE";
    Effect[Effect["E_CLEAR_CELL"] = Effect.E_CLEAR_GROUND |
        Effect.E_CLEAR_SURFACE |
        Effect.E_CLEAR_LIQUID |
        Effect.E_CLEAR_GAS] = "E_CLEAR_CELL";
    Effect[Effect["E_ONLY_IF_EMPTY"] = Effect.E_BLOCKED_BY_ITEMS | Effect.E_BLOCKED_BY_ACTORS] = "E_ONLY_IF_EMPTY";
    // E_NULLIFY_CELL = E_NULL_SURFACE | E_NULL_LIQUID | E_NULL_GAS,
    // These should be effect types
    Effect[Effect["E_ACTIVATE_DORMANT_MONSTER"] = fl(27)] = "E_ACTIVATE_DORMANT_MONSTER";
    Effect[Effect["E_AGGRAVATES_MONSTERS"] = fl(28)] = "E_AGGRAVATES_MONSTERS";
    Effect[Effect["E_RESURRECT_ALLY"] = fl(29)] = "E_RESURRECT_ALLY";
})(Effect || (Effect = {}));

function make$4(opts) {
    var _a;
    if (!opts)
        throw new Error('opts required to make effect.');
    if (typeof opts === 'string') {
        throw new Error('Cannot make effect from string: ' + opts);
    }
    if (typeof opts === 'function') {
        opts = { fn: opts };
    }
    // now make base effect stuff
    const info = {
        flags: from$5(Effect, opts.flags),
        chance: (_a = opts.chance) !== null && _a !== void 0 ? _a : 0,
        next: null,
        id: opts.id || 'n/a',
    };
    if (opts.next) {
        if (typeof opts.next === 'string') {
            info.next = opts.next;
        }
        else {
            info.next = make$4(opts.next);
        }
    }
    // and all the handlers
    Object.values(effectTypes).forEach((v) => v.make(opts, info));
    return info;
}
function from$2(opts) {
    if (!opts)
        throw new Error('Cannot make effect from null | undefined');
    if (typeof opts === 'string') {
        const effect = effects[opts];
        if (effect)
            return effect;
        throw new Error('Unknown effect - ' + opts);
    }
    return make$4(opts);
}

// resetMessageDisplayed
function reset(effect) {
    effect.flags &= ~Effect.E_FIRED;
}
function resetAll() {
    Object.values(effects).forEach((e) => reset(e));
}
const effects = {};
function install$2(id, config) {
    const effect = make$4(config);
    effects[id] = effect;
    effect.id = id;
    return effect;
}
function installAll$2(effects) {
    Object.entries(effects).forEach(([id, config]) => {
        install$2(id, config);
    });
}
const effectTypes = {};
function installType(id, effectType) {
    effectTypes[id] = effectType;
}

async function fire(effect, map, x, y, ctx_ = {}) {
    if (!effect)
        return false;
    if (typeof effect === 'string') {
        const name = effect;
        effect = from$2(name);
        if (!effect)
            throw new Error('Failed to find effect: ' + name);
    }
    const ctx = ctx_;
    if (!ctx.force && effect.chance && !random.chance(effect.chance, 10000))
        return false;
    const grid$1 = (ctx.grid = alloc(map.width, map.height));
    let didSomething = true;
    const handlers = Object.values(effectTypes);
    for (let h of handlers) {
        if (await h.fire(effect, map, x, y, ctx)) {
            didSomething = true;
        }
    }
    // bookkeeping
    if (didSomething &&
        map.isVisible(x, y) &&
        !(effect.flags & Effect.E_NO_MARK_FIRED)) {
        effect.flags |= Effect.E_FIRED;
    }
    // do the next effect - if applicable
    if (effect.next &&
        (didSomething || effect.flags & Effect.E_NEXT_ALWAYS) &&
        !data.gameHasEnded) {
        const nextInfo = typeof effect.next === 'string' ? from$2(effect.next) : effect.next;
        if (effect.flags & Effect.E_NEXT_EVERYWHERE) {
            await grid$1.forEachAsync(async (v, i, j) => {
                if (!v)
                    return;
                // @ts-ignore
                await fire(nextInfo, map, i, j, ctx);
            });
        }
        else {
            await fire(nextInfo, map, x, y, ctx);
        }
    }
    free(grid$1);
    return didSomething;
}
function fireSync(effect, map, x, y, ctx_ = {}) {
    if (!effect)
        return false;
    if (typeof effect === 'string') {
        const name = effect;
        effect = from$2(name);
        if (!effect)
            throw new Error('Failed to find effect: ' + name);
    }
    const ctx = ctx_;
    if (!ctx.force && effect.chance && !random.chance(effect.chance, 10000))
        return false;
    const grid$1 = (ctx.grid = alloc(map.width, map.height));
    let didSomething = true;
    const handlers = Object.values(effectTypes);
    for (let h of handlers) {
        if (h.fireSync(effect, map, x, y, ctx)) {
            didSomething = true;
        }
    }
    // bookkeeping
    if (didSomething &&
        map.isVisible(x, y) &&
        !(effect.flags & Effect.E_NO_MARK_FIRED)) {
        effect.flags |= Effect.E_FIRED;
    }
    // do the next effect - if applicable
    if (effect.next &&
        (didSomething || effect.flags & Effect.E_NEXT_ALWAYS) &&
        !data.gameHasEnded) {
        const nextInfo = typeof effect.next === 'string' ? from$2(effect.next) : effect.next;
        if (effect.flags & Effect.E_NEXT_EVERYWHERE) {
            grid$1.forEach(async (v, i, j) => {
                if (!v)
                    return;
                fireSync(nextInfo, map, i, j, ctx);
            });
        }
        else {
            fireSync(nextInfo, map, x, y, ctx);
        }
    }
    free(grid$1);
    return didSomething;
}

//////////////////////////////////////////////
// MESSAGE
class MessageEffect {
    make(src, dest) {
        if (!src.message)
            return true;
        if (typeof src.message !== 'string') {
            throw new Error('Emit must be configured with name of event to emit');
        }
        dest.message = src.message;
        return true;
    }
    async fire(config, map, x, y, ctx) {
        if (!config.message)
            return false;
        const fired = config.flags & Effect.E_FIRED ? true : false;
        if (config.message &&
            config.message.length &&
            !fired &&
            map.isVisible(x, y)) {
            add(config.message, ctx);
            return true;
        }
        return false;
    }
    fireSync(config, _map, _x, _y, _ctx) {
        if (!config.message)
            return false;
        throw new Error('Cannot use "message" effects in build steps.');
    }
}
installType('message', new MessageEffect());

//////////////////////////////////////////////
// EMIT
class EmitEffect {
    make(src, dest) {
        if (!src.emit)
            return true;
        if (typeof src.emit !== 'string') {
            throw new Error('emit effects must be string name to emit: { emit: "EVENT" }');
        }
        dest.emit = src.emit;
        return true;
    }
    async fire(config, _map, x, y, ctx) {
        if (config.emit) {
            return await emit(config.emit, x, y, ctx);
        }
        return false;
    }
    fireSync(config, _map, _x, _y, _ctx) {
        if (!config.emit)
            return false;
        throw new Error('Cannot use "emit" effects in build steps.');
    }
}
installType('emit', new EmitEffect());

//////////////////////////////////////////////
// FN
class FnEffect {
    make(src, dest) {
        if (!src.fn)
            return true;
        if (typeof src.fn !== 'function') {
            throw new Error('fn effects must be functions.');
        }
        dest.fn = src.fn;
        return true;
    }
    async fire(config, map, x, y, ctx) {
        if (config.fn) {
            return await config.fn(config, map, x, y, ctx);
        }
        return false;
    }
    fireSync(config, map, x, y, ctx) {
        if (config.fn) {
            const result = config.fn(config, map, x, y, ctx);
            if (result === true || result === false) {
                return result;
            }
            throw new Error('Cannot use async function effects in build steps.');
        }
        return false;
    }
}
installType('fn', new FnEffect());

var index$6 = {
    __proto__: null,
    get Flags () { return Effect; },
    reset: reset,
    resetAll: resetAll,
    effects: effects,
    install: install$2,
    installAll: installAll$2,
    effectTypes: effectTypes,
    installType: installType,
    make: make$4,
    from: from$2,
    fire: fire,
    fireSync: fireSync,
    MessageEffect: MessageEffect,
    EmitEffect: EmitEffect
};

class Blob {
    constructor(opts = {}) {
        this.options = {
            rounds: 5,
            minWidth: 10,
            minHeight: 10,
            maxWidth: 40,
            maxHeight: 20,
            percentSeeded: 50,
            birthParameters: 'ffffffttt',
            survivalParameters: 'ffffttttt',
        };
        Object.assign(this.options, opts);
        this.options.birthParameters = this.options.birthParameters.toLowerCase();
        this.options.survivalParameters = this.options.survivalParameters.toLowerCase();
        if (this.options.minWidth >= this.options.maxWidth) {
            this.options.minWidth = Math.round(0.75 * this.options.maxWidth);
            this.options.maxWidth = Math.round(1.25 * this.options.maxWidth);
        }
        if (this.options.minHeight >= this.options.maxHeight) {
            this.options.minHeight = Math.round(0.75 * this.options.maxHeight);
            this.options.maxHeight = Math.round(1.25 * this.options.maxHeight);
        }
    }
    carve(width, height, setFn) {
        let i, j, k;
        let blobNumber, blobSize, topBlobNumber, topBlobSize;
        let bounds = new Bounds(0, 0, 0, 0);
        const dest = alloc(width, height);
        const left = Math.floor((dest.width - this.options.maxWidth) / 2);
        const top = Math.floor((dest.height - this.options.maxHeight) / 2);
        let tries = 10;
        // Generate blobs until they satisfy the minBlobWidth and minBlobHeight restraints
        do {
            // Clear buffer.
            dest.fill(0);
            // Fill relevant portion with noise based on the percentSeeded argument.
            for (i = 0; i < this.options.maxWidth; i++) {
                for (j = 0; j < this.options.maxHeight; j++) {
                    dest[i + left][j + top] = random.chance(this.options.percentSeeded)
                        ? 1
                        : 0;
                }
            }
            // Some iterations of cellular automata
            for (k = 0; k < this.options.rounds; k++) {
                if (!this._cellularAutomataRound(dest)) {
                    k = this.options.rounds; // cellularAutomataRound did not make any changes
                }
            }
            // Now to measure the result. These are best-of variables; start them out at worst-case values.
            topBlobSize = 0;
            topBlobNumber = 0;
            // Fill each blob with its own number, starting with 2 (since 1 means floor), and keeping track of the biggest:
            blobNumber = 2;
            for (i = 0; i < dest.width; i++) {
                for (j = 0; j < dest.height; j++) {
                    if (dest[i][j] == 1) {
                        // an unmarked blob
                        // Mark all the cells and returns the total size:
                        blobSize = dest.floodFill(i, j, 1, blobNumber);
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
            dest.valueBounds(topBlobNumber, bounds);
        } while ((bounds.width < this.options.minWidth ||
            bounds.height < this.options.minHeight ||
            topBlobNumber == 0) &&
            --tries);
        // Replace the winning blob with 1's, and everything else with 0's:
        for (i = 0; i < dest.width; i++) {
            for (j = 0; j < dest.height; j++) {
                if (dest[i][j] == topBlobNumber) {
                    setFn(i, j);
                }
            }
        }
        free(dest);
        // Populate the returned variables.
        return bounds;
    }
    _cellularAutomataRound(grid$1) {
        let i, j, nbCount, newX, newY;
        let dir;
        let buffer2;
        buffer2 = alloc(grid$1.width, grid$1.height);
        buffer2.copy(grid$1); // Make a backup of this in buffer2, so that each generation is isolated.
        let didSomething = false;
        for (i = 0; i < grid$1.width; i++) {
            for (j = 0; j < grid$1.height; j++) {
                nbCount = 0;
                for (dir = 0; dir < DIRS$2.length; dir++) {
                    newX = i + DIRS$2[dir][0];
                    newY = j + DIRS$2[dir][1];
                    if (grid$1.hasXY(newX, newY) && buffer2[newX][newY]) {
                        nbCount++;
                    }
                }
                if (!buffer2[i][j] &&
                    this.options.birthParameters[nbCount] == 't') {
                    grid$1[i][j] = 1; // birth
                    didSomething = true;
                }
                else if (buffer2[i][j] &&
                    this.options.survivalParameters[nbCount] == 't') ;
                else {
                    grid$1[i][j] = 0; // death
                    didSomething = true;
                }
            }
        }
        free(buffer2);
        return didSomething;
    }
}
function fillBlob(grid, opts = {}) {
    const blob = new Blob(opts);
    return blob.carve(grid.width, grid.height, (x, y) => (grid[x][y] = 1));
}
function make$3(opts = {}) {
    return new Blob(opts);
}

var blob = {
    __proto__: null,
    Blob: Blob,
    fillBlob: fillBlob,
    make: make$3
};

// const LIGHT_SMOOTHING_THRESHOLD = 150;       // light components higher than this magnitude will be toned down a little
const config = (config$1.light = {
    INTENSITY_DARK: 20,
    INTENSITY_SHADOW: 50,
}); // less than 20% for highest color in rgb
const LIGHT_COMPONENTS = make$7();
class Light {
    constructor(color, range$1, fadeTo, pass = false) {
        this.fadeTo = 0;
        this.passThroughActors = false;
        this.id = null;
        this.color = from$4(color) || null; /* color */
        this.radius = make$b(range$1 || 1);
        this.fadeTo = fadeTo || 0;
        this.passThroughActors = pass; // generally no, but miner light does (TODO - string parameter?  'false' or 'true')
    }
    copy(other) {
        this.color = other.color;
        this.radius.copy(other.radius);
        this.fadeTo = other.fadeTo;
        this.passThroughActors = other.passThroughActors;
    }
    get intensity() {
        return intensity(this.color);
    }
    // Returns true if any part of the light hit cells that are in the player's field of view.
    paint(map, x, y, maintainShadows = false, isMinersLight = false) {
        if (!map)
            return false;
        let k;
        // let colorComponents = [0,0,0];
        let lightMultiplier = 0;
        let radius = this.radius.value();
        let outerRadius = Math.ceil(radius);
        if (outerRadius < 1)
            return false;
        // calcLightComponents(colorComponents, this);
        LIGHT_COMPONENTS.copy(this.color).bake();
        // console.log('paint', LIGHT_COMPONENTS.toString(true), x, y, outerRadius);
        // the miner's light does not dispel IS_IN_SHADOW,
        // so the player can be in shadow despite casting his own light.
        const dispelShadows = !isMinersLight &&
            !maintainShadows &&
            !isDarkLight(LIGHT_COMPONENTS);
        const fadeToPercent = this.fadeTo;
        const grid$1 = alloc(map.width, map.height, 0);
        map.calcFov(x, y, outerRadius, this.passThroughActors, (i, j) => {
            grid$1[i][j] = 1;
        });
        // let overlappedFieldOfView = false;
        const lightValue = [0, 0, 0];
        grid$1.forCircle(x, y, outerRadius, (v, i, j) => {
            if (!v)
                return;
            // const cell = map.cell(i, j);
            lightMultiplier = Math.floor(100 -
                (100 - fadeToPercent) *
                    (distanceBetween(x, y, i, j) / radius));
            for (k = 0; k < 3; ++k) {
                lightValue[k] = Math.floor((LIGHT_COMPONENTS[k] * lightMultiplier) / 100);
            }
            map.addCellLight(i, j, lightValue, dispelShadows);
            // if (dispelShadows) {
            //     map.clearCellFlag(i, j, CellFlags.IS_IN_SHADOW);
            // }
            // if (map.isVisible(i, j)) {
            //     overlappedFieldOfView = true;
            // }
            // console.log(i, j, lightMultiplier, cell.light);
        });
        // if (dispelShadows) {
        //     map.clearCellFlag(x, y, CellFlags.IS_IN_SHADOW);
        // }
        free(grid$1);
        // return overlappedFieldOfView;
        return true;
    }
}
function intensity(light) {
    return Math.max(light[0], light[1], light[2]);
}
function isDarkLight(light, threshold) {
    var _a;
    threshold = threshold !== null && threshold !== void 0 ? threshold : (_a = config$1.light) === null || _a === void 0 ? void 0 : _a.INTENSITY_DARK;
    return intensity(light) <= (threshold || 20);
}
function isShadowLight(light, threshold) {
    var _a;
    threshold = threshold !== null && threshold !== void 0 ? threshold : (_a = config$1.light) === null || _a === void 0 ? void 0 : _a.INTENSITY_SHADOW;
    return intensity(light) <= (threshold || 20);
}
function make$2(...args) {
    if (args.length == 1) {
        const config = args[0];
        if (typeof config === 'string') {
            const cached = lights[config];
            if (cached)
                return cached;
            const [color, radius, fadeTo, pass] = config
                .split(/[,|]/)
                .map((t) => t.trim());
            return new Light(from$4(color), from$6(radius || 1), Number.parseInt(fadeTo || '0'), !!pass && pass !== 'false');
        }
        else if (Array.isArray(config)) {
            const [color, radius, fadeTo, pass] = config;
            return new Light(color, radius, fadeTo, pass);
        }
        else if (config && config.color) {
            return new Light(from$4(config.color), from$6(config.radius), Number.parseInt(config.fadeTo || '0'), config.pass);
        }
        else {
            throw new Error('Unknown Light config - ' + config);
        }
    }
    else {
        const [color, radius, fadeTo, pass] = args;
        return new Light(color, radius, fadeTo, pass);
    }
}
const lights = {};
function from$1(...args) {
    if (args.length != 1)
        ERROR('Unknown Light config: ' + JSON.stringify(args));
    const arg = args[0];
    if (typeof arg === 'string') {
        const cached = lights[arg];
        if (cached)
            return cached;
    }
    if (arg && arg.paint)
        return arg;
    return make$2(arg);
}
function install$1(id, ...args) {
    let source;
    if (args.length == 1) {
        source = make$2(args[0]);
    }
    else {
        source = make$2(args[0], args[1], args[2], args[3]);
    }
    lights[id] = source;
    if (source)
        source.id = id;
    return source;
}
function installAll$1(config = {}) {
    const entries = Object.entries(config);
    entries.forEach(([name, info]) => {
        install$1(name, info);
    });
}
// // TODO - Move?
// export function playerInDarkness(
//     map: Types.LightSite,
//     PLAYER: Utils.XY,
//     darkColor?: Color.Color
// ) {
//     const cell = map.cell(PLAYER.x, PLAYER.y);
//     return cell.isDark(darkColor);
//     // return (
//     //   cell.light[0] + 10 < darkColor.r &&
//     //   cell.light[1] + 10 < darkColor.g &&
//     //   cell.light[2] + 10 < darkColor.b
//     // );
// }

var LightFlags;
(function (LightFlags) {
    LightFlags[LightFlags["LIT"] = fl(0)] = "LIT";
    LightFlags[LightFlags["IN_SHADOW"] = fl(1)] = "IN_SHADOW";
    LightFlags[LightFlags["DARK"] = fl(2)] = "DARK";
    // MAGIC_DARK = Fl(3),
    LightFlags[LightFlags["CHANGED"] = fl(4)] = "CHANGED";
})(LightFlags || (LightFlags = {}));
class LightSystem {
    constructor(map, opts = {}) {
        this.staticLights = null;
        this.site = map;
        this.ambient = from$4(opts.ambient || 'white').toLight();
        this._changed = false;
        this.glowLightChanged = false;
        this.dynamicLightChanged = false;
        this.light = make$a(map.width, map.height, () => this.ambient.slice());
        this.glowLight = make$a(map.width, map.height, () => this.ambient.slice());
        this.oldLight = make$a(map.width, map.height, () => this.ambient.slice());
        this.flags = make$a(map.width, map.height);
        this.finishLightUpdate();
    }
    getAmbient() {
        return this.ambient;
    }
    setAmbient(light) {
        if (light instanceof Color) {
            light = light.toLight();
        }
        for (let i = 0; i < 3; ++i) {
            this.ambient[i] = light[i];
        }
        this.glowLightChanged = true;
    }
    get anyLightChanged() {
        return this.glowLightChanged || this.dynamicLightChanged;
    }
    get changed() {
        return this._changed;
    }
    getLight(x, y) {
        return this.light[x][y];
    }
    isLit(x, y) {
        return !!(this.flags[x][y] & LightFlags.LIT);
    }
    isDark(x, y) {
        return !!(this.flags[x][y] & LightFlags.DARK);
    }
    isInShadow(x, y) {
        return !!(this.flags[x][y] & LightFlags.IN_SHADOW);
    }
    // isMagicDark(x: number, y: number): boolean {
    //     return !!(this.flags[x][y] & LightFlags.MAGIC_DARK);
    // }
    lightChanged(x, y) {
        return !!(this.flags[x][y] & LightFlags.CHANGED);
    }
    // setMagicDark(x: number, y: number, isDark = true) {
    //     if (isDark) {
    //         this.flags[x][y] |= LightFlags.MAGIC_DARK;
    //     } else {
    //         this.flags[x][y] &= ~LightFlags.MAGIC_DARK;
    //     }
    // }
    get width() {
        return this.site.width;
    }
    get height() {
        return this.site.height;
    }
    addStatic(x, y, light) {
        const info = {
            x,
            y,
            light: from$1(light),
            next: this.staticLights,
        };
        this.staticLights = info;
        this.glowLightChanged = true;
        return info;
    }
    removeStatic(x, y, light) {
        let prev = this.staticLights;
        if (!prev)
            return;
        function matches(info) {
            if (info.x != x || info.y != y)
                return false;
            return !light || light === info.light;
        }
        this.glowLightChanged = true;
        while (prev && matches(prev)) {
            prev = this.staticLights = prev.next;
        }
        if (!prev)
            return;
        let current = prev.next;
        while (current) {
            if (matches(current)) {
                prev.next = current.next;
            }
            else {
                prev = current;
            }
            current = current.next;
        }
    }
    eachStaticLight(fn) {
        eachChain(this.staticLights, (info) => fn(info.x, info.y, info.light));
        this.site.eachGlowLight((x, y, light) => {
            fn(x, y, light);
        });
    }
    eachDynamicLight(fn) {
        this.site.eachDynamicLight(fn);
    }
    update(force = false) {
        this._changed = false;
        if (!force && !this.anyLightChanged)
            return false;
        // Copy Light over oldLight
        this.startLightUpdate();
        if (!this.glowLightChanged) {
            this.restoreGlowLights();
        }
        else {
            // GW.debug.log('painting glow lights.');
            // Paint all glowing tiles.
            this.eachStaticLight((x, y, light) => {
                light.paint(this, x, y);
            });
            this.recordGlowLights();
            this.glowLightChanged = false;
        }
        // Cycle through monsters and paint their lights:
        this.eachDynamicLight((x, y, light) => light.paint(this, x, y)
        // if (monst.mutationIndex >= 0 && mutationCatalog[monst.mutationIndex].light != lights['NO_LIGHT']) {
        //     paint(map, mutationCatalog[monst.mutationIndex].light, actor.x, actor.y, false, false);
        // }
        // if (actor.isBurning()) { // monst.status.burning && !(actor.kind.flags & Flags.Actor.AF_FIERY)) {
        // 	paint(map, lights.BURNING_CREATURE, actor.x, actor.y, false, false);
        // }
        // if (actor.isTelepathicallyRevealed()) {
        // 	paint(map, lights['TELEPATHY_LIGHT'], actor.x, actor.y, false, true);
        // }
        );
        // Also paint telepathy lights for dormant monsters.
        // for (monst of map.dormantMonsters) {
        //     if (monsterTelepathicallyRevealed(monst)) {
        //         paint(map, lights['TELEPATHY_LIGHT'], monst.xLoc, monst.yLoc, false, true);
        //     }
        // }
        this.finishLightUpdate();
        // Miner's light:
        const PLAYER = data.player;
        if (PLAYER) {
            const PLAYERS_LIGHT = lights.PLAYERS_LIGHT;
            if (PLAYERS_LIGHT && PLAYERS_LIGHT.radius) {
                PLAYERS_LIGHT.paint(this, PLAYER.x, PLAYER.y, true, true);
            }
        }
        this.dynamicLightChanged = false;
        this._changed = true;
        // if (PLAYER.status.invisible) {
        //     PLAYER.info.foreColor = playerInvisibleColor;
        // } else if (playerInDarkness()) {
        // 	PLAYER.info.foreColor = playerInDarknessColor;
        // } else if (pmap[PLAYER.xLoc][PLAYER.yLoc].flags & IS_IN_SHADOW) {
        // 	PLAYER.info.foreColor = playerInShadowColor;
        // } else {
        // 	PLAYER.info.foreColor = playerInLightColor;
        // }
        return true;
    }
    startLightUpdate() {
        // record Old Lights
        // and then zero out Light.
        let i = 0;
        const flag = isShadowLight(this.ambient)
            ? LightFlags.IN_SHADOW
            : 0;
        this.light.forEach((val, x, y) => {
            for (i = 0; i < 3; ++i) {
                this.oldLight[x][y][i] = val[i];
                val[i] = this.ambient[i];
            }
            this.flags[x][y] = flag;
        });
    }
    finishLightUpdate() {
        forRect(this.width, this.height, (x, y) => {
            // clear light flags
            // this.flags[x][y] &= ~(LightFlags.LIT | LightFlags.DARK);
            const oldLight = this.oldLight[x][y];
            const light = this.light[x][y];
            if (light.some((v, i) => v !== oldLight[i])) {
                this.flags[x][y] |= LightFlags.CHANGED;
            }
            if (isDarkLight(light)) {
                this.flags[x][y] |= LightFlags.DARK;
            }
            else if (!isShadowLight(light)) {
                this.flags[x][y] |= LightFlags.LIT;
            }
        });
    }
    recordGlowLights() {
        let i = 0;
        this.light.forEach((val, x, y) => {
            const glowLight = this.glowLight[x][y];
            for (i = 0; i < 3; ++i) {
                glowLight[i] = val[i];
            }
        });
    }
    restoreGlowLights() {
        let i = 0;
        this.light.forEach((val, x, y) => {
            const glowLight = this.glowLight[x][y];
            for (i = 0; i < 3; ++i) {
                val[i] = glowLight[i];
            }
        });
    }
    // PaintSite
    calcFov(x, y, radius, passThroughActors, cb) {
        const map = this.site;
        const fov = new FOV({
            isBlocked(x, y) {
                if (!passThroughActors && map.hasActor(x, y))
                    return false;
                return map.blocksVision(x, y);
            },
            hasXY(x, y) {
                return map.hasXY(x, y);
            },
        });
        fov.calculate(x, y, radius, cb);
    }
    addCellLight(x, y, light, dispelShadows) {
        const val = this.light[x][y];
        for (let i = 0; i < 3; ++i) {
            val[i] += light[i];
        }
        if (dispelShadows && !isShadowLight(light)) {
            this.flags[x][y] &= ~LightFlags.IN_SHADOW;
        }
    }
}

var index$5 = {
    __proto__: null,
    config: config,
    Light: Light,
    intensity: intensity,
    isDarkLight: isDarkLight,
    isShadowLight: isShadowLight,
    make: make$2,
    lights: lights,
    from: from$1,
    install: install$1,
    installAll: installAll$1,
    LightSystem: LightSystem
};

var GameObject$1;
(function (GameObject) {
    // L_DYNAMIC = Fl(0), // for movable things like actors or items
    GameObject[GameObject["L_SUPERPRIORITY"] = fl(1)] = "L_SUPERPRIORITY";
    GameObject[GameObject["L_SECRETLY_PASSABLE"] = fl(2)] = "L_SECRETLY_PASSABLE";
    GameObject[GameObject["L_BLOCKS_MOVE"] = fl(3)] = "L_BLOCKS_MOVE";
    GameObject[GameObject["L_BLOCKS_VISION"] = fl(4)] = "L_BLOCKS_VISION";
    GameObject[GameObject["L_BLOCKS_SURFACE"] = fl(6)] = "L_BLOCKS_SURFACE";
    GameObject[GameObject["L_BLOCKS_LIQUID"] = fl(8)] = "L_BLOCKS_LIQUID";
    GameObject[GameObject["L_BLOCKS_GAS"] = fl(7)] = "L_BLOCKS_GAS";
    GameObject[GameObject["L_BLOCKS_ITEMS"] = fl(5)] = "L_BLOCKS_ITEMS";
    GameObject[GameObject["L_BLOCKS_ACTORS"] = fl(11)] = "L_BLOCKS_ACTORS";
    GameObject[GameObject["L_BLOCKS_EFFECTS"] = fl(9)] = "L_BLOCKS_EFFECTS";
    GameObject[GameObject["L_BLOCKS_DIAGONAL"] = fl(10)] = "L_BLOCKS_DIAGONAL";
    GameObject[GameObject["L_INTERRUPT_WHEN_SEEN"] = fl(12)] = "L_INTERRUPT_WHEN_SEEN";
    GameObject[GameObject["L_LIST_IN_SIDEBAR"] = fl(13)] = "L_LIST_IN_SIDEBAR";
    GameObject[GameObject["L_VISUALLY_DISTINCT"] = fl(14)] = "L_VISUALLY_DISTINCT";
    GameObject[GameObject["L_BRIGHT_MEMORY"] = fl(15)] = "L_BRIGHT_MEMORY";
    GameObject[GameObject["L_INVERT_WHEN_HIGHLIGHTED"] = fl(16)] = "L_INVERT_WHEN_HIGHLIGHTED";
    GameObject[GameObject["L_BLOCKED_BY_STAIRS"] = GameObject.L_BLOCKS_ITEMS |
        GameObject.L_BLOCKS_SURFACE |
        GameObject.L_BLOCKS_GAS |
        GameObject.L_BLOCKS_LIQUID |
        GameObject.L_BLOCKS_EFFECTS |
        GameObject.L_BLOCKS_ACTORS] = "L_BLOCKED_BY_STAIRS";
    GameObject[GameObject["L_BLOCKS_SCENT"] = GameObject.L_BLOCKS_MOVE | GameObject.L_BLOCKS_VISION] = "L_BLOCKS_SCENT";
    GameObject[GameObject["L_DIVIDES_LEVEL"] = GameObject.L_BLOCKS_MOVE] = "L_DIVIDES_LEVEL";
    GameObject[GameObject["L_WAYPOINT_BLOCKER"] = GameObject.L_BLOCKS_MOVE] = "L_WAYPOINT_BLOCKER";
    GameObject[GameObject["L_WALL_FLAGS"] = GameObject.L_BLOCKS_MOVE |
        GameObject.L_BLOCKS_VISION |
        GameObject.L_BLOCKS_LIQUID |
        GameObject.L_BLOCKS_GAS |
        GameObject.L_BLOCKS_EFFECTS |
        GameObject.L_BLOCKS_DIAGONAL] = "L_WALL_FLAGS";
    GameObject[GameObject["L_BLOCKS_EVERYTHING"] = GameObject.L_WALL_FLAGS |
        GameObject.L_BLOCKS_ITEMS |
        GameObject.L_BLOCKS_ACTORS |
        GameObject.L_BLOCKS_SURFACE] = "L_BLOCKS_EVERYTHING";
})(GameObject$1 || (GameObject$1 = {}));
var Depth$1;
(function (Depth) {
    Depth[Depth["ALL_LAYERS"] = -1] = "ALL_LAYERS";
    Depth[Depth["GROUND"] = 0] = "GROUND";
    Depth[Depth["SURFACE"] = 1] = "SURFACE";
    Depth[Depth["ITEM"] = 2] = "ITEM";
    Depth[Depth["ACTOR"] = 3] = "ACTOR";
    Depth[Depth["LIQUID"] = 4] = "LIQUID";
    Depth[Depth["GAS"] = 5] = "GAS";
    Depth[Depth["FX"] = 6] = "FX";
    Depth[Depth["UI"] = 7] = "UI";
})(Depth$1 || (Depth$1 = {}));

var flags$3 = {
    __proto__: null,
    get GameObject () { return GameObject$1; },
    get Depth () { return Depth$1; }
};

class GameObject {
    constructor() {
        this.sprite = new Sprite();
        this.depth = 1; // default - TODO - enum/const
        this.light = null;
        this.flags = { object: 0 };
        this.next = null;
        this.x = -1;
        this.y = -1;
    }
    hasObjectFlag(flag) {
        return !!(this.flags.object & flag);
    }
    hasAllObjectFlags(flags) {
        return (this.flags.object & flags) === flags;
    }
    blocksMove() {
        return this.hasObjectFlag(GameObject$1.L_BLOCKS_MOVE);
    }
    blocksVision() {
        return this.hasObjectFlag(GameObject$1.L_BLOCKS_VISION);
    }
    blocksPathing() {
        return this.hasObjectFlag(GameObject$1.L_BLOCKS_MOVE);
    }
    blocksEffects() {
        return this.hasObjectFlag(GameObject$1.L_BLOCKS_EFFECTS);
    }
    itemFlags() {
        return 0;
    }
    actorFlags() {
        return 0;
    }
}

var index$4 = {
    __proto__: null,
    flags: flags$3,
    GameObject: GameObject
};

class Item extends GameObject {
    constructor() {
        super();
        this.quantity = 1;
        this.next = null;
        // @ts-ignore
        this.flags = this.flags || {};
        this.flags.item = 0;
        this.depth = Depth$1.ITEM;
    }
    itemFlags() {
        return this.flags.item;
    }
    hasItemFlag(flag) {
        return !!(this.flags.item & flag);
    }
    hasAllItemFlags(flags) {
        return (this.flags.item & flags) === flags;
    }
    forbidsCell(_cell) {
        return false;
    }
}

var index$3 = {
    __proto__: null,
    Item: Item
};

var Actor$1;
(function (Actor) {
    Actor[Actor["IS_PLAYER"] = fl(0)] = "IS_PLAYER";
})(Actor$1 || (Actor$1 = {}));

var flags$2 = {
    __proto__: null,
    get Actor () { return Actor$1; },
    get GameObject () { return GameObject$1; },
    get Depth () { return Depth$1; }
};

class Actor extends GameObject {
    constructor() {
        super();
        this.next = null;
        // @ts-ignore
        this.flags = this.flags || {};
        this.flags.actor = 0;
        this.depth = Depth$1.ACTOR;
    }
    hasActorFlag(flag) {
        return !!(this.flags.actor & flag);
    }
    hasAllActorFlags(flags) {
        return (this.flags.actor & flags) === flags;
    }
    actorFlags() {
        return this.flags.actor;
    }
    isPlayer() {
        return this.hasActorFlag(Actor$1.IS_PLAYER);
    }
    isVisible() {
        return true;
    }
    forbidsCell(_cell) {
        return false;
    }
}

var index$2 = {
    __proto__: null,
    flags: flags$2,
    Actor: Actor
};

///////////////////////////////////////////////////////
// TILE
var Tile$1;
(function (Tile) {
    Tile[Tile["T_BRIDGE"] = fl(0)] = "T_BRIDGE";
    Tile[Tile["T_AUTO_DESCENT"] = fl(1)] = "T_AUTO_DESCENT";
    Tile[Tile["T_LAVA"] = fl(2)] = "T_LAVA";
    Tile[Tile["T_DEEP_WATER"] = fl(3)] = "T_DEEP_WATER";
    Tile[Tile["T_IS_FLAMMABLE"] = fl(5)] = "T_IS_FLAMMABLE";
    Tile[Tile["T_SPONTANEOUSLY_IGNITES"] = fl(6)] = "T_SPONTANEOUSLY_IGNITES";
    Tile[Tile["T_IS_FIRE"] = fl(7)] = "T_IS_FIRE";
    Tile[Tile["T_EXTINGUISHES_FIRE"] = fl(8)] = "T_EXTINGUISHES_FIRE";
    Tile[Tile["T_IS_SECRET"] = fl(9)] = "T_IS_SECRET";
    Tile[Tile["T_IS_TRAP"] = fl(10)] = "T_IS_TRAP";
    Tile[Tile["T_SACRED"] = fl(11)] = "T_SACRED";
    Tile[Tile["T_UP_STAIRS"] = fl(12)] = "T_UP_STAIRS";
    Tile[Tile["T_DOWN_STAIRS"] = fl(13)] = "T_DOWN_STAIRS";
    Tile[Tile["T_PORTAL"] = fl(14)] = "T_PORTAL";
    Tile[Tile["T_IS_DOOR"] = fl(15)] = "T_IS_DOOR";
    Tile[Tile["T_ALLOWS_SUBMERGING"] = fl(16)] = "T_ALLOWS_SUBMERGING";
    Tile[Tile["T_ENTANGLES"] = fl(17)] = "T_ENTANGLES";
    Tile[Tile["T_REFLECTS"] = fl(18)] = "T_REFLECTS";
    Tile[Tile["T_STAND_IN_TILE"] = fl(19)] = "T_STAND_IN_TILE";
    Tile[Tile["T_CONNECTS_LEVEL"] = fl(20)] = "T_CONNECTS_LEVEL";
    Tile[Tile["T_BLOCKS_OTHER_LAYERS"] = fl(21)] = "T_BLOCKS_OTHER_LAYERS";
    Tile[Tile["T_HAS_STAIRS"] = Tile.T_UP_STAIRS | Tile.T_DOWN_STAIRS | Tile.T_PORTAL] = "T_HAS_STAIRS";
    Tile[Tile["T_OBSTRUCTS_SCENT"] = Tile.T_AUTO_DESCENT |
        Tile.T_LAVA |
        Tile.T_DEEP_WATER |
        Tile.T_SPONTANEOUSLY_IGNITES |
        Tile.T_HAS_STAIRS] = "T_OBSTRUCTS_SCENT";
    Tile[Tile["T_PATHING_BLOCKER"] = Tile.T_AUTO_DESCENT |
        Tile.T_IS_TRAP |
        Tile.T_LAVA |
        Tile.T_DEEP_WATER |
        Tile.T_IS_FIRE |
        Tile.T_SPONTANEOUSLY_IGNITES |
        Tile.T_ENTANGLES] = "T_PATHING_BLOCKER";
    Tile[Tile["T_LAKE_PATHING_BLOCKER"] = Tile.T_AUTO_DESCENT |
        Tile.T_LAVA |
        Tile.T_DEEP_WATER |
        Tile.T_SPONTANEOUSLY_IGNITES] = "T_LAKE_PATHING_BLOCKER";
    Tile[Tile["T_WAYPOINT_BLOCKER"] = Tile.T_AUTO_DESCENT |
        Tile.T_IS_TRAP |
        Tile.T_LAVA |
        Tile.T_DEEP_WATER |
        Tile.T_SPONTANEOUSLY_IGNITES] = "T_WAYPOINT_BLOCKER";
    Tile[Tile["T_DIVIDES_LEVEL"] = Tile.T_AUTO_DESCENT | Tile.T_IS_TRAP | Tile.T_LAVA | Tile.T_DEEP_WATER] = "T_DIVIDES_LEVEL";
    Tile[Tile["T_MOVES_ITEMS"] = Tile.T_DEEP_WATER | Tile.T_LAVA] = "T_MOVES_ITEMS";
    Tile[Tile["T_CAN_BE_BRIDGED"] = Tile.T_AUTO_DESCENT | Tile.T_LAVA | Tile.T_DEEP_WATER] = "T_CAN_BE_BRIDGED";
    // T_HARMFUL_TERRAIN = T_CAUSES_POISON |
    //   T_IS_FIRE |
    //   T_CAUSES_DAMAGE |
    //   T_CAUSES_PARALYSIS |
    //   T_CAUSES_CONFUSION |
    //   T_CAUSES_EXPLOSIVE_DAMAGE,
    // T_RESPIRATION_IMMUNITIES = T_CAUSES_DAMAGE |
    //   T_CAUSES_CONFUSION |
    //   T_CAUSES_PARALYSIS |
    //   T_CAUSES_NAUSEA,
    Tile[Tile["T_IS_DEEP_LIQUID"] = Tile.T_LAVA | Tile.T_AUTO_DESCENT | Tile.T_DEEP_WATER] = "T_IS_DEEP_LIQUID";
})(Tile$1 || (Tile$1 = {}));
///////////////////////////////////////////////////////
// TILE MECH
var TileMech;
(function (TileMech) {
    // TM_PROMOTES_WITH_KEY = Fl(1), // promotes if the key is present on the tile (in your pack, carried by monster, or lying on the ground)
    // TM_PROMOTES_WITHOUT_KEY = Fl(2), // promotes if the key is NOT present on the tile (in your pack, carried by monster, or lying on the ground)
    // TM_PROMOTES_ON_STEP = Fl(3), // promotes when a creature, player or item is on the tile (whether or not levitating)
    // TM_PROMOTES_ON_ITEM_REMOVE = Fl(4), // promotes when an item is lifted from the tile (primarily for altars)
    // TM_PROMOTES_ON_PLAYER_ENTRY = Fl(5), // promotes when the player enters the tile (whether or not levitating)
    // TM_PROMOTES_ON_SACRIFICE_ENTRY = Fl(6), // promotes when the sacrifice target enters the tile (whether or not levitating)
    // TM_PROMOTES_ON_ELECTRICITY = Fl(7), // promotes when hit by a lightning bolt
    // T_CAUSES_POISON = Fl(18), // any non-levitating creature gets 10 poison
    // T_CAUSES_DAMAGE = Fl(19), // anything on the tile takes max(1-2, 10%) damage per turn
    // T_CAUSES_NAUSEA = Fl(20), // any creature on the tile becomes nauseous
    // T_CAUSES_PARALYSIS = Fl(21), // anything caught on this tile is paralyzed
    // T_CAUSES_CONFUSION = Fl(22), // causes creatures on this tile to become confused
    // T_CAUSES_HEALING = Fl(23), // heals 20% max HP per turn for any player or non-inanimate monsters
    // T_CAUSES_EXPLOSIVE_DAMAGE = Fl(25), // is an explosion; deals higher of 15-20 or 50% damage instantly, but not again for five turns
    TileMech[TileMech["TM_IS_WIRED"] = fl(9)] = "TM_IS_WIRED";
    TileMech[TileMech["TM_IS_CIRCUIT_BREAKER"] = fl(10)] = "TM_IS_CIRCUIT_BREAKER";
    TileMech[TileMech["TM_VANISHES_UPON_PROMOTION"] = fl(15)] = "TM_VANISHES_UPON_PROMOTION";
    TileMech[TileMech["TM_EXPLOSIVE_PROMOTE"] = fl(21)] = "TM_EXPLOSIVE_PROMOTE";
    TileMech[TileMech["TM_SWAP_ENCHANTS_ACTIVATION"] = fl(25)] = "TM_SWAP_ENCHANTS_ACTIVATION";
    // TM_PROMOTES = TM_PROMOTES_WITH_KEY |
    //   TM_PROMOTES_WITHOUT_KEY |
    //   TM_PROMOTES_ON_STEP |
    //   TM_PROMOTES_ON_ITEM_REMOVE |
    //   TM_PROMOTES_ON_SACRIFICE_ENTRY |
    //   TM_PROMOTES_ON_ELECTRICITY |
    //   TM_PROMOTES_ON_PLAYER_ENTRY,
})(TileMech || (TileMech = {}));

class Tile {
    constructor(config) {
        var _a, _b, _c, _d;
        this.index = -1;
        this.dissipate = 20 * 100; // 0%
        this.effects = {};
        this.priority = 50;
        this.depth = 0;
        this.light = null;
        this.groundTile = null;
        this.id = config.id || 'n/a';
        this.dissipate = (_a = config.dissipate) !== null && _a !== void 0 ? _a : this.dissipate;
        this.priority = (_b = config.priority) !== null && _b !== void 0 ? _b : this.priority;
        this.depth = (_c = config.depth) !== null && _c !== void 0 ? _c : this.depth;
        this.light = config.light || null;
        this.groundTile = config.groundTile || null;
        this.sprite = make$5(config);
        this.name = config.name || 'tile';
        this.description = config.description || this.name;
        this.flavor = config.flavor || this.name;
        this.article = (_d = config.article) !== null && _d !== void 0 ? _d : null;
        this.flags = config.flags || { object: 0, tile: 0, tileMech: 0 };
        if (config.effects) {
            Object.assign(this.effects, config.effects);
        }
    }
    hasObjectFlag(flag) {
        return !!(this.flags.object & flag);
    }
    hasTileFlag(flag) {
        return !!(this.flags.tile & flag);
    }
    hasTileMechFlag(flag) {
        return !!(this.flags.tileMech & flag);
    }
    hasAllObjectFlags(flag) {
        return (this.flags.object & flag) === flag;
    }
    hasAllTileFlags(flag) {
        return (this.flags.tile & flag) === flag;
    }
    hasAllTileMechFlags(flag) {
        return (this.flags.tileMech & flag) === flag;
    }
    blocksVision() {
        return !!(this.flags.object & GameObject$1.L_BLOCKS_VISION);
    }
    blocksMove() {
        return !!(this.flags.object & GameObject$1.L_BLOCKS_MOVE);
    }
    blocksPathing() {
        return (this.blocksMove() || this.hasTileFlag(Tile$1.T_PATHING_BLOCKER));
    }
    blocksEffects() {
        return !!(this.flags.object & GameObject$1.L_BLOCKS_EFFECTS);
    }
    hasEffect(name) {
        return name in this.effects;
    }
    getName(arg) {
        let opts = {};
        if (arg === true || arg === false) {
            opts.article = arg;
        }
        else if (typeof arg === 'string') {
            opts.article = arg;
        }
        else if (arg) {
            opts = arg;
        }
        if (!opts.article && !opts.color)
            return this.name;
        let result = this.name;
        if (opts.color) {
            let color = opts.color;
            if (opts.color === true) {
                color = this.sprite.fg || 'white';
            }
            if (typeof color !== 'string') {
                color = from$4(color).toString();
            }
            result = `Ω${color}Ω${this.name}∆`;
        }
        if (opts.article) {
            let article = typeof opts.article === 'string'
                ? opts.article
                : this.article || 'a';
            result = article + ' ' + result;
        }
        return result;
    }
    getDescription() {
        return this.description || this.getName();
    }
    getFlavor() {
        return this.flavor || this.getName();
    }
}
function make$1(options) {
    var _a, _b, _c, _d, _e, _f, _g;
    let base = { effects: {}, flags: {}, sprite: {} };
    if (options.extends) {
        base = tiles[options.extends];
        if (!base)
            throw new Error('Failed to find base tile: ' + options.extends);
    }
    const effects = {};
    Object.assign(effects, base.effects);
    if (options.effects) {
        Object.entries(options.effects).forEach(([key, value]) => {
            if (value === null) {
                delete effects[key];
                return;
            }
            if (typeof value === 'string') {
                effects[key] = value;
                return;
            }
            effects[key] = make$4(value);
        });
    }
    const flags = {
        object: from$5(GameObject$1, base.flags.object, options.flags),
        tile: from$5(Tile$1, base.flags.tile, options.flags),
        tileMech: from$5(TileMech, base.flags.tileMech, options.flags),
    };
    let depth = base.depth || 0;
    if (options.depth) {
        if (typeof options.depth === 'string') {
            depth = Depth$1[options.depth];
        }
        else {
            depth = options.depth;
        }
    }
    let light = base.light;
    if (options.light) {
        light = make$2(options.light);
    }
    else if (options.light === null) {
        light = null;
    }
    const config = {
        id: options.id,
        flags,
        dissipate: (_a = options.dissipate) !== null && _a !== void 0 ? _a : base.dissipate,
        effects,
        priority: (_b = options.priority) !== null && _b !== void 0 ? _b : base.priority,
        depth: depth,
        light,
        groundTile: options.groundTile || null,
        ch: (_c = options.ch) !== null && _c !== void 0 ? _c : base.sprite.ch,
        fg: (_d = options.fg) !== null && _d !== void 0 ? _d : base.sprite.fg,
        bg: (_e = options.bg) !== null && _e !== void 0 ? _e : base.sprite.bg,
        opacity: (_f = options.opacity) !== null && _f !== void 0 ? _f : base.sprite.opacity,
        name: options.name || base.name,
        description: options.description || base.description,
        flavor: options.flavor || base.flavor,
        article: (_g = options.article) !== null && _g !== void 0 ? _g : base.article,
    };
    const tile = new Tile(config);
    return tile;
}
const tiles = {};
const all = [];
function get(id) {
    if (id instanceof Tile)
        return id;
    if (typeof id === 'string')
        return tiles[id] || null;
    return all[id] || null;
}
function install(id, ...args) {
    let options = args[0];
    if (args.length == 2) {
        options = args[1];
        options.extends = args[0];
    }
    options.id = id;
    const tile = make$1(options);
    tile.index = all.length;
    all.push(tile);
    tiles[id] = tile;
    return tile;
}
function installAll(tiles) {
    Object.entries(tiles).forEach(([id, config]) => {
        install(id, config);
    });
}

// These are the minimal set of tiles to make the diggers work
install('NULL', {
    ch: '\u2205',
    fg: 'white',
    bg: 'black',
    flags: 'L_BLOCKS_MOVE',
    name: 'eerie nothingness',
    article: 'an',
    priority: 0,
});
install('FLOOR', {
    ch: '\u00b7',
    fg: [30, 30, 30, 20, 0, 0, 0],
    bg: [2, 2, 10, 0, 2, 2, 0],
    priority: 10,
    article: 'the',
});
install('DOOR', {
    ch: '+',
    fg: [100, 40, 40],
    bg: [30, 60, 60],
    priority: 30,
    flags: 'T_IS_DOOR, L_BLOCKS_EFFECTS, L_BLOCKS_ITEMS, L_BLOCKS_VISION, L_VISUALLY_DISTINCT',
    article: 'a',
    effects: {
        enter: { tile: 'DOOR_OPEN' },
        open: { tile: 'DOOR_OPEN_ALWAYS' },
    },
});
install('DOOR_OPEN', 'DOOR', {
    ch: "'",
    fg: [100, 40, 40],
    bg: [30, 60, 60],
    priority: 40,
    flags: '!L_BLOCKS_ITEMS, !L_BLOCKS_VISION',
    name: 'open door',
    article: 'an',
    effects: {
        tick: {
            chance: 100 * 100,
            tile: 'DOOR',
            flags: 'E_SUPERPRIORITY, E_ONLY_IF_EMPTY',
        },
        enter: null,
        open: null,
        close: { tile: 'DOOR', flags: 'E_SUPERPRIORITY, E_ONLY_IF_EMPTY' },
    },
});
install('DOOR_OPEN_ALWAYS', 'DOOR_OPEN', {
    effects: {
        tick: null,
        close: { tile: 'DOOR', flags: 'E_SUPERPRIORITY, E_ONLY_IF_EMPTY' },
    },
});
install('UP_STAIRS', {
    ch: '<',
    fg: [100, 50, 50],
    bg: [40, 20, 20],
    priority: 200,
    flags: 'T_UP_STAIRS, L_BLOCKED_BY_STAIRS, L_VISUALLY_DISTINCT, L_LIST_IN_SIDEBAR',
    name: 'upward staircase',
    article: 'an',
    effects: {
        player: { emit: 'UP_STAIRS' },
    },
});
install('DOWN_STAIRS', {
    ch: '>',
    fg: [100, 50, 50],
    bg: [40, 20, 20],
    priority: 200,
    flags: 'T_DOWN_STAIRS, L_BLOCKED_BY_STAIRS, L_VISUALLY_DISTINCT, L_LIST_IN_SIDEBAR',
    name: 'downward staircase',
    article: 'a',
    effects: {
        player: { emit: 'DOWN_STAIRS' },
    },
});
install('WALL', {
    ch: '#',
    fg: [7, 7, 7, 0, 3, 3, 3],
    bg: [40, 40, 40, 10, 10, 0, 5],
    priority: 100,
    flags: 'L_WALL_FLAGS',
    article: 'a',
    name: 'stone wall',
    description: 'A wall made from rough cut stone.',
    flavor: 'a rough stone wall',
});
install('IMPREGNABLE', {
    ch: '#',
    fg: [7, 7, 7, 0, 3, 3, 3],
    bg: [40, 40, 40, 10, 10, 0, 5],
    priority: 100,
    flags: 'L_WALL_FLAGS, IMPREGNABLE',
    article: 'a',
    name: 'impregnable wall',
    description: 'A wall made from very hard stone.',
    flavor: 'an impregnable wall',
});
install('LAKE', {
    ch: '~',
    fg: [5, 8, 20, 10, 0, 4, 15, true],
    bg: [10, 15, 41, 6, 5, 5, 5, true],
    priority: 50,
    flags: 'T_DEEP_WATER',
    name: 'deep water',
    article: 'the',
});
install('SHALLOW', {
    ch: '\u00b7',
    fg: [5, 8, 10, 10, 0, 4, 15, true],
    bg: [10, 30, 30, 6, 0, 10, 10, true],
    priority: 20,
    name: 'shallow water',
    article: 'the',
    depth: 'SURFACE', // 'LIQUID'?
});
install('BRIDGE', {
    ch: '=',
    fg: [100, 40, 40],
    priority: 40,
    depth: 'SURFACE',
    flags: 'T_BRIDGE, L_VISUALLY_DISTINCT',
    article: 'a',
    groundTile: 'LAKE',
});

const flags$1 = { Tile: Tile$1, TileMech };

var index$1 = {
    __proto__: null,
    flags: flags$1,
    Tile: Tile,
    make: make$1,
    tiles: tiles,
    all: all,
    get: get,
    install: install,
    installAll: installAll
};

///////////////////////////////////////////////////////
// CELL
var Cell$1;
(function (Cell) {
    Cell[Cell["SEARCHED_FROM_HERE"] = fl(0)] = "SEARCHED_FROM_HERE";
    Cell[Cell["PRESSURE_PLATE_DEPRESSED"] = fl(1)] = "PRESSURE_PLATE_DEPRESSED";
    Cell[Cell["KNOWN_TO_BE_TRAP_FREE"] = fl(2)] = "KNOWN_TO_BE_TRAP_FREE";
    Cell[Cell["CAUGHT_FIRE_THIS_TURN"] = fl(3)] = "CAUGHT_FIRE_THIS_TURN";
    Cell[Cell["EVENT_FIRED_THIS_TURN"] = fl(4)] = "EVENT_FIRED_THIS_TURN";
    Cell[Cell["EVENT_PROTECTED"] = fl(5)] = "EVENT_PROTECTED";
    Cell[Cell["IS_IN_LOOP"] = fl(6)] = "IS_IN_LOOP";
    Cell[Cell["IS_CHOKEPOINT"] = fl(7)] = "IS_CHOKEPOINT";
    Cell[Cell["IS_GATE_SITE"] = fl(8)] = "IS_GATE_SITE";
    Cell[Cell["IS_IN_ROOM_MACHINE"] = fl(9)] = "IS_IN_ROOM_MACHINE";
    Cell[Cell["IS_IN_AREA_MACHINE"] = fl(10)] = "IS_IN_AREA_MACHINE";
    Cell[Cell["IS_POWERED"] = fl(11)] = "IS_POWERED";
    Cell[Cell["IMPREGNABLE"] = fl(12)] = "IMPREGNABLE";
    // DARKENED = Fl(13), // magical blindness?
    Cell[Cell["NEEDS_REDRAW"] = fl(14)] = "NEEDS_REDRAW";
    Cell[Cell["CELL_CHANGED"] = fl(15)] = "CELL_CHANGED";
    // These are to help memory
    Cell[Cell["HAS_SURFACE"] = fl(16)] = "HAS_SURFACE";
    Cell[Cell["HAS_LIQUID"] = fl(17)] = "HAS_LIQUID";
    Cell[Cell["HAS_GAS"] = fl(18)] = "HAS_GAS";
    Cell[Cell["HAS_PLAYER"] = fl(19)] = "HAS_PLAYER";
    Cell[Cell["HAS_ACTOR"] = fl(20)] = "HAS_ACTOR";
    Cell[Cell["HAS_DORMANT_MONSTER"] = fl(21)] = "HAS_DORMANT_MONSTER";
    Cell[Cell["HAS_ITEM"] = fl(22)] = "HAS_ITEM";
    Cell[Cell["IS_IN_PATH"] = fl(23)] = "IS_IN_PATH";
    Cell[Cell["IS_CURSOR"] = fl(24)] = "IS_CURSOR";
    Cell[Cell["STABLE_MEMORY"] = fl(25)] = "STABLE_MEMORY";
    Cell[Cell["IS_WIRED"] = fl(26)] = "IS_WIRED";
    Cell[Cell["IS_CIRCUIT_BREAKER"] = fl(27)] = "IS_CIRCUIT_BREAKER";
    Cell[Cell["COLORS_DANCE"] = fl(30)] = "COLORS_DANCE";
    Cell[Cell["IS_IN_MACHINE"] = Cell.IS_IN_ROOM_MACHINE | Cell.IS_IN_AREA_MACHINE] = "IS_IN_MACHINE";
    Cell[Cell["PERMANENT_CELL_FLAGS"] = Cell.HAS_ITEM |
        Cell.HAS_DORMANT_MONSTER |
        Cell.STABLE_MEMORY |
        Cell.SEARCHED_FROM_HERE |
        Cell.PRESSURE_PLATE_DEPRESSED |
        Cell.KNOWN_TO_BE_TRAP_FREE |
        Cell.IS_IN_LOOP |
        Cell.IS_CHOKEPOINT |
        Cell.IS_GATE_SITE |
        Cell.IS_IN_MACHINE |
        Cell.IMPREGNABLE] = "PERMANENT_CELL_FLAGS";
    Cell[Cell["HAS_ANY_ACTOR"] = Cell.HAS_PLAYER | Cell.HAS_ACTOR] = "HAS_ANY_ACTOR";
    Cell[Cell["HAS_ANY_OBJECT"] = Cell.HAS_ITEM | Cell.HAS_ANY_ACTOR] = "HAS_ANY_OBJECT";
    Cell[Cell["CELL_DEFAULT"] = Cell.NEEDS_REDRAW | Cell.CELL_CHANGED] = "CELL_DEFAULT";
})(Cell$1 || (Cell$1 = {}));
///////////////////////////////////////////////////////
// MAP
var Map$1;
(function (Map) {
    Map[Map["MAP_CHANGED"] = fl(0)] = "MAP_CHANGED";
    Map[Map["MAP_ALWAYS_LIT"] = fl(3)] = "MAP_ALWAYS_LIT";
    Map[Map["MAP_SAW_WELCOME"] = fl(4)] = "MAP_SAW_WELCOME";
    Map[Map["MAP_NO_LIQUID"] = fl(5)] = "MAP_NO_LIQUID";
    Map[Map["MAP_NO_GAS"] = fl(6)] = "MAP_NO_GAS";
    Map[Map["MAP_CALC_FOV"] = fl(7)] = "MAP_CALC_FOV";
    Map[Map["MAP_FOV_CHANGED"] = fl(8)] = "MAP_FOV_CHANGED";
    Map[Map["MAP_DANCES"] = fl(9)] = "MAP_DANCES";
    Map[Map["MAP_DEFAULT"] = 0] = "MAP_DEFAULT";
})(Map$1 || (Map$1 = {}));

class CellObjects {
    constructor(cell) {
        this.cell = cell;
    }
    forEach(cb) {
        let object = this.cell._item;
        while (object) {
            cb(object);
            object = object.next;
        }
        object = this.cell._actor;
        while (object) {
            cb(object);
            object = object.next;
        }
    }
    some(cb) {
        let object = this.cell._item;
        while (object) {
            if (cb(object))
                return true;
            object = object.next;
        }
        object = this.cell._actor;
        while (object) {
            if (cb(object))
                return true;
            object = object.next;
        }
        return false;
    }
    reduce(cb, start) {
        let object = this.cell._item;
        while (object) {
            if (start === undefined) {
                start = object;
            }
            else {
                start = cb(start, object);
            }
            object = object.next;
        }
        object = this.cell._actor;
        while (object) {
            if (start === undefined) {
                start = object;
            }
            else {
                start = cb(start, object);
            }
            object = object.next;
        }
        return start;
    }
}
class Cell {
    constructor(groundTile) {
        this.chokeCount = 0;
        // gasVolume: number = 0;
        // liquidVolume: number = 0;
        this._actor = null;
        this._item = null;
        this._objects = new CellObjects(this);
        this.flags = { cell: 0 };
        this.tiles = [tiles.NULL];
        if (groundTile) {
            const tile = get(groundTile);
            this.setTile(tile);
        }
    }
    copy(other) {
        Object.assign(this.flags, other.flags);
        this.chokeCount = other.chokeCount;
        this.tiles = other.tiles.slice();
        this._actor = other._actor;
        this._item = other._item;
    }
    hasCellFlag(flag) {
        return !!(this.flags.cell & flag);
    }
    setCellFlag(flag) {
        this.flags.cell |= flag;
    }
    clearCellFlag(flag) {
        this.flags.cell &= ~flag;
    }
    hasObjectFlag(flag) {
        return (this.tiles.some((t) => t && t.flags.object & flag) ||
            this._objects.some((o) => !!(o.flags.object & flag)));
    }
    hasAllObjectFlags(flags) {
        return (this.objectFlags() & flags) == flags;
    }
    hasTileFlag(flag) {
        return this.tiles.some((t) => t && t.flags.tile & flag);
    }
    hasAllTileFlags(flags) {
        return (this.tileFlags() & flags) == flags;
    }
    hasTileMechFlag(flag) {
        return this.tiles.some((t) => t && t.flags.tileMech & flag);
    }
    hasAllTileMechFlags(flags) {
        return (this.tileMechFlags() & flags) == flags;
    }
    cellFlags() {
        return this.flags.cell;
    }
    objectFlags() {
        return (this.tiles.reduce((out, t) => out | (t ? t.flags.object : 0), 0) |
            this._objects.reduce((out, o) => out | o.flags.object, 0));
    }
    tileFlags() {
        return this.tiles.reduce((out, t) => out | (t ? t.flags.tile : 0), 0);
    }
    tileMechFlags() {
        return this.tiles.reduce((out, t) => out | (t ? t.flags.tileMech : 0), 0);
    }
    itemFlags() {
        return this._objects.reduce((out, o) => out | o.itemFlags(), 0);
    }
    actorFlags() {
        return this._objects.reduce((out, o) => out | o.actorFlags(), 0);
    }
    get needsRedraw() {
        return !!(this.flags.cell & Cell$1.NEEDS_REDRAW);
    }
    set needsRedraw(v) {
        if (v) {
            this.flags.cell |= Cell$1.NEEDS_REDRAW;
        }
        else {
            this.flags.cell &= ~Cell$1.NEEDS_REDRAW;
        }
    }
    depthPriority(depth) {
        const tile = this.tiles[depth];
        return tile ? tile.priority : tiles.NULL.priority;
    }
    highestPriority() {
        return this.tiles.reduce((out, t) => Math.max(out, t ? t.priority : 0), tiles.NULL.priority);
    }
    depthTile(depth) {
        return this.tiles[depth] || null;
    }
    hasTile(tile) {
        if (!tile)
            return this.tiles.some((t) => t);
        if (!(tile instanceof Tile)) {
            tile = get(tile);
        }
        return this.tiles.includes(tile);
    }
    hasDepthTile(depth) {
        const t = this.tiles[depth];
        return !!t && t !== tiles.NULL;
    }
    highestPriorityTile() {
        return this.tiles.reduce((out, tile) => {
            if (!tile)
                return out;
            if (tile.priority >= out.priority)
                return tile; // higher depth will get picked with >=
            return out;
        }, tiles.NULL);
    }
    get tile() {
        return this.highestPriorityTile();
    }
    eachTile(cb) {
        this.tiles.forEach((t) => t && cb(t));
    }
    tileWithObjectFlag(flag) {
        return this.tiles.find((t) => t && t.flags.object & flag) || null;
    }
    tileWithFlag(flag) {
        return this.tiles.find((t) => t && t.flags.tile & flag) || null;
    }
    tileWithMechFlag(flag) {
        return this.tiles.find((t) => t && t.flags.tileMech & flag) || null;
    }
    blocksVision() {
        return (this.tiles.some((t) => t && t.blocksVision()) ||
            this._objects.some((o) => o.blocksVision()));
    }
    blocksPathing() {
        return (this.tiles.some((t) => t && t.blocksPathing()) ||
            this._objects.some((o) => o.blocksPathing()));
    }
    blocksMove() {
        return (this.tiles.some((t) => t && t.blocksMove()) ||
            this._objects.some((o) => o.blocksMove()));
    }
    blocksEffects() {
        return (this.tiles.some((t) => t && t.blocksEffects()) ||
            this._objects.some((o) => o.blocksEffects()));
    }
    blocksLayer(depth) {
        return this.tiles.some((t) => t &&
            !!(t.flags.tile & flags$1.Tile.T_BLOCKS_OTHER_LAYERS) &&
            t.depth != depth);
    }
    // Tests
    isEmpty() {
        return (this.tiles.every((t) => !t || t === tiles.NULL) &&
            this._actor == null &&
            this._item == null);
    }
    isPassable() {
        return !this.blocksMove();
    }
    isWall() {
        return this.hasAllObjectFlags(GameObject$1.L_WALL_FLAGS);
    }
    isStairs() {
        return this.hasTileFlag(Tile$1.T_HAS_STAIRS);
    }
    hasKey() {
        return false;
    }
    // @returns - whether or not the change results in a change to the cell lighting.
    setTile(tile) {
        if (!(tile instanceof Tile)) {
            tile = get(tile);
            if (!tile)
                return false;
        }
        // const current = this.tiles[tile.depth] || TILE.tiles.NULL;
        // if (current !== tile) {
        //     this.gasVolume = 0;
        //     this.liquidVolume = 0;
        // }
        // Check priority, etc...
        this.tiles[tile.depth] = tile;
        this.needsRedraw = true;
        // if (volume) {
        //     if (tile.depth === Depth.GAS) {
        //         this.gasVolume = volume;
        //     }
        //     if (tile.depth === Depth.LIQUID) {
        //         this.liquidVolume = volume;
        //     }
        // }
        return true;
    }
    clear() {
        this.tiles = [tiles.NULL];
        this.needsRedraw = true;
    }
    clearDepth(depth) {
        if (depth == 0) {
            this.tiles[0] = tiles.NULL;
            this.needsRedraw = true;
            return true;
        }
        else if (this.tiles[depth] !== null) {
            this.tiles[depth] = null;
            this.needsRedraw = true;
            return true;
        }
        return false;
    }
    clearDepthsWithFlags(tileFlag, tileMechFlag = 0) {
        for (let i = 0; i < this.tiles.length; ++i) {
            const tile = this.tiles[i];
            if (!tile)
                continue;
            if (!tile.hasTileFlag(tileFlag))
                continue;
            if (tileMechFlag && !tile.hasTileMechFlag(tileMechFlag))
                continue;
            this.clearDepth(i);
        }
    }
    // Lights
    eachGlowLight(cb) {
        this.tiles.forEach((tile) => {
            if (tile && tile.light)
                cb(tile.light);
        });
    }
    // Effects
    async activate(event, map, x, y, ctx = {}) {
        ctx.cell = this;
        let didSomething = false;
        if (ctx.depth !== undefined) {
            const tile = (ctx.tile = this.depthTile(ctx.depth));
            if (tile && tile.effects) {
                const ev = tile.effects[event];
                didSomething = await this._fire(ev, map, x, y, ctx);
            }
        }
        else {
            // console.log('fire event - %s', event);
            for (ctx.tile of this.tiles) {
                if (!ctx.tile || !ctx.tile.effects)
                    continue;
                const ev = ctx.tile.effects[event];
                // console.log(' - ', ev);
                if (await this._fire(ev, map, x, y, ctx)) {
                    didSomething = true;
                    break;
                }
                // }
            }
        }
        return didSomething;
    }
    async _fire(effect, map, x, y, ctx) {
        if (typeof effect === 'string') {
            effect = effects[effect];
        }
        let didSomething = false;
        if (effect) {
            // console.log(' - spawn event @%d,%d - %s', x, y, name);
            didSomething = await fire(effect, map, x, y, ctx);
            // cell.debug(" - spawned");
        }
        return didSomething;
    }
    hasEffect(name) {
        for (let tile of this.tiles) {
            if (tile && tile.hasEffect(name))
                return true;
        }
        return false;
    }
    // // Items
    hasItem() {
        return this.hasCellFlag(Cell$1.HAS_ITEM);
    }
    get item() {
        return this._item;
    }
    set item(val) {
        this._item = val;
        if (val) {
            this.setCellFlag(Cell$1.HAS_ITEM);
        }
        else {
            this.clearCellFlag(Cell$1.HAS_ITEM);
        }
        this.needsRedraw = true;
    }
    // // Actors
    hasActor() {
        return this.hasCellFlag(Cell$1.HAS_ACTOR);
    }
    hasPlayer() {
        return this.hasCellFlag(Cell$1.HAS_PLAYER);
    }
    get actor() {
        return this._actor;
    }
    set actor(val) {
        this._actor = val;
        if (val) {
            this.setCellFlag(Cell$1.HAS_ACTOR);
        }
        else {
            this.clearCellFlag(Cell$1.HAS_ACTOR);
        }
        this.needsRedraw = true;
    }
    getDescription() {
        return this.highestPriorityTile().description;
    }
    getFlavor() {
        return this.highestPriorityTile().flavor;
    }
    getName(opts = {}) {
        return this.highestPriorityTile().getName(opts);
    }
    dump() {
        var _a, _b, _c, _d;
        if ((_b = (_a = this._actor) === null || _a === void 0 ? void 0 : _a.sprite) === null || _b === void 0 ? void 0 : _b.ch)
            return this._actor.sprite.ch;
        if ((_d = (_c = this._item) === null || _c === void 0 ? void 0 : _c.sprite) === null || _d === void 0 ? void 0 : _d.ch)
            return this._item.sprite.ch;
        return this.highestPriorityTile().sprite.ch || ' ';
    }
}

class MapLayer {
    constructor(map, name = 'layer') {
        this.map = map;
        this.depth = -1;
        this.properties = {};
        this.name = name;
    }
    copy(_other) { }
    async tick(_dt) {
        return false;
    }
}
class ActorLayer extends MapLayer {
    constructor(map, name = 'actor') {
        super(map, name);
    }
    add(x, y, obj, _opts) {
        const cell = this.map.cell(x, y);
        const actor = obj;
        if (actor.forbidsCell(cell))
            return false;
        if (!addToChain(cell, 'actor', obj))
            ;
        if (obj.isPlayer()) {
            cell.setCellFlag(Cell$1.HAS_PLAYER);
        }
        obj.x = x;
        obj.y = y;
        return true;
    }
    remove(obj) {
        const cell = this.map.cell(obj.x, obj.y);
        if (!removeFromChain(cell, 'actor', obj))
            return false;
        if (obj.isPlayer()) {
            cell.clearCellFlag(Cell$1.HAS_PLAYER);
        }
        return true;
    }
    putAppearance(dest, x, y) {
        const cell = this.map.cell(x, y);
        if (!cell.actor)
            return;
        dest.drawSprite(cell.actor.sprite);
    }
}
class ItemLayer extends MapLayer {
    constructor(map, name = 'item') {
        super(map, name);
    }
    add(x, y, obj, _opts) {
        const cell = this.map.cell(x, y);
        const item = obj;
        if (item.forbidsCell(cell))
            return false;
        if (!addToChain(cell, 'item', obj))
            ;
        obj.x = x;
        obj.y = y;
        return true;
    }
    remove(obj) {
        const cell = this.map.cell(obj.x, obj.y);
        if (!removeFromChain(cell, 'item', obj))
            return false;
        return true;
    }
    putAppearance(dest, x, y) {
        const cell = this.map.cell(x, y);
        if (!cell.item)
            return;
        dest.drawSprite(cell.item.sprite);
    }
}
class TileLayer extends MapLayer {
    constructor(map, name = 'tile') {
        super(map, name);
    }
    set(x, y, tile, opts = {}) {
        const cell = this.map.cell(x, y);
        const current = cell.depthTile(tile.depth) || tiles.NULL;
        if (!opts.superpriority) {
            // if (current !== tile) {
            //     this.gasVolume = 0;
            //     this.liquidVolume = 0;
            // }
            // Check priority, etc...
            if (current.priority > tile.priority) {
                return false;
            }
        }
        if (cell.blocksLayer(tile.depth))
            return false;
        if (opts.blockedByItems && cell.hasItem())
            return false;
        if (opts.blockedByActors && cell.hasActor())
            return false;
        if (opts.blockedByOtherLayers && cell.highestPriority() > tile.priority)
            return false;
        if (tile.depth > Depth$1.GROUND && tile.groundTile) {
            const ground = cell.depthTile(Depth$1.GROUND);
            if (!ground || ground === tiles.NULL) {
                this.set(x, y, get(tile.groundTile));
            }
        }
        if (!cell.setTile(tile))
            return false;
        if (current.light !== tile.light) {
            this.map.light.glowLightChanged = true;
        }
        if (tile.hasTileFlag(Tile$1.T_IS_FIRE)) {
            cell.setCellFlag(Cell$1.CAUGHT_FIRE_THIS_TURN);
        }
        // if (volume) {
        //     if (tile.depth === Depth.GAS) {
        //         this.gasVolume = volume;
        //     }
        //     if (tile.depth === Depth.LIQUID) {
        //         this.liquidVolume = volume;
        //     }
        // }
        return true;
    }
    clear(x, y) {
        const cell = this.map.cell(x, y);
        return cell.clearDepth(this.depth);
    }
    async tick(_dt) {
        // Run any tick effects
        // Bookkeeping for fire, pressure plates and key-activated tiles.
        for (let x = 0; x < this.map.width; ++x) {
            for (let y = 0; y < this.map.height; ++y) {
                const cell = this.map.cell(x, y);
                if (!cell.hasCellFlag(Cell$1.HAS_ANY_ACTOR | Cell$1.HAS_ITEM) &&
                    cell.hasCellFlag(Cell$1.PRESSURE_PLATE_DEPRESSED)) {
                    cell.clearCellFlag(Cell$1.PRESSURE_PLATE_DEPRESSED);
                }
                if (cell.hasEffect('noKey') && !cell.hasKey()) {
                    await cell.activate('noKey', this.map, x, y);
                }
            }
        }
        return true;
    }
    putAppearance(dest, x, y) {
        const cell = this.map.cell(x, y);
        const tile = cell.depthTile(this.depth);
        if (tile && tile !== tiles.NULL) {
            dest.drawSprite(tile.sprite);
        }
    }
}

class CellMemory {
    constructor() {
        this.chokeCount = 0;
        this.flags = {
            cell: 0,
            item: 0,
            actor: 0,
            tile: 0,
            tileMech: 0,
            object: 0,
        };
        this.blocks = {
            vision: false,
            effects: false,
            move: false,
            pathing: false,
        };
        this._tile = tiles.NULL;
        this._item = null;
        this._actor = null;
        this._hasKey = false;
        this.snapshot = new Mixer();
    }
    clear() {
        this.snapshot.blackOut();
        this._item = null;
        this._actor = null;
        this._tile = tiles.NULL;
        this.flags.cell = 0;
        this.flags.object = 0;
        this.flags.tile = 0;
        this.flags.tileMech = 0;
        this.blocks.effects = false;
        this.blocks.move = false;
        this.blocks.pathing = false;
        this.blocks.vision = false;
        this._hasKey = false;
    }
    store(cell) {
        this._item = null;
        if (cell.hasItem()) {
            this._item = cell.item;
        }
        this._actor = null;
        if (cell.hasActor()) {
            this._actor = cell.actor;
        }
        this._tile = cell.tile;
        this.flags.cell = cell.cellFlags();
        this.flags.tile = cell.tileFlags();
        this.flags.tileMech = cell.tileMechFlags();
        this.flags.object = cell.objectFlags();
        this.flags.item = cell.itemFlags();
        this.flags.actor = cell.actorFlags();
        this.blocks.effects = cell.blocksEffects();
        this.blocks.move = cell.blocksMove();
        this.blocks.pathing = cell.blocksPathing();
        this.blocks.vision = cell.blocksVision();
        this._hasKey = cell.hasKey();
    }
    getSnapshot(dest) {
        dest.copy(this.snapshot);
    }
    putSnapshot(src) {
        this.snapshot.copy(src);
    }
    hasCellFlag(flag) {
        return !!(this.flags.cell & flag);
    }
    hasTileFlag(flag) {
        return !!(this.flags.tile & flag);
    }
    hasAllTileFlags(flags) {
        return (this.flags.tile & flags) == flags;
    }
    hasObjectFlag(flag) {
        return !!(this.flags.object & flag);
    }
    hasAllObjectFlags(flags) {
        return (this.flags.object & flags) == flags;
    }
    hasTileMechFlag(flag) {
        return !!(this.flags.tileMech & flag);
    }
    cellFlags() {
        return this.flags.cell;
    }
    objectFlags() {
        return this.flags.object;
    }
    tileFlags() {
        return this.flags.tile;
    }
    tileMechFlags() {
        return this.flags.tileMech;
    }
    itemFlags() {
        return this.flags.item;
    }
    actorFlags() {
        return this.flags.actor;
    }
    blocksVision() {
        return this.blocks.vision;
    }
    blocksPathing() {
        return this.blocks.pathing;
    }
    blocksMove() {
        return this.blocks.move;
    }
    blocksEffects() {
        return this.blocks.effects;
    }
    isWall() {
        return this.blocksVision() && this.blocksMove();
    }
    isStairs() {
        return this.hasTileFlag(Tile$1.T_HAS_STAIRS);
    }
    hasKey() {
        return this._hasKey;
    }
    get tile() {
        return this._tile;
    }
    hasTile(tile) {
        if (!(tile instanceof Tile)) {
            tile = get(tile);
        }
        return this._tile === tile;
    }
    hasItem() {
        return !!this._item;
    }
    get item() {
        return this._item;
    }
    hasActor() {
        return !!this._actor;
    }
    hasPlayer() {
        return !!(this.flags.cell & Cell$1.HAS_PLAYER);
    }
    get actor() {
        return this._actor;
    }
    getDescription() {
        throw new Error('Method not implemented.');
    }
    getFlavor() {
        throw new Error('Method not implemented.');
    }
    getName(_opts) {
        throw new Error('Method not implemented.');
    }
}

const Depth = Depth$1;
const ObjectFlags$1 = GameObject$1;
const TileFlags = Tile$1;
const TileMechFlags = TileMech;
const CellFlags = Cell$1;
class FireLayer extends TileLayer {
    constructor(map, name = 'tile') {
        super(map, name);
    }
    async tick(_dt) {
        // Run any tick effects
        // Bookkeeping for fire
        for (let x = 0; x < this.map.width; ++x) {
            for (let y = 0; y < this.map.height; ++y) {
                const cell = this.map.cell(x, y);
                cell.clearCellFlag(CellFlags.CAUGHT_FIRE_THIS_TURN);
            }
        }
        // now spread the fire...
        for (let x = 0; x < this.map.width; ++x) {
            for (let y = 0; y < this.map.height; ++y) {
                const cell = this.map.cell(x, y);
                if (cell.hasTileFlag(TileFlags.T_IS_FIRE) &&
                    !(cell.flags.cell & CellFlags.CAUGHT_FIRE_THIS_TURN)) {
                    await this.exposeToFire(x, y, false);
                    for (let d = 0; d < 4; ++d) {
                        const dir = DIRS$2[d];
                        await this.exposeToFire(x + dir[0], y + dir[1]);
                    }
                }
            }
        }
        return true;
    }
    async exposeToFire(x, y, alwaysIgnite = false) {
        let ignitionChance = 0, bestExtinguishingPriority = 0, explosiveNeighborCount = 0;
        let fireIgnited = false, explosivePromotion = false;
        const cell = this.map.cell(x, y);
        if (!cell.hasTileFlag(TileFlags.T_IS_FLAMMABLE)) {
            return false;
        }
        // Pick the extinguishing layer with the best priority.
        cell.eachTile((tile) => {
            if (tile.hasTileFlag(TileFlags.T_EXTINGUISHES_FIRE) &&
                tile.priority > bestExtinguishingPriority) {
                bestExtinguishingPriority = tile.priority;
            }
        });
        // Pick the fire type of the most flammable layer that is either gas or equal-or-better priority than the best extinguishing layer.
        cell.eachTile((tile) => {
            if (tile.flags.tile & TileFlags.T_IS_FLAMMABLE &&
                (tile.depth === Depth.GAS ||
                    tile.priority >= bestExtinguishingPriority)) {
                const effect = from$2(tile.effects.fire);
                if (effect && effect.chance > ignitionChance) {
                    ignitionChance = effect.chance;
                }
            }
        });
        if (alwaysIgnite ||
            (ignitionChance && random.chance(ignitionChance, 10000))) {
            // If it ignites...
            fireIgnited = true;
            // Count explosive neighbors.
            if (cell.hasTileMechFlag(TileMechFlags.TM_EXPLOSIVE_PROMOTE)) {
                eachNeighbor(x, y, (x0, y0) => {
                    const n = this.map.cell(x0, y0);
                    if (n.hasObjectFlag(ObjectFlags$1.L_BLOCKS_GAS) ||
                        n.hasTileFlag(TileFlags.T_IS_FIRE) ||
                        n.hasTileMechFlag(TileMechFlags.TM_EXPLOSIVE_PROMOTE)) {
                        ++explosiveNeighborCount;
                    }
                });
                if (explosiveNeighborCount >= 8) {
                    explosivePromotion = true;
                }
            }
            let event = 'fire';
            if (explosivePromotion && cell.hasEffect('explode')) {
                event = 'explode';
            }
            // cell.eachTile( (tile) => {
            //     if (tile.flags.tile & TileFlags.T_IS_FLAMMABLE) {
            //         if (tile.depth === Depth.GAS) {
            //             cell.gasVolume = 0;
            //         } else if (tile.depth === Depth.LIQUID) {
            //             cell.liquidVolume = 0;
            //         }
            //     }
            // });
            await cell.activate(event, this.map, x, y, {
                force: true,
            });
            cell.needsRedraw = true;
        }
        return fireIgnited;
    }
}

const ObjectFlags = GameObject$1;
class GasLayer extends TileLayer {
    constructor(map, name = 'gas') {
        super(map, name);
        this.needsUpdate = false;
        this.volume = alloc(map.width, map.height, 0);
    }
    set(x, y, tile, opts = {}) {
        if (!opts.volume)
            return false;
        const cell = this.map.cell(x, y);
        if (cell.depthTile(tile.depth) === tile) {
            this.volume[x][y] += opts.volume;
            return true;
        }
        if (!super.set(x, y, tile, opts)) {
            return false;
        }
        this.volume[x][y] = opts.volume;
        this.needsUpdate = true;
        return true;
    }
    clear(x, y) {
        const cell = this.map.cell(x, y);
        if (cell.clearDepth(this.depth)) {
            this.volume[x][y] = 0;
            return true;
        }
        return false;
    }
    copy(other) {
        this.volume.copy(other.volume);
    }
    async tick(_dt) {
        if (!this.needsUpdate)
            return false;
        this.needsUpdate = false;
        const startingVolume = this.volume;
        this.volume = alloc(this.map.width, this.map.height);
        // dissipate the gas...
        this.dissipate(startingVolume);
        // spread the gas...
        this.spread(startingVolume);
        free(startingVolume);
        return true;
    }
    dissipate(volume) {
        volume.update((v, x, y) => {
            if (!v)
                return 0;
            const tile = this.map.cell(x, y).depthTile(this.depth);
            if (tile && tile.dissipate) {
                let d = Math.max(0.5, (v * tile.dissipate) / 10000); // 1000 = 10%
                v = Math.max(0, v - d);
            }
            if (v) {
                this.needsUpdate = true;
            }
            else {
                this.clear(x, y);
            }
            return v;
        });
    }
    calcOpacity(volume) {
        return Math.floor(Math.min(volume, 10) * 10);
    }
    updateCellVolume(x, y, startingVolume) {
        let total = 0;
        let count = 0;
        let highestVolume = 0;
        const cell = this.map.cell(x, y);
        let startingTile = cell.depthTile(this.depth);
        let highestTile = startingTile;
        if (cell.hasObjectFlag(ObjectFlags.L_BLOCKS_GAS)) {
            this.volume[x][y] = 0;
            if (startingVolume[x][y]) {
                this.clear(x, y);
            }
            return;
        }
        for (let i = Math.max(0, x - 1); i < Math.min(x + 2, startingVolume.width); ++i) {
            for (let j = Math.max(0, y - 1); j < Math.min(y + 2, startingVolume.height); ++j) {
                const v = startingVolume[i][j];
                if (!cell.hasObjectFlag(ObjectFlags.L_BLOCKS_GAS)) {
                    ++count;
                    if (v > highestVolume) {
                        highestVolume = v;
                        highestTile = this.map.cell(i, j).depthTile(this.depth);
                    }
                }
                total += v;
            }
        }
        const v = Math.floor((total * 10) / count) / 10;
        this.volume[x][y] = v;
        if (v > 0 && highestTile) {
            if (!startingTile || startingTile !== highestTile) {
                cell.setTile(highestTile);
            }
        }
        if (v > 0) {
            cell.needsRedraw = true;
        }
    }
    spread(startingVolume) {
        for (let x = 0; x < startingVolume.width; ++x) {
            for (let y = 0; y < startingVolume.height; ++y) {
                this.updateCellVolume(x, y, startingVolume);
            }
        }
    }
    putAppearance(dest, x, y) {
        const volume = this.volume[x][y];
        if (!volume)
            return;
        const cell = this.map.cell(x, y);
        const tile = cell.depthTile(this.depth);
        if (tile) {
            const opacity = this.calcOpacity(volume);
            dest.drawSprite(tile.sprite, opacity);
        }
    }
}

class Map {
    constructor(width, height, opts = {}) {
        this.width = width;
        this.height = height;
        this.flags = { map: 0 };
        this.layers = [];
        this.cells = make$a(width, height, () => new Cell());
        this.memory = make$a(width, height, () => new CellMemory());
        this.light = new LightSystem(this, opts);
        this.fov = new FovSystem(this, opts);
        this.properties = {};
        this.initLayers();
    }
    cellInfo(x, y, useMemory = false) {
        if (useMemory)
            return this.memory[x][y];
        return this.cell(x, y);
    }
    // LAYERS
    initLayers() {
        this.addLayer(Depth$1.GROUND, new TileLayer(this, 'ground'));
        this.addLayer(Depth$1.SURFACE, new FireLayer(this, 'surface'));
        this.addLayer(Depth$1.GAS, new GasLayer(this, 'gas'));
        this.addLayer(Depth$1.ITEM, new ItemLayer(this, 'item'));
        this.addLayer(Depth$1.ACTOR, new ActorLayer(this, 'actor'));
    }
    addLayer(depth, layer) {
        if (typeof depth !== 'number') {
            depth = Depth$1[depth];
        }
        layer.depth = depth;
        this.layers[depth] = layer;
    }
    removeLayer(depth) {
        if (typeof depth !== 'number') {
            depth = Depth$1[depth];
        }
        if (!depth)
            throw new Error('Cannot remove layer with depth=0.');
        delete this.layers[depth];
    }
    getLayer(depth) {
        if (typeof depth !== 'number') {
            depth = Depth$1[depth];
        }
        return this.layers[depth] || null;
    }
    hasXY(x, y) {
        return this.cells.hasXY(x, y);
    }
    isBoundaryXY(x, y) {
        return x == 0 || y == 0 || x == this.width - 1 || y == this.height - 1;
    }
    cell(x, y) {
        return this.cells[x][y];
    }
    get(x, y) {
        return this.cells.get(x, y);
    }
    eachCell(cb) {
        this.cells.forEach((cell, x, y) => cb(cell, x, y, this));
    }
    // DRAW
    drawInto(dest, opts = {}) {
        const buffer = dest instanceof Canvas ? dest.buffer : dest;
        if (typeof opts === 'boolean')
            opts = { force: opts };
        const mixer = new Mixer();
        for (let x = 0; x < buffer.width; ++x) {
            for (let y = 0; y < buffer.height; ++y) {
                this.getAppearanceAt(x, y, mixer);
                buffer.drawSprite(x, y, mixer);
            }
        }
    }
    // items
    itemAt(x, y) {
        return this.cell(x, y).item;
    }
    eachItem(cb) {
        this.cells.forEach((cell) => {
            eachChain(cell.item, cb);
        });
    }
    addItem(x, y, item) {
        const layer = this.layers[item.depth];
        return layer.add(x, y, item);
    }
    removeItem(item) {
        const layer = this.layers[item.depth];
        return layer.remove(item);
    }
    moveItem(item, x, y) {
        const layer = this.layers[item.depth];
        if (!layer.remove(item))
            return false;
        return layer.add(x, y, item);
    }
    // Actors
    hasPlayer(x, y) {
        return this.cell(x, y).hasPlayer();
    }
    actorAt(x, y) {
        return this.cell(x, y).actor;
    }
    eachActor(cb) {
        this.cells.forEach((cell) => {
            eachChain(cell.actor, cb);
        });
    }
    addActor(x, y, item) {
        const layer = this.layers[item.depth];
        return layer.add(x, y, item);
    }
    removeActor(item) {
        const layer = this.layers[item.depth];
        return layer.remove(item);
    }
    moveActor(item, x, y) {
        const layer = this.layers[item.depth];
        if (!layer.remove(item))
            return false;
        return layer.add(x, y, item);
    }
    // Information
    isVisible(x, y) {
        return this.fov.isAnyKindOfVisible(x, y);
    }
    count(cb) {
        return this.cells.count((cell, x, y) => cb(cell, x, y, this));
    }
    dump(fmt, log = console.log) {
        this.cells.dump(fmt || ((c) => c.dump()), log);
    }
    // flags
    hasMapFlag(flag) {
        return !!(this.flags.map & flag);
    }
    setMapFlag(flag) {
        this.flags.map |= flag;
    }
    clearMapFlag(flag) {
        this.flags.map &= ~flag;
    }
    setCellFlag(x, y, flag) {
        this.cell(x, y).setCellFlag(flag);
    }
    clearCellFlag(x, y, flag) {
        this.cell(x, y).clearCellFlag(flag);
    }
    // Skips all the logic checks and just forces a clean cell with the given tile
    fill(tile, boundary) {
        tile = get(tile);
        boundary = get(boundary || tile);
        let i, j;
        for (i = 0; i < this.width; ++i) {
            for (j = 0; j < this.height; ++j) {
                const cell = this.cell(i, j);
                cell.clear();
                cell.setTile(this.isBoundaryXY(i, j) ? boundary : tile);
            }
        }
    }
    hasTile(x, y, tile, useMemory = false) {
        return this.cellInfo(x, y, useMemory).hasTile(tile);
    }
    setTile(x, y, tile, opts) {
        if (!(tile instanceof Tile)) {
            tile = get(tile);
            if (!tile)
                return false;
        }
        if (opts === true) {
            opts = { superpriority: true };
        }
        const depth = tile.depth || 0;
        const layer = this.layers[depth] || this.layers[0];
        if (!(layer instanceof TileLayer))
            return false;
        return layer.set(x, y, tile, opts);
    }
    async tick(dt) {
        let didSomething = await this.fireAll('tick');
        for (let layer of this.layers) {
            if (layer && (await layer.tick(dt))) {
                didSomething = true;
            }
        }
        return didSomething;
    }
    copy(src) {
        if (this.constructor !== src.constructor)
            throw new Error('Maps must be same type to copy.');
        if (this.width !== src.width || this.height !== src.height)
            throw new Error('Maps must be same size to copy');
        this.cells.forEach((c, x, y) => {
            c.copy(src.cells[x][y]);
        });
        this.layers.forEach((l, depth) => {
            l.copy(src.layers[depth]);
        });
        this.flags.map = src.flags.map;
        this.light.setAmbient(src.light.getAmbient());
    }
    clone() {
        // @ts-ignore
        const other = new this.constructor(this.width, this.height);
        other.copy(this);
        return other;
    }
    async fire(event, x, y, ctx) {
        const cell = this.cell(x, y);
        return cell.activate(event, this, x, y, ctx);
    }
    async fireAll(event, ctx = {}) {
        let didSomething = false;
        const willFire = alloc(this.width, this.height);
        // Figure out which tiles will fire - before we change everything...
        this.cells.forEach((cell, x, y) => {
            cell.clearCellFlag(Cell$1.EVENT_FIRED_THIS_TURN | Cell$1.EVENT_PROTECTED);
            cell.eachTile((tile) => {
                const ev = tile.effects[event];
                if (!ev)
                    return;
                const effect = from$2(ev);
                if (!effect)
                    return;
                let promoteChance = 0;
                // < 0 means try to fire my neighbors...
                if (effect.chance < 0) {
                    promoteChance = 0;
                    eachNeighbor(x, y, (i, j) => {
                        const n = this.cell(i, j);
                        if (!n.hasObjectFlag(GameObject$1.L_BLOCKS_EFFECTS) &&
                            n.depthTile(tile.depth) !=
                                cell.depthTile(tile.depth) &&
                            !n.hasCellFlag(Cell$1.CAUGHT_FIRE_THIS_TURN)) {
                            // TODO - Should this break from the loop after doing this once or keep going?
                            promoteChance += -1 * effect.chance;
                        }
                    }, true);
                }
                else {
                    promoteChance = effect.chance || 100 * 100; // 100%
                }
                if (!cell.hasCellFlag(Cell$1.CAUGHT_FIRE_THIS_TURN) &&
                    random.chance(promoteChance, 10000)) {
                    willFire[x][y] |= fl(tile.depth);
                    // cell.flags.cellMech |= Cell.MechFlags.EVENT_FIRED_THIS_TURN;
                }
            });
        });
        // Then activate them - so that we don't activate the next generation as part of the forEach
        ctx.force = true;
        await willFire.forEachAsync(async (w, x, y) => {
            if (!w)
                return;
            const cell = this.cell(x, y);
            if (cell.hasCellFlag(Cell$1.EVENT_FIRED_THIS_TURN))
                return;
            for (let depth = 0; depth <= Depth$1.GAS; ++depth) {
                if (w & fl(depth)) {
                    await cell.activate(event, this, x, y, {
                        force: true,
                        depth,
                    });
                }
            }
        });
        free(willFire);
        return didSomething;
    }
    getAppearanceAt(x, y, dest) {
        dest.blackOut();
        const cell = this.cell(x, y);
        const isVisible = this.fov.isAnyKindOfVisible(x, y);
        if (cell.needsRedraw && isVisible) {
            this.layers.forEach((layer) => layer.putAppearance(dest, x, y));
            if (dest.dances) {
                cell.setCellFlag(Cell$1.COLORS_DANCE);
            }
            else {
                cell.clearCellFlag(Cell$1.COLORS_DANCE);
            }
            dest.bake();
            this.memory[x][y].putSnapshot(dest);
            cell.needsRedraw = false;
        }
        else {
            this.memory[x][y].getSnapshot(dest);
        }
        if (isVisible) {
            const light = this.light.getLight(x, y);
            dest.multiply(light);
        }
        else if (this.fov.isRevealed(x, y)) {
            dest.scale(50);
        }
        else {
            dest.blackOut();
        }
        if (cell.hasObjectFlag(GameObject$1.L_VISUALLY_DISTINCT)) {
            separate(dest.fg, dest.bg);
        }
    }
    // // LightSystemSite
    hasActor(x, y) {
        return this.cell(x, y).hasActor();
    }
    eachGlowLight(cb) {
        this.cells.forEach((cell, x, y) => {
            cell.eachGlowLight((light) => cb(x, y, light));
        });
    }
    eachDynamicLight(_cb) { }
    // FOV System Site
    eachViewport(_cb) {
        // TODO !!
    }
    lightingChanged() {
        return this.light.changed;
    }
    hasVisibleLight(x, y) {
        return !this.light.isDark(x, y);
    }
    blocksVision(x, y) {
        return this.cell(x, y).blocksVision();
    }
    onCellRevealed(_x, _y) {
        // if (DATA.automationActive) {
        // if (cell.item) {
        //     const theItem: GW.types.ItemType = cell.item;
        //     if (
        //         theItem.hasObjectFlag(ObjectFlags.L_INTERRUPT_WHEN_SEEN)
        //     ) {
        //         GW.message.add(
        //             '§you§ §see§ ΩitemMessageColorΩ§item§∆.',
        //             {
        //                 item: theItem,
        //                 actor: DATA.player,
        //             }
        //         );
        //     }
        // }
        // if (
        //     !(this.fov.isMagicMapped(x, y)) &&
        //     this.site.hasObjectFlag(
        //         x,
        //         y,
        //         ObjectFlags.L_INTERRUPT_WHEN_SEEN
        //     )
        // ) {
        //     const tile = cell.tileWithLayerFlag(
        //         ObjectFlags.L_INTERRUPT_WHEN_SEEN
        //     );
        //     if (tile) {
        //         GW.message.add(
        //             '§you§ §see§ ΩbackgroundMessageColorΩ§item§∆.',
        //             {
        //                 actor: DATA.player,
        //                 item: tile.name,
        //             }
        //         );
        //     }
        // }
    }
    redrawCell(x, y, clearMemory) {
        if (clearMemory) {
            this.clearMemory(x, y);
        }
        this.cells[x][y].needsRedraw = true;
    }
    clearMemory(x, y) {
        this.memory[x][y].clear();
    }
    storeMemory(x, y) {
        const cell = this.cell(x, y);
        this.memory[x][y].store(cell);
    }
}
function make(w, h, opts = {}, boundary) {
    if (typeof opts === 'string') {
        opts = { tile: opts };
    }
    if (boundary) {
        opts.boundary = boundary;
    }
    if (opts.tile === true) {
        opts.tile = 'FLOOR';
    }
    if (opts.boundary === true) {
        opts.boundary = 'WALL';
    }
    const map = new Map(w, h, opts);
    if (opts.tile) {
        map.fill(opts.tile, opts.boundary);
    }
    map.light.update();
    // if (!DATA.map) {
    //     DATA.map = map;
    // }
    return map;
}
function isString(value) {
    return typeof value === 'string';
}
function isStringArray(value) {
    return Array.isArray(value) && typeof value[0] === 'string';
}
function from(prefab, charToTile, opts = {}) {
    let height = 0;
    let width = 0;
    let map;
    if (isString(prefab)) {
        prefab = prefab.split('\n');
    }
    if (isStringArray(prefab)) {
        height = prefab.length;
        width = prefab.reduce((len, line) => Math.max(len, line.length), 0);
        map = make(width, height, opts);
        prefab.forEach((line, y) => {
            for (let x = 0; x < width; ++x) {
                const ch = line[x] || '.';
                const tile = charToTile[ch] || 'FLOOR';
                map.setTile(x, y, tile);
            }
        });
    }
    else {
        height = prefab.height;
        width = prefab.width;
        map = make(width, height, opts);
        prefab.forEach((v, x, y) => {
            const tile = charToTile[v] || 'FLOOR';
            map.setTile(x, y, tile);
        });
    }
    map.light.update();
    return map;
}

function analyze(map, updateChokeCounts = true) {
    updateLoopiness(map);
    updateChokepoints(map, updateChokeCounts);
}
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
// TODO - Move to Map?
function updateChokepoints(map, updateCounts) {
    const passMap = alloc(map.width, map.height);
    const grid$1 = alloc(map.width, map.height);
    for (let i = 0; i < map.width; i++) {
        for (let j = 0; j < map.height; j++) {
            const cell = map.cell(i, j);
            if ((cell.blocksPathing() || cell.blocksMove()) &&
                !cell.hasObjectFlag(GameObject$1.L_SECRETLY_PASSABLE)) {
                // cell.flags &= ~CellFlags.IS_IN_LOOP;
                passMap[i][j] = 0;
            }
            else {
                // cell.flags |= CellFlags.IS_IN_LOOP;
                passMap[i][j] = 1;
            }
        }
    }
    let passableArcCount;
    // done finding loops; now flag chokepoints
    for (let i = 1; i < passMap.width - 1; i++) {
        for (let j = 1; j < passMap.height - 1; j++) {
            map.cell(i, j).flags.cell &= ~Cell$1.IS_CHOKEPOINT;
            if (passMap[i][j] &&
                !(map.cell(i, j).flags.cell & Cell$1.IS_IN_LOOP)) {
                passableArcCount = 0;
                for (let dir = 0; dir < 8; dir++) {
                    const oldX = i + CLOCK_DIRS[(dir + 7) % 8][0];
                    const oldY = j + CLOCK_DIRS[(dir + 7) % 8][1];
                    const newX = i + CLOCK_DIRS[dir][0];
                    const newY = j + CLOCK_DIRS[dir][1];
                    if ((map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
                        passMap[newX][newY]) !=
                        (map.hasXY(oldX, oldY) && // RUT.Map.makeValidXy(map, oldXy) &&
                            passMap[oldX][oldY])) {
                        if (++passableArcCount > 2) {
                            if ((!passMap[i - 1][j] && !passMap[i + 1][j]) ||
                                (!passMap[i][j - 1] && !passMap[i][j + 1])) {
                                map.cell(i, j).flags.cell |=
                                    Cell$1.IS_CHOKEPOINT;
                            }
                            break;
                        }
                    }
                }
            }
        }
    }
    if (updateCounts) {
        // Done finding chokepoints; now create a chokepoint map.
        // The chokepoint map is a number for each passable tile. If the tile is a chokepoint,
        // then the number indicates the number of tiles that would be rendered unreachable if the
        // chokepoint were blocked. If the tile is not a chokepoint, then the number indicates
        // the number of tiles that would be rendered unreachable if the nearest exit chokepoint
        // were blocked.
        // The cost of all of this is one depth-first flood-fill per open point that is adjacent to a chokepoint.
        // Start by setting the chokepoint values really high, and roping off room machines.
        for (let i = 0; i < map.width; i++) {
            for (let j = 0; j < map.height; j++) {
                map.cell(i, j).chokeCount = 30000;
                if (map.cell(i, j).flags.cell & Cell$1.IS_IN_ROOM_MACHINE) {
                    passMap[i][j] = 0;
                }
            }
        }
        // Scan through and find a chokepoint next to an open point.
        for (let i = 0; i < map.width; i++) {
            for (let j = 0; j < map.height; j++) {
                const cell = map.cell(i, j);
                if (passMap[i][j] &&
                    cell.flags.cell & Cell$1.IS_CHOKEPOINT) {
                    for (let dir = 0; dir < 4; dir++) {
                        const newX = i + DIRS$2[dir][0];
                        const newY = j + DIRS$2[dir][1];
                        if (map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
                            passMap[newX][newY] &&
                            !(map.cell(newX, newY).flags.cell &
                                Cell$1.IS_CHOKEPOINT)) {
                            // OK, (newX, newY) is an open point and (i, j) is a chokepoint.
                            // Pretend (i, j) is blocked by changing passMap, and run a flood-fill cell count starting on (newX, newY).
                            // Keep track of the flooded region in grid[][].
                            grid$1.fill(0);
                            passMap[i][j] = 0;
                            let cellCount = floodFillCount(map, grid$1, passMap, newX, newY);
                            passMap[i][j] = 1;
                            // CellCount is the size of the region that would be obstructed if the chokepoint were blocked.
                            // CellCounts less than 4 are not useful, so we skip those cases.
                            if (cellCount >= 4) {
                                // Now, on the chokemap, all of those flooded cells should take the lesser of their current value or this resultant number.
                                for (let i2 = 0; i2 < grid$1.width; i2++) {
                                    for (let j2 = 0; j2 < grid$1.height; j2++) {
                                        if (grid$1[i2][j2] &&
                                            cellCount <
                                                map.cell(i2, j2).chokeCount) {
                                            map.cell(i2, j2).chokeCount = cellCount;
                                            map.cell(i2, j2).flags.cell &= ~Cell$1.IS_GATE_SITE;
                                        }
                                    }
                                }
                                // The chokepoint itself should also take the lesser of its current value or the flood count.
                                if (cellCount < cell.chokeCount) {
                                    cell.chokeCount = cellCount;
                                    cell.flags.cell |= Cell$1.IS_GATE_SITE;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    free(passMap);
    free(grid$1);
}
// Assumes it is called with respect to a passable (startX, startY), and that the same is not already included in results.
// Returns 10000 if the area included an area machine.
function floodFillCount(map, results, passMap, startX, startY) {
    let count = passMap[startX][startY] == 2 ? 5000 : 1;
    if (map.cell(startX, startY).flags.cell & Cell$1.IS_IN_AREA_MACHINE) {
        count = 10000;
    }
    results[startX][startY] = 1;
    for (let dir = 0; dir < 4; dir++) {
        const newX = startX + DIRS$2[dir][0];
        const newY = startY + DIRS$2[dir][1];
        if (map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
            passMap[newX][newY] &&
            !results[newX][newY]) {
            count += floodFillCount(map, results, passMap, newX, newY);
        }
    }
    return Math.min(count, 10000);
}
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
// TODO = Move loopiness to Map
function updateLoopiness(map) {
    map.eachCell(resetLoopiness);
    map.eachCell(checkLoopiness);
    cleanLoopiness(map);
}
function resetLoopiness(cell, _x, _y, _map) {
    if ((cell.blocksPathing() || cell.blocksMove()) &&
        !cell.hasObjectFlag(GameObject$1.L_SECRETLY_PASSABLE)) {
        cell.flags.cell &= ~Cell$1.IS_IN_LOOP;
        // passMap[i][j] = false;
    }
    else {
        cell.flags.cell |= Cell$1.IS_IN_LOOP;
        // passMap[i][j] = true;
    }
}
function checkLoopiness(cell, x, y, map) {
    let inString;
    let newX, newY, dir, sdir;
    let numStrings, maxStringLength, currentStringLength;
    if (!cell || !(cell.flags.cell & Cell$1.IS_IN_LOOP)) {
        return false;
    }
    // find an unloopy neighbor to start on
    for (sdir = 0; sdir < 8; sdir++) {
        newX = x + CLOCK_DIRS[sdir][0];
        newY = y + CLOCK_DIRS[sdir][1];
        if (!map.hasXY(newX, newY))
            continue;
        const cell = map.get(newX, newY);
        if (!cell || !(cell.flags.cell & Cell$1.IS_IN_LOOP)) {
            break;
        }
    }
    if (sdir == 8) {
        // no unloopy neighbors
        return false; // leave cell loopy
    }
    // starting on this unloopy neighbor,
    // work clockwise and count up:
    // (a) the number of strings of loopy neighbors, and
    // (b) the length of the longest such string.
    numStrings = maxStringLength = currentStringLength = 0;
    inString = false;
    for (dir = sdir; dir < sdir + 8; dir++) {
        newX = x + CLOCK_DIRS[dir % 8][0];
        newY = y + CLOCK_DIRS[dir % 8][1];
        if (!map.hasXY(newX, newY))
            continue;
        const newCell = map.get(newX, newY);
        if (newCell && newCell.flags.cell & Cell$1.IS_IN_LOOP) {
            currentStringLength++;
            if (!inString) {
                if (numStrings > 0) {
                    return false; // more than one string here; leave loopy
                }
                numStrings++;
                inString = true;
            }
        }
        else if (inString) {
            if (currentStringLength > maxStringLength) {
                maxStringLength = currentStringLength;
            }
            currentStringLength = 0;
            inString = false;
        }
    }
    if (inString && currentStringLength > maxStringLength) {
        maxStringLength = currentStringLength;
    }
    if (numStrings == 1 && maxStringLength <= 4) {
        cell.flags.cell &= ~Cell$1.IS_IN_LOOP;
        for (dir = 0; dir < 8; dir++) {
            const newX = x + CLOCK_DIRS[dir][0];
            const newY = y + CLOCK_DIRS[dir][1];
            if (map.hasXY(newX, newY)) {
                const newCell = map.cell(newX, newY);
                checkLoopiness(newCell, newX, newY, map);
            }
        }
        return true;
    }
    else {
        return false;
    }
}
function fillInnerLoopGrid(map, grid) {
    for (let x = 0; x < map.width; ++x) {
        for (let y = 0; y < map.height; ++y) {
            const cell = map.cell(x, y);
            if (cell.flags.cell & Cell$1.IS_IN_LOOP) {
                grid[x][y] = 1;
            }
            else if (x > 0 && y > 0) {
                const up = map.cell(x, y - 1);
                const left = map.cell(x - 1, y);
                if (up.flags.cell & Cell$1.IS_IN_LOOP &&
                    left.flags.cell & Cell$1.IS_IN_LOOP) {
                    grid[x][y] = 1;
                }
            }
        }
    }
}
function cleanLoopiness(map) {
    // remove extraneous loop markings
    const grid$1 = alloc(map.width, map.height);
    fillInnerLoopGrid(map, grid$1);
    // const xy = { x: 0, y: 0 };
    let designationSurvives;
    for (let i = 0; i < grid$1.width; i++) {
        for (let j = 0; j < grid$1.height; j++) {
            const cell = map.cell(i, j);
            if (cell.flags.cell & Cell$1.IS_IN_LOOP) {
                designationSurvives = false;
                for (let dir = 0; dir < 8; dir++) {
                    let newX = i + CLOCK_DIRS[dir][0];
                    let newY = j + CLOCK_DIRS[dir][1];
                    if (map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, xy, newX, newY) &&
                        !grid$1[newX][newY] &&
                        !(map.cell(newX, newY).flags.cell &
                            Cell$1.IS_IN_LOOP)) {
                        designationSurvives = true;
                        break;
                    }
                }
                if (!designationSurvives) {
                    grid$1[i][j] = 1;
                    map.cell(i, j).flags.cell &= ~Cell$1.IS_IN_LOOP;
                }
            }
        }
    }
    free(grid$1);
}
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

class SpawnEffect {
    make(src, dest) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (!src.tile)
            return true; // no error
        let config = src.tile;
        if (typeof config === 'string') {
            const parts = config.split(/[,|]/).map((p) => p.trim());
            config = {
                tile: parts[0],
                grow: Number.parseInt(parts[1] || '0'),
                decrement: Number.parseInt(parts[2] || '0'),
            };
        }
        const info = {
            grow: (_b = (_a = config.grow) !== null && _a !== void 0 ? _a : config.spread) !== null && _b !== void 0 ? _b : 0,
            decrement: (_c = config.decrement) !== null && _c !== void 0 ? _c : 0,
            flags: from$5(Effect, config.flags),
            volume: (_d = config.volume) !== null && _d !== void 0 ? _d : 0,
            next: (_e = config.next) !== null && _e !== void 0 ? _e : null,
        };
        const id = (_f = config.tile) !== null && _f !== void 0 ? _f : config.id;
        if (typeof id === 'string') {
            info.tile = id;
        }
        else {
            throw new Error('Invalid tile spawn config: ' + id);
        }
        if (!info.tile) {
            throw new Error('Must have tile.');
        }
        const match = (_g = config.matchTile) !== null && _g !== void 0 ? _g : config.match;
        if (typeof match === 'string') {
            info.matchTile = match;
        }
        else if (match) {
            throw new Error('Invalid tile spawn match tile: ' + config.matchTile);
        }
        dest.tile = info;
        return true;
    }
    async fire(effect, map, x, y, ctx) {
        let didSomething = false;
        const spawned = this.fireSync(effect, map, x, y, ctx);
        if (spawned) {
            didSomething = true;
            // await spawnMap.forEachAsync( (v, x, y) => {
            //     if (!v) return;
            //     await map.applyInstantEffects(x, y);
            // });
            // if (applyEffects) {
            // if (PLAYER.xLoc == i && PLAYER.yLoc == j && !PLAYER.status.levitating && refresh) {
            // 	flavorMessage(tileFlavor(PLAYER.xLoc, PLAYER.yLoc));
            // }
            // if (cell.actor || cell.item) {
            // 	for(let t of cell.tiles()) {
            // 		await t.applyInstantEffects(map, i, j, cell);
            // 		if (Data.gameHasEnded) {
            // 			return true;
            // 		}
            // 	}
            // }
            // if (tile.flags & TileFlags.T_IS_FIRE) {
            // 	if (cell.flags & CellFlags.HAS_ITEM) {
            // 		theItem = map.itemAt(i, j);
            // 		if (theItem.flags & Flags.Item.ITEM_FLAMMABLE) {
            // 			await burnItem(theItem);
            // 		}
            // 	}
            // }
            // }
        }
        // Grid.free(spawnMap);
        return didSomething;
    }
    fireSync(effect, map, x, y, ctx) {
        if (!effect.tile)
            return false; // did nothing
        const id = effect.tile.tile;
        const tile = tiles[id] || null;
        if (!tile) {
            throw new Error('Failed to find tile for effect: ' + id);
        }
        const abortIfBlocking = !!(effect.flags & Effect.E_ABORT_IF_BLOCKS_MAP);
        const isBlocking = !!(abortIfBlocking &&
            !(effect.flags & Effect.E_PERMIT_BLOCKING) &&
            (tile.blocksPathing() ||
                effect.flags & Effect.E_TREAT_AS_BLOCKING));
        let didSomething = false;
        didSomething = computeSpawnMap(effect, map, x, y, ctx);
        if (!didSomething) {
            return false;
        }
        if (abortIfBlocking &&
            isBlocking &&
            this.mapDisruptedBy(map, effect.grid)) {
            // Grid.free(spawnMap);
            return false;
        }
        if (effect.flags & Effect.E_EVACUATE_CREATURES) {
            // first, evacuate creatures, so that they do not re-trigger the tile.
            if (evacuateCreatures(map, ctx.grid)) {
                didSomething = true;
            }
        }
        if (effect.flags & Effect.E_EVACUATE_ITEMS) {
            // first, evacuate items, so that they do not re-trigger the tile.
            if (evacuateItems(map, ctx.grid)) {
                didSomething = true;
            }
        }
        if (effect.flags & Effect.E_CLEAR_CELL) {
            // first, clear other tiles (not base/ground)
            if (clearCells(map, ctx.grid, effect.flags)) {
                didSomething = true;
            }
        }
        const spawned = spawnTiles(effect.flags, ctx.grid, map, tile, effect.tile.volume);
        return spawned;
    }
    mapDisruptedBy(map, blockingGrid, blockingToMapX = 0, blockingToMapY = 0) {
        const walkableGrid = alloc(map.width, map.height);
        let disrupts = false;
        // Get all walkable locations after lake added
        forRect(map.width, map.height, (i, j) => {
            const lakeX = i + blockingToMapX;
            const lakeY = j + blockingToMapY;
            if (blockingGrid.get(lakeX, lakeY)) {
                if (map.cellInfo(i, j).isStairs()) {
                    disrupts = true;
                }
            }
            else if (!map.cellInfo(i, j).blocksMove()) {
                walkableGrid[i][j] = 1;
            }
        });
        let first = true;
        for (let i = 0; i < walkableGrid.width && !disrupts; ++i) {
            for (let j = 0; j < walkableGrid.height && !disrupts; ++j) {
                if (walkableGrid[i][j] == 1) {
                    if (first) {
                        walkableGrid.floodFill(i, j, 1, 2);
                        first = false;
                    }
                    else {
                        disrupts = true;
                    }
                }
            }
        }
        // console.log('WALKABLE GRID');
        // walkableGrid.dump();
        free(walkableGrid);
        return disrupts;
    }
}
installType('tile', new SpawnEffect());
// tick
// Spawn
function spawnTiles(flags, spawnMap, map, tile, volume = 0) {
    let i, j;
    let accomplishedSomething;
    accomplishedSomething = false;
    const blockedByOtherLayers = !!(flags & Effect.E_BLOCKED_BY_OTHER_LAYERS);
    const superpriority = !!(flags & Effect.E_SUPERPRIORITY);
    const blockedByActors = !!(flags & Effect.E_BLOCKED_BY_ACTORS);
    const blockedByItems = !!(flags & Effect.E_BLOCKED_BY_ITEMS);
    // const applyEffects = ctx.refreshCell;
    volume = volume || 0; // (tile ? tile.volume : 0);
    for (i = 0; i < spawnMap.width; i++) {
        for (j = 0; j < spawnMap.height; j++) {
            if (!spawnMap[i][j])
                continue; // If it's not flagged for building in the spawn map,
            // const isRoot = spawnMap[i][j] === 1;
            spawnMap[i][j] = 0; // so that the spawnmap reflects what actually got built
            const cell = map.cell(i, j);
            if (cell.hasTile(tile)) ;
            else if (map.setTile(i, j, tile, {
                volume,
                superpriority,
                blockedByOtherLayers,
                blockedByActors,
                blockedByItems,
            })) {
                // if the fill won't violate the priority of the most important terrain in this cell:
                spawnMap[i][j] = 1; // so that the spawnmap reflects what actually got built
                // map.redrawCell(cell);
                // if (volume && cell.gas) {
                //     cell.volume += (feat.volume || 0);
                // }
                cell.flags.cell |= Cell$1.EVENT_FIRED_THIS_TURN;
                if (flags & Effect.E_PROTECTED) {
                    cell.flags.cell |= Cell$1.EVENT_PROTECTED;
                }
                accomplishedSomething = true;
                // debug('- tile', i, j, 'tile=', tile.id);
            }
        }
    }
    if (accomplishedSomething) {
        map.setMapFlag(Map$1.MAP_CHANGED);
    }
    return accomplishedSomething;
}
// Spread
function cellIsOk(effect, map, x, y, isStart) {
    if (!map.hasXY(x, y))
        return false;
    const cell = map.cell(x, y);
    if (cell.hasCellFlag(Cell$1.EVENT_PROTECTED))
        return false;
    if (cell.blocksEffects() && !effect.tile.matchTile && !isStart) {
        return false;
    }
    if (effect.flags & Effect.E_BUILD_IN_WALLS) {
        if (!map.cellInfo(x, y).isWall())
            return false;
    }
    else if (effect.flags & Effect.E_MUST_TOUCH_WALLS) {
        let ok = false;
        eachNeighbor(x, y, (i, j) => {
            if (map.cellInfo(i, j).isWall()) {
                ok = true;
            }
        }, true);
        if (!ok)
            return false;
    }
    else if (effect.flags & Effect.E_NO_TOUCH_WALLS) {
        let ok = true;
        if (map.cellInfo(x, y).isWall())
            return false; // or on wall
        eachNeighbor(x, y, (i, j) => {
            if (map.cellInfo(i, j).isWall()) {
                ok = false;
            }
        }, true);
        if (!ok)
            return false;
    }
    // if (ctx.bounds && !ctx.bounds.containsXY(x, y)) return false;
    if (effect.tile.matchTile &&
        !isStart &&
        !cell.hasTile(effect.tile.matchTile)) {
        return false;
    }
    return true;
}
function computeSpawnMap(effect, map, x, y, ctx) {
    let i, j, dir, t, x2, y2;
    let madeChange;
    // const bounds = ctx.bounds || null;
    // if (bounds) {
    //   // Activation.debug('- bounds', bounds);
    // }
    const config = effect.tile;
    let startProb = config.grow || 0;
    let probDec = config.decrement || 0;
    const spawnMap = ctx.grid;
    spawnMap.fill(0);
    if (!cellIsOk(effect, map, x, y, true)) {
        return false;
    }
    spawnMap[x][y] = t = 1; // incremented before anything else happens
    let count = 1;
    if (startProb) {
        madeChange = true;
        if (startProb >= 100) {
            probDec = probDec || 100;
        }
        if (probDec <= 0) {
            probDec = startProb;
        }
        while (madeChange && startProb > 0) {
            madeChange = false;
            t++;
            for (i = 0; i < map.width; i++) {
                for (j = 0; j < map.height; j++) {
                    if (spawnMap[i][j] == t - 1) {
                        for (dir = 0; dir < 4; dir++) {
                            x2 = i + DIRS$2[dir][0];
                            y2 = j + DIRS$2[dir][1];
                            if (spawnMap.hasXY(x2, y2) &&
                                !spawnMap[x2][y2] &&
                                random.chance(startProb) &&
                                cellIsOk(effect, map, x2, y2, false)) {
                                spawnMap[x2][y2] = t;
                                madeChange = true;
                                ++count;
                            }
                        }
                    }
                }
            }
            startProb -= probDec;
        }
    }
    return count > 0;
}
// export function spreadCircle(
//     this: any,
//     ctx: Effect.EffectCtx,
//     spawnMap: Grid.NumGrid
// ) {
//     const x = ctx.x;
//     const y = ctx.y;
//     let startProb = this.spread || 0;
//     let probDec = this.decrement || 0;
//     spawnMap.fill(0);
//     spawnMap[x][y] = 1; // incremented before anything else happens
//     let radius = 0;
//     startProb = startProb || 100;
//     if (startProb >= 100) {
//         probDec = probDec || 100;
//     }
//     while (GW.random.chance(startProb)) {
//         startProb -= probDec;
//         ++radius;
//     }
//     // startProb = 100;
//     // probDec = 0;
//     spawnMap.updateCircle(x, y, radius, (_v, i, j) => {
//         if (!cellIsOk(this, i, j, ctx)) return 0;
//         // const dist = Math.floor(Utils.distanceBetween(x, y, i, j));
//         // const prob = startProb - dist * probDec;
//         // if (!random.chance(prob)) return 0;
//         return 1;
//     });
//     // spawnMap[x][y] = 1;
//     // if (!isOk(flags, x, y, ctx)) {
//     //     spawnMap[x][y] = 0;
//     // }
//     return true;
// }
// export function spreadLine(
//     this: any,
//     ctx: Effect.EffectCtx,
//     spawnMap: Grid.NumGrid
// ) {
//     let x2, y2;
//     let madeChange;
//     const x = ctx.x;
//     const y = ctx.y;
//     let startProb = this.spread || 0;
//     let probDec = this.decrement || 0;
//     spawnMap.fill(0);
//     spawnMap[x][y] = 1; // incremented before anything else happens
//     if (startProb) {
//         madeChange = true;
//         if (startProb >= 100) {
//             probDec = probDec || 100;
//         }
//         x2 = x;
//         y2 = y;
//         const dir = Utils.DIRS[GW.random.number(4)];
//         while (madeChange) {
//             madeChange = false;
//             x2 = x2 + dir[0];
//             y2 = y2 + dir[1];
//             if (
//                 spawnMap.hasXY(x2, y2) &&
//                 !spawnMap[x2][y2] &&
//                 cellIsOk(this, x2, y2, ctx) &&
//                 GW.random.chance(startProb)
//             ) {
//                 spawnMap[x2][y2] = 1;
//                 madeChange = true;
//                 startProb -= probDec;
//             }
//         }
//     }
//     if (!cellIsOk(this, x, y, ctx)) {
//         spawnMap[x][y] = 0;
//     }
//     return true;
// }
function clearCells(map, spawnMap, flags = 0) {
    let didSomething = false;
    const clearAll = (flags & Effect.E_CLEAR_CELL) === Effect.E_CLEAR_CELL;
    spawnMap.forEach((v, i, j) => {
        if (!v)
            return;
        const cell = map.cell(i, j);
        if (clearAll) {
            cell.clear();
        }
        else {
            if (flags & Effect.E_CLEAR_GAS) {
                cell.clearDepth(Depth$1.GAS);
            }
            if (flags & Effect.E_CLEAR_LIQUID) {
                cell.clearDepth(Depth$1.LIQUID);
            }
            if (flags & Effect.E_CLEAR_SURFACE) {
                cell.clearDepth(Depth$1.SURFACE);
            }
            if (flags & Effect.E_CLEAR_GROUND) {
                cell.clearDepth(Depth$1.GROUND);
            }
        }
        didSomething = true;
    });
    return didSomething;
}
function evacuateCreatures(map, blockingMap) {
    let i = 0, j = 0;
    let didSomething = false;
    for (i = 0; i < map.width; i++) {
        for (j = 0; j < map.height; j++) {
            if (!blockingMap[i][j])
                continue;
            const cell = map.cell(i, j);
            if (!cell.hasActor())
                continue;
            eachChain(cell.actor, (obj) => {
                if (!(obj instanceof Actor))
                    return;
                const monst = obj;
                const loc = random.matchingLocNear(i, j, (x, y) => {
                    if (!map.hasXY(x, y))
                        return false;
                    if (blockingMap[x][y])
                        return false;
                    const c = map.cell(x, y);
                    return !monst.forbidsCell(c);
                });
                if (loc && loc[0] >= 0 && loc[1] >= 0) {
                    map.moveActor(monst, loc[0], loc[1]);
                    // map.redrawXY(loc[0], loc[1]);
                    didSomething = true;
                }
            });
        }
    }
    return didSomething;
}
function evacuateItems(map, blockingMap) {
    let didSomething = false;
    blockingMap.forEach((v, i, j) => {
        if (!v)
            return;
        const cell = map.cell(i, j);
        if (!cell.hasItem())
            return;
        eachChain(cell.item, (obj) => {
            if (!(obj instanceof Item))
                return;
            const item = obj;
            const loc = random.matchingLocNear(i, j, (x, y) => {
                if (!map.hasXY(x, y))
                    return false;
                if (blockingMap[x][y])
                    return false;
                const dest = map.cell(x, y);
                return !item.forbidsCell(dest);
            });
            if (loc && loc[0] >= 0 && loc[1] >= 0) {
                map.moveItem(item, loc[0], loc[1]);
                // map.redrawXY(loc[0], loc[1]);
                didSomething = true;
            }
        });
    });
    return didSomething;
}
class ClearTileEffect {
    make(src, dest) {
        if (!src.clear)
            return true;
        let config = src.clear;
        let layers = 0;
        if (typeof config === 'string') {
            config = config.split(/[,|]/).map((t) => t.trim());
        }
        if (config === true) {
            layers = Depth$1.ALL_LAYERS;
        }
        else if (typeof config === 'number') {
            layers = config;
        }
        else if (Array.isArray(config)) {
            layers = config.reduce((out, v) => {
                if (typeof v === 'number')
                    return out | v;
                const depth = Depth$1[v] ||
                    0;
                return out | depth;
            }, 0);
        }
        else {
            throw new Error('clear effect must have number or string config.');
        }
        dest.clear = layers;
        return layers > 0;
    }
    fire(config, map, x, y, ctx) {
        return this.fireSync(config, map, x, y, ctx);
    }
    fireSync(config, map, x, y, _ctx) {
        if (!config.clear)
            return false;
        if (!map)
            return false;
        const cell = map.cell(x, y);
        return cell.clearDepth(config.clear);
    }
}
installType('clear', new ClearTileEffect());

const flags = { Cell: Cell$1, Map: Map$1, GameObject: GameObject$1, Depth: Depth$1, Tile: Tile$1 };

var index = {
    __proto__: null,
    flags: flags,
    Cell: Cell,
    Map: Map,
    make: make,
    from: from,
    analyze: analyze,
    updateChokepoints: updateChokepoints,
    floodFillCount: floodFillCount,
    updateLoopiness: updateLoopiness,
    resetLoopiness: resetLoopiness,
    checkLoopiness: checkLoopiness,
    fillInnerLoopGrid: fillInnerLoopGrid,
    cleanLoopiness: cleanLoopiness,
    SpawnEffect: SpawnEffect,
    spawnTiles: spawnTiles,
    computeSpawnMap: computeSpawnMap,
    clearCells: clearCells,
    evacuateCreatures: evacuateCreatures,
    evacuateItems: evacuateItems,
    CellMemory: CellMemory,
    MapLayer: MapLayer,
    ActorLayer: ActorLayer,
    ItemLayer: ItemLayer,
    TileLayer: TileLayer,
    GasLayer: GasLayer,
    FireLayer: FireLayer
};

export { Random, index$2 as actor, blob, index$8 as canvas, index$a as color, colors, config$1 as config, cosmetic, data, index$6 as effect, events, flag, index$b as fov, frequency, index$4 as gameObject, grid, io, index$3 as item, index$5 as light, loop, index as map, message, path, random, range, scheduler, index$7 as sprite, sprites, index$9 as text, index$1 as tile, types, index$c as utils };
