// import * as GWU from 'gw-utils';
import * as Color from '../color';
import * as Text from '../text';

import { UI } from './ui';
import { WidgetLayer } from '../widget/layer';
import * as Dialog from '../widget/dialog';

export interface AlertOptions extends Dialog.DialogOptions {
    duration?: number;
    waitForAck?: boolean;
    textClass?: string;
    opacity?: number;
}

// extend WidgetLayer

declare module './ui' {
    interface UI {
        alert(
            opts: AlertOptions | number,
            text: string,
            args?: any
        ): WidgetLayer;
    }
}

UI.prototype.alert = function (
    opts: AlertOptions | number,
    text: string,
    args?: any
): WidgetLayer {
    if (typeof opts === 'number') {
        opts = { duration: opts } as AlertOptions;
    }

    if (args) {
        text = Text.apply(text, args);
    }

    opts.class = opts.class || 'alert';
    opts.border = opts.border || 'ascii';
    opts.pad = opts.pad || 1;

    const layer = this.startWidgetLayer();

    // Fade the background
    const opacity = opts.opacity !== undefined ? opts.opacity : 50;
    layer.body.style().set('bg', Color.BLACK.alpha(opacity));

    // create the text widget
    const textWidget = layer
        .text(text, {
            id: 'TEXT',
            class: opts.textClass || opts.class,
            width: opts.width,
            height: opts.height,
        })
        .center();

    Object.assign(opts, {
        width: textWidget.bounds.width,
        height: textWidget.bounds.height,
        x: textWidget.bounds.x,
        y: textWidget.bounds.y,
        id: 'DIALOG',
    });
    const dialog = layer.dialog(opts);
    textWidget.setParent(dialog);

    layer.on('click', () => {
        layer.finish(true);
        return true;
    });

    layer.on('keypress', () => {
        layer.finish(true);
        return true;
    });

    layer.setTimeout(() => {
        layer.finish(false);
    }, opts.duration || 3000);

    return layer;
};
