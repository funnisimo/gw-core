// import * as Color from '../color';
import * as TEXT from '../text';

import { Scene } from '../app/scene';
import { Dialog, DialogOptions } from '../widget/dialog';
import { Text } from '../widget/text';

export interface AlertOptions extends Partial<DialogOptions> {
    duration?: number;
    waitForAck?: boolean;
    textClass?: string;
    opacity?: number;

    text: string;
    args?: Record<string, any>;
}

export const AlertScene = {
    create(this: Scene) {
        this.on('click', () => {
            this.stop({ click: true });
        });
        this.on('keypress', () => {
            this.stop({ keypress: true });
        });
    },

    start(this: Scene, data: AlertOptions) {
        if (data.args) {
            data.text = TEXT.apply(data.text, data.args);
        }

        data.class = data.class || 'alert';
        data.border = data.border || 'ascii';
        data.pad = data.pad || 1;

        const text = new Text(data);
        if (!data.height) {
            data.height = text.bounds.height;
        }
        if (!data.width) {
            data.width = text.bounds.width;
        }
        data.scene = this;
        data.center = true;
        const dialog = new Dialog(data as DialogOptions);
        text.setParent(dialog, { center: true });

        if (!data.waitForAck) {
            this.wait(data.duration || 3000, () => this.stop({}));
        }
    },

    stop(this: Scene) {
        this.children.forEach((c) => c.destroy());
        this.children = [];
        this.timers.clear();
    },
};

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

// export function alert(app: App, text: string): Promise<boolean> {
//     const scenes = app.scenes;
//     let done: (v: boolean) => void;

//     const promise = new Promise((resolve) => {
//         done = resolve;
//     });

//     scenes.pause();
//     const alert = scenes.start('alert', { text });
//     alert.on('stop', (data) => {
//         scenes.resume();
//         done(data.click || data.keypress);
//     });

//     return promise as Promise<boolean>;
// }

// UI.UI.prototype.alert = function (...args: any[]): Promise<boolean> {
//     let opts = {} as UI.AlertOptions;
//     let text: string;
//     let textArgs: any = {};

//     if (typeof args[0] === 'number') {
//         opts.duration = args[0];
//         text = args[1];
//         textArgs = args[2];
//     } else if (typeof args[0] === 'string') {
//         text = args[0];
//         textArgs = args[1];
//     } else {
//         opts = args[0];
//         text = args[1];
//         textArgs = args[2];
//     }

//     if (textArgs) {
//         text = Text.apply(text, textArgs);
//     }

//     opts.class = opts.class || 'alert';
//     opts.border = opts.border || 'ascii';
//     opts.pad = opts.pad || 1;

//     const layer = new WidgetLayer(this);

//     // Fade the background
//     const opacity = opts.opacity !== undefined ? opts.opacity : 50;
//     layer.body.style().set('bg', Color.BLACK.alpha(opacity));

//     // create the text widget
//     const textWidget = layer
//         .text(text, {
//             id: 'TEXT',
//             class: opts.textClass || opts.class,
//             width: opts.width,
//             height: opts.height,
//         })
//         .center();

//     Object.assign(opts, {
//         width: textWidget.bounds.width,
//         height: textWidget.bounds.height,
//         x: textWidget.bounds.x,
//         y: textWidget.bounds.y,
//         id: 'DIALOG',
//     });
//     const dialog = layer.dialog(opts);
//     textWidget.setParent(dialog);

//     layer.on('click', () => {
//         layer.finish(true);
//         return true;
//     });

//     layer.on('keypress', () => {
//         layer.finish(true);
//         return true;
//     });

//     layer.setTimeout(() => {
//         layer.finish(false);
//     }, opts.duration || 3000);

//     return layer.run();
// };

/*
    // dialogs

    alert(text: string, args?: any): Promise<boolean>;
    alert(
        opts: AlertOptions | number,
        text: string,
        args?: any
    ): Promise<boolean>;
    alert(...args: any[]): Promise<boolean> {
        let opts = {} as AlertOptions;
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
            text = TEXT.apply(text, textArgs);
        }

        opts.class = opts.class || 'alert';
        opts.border = opts.border || 'ascii';
        opts.pad = opts.pad || 1;

        const scene = new SCENE.Scene('alert', {
            create() {
                // Fade the background
                const opacity = opts.opacity !== undefined ? opts.opacity : 50;
                scene.body.style().set('bg', COLOR.BLACK.alpha(opacity));

                // create the text widget
                const textWidget = TEXTWIDGET.text(scene, {
                    text,
                    id: 'TEXT',
                    class: opts.textClass || opts.class,
                    width: opts.width,
                    height: opts.height,
                });

                Object.assign(opts, {
                    width: textWidget.bounds.width,
                    height: textWidget.bounds.height,
                    x: textWidget.bounds.x,
                    y: textWidget.bounds.y,
                    id: 'DIALOG',
                });
                const dialog = DIALOG.dialog(scene, opts);
                dialog.addChild(textWidget, { center: true });
                scene.body.addChild(dialog, { center: true });
            },
        });

        scene.on('click', () => {
            scene.stop({ interruped: true });
        });

        scene.on('keypress', () => {
            scene.stop({ interupted: true });
        });

        scene.wait(opts.duration || 3000, () => {
            scene.stop({ interrupted: false });
        });

        return new Promise((resolve) => {
            scene.on('stop', (data) => {
                resolve(data.interruped);
            });

            this.scenes.start(scene);
        });
    }
*/
