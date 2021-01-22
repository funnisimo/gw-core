'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
const DIRS = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, -1],
    [-1, 1],
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
function IS_ZERO(x) { return x == 0; }
function IS_NONZERO(x) { return x != 0; }
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
function copyXY(dest, src) {
    dest.x = x(src);
    dest.y = y(src);
}
function addXY(dest, src) {
    dest.x += x(src);
    dest.y += y(src);
}
function equalsXY(dest, src) {
    return dest.x == x(src) && dest.y == y(src);
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
    return DIRS.findIndex((a) => a[0] == x0 && a[1] == y0);
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
    if (typeof omit === "string") {
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
    Object.keys(def).forEach((key) => {
        const origKey = key;
        let defValue = def[key];
        dest = obj;
        // allow for => 'stats.health': 100
        const parts = key.split(".");
        while (parts.length > 1) {
            key = parts.shift();
            if (dest[key] === undefined) {
                dest = dest[key] = {};
            }
            else if (typeof dest[key] !== "object") {
                ERROR("Trying to set default member on non-object config item: " + origKey);
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
            else if (typeof defValue === "object") {
                dest[key] = defValue; // Object.assign({}, defValue); -- this breaks assigning a Color object as a default...
            }
            else {
                dest[key] = defValue;
            }
        }
    });
}
function kindDefaults(obj, def) {
    function custom(dest, key, current, defValue) {
        if (key.search(/[fF]lags$/) < 0)
            return false;
        if (!current) {
            current = [];
        }
        else if (typeof current == "string") {
            current = current.split(/[,|]/).map((t) => t.trim());
        }
        else if (!Array.isArray(current)) {
            current = [current];
        }
        if (typeof defValue === "string") {
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
        if (typeof arg !== "object" || Array.isArray(arg)) {
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

var utils = {
    __proto__: null,
    DIRS: DIRS,
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
    copyXY: copyXY,
    addXY: addXY,
    equalsXY: equalsXY,
    lerpXY: lerpXY,
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
    chainLength: chainLength,
    chainIncludes: chainIncludes,
    eachChain: eachChain,
    addToChain: addToChain,
    removeFromChain: removeFromChain,
    forLine: forLine,
    getLine: getLine,
    getLineThru: getLineThru
};

const RANDOM_CONFIG = {
    make: () => {
        return Math.random.bind(Math);
    },
};
function lotteryDrawArray(rand, frequencies) {
    let i, maxFreq, randIndex;
    maxFreq = 0;
    for (i = 0; i < frequencies.length; i++) {
        maxFreq += frequencies[i];
    }
    if (maxFreq <= 0) {
        console.warn("Lottery Draw - no frequencies", frequencies, frequencies.length);
        return 0;
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
    console.warn("Lottery Draw failed.", frequencies, frequencies.length);
    return 0;
}
function lotteryDrawObject(rand, weights) {
    const entries = Object.entries(weights);
    const frequencies = entries.map(([_, weight]) => weight);
    const index = lotteryDrawArray(rand, frequencies);
    return entries[index][0];
}
class Random {
    constructor() {
        this._fn = RANDOM_CONFIG.make();
    }
    static configure(opts) {
        if (opts.make) {
            if (typeof opts.make !== "function")
                throw new Error("Random make parameter must be a function.");
            if (typeof opts.make(12345) !== "function")
                throw new Error("Random make function must accept a numeric seed and return a random function.");
            RANDOM_CONFIG.make = opts.make;
            random.seed();
            cosmetic.seed();
        }
    }
    seed(val) {
        this._fn = RANDOM_CONFIG.make(val);
    }
    value() {
        return this._fn();
    }
    float() {
        return this.value();
    }
    number(max) {
        // @ts-ignore
        if (max <= 0)
            return 0;
        max = max || Number.MAX_SAFE_INTEGER;
        return Math.floor(this._fn() * max);
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
}
const random = new Random();
const cosmetic = new Random();

const data = {};
const config = {};
const make = {};
const flags = {};

class Range {
    constructor(lower, upper = 0, clumps = 1, rng) {
        this._rng = rng || random;
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
        return this._rng.clumped(this.lo, this.hi, this.clumps);
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
            return "" + this.lo;
        }
        return `${this.lo}-${this.hi}`;
    }
}
function make$1(config, rng) {
    if (!config)
        return new Range(0, 0, 0, rng);
    if (config instanceof Range)
        return config; // don't need to clone since they are immutable
    // if (config.value) return config;  // calc or damage
    if (typeof config == "function")
        throw new Error("Custom range functions not supported - extend Range");
    if (config === undefined || config === null)
        return new Range(0, 0, 0, rng);
    if (typeof config == "number")
        return new Range(config, config, 1, rng);
    // @ts-ignore
    if (config === true || config === false)
        throw new Error("Invalid random config: " + config);
    if (Array.isArray(config)) {
        return new Range(config[0], config[1], config[2], rng);
    }
    if (typeof config !== "string") {
        throw new Error("Calculations must be strings.  Received: " + JSON.stringify(config));
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
    throw new Error("Not a valid range - " + config);
}
make.range = make$1;
const from = make$1;

var range = {
    __proto__: null,
    Range: Range,
    make: make$1,
    from: from
};

///////////////////////////////////
// FLAG
function fl(N) {
    return 1 << N;
}
function toString(flagObj, value) {
    const inverse = Object.entries(flagObj).reduce((out, entry) => {
        const [key, value] = entry;
        if (typeof value === "number")
            out[value] = key;
        return out;
    }, []);
    const out = [];
    for (let index = 0; index < 32; ++index) {
        const fl = 1 << index;
        if (value & fl) {
            out.push(inverse[fl]);
        }
    }
    return out.join(" | ");
}
function from$1(obj, ...args) {
    let result = 0;
    for (let index = 0; index < args.length; ++index) {
        let value = args[index];
        if (value === undefined)
            continue;
        if (typeof value == "number") {
            result |= value;
            continue; // next
        }
        else if (typeof value === "string") {
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
                if (typeof v == "string") {
                    v = v.trim();
                    if (v.startsWith("!")) {
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
    from: from$1
};

const DIRS$1 = DIRS;
const CDIRS = CLOCK_DIRS;
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
        return " ";
    }
    else if (v === true) {
        return "T";
    }
    else if (v < 10) {
        return "" + v;
    }
    else if (v < 36) {
        return String.fromCharCode("a".charCodeAt(0) + v - 10);
    }
    else if (v < 62) {
        return String.fromCharCode("A".charCodeAt(0) + v - 10 - 26);
    }
    else if (typeof v === "string") {
        return v[0];
    }
    else {
        return "#";
    }
}
class Grid extends Array {
    constructor(w, h, v) {
        super(w);
        for (let x = 0; x < w; ++x) {
            if (typeof v === "function") {
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
    eachNeighbor(x, y, fn, only4dirs = false) {
        const maxIndex = only4dirs ? 4 : 8;
        for (let d = 0; d < maxIndex; ++d) {
            const dir = DIRS$1[d];
            const i = x + dir[0];
            const j = y + dir[1];
            if (this.hasXY(i, j)) {
                fn(this[i][j], i, j, this);
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
                    (i - x) * (i - x) + (j - y) * (j - y) < radius * radius + radius) {
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
        const bounds = { left: this.width, top: this.height, right: 0, bottom: 0 };
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
                    (i - x) * (i - x) + (j - y) * (j - y) < radius * radius + radius) {
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
        const fn = typeof v === "function" ? v : () => v;
        this.update(fn);
    }
    fillRect(x, y, w, h, v) {
        const fn = typeof v === "function" ? v : () => v;
        this.updateRect(x, y, w, h, fn);
    }
    fillCircle(x, y, radius, v) {
        const fn = typeof v === "function" ? v : () => v;
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
        const fn = typeof match === "function"
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
        left = clamp(left, 0, this.width - 2);
        top = clamp(top, 0, this.height - 2);
        const right = clamp(left + width, 1, this.width - 1);
        const bottom = clamp(top + height, 1, this.height - 1);
        let output = [];
        for (j = top; j <= bottom; j++) {
            let line = ("" + j + "]").padStart(3, " ");
            for (i = left; i <= right; i++) {
                if (i % 10 == 0) {
                    line += " ";
                }
                const v = this[i][j];
                line += fmtFn(v, i, j)[0];
            }
            output.push(line);
        }
        console.log(output.join("\n"));
    }
    dumpAround(x, y, radius) {
        this.dumpRect(x - radius, y - radius, 2 * radius, 2 * radius);
    }
    // TODO - Use for(radius) loop to speed this up (do not look at each cell)
    closestMatchingLoc(x, y, v) {
        let bestLoc = [-1, -1];
        let bestDistance = 100 * (this.width + this.height);
        const fn = typeof v === "function" ? v : (val) => val == v;
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
        const fn = typeof v === "function" ? v : (val) => val == v;
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
        const fn = typeof v === "function" ? v : (val) => val == v;
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
        const fn = typeof v === "function" ? v : (val) => val == v;
        candidateLocs = 0;
        // count up the number of candidate locations
        for (k = 0; k < Math.max(this.width, this.height) && !candidateLocs; k++) {
            for (i = x - k; i <= x + k; i++) {
                for (j = y - k; j <= y + k; j++) {
                    if (this.hasXY(i, j) &&
                        (i == x - k || i == x + k || j == y - k || j == y + k) &&
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
                        (i == x - k || i == x + k || j == y - k || j == y + k) &&
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
        testFn = testFn || IS_NONZERO;
        let arcCount = 0;
        let matchCount = 0;
        for (let dir = 0; dir < CDIRS.length; dir++) {
            oldX = x + CDIRS[(dir + 7) % 8][0];
            oldY = y + CDIRS[(dir + 7) % 8][1];
            newX = x + CDIRS[dir][0];
            newY = y + CDIRS[dir][1];
            // Counts every transition from passable to impassable or vice-versa on the way around the cell:
            const newOk = this.hasXY(newX, newY) && testFn(this[newX][newY], newX, newY, this);
            const oldOk = this.hasXY(oldX, oldY) && testFn(this[oldX][oldY], oldX, oldY, this);
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
class NumGrid extends Grid {
    constructor(w, h, v = 0) {
        super(w, h, v);
    }
    static alloc(w, h, v = 0) {
        if (!w || !h)
            throw new Error("Grid alloc requires width and height parameters.");
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
        const fn = typeof v === "function" ? v : () => v;
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
            throw new Error("Invalid grid flood fill");
        }
        const ok = (x, y) => {
            return this.hasXY(x, y) &&
                this[x][y] >= eligibleValueMin &&
                this[x][y] <= eligibleValueMax;
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
    randomLeastPositiveLoc(deterministic = false) {
        const targetValue = this.leastPositiveValue();
        return this.randomMatchingLoc(targetValue, deterministic);
    }
    // Marks a cell as being a member of blobNumber, then recursively iterates through the rest of the blob
    floodFill(x, y, matchValue, fillValue) {
        let dir;
        let newX, newY, numberOfCells = 1;
        const matchFn = typeof matchValue == "function"
            ? matchValue
            : (v) => v == matchValue;
        const fillFn = typeof fillValue == "function" ? fillValue : () => fillValue;
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
                for (dir = 0; dir < DIRS$1.length; dir++) {
                    newX = i + DIRS$1[dir][0];
                    newY = j + DIRS$1[dir][1];
                    if (this.hasXY(newX, newY) && buffer2[newX][newY]) {
                        nbCount++;
                    }
                }
                if (!buffer2[i][j] && birthParameters[nbCount] == "t") {
                    this[i][j] = 1; // birth
                    didSomething = true;
                }
                else if (buffer2[i][j] && survivalParameters[nbCount] == "t") ;
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
    fillBlob(roundCount, minBlobWidth, minBlobHeight, maxBlobWidth, maxBlobHeight, percentSeeded = 50, birthParameters = "ffffffttt", survivalParameters = "ffffttttt") {
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
                    this[i + left][j + top] = random.chance(percentSeeded) ? 1 : 0;
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
const alloc = NumGrid.alloc.bind(NumGrid);
const free = NumGrid.free.bind(NumGrid);
function make$2(w, h, v) {
    if (v === undefined)
        return new NumGrid(w, h, 0);
    if (typeof v === "number")
        return new NumGrid(w, h, v);
    return new Grid(w, h, v);
}
make.grid = make$2;
function offsetZip(destGrid, srcGrid, srcToDestX, srcToDestY, value) {
    const fn = typeof value === "function"
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
function directionOfDoorSite(grid, x, y, isOpen) {
    let dir, solutionDir;
    let newX, newY, oppX, oppY;
    const fnOpen = typeof isOpen === "function"
        ? isOpen
        : (v) => v == isOpen;
    solutionDir = NO_DIRECTION;
    for (dir = 0; dir < 4; dir++) {
        newX = x + DIRS$1[dir][0];
        newY = y + DIRS$1[dir][1];
        oppX = x - DIRS$1[dir][0];
        oppY = y - DIRS$1[dir][1];
        if (grid.hasXY(oppX, oppY) &&
            grid.hasXY(newX, newY) &&
            fnOpen(grid[oppX][oppY], oppX, oppY, grid)) {
            // This grid cell would be a valid tile on which to place a door that, facing outward, points dir.
            if (solutionDir != NO_DIRECTION) {
                // Already claimed by another direction; no doors here!
                return NO_DIRECTION;
            }
            solutionDir = dir;
        }
    }
    return solutionDir;
}
// Grid.directionOfDoorSite = directionOfDoorSite;
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
    make: make$2,
    offsetZip: offsetZip,
    directionOfDoorSite: directionOfDoorSite,
    intersection: intersection,
    unite: unite
};

var commands = {};
function addCommand(id, fn) {
    commands[id] = fn;
}
let KEYMAP = {};
const EVENTS = [];
const DEAD_EVENTS = [];
const LAST_CLICK = { x: -1, y: -1 };
const KEYPRESS = "keypress";
const MOUSEMOVE = "mousemove";
const CLICK = "click";
const TICK = "tick";
const MOUSEUP = "mouseup";
const CONTROL_CODES = [
    "ShiftLeft",
    "ShiftRight",
    "ControlLeft",
    "ControlRight",
    "AltLeft",
    "AltRight",
    "MetaLeft",
    "MetaRight",
];
var CURRENT_HANDLER = null;
var PAUSED = null;
function setKeymap(keymap) {
    KEYMAP = keymap;
}
function hasEvents() {
    return EVENTS.length;
}
function clearEvents() {
    while (EVENTS.length) {
        const ev = EVENTS.shift();
        DEAD_EVENTS.push(ev);
    }
}
function pushEvent(ev) {
    if (PAUSED) {
        console.log("PAUSED EVENT", ev.type);
    }
    if (EVENTS.length) {
        const last = EVENTS[EVENTS.length - 1];
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
        if (LAST_CLICK.x == ev.x && LAST_CLICK.y == ev.y) {
            recycleEvent(ev);
            return;
        }
        LAST_CLICK.x = ev.x;
        LAST_CLICK.y = ev.y;
    }
    else if (ev.type == MOUSEUP) {
        LAST_CLICK.x = -1;
        LAST_CLICK.y = -1;
        recycleEvent(ev);
        return;
    }
    if (CURRENT_HANDLER) {
        CURRENT_HANDLER(ev);
    }
    else if (ev.type === TICK) {
        const first = EVENTS[0];
        if (first && first.type === TICK) {
            first.dt += ev.dt;
            recycleEvent(ev);
            return;
        }
        EVENTS.unshift(ev); // ticks go first
    }
    else {
        EVENTS.push(ev);
    }
}
async function dispatchEvent(ev, km) {
    let result;
    let command;
    km = km || KEYMAP;
    if (typeof km === "function") {
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
        if (typeof command === "function") {
            result = await command.call(km, ev);
        }
        else if (commands[command]) {
            result = await commands[command](ev);
        }
        else {
            WARN("No command found: " + command);
        }
    }
    if ("next" in km && km.next === false) {
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
        key = "^" + key;
        code = "^" + code;
    }
    if (e.metaKey) {
        key = "#" + key;
        code = "#" + code;
    }
    if (e.altKey) {
        code = "/" + code;
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
    if (lowerKey === "arrowup") {
        return [0, -1];
    }
    else if (lowerKey === "arrowdown") {
        return [0, 1];
    }
    else if (lowerKey === "arrowleft") {
        return [-1, 0];
    }
    else if (lowerKey === "arrowright") {
        return [1, 0];
    }
    return null;
}
function ignoreKeyEvent(e) {
    return CONTROL_CODES.includes(e.code);
}
// MOUSE
var mouse = { x: -1, y: -1 };
function makeMouseEvent(e, x, y) {
    const ev = DEAD_EVENTS.pop() || {};
    ev.shiftKey = e.shiftKey;
    ev.ctrlKey = e.ctrlKey;
    ev.altKey = e.altKey;
    ev.metaKey = e.metaKey;
    ev.type = e.type;
    if (e.buttons && e.type !== "mouseup") {
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
// IO
function pauseEvents() {
    if (PAUSED)
        return;
    PAUSED = CURRENT_HANDLER;
    CURRENT_HANDLER = null;
    // io.debug('events paused');
}
function resumeEvents() {
    if (!PAUSED)
        return;
    if (CURRENT_HANDLER) {
        console.warn("overwrite CURRENT HANDLER!");
    }
    CURRENT_HANDLER = PAUSED;
    PAUSED = null;
    // io.debug('resuming events');
    if (EVENTS.length && CURRENT_HANDLER) {
        const e = EVENTS.shift();
        // io.debug('- processing paused event', e.type);
        CURRENT_HANDLER(e);
        // io.recycleEvent(e);	// DO NOT DO THIS B/C THE HANDLER MAY PUT IT BACK ON THE QUEUE (see tickMs)
    }
    // io.debug('events resumed');
}
function nextEvent(ms, match) {
    match = match || TRUE;
    let elapsed = 0;
    while (EVENTS.length) {
        const e = EVENTS.shift();
        if (e.type === MOUSEMOVE) {
            mouse.x = e.x;
            mouse.y = e.y;
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
    if (CURRENT_HANDLER) {
        console.warn("OVERWRITE HANDLER - nextEvent");
    }
    else if (EVENTS.length) {
        console.warn("SET HANDLER WITH QUEUED EVENTS - nextEvent");
    }
    CURRENT_HANDLER = (e) => {
        if (e.type === MOUSEMOVE) {
            mouse.x = e.x;
            mouse.y = e.y;
        }
        if (e.type === TICK && ms > 0) {
            elapsed += e.dt;
            if (elapsed < ms) {
                return;
            }
        }
        else if (!match(e))
            return;
        CURRENT_HANDLER = null;
        e.dt = elapsed;
        done(e);
    };
    return new Promise((resolve) => (done = resolve));
}
async function tickMs(ms = 1) {
    let done;
    setTimeout(() => done(), ms);
    return new Promise((resolve) => (done = resolve));
}
async function nextKeyPress(ms, match) {
    if (ms === undefined)
        ms = -1;
    match = match || TRUE;
    function matchingKey(e) {
        if (e.type !== KEYPRESS)
            return false;
        return match(e);
    }
    return nextEvent(ms, matchingKey);
}
async function nextKeyOrClick(ms, matchFn) {
    if (ms === undefined)
        ms = -1;
    matchFn = matchFn || TRUE;
    function match(e) {
        if (e.type !== KEYPRESS && e.type !== CLICK)
            return false;
        return matchFn(e);
    }
    return nextEvent(ms, match);
}
async function pause(ms) {
    const e = await nextKeyOrClick(ms);
    return e && e.type !== TICK;
}
function waitForAck() {
    return pause(5 * 60 * 1000); // 5 min
}
async function loop(keymap) {
    let running = true;
    while (running) {
        const ev = await nextEvent();
        if (ev && (await dispatchEvent(ev, keymap))) {
            running = false;
        }
    }
}

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
    hasEvents: hasEvents,
    clearEvents: clearEvents,
    pushEvent: pushEvent,
    dispatchEvent: dispatchEvent,
    makeTickEvent: makeTickEvent,
    makeKeyEvent: makeKeyEvent,
    keyCodeDirection: keyCodeDirection,
    ignoreKeyEvent: ignoreKeyEvent,
    mouse: mouse,
    makeMouseEvent: makeMouseEvent,
    pauseEvents: pauseEvents,
    resumeEvents: resumeEvents,
    nextEvent: nextEvent,
    tickMs: tickMs,
    nextKeyPress: nextKeyPress,
    nextKeyOrClick: nextKeyOrClick,
    pause: pause,
    waitForAck: waitForAck,
    loop: loop
};

// CREDIT - This is adapted from: http://roguebasin.roguelikedevelopment.org/index.php?title=Improved_Shadowcasting_in_Java
class FOV {
    constructor(strategy) {
        this._startX = -1;
        this._startY = -1;
        this._maxRadius = 100;
        this._isBlocked = strategy.isBlocked;
        this._calcRadius = strategy.calcRadius || calcRadius;
        this._setVisible = strategy.setVisible;
        this._hasXY = strategy.hasXY || TRUE;
    }
    calculate(x, y, maxRadius) {
        this._setVisible(x, y, 1);
        this._startX = x;
        this._startY = y;
        this._maxRadius = maxRadius + 1;
        // uses the diagonals
        for (let i = 4; i < 8; ++i) {
            const d = DIRS[i];
            this.castLight(1, 1.0, 0.0, 0, d[0], d[1], 0);
            this.castLight(1, 1.0, 0.0, d[0], 0, 0, d[1]);
        }
    }
    // NOTE: slope starts a 1 and ends at 0.
    castLight(row, startSlope, endSlope, xx, xy, yx, yy) {
        if (row >= this._maxRadius) {
            // fov.debug('CAST: row=%d, start=%d, end=%d, row >= maxRadius => cancel', row, startSlope.toFixed(2), endSlope.toFixed(2));
            return;
        }
        if (startSlope < endSlope) {
            // fov.debug('CAST: row=%d, start=%d, end=%d, start < end => cancel', row, startSlope.toFixed(2), endSlope.toFixed(2));
            return;
        }
        // fov.debug('CAST: row=%d, start=%d, end=%d, x=%d,%d, y=%d,%d', row, startSlope.toFixed(2), endSlope.toFixed(2), xx, xy, yx, yy);
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
            // fov.debug('- test %d,%d ... start=%d, min=%d, max=%d, end=%d, dx=%d, dy=%d', currentX, currentY, startSlope.toFixed(2), maxSlope.toFixed(2), minSlope.toFixed(2), endSlope.toFixed(2), deltaX, deltaY);
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
                // fov.debug('       - visible');
            }
            if (blocked) {
                //previous cell was a blocking one
                if (this._isBlocked(currentX, currentY)) {
                    //hit a wall
                    // fov.debug('       - blocked ... nextStart: %d', innerSlope.toFixed(2));
                    nextStart = innerSlope;
                    continue;
                }
                else {
                    blocked = false;
                }
            }
            else {
                if (this._isBlocked(currentX, currentY) && row < this._maxRadius) {
                    //hit a wall within sight line
                    // fov.debug('       - blocked ... start:%d, end:%d, nextStart: %d', nextStart.toFixed(2), outerSlope.toFixed(2), innerSlope.toFixed(2));
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

var fov = {
    __proto__: null,
    FOV: FOV
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
const DIRS$2 = DIRS;
function update(map) {
    let dir, dirs;
    let linkIndex;
    let left = null, right = null, link = null;
    dirs = map.eightWays ? 8 : 4;
    let head = map.front.right;
    map.front.right = null;
    while (head != null) {
        for (dir = 0; dir < dirs; dir++) {
            linkIndex = head.index + (DIRS$2[dir][0] + map.width * DIRS$2[dir][1]);
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
                way1index = head.index + DIRS$2[dir][0];
                if (way1index < 0 || way1index >= map.width * map.height)
                    continue;
                way2index = head.index + map.width * DIRS$2[dir][1];
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
function calculateDistances(distanceMap, destinationX, destinationY, costMap, eightWays = false) {
    const width = distanceMap.length;
    const height = distanceMap[0].length;
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
    clear(DIJKSTRA_MAP, NO_PATH, eightWays);
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
        newX = x + DIRS[dir][0];
        newY = y + DIRS[dir][1];
        blocked = isBlocked(newX, newY, x, y, distanceMap);
        if (!blocked && distanceMap[x][y] - distanceMap[newX][newY] > bestScore) {
            bestDir = dir;
            bestScore = distanceMap[x][y] - distanceMap[newX][newY];
        }
    }
    return DIRS[bestDir] || null;
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
                    (dist == closestDistance && distanceMap[i][j] < lowestMapScore)) {
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
var EVENTS$1 = {};
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
    if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
    }
    const listener = new Listener(fn, context || null, once);
    addToChain(EVENTS$1, event, listener);
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
    if (!EVENTS$1[event])
        return false;
    if (!fn)
        return false;
    let success = false;
    eachChain(EVENTS$1[event], (obj) => {
        if (obj.matches(fn, context, once)) {
            removeFromChain(EVENTS$1, event, obj);
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
    if (EVENTS$1[event]) {
        EVENTS$1[event] = null;
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
        EVENTS$1 = {};
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
    if (!EVENTS$1[event])
        return false; // no events to send
    let listener = EVENTS$1[event];
    while (listener) {
        let next = listener.next;
        if (listener.once)
            removeFromChain(EVENTS$1, event, listener);
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

function make$3(v) {
    if (v === undefined)
        return () => 100;
    if (v === null)
        return () => 0;
    if (typeof v === "number")
        return () => v;
    if (typeof v === "function")
        return v;
    let base = {};
    if (typeof v === "string") {
        const parts = v.split(/[,|]/).map((t) => t.trim());
        base = {};
        parts.forEach((p) => {
            let [level, weight] = p.split(":");
            base[level] = Number.parseInt(weight) || 100;
        });
    }
    else {
        base = v;
    }
    const parts = Object.entries(base);
    const funcs = parts.map(([levels, frequency]) => {
        frequency = Number.parseInt(frequency);
        if (levels.includes("-")) {
            let [start, end] = levels
                .split("-")
                .map((t) => t.trim())
                .map((v) => Number.parseInt(v));
            return (level) => level >= start && level <= end ? frequency : 0;
        }
        else if (levels.endsWith("+")) {
            const found = Number.parseInt(levels);
            return (level) => (level >= found ? frequency : 0);
        }
        else {
            const found = Number.parseInt(levels);
            return (level) => (level === found ? frequency : 0);
        }
    });
    if (funcs.length == 1)
        return funcs[0];
    return (level) => funcs.reduce((out, fn) => out || fn(level), 0);
}

var frequency = {
    __proto__: null,
    make: make$3
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
        opts.font = opts.font || "monospace";
        this._node = document.createElement("canvas");
        this._ctx = this.node.getContext("2d");
        this._configure(opts);
    }
    static fromImage(src) {
        if (typeof src === "string") {
            if (src.startsWith("data:"))
                throw new Error("Glyph: You must load a data string into an image element and use that.");
            const el = document.getElementById(src);
            if (!el)
                throw new Error("Glyph: Failed to find image element with id:" + src);
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
        if (typeof src === "string") {
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
        this._ctx.fillStyle = "black";
        this._ctx.fillRect(0, 0, this.pxWidth, this.pxHeight);
        const size = opts.fontSize || opts.size || Math.max(this.tileWidth, this.tileHeight);
        this._ctx.font = "" + size + "px " + opts.font;
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";
        this._ctx.fillStyle = "white";
    }
    draw(n, ch) {
        if (n > 256)
            throw new Error("Cannot draw more than 256 glyphs.");
        const x = (n % 16) * this.tileWidth;
        const y = Math.floor(n / 16) * this.tileHeight;
        const cx = x + Math.floor(this.tileWidth / 2);
        const cy = y + Math.floor(this.tileHeight / 2);
        this._ctx.save();
        this._ctx.beginPath();
        this._ctx.rect(x, y, this.tileWidth, this.tileHeight);
        this._ctx.clip();
        if (typeof ch === "function") {
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
        if (!basicOnly) {
            [
                " ",
                "\u263a",
                "\u263b",
                "\u2665",
                "\u2666",
                "\u2663",
                "\u2660",
                "\u263c",
                "\u2600",
                "\u2605",
                "\u2606",
                "\u2642",
                "\u2640",
                "\u266a",
                "\u266b",
                "\u2638",
                "\u25b6",
                "\u25c0",
                "\u2195",
                "\u203c",
                "\u204b",
                "\u262f",
                "\u2318",
                "\u2616",
                "\u2191",
                "\u2193",
                "\u2192",
                "\u2190",
                "\u2126",
                "\u2194",
                "\u25b2",
                "\u25bc",
            ].forEach((ch, i) => {
                this.draw(i, ch);
            });
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
                "\u2302",
                "\u00C7",
                "\u00FC",
                "\u00E9",
                "\u00E2",
                "\u00E4",
                "\u00E0",
                "\u00E5",
                "\u00E7",
                "\u00EA",
                "\u00EB",
                "\u00E8",
                "\u00EF",
                "\u00EE",
                "\u00EC",
                "\u00C4",
                "\u00C5",
                "\u00C9",
                "\u00E6",
                "\u00C6",
                "\u00F4",
                "\u00F6",
                "\u00F2",
                "\u00FB",
                "\u00F9",
                "\u00FF",
                "\u00D6",
                "\u00DC",
                "\u00A2",
                "\u00A3",
                "\u00A5",
                "\u20A7",
                "\u0192",
                "\u00E1",
                "\u00ED",
                "\u00F3",
                "\u00FA",
                "\u00F1",
                "\u00D1",
                "\u00AA",
                "\u00BA",
                "\u00BF",
                "\u2310",
                "\u00AC",
                "\u00BD",
                "\u00BC",
                "\u00A1",
                "\u00AB",
                "\u00BB",
                "\u2591",
                "\u2592",
                "\u2593",
                "\u2502",
                "\u2524",
                "\u2561",
                "\u2562",
                "\u2556",
                "\u2555",
                "\u2563",
                "\u2551",
                "\u2557",
                "\u255D",
                "\u255C",
                "\u255B",
                "\u2510",
                "\u2514",
                "\u2534",
                "\u252C",
                "\u251C",
                "\u2500",
                "\u253C",
                "\u255E",
                "\u255F",
                "\u255A",
                "\u2554",
                "\u2569",
                "\u2566",
                "\u2560",
                "\u2550",
                "\u256C",
                "\u2567",
                "\u2568",
                "\u2564",
                "\u2565",
                "\u2559",
                "\u2558",
                "\u2552",
                "\u2553",
                "\u256B",
                "\u256A",
                "\u2518",
                "\u250C",
                "\u2588",
                "\u2584",
                "\u258C",
                "\u2590",
                "\u2580",
                "\u03B1",
                "\u00DF",
                "\u0393",
                "\u03C0",
                "\u03A3",
                "\u03C3",
                "\u00B5",
                "\u03C4",
                "\u03A6",
                "\u0398",
                "\u03A9",
                "\u03B4",
                "\u221E",
                "\u03C6",
                "\u03B5",
                "\u2229",
                "\u2261",
                "\u00B1",
                "\u2265",
                "\u2264",
                "\u2320",
                "\u2321",
                "\u00F7",
                "\u2248",
                "\u00B0",
                "\u2219",
                "\u00B7",
                "\u221A",
                "\u207F",
                "\u00B2",
                "\u25A0",
                "\u00A0",
            ].forEach((ch, i) => {
                this.draw(i + 127, ch);
            });
        }
    }
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
        this.name = "NotSupportedError";
    }
}
class BaseCanvas {
    constructor(options) {
        this._renderRequested = false;
        this._autoRender = true;
        this._width = 50;
        this._height = 25;
        if (!options.glyphs)
            throw new Error("You must supply glyphs for the canvas.");
        this._node = this._createNode();
        this._createContext();
        this._configure(options);
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
        if (typeof ch === "number")
            return ch;
        return this._glyphs.forChar(ch);
    }
    _createNode() {
        return document.createElement("canvas");
    }
    _configure(options) {
        this._width = options.width || this._width;
        this._height = options.height || this._height;
        this._autoRender = options.render !== false;
        this._setGlyphs(options.glyphs);
        if (options.div) {
            let el;
            if (typeof options.div === "string") {
                el = document.getElementById(options.div);
                if (!el) {
                    console.warn("Failed to find parent element by ID: " + options.div);
                }
            }
            else {
                el = options.div;
            }
            if (el && el.appendChild) {
                el.appendChild(this.node);
            }
        }
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
        const node = this.node;
        node.width = this._width * this.tileWidth;
        node.height = this._height * this.tileHeight;
    }
    draw(x, y, glyph, fg, bg) {
        glyph = glyph & 0xff;
        bg = bg & 0xfff;
        fg = fg & 0xfff;
        const style = glyph * (1 << 24) + bg * (1 << 12) + fg;
        this._set(x, y, style);
    }
    _requestRender() {
        if (this._renderRequested)
            return;
        this._renderRequested = true;
        if (!this._autoRender)
            return;
        requestAnimationFrame(() => this.render());
    }
    _set(x, y, style) {
        let index = y * this.width + x;
        const current = this._data[index];
        if (current !== style) {
            this._data[index] = style;
            this._requestRender();
            return true;
        }
        return false;
    }
    copy(data) {
        this._data.set(data);
        this._requestRender();
    }
    copyTo(data) {
        data.set(this._data);
    }
    hasXY(x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }
    set onclick(fn) {
        this.node.onclick = (e) => {
            const x = this.toX(e.offsetX);
            const y = this.toY(e.offsetY);
            const ev = makeMouseEvent(e, x, y);
            fn(ev);
        };
    }
    set onmousemove(fn) {
        let lastX = -1;
        let lastY = -1;
        this.node.onmousemove = (e) => {
            const x = this.toX(e.offsetX);
            const y = this.toY(e.offsetY);
            if (x == lastX && y == lastY)
                return;
            lastX = x;
            lastY = y;
            const ev = makeMouseEvent(e, x, y);
            fn(ev);
        };
    }
    toX(offsetX) {
        return clamp(Math.floor(this.width * (offsetX / this.node.clientWidth)), 0, this.width - 1);
    }
    toY(offsetY) {
        return clamp(Math.floor(this.height * (offsetY / this.node.clientHeight)), 0, this.height - 1);
    }
}
// Based on: https://github.com/ondras/fastiles/blob/master/ts/scene.ts (v2.1.0)
class Canvas extends BaseCanvas {
    constructor(options) {
        super(options);
    }
    _createContext() {
        let gl = this.node.getContext("webgl2");
        if (!gl) {
            throw new NotSupportedError("WebGL 2 not supported");
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
        gl.uniform1i(this._uniforms["font"], 0);
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
        gl.vertexAttribIPointer(attribs["style"], 1, gl.UNSIGNED_INT, 0, 0);
        Object.assign(this._buffers, { style });
    }
    _setGlyphs(glyphs) {
        if (!super._setGlyphs(glyphs))
            return false;
        const gl = this._gl;
        const uniforms = this._uniforms;
        gl.uniform2uiv(uniforms["tileSize"], [this.tileWidth, this.tileHeight]);
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
        gl.uniform2ui(uniforms["viewportSize"], this.node.width, this.node.height);
        this._createGeometry();
        this._createData();
    }
    _set(x, y, style) {
        let index = y * this.width + x;
        index *= VERTICES_PER_TILE;
        const current = this._data[index + 2];
        if (current !== style) {
            this._data[index + 2] = style;
            this._data[index + 5] = style;
            this._requestRender();
            return true;
        }
        return false;
    }
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
    render() {
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
    constructor(options) {
        super(options);
    }
    _createContext() {
        const ctx = this.node.getContext("2d");
        if (!ctx) {
            throw new NotSupportedError("2d context not supported!");
        }
        this._ctx = ctx;
    }
    _set(x, y, style) {
        const result = super._set(x, y, style);
        if (result) {
            this._changed[y * this.width + x] = 1;
        }
        return result;
    }
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
    render() {
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
                pct * (((fg & 0xf00) >> 8) * 17) + inv * (((bg & 0xf00) >> 8) * 17);
            d.data[di * 4 + 1] =
                pct * (((fg & 0xf0) >> 4) * 17) + inv * (((bg & 0xf0) >> 4) * 17);
            d.data[di * 4 + 2] = pct * ((fg & 0xf) * 17) + inv * ((bg & 0xf) * 17);
            d.data[di * 4 + 3] = 255; // not transparent anymore
        }
        this._ctx.putImageData(d, px, py);
    }
}
function withImage(image) {
    let opts = {};
    if (typeof image === "string") {
        opts.glyphs = Glyphs.fromImage(image);
    }
    else if (image instanceof HTMLImageElement) {
        opts.glyphs = Glyphs.fromImage(image);
    }
    else {
        if (!image.image)
            throw new Error("You must supply the image.");
        Object.assign(opts, image);
        opts.glyphs = Glyphs.fromImage(image.image);
    }
    let canvas;
    try {
        canvas = new Canvas(opts);
    }
    catch (e) {
        if (!(e instanceof NotSupportedError))
            throw e;
    }
    if (!canvas) {
        canvas = new Canvas2D(opts);
    }
    return canvas;
}
function withFont(src) {
    if (typeof src === "string") {
        src = { font: src };
    }
    src.glyphs = Glyphs.fromFont(src);
    let canvas;
    try {
        canvas = new Canvas(src);
    }
    catch (e) {
        if (!(e instanceof NotSupportedError))
            throw e;
    }
    if (!canvas) {
        canvas = new Canvas2D(src);
    }
    return canvas;
}
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
    gl.vertexAttribIPointer(attribs["position"], 2, gl.UNSIGNED_SHORT, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
    const uv = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uv);
    gl.vertexAttribIPointer(attribs["uv"], 2, gl.UNSIGNED_BYTE, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, uvData, gl.STATIC_DRAW);
    return { position, uv };
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
        if (typeof other === "string") {
            if (!other.startsWith("#"))
                return this.name == other;
            return this.css(other.length > 4) == other;
        }
        else if (typeof other === "number") {
            return this.toInt() == other || this.toInt(true) == other;
        }
        const O = from$2(other);
        if (this.isNull())
            return O.isNull();
        return this.every((v, i) => {
            return v == O[i];
        });
    }
    copy(other) {
        if (Array.isArray(other)) {
            if (other.length === 8) {
                this.dances = other[7];
            }
        }
        else {
            other = from$2(other);
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
        return toColorInt(this._r, this._g, this._b, base256);
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
        const O = from$2(other);
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
        const O = from$2(other);
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
        return "#" + v.toString(16).padStart(base256 ? 6 : 3, "0");
    }
    toString(base256 = false) {
        if (this.name)
            return this.name;
        if (this.isNull())
            return "null color";
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
    if (!css.startsWith("#")) {
        throw new Error('Color CSS strings must be of form "#abc" or "#abcdef" - received: [' +
            css +
            "]");
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
        throw new Error("Unknown color name: " + name);
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
function make$4(...args) {
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
    if (typeof arg === "string") {
        if (arg.startsWith("#")) {
            return fromCss(arg);
        }
        return fromName(arg).clone();
    }
    else if (Array.isArray(arg)) {
        return fromArray(arg, base256);
    }
    else if (typeof arg === "number") {
        return fromNumber(arg, base256);
    }
    throw new Error("Failed to make color - unknown argument: " + JSON.stringify(arg));
}
make.color = make$4;
function from$2(...args) {
    const arg = args[0];
    if (arg instanceof Color)
        return arg;
    if (arg === undefined)
        return new Color(-1);
    if (typeof arg === "string") {
        if (!arg.startsWith("#")) {
            return fromName(arg);
        }
    }
    return make$4(arg, args[1]);
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
function install(name, ...args) {
    let info = args;
    if (args.length == 1) {
        info = args[0];
    }
    const c = info instanceof Color ? info : make$4(info);
    colors[name] = c;
    c.name = name;
    return c;
}
function installSpread(name, ...args) {
    let c;
    if (args.length == 1) {
        c = install(name, args[0]);
    }
    else {
        c = install(name, ...args);
    }
    install("light_" + name, c.clone().lighten(25));
    install("lighter_" + name, c.clone().lighten(50));
    install("lightest_" + name, c.clone().lighten(75));
    install("dark_" + name, c.clone().darken(25));
    install("darker_" + name, c.clone().darken(50));
    install("darkest_" + name, c.clone().darken(75));
    return c;
}
const BLACK = install("black", 0x000);
const WHITE = install("white", 0xfff);
installSpread("teal", [30, 100, 100]);
installSpread("brown", [60, 40, 0]);
installSpread("tan", [80, 70, 55]); // 80, 67,		15);
installSpread("pink", [100, 60, 66]);
installSpread("gray", [50, 50, 50]);
installSpread("yellow", [100, 100, 0]);
installSpread("purple", [100, 0, 100]);
installSpread("green", [0, 100, 0]);
installSpread("orange", [100, 50, 0]);
installSpread("blue", [0, 0, 100]);
installSpread("red", [100, 0, 0]);
installSpread("amber", [100, 75, 0]);
installSpread("flame", [100, 25, 0]);
installSpread("fuchsia", [100, 0, 100]);
installSpread("magenta", [100, 0, 75]);
installSpread("crimson", [100, 0, 25]);
installSpread("lime", [75, 100, 0]);
installSpread("chartreuse", [50, 100, 0]);
installSpread("sepia", [50, 40, 25]);
installSpread("violet", [50, 0, 100]);
installSpread("han", [25, 0, 100]);
installSpread("cyan", [0, 100, 100]);
installSpread("turquoise", [0, 100, 75]);
installSpread("sea", [0, 100, 50]);
installSpread("sky", [0, 75, 100]);
installSpread("azure", [0, 50, 100]);
installSpread("silver", [75, 75, 75]);
installSpread("gold", [100, 85, 0]);

var color = {
    __proto__: null,
    colors: colors,
    Color: Color,
    fromArray: fromArray,
    fromCss: fromCss,
    fromName: fromName,
    fromNumber: fromNumber,
    make: make$4,
    from: from$2,
    separate: separate,
    swap: swap,
    relativeLuminance: relativeLuminance,
    distance: distance,
    install: install,
    installSpread: installSpread
};

class Sprite {
    constructor(ch, fg, bg, opacity) {
        if (!ch && ch !== 0)
            ch = -1;
        if (typeof fg !== "number")
            fg = from$2(fg);
        if (typeof bg !== "number")
            bg = from$2(bg);
        this.ch = ch;
        this.fg = fg;
        this.bg = bg;
        this.opacity = opacity;
    }
}
const sprites = {};
function makeSprite(...args) {
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
        typeof args[1] == "number" &&
        args[0].length > 1) {
        opacity = args.pop();
    }
    if (args.length > 1) {
        ch = args[0] || -1;
        fg = args[1];
        bg = args[2];
    }
    else {
        if (typeof args[0] === "string" && args[0].length == 1) {
            ch = args[0];
            fg = "white"; // white is default?
        }
        else if ((typeof args[0] === "string" && args[0].length > 1) ||
            typeof args[0] === "number") {
            bg = args[0];
        }
        else if (args[0] instanceof Color) {
            bg = args[0];
        }
        else {
            const sprite = args[0];
            ch = sprite.ch || -1;
            fg = sprite.fg || -1;
            bg = sprite.bg || -1;
            opacity = sprite.opacity;
        }
    }
    if (typeof fg === "string")
        fg = from$2(fg);
    else if (Array.isArray(fg))
        fg = make$4(fg);
    else if (fg === undefined || fg === null)
        fg = -1;
    if (typeof bg === "string")
        bg = from$2(bg);
    else if (Array.isArray(bg))
        bg = make$4(bg);
    else if (bg === undefined || bg === null)
        bg = -1;
    return new Sprite(ch, fg, bg, opacity);
}
make.sprite = makeSprite;
function installSprite(name, ...args) {
    let sprite;
    // @ts-ignore
    sprite = this.makeSprite(...args);
    sprite.name = name;
    sprites[name] = sprite;
    return sprite;
}

class Mixer {
    constructor(base) {
        this.ch = first(base === null || base === void 0 ? void 0 : base.ch, -1);
        this.fg = from$2(base === null || base === void 0 ? void 0 : base.fg);
        this.bg = from$2(base === null || base === void 0 ? void 0 : base.bg);
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
            fg = from$2(fg);
            this.fg.copy(fg);
        }
        if (bg !== -1 && bg !== null) {
            bg = from$2(bg);
            this.bg.copy(bg);
        }
        return this._changed();
    }
    drawSprite(info, opacity) {
        if (opacity === undefined)
            opacity = info.opacity;
        if (opacity === undefined)
            opacity = 100;
        if (opacity <= 0)
            return;
        if ((info.ch && info.ch !== -1) || info.ch === 0)
            this.ch = info.ch;
        if ((info.fg && info.fg !== -1) || info.fg === 0)
            this.fg.mix(info.fg, opacity);
        if ((info.bg && info.bg !== -1) || info.bg === 0)
            this.bg.mix(info.bg, opacity);
        return this._changed();
    }
    invert() {
        [this.bg, this.fg] = [this.fg, this.bg];
        return this._changed();
    }
    multiply(color$1, fg = true, bg = true) {
        color$1 = from$2(color$1);
        if (fg) {
            this.fg.multiply(color$1);
        }
        if (bg) {
            this.bg.multiply(color$1);
        }
        return this._changed();
    }
    mix(color$1, fg = 50, bg = fg) {
        color$1 = from$2(color$1);
        if (fg > 0) {
            this.fg.mix(color$1, fg);
        }
        if (bg > 0) {
            this.bg.mix(color$1, bg);
        }
        return this._changed();
    }
    add(color$1, fg = 100, bg = fg) {
        color$1 = from$2(color$1);
        if (fg > 0) {
            this.fg.add(color$1, fg);
        }
        if (bg > 0) {
            this.bg.add(color$1, bg);
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
make.mixer = function (base) {
    return new Mixer(base);
};

var index = {
    __proto__: null,
    NotSupportedError: NotSupportedError,
    BaseCanvas: BaseCanvas,
    Canvas: Canvas,
    Canvas2D: Canvas2D,
    withImage: withImage,
    withFont: withFont,
    Sprite: Sprite,
    sprites: sprites,
    makeSprite: makeSprite,
    installSprite: installSprite,
    Mixer: Mixer,
    Glyphs: Glyphs
};

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

function configure(opts = {}) {
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

var index$1 = {
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
    configure: configure,
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
    get(x, y) {
        let index = y * this.width + x;
        const style = this._data[index] || 0;
        const ch = style >> 24;
        const bg = (style >> 12) & 0xfff;
        const fg = style & 0xfff;
        return { ch, fg, bg };
    }
    toGlyph(ch) {
        if (typeof ch === "number")
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
        if (typeof glyph !== "number") {
            glyph = this.toGlyph(glyph);
        }
        if (typeof fg !== "number") {
            fg = from$2(fg).toInt();
        }
        if (typeof bg !== "number") {
            bg = from$2(bg).toInt();
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
        if (typeof glyph == "string") {
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
        if (typeof fg !== "number")
            fg = from$2(fg);
        if (typeof bg !== "number")
            bg = from$2(bg);
        eachChar(text, (ch, fg0, bg0, i) => {
            if (x + i >= this.width)
                return;
            this.draw(i + x, y, ch, fg0, bg0);
        }, fg, bg);
        return ++y;
    }
    wrapText(x, y, width, text, fg = 0xfff, bg = -1, indent = 0) {
        if (typeof fg !== "number")
            fg = from$2(fg);
        if (typeof bg !== "number")
            bg = from$2(bg);
        width = Math.min(width, this.width - x);
        text = wordWrap(text, width, indent);
        let xi = x;
        eachChar(text, (ch, fg0, bg0) => {
            if (ch == "\n") {
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
        if (typeof ch !== "number")
            ch = this.toGlyph(ch);
        if (typeof fg !== "number")
            fg = from$2(fg).toInt();
        if (typeof bg !== "number")
            bg = from$2(bg).toInt();
        for (let i = x; i < x + w; ++i) {
            for (let j = y; j < y + h; ++j) {
                this.draw(i, j, ch, fg, bg);
            }
        }
        return this;
    }
    blackOutRect(x, y, w, h, bg = 0) {
        if (typeof bg !== "number")
            bg = from$2(bg);
        return this.fillRect(x, y, w, h, 0, 0, bg);
    }
    highlight(x, y, color$1, strength) {
        if (typeof color$1 !== "number") {
            color$1 = from$2(color$1);
        }
        const mixer = new Mixer();
        const data = this.get(x, y);
        mixer.drawSprite(data);
        mixer.fg.add(color$1, strength);
        mixer.bg.add(color$1, strength);
        this.drawSprite(x, y, mixer);
        return this;
    }
    mix(color$1, percent) {
        if (typeof color$1 !== "number")
            color$1 = from$2(color$1);
        const mixer = new Mixer();
        for (let x = 0; x < this.width; ++x) {
            for (let y = 0; y < this.height; ++y) {
                const data = this.get(x, y);
                mixer.drawSprite(data);
                mixer.fg.mix(color$1, percent);
                mixer.bg.mix(color$1, percent);
                this.drawSprite(x, y, mixer);
            }
        }
        return this;
    }
    dump() {
        const data = [];
        let header = "    ";
        for (let x = 0; x < this.width; ++x) {
            if (x % 10 == 0)
                header += " ";
            header += x % 10;
        }
        data.push(header);
        data.push("");
        for (let y = 0; y < this.height; ++y) {
            let line = `${("" + y).padStart(2)}] `;
            for (let x = 0; x < this.width; ++x) {
                if (x % 10 == 0)
                    line += " ";
                const data = this.get(x, y);
                const glyph = data.ch;
                line += String.fromCharCode(glyph || 32);
            }
            data.push(line);
        }
        console.log(data.join("\n"));
    }
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

var buffer = {
    __proto__: null,
    DataBuffer: DataBuffer,
    Buffer: Buffer
};

class Bounds {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
    contains(...args) {
        let x$1 = args[0];
        let y$1 = args[1];
        if (typeof x$1 !== "number") {
            y$1 = y(x$1);
            x$1 = x(x$1);
        }
        return (this.x <= x$1 &&
            this.y <= y$1 &&
            this.x + this.width > x$1 &&
            this.y + this.height > y$1);
    }
}

var types = {
    __proto__: null,
    Bounds: Bounds
};

const templates = {};
function install$1(id, msg) {
    const template = compile(msg);
    templates[id] = template;
}
function installAll(config) {
    Object.entries(config).forEach(([id, msg]) => install$1(id, msg));
}
// messages
const ARCHIVE = [];
const CONFIRMED = [];
var ARCHIVE_LINES = 30;
var MSG_WIDTH = 80;
var CURRENT_ARCHIVE_POS = 0;
var NEEDS_UPDATE = false;
let COMBAT_MESSAGE = null;
function needsUpdate(needs) {
    if (needs) {
        NEEDS_UPDATE = true;
    }
    return NEEDS_UPDATE;
}
function configure$1(opts) {
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
    ARCHIVE[CURRENT_ARCHIVE_POS] = msg;
    CONFIRMED[CURRENT_ARCHIVE_POS] = false;
    CURRENT_ARCHIVE_POS = (CURRENT_ARCHIVE_POS + 1) % ARCHIVE_LINES;
}
function addMessage(msg) {
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
        COMBAT_MESSAGE += ", " + capitalize(msg);
    }
    NEEDS_UPDATE = true;
}
function commitCombatMessage() {
    if (!COMBAT_MESSAGE)
        return false;
    addMessage(COMBAT_MESSAGE + ".");
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
    for (let i = 0; i < ARCHIVE_LINES; ++i) {
        const n = (i + CURRENT_ARCHIVE_POS - 1) % ARCHIVE_LINES;
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
    install: install$1,
    installAll: installAll,
    needsUpdate: needsUpdate,
    configure: configure$1,
    add: add,
    fromActor: fromActor,
    addCombat: addCombat,
    confirmAll: confirmAll,
    forEach: forEach
};

exports.Random = Random;
exports.buffer = buffer;
exports.canvas = index;
exports.color = color;
exports.colors = colors;
exports.config = config;
exports.cosmetic = cosmetic;
exports.data = data;
exports.events = events;
exports.flag = flag;
exports.flags = flags;
exports.fov = fov;
exports.frequency = frequency;
exports.grid = grid;
exports.io = io;
exports.make = make;
exports.message = message;
exports.path = path;
exports.random = random;
exports.range = range;
exports.scheduler = scheduler;
exports.sprites = sprites;
exports.text = index$1;
exports.types = types;
exports.utils = utils;
