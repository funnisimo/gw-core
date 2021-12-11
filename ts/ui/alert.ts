// import * as GWU from 'gw-utils';
import * as Color from '../color';
import * as Text from '../text';

import * as UI from './ui';
import { WidgetLayer } from '../widget/layer';

// extend WidgetLayer

// declare module './ui' {
//     interface UI {
//         alert(
//             opts: AlertOptions | number,
//             text: string,
//             args?: any
//         ): Promise<boolean>;
//     }
// }

UI.UI.prototype.alert = function (...args: any[]): Promise<boolean> {
    let opts = {} as UI.AlertOptions;
    let text: string;
    let textArgs: any = {};

    if (typeof args[0] === 'number') {
        opts.duration = args[0];
        text = args[1];
        textArgs = args[2];
    } else if (typeof args[0] === 'string') {
        text = args[0];
        textArgs = args[1];
    } else {
        opts = args[0];
        text = args[1];
        textArgs = args[2];
    }

    if (textArgs) {
        text = Text.apply(text, textArgs);
    }

    opts.class = opts.class || 'alert';
    opts.border = opts.border || 'ascii';
    opts.pad = opts.pad || 1;

    const layer = new WidgetLayer(this);

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

    return layer.run();
};
