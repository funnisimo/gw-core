import * as UTILS from '../utils';
import * as COLOR from '../color';
import * as XY from '../xy';
import * as TWEEN from '../tween';

import * as EVENTS from './events';
import * as TIMERS from './timers';
import * as IO from '../app/io';
import { App } from './app';
// import * as CANVAS from '../canvas';
import { Tweens } from './tweens';
import * as BUFFER from '../buffer';
import * as STYLE from './style';
import { Widget, UpdatePosOpts } from './widget';

export type SceneCallback = (this: Scene, ...args: any[]) => void;
export type SceneMakeFn = (id: string, app: App) => Scene;

export interface CreateOpts {
    bg?: COLOR.ColorBase;

    data?: Record<string, string>;
    styles?: STYLE.Sheet;

    make?: SceneMakeFn;

    // add/remove from scene manager (app)
    create?: SceneCallback;
    delete?: SceneCallback;

    // start/stop?
    start?: SceneCallback;
    stop?: SceneCallback;

    pause?: SceneCallback;
    resume?: SceneCallback;

    // run in this order each frame
    frameStart?: SceneCallback;
    input?: SceneCallback;
    update?: SceneCallback;
    draw?: SceneCallback;
    frameDebug?: SceneCallback;
    frameEnd?: SceneCallback;

    // other event handlers
    on?: Record<string, SceneCallback>;
}

export interface StartOpts {
    [key: string]: any;
}

export interface ResumeOpts {
    timers?: boolean;
    tweens?: boolean;
    update?: boolean;
    draw?: boolean;
    input?: boolean;
}
export interface PauseOpts extends ResumeOpts {
    duration?: number;
}

export interface SceneObj {
    update(dt: number): void;
    draw(buffer: BUFFER.Buffer): void;
    destroy(): void;

    trigger(ev: string, ...args: any[]): void;
}

// Scene
export class Scene {
    id: string;
    app!: App;

    events = new EVENTS.Events(this);
    tweens = new Tweens();
    timers = new TIMERS.Timers(this);
    buffer!: BUFFER.Buffer;

    all: Widget[] = [];
    children: Widget[] = [];
    focused: Widget | null = null;

    dt = 0;
    time = 0;
    realTime = 0;
    skipTime = false;

    stopped = true;
    paused: ResumeOpts = {};
    debug = false;

    needsDraw = true;
    styles: STYLE.Sheet;

    bg: COLOR.Color = COLOR.BLACK;
    data: Record<string, any> = {};

    constructor(id: string, app: App) {
        this.id = id;
        this.styles = new STYLE.Sheet();
        this.app = app;
        this.buffer = new BUFFER.Buffer(app.width, app.height);
        this.styles.setParent(app.styles);
    }

    get width() {
        return this.buffer.width;
    }

    get height() {
        return this.buffer.height;
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

    // GENERAL
    create(opts: CreateOpts = {}) {
        opts.bg && (this.bg = COLOR.from(opts.bg));

        if (opts.on) {
            Object.entries(opts.on).forEach(([ev, fn]) => {
                this.on(ev, fn);
            });
        }
        Object.entries(opts).forEach(([ev, fn]) => {
            if (typeof fn !== 'function') return;
            this.on(ev, fn);
        });

        this.trigger('create', opts);
    }

    destroy(data?: any) {
        this.trigger('destroy', data);
        this.all.forEach((c) => c.destroy());
        this.children = [];
        this.all = [];
        this.timers.clear();
        this.tweens.clear();
    }

    start(opts: StartOpts = {}) {
        this.app.scenes.stop(); // stop all running scenes
        this._start(opts);
    }

    _start(opts: StartOpts = {}) {
        this.stopped = false;
        // this.timers.restart();
        // this.events.restart();
        // this.tweens.clear();
        this.buffer.nullify();
        this.needsDraw = true;
        this.events.trigger('start', opts); // this will start this one in the app.scenes obj
    }

    run(data: StartOpts = {}) {
        this.app.scenes.pause();
        this._start(data);
        this.once('stop', () => this.app.scenes.resume());
    }

    stop(data?: any) {
        this.stopped = true;
        this.events.trigger('stop', data);
    }

    pause(opts?: PauseOpts): void {
        opts = opts || {
            timers: true,
            tweens: true,
            update: true,
            input: true,
            draw: true,
        };
        Object.assign(this.paused, opts);
        this.events.trigger('pause');
    }

    resume(opts?: ResumeOpts) {
        opts = opts || {
            timers: true,
            tweens: true,
            update: true,
            input: true,
            draw: true,
        };
        Object.entries(opts).forEach(([key, value]) => {
            if (value === true) {
                this.paused[key as keyof ResumeOpts] = false;
            }
        });
        this.needsDraw = true;
        this.events.trigger('resume');
    }

    // FRAME STEPS

    frameStart() {
        this.events.trigger('frameStart');
    }

    input(e: IO.Event) {
        if (this.paused.input || this.stopped) return;

        this.trigger('input', e);
        if (e.defaultPrevented || e.propagationStopped) return;

        if (e.type === IO.KEYPRESS) {
            let w = this.focused;
            if (w && (w.hidden || w.disabled)) {
                this.nextTabStop();
                w = this.focused;
            }
            w && w.keypress(e);

            if (!e.defaultPrevented) {
                if (e.key === 'Tab') {
                    this.nextTabStop();
                } else if (e.key === 'TAB') {
                    this.prevTabStop();
                }
            }
        } else if (e.type === IO.MOUSEMOVE) {
            this.children.forEach((c) => c.mousemove(e));
        } else {
            // click
            const c = this.childAt(e);
            if (c) {
                c.click(e);
                if (c.prop('tabStop') && !e.defaultPrevented) {
                    this.setFocusWidget(c);
                }
            }
        }
        if (e.propagationStopped || e.defaultPrevented) return;
        e.dispatch(this.events);
    }

    update(dt: number) {
        if (this.stopped) return;

        if (!this.paused.timers) this.timers.update(dt);
        if (!this.paused.tweens) this.tweens.update(dt);
        if (!this.paused.update) {
            this.events.trigger('update', dt);
            this.all.forEach((c) => c.update(dt));
        }
    }

    draw(buffer: BUFFER.Buffer) {
        if (this.stopped) return;
        if (!this.paused.draw && this.needsDraw) {
            this._draw(this.buffer);
            this.trigger('draw', this.buffer);
            this.children.forEach((c) => c.draw(this.buffer));
            this.needsDraw = false;
        }
        // if (this.buffer.changed) {
        buffer.apply(this.buffer);
        this.buffer.changed = false;
        // }
    }

    _draw(buffer: BUFFER.Buffer) {
        buffer.fill(this.bg);
    }

    frameDebug(buffer: BUFFER.Buffer) {
        this.events.trigger('frameDebug', buffer);
    }
    frameEnd(buffer: BUFFER.Buffer) {
        this.events.trigger('frameEnd', buffer);
    }

    // ANIMATION

    fadeIn(widget: Widget, ms: number): this {
        return this.fadeTo(widget, 100, ms);
    }

    fadeOut(widget: Widget, ms: number): this {
        return this.fadeTo(widget, 0, ms);
    }

    fadeTo(widget: Widget, opacity: number, ms: number): this {
        const tween = TWEEN.make({ pct: widget.style('opacity') })
            .to({ pct: opacity })
            .duration(ms)
            .onUpdate((info) => {
                widget.style('opacity', info.pct);
            });
        this.tweens.add(tween);

        return this;
    }

    fadeToggle(widget: Widget, ms: number): this {
        return this.fadeTo(widget, widget._used.opacity ? 0 : 100, ms);
    }

    slideIn(
        widget: Widget,
        x: number,
        y: number,
        from: 'left' | 'top' | 'right' | 'bottom',
        ms: number
    ): this {
        let start = { x, y };
        if (from === 'left') {
            start.x = -widget.bounds.width;
        } else if (from === 'right') {
            start.x = this.width + widget.bounds.width;
        } else if (from === 'top') {
            start.y = -widget.bounds.height;
        } else if (from === 'bottom') {
            start.y = this.height + widget.bounds.height;
        }

        return this.slide(widget, start, { x, y }, ms);
    }

    slideOut(
        widget: Widget,
        dir: 'left' | 'top' | 'right' | 'bottom',
        ms: number
    ): this {
        let dest = { x: widget.bounds.x, y: widget.bounds.y };
        if (dir === 'left') {
            dest.x = -widget.bounds.width;
        } else if (dir === 'right') {
            dest.x = this.width + widget.bounds.width;
        } else if (dir === 'top') {
            dest.y = -widget.bounds.height;
        } else if (dir === 'bottom') {
            dest.y = this.height + widget.bounds.height;
        }

        return this.slide(widget, widget.bounds, dest, ms);
    }

    slide(
        widget: Widget,
        from: XY.XY | XY.Loc,
        to: XY.XY | XY.Loc,
        ms: number
    ): this {
        const tween = TWEEN.make({ x: XY.x(from), y: XY.y(from) })
            .to({ x: XY.x(to), y: XY.y(to) })
            .duration(ms)
            .onUpdate((info) => {
                widget.pos(info.x, info.y);
            });
        this.tweens.add(tween);

        return this;
    }

    // async fadeTo(
    //     color: COLOR.ColorBase = 'black',
    //     duration = 1000
    // ): Promise<void> {
    //     return new Promise<void>((resolve) => {
    //         color = COLOR.from(color);

    //         this.pause();
    //         const buffer = this.buffer.clone();

    //         let pct = 0;
    //         let elapsed = 0;

    //         this.app.repeat(32, () => {
    //             elapsed += 32;
    //             pct = Math.floor((100 * elapsed) / duration);

    //             this.buffer.copy(buffer);
    //             this.buffer.mix(color, pct);

    //             if (elapsed >= duration) {
    //                 this.resume();
    //                 resolve();
    //                 return false; // end timer
    //             }
    //         });
    //     });
    // }

    // CHILDREN

    get(id: string): Widget | null {
        return this.all.find((c) => c.id === id) || null;
    }

    _attach(widget: Widget) {
        if (this.all.includes(widget)) return;
        if (widget.scene) throw new Error('Widget on another scene!');

        this.all.push(widget);
        widget.scene = this;
        widget.children.forEach((c) => this._attach(c));

        if (
            widget.prop('tabStop') &&
            !this.focused &&
            !widget.hidden &&
            !widget.disabled
        ) {
            this.setFocusWidget(widget);
        }
    }

    _detach(widget: Widget) {
        const index = this.all.indexOf(widget);
        if (index < 0) return;

        this.all.splice(index, 1);
        widget.scene = null;
        widget.children.forEach((c) => this._detach(c));
    }

    addChild(child: Widget, opts?: UpdatePosOpts & { focused?: boolean }) {
        if (this.children.includes(child)) return;
        child.setParent(null);
        this.children.push(child);
        this._attach(child);
        if (opts) {
            child.updatePos(opts);
            if (opts.focused) {
                this.setFocusWidget(child);
            }
        }
    }

    removeChild(child: Widget) {
        const index = this.children.indexOf(child);
        if (index < 0) return;
        this.children.splice(index, 1);
        child.setParent(null);
        this._detach(child);
    }

    childAt(xy: XY.XY | number, y?: number): Widget | null {
        let x = 0;
        if (typeof xy === 'number') {
            x = xy;
            y = y || 0;
        } else {
            x = xy.x;
            y = xy.y;
        }

        return (
            UTILS.arrayFindRight(this.children, (c) => c.contains(x, y!)) ||
            null
        );
    }

    widgetAt(xy: XY.XY | number, y?: number): Widget | null {
        let x = 0;
        if (typeof xy === 'number') {
            x = xy;
            y = y || 0;
        } else {
            x = xy.x;
            y = xy.y;
        }

        return UTILS.arrayFindRight(this.all, (c) => c.contains(x, y!)) || null;
    }

    // FOCUS

    setFocusWidget(w: Widget | null, reverse = false) {
        if (w === this.focused) return;

        const was = this.focused;
        const want = w;

        this.focused = null;
        was && was.blur(reverse);

        if (this.focused === null) {
            this.focused = want;
            want && want.focus(reverse);
        }
    }

    nextTabStop(): boolean {
        if (!this.focused) {
            this.setFocusWidget(
                this.all.find(
                    (w) => !!w.prop('tabStop') && !w.disabled && !w.hidden
                ) || null
            );
            return !!this.focused;
        }

        const next = UTILS.arrayNext(
            this.all,
            this.focused,
            (w) => !!w.prop('tabStop') && !w.disabled && !w.hidden
        );
        if (next) {
            this.setFocusWidget(next);
            return true;
        }
        this.setFocusWidget(null);
        return false;
    }

    prevTabStop(): boolean {
        if (!this.focused) {
            this.setFocusWidget(
                this.all.find(
                    (w) => !!w.prop('tabStop') && !w.disabled && !w.hidden
                ) || null
            );
            return !!this.focused;
        }

        const prev = UTILS.arrayPrev(
            this.all,
            this.focused,
            (w) => !!w.prop('tabStop') && !w.disabled && !w.hidden
        );
        if (prev) {
            this.setFocusWidget(prev, true);
            return true;
        }
        this.setFocusWidget(null, true);
        return false;
    }

    // EVENTS
    on(cfg: EVENTS.CallbackObj): EVENTS.CancelFn;
    on(ev: string | string[], cb: EVENTS.CallbackFn): EVENTS.CancelFn;
    on(...args: any[]): EVENTS.CancelFn {
        if (args.length === 1) {
            return this.events.on(args[0]);
        }
        return this.events.on(args[0], args[1]);
    }
    once(ev: string, cb: EVENTS.CallbackFn): EVENTS.CancelFn {
        return this.events.once(ev, cb);
    }
    trigger(ev: string | string[], ...args: any[]) {
        return this.events.trigger(ev, ...args);
    }

    // TIMERS

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
}

// export class Scene {
//     id: string;
//     app!: App;
//     events: EVENTS.Events;
//     timers: TIMERS.Timers;
//     buffer!: CANVAS.Buffer;
//     tweens: Tweens;

//     dt = 0;
//     time = 0;
//     realTime = 0;
//     skipTime = false;

//     stopped = true;
//     paused: PauseOpts = {};
//     debug = false;

//     children: SceneObj[] = [];
//     data: Record<string, any> = {};

//     constructor(id: string, opts: SceneOpts = {}) {
//         this.id = id;
//         this.events = new EVENTS.Events(this);
//         this.timers = new TIMERS.Timers(this);
//         this.tweens = new Tweens();

//         if (opts.on) {
//             Object.entries(opts.on).forEach(([ev, fn]) => {
//                 this.on(ev, fn);
//             });
//         }
//         Object.entries(opts).forEach(([ev, fn]) => {
//             if (typeof fn !== 'function') return;
//             this.on(ev, fn);
//         });
//     }

//     get width() {
//         return this.buffer.width;
//     }
//     get height() {
//         return this.buffer.height;
//     }

//     isActive() {
//         return !this.stopped;
//     }
//     isPaused() {
//         return this.isPaused;
//     }
//     isSleeping() {
//         return this.isSleeping;
//     }

//     on(ev: string, fn: EVENTS.CallbackFn): EVENTS.CancelFn;
//     on(ev: string, fn: EVENTS.CallbackFn): EVENTS.CancelFn {
//         return this.events.on(ev, fn);
//     }

//     trigger(ev: string, ...args: any[]) {
//         return this.events.trigger(ev, ...args);
//     }

//     wait(delay: number, fn: TIMERS.TimerFn): EVENTS.CancelFn;
//     wait(delay: number, fn: string, ctx?: Record<string, any>): EVENTS.CancelFn;
//     wait(
//         delay: number,
//         fn: TIMERS.TimerFn | string,
//         ctx?: Record<string, any>
//     ): EVENTS.CancelFn {
//         if (typeof fn === 'string') {
//             const ev = fn;
//             ctx = ctx || {};
//             fn = () => this.trigger(ev, ctx!);
//         }
//         return this.timers.setTimeout(fn, delay);
//     }

//     repeat(delay: number, fn: TIMERS.TimerFn): EVENTS.CancelFn;
//     repeat(
//         delay: number,
//         fn: string,
//         ctx?: Record<string, any>
//     ): EVENTS.CancelFn;
//     repeat(
//         delay: number,
//         fn: TIMERS.TimerFn | string,
//         ctx?: Record<string, any>
//     ): EVENTS.CancelFn {
//         if (typeof fn === 'string') {
//             const ev = fn;
//             ctx = ctx || {};
//             fn = () => this.trigger(ev, ctx!);
//         }
//         return this.timers.setInterval(fn, delay);
//     }

//     // run() {
//     //     this.trigger('run', this);
//     //     let running = false;
//     //     this.loopID = (setInterval(() => {
//     //         if (!running) {
//     //             running = true;
//     //             this._frame();
//     //             running = false;
//     //         }
//     //     }, 16) as unknown) as number;
//     //     this.stopped = false;
//     // }

//     create(app: App) {
//         this.app = app;
//         this.buffer = app.buffer.clone();
//         this.trigger('create');
//     }
//     destroy() {
//         this.trigger('destroy');
//     }

//     start(data?: Record<string, any>) {
//         this.stopped = false;
//         this.timers.clear();
//         this.tweens.clear();
//         this.events.trigger('start', data || {});
//     }

//     run(data?: Record<string, any>): Promise<any> {
//         return new Promise((resolve) => {
//             this.app.scenes.pause();
//             const cleanup = this.once('stop', (d) => {
//                 cleanup();
//                 this.app.scenes.resume();
//                 resolve(d);
//             });
//             this.start(data);
//         });
//     }

//     stop(data?: Record<string, any>) {
//         this.stopped = true;
//         this.events.trigger('stop', data || {});
//     }

//     pause(opts?: PauseOpts): void {
//         opts = opts || {
//             timers: true,
//             tweens: true,
//             update: true,
//             input: true,
//             draw: true,
//         };
//         Object.assign(this.paused, opts);
//         this.events.trigger('pause');
//     }

//     resume(opts?: ResumeOpts) {
//         opts = opts || {
//             timers: true,
//             tweens: true,
//             update: true,
//             input: true,
//             draw: true,
//         };
//         Object.entries(opts).forEach(([key, value]) => {
//             if (value === true) {
//                 this.paused[key as keyof ResumeOpts] = false;
//             }
//         });
//         this.events.trigger('resume');
//     }

//     // CHILDREN

//     add(obj: SceneObj) {
//         this.children.push(obj);
//         obj.trigger('add', this);
//     }

//     remove(obj: SceneObj) {
//         UTILS.arrayDelete(this.children, obj);
//         obj.trigger('remove', this);
//     }

//     // FRAME STEPS

//     frameStart() {
//         this.events.trigger('frameStart');
//     }

//     input(ev: IO.Event) {
//         if (this.stopped || this.paused.input) return;
//         this.events.dispatch(ev);
//     }

//     update(dt: number) {
//         if (this.stopped) return;

//         if (!this.paused.timers) this.timers.update(dt);
//         if (!this.paused.tweens) this.tweens.update(dt);
//         if (!this.paused.update) {
//             this.children.forEach((c) => c.update(dt));
//             this.events.trigger('update', dt);
//         }
//     }

//     draw(buffer: CANVAS.Buffer) {
//         if (this.stopped) return;
//         if (!this.paused.draw) {
//             this.events.trigger('draw', this.buffer);
//             this.children.forEach((c) => c.draw(this.buffer));
//         }
//         if (this.buffer.changed) {
//             buffer.apply(this.buffer);
//             this.buffer.changed = false;
//         }
//     }
//     frameDebug(buffer: CANVAS.Buffer) {
//         this.events.trigger('frameDebug', buffer);
//     }
//     frameEnd(buffer: CANVAS.Buffer) {
//         this.events.trigger('frameEnd', buffer);
//         // if (this.buffer.changed) {
//         //     buffer.apply(this.buffer);
//         //     this.buffer.changed = false;
//         // }
//     }

//     // UI

//     alert(text: string): Promise<boolean> {
//         return this.app.scenes.run('alert', { text });
//     }

//     async fadeTo(
//         color: COLOR.ColorBase = 'black',
//         duration = 1000
//     ): Promise<void> {
//         return new Promise<void>((resolve) => {
//             color = COLOR.from(color);

//             this.pause();
//             const buffer = this.buffer.clone();

//             let pct = 0;
//             let elapsed = 0;

//             this.app.repeat(32, () => {
//                 elapsed += 32;
//                 pct = Math.floor((100 * elapsed) / duration);

//                 this.buffer.copy(buffer);
//                 this.buffer.mix(color, pct);

//                 if (elapsed >= duration) {
//                     this.resume();
//                     resolve();
//                     return false; // end timer
//                 }
//             });
//         });
//     }
// }
