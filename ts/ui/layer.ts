import * as Utils from '../utils';
import * as Color from '../color';
import * as XY from '../xy';
import * as Canvas from '../canvas';
import * as Buffer from '../buffer';
import * as IO from '../io';
import * as Tween from '../tween';

import * as Style from './style';
import * as Widget from '../widget/widget';
import { Body } from '../widget/body';
import { UILayer, StyleOptions } from './types';
import { Grid } from './grid';

export type TimerFn = () => void;

export interface TimerInfo {
    action: string | TimerFn;
    time: number;
}

export interface UICore {
    // buffer: Canvas.Buffer;
    readonly loop: IO.Loop;
    readonly canvas: Canvas.BaseCanvas;
    readonly width: number;
    readonly height: number;
    readonly styles: Style.Sheet;

    // render(): void;
    // readonly layer: UILayer;

    startNewLayer(): Layer;
    copyUIBuffer(dest: Buffer.Buffer): void;
    finishLayer(layer: Layer): void;

    stop(): void;

    // fadeTo(color?: Color.ColorBase, duration?: number): void;
    // getInputAt(
    //     x: number,
    //     y: number,
    //     maxLength: number,
    //     opts?: Widget.InputOptions
    // ): Promise<string>;
    // alert(opts: number | AlertOptions, text: string, args: any): void;
}

export type StartCb = () => void;
export type DrawCb = (buffer: Buffer.Buffer) => void;
export type EventCb = (e: IO.Event) => boolean | Promise<boolean>;
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
    ui: UICore;
    buffer: Canvas.Buffer;
    body: Widget.Widget;
    styles: Style.Sheet;
    needsDraw = true;
    result: any = undefined;

    _attachOrder: Widget.Widget[] = [];
    _depthOrder: Widget.Widget[] = [];
    _focusWidget: Widget.Widget | null = null;
    _hasTabStop = false;
    timers: TimerInfo[] = [];
    _tweens: Tween.Tween[] = [];

    promise: Promise<any>;
    _done: Function | null = null;

    _opts: Widget.WidgetOptions = { x: 0, y: 0 };

    _drawCb: DrawCb | null;
    _tickCb: EventCb | null;
    _dirCb: EventCb | null;
    _mousemoveCb: EventCb | null;
    _clickCb: EventCb | null;
    _keypressCb: EventCb | null;
    _finishCb: FinishCb | null;

    constructor(ui: UICore, opts: LayerOptions = {}) {
        this.ui = ui;

        this.buffer = ui.canvas.buffer.clone();
        this.styles = new Style.Sheet(opts.styles || ui.styles);
        this.body = new Body(this);
        this.promise = new Promise((resolve) => {
            this._done = resolve;
        });

        this._drawCb = opts.draw || null;
        this._tickCb = opts.tick || null;
        this._dirCb = opts.dir || null;
        this._mousemoveCb = opts.mousemove || null;
        this._clickCb = opts.click || null;
        this._keypressCb = opts.keypress || null;
        this._finishCb = opts.finish || null;

        if (opts.start) opts.start.call(this);
    }

    get width(): number {
        return this.ui.width;
    }
    get height(): number {
        return this.ui.height;
    }

    // Style and Opts

    reset(): this {
        this._opts = { x: 0, y: 0 };
        return this;
    }

    fg(v: Color.ColorBase): this {
        this._opts.fg = v;
        return this;
    }

    bg(v: Color.ColorBase): this {
        this._opts.bg = v;
        return this;
    }

    dim(pct = 25, fg = true, bg = false): this {
        if (fg) {
            this._opts.fg = Color.from(this._opts.fg || 'white').darken(pct);
        }
        if (bg) {
            this._opts.bg = Color.from(this._opts.bg || 'black').darken(pct);
        }
        return this;
    }

    bright(pct = 25, fg = true, bg = false): this {
        if (fg) {
            this._opts.fg = Color.from(this._opts.fg || 'white').lighten(pct);
        }
        if (bg) {
            this._opts.bg = Color.from(this._opts.bg || 'black').lighten(pct);
        }
        return this;
    }

    invert(): this {
        [this._opts.fg, this._opts.bg] = [this._opts.bg, this._opts.fg];
        return this;
    }

    // STYLE

    style(opts: StyleOptions): this {
        Object.assign(this._opts, opts);
        return this;
    }

    class(c: string): this {
        this._opts.class = this._opts.class || '';
        this._opts.class += ' ' + c;
        return this;
    }

    // POSITION

    pos(): XY.XY;
    pos(x: number, y: number): this;
    pos(x?: number, y?: number): this | XY.XY {
        if (x === undefined) return this._opts as XY.XY;

        this._opts.x = Utils.clamp(x, 0, this.width);
        this._opts.y = Utils.clamp(y!, 0, this.height);
        return this;
    }

    moveTo(x: number, y: number): this {
        return this.pos(x, y);
    }

    move(dx: number, dy: number): this {
        this._opts.x = Utils.clamp(this._opts.x! + dx, 0, this.width);
        this._opts.y = Utils.clamp(this._opts.y! + dy, 0, this.height);
        return this;
    }

    up(n = 1): this {
        return this.move(0, -n);
    }

    down(n = 1): this {
        return this.move(0, n);
    }

    left(n = 1): this {
        return this.move(-n, 0);
    }

    right(n = 1): this {
        return this.move(n, 0);
    }

    nextLine(n = 1): this {
        return this.pos(0, this._opts.y! + n);
    }

    prevLine(n = 1): this {
        return this.pos(0, this._opts.y! - n);
    }

    grid(): Grid {
        return new Grid(this);
    }

    // EDIT

    // erase and move back to top left
    clear(color?: Color.ColorBase): this {
        this.body.children = [];
        this._depthOrder = [this.body];
        if (color) {
            this.body.style().set('bg', color);
        } else {
            this.body.style().unset('bg');
        }
        return this;
    }

    // Widgets

    // create(tag: string, opts: any): UIWidget {
    //     const options = Object.assign({ tag }, this._opts, opts);
    //     const widget = createWidget(tag, this, options);
    //     this.addWidget(widget);
    //     return widget;
    // }

    sortWidgets(): this {
        this._depthOrder.sort((a, b) => b.depth - a.depth);
        return this;
    }

    attach(w: Widget.Widget): this {
        if (!this._attachOrder.includes(w)) {
            const index = this._depthOrder.findIndex(
                (aw) => aw.depth <= w.depth
            );
            if (index < 0) {
                this._depthOrder.push(w);
            } else {
                this._depthOrder.splice(index, 0, w);
            }
            this._attachOrder.push(w);
            this.needsDraw = true;
        }

        if (!w.parent && w !== this.body && this.body) {
            w.setParent(this.body);
            this.needsDraw = true;
        }

        this._hasTabStop = this._hasTabStop || w._propBool('tabStop');

        return this;
    }

    detach(w: Widget.Widget): this {
        // Utils.arrayDelete(this.widgets, w);
        w.setParent(null);
        Utils.arrayDelete(this._depthOrder, w);
        Utils.arrayDelete(this._attachOrder, w);

        if (this._focusWidget === w) {
            this.nextTabStop();
        }
        this.needsDraw = true;
        return this;
    }

    widgetAt(x: number, y: number): Widget.Widget;
    widgetAt(xy: XY.XY): Widget.Widget;
    widgetAt(...args: any[]): Widget.Widget {
        return (
            this._depthOrder.find(
                (w) => w.contains(args[0], args[1]) && !w.hidden
            ) || this.body
        );
    }

    get focusWidget(): Widget.Widget | null {
        return this._focusWidget;
    }

    setFocusWidget(w: Widget.Widget | null, reverse = false) {
        if (w === this._focusWidget) return;
        if (this._focusWidget && this._focusWidget.blur(reverse)) return;
        if (w && w.focus(reverse)) return;
        this._focusWidget = w;
    }

    getWidget(id: string): Widget.Widget | null {
        return this._depthOrder.find((w) => w.attr('id') === id) || null;
    }

    nextTabStop(): boolean {
        if (!this.focusWidget) {
            this.setFocusWidget(
                this._attachOrder.find(
                    (w) =>
                        !!w.prop('tabStop') && !w.prop('disabled') && !w.hidden
                ) || null
            );
            return !!this.focusWidget;
        }

        const next = Utils.arrayNext(
            this._attachOrder,
            this.focusWidget,
            (w) => !!w.prop('tabStop') && !w.prop('disabled') && !w.hidden
        );
        if (next) {
            this.setFocusWidget(next);
            return true;
        }
        return false;
    }

    prevTabStop(): boolean {
        if (!this.focusWidget) {
            this.setFocusWidget(
                this._attachOrder.find(
                    (w) =>
                        !!w.prop('tabStop') && !w.prop('disabled') && !w.hidden
                ) || null
            );
            return !!this.focusWidget;
        }

        const prev = Utils.arrayPrev(
            this._attachOrder,
            this.focusWidget,
            (w) => !!w.prop('tabStop') && !w.prop('disabled') && !w.hidden
        );
        if (prev) {
            this.setFocusWidget(prev, true);
            return true;
        }
        return false;
    }

    // EVENTS

    on(event: string, cb: Widget.EventCb): this {
        this.body.on(event, cb);
        return this;
    }

    off(event: string, cb?: Widget.EventCb): this {
        this.body.off(event, cb);
        return this;
    }

    mousemove(e: IO.Event): boolean {
        if (this._mousemoveCb && this._mousemoveCb.call(this, e)) return false;

        const over = this.widgetAt(e);
        over.mouseenter(e, over);
        const all = this._depthOrder.map((w) => w.mousemove(e));
        Promise.all(all);

        return false; // TODO - this._done
    }

    click(e: IO.Event): boolean {
        if (this._clickCb && this._clickCb.call(this, e)) return false;

        let w: Widget.Widget | null = this.widgetAt(e);
        let setFocus = false;

        while (w) {
            if (!setFocus && w.prop('tabStop') && !w.prop('disabled')) {
                this.setFocusWidget(w);
                setFocus = true;
            }

            if (w.click(e)) return false;
            w = w.parent;
        }

        return false; // TODO - this._done
    }

    keypress(e: IO.Event): boolean {
        if (!e.key) return false;

        if (this._keypressCb && this._keypressCb.call(this, e)) return false;

        let w: Widget.Widget | null = this.focusWidget || this.body;

        while (w) {
            if (w.keypress(e)) return false;
            w = w.parent;
        }

        if (e.defaultPrevented) return false;

        if (e.key === 'Tab') {
            // Next widget
            this.nextTabStop();
        } else if (e.key === 'TAB') {
            // Prev Widget
            this.prevTabStop();
        }

        //         return this.done;
        return false;
    }

    dir(e: IO.Event): boolean {
        if (this._dirCb && this._dirCb.call(this, e)) return false;

        let target: Widget.Widget | null = this.focusWidget || this.body;

        while (target) {
            if (target.dir(e)) return false;
            target = target.parent;
        }
        // return this.done;
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
                if (typeof timer.action === 'string') {
                    this.body._fireEvent(timer.action, this.body);
                } else {
                    timer.action();
                }
            }
        }

        for (let w of this._depthOrder) {
            w.tick(e);
        }

        if (this._tickCb) this._tickCb.call(this, e);

        return false;
    }

    draw() {
        if (this._hasTabStop && !this._focusWidget) {
            this.nextTabStop();
        }
        if (this.styles.dirty) {
            this.needsDraw = true;
            this._depthOrder.forEach((w) => w.updateStyle());
            this.styles.dirty = false;
        }
        if (!this.needsDraw) return;

        this.needsDraw = false;

        this.ui.copyUIBuffer(this.buffer);

        // draw from low depth to high depth
        for (let i = this._depthOrder.length - 1; i >= 0; --i) {
            const w = this._depthOrder[i];
            w.draw(this.buffer);
        }

        if (this._drawCb) this._drawCb.call(this, this.buffer);

        console.log('draw');
        this.buffer.render();
    }

    // LOOP

    setTimeout(action: string | TimerFn, time: number) {
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

    finish(result?: any) {
        this.result = result;
        this.ui.finishLayer(this);
    }

    _finish() {
        if (!this._done) return;
        this.body._fireEvent('finish', this.body, this.result);
        if (this._finishCb) this._finishCb.call(this, this.result);

        this._done(this.result);
        this._done = null;
    }
}
