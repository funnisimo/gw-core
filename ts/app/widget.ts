import * as UTILS from '../utils';
import * as XY from '../xy';
import * as BUFFER from '../buffer';
import * as TEXT from '../text';
// import * as Tween from '../tween';
import * as IO from '../app/io';
import * as EVENTS from '../app/events';
import * as STYLE from './style';

import { Scene } from '../app/scene';

export type DataValue = any;
export type DataObject = Record<string, DataValue>;
export type DataItem = DataValue | DataValue[] | DataObject;
export type DataType = DataItem[] | DataObject;

// return true if you want to stop the event from propagating
export type EventCb = (
    name: string,
    widget: Widget | null,
    args?: any
) => boolean | any;

export interface UpdatePosOpts {
    x?: number;
    y?: number;

    left?: number;
    right?: number;
    top?: number;
    bottom?: number;

    center?: boolean;
    centerX?: boolean;
    centerY?: boolean;
}

export interface SetParentOptions extends UpdatePosOpts {
    first?: boolean;
    last?: boolean;
    before?: string | Widget;
    after?: string | Widget;

    focused?: boolean;
}

export interface WidgetOpts extends STYLE.StyleOptions, SetParentOptions {
    tag?: string;
    id?: string;
    data?: DataType;

    parent?: Widget | null;
    scene?: Scene | null;

    width?: number;
    height?: number;
    class?: string;
    tabStop?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    action?: string | boolean;

    create?: EVENTS.CallbackFn;
    input?: EVENTS.CallbackFn;
    update?: EVENTS.CallbackFn;
    draw?: EVENTS.CallbackFn;
    destroy?: EVENTS.CallbackFn;

    on?: Record<string, EVENTS.CallbackFn>;
}

export type PropType = string | number | boolean;

// Widget
export class Widget {
    // tag = 'widget';
    // id = '';
    parent: Widget | null = null;
    scene: Scene | null = null;
    children: Widget[] = [];
    bounds: XY.Bounds;
    events = new EVENTS.Events(this);

    _style = new STYLE.Style();
    _used!: STYLE.ComputedStyle;

    _data: DataType = {};

    classes: string[] = [];
    _props: Record<string, PropType> = {
        needsDraw: true,
        needsStyle: true,
        hover: false,
    };
    _attrs: Record<string, PropType> = {};

    constructor(opts: WidgetOpts = {}) {
        if (opts.id) this.attr('id', opts.id);
        this.attr('tag', opts.tag || 'widget');
        this.bounds = new XY.Bounds(opts);

        this._style.set(opts);
        // opts.tag && (this.tag = opts.tag);

        if (opts.class) {
            this.classes = opts.class.split(/ +/g).map((c) => c.trim());
        }
        if (opts.tabStop) {
            this.prop('tabStop', true);
        }
        if (opts.disabled) {
            this.prop('disabled', true);
        }
        if (opts.hidden) {
            this.hidden = true;
        }
        if (opts.data) {
            this._data = opts.data; // call set data yourself
        }

        opts.action = opts.action || opts.id;
        if (opts.action) {
            if (opts.action === true) {
                if (!opts.id) throw new Error('boolean action requires id.');
                opts.action = opts.id;
            }
            this.attr('action', opts.action);
        }

        ['create', 'input', 'update', 'draw', 'destroy'].forEach((n) => {
            if (n in opts) {
                this.events.on(
                    n,
                    opts[n as keyof WidgetOpts] as EVENTS.CallbackFn
                );
            }
        });
        if (opts.on) {
            Object.entries(opts.on).forEach(([ev, fn]) => this.on(ev, fn));
        }

        if (opts.parent) {
            this.setParent(opts.parent, opts);
        } else if (opts.scene) {
            opts.scene.addChild(this, opts);
        }
    }

    get needsDraw() {
        return this.scene ? this.scene.needsDraw : false;
    }
    set needsDraw(v: boolean) {
        if (!v) return;
        this.scene && (this.scene.needsDraw = v);
    }

    get tag() {
        return this._attrStr('tag');
    }
    get id() {
        return this._attrStr('id');
    }

    // DATA
    data(): DataType;
    data(all: DataType): this;
    data(key: string): any;
    data(key: string, value: any): this;
    data(...args: any[]): this | DataType | DataValue {
        if (args.length == 0) {
            return this._data;
        }
        if (args.length == 2) {
            this._setDataItem(args[0], args[1]);
            this.needsDraw = true;
            return this;
        }
        if (typeof args[0] === 'string') {
            if (Array.isArray(this._data)) {
                throw new Error('Cannot access fields of array data.');
            }
            return this._data[args[0]];
        }
        this._setData(args[0]);
        this.needsDraw = true;
        return this;
    }

    _setData(v: Record<string, any> | any[]) {
        this._data = v;
    }
    _setDataItem(key: string, v: any) {
        if (Array.isArray(this._data)) {
            throw new Error('Cannot set field in array data.');
        }
        this._data[key] = v;
    }

    // BOUNDS

    pos(): XY.XY;
    pos(xy: XY.XY): this;
    pos(x: number, y: number): this;
    pos(x?: number | XY.XY, y?: number): this | XY.XY {
        if (x === undefined) return this.bounds;

        if (typeof x === 'number') {
            this.bounds.x = x;
            this.bounds.y = y || 0;
        } else {
            this.bounds.x = x.x;
            this.bounds.y = x.y;
        }
        this.needsDraw = true;

        return this;
    }

    updatePos(opts: UpdatePosOpts) {
        if (!this.parent && !this.scene) return;

        if (opts.centerX || opts.center) {
            this.centerX();
        } else if (opts.left) {
            this.left(opts.left);
        } else if (opts.right) {
            this.right(opts.right);
        } else if (opts.x) {
            this.bounds.x = opts.x;
        }

        if (opts.centerY || opts.center) {
            this.centerY();
        } else if (opts.top) {
            this.top(opts.top);
        } else if (opts.bottom) {
            this.bottom(opts.bottom);
        } else if (opts.y) {
            this.bounds.y = opts.y;
        }
    }

    contains(e: XY.XY): boolean;
    contains(x: number, y: number): boolean;
    contains(...args: any[]): boolean {
        if (this.hidden) return false;
        if (this.bounds.contains(args[0], args[1])) return true;
        return this.children.some((c) => c.contains(args[0], args[1]));
    }

    center(bounds?: XY.Bounds): this {
        return this.centerX(bounds).centerY(bounds);
    }

    centerX(bounds?: XY.Bounds): this {
        const dims = bounds || (this.parent ? this.parent.bounds : this.scene);
        if (!dims) throw new Error('Need parent or scene to apply center.');
        if ('x' in dims) {
            const w = this.bounds.width;
            const mid = Math.round((dims.width - w) / 2);
            this.bounds.x = dims.x + mid;
        } else {
            this.bounds.x = Math.round((dims.width - this.bounds.width) / 2);
        }
        return this;
    }

    centerY(bounds?: XY.Bounds): this {
        const dims = bounds || (this.parent ? this.parent.bounds : this.scene);
        if (!dims) throw new Error('Need parent or scene to apply center.');
        if ('y' in dims) {
            const h = this.bounds.height;
            const mid = Math.round((dims.height - h) / 2);
            this.bounds.y = dims.y + mid;
        } else {
            this.bounds.y = Math.round((dims.height - this.bounds.height) / 2);
        }
        return this;
    }

    left(n: number): this {
        const x = this.parent ? this.parent.bounds.left : 0;
        this.bounds.left = x + n;
        return this;
    }

    right(n: number): this {
        if (this.parent) {
            this.bounds.right = this.parent.bounds.right + n;
        } else if (this.scene) {
            this.bounds.right = this.scene.width + n - 1;
        } else {
            this.bounds.left = 0;
        }
        return this;
    }

    top(n: number): this {
        const y = this.parent ? this.parent.bounds.top : 0;
        this.bounds.top = y + n;
        return this;
    }

    bottom(n: number): this {
        if (this.parent) {
            this.bounds.bottom = this.parent.bounds.bottom + n - 1;
        } else if (this.scene) {
            this.bounds.bottom = this.scene.height + n - 1;
        } else {
            this.bounds.top = 0;
        }
        return this;
    }

    resize(w: number, h: number): this {
        this.bounds.width = w || this.bounds.width;
        this.bounds.height = h || this.bounds.height;
        this.needsDraw = true;
        return this;
    }

    // STYLE

    style(): STYLE.Style;
    style(opts: STYLE.StyleOptions): this;
    style(name: keyof STYLE.StyleOptions): any;
    style(name: keyof STYLE.StyleOptions, value: any): this;
    style(...args: any[]): this | STYLE.Style | any {
        if (args.length == 0) return this._style;

        if (typeof args[0] !== 'string') {
            this._style.set(args[0]);
        } else {
            if (args[1] === undefined) {
                const source = this._used || this._style;
                return source.get(args[0] as keyof STYLE.Style);
            }

            this._style.set(args[0] as keyof STYLE.StyleOptions, args[1]);
        }

        this.needsStyle = true;
        return this;
    }

    addClass(c: string): this {
        const all = c.split(/ +/g);
        all.forEach((a) => {
            if (this.classes.includes(a)) return;
            this.classes.push(a);
        });
        return this;
    }

    removeClass(c: string): this {
        const all = c.split(/ +/g);
        all.forEach((a) => {
            UTILS.arrayDelete(this.classes, a);
        });
        return this;
    }

    hasClass(c: string): boolean {
        const all = c.split(/ +/g);
        return UTILS.arrayIncludesAll(this.classes, all);
    }

    toggleClass(c: string): this {
        const all = c.split(/ +/g);
        all.forEach((a) => {
            if (this.classes.includes(a)) {
                UTILS.arrayDelete(this.classes, a);
            } else {
                this.classes.push(a);
            }
        });
        return this;
    }

    // get opacity(): number {
    //     let opacity = 100;
    //     let current: W | null = this;
    //     while (current) {
    //         if (current._used) {
    //             opacity = Math.min(opacity, current._used.opacity); // TODO - opacity = Math.floor(opacity * current._used.opacity / 100);
    //         }
    //         current = current.parent;
    //     }
    //     return opacity;
    // }

    // set opacity(v: number) {
    //     this.style('opacity', v);
    //     this.needsDraw = true;
    //     this.hidden = this._used.opacity == 0;
    // }

    // ATTRIBUTES

    attr(name: string): PropType;
    attr(name: string, v: PropType): this;
    attr(name: string, v?: PropType): PropType | this {
        if (v === undefined) return this._attrs[name];
        this._attrs[name] = v;
        return this;
    }

    _attrInt(name: string): number {
        const n = this._attrs[name] || 0;
        if (typeof n === 'number') return n;
        if (typeof n === 'string') return Number.parseInt(n);
        return n ? 1 : 0;
    }

    _attrStr(name: string): string {
        const n = this._attrs[name] || '';
        if (typeof n === 'string') return n;
        if (typeof n === 'number') return '' + n;
        return n ? 'true' : 'false';
    }

    _attrBool(name: string): boolean {
        return !!this._attrs[name];
    }

    text(): string;
    text(v: string): this;
    text(v?: string): this | string {
        if (v === undefined) return this._attrStr('text');
        this.attr('text', v);
        return this;
    }

    // PROPS

    prop(name: string): PropType | undefined;
    prop(name: string, v: PropType): this;
    prop(name: string, v?: PropType): this | PropType | undefined {
        if (v === undefined) return this._props[name];
        const current = this._props[name];
        if (current !== v) {
            this._setProp(name, v);
        }
        return this;
    }

    _setProp(name: string, v: PropType): void {
        // console.log(`${this.tag}.${name}=${v} (was:${this._props[name]})`);
        this._props[name] = v;
        this.needsStyle = true;
    }

    _propInt(name: string): number {
        const n = this._props[name] || 0;
        if (typeof n === 'number') return n;
        if (typeof n === 'string') return Number.parseInt(n);
        return n ? 1 : 0;
    }

    _propStr(name: string): string {
        const n = this._props[name] || '';
        if (typeof n === 'string') return n;
        if (typeof n === 'number') return '' + n;
        return n ? 'true' : 'false';
    }

    _propBool(name: string): boolean {
        return !!this._props[name];
    }

    toggleProp(name: string): this {
        const current = !!this._props[name];
        this.prop(name, !current);
        return this;
    }

    incProp(name: string, n = 1): this {
        let current = this.prop(name) || 0;
        if (typeof current === 'boolean') {
            current = current ? 1 : 0;
        } else if (typeof current === 'string') {
            current = Number.parseInt(current) || 0;
        }
        current += n;
        this.prop(name, current);
        return this;
    }
    get hovered(): boolean {
        return !!this.prop('hover');
    }
    set hovered(v: boolean) {
        this.prop('hover', v);
    }

    get disabled(): boolean {
        let current: Widget | null = this;
        while (current) {
            if (current.prop('disabled')) return true;
            current = current.parent;
        }
        return false;
    }
    set disabled(v: boolean) {
        this.prop('disabled', v);
    }

    get hidden(): boolean {
        let current: Widget | null = this;
        while (current) {
            if (current.prop('hidden')) return true;
            current = current.parent;
        }
        return false;
    }
    set hidden(v: boolean) {
        this.prop('hidden', v);
        if (!v && this._used && this._used.opacity == 0) {
            this._used.opacity = 100;
        }

        if (v && this.scene && this.scene.focused === this) {
            this.scene.nextTabStop();
        } else if (!v && this.scene && this.scene.focused === null) {
            this.scene.setFocusWidget(this);
        }

        this.trigger(v ? 'hide' : 'show');
    }

    get needsStyle(): boolean {
        return this._propBool('needsStyle');
    }
    set needsStyle(v: boolean) {
        this._props.needsStyle = v;
        if (v) {
            this.needsDraw = true; // changed style or state
        }
    }

    get focused(): boolean {
        return !!this.prop('focus');
    }

    focus(reverse = false): void {
        if (this.prop('focus')) return;

        this.prop('focus', true);
        this.trigger('focus', { reverse });
    }

    blur(reverse = false): void {
        if (!this.prop('focus')) return;
        this.prop('focus', false);
        this.trigger('blur', { reverse });
    }

    // CHILDREN

    setParent(parent: Widget | null, opts?: SetParentOptions) {
        if (this.parent === parent) return;

        // remove from curent parent
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index < 0) throw new Error('Error in parent/child setup!');
            this.parent.children.splice(index, 1);
        }

        if (parent) {
            if (this.scene !== parent.scene) {
                if (this.scene) {
                    this.scene._detach(this);
                }
                if (parent.scene) {
                    parent.scene._attach(this);
                }
                if (opts && opts.focused) {
                    this.scene!.setFocusWidget(this);
                }
            }

            if (opts && opts.first) {
                parent.children.unshift(this);
            } else if (opts && opts.before) {
                let index = -1;
                if (typeof opts.before === 'string') {
                    index = parent.children.findIndex(
                        (c) => c.id === opts.before
                    );
                } else {
                    index = parent.children.indexOf(opts.before);
                }

                if (index < 0) {
                    parent.children.unshift(this);
                } else {
                    parent.children.splice(index, 0, this);
                }
            } else if (opts && opts.after) {
                let index = -1;
                if (typeof opts.after === 'string') {
                    index = parent.children.findIndex(
                        (c) => c.id === opts.before
                    );
                } else {
                    index = parent.children.indexOf(opts.after);
                }

                if (index < 0) {
                    parent.children.push(this);
                } else {
                    parent.children.splice(index + 1, 0, this);
                }
            } else {
                parent.children.push(this);
            }
            this.parent = parent;
        } else {
            this.scene && this.scene._detach(this);
            this.parent = null;
        }

        if (opts && (this.parent || this.scene)) {
            this.updatePos(opts);
        }
    }

    addChild(child: Widget) {
        if (this.children.includes(child)) return;
        child.setParent(this);
    }

    removeChild(child: Widget) {
        if (!this.children.includes(child)) return;
        child.setParent(null);
    }

    childAt(xy: XY.XY): Widget | null;
    childAt(xy: number, y: number): Widget | null;
    childAt(xy: XY.XY | number, y?: number): Widget | null {
        if (!XY.isXY(xy)) {
            xy = { x: xy, y: y! };
        }
        // if (!this.contains(xy)) return null;

        for (let child of this.children) {
            if (child.contains(xy)) return child;
        }
        return null;
    }

    getChild(id: string): Widget | null {
        return this.children.find((c) => c.id === id) || null;
    }

    // EVENTS

    on(ev: string | string[], cb: EVENTS.CallbackFn): EVENTS.CancelFn {
        return this.events.on(ev, cb);
    }
    once(ev: string | string[], cb: EVENTS.CallbackFn): EVENTS.CancelFn {
        return this.events.once(ev, cb);
    }
    off(ev: string | string[], cb: EVENTS.CallbackFn): void {
        this.events.off(ev, cb);
    }
    trigger(ev: string | string[], ...args: any[]) {
        return this.events.trigger(ev, ...args);
    }
    action(ev?: IO.Event) {
        if (ev && ev.defaultPrevented) return;
        this.trigger('action');

        const action = this._attrStr('action');
        if (!action || !action.length) return;
        this.scene && this.scene.trigger(action, this);
    }

    // FRAME

    input(e: IO.Event) {
        this.trigger('input', e);
        if (e.defaultPrevented || e.propagationStopped) return;

        if (e.type === IO.KEYPRESS) {
            this.keypress(e);
        } else if (e.type === IO.MOUSEMOVE) {
            this.mousemove(e);
        } else if (e.type === IO.CLICK) {
            this.click(e);
        }
    }

    _mouseenter(e: IO.Event): void {
        if (!this.bounds.contains(e)) return;
        if (this.hovered) return;
        this.hovered = true;
        this.trigger('mouseenter', e);
        // if (this._parent) {
        //     this._parent._mouseenter(e);
        // }
    }

    mousemove(e: IO.Event): void {
        for (let child of this.children) {
            child.mousemove(e);
        }

        if (this.bounds.contains(e) && !this.hidden) {
            //  && !e.defaultPrevented
            this._mouseenter(e);
            this._mousemove(e);
            // e.preventDefault();
        } else {
            this._mouseleave(e);
        }
    }

    _mousemove(e: IO.Event): void {
        this.trigger('mousemove', e);
    }

    _mouseleave(e: IO.Event): void {
        if (!this.hovered) return;
        if (this.bounds.contains(e)) return;
        this.hovered = false;
        this.trigger('mouseleave', e);
        // if (this._parent) {
        //     this._parent.mouseleave(e);
        // }
    }

    click(e: IO.Event): void {
        if (this.disabled || this.hidden) return;

        e.target = this;

        const c = this.childAt(e);
        if (c) {
            c.click(e);
        }

        if (!this.bounds.contains(e)) return;
        if (e.propagationStopped) return;
        this._click(e);

        if (!e.defaultPrevented) {
            this.action();
        }
    }

    _click(e: IO.Event) {
        this.events.trigger('click', e);
    }

    // keypress bubbles
    keypress(e: IO.Event): void {
        if (this.hidden || this.disabled) return;
        let current: Widget | null = this;
        while (current && !e.propagationStopped) {
            current.events.dispatch(e);
            current = current.parent;
        }
    }

    draw(buffer: BUFFER.Buffer) {
        if (this.needsStyle && this.scene) {
            this._used = this.scene.styles.computeFor(this);
            this.needsStyle = false;
        }

        if (this.hidden) return;

        this._draw(buffer);
        this.trigger('draw', buffer);

        this.children.forEach((c) => c.draw(buffer));
    }

    _draw(buffer: BUFFER.Buffer) {
        this._drawFill(buffer);
    }

    _drawFill(buffer: BUFFER.Buffer) {
        const b = this.bounds;
        buffer.fillRect(
            b.x,
            b.y,
            b.width,
            b.height,
            ' ',
            this._used.bg,
            this._used.bg
        );
    }

    update(dt: number) {
        this.trigger('update', dt);
    }

    destroy() {
        if (this.parent) {
            this.setParent(null);
        }
        if (this.scene) {
            this.scene._detach(this);
        }
        this.children.forEach((c) => c.destroy());
        this.children = [];

        // @ts-ignore;
        this._used = null;
    }
}

export function alignChildren(widget: Widget, align: TEXT.Align = 'left') {
    if (widget.children.length < 2) return;
    if (align === 'left') {
        const left = widget.children.reduce(
            (out, c) => Math.min(out, c.bounds.left),
            999
        );
        widget.children.forEach((c) => (c.bounds.left = left));
    } else if (align === 'right') {
        const right = widget.children.reduce(
            (out, c) => Math.max(out, c.bounds.right),
            0
        );
        widget.children.forEach((c) => (c.bounds.right = right));
    } else {
        // center
        const right = widget.children.reduce(
            (out, c) => Math.max(out, c.bounds.right),
            0
        );
        const left = widget.children.reduce(
            (out, c) => Math.min(out, c.bounds.left),
            999
        );
        const center = left + Math.floor((right - left) / 2);
        widget.children.forEach((c) => {
            c.bounds.center = center;
        });
    }
}

export function spaceChildren(widget: Widget, space = 0) {
    if (widget.children.length < 2) return;

    let y = widget.children.reduce(
        (out, c) => Math.min(out, c.bounds.top),
        999
    );

    widget.children
        .slice()
        .sort((a, b) => a.bounds.top - b.bounds.top)
        .forEach((c) => {
            c.bounds.top = y;
            y = c.bounds.bottom + space;
        });
}

export function wrapChildren(widget: Widget, pad = 0) {
    if (widget.children.length < 1) return;

    widget.bounds.copy(widget.children[0].bounds);
    widget.children.forEach((c) => {
        widget.bounds.include(c.bounds);
    });

    widget.bounds.pad(pad);
}

// export interface WidgetOptions extends StyleOptions, SetParentOptions {
//     id?: string;
//     disabled?: boolean;
//     hidden?: boolean;
//     opacity?: number;

//     x?: number;
//     y?: number;
//     width?: number;
//     height?: number;

//     class?: string;
//     tag?: string;

//     tabStop?: boolean;
//     action?: string | boolean;
//     // depth?: number;
// }

// Style.defaultStyle.add('*', {
//     fg: 'white',
//     bg: -1,
//     align: 'left',
//     valign: 'top',
// });

// export class Widget implements UIStylable {
//     tag: string = 'text';
//     body!: Body; // So that Body can => this.body = this;
//     bounds: XY.Bounds = new XY.Bounds(0, 0, 0, 1);
//     // _depth = 0;
//     events: EVENTS.Events;
//     // action: string = '';
//     children: Widget[] = [];

//     _style = new Style.Style();
//     _used!: Style.ComputedStyle;

//     _parent: Widget | null = null;
//     classes: string[] = [];
//     _props: Record<string, PropType> = {
//         needsDraw: true,
//         needsStyle: true,
//         hover: false,
//     };
//     _attrs: Record<string, PropType> = {};

//     constructor(parent: Body | Widget, opts?: WidgetOptions);
//     constructor(opts?: WidgetOptions);
//     constructor(parent?: Body | Widget | WidgetOptions, opts?: WidgetOptions) {
//         opts = opts || {};
//         if (!parent) {
//         } else if (parent instanceof Body) {
//             this.body = parent;
//         } else if (parent instanceof Widget) {
//             this.body = parent.body;
//         } else {
//             opts = parent;
//             parent = undefined;
//         }

//         // this.bounds.x = term.x;
//         // this.bounds.y = term.y;
//         this.events = new EVENTS.Events(this);

//         this.bounds.x = opts.x || 0;
//         this.bounds.y = opts.y || 0;
//         this.bounds.width = opts.width || 0;
//         this.bounds.height = opts.height || 1;

//         if (opts.tag) {
//             this.tag = opts.tag;
//         }
//         if (opts.id) {
//             this.attr('id', opts.id);
//             this.attr('action', opts.id);
//         }
//         // if (opts.depth !== undefined) {
//         //     this._depth = opts.depth;
//         // }
//         this._style.set(opts);
//         if (opts.class) {
//             this.classes = opts.class.split(/ +/g).map((c) => c.trim());
//         }
//         if (opts.tabStop) {
//             this.prop('tabStop', true);
//         }
//         if (opts.disabled) {
//             this.prop('disabled', true);
//         }
//         if (opts.hidden) {
//             this.prop('hidden', true);
//         }

//         opts.action = opts.action || opts.id;
//         if (opts.action) {
//             if (opts.action === true) {
//                 if (!opts.id) throw new Error('boolean action requires id.');
//                 opts.action = opts.id;
//             }
//             this.attr('action', opts.action);
//         }

//         this.updateStyle();
//         if (opts.opacity !== undefined) {
//             this._used.opacity = opts.opacity;
//         }

//         if (parent) {
//             parent.addChild(this, opts);
//         }
//     }

//     // get depth(): number {
//     //     return this._depth;
//     // }
//     // set depth(v: number) {
//     //     this._depth = v;
//     //     this.scene.sortWidgets();
//     // }

//     get parent(): Widget | null {
//         return this._parent;
//     }
//     set parent(v: Widget | null) {
//         this.setParent(v);
//     }
//     setParent(v: Widget | null, opts: SetParentOptions = {}) {
//         if (this._parent) {
//             this._parent.removeChild(this);
//         }
//         this._parent = v;
//         if (this._parent) {
//             // this.depth = this._depth || this._parent.depth + 1;
//             this._parent.addChild(this, opts);
//         }
//     }

//     get needsDraw() {
//         return this.body.needsDraw;
//     }

//     set needsDraw(v: boolean) {
//         if (v) this.body.needsDraw = true;
//     }

//     get id(): string {
//         return this._attrStr('id');
//     }

//     //////////////////////////////////////////

//     pos(): XY.XY;
//     pos(xy: XY.XY): this;
//     pos(x: number, y: number): this;
//     pos(x?: number | XY.XY, y?: number): this | XY.XY {
//         if (x === undefined) return this.bounds;

//         if (typeof x === 'number') {
//             this.bounds.x = x;
//             this.bounds.y = y || 0;
//         } else {
//             this.bounds.x = x.x;
//             this.bounds.y = x.y;
//         }
//         this.needsDraw = true;

//         return this;
//     }

//     center(bounds?: XY.Bounds): this {
//         return this.centerX(bounds).centerY(bounds);
//     }

//     centerX(bounds?: XY.Bounds): this {
//         if (bounds) {
//             const w = this.bounds.width;
//             const mid = Math.round((bounds.width - w) / 2);
//             this.bounds.x = bounds.x + mid;
//         } else {
//             this.bounds.x = Math.round(
//                 (this.body.width - this.bounds.width) / 2
//             );
//         }
//         return this;
//     }

//     centerY(bounds?: XY.Bounds): this {
//         if (bounds) {
//             const h = this.bounds.height;
//             const mid = Math.round((bounds.height - h) / 2);
//             this.bounds.y = bounds.y + mid;
//         } else {
//             this.bounds.y = Math.round(
//                 (this.body.height - this.bounds.height) / 2
//             );
//         }
//         return this;
//     }

//     //////////////////////////////////////////

//     text(): string;
//     text(v: string): this;
//     text(v?: string): this | string {
//         if (v === undefined) return this._attrStr('text');
//         this.attr('text', v);
//         return this;
//     }

//     attr(name: string): PropType;
//     attr(name: string, v: PropType): this;
//     attr(name: string, v?: PropType): PropType | this {
//         if (v === undefined) return this._attrs[name];
//         this._attrs[name] = v;
//         return this;
//     }

//     _attrInt(name: string): number {
//         const n = this._attrs[name] || 0;
//         if (typeof n === 'number') return n;
//         if (typeof n === 'string') return Number.parseInt(n);
//         return n ? 1 : 0;
//     }

//     _attrStr(name: string): string {
//         const n = this._attrs[name] || '';
//         if (typeof n === 'string') return n;
//         if (typeof n === 'number') return '' + n;
//         return n ? 'true' : 'false';
//     }

//     _attrBool(name: string): boolean {
//         return !!this._attrs[name];
//     }

//     prop(name: string): PropType | undefined;
//     prop(name: string, v: PropType): this;
//     prop(name: string, v?: PropType): this | PropType | undefined {
//         if (v === undefined) return this._props[name];
//         const current = this._props[name];
//         if (current !== v) {
//             this._setProp(name, v);
//         }
//         return this;
//     }

//     _setProp(name: string, v: PropType): void {
//         // console.log(`${this.tag}.${name}=${v} (was:${this._props[name]})`);
//         this._props[name] = v;
//         this.updateStyle();
//     }

//     _propInt(name: string): number {
//         const n = this._props[name] || 0;
//         if (typeof n === 'number') return n;
//         if (typeof n === 'string') return Number.parseInt(n);
//         return n ? 1 : 0;
//     }

//     _propStr(name: string): string {
//         const n = this._props[name] || '';
//         if (typeof n === 'string') return n;
//         if (typeof n === 'number') return '' + n;
//         return n ? 'true' : 'false';
//     }

//     _propBool(name: string): boolean {
//         return !!this._props[name];
//     }

//     toggleProp(name: string): this {
//         const current = !!this._props[name];
//         this.prop(name, !current);
//         return this;
//     }

//     incProp(name: string, n = 1): this {
//         let current = this.prop(name) || 0;
//         if (typeof current === 'boolean') {
//             current = current ? 1 : 0;
//         } else if (typeof current === 'string') {
//             current = Number.parseInt(current) || 0;
//         }
//         current += n;
//         this.prop(name, current);
//         return this;
//     }

//     contains(e: XY.XY): boolean;
//     contains(x: number, y: number): boolean;
//     contains(...args: any[]): boolean {
//         return this.bounds.contains(args[0], args[1]);
//     }

//     style(): Style.Style;
//     style(opts: StyleOptions): this;
//     style(opts?: StyleOptions): this | Style.Style {
//         if (opts === undefined) return this._style;

//         this._style.set(opts);
//         this.updateStyle();
//         return this;
//     }

//     addClass(c: string): this {
//         const all = c.split(/ +/g);
//         all.forEach((a) => {
//             if (this.classes.includes(a)) return;
//             this.classes.push(a);
//         });
//         return this;
//     }

//     removeClass(c: string): this {
//         const all = c.split(/ +/g);
//         all.forEach((a) => {
//             Utils.arrayDelete(this.classes, a);
//         });
//         return this;
//     }

//     hasClass(c: string): boolean {
//         const all = c.split(/ +/g);
//         return Utils.arrayIncludesAll(this.classes, all);
//     }

//     toggleClass(c: string): this {
//         const all = c.split(/ +/g);
//         all.forEach((a) => {
//             if (this.classes.includes(a)) {
//                 Utils.arrayDelete(this.classes, a);
//             } else {
//                 this.classes.push(a);
//             }
//         });
//         return this;
//     }

//     get focused(): boolean {
//         return !!this.prop('focus');
//     }

//     focus(reverse = false): boolean {
//         if (this.prop('focus')) return true;

//         this.prop('focus', true);
//         return this.trigger('focus', { reverse });
//     }

//     blur(reverse = false): boolean {
//         if (!this.prop('focus')) return false;
//         this.prop('focus', false);
//         return this.trigger('blur', { reverse });
//     }

//     get hovered(): boolean {
//         return !!this.prop('hover');
//     }
//     set hovered(v: boolean) {
//         this.prop('hover', v);
//     }

//     get disabled(): boolean {
//         let current: Widget | null = this;
//         while (current) {
//             if (current.prop('disabled')) return true;
//             current = current.parent;
//         }
//         return false;
//     }
//     set disabled(v: boolean) {
//         this.prop('disabled', v);
//     }

//     get hidden(): boolean {
//         let current: Widget | null = this;
//         while (current) {
//             if (current.prop('hidden')) return true;
//             current = current.parent;
//         }
//         return false;
//     }
//     set hidden(v: boolean) {
//         this.prop('hidden', v);
//         if (!v && this._used.opacity == 0) {
//             this._used.opacity = 100;
//         }
//     }

//     get opacity(): number {
//         let opacity = 100;
//         let current: Widget | null = this;
//         while (current) {
//             if (current._used) {
//                 opacity = Math.min(opacity, current._used.opacity); // TODO - opacity = Math.floor(opacity * current._used.opacity / 100);
//             }
//             current = current.parent;
//         }
//         return opacity;
//     }

//     set opacity(v: number) {
//         if (v !== this._used.opacity) {
//             this._used.opacity = v;
//             this.hidden = this._used.opacity == 0;
//             this.needsDraw = true;
//         }
//     }

//     updateStyle() {
//         // this._used = this.scene.styles.computeFor(this);
//         this._props.needsStyle = true;
//         this.needsDraw = true; // changed style or state
//     }

//     draw(buffer: Buffer.Buffer, styles: Style.Sheet): boolean {
//         if (this.hidden) return false;
//         let needsStyle = this._props.needsStyle;
//         let needsDraw = needsStyle || this.needsDraw;

//         if (!needsDraw) return false;

//         if (needsStyle) {
//             this._used = styles.computeFor(this);
//             this._props.needsStyle = false;
//         }

//         this._draw(buffer);

//         for (let child of this.children) {
//             child.draw(buffer, styles);
//         }

//         this.needsDraw = false;

//         return true;
//     }

//     // Draw

//     protected _draw(buffer: Buffer.Buffer): boolean {
//         this._drawFill(buffer);
//         return true;
//     }

//     protected _drawFill(buffer: Buffer.Buffer): void {
//         if (!this._used) return;

//         buffer.fillRect(
//             this.bounds.x,
//             this.bounds.y,
//             this.bounds.width,
//             this.bounds.height,
//             ' ',
//             this._used.bg,
//             this._used.bg
//         );
//     }

//     // Children

//     childAt(xy: XY.XY): Widget | null;
//     childAt(x: number, y: number): Widget | null;
//     childAt(...args: any[]): Widget | null {
//         return this.children.find((c) => c.contains(args[0], args[1])) || null;
//     }

//     _attach(w: Widget) {
//         w._parent = this;
//         this.body.attach(w);
//     }

//     addChild(w: Widget, opts: SetParentOptions = {}): void {
//         if (w === this) return;

//         let beforeIndex = -1;
//         if (opts.beforeIndex !== undefined) {
//             beforeIndex = opts.beforeIndex;
//         }

//         if (w._parent && w._parent !== this)
//             throw new Error('Trying to add child that already has a parent.');
//         if (!this.children.includes(w)) {
//             if (beforeIndex < 0 || beforeIndex >= this.children.length) {
//                 this.children.push(w);
//             } else {
//                 this.children.splice(beforeIndex, 0, w);
//             }
//         }
//         this._attach(w);

//         if (opts.center) {
//             opts.centerX = opts.centerY = true;
//         }
//         if (opts.centerX) {
//             opts.left = Math.floor((this.bounds.width - w.bounds.width) / 2);
//         }
//         if (opts.centerY) {
//             opts.top = Math.floor((this.bounds.height - w.bounds.height) / 2);
//         }

//         if (opts.left !== undefined) {
//             w.bounds.left = this.bounds.left + opts.left;
//         } else if (opts.right !== undefined) {
//             w.bounds.right = this.bounds.right - opts.right;
//         }

//         if (opts.top !== undefined) {
//             w.bounds.top = this.bounds.top + opts.top;
//         } else if (opts.bottom !== undefined) {
//             w.bounds.bottom = this.bounds.bottom - opts.bottom;
//         }
//     }

//     _detach(w: Widget) {
//         this.body.detach(w);
//         w._parent = null;
//     }

//     removeChild(w: Widget): void {
//         if (!w._parent || w._parent !== this)
//             throw new Error(
//                 'Removing child that does not have this widget as parent.'
//             );

//         Utils.arrayDelete(this.children, w);
//         this._detach(w);
//     }

//     resize(w: number, h: number): this {
//         this.bounds.width = w || this.bounds.width;
//         this.bounds.height = h || this.bounds.height;
//         this.needsDraw = true;
//         return this;
//     }

//     // Events

//     input(e: IO.Event) {
//         if (e.type === IO.KEYPRESS) {
//             this.keypress(e);
//         } else if (e.type === IO.MOUSEMOVE) {
//             this.mousemove(e);
//         } else if (e.type === IO.CLICK) {
//             this.click(e);
//         }
//     }

//     _mouseenter(e: IO.Event): void {
//         if (!this.contains(e)) return;
//         if (this.hovered) return;
//         this.hovered = true;
//         this.trigger('mouseenter', e);
//         // if (this._parent) {
//         //     this._parent._mouseenter(e);
//         // }
//     }

//     mousemove(e: IO.Event): boolean {
//         for (let child of this.children) {
//             child.mousemove(e);
//         }

//         if (this.contains(e) && !e.defaultPrevented && !this.hidden) {
//             this._mouseenter(e);
//             this.trigger('mousemove', e);
//             // e.preventDefault();
//         } else {
//             this._mouseleave(e);
//         }
//         return false;
//     }

//     _mouseleave(e: IO.Event): void {
//         if (!this.hovered) return;
//         if (this.contains(e)) return;
//         this.hovered = false;
//         this.trigger('mouseleave', e);
//         // if (this._parent) {
//         //     this._parent.mouseleave(e);
//         // }
//     }

//     click(e: IO.Event): boolean {
//         if (this.hidden || !this.contains(e) || this.disabled) return false;

//         for (let child of this.children) {
//             if (child.click(e)) return true;
//         }

//         let current: Widget | null = this;
//         while (current && !e.propagationStopped) {
//             current.trigger('click', e);
//             current = current.parent;
//         }
//         return true;
//     }

//     keypress(e: IO.Event): void {
//         if (this.hidden || this.disabled) return;
//         let current: Widget | null = this;

//         let evs = [e.key, e.code, 'keypress'];
//         if (e.dir) {
//             evs.unshift('dir');
//         }

//         while (current && !e.propagationStopped) {
//             current.trigger(evs, e);
//             current = current.parent;
//         }
//     }

//     update(dt: number): void {
//         this.trigger('update', dt);
//         this.children.forEach((c) => c.update(dt));
//     }

//     destroy() {
//         this.trigger('destroy');

//         this.events.clear();
//         this.children.forEach((c) => c.destroy());
//         this.children = [];
//         if (this.parent) {
//             this.parent.removeChild(this);
//         }
//     }

//     // events

//     on(event: string, cb: EVENTS.CallbackFn): EVENTS.CancelFn {
//         return this.events.on(event, cb);
//     }

//     off(event: string, cb: EventCb): void {
//         this.events.off(event, cb);
//     }

//     trigger(name: string | string[], ...args: any[]): boolean {
//         return this.events.trigger(name, ...args);
//     }

//     _bubble(name: string, ...args: any[]): boolean {
//         let current: Widget | null = this;
//         let fired = false;
//         while (current) {
//             fired = current.trigger(name, ...args) || fired;
//             current = current.parent;
//         }
//         fired = this.body.trigger(name, ...args) || fired;
//         return fired;
//     }

//     _triggerAction(ev: IO.Event) {
//         if (ev && (ev.propagationStopped || ev.defaultPrevented)) return;
//         const action = this._attrStr('action');
//         if (action && action.length) {
//             this._bubble(action);
//         }
//     }
// }
