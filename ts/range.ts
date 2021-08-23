import { random, Random } from './random';

export type RangeBase = Range | string | number[] | number;

export class Range {
    public lo: number;
    public hi: number;
    public clumps: number;
    private _rng: Random | null;

    constructor(lower: number, upper = 0, clumps = 1, rng?: Random) {
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

    contains(value: number): boolean {
        return this.lo <= value && this.hi >= value;
    }

    copy(other: Range) {
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

export function make(config: RangeBase | null, rng?: Random): Range {
    if (!config) return new Range(0, 0, 0, rng);
    if (config instanceof Range) return config; // don't need to clone since they are immutable
    // if (config.value) return config;  // calc or damage

    if (typeof config == 'function')
        throw new Error('Custom range functions not supported - extend Range');

    if (config === undefined || config === null) return new Range(0, 0, 0, rng);
    if (typeof config == 'number') return new Range(config, config, 1, rng);

    // @ts-ignore
    if (config === true || config === false)
        throw new Error('Invalid random config: ' + config);

    if (Array.isArray(config)) {
        return new Range(config[0], config[1], config[2], rng);
    }
    if (typeof config !== 'string') {
        throw new Error(
            'Calculations must be strings.  Received: ' + JSON.stringify(config)
        );
    }
    if (config.length == 0) return new Range(0, 0, 0, rng);

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
        } else if (results[4] && results[5]) {
            const min = Number.parseInt(results[4]);
            const max = Number.parseInt(results[5]);
            const clumps = Number.parseInt(results[6]);
            return new Range(min, max, clumps, rng);
        } else if (results[7] && results[8]) {
            const base = Number.parseInt(results[7]);
            const std = Number.parseInt(results[8]);
            return new Range(base - 2 * std, base + 2 * std, 3, rng);
        } else if (results[9]) {
            const v = Number.parseFloat(results[9]);
            return new Range(v, v, 1, rng);
        }
    }

    throw new Error('Not a valid range - ' + config);
}

export const from = make;

export function asFn(config: RangeBase | null, rng?: Random) {
    const range = make(config, rng);
    return () => range.value();
}
