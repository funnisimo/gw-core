import * as CANVAS from '../canvas';
import * as EVENTS from './events';
import { IOQueue } from './io';
import * as IO from '../io';
import { Loop } from './loop';
import * as TIMERS from './timers';
import { Scenes } from './scenes';

export interface GWOpts /* extends CANVAS.CanvasOptions */ {
    // CanvasBase
    width?: number;
    height?: number;
    glyphs?: CANVAS.Glyphs;
    div?: HTMLElement | string;
    // io?: true; // if true, hookup events to standard IO loop.
    // loop?: IO.Loop; // The loop to attach to
    image?: HTMLImageElement | string; // glyph image

    // GlyphOptions
    font?: string;
    fontSize?: number;
    size?: number; // alias for fontSize
    tileWidth?: number;
    tileHeight?: number;
    basicOnly?: boolean;
    basic?: boolean; // alias for basicOnly

    on?: Record<string, EVENTS.CallbackFn>;
    loop?: Loop;
}

export class App {
    canvas: CANVAS.BaseCanvas;
    events: EVENTS.Events;
    timers: TIMERS.Timers;
    scenes: Scenes;
    io: IOQueue;
    loop: Loop;

    dt = 0;
    time = 0;
    realTime = 0;
    skipTime = false;

    fps = 0;
    fpsBuf: number[] = [];
    fpsTimer = 0;
    numFrames = 0;

    loopID = 0;
    stopped = true;
    paused = false;
    debug = false;

    constructor(opts: Partial<GWOpts> = {}) {
        if ('loop' in opts) {
            this.loop = opts.loop!;
            delete opts.loop;
        } else {
            this.loop = new Loop();
        }
        // @ts-ignore
        this.canvas = CANVAS.make(opts);
        this.io = new IOQueue();
        this.events = new EVENTS.Events(this);
        this.timers = new TIMERS.Timers(this);
        this.scenes = new Scenes(this);

        this.canvas.onclick = this.io.enqueue.bind(this.io);
        this.canvas.onmousemove = this.io.enqueue.bind(this.io);
        this.canvas.onclick = this.io.enqueue.bind(this.io);
        this.canvas.onkeydown = this.io.enqueue.bind(this.io);

        if (opts.on) {
            Object.entries(opts.on).forEach(([ev, fn]) => {
                this.on(ev, fn);
            });
        }

        this.loop.start(this._frame.bind(this));
    }

    get buffer() {
        return this.canvas.buffer;
    }

    get node() {
        return this.canvas.node;
    }

    get mouseXY() {
        return this.canvas.mouse;
    }

    on(ev: string, fn: EVENTS.CallbackFn): EVENTS.CancelFn {
        return this.events.on(ev, fn);
    }

    trigger(ev: string, ...args: any[]) {
        return this.events.trigger(ev, ...args);
    }

    wait(delay: number, fn: TIMERS.TimerFn): EVENTS.CancelFn;
    wait(delay: number, fn: string, ctx?: Record<string, any>): EVENTS.CancelFn;
    wait(
        delay: number,
        fn: TIMERS.TimerFn | string,
        ctx?: Record<string, any>
    ): EVENTS.CancelFn {
        if (typeof fn === 'string') {
            const ev = fn;
            ctx = ctx || {};
            fn = () => this.trigger(ev, ctx!);
        }
        return this.timers.setTimeout(fn, delay);
    }

    repeat(delay: number, fn: TIMERS.TimerFn): EVENTS.CancelFn;
    repeat(
        delay: number,
        fn: string,
        ctx?: Record<string, any>
    ): EVENTS.CancelFn;
    repeat(
        delay: number,
        fn: TIMERS.TimerFn | string,
        ctx?: Record<string, any>
    ): EVENTS.CancelFn {
        if (typeof fn === 'string') {
            const ev = fn;
            ctx = ctx || {};
            fn = () => this.trigger(ev, ctx!);
        }
        return this.timers.setInterval(fn, delay);
    }

    // run() {
    //     this.trigger('run', this);
    //     let running = false;
    //     this.loopID = (setInterval(() => {
    //         if (!running) {
    //             running = true;
    //             this._frame();
    //             running = false;
    //         }
    //     }, 16) as unknown) as number;
    //     this.stopped = false;
    // }

    stop() {
        this.trigger('stop', this);
        this.loop.stop();
        this.stopped = true;
    }

    _frame() {
        const t = Date.now();
        if (document && document.visibilityState !== 'visible') {
            return;
        }

        const realTime = t;
        const realDt = realTime - this.realTime;

        this.realTime = realTime;

        if (!this.skipTime) {
            this.dt = realDt;
            this.time += this.dt;
            this.fpsBuf.push(1000 / this.dt);
            this.fpsTimer += this.dt;
            if (this.fpsTimer >= 1) {
                this.fpsTimer = 0;
                this.fps = Math.round(
                    this.fpsBuf.reduce((a, b) => a + b) / this.fpsBuf.length
                );
                this.fpsBuf = [];
            }
        }

        this.skipTime = false;

        this.numFrames++;

        this._frameStart();
        this._input();

        if (!this.paused && this.debug !== true) {
            this._update();
        }

        this._draw();

        this._frameEnd();

        if (this.debug !== false) {
            this._frameDebug();
        }

        this.io.clear();
    }

    _input() {
        // let the scenes try it first
        this.scenes.input();

        // unprocessed io is handled here
        while (this.io.length) {
            const ev = this.io.dequeue()!;
            if (ev.type === IO.KEYPRESS) {
                if (
                    (ev.dir && this.events.trigger('dir', ev)) ||
                    this.events.trigger(ev.key, ev) ||
                    this.events.trigger(ev.code, ev)
                ) {
                    continue;
                }
            }
            this.events.trigger(ev.type, ev) || this.events.trigger('io', ev);
        }
    }

    _update() {
        this.timers.update(this.dt);
        this.events.trigger('update');
        this.scenes.update();
    }

    _frameStart() {
        this.events.trigger('frameStart');
        this.scenes.frameStart();
    }
    _draw() {
        this.events.trigger('draw');
        this.scenes.draw();
    }
    _frameDebug() {
        this.events.trigger('frameDebug');
        this.scenes.frameDebug();
    }
    _frameEnd() {
        this.events.trigger('frameEnd');
        this.scenes.frameEnd();

        if (this.buffer.changed) {
            this.buffer.render();
        }
    }
}

export function gw(opts: Partial<GWOpts>): App {
    const app = new App(opts);
    return app;
}
