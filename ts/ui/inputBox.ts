// import * as GWU from 'gw-utils';
import * as Color from '../color';
import * as TextUtils from '../text';

import { UI } from './ui';
import { WidgetLayer } from '../widget/layer';
import '../widget/button';
import * as Dialog from '../widget/dialog';

export interface InputBoxOptions
    extends Omit<Dialog.DialogOptions, 'width' | 'height'> {
    width?: number;
    height?: number;

    textClass?: string;
    opacity?: number;

    buttonWidth?: number;

    label?: string;
    labelClass?: string;

    default?: string;
    placeholder?: string;
    inputClass?: string;

    minLength?: number;
    maxLength?: number;

    numbersOnly?: boolean;
    min?: number;
    max?: number;
}

// extend WidgetLayer

declare module './ui' {
    interface UI {
        inputbox(text: string, args?: any): WidgetLayer;
        inputbox(opts: InputBoxOptions, text: string, args?: any): WidgetLayer;
    }
}

UI.prototype.inputbox = function (
    opts: InputBoxOptions | string,
    text?: string | any,
    args?: any
): WidgetLayer {
    if (typeof opts === 'string') {
        args = text;
        text = opts;
        opts = {};
    }
    if (args) {
        text = TextUtils.apply(text!, args);
    }

    opts.class = opts.class || 'confirm';
    opts.border = opts.border || 'ascii';
    opts.pad = opts.pad || 1;

    const layer = this.startWidgetLayer();

    // Fade the background
    const opacity = opts.opacity !== undefined ? opts.opacity : 50;
    layer.body.style().set('bg', Color.BLACK.alpha(opacity));

    // create the text widget
    const textWidget = layer
        .text(text!, {
            class: opts.textClass || opts.class,
            width: opts.width,
            height: opts.height,
        })
        .center();

    Object.assign(opts, {
        width: textWidget.bounds.width,
        height: textWidget.bounds.height + 2, // for input
        x: textWidget.bounds.x,
        y: textWidget.bounds.y,
        tag: 'inputbox',
    });
    const dialog = layer.dialog(opts as Dialog.DialogOptions);
    textWidget.setParent(dialog);

    let width = dialog._innerWidth;
    let x = dialog._innerLeft;
    if (opts.label) {
        const label = layer.text(opts.label, {
            class: opts.labelClass || opts.class,
            tag: 'label',
            parent: dialog,
            x,
            y: dialog._innerTop + dialog._innerHeight - 1,
        });

        x += label.bounds.width + 1;
        width -= label.bounds.width + 1;
    }

    layer
        .input({
            class: opts.inputClass || opts.class,
            width,
            id: 'INPUT',
            parent: dialog,
            x,
            y: dialog._innerTop + dialog._innerHeight - 1,
        })
        .on('INPUT', (_n, w, _e) => {
            w && layer.finish(w.text());
            return true;
        });

    layer.on('keypress', (_n, _w, e) => {
        if (e.key === 'Escape') {
            layer.finish(null);
            return true;
        }
        return false;
    });

    return layer;
};
