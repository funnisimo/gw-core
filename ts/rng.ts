import * as XY from './xy';
import {
    RandomFunction,
    WeightedArray,
    RandomConfig,
    WeightedObject,
} from './types';

export { WeightedArray, WeightedObject, RandomConfig, RandomFunction };

/**
 * The code in this function is extracted from ROT.JS.
 * Source: https://github.com/ondras/rot.js/blob/v2.2.0/src/rng.ts
 * Copyright (c) 2012-now(), Ondrej Zara
 * All rights reserved.
 * License: BSD 3-Clause "New" or "Revised" License
 * See: https://github.com/ondras/rot.js/blob/v2.2.0/license.txt
 */
export function Alea(seed?: number): RandomFunction {
    /**
     * This code is an implementation of Alea algorithm; (C) 2010 Johannes Baagøe.
     * Alea is licensed according to the http://en.wikipedia.org/wiki/MIT_License.
     */

    seed = Math.abs(seed || Date.now());
    seed = seed < 1 ? 1 / seed : seed;

    const FRAC = 2.3283064365386963e-10; /* 2^-32 */

    let _s0 = 0;
    let _s1 = 0;
    let _s2 = 0;
    let _c = 0;

    /**
     * Seed the number generator
     */

    _s0 = (seed >>> 0) * FRAC;
    seed = (seed * 69069 + 1) >>> 0;
    _s1 = seed * FRAC;
    seed = (seed * 69069 + 1) >>> 0;
    _s2 = seed * FRAC;
    _c = 1;

    /**
     * @returns Pseudorandom value [0,1), uniformly distributed
     */
    return function alea() {
        let t = 2091639 * _s0 + _c * FRAC;
        _s0 = _s1;
        _s1 = _s2;
        _c = t | 0;
        _s2 = t - _c;
        return _s2;
    };
}

const RANDOM_CONFIG: RandomConfig = {
    make: Alea,
    // make: (seed?: number) => {
    //     let rng = ROT.RNG.clone();
    //     if (seed) {
    //         rng.setSeed(seed);
    //     }
    //     return rng.getUniform.bind(rng);
    // },
};

export function configure(config: Partial<RandomConfig> = {}) {
    if (config.make) {
        RANDOM_CONFIG.make = config.make;
        random.seed();
        cosmetic.seed();
    }
}

function lotteryDrawArray(rand: Random, frequencies: WeightedArray) {
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
        } else {
            randIndex -= frequencies[i];
        }
    }
    console.warn('Lottery Draw failed.', frequencies, frequencies.length);
    return 0;
}

function lotteryDrawObject(rand: Random, weights: WeightedObject) {
    const entries = Object.entries(weights);
    const frequencies = entries.map(([_, weight]) => weight);
    const index = lotteryDrawArray(rand, frequencies);
    if (index < 0) return -1;
    return entries[index][0];
}

export class Random {
    private _fn: RandomFunction;

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

    constructor(seed?: number) {
        this._fn = RANDOM_CONFIG.make(seed);
    }

    seed(val?: number) {
        val = val || Date.now();
        this._fn = RANDOM_CONFIG.make(val);
    }

    value() {
        return this._fn();
    }

    float() {
        return this.value();
    }

    number(max = Number.MAX_SAFE_INTEGER) {
        if (max <= 0) return 0;
        return Math.floor(this.value() * max);
    }

    int(max: number = 0) {
        return this.number(max);
    }

    range(lo: number, hi: number) {
        if (hi <= lo) return hi;
        const diff = hi - lo + 1;
        return lo + this.number(diff);
    }

    /**
     * @param mean Mean value
     * @param stddev Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
     * @returns A normally distributed pseudorandom value
     * @see: https://github.com/ondras/rot.js/blob/v2.2.0/src/rng.ts
     */
    normal(mean = 0, stddev = 1) {
        let u, v, r;
        do {
            u = 2 * this.value() - 1;
            v = 2 * this.value() - 1;
            r = u * u + v * v;
        } while (r > 1 || r == 0);

        let gauss = u * Math.sqrt((-2 * Math.log(r)) / r);
        return mean + gauss * stddev;
    }

    dice(count: number, sides: number, addend = 0) {
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

    weighted(weights: WeightedArray): number;
    weighted(weights: WeightedObject): string;
    weighted(weights: WeightedArray | WeightedObject): string | number {
        if (Array.isArray(weights)) {
            return lotteryDrawArray(this, weights);
        }
        return lotteryDrawObject(this, weights);
    }

    item(list: any[]): any;
    item(obj: { [k: string]: any }): any;
    item(list: any[] | { [k: string]: any }): any {
        if (!Array.isArray(list)) {
            list = Object.values(list) as any[];
        }
        return (<any[]>list)[this.range(0, list.length - 1)];
    }

    key(obj: object) {
        return this.item(Object.keys(obj));
    }

    shuffle(list: any[], fromIndex: number = 0, toIndex: number = 0) {
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

    sequence(n: number) {
        const list = [];
        for (let i = 0; i < n; i++) {
            list[i] = i;
        }
        return this.shuffle(list);
    }

    chance(percent: number, outOf = 100) {
        if (percent <= 0) return false;
        if (percent >= outOf) return true;
        return this.number(outOf) < percent;
    }

    // Get a random int between lo and hi, inclusive, with probability distribution
    // affected by clumps.
    clumped(lo: number, hi: number, clumps: number) {
        if (hi <= lo) {
            return lo;
        }
        if (clumps <= 1) {
            return this.range(lo, hi);
        }

        let i,
            total = 0,
            numSides = Math.floor((hi - lo) / clumps);

        for (i = 0; i < (hi - lo) % clumps; i++) {
            total += this.range(0, numSides + 1);
        }

        for (; i < clumps; i++) {
            total += this.range(0, numSides);
        }

        return total + lo;
    }

    matchingLoc(
        width: number,
        height: number,
        matchFn: XY.XYMatchFunc
    ): XY.Loc {
        let locationCount = 0;
        let i, j, index;

        locationCount = 0;
        XY.forRect(width, height, (i, j) => {
            if (matchFn(i, j)) {
                locationCount++;
            }
        });

        if (locationCount == 0) {
            return [-1, -1];
        } else {
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

    matchingLocNear(x: number, y: number, matchFn: XY.XYMatchFunc): XY.Loc {
        let loc: XY.Loc = [-1, -1];
        let i, j, k, candidateLocs, randIndex;

        candidateLocs = 0;

        // count up the number of candidate locations
        for (k = 0; k < 50 && !candidateLocs; k++) {
            for (i = x - k; i <= x + k; i++) {
                for (j = y - k; j <= y + k; j++) {
                    if (
                        Math.ceil(XY.distanceBetween(x, y, i, j)) == k &&
                        matchFn(i, j)
                    ) {
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

        --k;
        // for (k = 0; k < 50; k++) {
        for (i = x - k; i <= x + k; i++) {
            for (j = y - k; j <= y + k; j++) {
                if (
                    Math.ceil(XY.distanceBetween(x, y, i, j)) == k &&
                    matchFn(i, j)
                ) {
                    if (--randIndex == 0) {
                        loc[0] = i;
                        loc[1] = j;
                        return loc;
                    }
                }
            }
        }
        // }

        return [-1, -1]; // should never reach this point
    }
}

export const random = new Random();
export const cosmetic = new Random();

export function make(seed?: number): Random {
    return new Random(seed);
}
