/**
 * GW.utils
 * @module utils
 */

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

export function arrayDelete<T>(a: T[], b: T) {
    const index = a.indexOf(b);
    if (index < 0) return false;
    a.splice(index, 1);
    return true;
}

export function arrayFindRight<T>(
    a: T[],
    fn: (t: T) => boolean
): T | undefined {
    for (let i = a.length - 1; i >= 0; --i) {
        const e = a[i];
        if (fn(e)) return e;
    }
    return undefined;
}

export function sum(arr: number[]) {
    return arr.reduce((a, b) => a + b);
}
