/**
 * GW.utils
 * @module utils
 */

import { Random, Alea } from '../random';

export { Random, Alea };

export function NOOP() {}
export function TRUE() {
    return true;
}
export function FALSE() {
    return false;
}
export function ONE() {
    return 1;
}
export function ZERO() {
    return 0;
}
export function IDENTITY(x: any) {
    return x;
}
export function IS_ZERO(x: number) {
    return x == 0;
}
export function IS_NONZERO(x: number) {
    return x != 0;
}

/**
 * clamps a value between min and max (inclusive)
 * @param v {Number} the value to clamp
 * @param min {Number} the minimum value
 * @param max {Number} the maximum value
 * @returns {Number} the clamped value
 */
export function clamp(v: number, min: number, max: number) {
    if (v < min) return min;
    if (v > max) return max;
    return v;
}

export function ERROR(message: string) {
    throw new Error(message);
}

export function WARN(...args: string[]) {
    console.warn(...args);
}

export function first(...args: any[]) {
    return args.find((v) => v !== undefined);
}

export function arraysIntersect(a: any[], b: any[]) {
    return a.some((av) => b.includes(av));
}

export function sum(arr: number[]) {
    return arr.reduce((a, b) => a + b);
}

// ALGOS

export async function asyncForEach<T>(
    iterable: Iterable<T>,
    fn: (t: T) => Promise<any> | any
) {
    for (let t of iterable) {
        await fn(t);
    }
}
