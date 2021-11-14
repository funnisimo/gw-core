// Tweeing API based on - http://tweenjs.github.io/tween.js/
import * as Utils from './utils';

export type Prop = number;
export type Props = Record<string, Prop>;

export type TweenCb<T extends Props> = (obj: T, dt: number) => any;

export type EasingFn = (v: number) => number;
export type InterpolateFn = (start: any, goal: any, pct: number) => any;

export class Tween<T extends Props> {
    _obj: T;

    _repeat = 0;
    _count = 0;

    _duration = 0;
    _delay = 0;
    _repeatDelay = 0;

    _time = Number.MAX_SAFE_INTEGER;
    _startTime = 0;

    _goal: Props = {};
    _start: Props = {};

    _startCb: TweenCb<T> | null = null;
    _updateCb: TweenCb<T> | null = null;
    _repeatCb: TweenCb<T> | null = null;
    _finishCb: TweenCb<T> | null = null;

    _easing: EasingFn = linear;
    _interpolate: InterpolateFn = interpolate;

    constructor(src: T) {
        this._obj = src;
    }

    isRunning(): boolean {
        return this._time < this._duration;
    }

    onStart(cb: TweenCb<T>): this {
        this._startCb = cb;
        return this;
    }

    onUpdate(cb: TweenCb<T>): this {
        this._updateCb = cb;
        return this;
    }

    onRepeat(cb: TweenCb<T>): this {
        this._repeatCb = cb;
        return this;
    }

    onFinish(cb: TweenCb<T>): this {
        this._finishCb = cb;
        return this;
    }

    to(goal: Props, duration?: number): this {
        this._goal = goal;
        if (duration !== undefined) this._duration = duration;
        return this;
    }

    duration(): number;
    duration(v: number): this;
    duration(v?: number): this | number {
        if (v === undefined) return this._duration;
        this._duration = v;
        return this;
    }

    repeat(): number;
    repeat(v: number): this;
    repeat(v?: number): this | number {
        if (v === undefined) return this._repeat;
        this._repeat = v;
        return this;
    }

    delay(): number;
    delay(v: number): this;
    delay(v?: number): this | number {
        if (v === undefined) return this._delay;
        this._delay = v;
        return this;
    }

    repeatDelay(): number;
    repeatDelay(v: number): this;
    repeatDelay(v?: number): this | number {
        if (v === undefined) return this._repeatDelay;
        this._repeatDelay = v;
        return this;
    }

    // TODO - yoyo

    start(): this {
        this._time = 0;
        this._startTime = this._delay;
        this._count = 0;
        this._start = {};
        Object.keys(this._goal).forEach(
            (key) => (this._start[key] = this._obj[key])
        );
        return this;
    }

    tick(dt: number): this {
        if (!this.isRunning()) return this;

        this._time += dt;
        if (this._startTime) {
            if (this._startTime > this._time) return this;
            this._time -= this._startTime;
            this._startTime = 0;
        }

        if (this._count === 0) {
            this._count = 1;
            if (this._startCb) {
                this._startCb(this._obj, 0);
            }
        }

        const pct = this._easing(this._time / this._duration);

        let madeChange = this._updateProperties(
            this._obj,
            this._start,
            this._goal,
            pct
        );

        if (madeChange && this._updateCb) {
            this._updateCb(this._obj, pct);
        }

        if (this._time >= this._duration) {
            if (this._repeat > this._count) {
                // reset starting values
                Object.entries(this._start).forEach(([key, value]) => {
                    (<Props>this._obj)[key] = value;
                });
                this._time -= this._duration;
                this._startTime = this._repeatDelay;
                ++this._count;
                if (this._repeatCb) this._repeatCb(this._obj, this._count);
            } else if (this._finishCb) this._finishCb(this._obj, 1);
        }
        return this;
    }

    _updateProperties(obj: T, start: Props, goal: Props, pct: number): boolean {
        let madeChange = false;
        Object.entries(goal).forEach(([field, goalV]) => {
            const currentV = obj[field];
            const startV = start[field];
            const updatedV = this._interpolate(startV, goalV, pct);
            if (updatedV !== currentV) {
                (<Props>obj)[field] = updatedV;
                madeChange = true;
            }
        });
        return madeChange;
    }
}

export function make<T extends Props>(src: T): Tween<T> {
    return new Tween(src);
}

export function linear(pct: number): number {
    return Utils.clamp(pct, 0, 1);
}

// TODO - string, bool, Color
export function interpolate(start: any, goal: any, pct: number): any {
    return Math.floor((goal - start) * pct) + start;
}
