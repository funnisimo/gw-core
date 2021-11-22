// import * as GWU from 'gw-utils';
import * as Color from '../color';
import * as TextUtils from '../text';
import * as Tween from '../tween';

import * as Widget from '../widget';

export interface AnimateOptions {
    x?: number;
    y?: number;
    width?: number;
    height?: number;

    hidden?: boolean;

    fg?: Color.ColorBase;
    bg?: Color.ColorBase;
    align?: TextUtils.Align;
    valign?: TextUtils.VAlign;
}

class WidgetProxy {
    _widget: Widget.Widget;
    constructor(widget: Widget.Widget) {
        this._widget = widget;
    }

    get x() {
        return this._widget.bounds.x;
    }
    set x(v: number) {
        this._widget.bounds.x = v;
    }

    get y() {
        return this._widget.bounds.y;
    }
    set y(v: number) {
        this._widget.bounds.y = v;
    }

    get width() {
        return this._widget.bounds.width;
    }
    set width(v: number) {
        this._widget.bounds.width = v;
    }

    get height() {
        return this._widget.bounds.height;
    }
    set height(v: number) {
        this._widget.bounds.height = v;
    }

    get hidden() {
        return this._widget.hidden;
    }
    set hidden(v: boolean) {
        this._widget.hidden = v;
    }

    get fg(): Color.Color {
        return Color.from(this._widget._used.fg || Color.BLACK);
    }
    set fg(v: Color.Color) {
        this._widget._used._fg = v;
    }

    get bg(): Color.Color {
        return Color.from(this._widget._used.bg || Color.BLACK);
    }
    set bg(v: Color.Color) {
        this._widget._used._bg = v;
    }

    get align(): TextUtils.Align {
        return this._widget._used.align || 'left';
    }
    set align(v: TextUtils.Align) {
        this._widget._used._align = v;
    }

    get valign(): TextUtils.VAlign {
        return this._widget._used.valign || 'top';
    }
    set valign(v: TextUtils.VAlign) {
        this._widget._used._valign = v;
    }

    get text(): string {
        return this._widget.text();
    }
    set text(v: string) {
        this._widget.text(v);
    }
}

export class Animation extends Tween.Tween {
    constructor(widget: Widget.Widget) {
        super(new WidgetProxy(widget));
    }
}
