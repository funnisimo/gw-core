import * as CANVAS from '../canvas';
import * as EVENTS from './events';
import * as IO from './io';

import { Loop } from './loop';
import * as TIMERS from './timers';
import { Scenes } from './scenes';
import * as SCENE from './scene';
import { AlertOptions } from '../ui/alert';
import { ConfirmOptions } from '../ui/confirm';
import { PromptOptions } from '../ui/prompt';
import * as STYLE from '../ui/style';

export interface AppOpts /* extends CANVAS.CanvasOptions */ {
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

    // on?: SCENE.SceneOpts;
    scene?: SCENE.SceneOpts;
    scenes?: Record<string, SCENE.SceneOpts>;

    loop?: Loop;
    canvas?: CANVAS.CanvasType;

    start?: boolean;
}

export class App {
    canvas: CANVAS.CanvasType;
    events: EVENTS.Events;
    timers: TIMERS.Timers;
    scenes: Scenes;
    io: IO.Queue;
    loop: Loop;
    styles: STYLE.Sheet;

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

    constructor(opts: Partial<AppOpts> = {}) {
        if ('loop' in opts) {
            this.loop = opts.loop!;
            delete opts.loop;
        } else {
            this.loop = new Loop();
        }

        this.styles = STYLE.defaultStyle;
        this.canvas = opts.canvas || CANVAS.make(opts);
        this.io = new IO.Queue();
        this.events = new EVENTS.Events(this);
        this.timers = new TIMERS.Timers(this);
        this.scenes = new Scenes(this);

        this.canvas.onclick = this.io.enqueue.bind(this.io);
        this.canvas.onmousemove = this.io.enqueue.bind(this.io);
        this.canvas.onclick = this.io.enqueue.bind(this.io);
        this.canvas.onkeydown = this.io.enqueue.bind(this.io);

        if (opts.scenes) {
            this.scenes.load(opts.scenes);
        } else if (opts.scene) {
            this.scenes.install('default', opts.scene);
            this.scenes.start('default');
        } else {
            this.scenes.install('default', {});
            this.scenes.start('default');
        }

        if (opts.start !== false) {
            this.start();
        }
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

    get scene() {
        return this.scenes.get();
    }

    on(ev: string, fn: EVENTS.CallbackFn): EVENTS.CancelFn {
        // return this.scene.on(ev, fn);
        return this.events.on(ev, fn);
    }

    trigger(ev: string, ...args: any[]) {
        this.scenes.trigger(ev, ...args);
        this.events.trigger(ev, ...args);
    }

    wait(delay: number, fn: TIMERS.TimerFn): EVENTS.CancelFn;
    wait(delay: number, fn: string, ctx?: Record<string, any>): EVENTS.CancelFn;
    wait(...args: any[]): EVENTS.CancelFn {
        // @ts-ignore
        // return this.scene.wait.apply(this.scene, args);
        if (typeof args[1] === 'string') {
            const ev = args[1];
            args[2] = args[2] || {};
            args[1] = () => this.trigger(ev, args[2]!);
        }
        return this.timers.setTimeout(args[1], args[0]);
    }

    repeat(delay: number, fn: TIMERS.TimerFn): EVENTS.CancelFn;
    repeat(
        delay: number,
        fn: string,
        ctx?: Record<string, any>
    ): EVENTS.CancelFn;
    repeat(...args: any[]): EVENTS.CancelFn {
        // @ts-ignore
        // return this.scene.repeat.apply(this.scene, args);
        if (typeof fn === 'string') {
            const ev = args[1];
            args[2] = args[2] || {};
            args[1] = () => this.trigger(ev, args[2]!);
        }
        return this.timers.setInterval(args[1], args[0]);
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

    start() {
        if (this.loop.isRunning) return;
        this.loop.start(this._frame.bind(this));
    }

    stop() {
        this.trigger('stop', this);
        this.loop.stop();
        this.stopped = true;
    }

    _frame(t: number = 0) {
        t = t || Date.now();
        if (
            typeof document !== 'undefined' &&
            document.visibilityState !== 'visible'
        ) {
            return;
        }

        if (this.realTime == 0) {
            this.realTime = t;
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

        // // unprocessed io is handled here
        while (this.io.length) {
            const ev = this.io.dequeue()!;
            this._input(ev);
        }

        if (!this.paused && this.debug !== true) {
            this._update(this.dt);
        }

        this._draw();

        if (this.debug !== false) {
            this._frameDebug();
        }

        this._frameEnd();

        this.io.clear();
    }

    _input(ev: IO.Event) {
        this.scenes.input(ev);
        if (ev.propagationStopped) return;
        this.events.dispatch(ev);
    }

    _update(dt = 0) {
        dt = dt || this.dt;
        this.scenes.update(dt);
        this.timers.update(dt);
        this.events.trigger('update', dt);
    }

    _frameStart() {
        this.scenes.frameStart();
        this.events.trigger('frameStart');
    }
    _draw() {
        this.buffer.fill(0);
        this.scenes.draw(this.buffer);
        this.events.trigger('draw', this.buffer);
    }
    _frameDebug() {
        this.scenes.frameDebug(this.buffer);
        this.events.trigger('frameDebug', this.buffer);
    }
    _frameEnd() {
        this.scenes.frameEnd(this.buffer);
        this.events.trigger('frameEnd', this.buffer);

        if (this.buffer.changed) {
            this.buffer.render();
        }
    }

    alert(
        text: string,
        opts: Omit<AlertOptions, 'text'> = {}
    ): Promise<boolean> {
        (<AlertOptions>opts).text = text;
        return this.scenes.run('alert', opts);
    }

    confirm(
        text: string,
        opts: Omit<ConfirmOptions, 'text'> = {}
    ): Promise<boolean> {
        (<ConfirmOptions>opts).text = text;
        return this.scenes.run('confirm', opts);
    }

    prompt(
        text: string,
        opts: Omit<PromptOptions, 'prompt'> = {}
    ): Promise<boolean> {
        (<PromptOptions>opts).prompt = text;
        return this.scenes.run('prompt', opts);
    }
}

export function make(opts: Partial<AppOpts>): App {
    const app = new App(opts);
    return app;
}
