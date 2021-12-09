// Tweeing API based on - http://tweenjs.github.io/tween.js/
import * as Utils from './utils';

export type AnyObj = Record<string, any>;
export type TweenCb = (obj: AnyObj, dt: number) => void;
export type TweenFinishCb = (obj: AnyObj, success: boolean) => any;

export type EasingFn = (v: number) => number;
export type InterpolateFn = (start: any, goal: any, pct: number) => any;

export interface Animation {
    isRunning(): boolean;

    start(): void;
    tick(dt: number): boolean;
    stop(): void;

    // gameTick(dt: number): boolean;
}

export interface Animator {
    addAnimation(a: Animation): void;
    removeAnimation(a: Animation): void;
}

export class Tween implements Animation {
    _obj: AnyObj;

    _repeat = 0;
    _count = 0;
    _from = false;

    _duration = 0;
    _delay = 0;
    _repeatDelay = -1;
    _yoyo = false;

    _time = Number.MAX_SAFE_INTEGER;
    _startTime = 0;

    _goal: AnyObj = {};
    _start: AnyObj = {};

    _startCb: TweenCb | null = null;
    _updateCb: TweenCb | null = null;
    _repeatCb: TweenCb | null = null;
    _finishCb: TweenFinishCb | null = null;
    _resolveCb: null | ((v?: any) => void) = null;

    _easing: EasingFn = linear;
    _interpolate: InterpolateFn = interpolate;

    constructor(src: AnyObj) {
        this._obj = src;
    }

    isRunning(): boolean {
        return this._time < this._duration;
    }

    onStart(cb: TweenCb): this {
        this._startCb = cb;
        return this;
    }

    onUpdate(cb: TweenCb): this {
        this._updateCb = cb;
        return this;
    }

    onRepeat(cb: TweenCb): this {
        this._repeatCb = cb;
        return this;
    }

    onFinish(cb: TweenFinishCb): this {
        this._finishCb = cb;
        return this;
    }

    to(goal: AnyObj, duration?: number): this {
        this._goal = goal;
        this._from = false;
        if (duration !== undefined) this._duration = duration;
        return this;
    }

    from(start: AnyObj, duration?: number): this {
        this._start = start;
        this._from = true;
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

    yoyo(): boolean;
    yoyo(v: boolean): this;
    yoyo(v?: boolean): this | boolean {
        if (v === undefined) return this._yoyo;
        this._yoyo = v;
        return this;
    }

    start(): Promise<any> {
        this._time = 0;
        this._startTime = this._delay;
        this._count = 0;
        if (this._from) {
            this._goal = {};
            Object.keys(this._start).forEach(
                (key) => (this._goal[key] = this._obj[key])
            );
            this._updateProperties(this._obj, this._start, this._goal, 0);
        } else {
            this._start = {};
            Object.keys(this._goal).forEach(
                (key) => (this._start[key] = this._obj[key])
            );
        }

        let p = new Promise((resolve) => {
            this._resolveCb = resolve;
        });

        if (this._finishCb) {
            const cb = this._finishCb;
            p = p.then((success) => cb.call(this, this._obj, !!success));
        }
        return p;
    }

    tick(dt: number): boolean {
        if (!this.isRunning()) return false;

        this._time += dt;
        if (this._startTime) {
            if (this._startTime > this._time) return true;
            this._time -= this._startTime;
            this._startTime = 0;
            if (this._count > 0) this._restart();
        }

        if (this._count === 0) {
            this._restart();
        }

        const pct = this._easing(this._time / this._duration);

        let madeChange = this._updateProperties(
            this._obj,
            this._start,
            this._goal,
            pct
        );

        if (madeChange && this._updateCb) {
            this._updateCb.call(this, this._obj, pct);
        }

        if (this._time >= this._duration) {
            if (this._repeat > this._count) {
                this._time -= this._duration;
                this._startTime =
                    this._repeatDelay > -1 ? this._repeatDelay : this._delay;
                if (this._yoyo) {
                    [this._start, this._goal] = [this._goal, this._start];
                }
                if (!this._startTime) {
                    this._restart();
                }
            } else {
                this.stop(true);
            }
        }
        return true;
    }

    _restart() {
        ++this._count;

        // reset starting values
        Object.entries(this._start).forEach(([key, value]) => {
            this._obj[key] = value;
        });
        if (this._count == 1) {
            if (this._startCb) {
                this._startCb.call(this, this._obj, 0);
            }
        } else if (this._repeatCb) {
            this._repeatCb.call(this, this._obj, this._count);
        } else if (this._updateCb) {
            this._updateCb.call(this, this._obj, 0);
        }
    }

    // gameTick(_dt: number): boolean {
    //     return false;
    // }

    stop(success = false): void {
        this._time = Number.MAX_SAFE_INTEGER;
        // if (this._finishCb) this._finishCb.call(this, this._obj, 1);
        if (this._resolveCb) this._resolveCb(success);
    }

    _updateProperties(
        obj: AnyObj,
        start: AnyObj,
        goal: AnyObj,
        pct: number
    ): boolean {
        let madeChange = false;
        Object.entries(goal).forEach(([field, goalV]) => {
            const currentV = obj[field];
            const startV = start[field];
            const updatedV = this._interpolate(startV, goalV, pct);
            if (updatedV !== currentV) {
                obj[field] = updatedV;
                madeChange = true;
            }
        });
        return madeChange;
    }
}

export function make(src: AnyObj): Tween {
    return new Tween(src);
}

export function linear(pct: number): number {
    return Utils.clamp(pct, 0, 1);
}

// TODO - string, bool, Color
export function interpolate(start: any, goal: any, pct: number): any {
    if (typeof start === 'boolean' || typeof goal === 'boolean') {
        return Math.floor(pct) == 0 ? start : goal;
    }
    return Math.floor((goal - start) * pct) + start;
}
