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

export function lerp(from: number, to: number, pct: number) {
    if (pct > 1) pct = 1;
    if (pct < 0) pct = 0;
    return Math.floor(from + (to - from) * pct);
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

export function arrayIncludesAll(a: any[], b: any[]) {
    return b.every((av) => a.includes(av));
}

export function arrayRevEach<T>(a: T[], fn: (v: T, i: number, a: T[]) => void) {
    for (let i = a.length - 1; i > -1; --i) {
        fn(a[i], i, a);
    }
}

export function arrayDelete<T>(a: T[], b: T) {
    const index = a.indexOf(b);
    if (index < 0) return false;
    a.splice(index, 1);
    return true;
}

export function arrayNullify<T>(a: (T | null)[], b: T) {
    const index = a.indexOf(b);
    if (index < 0) return false;
    a[index] = null;
    return true;
}

export function arrayInsert<T>(a: T[], b: T, beforeFn?: (t: T) => boolean) {
    if (!beforeFn) {
        a.push(b);
        return;
    }

    const index = a.findIndex(beforeFn);
    if (index < 0) {
        a.push(b);
    } else {
        a.splice(index, 0, b);
    }
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

export function arrayNext<T>(
    a: T[],
    current: T,
    fn: (t: T) => boolean,
    wrap = true,
    forward = true
): T | undefined {
    const len = a.length;
    if (len <= 1) return undefined;
    const startIndex = a.indexOf(current);
    if (startIndex < 0) return undefined;
    const dx = forward ? 1 : -1;

    let startI = wrap ? (len + startIndex + dx) % len : startIndex + dx;
    let endI = wrap ? startIndex : forward ? len : -1;

    for (
        let index = startI;
        index !== endI;
        index = wrap ? (len + index + dx) % len : index + dx
    ) {
        const e = a[index];
        if (fn(e)) return e;
    }

    return undefined;
}

export function arrayPrev<T>(
    a: T[],
    current: T,
    fn: (t: T) => boolean,
    wrap = true
): T | undefined {
    return arrayNext(a, current, fn, wrap, false);
}

export function nextIndex(index: number, length: number, wrap = true): number {
    ++index;
    if (index >= length) {
        if (wrap) return index % length;
        return -1;
    }
    return index;
}

export function prevIndex(index: number, length: number, wrap = true): number {
    if (index < 0) return length - 1; // start in back
    --index;
    if (index < 0) {
        if (wrap) return length - 1;
        return -1;
    }
    return index;
}
