// import * as GWU from 'gw-utils';
import * as COLOR from '../color';
// import * as EVENTS from '../app/events';

import { Scene } from '../app/scene';
import { Dialog, DialogOptions } from '../widget/dialog';
import { Text } from '../widget/text';
import { Button } from '../widget/button';

export interface ConfirmOptions extends Partial<DialogOptions> {
    text: string;
    textClass?: string;
    opacity?: number;

    buttonWidth?: number;

    ok?: string;
    okClass?: string;

    cancel?: boolean | string;
    cancelClass?: string;

    done?: (result: boolean) => any;
}

export const ConfirmScene = {
    create(this: Scene) {
        this.on('keypress', (e) => {
            if (e.key === 'Escape') {
                this.trigger('CANCEL');
            } else if (e.key === 'Enter') {
                this.trigger('OK');
            }
        });

        this.on('OK', () => {
            this.stop(true);
        });
        this.on('CANCEL', () => {
            this.stop(false);
        });
    },

    start(this: Scene, opts: ConfirmOptions) {
        opts.class = opts.class || 'confirm';
        opts.border = opts.border || 'ascii';
        opts.pad = opts.pad || 1;

        // Fade the background
        const opacity = opts.opacity !== undefined ? opts.opacity : 50;
        this.bg = COLOR.BLACK.alpha(opacity);

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
        const textWidget = new Text({
            scene: this,
            text: opts.text,
            class: opts.textClass || opts.class,
            width: width,
            height: opts.height,
        }).center();

        Object.assign(opts, {
            scene: this,
            width: textWidget.bounds.width + 2,
            height: textWidget.bounds.height + 2, // for buttons
            x: textWidget.bounds.x,
            y: textWidget.bounds.y,
            tag: 'confirm',
        });
        const dialog = new Dialog(opts as DialogOptions);
        dialog.addChild(textWidget);

        new Button({
            parent: dialog,
            text: opts.ok,
            class: opts.okClass || opts.class,
            width: buttonWidth,
            id: 'OK',
            right: -1 - dialog._attrInt('padRight'),
            bottom: -1 - dialog._attrInt('padBottom'),
        });

        if (opts.cancel.length) {
            new Button({
                parent: dialog,
                text: opts.cancel,
                class: opts.cancelClass || opts.class,
                width: buttonWidth,
                id: 'CANCEL',
                left: 1 + dialog._attrInt('padLeft'),
                bottom: -1 - dialog._attrInt('padBottom'),
            });
        }

        if (opts.done) {
            const done = opts.done;
            this.once('OK', () => {
                done(true);
            });
            this.once('CANCEL', () => {
                done(false);
            });
        }
    },
    stop(this: Scene) {
        this.children.forEach((c) => c.destroy());
        this.children = [];
    },
};

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

// UI.prototype.confirm = function (...args: any[]): Promise<boolean> {
//     let opts = {} as ConfirmOptions;
//     let text: string;
//     let textArgs: any = {};

//     if (typeof args[0] === 'string') {
//         text = args[0];
//         textArgs = args[1];
//     } else {
//         opts = args[0];
//         text = args[1];
//         textArgs = args[2];
//     }

//     if (textArgs) {
//         text = TextUtils.apply(text, textArgs);
//     }

//     opts.class = opts.class || 'confirm';
//     opts.border = opts.border || 'ascii';
//     opts.pad = opts.pad || 1;

//     const layer = new WidgetLayer(this);

//     // Fade the background
//     const opacity = opts.opacity !== undefined ? opts.opacity : 50;
//     layer.body.style().set('bg', Color.BLACK.alpha(opacity));

//     if (opts.cancel === undefined) {
//         opts.cancel = 'Cancel';
//     } else if (opts.cancel === true) {
//         opts.cancel = 'Cancel';
//     } else if (!opts.cancel) {
//         opts.cancel = '';
//     }

//     opts.ok = opts.ok || 'Ok';

//     let buttonWidth = opts.buttonWidth || 0;
//     if (!buttonWidth) {
//         buttonWidth = Math.max(opts.ok.length, opts.cancel.length);
//     }

//     const width = Math.max(opts.width || 0, buttonWidth * 2 + 2);

//     // create the text widget
//     const textWidget = layer
//         .text(text!, {
//             class: opts.textClass || opts.class,
//             width: width,
//             height: opts.height,
//         })
//         .center();

//     Object.assign(opts, {
//         width: textWidget.bounds.width,
//         height: textWidget.bounds.height + 2, // for buttons
//         x: textWidget.bounds.x,
//         y: textWidget.bounds.y,
//         tag: 'confirm',
//     });
//     const dialog = layer.dialog(opts as DialogOptions);
//     textWidget.setParent(dialog);

//     layer
//         .button(opts.ok, {
//             class: opts.okClass || opts.class,
//             width: buttonWidth,
//             id: 'OK',
//             parent: dialog,
//             x: dialog._innerLeft + dialog._innerWidth - buttonWidth,
//             y: dialog._innerTop + dialog._innerHeight - 1,
//         })
//         .on('click', () => {
//             layer.finish(true);
//             return true;
//         });

//     if (opts.cancel.length) {
//         layer
//             .button(opts.cancel, {
//                 class: opts.cancelClass || opts.class,
//                 width: buttonWidth,
//                 id: 'CANCEL',
//                 parent: dialog,
//                 x: dialog._innerLeft,
//                 y: dialog._innerTop + dialog._innerHeight - 1,
//             })
//             .on('click', () => {
//                 layer.finish(false);
//                 return true;
//             });
//     }

//     layer.on('keypress', (_n, _w, e) => {
//         if (e.key === 'Escape') {
//             layer.finish(false);
//         } else if (e.key === 'Enter') {
//             layer.finish(true);
//         }
//         return true;
//     });

//     return layer.run();
// };
