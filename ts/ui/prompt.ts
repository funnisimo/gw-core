// import * as GWU from 'gw-utils';
import * as Color from '../color';
// import * as TextUtils from '../text';

import '../widget/button';
import { Scene } from '../app/scene';
import * as DIALOG from '../widget/dialog';
import { Text } from '../widget/text';
import { Input } from '../widget/input';

export interface PromptOptions
    extends Omit<DIALOG.DialogOptions, 'width' | 'height'> {
    width?: number;
    height?: number;

    prompt: string;
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

    done?: (result: string | null) => any;
}

export const PromptScene = {
    create(this: Scene) {
        this.on('INPUT', () => {
            const input = this.get('INPUT');
            this.stop(input ? input.text() : null);
        });
        this.on('Escape', () => {
            this.stop(null);
        });
    },
    start(this: Scene, opts: PromptOptions) {
        opts.class = opts.class || 'confirm';
        opts.border = opts.border || 'ascii';
        opts.pad = opts.pad || 0;

        // Fade the background
        const opacity = opts.opacity !== undefined ? opts.opacity : 50;
        this.bg = Color.BLACK.alpha(opacity);

        // create the text widget
        const textWidget = new Text({
            text: opts.prompt,
            class: opts.textClass || opts.class,
            width: opts.width,
            height: opts.height,
        });

        Object.assign(opts, {
            width: textWidget.bounds.width + 2,
            height: textWidget.bounds.height + 1, // for input
            x: textWidget.bounds.x - 1,
            y: textWidget.bounds.y - 1,
            tag: 'inputbox',
            scene: this,
            center: true,
        });
        const dialog = new DIALOG.Dialog(opts as DIALOG.DialogOptions);
        textWidget.setParent(dialog, { top: 1, centerX: true });

        let width = dialog._innerWidth - 2;
        let x = textWidget.bounds.left;
        if (opts.label) {
            const label = new Text({
                parent: dialog,
                text: opts.label,
                class: opts.labelClass || opts.class,
                tag: 'label',
                x,
                bottom: -1,
            });

            x += label.bounds.width + 1;
            width -= label.bounds.width + 1;
        }

        const input = new Input({
            parent: dialog,
            class: opts.inputClass || opts.class,
            width,
            id: 'INPUT',
            x,
            bottom: -1,
        });

        this.once('INPUT', () => {
            if (opts.done) opts.done(input.text());
        });

        this.once('Escape', () => {
            if (opts.done) opts.done(null);
        });
    },
    stop(this: Scene) {},
};

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
/*
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
*/
