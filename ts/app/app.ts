import * as CANVAS from '../canvas';
import * as EVENTS from './events';
import * as IO from './io';
import * as DATA from '../data';

import { Loop } from './loop';
import * as TIMERS from './timers';
import { Scenes } from './scenes';
import * as SCENE from './scene';
import { AlertOptions } from '../scenes/alert';
import { ConfirmOptions } from '../scenes/confirm';
import { PromptOptions, PromptScene } from '../scenes/prompt';
import * as STYLE from './style';
import { Buffer } from '../buffer';
// import * as COLOR from '../color';

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
    scene?: SCENE.CreateOpts | boolean;
    scenes?: Record<string, SCENE.CreateOpts>;

    loop?: Loop;
    canvas?: CANVAS.Canvas;

    start?: boolean | string;
    data?: Record<string, any>;
}

export class App {
    canvas: CANVAS.Canvas;
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

    buffer: Buffer;
    data: DATA.Data;

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

        this.data = new DATA.Data(opts.data);

        this.canvas.onclick = this.io.enqueue.bind(this.io);
        this.canvas.onmousemove = this.io.enqueue.bind(this.io);
        this.canvas.onclick = this.io.enqueue.bind(this.io);
        this.canvas.onkeydown = this.io.enqueue.bind(this.io);

        this.buffer = new Buffer(this.canvas.width, this.canvas.height);

        if (opts.scenes) {
            this.scenes.load(opts.scenes);
            if (typeof opts.start === 'string') {
                this.scenes.start(opts.start);
            } else {
                this.scenes.start(Object.keys(opts.scenes)[0]);
            }
        } else if (opts.scene) {
            if (opts.scene === true) opts.scene = {};
            this.scenes.add('default', opts.scene);
            this.scenes.start('default');
            // } else {
            //     this.scenes.install('default', { bg: COLOR.colors.NONE }); // NONE just in case you draw directly on app.buffer
            //     this.scenes.start('default');
        }

        if (opts.start !== false) {
            this.start();
        }
    }

    // get buffer() {
    //     return this.scene.buffer;
    // }

    get width() {
        return this.canvas.width;
    }
    get height() {
        return this.canvas.height;
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
        if (ev.propagationStopped || ev.defaultPrevented) return;

        ev.dispatch(this.events);
    }

    _update(dt = 0) {
        dt = dt || this.dt;
        this.scenes.update(dt);
        this.timers.update(dt);
        this.events.trigger('update', dt);
    }

    _frameStart() {
        // this.buffer.nullify();
        this.scenes.frameStart();
        this.events.trigger('frameStart');
    }
    _draw() {
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
        this.canvas.render(this.buffer);
    }

    alert(text: string, opts: Omit<AlertOptions, 'text'> = {}): SCENE.Scene {
        (<AlertOptions>opts).text = text;
        return this.scenes.run('alert', opts);
    }

    confirm(
        text: string,
        opts: Omit<ConfirmOptions, 'text'> = {}
    ): SCENE.Scene {
        (<ConfirmOptions>opts).text = text;
        return this.scenes.run('confirm', opts);
    }

    prompt(
        text: string,
        opts: Omit<PromptOptions, 'prompt'> = {}
    ): SCENE.Scene {
        // NEED TO CREATE A NEW SCENE EVERY TIME SO WE DON"T HAVE HOLDOVER EVENTS, etc...
        (<PromptOptions>opts).prompt = text;
        const prompt = this.scenes._create('prompt', PromptScene);
        prompt.run(opts);
        return prompt;
    }
}

export function make(opts: Partial<AppOpts>): App {
    const app = new App(opts);
    return app;
}
