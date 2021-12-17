import * as Canvas from '../canvas';
import * as Buffer from '../buffer';
import * as IO from '../io';
import * as Tween from '../tween';
// import * as Utils from '../utils';

import * as Style from './style';
import { UI } from './ui';
import { UILayer } from './types';

export type StartCb = () => void;
export type DrawCb = (buffer: Buffer.Buffer) => boolean;
export type EventCb = (e: IO.Event) => boolean;
export type FinishCb = (result: any) => void;

export interface LayerOptions {
    styles?: Style.Sheet;
}

export interface BufferStack {
    readonly buffer: Canvas.Buffer;
    readonly parentBuffer: Canvas.Buffer;
    readonly loop: IO.Loop;

    pushBuffer(): Canvas.Buffer;
    popBuffer(): void;
}

export class Layer implements UILayer, Tween.Animator {
    ui: UI;
    buffer: Canvas.Buffer;
    io: IO.Handler;
    // styles: Style.Sheet;

    needsDraw = true;
    // result: any = undefined;

    // timers: TimerInfo[] = [];
    // _tweens: Tween.Animation[] = [];

    // _running = false;
    // _keymap: IO.IOMap = {};

    constructor(ui: UI, _opts: LayerOptions = {}) {
        this.ui = ui;
        this.buffer = ui.canvas.pushBuffer();
        this.io = new IO.Handler(ui.loop);
        ui.pushLayer(this);

        // this.styles = new Style.Sheet(opts.styles || ui.styles);
    }

    // get running() {
    //     return this._running;
    // }

    get width(): number {
        return this.buffer.width;
    }
    get height(): number {
        return this.buffer.height;
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

    mousemove(_e: IO.Event): boolean | Promise<boolean> {
        return false;
    }

    click(_e: IO.Event): boolean | Promise<boolean> {
        return false;
    }

    keypress(_e: IO.Event): boolean | Promise<boolean> {
        return false;
    }

    dir(_e: IO.Event): boolean | Promise<boolean> {
        return false;
    }

    tick(_e: IO.Event): boolean | Promise<boolean> {
        // const dt = e.dt;

        // // fire animations
        // this._tweens.forEach((tw) => tw.tick(dt));
        // this._tweens = this._tweens.filter((tw) => tw.isRunning());

        // for (let timer of this.timers) {
        //     if (timer.time <= 0) continue; // ignore fired timers
        //     timer.time -= dt;
        //     if (timer.time <= 0) {
        //         timer.action();
        //     }
        // }

        return false;
    }

    draw() {
        if (this.buffer.changed) {
            console.log('draw');
            this.buffer.render();
        }
    }

    // LOOP

    setTimeout(action: IO.TimerFn, time: number): IO.TimerFn {
        return this.io.setTimeout(action, time);
        // const slot = this.timers.findIndex((t) => t.time <= 0);
        // if (slot < 0) {
        //     this.timers.push({ action, time });
        // } else {
        //     this.timers[slot] = { action, time };
        // }
    }

    clearTimeout(action: IO.TimerFn) {
        this.io.clearTimeout(action);
        // const timer = this.timers.find((t) => t.action === action);
        // if (timer) {
        //     timer.time = -1;
        // }
    }

    // Animator

    addAnimation(a: Tween.Animation): void {
        this.io.addAnimation(a);
    }
    removeAnimation(a: Tween.Animation): void {
        this.io.removeAnimation(a);
    }

    // RUN

    run(keymap: IO.IOMap = {}, ms = -1): Promise<any> {
        ['keypress', 'dir', 'click', 'mousemove', 'tick', 'draw'].forEach(
            (e) => {
                if (e in keymap) return;
                keymap[e] = this[e as keyof Layer] as IO.EventFn;
            }
        );

        return this.io.run(keymap, ms, this);
    }

    finish(result?: any) {
        this.io.finish(result);
        this.ui.canvas.popBuffer();
        this.ui.popLayer(this);
        // this.ui.loop.popHandler(this.io);
    }
}
