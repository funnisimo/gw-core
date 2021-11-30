// import * as GWU from 'gw-utils';
import * as Color from '../color';
import * as TextUtils from '../text';

import { UI } from './ui';
import { WidgetLayer } from '../widget/layer';
import '../widget/button';
import * as Dialog from '../widget/dialog';

export interface ConfirmOptions
    extends Omit<Dialog.DialogOptions, 'width' | 'height'> {
    width?: number;
    height?: number;

    textClass?: string;
    opacity?: number;

    buttonWidth?: number;

    ok?: string;
    okClass?: string;

    cancel?: boolean | string;
    cancelClass?: string;
}

// extend WidgetLayer

declare module './ui' {
    interface UI {
        confirm(text: string, args?: any): WidgetLayer;
        confirm(opts: ConfirmOptions, text: string, args?: any): WidgetLayer;
    }
}

UI.prototype.confirm = function (
    opts: ConfirmOptions | string,
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
    const dialog = layer.dialog(opts as Dialog.DialogOptions);
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

    return layer;
};
