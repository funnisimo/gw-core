import * as Canvas from '../canvas';
import * as Buffer from '../buffer';
import * as IO from '../io';
import * as Tween from '../tween';

import * as Style from './style';
import { UI } from './ui';
import { UILayer } from './types';

export type TimerFn = () => void;

export interface TimerInfo {
    action: TimerFn;
    time: number;
}

export interface UICore {
    readonly loop: IO.Loop;
    readonly canvas: Canvas.BaseCanvas;
    readonly width: number;
    readonly height: number;
    readonly styles: Style.Sheet;

    startNewLayer(): Layer;
    copyUIBuffer(dest: Buffer.Buffer): void;
    finishLayer(layer: Layer): void;

    stop(): void;
}

export type StartCb = () => void;
export type DrawCb = (buffer: Buffer.Buffer) => boolean;
export type EventCb = (e: IO.Event) => boolean;
export type FinishCb = (result: any) => void;

export interface LayerOptions {
    styles?: Style.Sheet;

    start?: StartCb;
    draw?: DrawCb;
    tick?: EventCb;
    dir?: EventCb;
    mousemove?: EventCb;
    click?: EventCb;
    keypress?: EventCb;
    finish?: FinishCb;
}

export class Layer implements UILayer {
    ui: UI;
    buffer: Canvas.Buffer;
    styles: Style.Sheet;

    needsDraw = true;
    result: any = undefined;

    timers: TimerInfo[] = [];
    _tweens: Tween.Tween[] = [];

    promise!: Promise<any>;
    _done: Function | null = null;

    _drawCb: DrawCb | null = null;
    _tickCb: EventCb | null = null;
    _dirCb: EventCb | null = null;
    _mousemoveCb: EventCb | null = null;
    _clickCb: EventCb | null = null;
    _keypressCb: EventCb | null = null;
    _finishCb: FinishCb | null = null;
    _startCb: StartCb | null = null;

    constructor(ui: UI, opts: LayerOptions = {}) {
        this.ui = ui;

        this.buffer = ui.canvas.buffer.clone();
        this.styles = new Style.Sheet(opts.styles || ui.styles);

        this.run(opts);
    }

    get width(): number {
        return this.ui.width;
    }
    get height(): number {
        return this.ui.height;
    }

    // EVENTS

    // on(event: string, cb: Widget.EventCb): this {
    //     this.body.on(event, cb);
    //     return this;
    // }

    // off(event: string, cb?: Widget.EventCb): this {
    //     this.body.off(event, cb);
    //     return this;
    // }

    mousemove(e: IO.Event): boolean {
        if (!this._mousemoveCb) return false;
        this._mousemoveCb.call(this, e);
        return false;
    }

    click(e: IO.Event): boolean {
        if (!this._clickCb) return false;
        this._clickCb.call(this, e);
        return false;
    }

    keypress(e: IO.Event): boolean {
        if (!e.key) return false;

        if (!this._keypressCb) return false;
        this._keypressCb.call(this, e);
        return false;
    }

    dir(e: IO.Event): boolean {
        if (!this._dirCb) return false;
        this._dirCb.call(this, e);
        return false;
    }

    tick(e: IO.Event): boolean {
        const dt = e.dt;

        // fire animations
        this._tweens.forEach((tw) => tw.tick(dt));
        this._tweens = this._tweens.filter((tw) => tw.isRunning());

        for (let timer of this.timers) {
            if (timer.time <= 0) continue; // ignore fired timers
            timer.time -= dt;
            if (timer.time <= 0) {
                timer.action();
            }
        }

        if (this._tickCb) {
            this._tickCb.call(this, e);
        }

        return false;
    }

    draw() {
        if (!this._drawCb) return;

        if (!this._drawCb.call(this, this.buffer)) return;
        console.log('draw');
        this.buffer.render();
    }

    // LOOP

    setTimeout(action: TimerFn, time: number) {
        const slot = this.timers.findIndex((t) => t.time <= 0);
        if (slot < 0) {
            this.timers.push({ action, time });
        } else {
            this.timers[slot] = { action, time };
        }
    }

    clearTimeout(action: string | TimerFn) {
        const timer = this.timers.find((t) => t.action === action);
        if (timer) {
            timer.time = -1;
        }
    }

    animate(tween: Tween.Tween): this {
        if (!tween.isRunning()) tween.start();
        this._tweens.push(tween);
        return this;
    }

    run(opts: LayerOptions): Promise<any> {
        this._drawCb = opts.draw || this._drawCb;
        this._tickCb = opts.tick || this._tickCb;
        this._dirCb = opts.dir || this._dirCb;
        this._mousemoveCb = opts.mousemove || this._mousemoveCb;
        this._clickCb = opts.click || this._clickCb;
        this._keypressCb = opts.keypress || this._keypressCb;
        this._finishCb = opts.finish || this._finishCb;
        this._startCb = opts.start || this._startCb;

        this.promise = new Promise((resolve) => {
            this._done = resolve;
        });

        if (this._startCb) {
            this._startCb.call(this);
        }

        return this.promise;
    }

    finish(result?: any) {
        this.result = result;
        this.ui.finishLayer(this);
    }

    _finish() {
        if (!this._done) return;
        if (this._finishCb) this._finishCb.call(this, this.result);
        this._done(this.result);
        this._done = null;
    }
}
