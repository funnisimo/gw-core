import { XY } from './types.js';

// Floating point stability
const precision = 8;
const p = Math.pow(10, precision);

function clean(val: any): number {
    if (typeof val !== 'number') {
        val = Number.parseFloat(val);
    }

    if (isNaN(val)) {
        throw new Error('NaN detected');
    }

    if (!isFinite(val)) {
        throw new Error('Infinity detected');
    }

    if (Math.round(val) === val) {
        return val;
    }

    return Math.round(val * p) / p;
}

export class Vec2 implements XY {
    x: number;
    y: number;

    constructor(x = 0, y = 0) {
        this.x = clean(x);
        this.y = clean(y);
    }

    // set x and y
    set(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        return this;
    }

    // reset x and y to zero
    zero() {
        return this.set(0, 0);
    }

    // return a new vector with the same component values
    // as this one
    clone() {
        const fn = this.constructor as new (x: number, y: number) => this;
        return new fn(this.x, this.y);
    }

    // negate the values of this vector
    negate(returnNew = false) {
        if (returnNew) {
            const fn = this.constructor as new (x: number, y: number) => this;
            return new fn(-this.x, -this.y);
        } else {
            return this.set(-this.x, -this.y);
        }
    }

    // Add the incoming `vec2` vector to this vector
    add(vec2: Vec2, returnNew?: boolean): this;
    add(x?: number, y?: number, returnNew?: boolean): this;
    add(...args: any[]): this {
        let [x, y, returnNew] = args;
        if (typeof x != 'number') {
            returnNew = y;
            if (Array.isArray(x)) {
                y = x[1];
                x = x[0];
            } else {
                y = x.y;
                x = x.x;
            }
        }

        x += this.x;
        y += this.y;

        if (!returnNew) {
            return this.set(x, y);
        } else {
            // Return a new vector if `returnNew` is truthy
            const fn = this.constructor as new (x: number, y: number) => this;
            return new fn(x, y);
        }
    }

    // Subtract the incoming `vec2` from this vector
    subtract(vec2: Vec2, returnNew?: boolean): this;
    subtract(x?: number, y?: number, returnNew?: boolean): this;
    subtract(...args: any[]): this {
        let [x, y, returnNew] = args;

        if (typeof x != 'number') {
            returnNew = y;
            if (Array.isArray(x)) {
                y = x[1];
                x = x[0];
            } else {
                y = x.y;
                x = x.x;
            }
        }

        x = this.x - x;
        y = this.y - y;

        if (!returnNew) {
            return this.set(x, y);
        } else {
            // Return a new vector if `returnNew` is truthy
            const fn = this.constructor as new (x: number, y: number) => this;
            return new fn(x, y);
        }
    }

    // Multiply this vector by the incoming `vec2`
    multiply(vec2: Vec2, returnNew?: boolean): this;
    multiply(x?: number, y?: number, returnNew?: boolean): this;
    multiply(...args: any[]): this {
        let [x, y, returnNew] = args;

        if (typeof x != 'number') {
            returnNew = y;
            if (Array.isArray(x)) {
                y = x[1];
                x = x[0];
            } else {
                y = x.y;
                x = x.x;
            }
        } else if (typeof y != 'number') {
            returnNew = y;
            y = x;
        }

        x *= this.x;
        y *= this.y;

        if (!returnNew) {
            return this.set(x, y);
        } else {
            const fn = this.constructor as new (x: number, y: number) => this;
            return new fn(x, y);
        }
    }

    // Rotate this vector. Accepts a `Rotation` or angle in radians.
    //
    // Passing a truthy `inverse` will cause the rotation to
    // be reversed.
    //
    // If `returnNew` is truthy, a new
    // `Vec2` will be created with the values resulting from
    // the rotation. Otherwise the rotation will be applied
    // to this vector directly, and this vector will be returned.
    rotate(r: number, inverse = false, returnNew = false) {
        var x = this.x,
            y = this.y,
            cos = Math.cos(r),
            sin = Math.sin(r),
            rx,
            ry;

        const mult = inverse ? -1 : 1;

        rx = cos * x - mult * sin * y;
        ry = mult * sin * x + cos * y;

        if (returnNew) {
            const fn = this.constructor as new (x: number, y: number) => this;
            return new fn(rx, ry);
        } else {
            return this.set(rx, ry);
        }
    }

    // Calculate the length of this vector
    length() {
        var x = this.x,
            y = this.y;
        return Math.sqrt(x * x + y * y);
    }

    // Get the length squared. For performance, use this instead of `Vec2#length` (if possible).
    lengthSquared() {
        var x = this.x,
            y = this.y;
        return x * x + y * y;
    }

    // Return the distance betwen this `Vec2` and the incoming vec2 vector
    // and return a scalar
    distance(vec2: Vec2) {
        var x = this.x - vec2.x;
        var y = this.y - vec2.y;
        return Math.sqrt(x * x + y * y);
    }

    // Given Array of Vec2, find closest to this Vec2.
    nearest(others: Vec2[]) {
        var shortestDistance = Number.MAX_VALUE,
            nearest = null,
            currentDistance;

        for (var i = others.length - 1; i >= 0; i--) {
            currentDistance = this.distance(others[i]);
            if (currentDistance <= shortestDistance) {
                shortestDistance = currentDistance;
                nearest = others[i];
            }
        }

        return nearest;
    }

    // Convert this vector into a unit vector.
    // Returns the length.
    normalize(returnNew = false) {
        var length = this.length();

        // Collect a ratio to shrink the x and y coords
        var invertedLength = length < Number.MIN_VALUE ? 0 : 1 / length;

        if (!returnNew) {
            // Convert the coords to be greater than zero
            // but smaller than or equal to 1.0
            return this.set(this.x * invertedLength, this.y * invertedLength);
        } else {
            const fn = this.constructor as new (x: number, y: number) => this;
            return new fn(this.x * invertedLength, this.y * invertedLength);
        }
    }

    // Determine if another `Vec2`'s components match this one's
    // also accepts 2 scalars
    equal(x: number, y: number): boolean;
    equal(v: Vec2): boolean;
    equal(v: number | Vec2, w?: number) {
        if (typeof v != 'number') {
            if (Array.isArray(v)) {
                w = v[1];
                v = v[0];
            } else {
                w = v.y;
                v = v.x;
            }
        }

        return clean(v) === this.x && clean(w) === this.y;
    }

    // Return a new `Vec2` that contains the absolute value of
    // each of this vector's parts
    abs(returnNew = false) {
        var x = Math.abs(this.x),
            y = Math.abs(this.y);

        if (returnNew) {
            const fn = this.constructor as new (x: number, y: number) => this;
            return new fn(x, y);
        } else {
            return this.set(x, y);
        }
    }

    // Return a new `Vec2` consisting of the smallest values
    // from this vector and the incoming
    //
    // When returnNew is truthy, a new `Vec2` will be returned
    // otherwise the minimum values in either this or `v` will
    // be applied to this vector.
    min(v: Vec2, returnNew = false) {
        var tx = this.x,
            ty = this.y,
            vx = v.x,
            vy = v.y,
            x = tx < vx ? tx : vx,
            y = ty < vy ? ty : vy;

        if (returnNew) {
            const fn = this.constructor as new (x: number, y: number) => this;
            return new fn(x, y);
        } else {
            return this.set(x, y);
        }
    }

    // Return a new `Vec2` consisting of the largest values
    // from this vector and the incoming
    //
    // When returnNew is truthy, a new `Vec2` will be returned
    // otherwise the minimum values in either this or `v` will
    // be applied to this vector.
    max(v: Vec2, returnNew = false) {
        var tx = this.x,
            ty = this.y,
            vx = v.x,
            vy = v.y,
            x = tx > vx ? tx : vx,
            y = ty > vy ? ty : vy;

        if (returnNew) {
            const fn = this.constructor as new (x: number, y: number) => this;
            return new fn(x, y);
        } else {
            return this.set(x, y);
        }
    }

    // Clamp values into a range.
    // If this vector's values are lower than the `low`'s
    // values, then raise them.  If they are higher than
    // `high`'s then lower them.
    //
    // Passing returnNew as true will cause a new Vec2 to be
    // returned.  Otherwise, this vector's values will be clamped
    clamp(low: Vec2, high: Vec2, returnNew = false) {
        var ret = this.min(high, true).max(low);
        if (returnNew) {
            return ret;
        } else {
            return this.set(ret.x, ret.y);
        }
    }

    // Perform linear interpolation between two vectors
    // amount is a decimal between 0 and 1
    lerp(vec: Vec2, amount: number, returnNew = false) {
        return this.add(vec.subtract(this, true).multiply(amount), returnNew);
    }

    // Get the skew vector such that dot(skew_vec, other) == cross(vec, other)
    skew(returnNew = false) {
        if (!returnNew) {
            return this.set(-this.y, this.x);
        } else {
            const fn = this.constructor as new (x: number, y: number) => this;
            return new fn(-this.y, -this.x);
        }
    }

    // calculate the dot product between
    // this vector and the incoming
    dot(b: Vec2): number {
        return clean(this.x * b.x + b.y * this.y);
    }

    // calculate the perpendicular dot product between
    // this vector and the incoming
    perpDot(b: Vec2): number {
        return clean(this.x * b.y - this.y * b.x);
    }

    // Determine the angle between two vec2s
    angleTo(vec: Vec2): number {
        return Math.atan2(this.perpDot(vec), this.dot(vec));
    }

    // Divide this vector's components by a scalar
    divide(x: number, y: number, returnNew?: boolean): this;
    divide(vec: Vec2, returnNew?: boolean): this;
    divide(...args: any[]): this {
        let [x, y, returnNew] = args;
        if (typeof x != 'number') {
            returnNew = y;
            if (Array.isArray(x)) {
                y = x[1];
                x = x[0];
            } else {
                y = x.y;
                x = x.x;
            }
        } else if (typeof y != 'number') {
            returnNew = y;
            y = x;
        }

        if (x === 0 || y === 0) {
            throw new Error('division by zero');
        }

        if (isNaN(x) || isNaN(y)) {
            throw new Error('NaN detected');
        }

        if (returnNew) {
            const fn = this.constructor as new (x: number, y: number) => this;
            return new fn(this.x / x, this.y / y);
        }

        return this.set(this.x / x, this.y / y);
    }

    isPointOnLine(start: Vec2, end: Vec2): boolean {
        return (
            (start.y - this.y) * (start.x - end.x) ===
            (start.y - end.y) * (start.x - this.x)
        );
    }

    toArray() {
        return [this.x, this.y];
    }

    fromArray(array: [number, number]) {
        return this.set(array[0], array[1]);
    }
    toJSON() {
        return { x: this.x, y: this.y };
    }
    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
}

export function make(x: number, y: number): Vec2;
export function make(v: [number, number]): Vec2;
export function make(...args: any[]): Vec2 {
    if (args.length == 1) {
        args = args[0];
    }

    return new Vec2(args[0], args[1]);
}
