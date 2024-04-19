import { Random, random } from './rng.js';
import { ONE, ZERO } from './utils.js';

// const RE = /(?:([+-]?\d*)[Dd](\d*)|([+-]?\d+))([*/]\d+)?/g;
const RE = /(?:([+-]?\d*)[Dd](\d+)|(\d+):(\d+)|([+-]?\d+))([*/]\d+)?/g;

export type CalcFn = (rng: Random) => number;
export type CalcConfig = string | number | boolean | CalcFn | [number, number];

export interface Calc {
    (rng: Random): number;
    min: number;
    max: number;
}

function makeCalc(fn: CalcFn, min: number = 0, max: number = 0): Calc {
    const out = fn as Calc;
    out.min = min;
    out.max = max;

    const text = min != max ? `${min}-${max}` : `${min}`;
    out.toString = () => text;
    return out;
}

export function make(config: CalcConfig): Calc {
    if (typeof config == 'function') {
        let out = config as Calc;
        if (!('min' in out)) {
            // @ts-ignore
            out.min = 0;
        }
        if (!('max' in out)) {
            // @ts-ignore
            out.max = 0;
        }
        return out;
    }
    if (config === undefined || config === null) return makeCalc(ZERO, 0, 0);
    if (typeof config == 'number')
        return makeCalc(() => config, config, config);
    if (config === true) return makeCalc(ONE, 1, 1);
    if (config === false) return makeCalc(ZERO, 0, 0);

    if (Array.isArray(config) && config.length == 2) {
        return makeCalc(
            (rng) => {
                rng = rng || random;
                return rng.range(config[0], config[1]);
            },
            config[0],
            config[1]
        );
    }
    if (typeof config !== 'string')
        throw new Error('Calculations must be strings.');
    if (config.length == 0) return makeCalc(ZERO, 0, 0);

    const calcParts: CalcFn[] = [];
    let min = 0;
    let max = 0;

    let results;
    while ((results = RE.exec(config)) !== null) {
        // console.log(results);
        let mult = 1;
        if (results[6]) {
            mult = Number.parseInt(results[6].substring(1));
            if (results[6].startsWith('/')) {
                mult = 1 / mult;
            }
        }
        if (results[1] && results[2]) {
            let count = Number.parseInt(results[1]);
            if (count < 0) {
                count = Math.abs(count);
                mult *= -1;
            }
            const sides = Number.parseInt(results[2]);
            calcParts.push((rng) => {
                rng = rng || random;
                return rng.dice(count, sides) * mult;
            });
            min += count * mult;
            max += count * sides * mult;
        } else if (results[3] && results[4]) {
            const lo = Number.parseInt(results[3]);
            const hi = Number.parseInt(results[4]);
            calcParts.push((rng) => {
                rng = rng || random;
                return rng.range(lo, hi) * mult;
            });
            min += lo * mult;
            max += hi * mult;
        } else if (results[5]) {
            const v = Number.parseInt(results[5]);
            calcParts.push(() => v * mult);
            min += v * mult;
            max += v * mult;
        }
    }

    if (calcParts.length == 0) {
        return makeCalc(ZERO, 0, 0);
    }
    if (calcParts.length == 1) {
        return makeCalc(calcParts[0], min, max);
    }
    return makeCalc(
        (rng) => calcParts.reduce((out, calc) => out + calc(rng), 0),
        min,
        max
    );
}

export function calc(config: CalcConfig, rng?: Random): number {
    const fn = make(config);
    return fn(rng || random);
}
