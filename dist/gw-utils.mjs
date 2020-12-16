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
    number(max = 0) {
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
            return "" + this.lo;
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

var range = {
    __proto__: null,
    Range: Range,
    make: make
};

///////////////////////////////////
// FLAG
function fl(N) {
    return 1 << N;
}
function toString(flagObj, value) {
    const inverse = Object.entries(flagObj).reduce((out, entry) => {
        const [key, value] = entry;
        if (value)
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
function from(obj, ...args) {
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
            if ((this.hasXY(newX, newY) &&
                testFn(this[newX][newY], newX, newY, this)) !=
                (this.hasXY(oldX, oldY) && testFn(this[oldX][oldY], oldX, oldY, this))) {
                arcCount++;
            }
        }
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
    resize(width, height, v = 0) {
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
        this[x][y] = fillValue;
        for (dir = 0; dir < 4; dir++) {
            newX = x + DIRS$1[dir][0];
            newY = y + DIRS$1[dir][1];
            if (this.hasXY(newX, newY) &&
                this[newX][newY] >= eligibleValueMin &&
                this[newX][newY] <= eligibleValueMax) {
                fillCount += this.floodFillRange(newX, newY, eligibleValueMin, eligibleValueMax, fillValue);
            }
        }
        return fillCount;
    }
    invert() {
        this.update((v) => (v ? 0 : 1));
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
        return this.matchingLocNear(x, y, (v) => !!v, deterministic);
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
        return this.randomMatchingLoc((v) => v == targetValue, deterministic);
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
function make$1(w, h, v) {
    if (v === undefined)
        return new NumGrid(w, h, 0);
    if (typeof v === "number")
        return new NumGrid(w, h, v);
    return new Grid(w, h, v);
}
function offsetZip(destGrid, srcGrid, srcToDestX, srcToDestY, value) {
    const fn = typeof value === "function"
        ? value
        : (_, s, dx, dy) => (destGrid[dx][dy] = value || s);
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
        return;
    if (!fn) {
        clearEvent(event);
        return;
    }
    eachChain(EVENTS$1[event], (obj) => {
        const l = obj;
        if (l.matches(fn, context, once)) {
            removeFromChain(EVENTS$1, event, l);
        }
    });
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
    removeListener(event, fn, context, once);
}
/**
 * Clear event by name.
 *
 * @param {String} evt The Event name.
 */
function clearEvent(event) {
    EVENTS$1[event] = null;
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
        if (EVENTS$1[event])
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

function make$2(v) {
    if (v === undefined)
        return () => 100;
    if (v === null)
        return () => 0;
    if (typeof v === "number")
        return () => v;
    if (v && typeof v === "function")
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
    if (base && typeof base === "object") {
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
    return () => 0;
}

var frequency = {
    __proto__: null,
    make: make$2
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

var data = {};

export { Random, cosmetic, data, events, flag, flags, fov, frequency, grid, io, path, random, range, scheduler, utils };
