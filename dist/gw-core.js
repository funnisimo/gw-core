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

///////////////////////////////////
// FLAG
function fl(N) { return (1 << N); }
function toString(flagObj, value) {
    const inverse = Object.entries(flagObj).reduce((out, entry) => {
        const [key, value] = entry;
        if (value)
            out[value] = key;
        return out;
    }, []);
    const out = [];
    for (let index = 0; index < 32; ++index) {
        const fl = (1 << index);
        if (value & fl) {
            out.push(inverse[fl]);
        }
    }
    return out.join(' | ');
}
function from(obj, ...args) {
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
            value = value.split(/[,|]/).map((t) => t.trim()).map((u) => {
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
                else if (v === 0) { // to allow clearing flags when extending objects
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
const flags = {};
function install(flagName, flag) {
    flags[flagName] = flag;
    return flag;
}

var flag = {
    __proto__: null,
    fl: fl,
    toString: toString,
    from: from,
    flags: flags,
    install: install
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
                this[x] = new Array(h).fill(0).map((_, i) => v(x, i));
            }
            else {
                this[x] = new Array(h).fill(v);
            }
        }
        this._width = w;
        this._height = h;
        // @ts-ignore
        this.type = v.constructor.name;
    }
    get width() { return this._width; }
    get height() { return this._height; }
    resize(width, height, v) {
        const fn = (typeof v === 'function') ? v : (() => v);
        while (this.length < width)
            this.push([]);
        let x = 0;
        let y = 0;
        for (x = 0; x < width; ++x) {
            const col = this[x];
            for (y = 0; y < Math.min(height, col.length); ++y) {
                col[y] = fn(x, y);
            }
            while (col.length < height) {
                col.push(fn(x, col.length));
            }
        }
        this._width = width;
        this._height = height;
        if (this.x !== undefined) {
            this.x = undefined;
            this.y = undefined;
        }
    }
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
    // @ts-ignore
    map(fn) {
        return super.map((col, x) => {
            return col.map((v, y) => fn(v, x, y, this));
        });
    }
    forCircle(x, y, radius, fn) {
        let i, j;
        for (i = Math.max(0, x - radius - 1); i < Math.min(this.width, x + radius + 1); i++) {
            for (j = Math.max(0, y - radius - 1); j < Math.min(this.height, y + radius + 1); j++) {
                if (this.hasXY(i, j) && (((i - x) * (i - x) + (j - y) * (j - y)) < radius * radius + radius)) { // + radius softens the circle
                    fn(this[i][j], i, j, this);
                }
            }
        }
    }
    hasXY(x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }
    isBoundaryXY(x, y) {
        return this.hasXY(x, y) && ((x == 0) || (x == this.width - 1) || (y == 0) || (y == this.height - 1));
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
                if (this.hasXY(i, j) && (((i - x) * (i - x) + (j - y) * (j - y)) < radius * radius + radius)) { // + radius softens the circle
                    this[i][j] = fn(this[i][j], i, j, this);
                }
            }
        }
    }
    // @ts-ignore
    fill(v) {
        const fn = (typeof v === 'function') ? v : (() => v);
        this.update(fn);
    }
    fillRect(x, y, w, h, v) {
        const fn = (typeof v === 'function') ? v : (() => v);
        this.updateRect(x, y, w, h, fn);
    }
    fillCircle(x, y, radius, v) {
        const fn = (typeof v === 'function') ? v : (() => v);
        this.updateCircle(x, y, radius, fn);
    }
    replace(findValue, replaceValue) {
        this.update((v) => (v == findValue) ? replaceValue : v);
    }
    copy(from) {
        // TODO - check width, height?
        this.update((_, i, j) => from[i][j]);
    }
    count(match) {
        const fn = (typeof match === 'function') ? match : ((v) => v == match);
        let count = 0;
        this.forEach((v, i, j) => { if (fn(v, i, j, this))
            ++count; });
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
    closestMatchingLoc(x, y, fn) {
        let bestLoc = [-1, -1];
        let bestDistance = this.width + this.height;
        this.forEach((v, i, j) => {
            if (fn(v, i, j, this)) {
                const dist = distanceBetween(x, y, i, j);
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
        const fn = (typeof v === 'function') ? v : ((val) => val == v);
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
        const fn = (typeof v === 'function') ? v : ((val) => val == v);
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
        const fn = (typeof v === 'function') ? v : ((val) => val == v);
        candidateLocs = 0;
        // count up the number of candidate locations
        for (k = 0; k < Math.max(this.width, this.height) && !candidateLocs; k++) {
            for (i = x - k; i <= x + k; i++) {
                for (j = y - k; j <= y + k; j++) {
                    if (this.hasXY(i, j)
                        && (i == x - k || i == x + k || j == y - k || j == y + k)
                        && fn(this[i][j], i, j, this)) {
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
                    if (this.hasXY(i, j)
                        && (i == x - k || i == x + k || j == y - k || j == y + k)
                        && fn(this[i][j], i, j, this)) {
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
        let arcCount, dir, oldX, oldY, newX, newY;
        // brogueAssert(grid.hasXY(x, y));
        testFn = testFn || IDENTITY;
        arcCount = 0;
        for (dir = 0; dir < CDIRS.length; dir++) {
            oldX = x + CDIRS[(dir + 7) % 8][0];
            oldY = y + CDIRS[(dir + 7) % 8][1];
            newX = x + CDIRS[dir][0];
            newY = y + CDIRS[dir][1];
            // Counts every transition from passable to impassable or vice-versa on the way around the cell:
            if ((this.hasXY(newX, newY) && testFn(this[newX][newY], newX, newY, this))
                != (this.hasXY(oldX, oldY) && testFn(this[oldX][oldY], oldX, oldY, this))) {
                arcCount++;
            }
        }
        return Math.floor(arcCount / 2); // Since we added one when we entered a wall and another when we left.
    }
}
const GRID_CACHE = [];
class NumGrid extends Grid {
    static alloc(w, h, v = 0) {
        let grid = GRID_CACHE.pop();
        if (!grid) {
            return new NumGrid(w, h, v);
        }
        grid.resize(w, h, v);
        return grid;
    }
    static free(grid) {
        if (grid) {
            if (GRID_CACHE.indexOf(grid) >= 0)
                return;
            GRID_CACHE.push(grid);
        }
    }
    constructor(w, h, v = 0) {
        super(w, h, v);
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
        this[x][y] = fillValue;
        for (dir = 0; dir < 4; dir++) {
            newX = x + DIRS$1[dir][0];
            newY = y + DIRS$1[dir][1];
            if (this.hasXY(newX, newY)
                && this[newX][newY] >= eligibleValueMin
                && this[newX][newY] <= eligibleValueMax) {
                fillCount += this.floodFillRange(newX, newY, eligibleValueMin, eligibleValueMax, fillValue);
            }
        }
        return fillCount;
    }
    invert() {
        this.update((v) => v ? 0 : 1);
    }
    closestLocWithValue(x, y, value = 1) {
        return this.closestMatchingLoc(x, y, (v) => v == value);
    }
    // Takes a grid as a mask of valid locations, chooses one randomly and returns it as (x, y).
    // If there are no valid locations, returns (-1, -1).
    randomLocWithValue(validValue = 1) {
        return this.randomMatchingLoc((v) => v == validValue);
    }
    getQualifyingLocNear(x, y, deterministic = false) {
        return this.matchingLocNear(x, y, ((v) => !!v), deterministic);
    }
    leastPositiveValue() {
        let least = Number.MAX_SAFE_INTEGER;
        this.forEach((v) => {
            if (v > 0 && (v < least)) {
                least = v;
            }
        });
        return least;
    }
    randomLeastPositiveLoc(deterministic = false) {
        const targetValue = this.leastPositiveValue();
        return this.randomMatchingLoc(((v) => v == targetValue), deterministic);
    }
    // Marks a cell as being a member of blobNumber, then recursively iterates through the rest of the blob
    floodFill(x, y, matchValue, fillValue) {
        let dir;
        let newX, newY, numberOfCells = 1;
        const matchFn = (typeof matchValue == 'function') ? matchValue : ((v) => v == matchValue);
        const fillFn = (typeof fillValue == 'function') ? fillValue : (() => fillValue);
        this[x][y] = fillFn(this[x][y], x, y, this);
        // Iterate through the four cardinal neighbors.
        for (dir = 0; dir < 4; dir++) {
            newX = x + DIRS$1[dir][0];
            newY = y + DIRS$1[dir][1];
            if (!this.hasXY(newX, newY)) {
                continue;
            }
            if (matchFn(this[newX][newY], newX, newY, this)) { // If the neighbor is an unmarked region cell,
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
                    if (this.hasXY(newX, newY)
                        && buffer2[newX][newY]) {
                        nbCount++;
                    }
                }
                if (!buffer2[i][j] && birthParameters[nbCount] == 't') {
                    this[i][j] = 1; // birth
                    didSomething = true;
                }
                else if (buffer2[i][j] && survivalParameters[nbCount] == 't') ;
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
    fillBlob(roundCount, minBlobWidth, minBlobHeight, maxBlobWidth, maxBlobHeight, percentSeeded, birthParameters, survivalParameters) {
        let i, j, k;
        let blobNumber, blobSize, topBlobNumber, topBlobSize;
        let topBlobMinX, topBlobMinY, topBlobMaxX, topBlobMaxY, blobWidth, blobHeight;
        let foundACellThisLine;
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
                    this[i + left][j + top] = (random.chance(percentSeeded) ? 1 : 0);
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
                    if (this[i][j] == 1) { // an unmarked blob
                        // Mark all the cells and returns the total size:
                        blobSize = this.floodFill(i, j, 1, blobNumber);
                        if (blobSize > topBlobSize) { // if this blob is a new record
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
            blobWidth = (topBlobMaxX - topBlobMinX) + 1;
            blobHeight = (topBlobMaxY - topBlobMinY) + 1;
        } while (blobWidth < minBlobWidth
            || blobHeight < minBlobHeight
            || topBlobNumber == 0);
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
        return { x: topBlobMinX, y: topBlobMinY, width: blobWidth, height: blobHeight };
    }
}
// Grid.fillBlob = fillBlob;
const alloc = NumGrid.alloc.bind(NumGrid);
const free = NumGrid.free.bind(NumGrid);
function make$1(w, h, v) {
    if (v === undefined)
        return new NumGrid(w, h, 0);
    if (typeof v === 'number')
        return new NumGrid(w, h, v);
    return new Grid(w, h, v);
}
function offsetZip(destGrid, srcGrid, srcToDestX, srcToDestY, value) {
    const fn = (typeof value === 'function') ? value : ((_, s, dx, dy) => destGrid[dx][dy] = value || s);
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
    const fnOpen = (typeof isOpen === 'function') ? isOpen : ((v) => v == isOpen);
    solutionDir = NO_DIRECTION;
    for (dir = 0; dir < 4; dir++) {
        newX = x + DIRS$1[dir][0];
        newY = y + DIRS$1[dir][1];
        oppX = x - DIRS$1[dir][0];
        oppY = y - DIRS$1[dir][1];
        if (grid.hasXY(oppX, oppY)
            && grid.hasXY(newX, newY)
            && fnOpen(grid[oppX][oppY], oppX, oppY, grid)) {
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
    onto.update((_, i, j) => a[i][j] && b[i][j]);
}
// Grid.intersection = intersection;
function unite(onto, a, b) {
    b = b || onto;
    onto.update((_, i, j) => b[i][j] || a[i][j]);
}

var grid = {
    __proto__: null,
    makeArray: makeArray,
    Grid: Grid,
    NumGrid: NumGrid,
    alloc: alloc,
    free: free,
    make: make$1,
    offsetZip: offsetZip,
    directionOfDoorSite: directionOfDoorSite,
    intersection: intersection,
    unite: unite
};

var data = {};

exports.Random = Random;
exports.cosmetic = cosmetic;
exports.data = data;
exports.flag = flag;
exports.flags = flags;
exports.grid = grid;
exports.random = random;
exports.range = range;
exports.utils = utils;
