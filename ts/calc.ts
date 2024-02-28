import { Random, random } from './rng';
import { ONE, ZERO } from './utils';

// const RE = /(?:([+-]?\d*)[Dd](\d*)|([+-]?\d+))([*/]\d+)?/g;
const RE = /(?:([+-]?\d*)[Dd](\d+)|(\d+):(\d+)|([+-]?\d+))([*/]\d+)?/g;

export type CalcFn = (rng: Random) => number;
export type CalcConfig = string | number | boolean | CalcFn | [number, number];

export function make(config: CalcConfig): CalcFn {
    if (typeof config == 'function') return config;
    if (config === undefined || config === null) return () => 0;
    if (typeof config == 'number') return () => config;
    if (config === true) return ONE;
    if (config === false) return ZERO;

    if (Array.isArray(config) && config.length == 2) {
        return (rng) => {
            rng = rng || random;
            return rng.range(config[0], config[1]);
        };
    }
    if (typeof config !== 'string')
        throw new Error('Calculations must be strings.');
    if (config.length == 0) return ZERO;

    const calcParts: CalcFn[] = [];
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
        } else if (results[3] && results[4]) {
            const min = Number.parseInt(results[3]);
            const max = Number.parseInt(results[4]);
            calcParts.push((rng) => {
                rng = rng || random;
                return rng.range(min, max) * mult;
            });
        } else if (results[5]) {
            const v = Number.parseInt(results[5]);
            calcParts.push(() => v * mult);
        }
    }

    if (calcParts.length == 0) {
        return ZERO;
    }
    if (calcParts.length == 1) {
        return calcParts[0];
    }
    return (rng) => calcParts.reduce((out, calc) => out + calc(rng), 0);
}

export function calc(config: CalcConfig, rng?: Random): number {
    const fn = make(config);
    return fn(rng || random);
}
