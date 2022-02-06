import * as EVENTS from './events';
import * as TIMERS from './timers';
import * as IO from '../io';
import { App } from './gw';
import * as CANVAS from '../canvas';

export interface SceneOpts {
    data?: Record<string, string>;

    // add/remove from scene manager (app)
    create?: EVENTS.CallbackFn;
    delete?: EVENTS.CallbackFn;

    // start/stop?
    // when made active/inactive
    show?: EVENTS.CallbackFn;
    hide?: EVENTS.CallbackFn;

    // start/stop update calls
    pause?: EVENTS.CallbackFn;
    resume?: EVENTS.CallbackFn;

    // start/stop update and draw calls
    sleep?: EVENTS.CallbackFn;
    wake?: EVENTS.CallbackFn;

    // run in this order each frame
    frameStart?: EVENTS.CallbackFn;
    input?: EVENTS.CallbackFn;
    update?: EVENTS.CallbackFn;
    draw?: EVENTS.CallbackFn;
    frameDebug?: EVENTS.CallbackFn;
    frameEnd?: EVENTS.CallbackFn;

    // other event handlers
    on?: Record<string, EVENTS.CallbackFn>;
}

export class Scene {
    id: string;
    app!: App;
    events: EVENTS.Events;
    timers: TIMERS.Timers;
    buffer!: CANVAS.Buffer;

    dt = 0;
    time = 0;
    realTime = 0;
    skipTime = false;

    stopped = true;
    paused = false;
    sleeping = false;
    debug = false;

    constructor(id: string, opts: SceneOpts = {}) {
        this.id = id;
        this.events = new EVENTS.Events(this);
        this.timers = new TIMERS.Timers(this);

        if (opts.on) {
            Object.entries(opts.on).forEach(([ev, fn]) => {
                this.on(ev, fn);
            });
        }
        Object.entries(opts).forEach(([ev, fn]) => {
            if (typeof fn !== 'function') return;
            this.on(ev, fn);
        });
    }

    isActive() {
        return !this.stopped;
    }
    isPaused() {
        return this.isPaused;
    }
    isSleeping() {
        return this.isSleeping;
    }

    on(ev: string, fn: EVENTS.CallbackFn): EVENTS.CancelFn;
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

    create(app: App) {
        this.app = app;
        this.buffer = app.buffer.clone();
        this.trigger('create');
    }
    destroy() {
        this.trigger('destroy');
    }

    start(data?: Record<string, any>) {
        this.stopped = false;
        this.events.trigger('start', data || {});
    }
    stop(data?: Record<string, any>) {
        this.stopped = true;
        this.events.trigger('stop', data || {});
    }

    pause(data?: Record<string, any>) {
        this.paused = true;
        this.events.trigger('pause', data || {});
    }
    resume(data?: Record<string, any>) {
        this.paused = false;
        this.events.trigger('resume', data || {});
    }

    sleep(data?: Record<string, any>) {
        this.sleeping = true;
        this.events.trigger('sleep', data || {});
    }
    wake(data?: Record<string, any>) {
        this.sleeping = false;
        this.events.trigger('wake', data || {});
    }

    // FRAME STEPS

    frameStart() {
        this.events.trigger('frameStart');
    }

    input() {
        if (this.paused || this.sleeping || this.stopped) return;

        const io = this.app.io;
        while (io.length) {
            const ev = io.dequeue()!;
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

    update() {
        if (this.paused || this.sleeping || this.stopped) return;

        this.timers.update(this.app.dt);
        this.events.trigger('update');
    }

    draw() {
        if (this.sleeping || this.stopped) return;
        this.events.trigger('draw');
    }
    frameDebug(_buffer: CANVAS.Buffer) {
        this.events.trigger('frameDebug');
    }
    frameEnd() {
        this.events.trigger('frameEnd');
    }
}
