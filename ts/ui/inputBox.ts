// import * as GWU from 'gw-utils';
import * as Color from '../color';
import * as TextUtils from '../text';

import { DialogOptions } from '../widget/dialog';
import { UI, InputBoxOptions } from './ui';
import '../widget/button';
import { WidgetLayer } from '../widget/layer';

// extend WidgetLayer

// declare module './ui' {
//     interface UI {
//         inputbox(text: string, args?: any): Promise<string>;
//         inputbox(
//             opts: InputBoxOptions,
//             text: string,
//             args?: any
//         ): Promise<string>;
//     }
// }

UI.prototype.inputbox = function (...args: any[]): Promise<string | null> {
    let opts = {} as InputBoxOptions;
    let text: string;
    let textArgs: any = {};

    if (typeof args[1] === 'string') {
        opts.default = args[0];
        text = args[1];
        textArgs = args[2];
    } else {
        text = args[0];
        textArgs = args[1];
    }

    if (textArgs) {
        text = TextUtils.apply(text, textArgs);
    }

    opts.class = opts.class || 'confirm';
    opts.border = opts.border || 'ascii';
    opts.pad = opts.pad || 1;

    const layer = new WidgetLayer(this);

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
    const dialog = layer.dialog(opts as DialogOptions);
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

    return layer.run();
};
