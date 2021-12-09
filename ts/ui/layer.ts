import * as Canvas from '../canvas';
import * as Buffer from '../buffer';
import * as IO from '../io';
import * as Tween from '../tween';
import * as Utils from '../utils';

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
}

export class Layer implements UILayer, Tween.Animator {
    ui: UI;
    buffer: Canvas.Buffer;
    styles: Style.Sheet;

    needsDraw = true;
    result: any = undefined;

    timers: TimerInfo[] = [];
    _tweens: Tween.Animation[] = [];

    _running = false;
    _keymap: IO.IOMap = {};

    constructor(ui: UI, opts: LayerOptions = {}) {
        this.ui = ui;

        this.buffer = ui.canvas.buffer.clone();
        this.styles = new Style.Sheet(opts.styles || ui.styles);

        // this.run(opts);
    }

    get running() {
        return this._running;
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

    mousemove(_e: IO.Event): boolean {
        return false;
    }

    click(_e: IO.Event): boolean {
        return false;
    }

    keypress(_e: IO.Event): boolean {
        return false;
    }

    dir(_e: IO.Event): boolean {
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

        return false;
    }

    draw() {
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

    // Animator

    addAnimation(a: Tween.Animation): void {
        if (!a.isRunning()) a.start();
        this._tweens.push(a);
    }
    removeAnimation(a: Tween.Animation): void {
        Utils.arrayNullify(this._tweens, a);
    }

    // RUN

    async run(keymap: IO.IOMap = {}, ms = -1): Promise<any> {
        if (this._running) throw new Error('Already running!');

        this.result = undefined;
        const loop = this.ui.loop;
        this._running = true;
        loop.clearEvents(); // ??? Should we do this?

        ['keypress', 'dir', 'click', 'mousemove', 'tick', 'draw'].forEach(
            (e) => {
                if (e in keymap) return;
                keymap[e] = this[e as keyof Layer];
            }
        );

        if (keymap.start && typeof keymap.start === 'function') {
            await (<IO.ControlFn>keymap.start).call(this);
        }

        let busy = false;
        const tickLoop = (setInterval(() => {
            if (busy) return;
            const e = IO.makeTickEvent(16);
            loop.pushEvent(e);
        }, 16) as unknown) as number;

        while (this._running) {
            if (keymap.draw && typeof keymap.draw === 'function') {
                (<IO.ControlFn>keymap.draw).call(this);
            }
            if (this._tweens.length) {
                const ev = await loop.nextTick();
                if (ev && ev.dt) {
                    this._tweens.forEach((a) => a && a.tick(ev.dt));
                    this._tweens = this._tweens.filter(
                        (a) => a && a.isRunning()
                    );
                }
            } else {
                const ev = await loop.nextEvent(ms);
                busy = true;
                if (ev) {
                    await IO.dispatchEvent(ev, keymap, this); // return code does not matter (call layer.finish() to exit loop)
                    // this._running = false;
                }
                busy = false;
            }
        }

        if (keymap.stop && typeof keymap.stop === 'function') {
            await (<IO.ControlFn>keymap.stop).call(this);
        }

        clearInterval(tickLoop);

        return this.result;
    }

    finish(result?: any) {
        this.result = result;
        this._running = false;
        this.ui._finishLayer(this);
    }
}
