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
export class Random {
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
export const random = new Random();
export const cosmetic = new Random();
//# sourceMappingURL=random.js.map