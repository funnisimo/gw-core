import * as Color from '../color';
import * as Text from '../text';
import * as IO from '../io';
import * as Canvas from '../canvas';
import { Selector } from './selector';

// export interface GetInputOptions {
//     fg?: Color.ColorBase;
//     bg?: Color.ColorBase;
//     errorFg?: Color.ColorBase;

//     hint?: string;
//     hintFg?: Color.ColorBase;

//     default?: string;
//     minLength?: number;

//     numbersOnly?: boolean;
//     min?: number;
//     max?: number;
// }

export interface Size {
    width: number;
    height: number;
}

export type PrefixType = 'none' | 'letter' | 'number' | 'bullet';

export type PropType = string | number | boolean;

export interface UIStyle {
    readonly selector: Selector;
    dirty: boolean;

    readonly fg?: Color.ColorBase;
    readonly bg?: Color.ColorBase;
    readonly align?: Text.Align;
    readonly valign?: Text.VAlign;

    get(key: keyof UIStyle): any;
    set(key: keyof UIStyle, value: any): this;
    set(values: StyleOptions): this;
    unset(key: keyof UIStyle): this;
}

export interface StyleOptions {
    fg?: Color.ColorBase;
    bg?: Color.ColorBase;
    align?: Text.Align;
    valign?: Text.VAlign;
}

export interface UISelectable {
    readonly tag: string;
    readonly classes: string[];
    children: UISelectable[];
    attr(name: string): PropType | undefined;
    prop(name: string): PropType | undefined;
    parent: UISelectable | null;
}

export interface UIStylable extends UISelectable {
    style(): UIStyle;
    readonly opacity: number;
}

// export interface UIStylesheet {
//     dirty: boolean;
//     add(selector: string, props: StyleOptions): this;
//     get(selector: string): UIStyle | null;
//     remove(selector: string): void;
//     computeFor(widget: UIStylable): UIStyle;
// }

// export interface UIWidget extends UISelectable {
//     readonly layer: UILayer;
//     readonly tag: string;
//     readonly bounds: GWU.xy.Bounds;
//     readonly depth: number;
//     readonly classes: string[];

//     parent: UIWidget | null;
//     children: UIWidget[];
//     addChild(c: UIWidget): this;
//     removeChild(c: UIWidget): this;

//     style(): UIStyle;

//     text(): string;
//     text(v: string): this;

//     attr(name: string): PropType;
//     attr(name: string, v: PropType): this;

//     prop(name: string): PropType | undefined;
//     prop(name: string, v: PropType): this;
//     toggleProp(name: string): this;
//     incProp(name: string): this;

//     contains(e: GWU.xy.XY): boolean;
//     contains(x: number, y: number): boolean;

//     addClass(c: string): this;
//     removeClass(c: string): this;
//     hasClass(c: string): boolean;
//     toggleClass(c: string): this;

//     readonly focused: boolean;
//     hovered: boolean;
//     hidden: boolean;

//     focus(reverse: boolean): void;
//     blur(): void;

//     updateStyle(): void;
//     draw(buffer: GWU.buffer.Buffer): void;

//     mouseenter(e: IO.Event): void;
//     mousemove(e: IO.Event): boolean;
//     mouseleave(e: IO.Event): void;
//     click(e: IO.Event): boolean;
//     keypress(e: IO.Event): boolean;
//     dir(e: IO.Event): boolean;
//     tick(e: IO.Event): boolean;

//     on(event: string, cb: EventCb): this;
//     off(event: string, cb?: EventCb): this;
// }

export interface UILayer {
    // readonly ui: UICore;
    readonly buffer: Canvas.Buffer;
    // readonly body: UIWidget;
    // readonly styles: UIStylesheet;

    readonly width: number;
    readonly height: number;

    // fadeTo(color?: Color.ColorBase, duration?: number): void;

    // Focus
    // setFocusWidget(w: UIWidget | null, reverse?: boolean): void;
    // nextTabStop(): boolean;
    // prevTabStop(): boolean;

    // widgets
    // create(tag: string, opts: Record<string, any>): UIWidget;
    // addWidget(w: UIWidget): void;
    // removeWidget(w: UIWidget): void;

    // run
    finish(result?: any): void;

    // events
    click(e: IO.Event): boolean | Promise<boolean>;
    mousemove(e: IO.Event): boolean | Promise<boolean>;
    keypress(e: IO.Event): boolean | Promise<boolean>;
    dir(e: IO.Event): boolean | Promise<boolean>;
    tick(e: IO.Event): boolean | Promise<boolean>;

    // draw
    draw(): void;
    needsDraw: boolean;
}
