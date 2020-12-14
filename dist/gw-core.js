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
const DIRS = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, -1], [-1, 1]];
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
const CLOCK_DIRS = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]];
function NOOP() { }
function TRUE() { return true; }
function FALSE() { return false; }
function ONE() { return 1; }
function ZERO() { return 0; }
function IDENTITY(x) { return x; }
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
    return (dest.x == x(src)) && (dest.y == y(src));
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
    return x + y - (0.6 * min);
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
        c[0] = x0 + Math.floor(diff[0] * step / steps);
        c[1] = y0 + Math.floor(diff[1] * step / steps);
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
    return Math.floor(100 * Math.sin(Math.PI * currentXValue / (maxXValue)));
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
// export function copyObject(dest, src) {
//   Object.keys(dest).forEach( (key) => {
//     assignField(dest, src, key);
//   });
// }
// export function assignObject(dest, src) {
//   Object.keys(src).forEach( (key) => {
//     assignField(dest, src, key);
//   });
// }
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
                ERROR('Trying to set default member on non-object config item: ' + origKey);
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
    Object.keys(obj).forEach((key) => obj[key] = undefined);
}
function ERROR(message) {
    throw new Error(message);
}
function WARN(...args) {
    console.warn(...args);
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
    return (chain === entry);
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
    assignOmitting: assignOmitting,
    setDefault: setDefault,
    setDefaults: setDefaults,
    kindDefaults: kindDefaults,
    pick: pick,
    clearObject: clearObject,
    ERROR: ERROR,
    WARN: WARN,
    getOpt: getOpt,
    firstOpt: firstOpt,
    arraysIntersect: arraysIntersect,
    sum: sum,
    chainLength: chainLength,
    chainIncludes: chainIncludes,
    eachChain: eachChain,
    addToChain: addToChain,
    removeFromChain: removeFromChain
};

const RANDOM_CONFIG = {
    make: () => { return Math.random.bind(Math); }
};
function configure(opts) {
    if (opts.make) {
        if (typeof opts.make !== 'function')
            throw new Error('Random make parameter must be a function.');
        if (typeof opts.make(12345) !== 'function')
            throw new Error('Random make function must accept a numeric seed and return a random function.');
        RANDOM_CONFIG.make = opts.make;
        random.seed();
        cosmetic.seed();
    }
}
function lotteryDrawArray(rand, frequencies) {
    let i, maxFreq, randIndex;
    maxFreq = 0;
    for (i = 0; i < frequencies.length; i++) {
        maxFreq += frequencies[i];
    }
    if (maxFreq <= 0) {
        console.warn('Lottery Draw - no frequencies', frequencies, frequencies.length);
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
    constructor() {
        this._fn = RANDOM_CONFIG.make();
    }
    seed(val) {
        this._fn = RANDOM_CONFIG.make(val);
    }
    value() { return this._fn(); }
    float() { return this.value(); }
    number(max = 0) {
        max = max || Number.MAX_SAFE_INTEGER;
        return Math.floor(this._fn() * max);
    }
    int(max = 0) { return this.number(max); }
    range(lo, hi) {
        if (hi <= lo)
            return hi;
        const diff = (hi - lo) + 1;
        return lo + (this.number(diff));
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
        return (this.range(0, outOf - 1) < percent);
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
        return (total + lo);
    }
}
const random = new Random();
const cosmetic = new Random();

class Range {
    constructor(lower, upper = 0, clumps = 1, rng) {
        this._rng = rng || random;
        if (Array.isArray(lower)) {
            clumps = lower[2];
            upper = lower[1];
            lower = lower[0];
        }
        else if (lower instanceof Range) {
            clumps = lower.clumps;
            upper = lower.hi;
            lower = lower.lo;
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
    toString() {
        if (this.lo >= this.hi) {
            return '' + this.lo;
        }
        return `${this.lo}-${this.hi}`;
    }
}
function make(config, rng) {
    if (!config)
        return new Range(0, 0, 0, rng);
    if (config instanceof Range)
        return config; // you can supply a custom range object
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
            const upper = addend + (count * sides);
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

var range = {
    __proto__: null,
    Range: Range,
    make: make
};

function configure$1(config) {
    if (config.random) {
        configure(config.random);
    }
}
var types = {
    Random: Random,
    Range: Range,
};

exports.configure = configure$1;
exports.cosmetic = cosmetic;
exports.random = random;
exports.range = range;
exports.types = types;
exports.utils = utils;
