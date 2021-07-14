import * as Utils from './utils';
import * as ROT from 'rot-js';

// export type RandomFunction = () => number;
// export type SeedFunction = (seed?: number) => RandomFunction;

// export interface RandomConfig {
//     make: SeedFunction;
// }

// const RANDOM_CONFIG: RandomConfig = {
//     make: (seed?: number) => {
//         let rng = ROT.RNG;
//         if (seed) {
//             rng = ROT.RNG.clone();
//             rng.setSeed(seed);
//         }
//         return rng.getUniform.bind(ROT.RNG);
//     },
// };

export type WeightedArray = number[];

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

export interface WeightedObject {
    [key: string]: number;
}

function lotteryDrawObject(rand: Random, weights: WeightedObject) {
    const entries = Object.entries(weights);
    const frequencies = entries.map(([_, weight]) => weight);
    const index = lotteryDrawArray(rand, frequencies);
    return entries[index][0];
}

export class Random {
    private _fn: typeof ROT.RNG;

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

    seed(val: number) {
        this._fn.setSeed(val);
    }

    value() {
        return this._fn.getUniform();
    }

    float() {
        return this.value();
    }

    number(max?: number) {
        // @ts-ignore
        if (max <= 0) return 0;
        max = max || Number.MAX_SAFE_INTEGER;
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

    weighted(weights: WeightedArray | WeightedObject) {
        if (Array.isArray(weights)) {
            return lotteryDrawArray(this, weights);
        }
        return lotteryDrawObject(this, weights);
    }

    item(list: any[]) {
        if (!Array.isArray(list)) {
            list = Object.values(list);
        }
        return list[this.range(0, list.length - 1)];
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

    matchingXY(
        width: number,
        height: number,
        matchFn: Utils.XYMatchFunc
    ): Utils.Loc {
        let locationCount = 0;
        let i, j, index;

        locationCount = 0;
        Utils.forRect(width, height, (i, j) => {
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

    matchingXYNear(
        x: number,
        y: number,
        matchFn: Utils.XYMatchFunc
    ): Utils.Loc {
        let loc: Utils.Loc = [-1, -1];
        let i, j, k, candidateLocs, randIndex;

        candidateLocs = 0;

        // count up the number of candidate locations
        for (k = 0; k < 50 && !candidateLocs; k++) {
            for (i = x - k; i <= x + k; i++) {
                for (j = y - k; j <= y + k; j++) {
                    if (
                        (i == x - k ||
                            i == x + k ||
                            j == y - k ||
                            j == y + k) &&
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

        for (k = 0; k < 50; k++) {
            for (i = x - k; i <= x + k; i++) {
                for (j = y - k; j <= y + k; j++) {
                    if (
                        (i == x - k ||
                            i == x + k ||
                            j == y - k ||
                            j == y + k) &&
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
        }

        return [-1, -1]; // should never reach this point
    }
}

export const random = new Random();
export const cosmetic = new Random();
