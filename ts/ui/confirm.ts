// import * as GWU from 'gw-utils';
import * as Color from '../color';
import * as TextUtils from '../text';

import { UI, ConfirmOptions } from './ui';
import { WidgetLayer } from '../widget/layer';
import { DialogOptions } from '../widget/dialog';

// extend WidgetLayer

// declare module './ui' {
//     interface UI {
//         confirm(text: string, args?: any): Promise<boolean>;
//         confirm(
//             opts: ConfirmOptions,
//             text: string,
//             args?: any
//         ): Promise<boolean>;
//     }
// }

UI.prototype.confirm = function (...args: any[]): Promise<boolean> {
    let opts = {} as ConfirmOptions;
    let text: string;
    let textArgs: any = {};

    if (typeof args[0] === 'string') {
        text = args[0];
        textArgs = args[1];
    } else {
        opts = args[0];
        text = args[1];
        textArgs = args[2];
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

    if (opts.cancel === undefined) {
        opts.cancel = 'Cancel';
    } else if (opts.cancel === true) {
        opts.cancel = 'Cancel';
    } else if (!opts.cancel) {
        opts.cancel = '';
    }

    opts.ok = opts.ok || 'Ok';

    let buttonWidth = opts.buttonWidth || 0;
    if (!buttonWidth) {
        buttonWidth = Math.max(opts.ok.length, opts.cancel.length);
    }

    const width = Math.max(opts.width || 0, buttonWidth * 2 + 2);

    // create the text widget
    const textWidget = layer
        .text(text!, {
            class: opts.textClass || opts.class,
            width: width,
            height: opts.height,
        })
        .center();

    Object.assign(opts, {
        width: textWidget.bounds.width,
        height: textWidget.bounds.height + 2, // for buttons
        x: textWidget.bounds.x,
        y: textWidget.bounds.y,
        tag: 'confirm',
    });
    const dialog = layer.dialog(opts as DialogOptions);
    textWidget.setParent(dialog);

    layer
        .button(opts.ok, {
            class: opts.okClass || opts.class,
            width: buttonWidth,
            id: 'OK',
            parent: dialog,
            x: dialog._innerLeft + dialog._innerWidth - buttonWidth,
            y: dialog._innerTop + dialog._innerHeight - 1,
        })
        .on('click', () => {
            layer.finish(true);
            return true;
        });

    if (opts.cancel.length) {
        layer
            .button(opts.cancel, {
                class: opts.cancelClass || opts.class,
                width: buttonWidth,
                id: 'CANCEL',
                parent: dialog,
                x: dialog._innerLeft,
                y: dialog._innerTop + dialog._innerHeight - 1,
            })
            .on('click', () => {
                layer.finish(false);
                return true;
            });
    }

    layer.on('keypress', (_n, _w, e) => {
        if (e.key === 'Escape') {
            layer.finish(false);
        } else if (e.key === 'Enter') {
            layer.finish(true);
        }
        return true;
    });

    return layer.run();
};
