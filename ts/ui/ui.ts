// import * as GWU from 'gw-utils';
import * as Utils from '../utils';
import * as Buffer from '../buffer';
import * as IO from '../io';
import * as Canvas from '../canvas';

import { defaultStyle, Sheet } from './style';
import { UICore, Layer } from './layer';
// import * as Widget from './widget';

export interface UIOptions extends Canvas.CanvasOptions {
    canvas?: Canvas.BaseCanvas;
    loop?: IO.Loop;
}

export class UI implements UICore {
    canvas: Canvas.BaseCanvas;
    loop: IO.Loop;
    layer: Layer | null = null;
    layers: Layer[] = [];

    // inDialog = false;
    _done = false;
    _promise: Promise<void> | null = null;

    constructor(opts: UIOptions = {}) {
        this.canvas = opts.canvas || Canvas.make(opts);
        this.loop = opts.loop || IO.loop;
    }

    get width(): number {
        return this.canvas.width;
    }
    get height(): number {
        return this.canvas.height;
    }

    get styles(): Sheet {
        return defaultStyle;
    }

    // render() {
    //     this.buffer.render();
    // }

    get baseBuffer(): Canvas.Buffer {
        const layer = this.layers[this.layers.length - 2] || null;
        return layer ? layer.buffer : this.canvas.buffer;
    }

    get canvasBuffer(): Canvas.Buffer {
        return this.canvas.buffer;
    }

    get buffer(): Canvas.Buffer {
        return this.layer ? this.layer.buffer : this.canvas.buffer;
    }

    startNewLayer(): Layer {
        const layer = new Layer(this, {
            styles: this.layer ? this.layer.styles : this.styles,
        });

        this.layers.push(layer);

        if (!this._promise) {
            this._promise = this.loop.run((this as unknown) as IO.IOMap);
        }
        this.layer = layer;
        return layer;
    }

    copyUIBuffer(dest: Buffer.Buffer): void {
        const base = this.baseBuffer;
        dest.copy(base);
        dest.changed = false; // So you have to draw something to make the canvas render...
    }

    finishLayer(layer: Layer): void {
        layer._finish();
        Utils.arrayDelete(this.layers, layer);
        if (this.layer === layer) {
            this.layer = this.layers[this.layers.length - 1] || null;
            this.layer && (this.layer.needsDraw = true);
        }
    }

    stop(): void {
        this._done = true;
        while (this.layer) {
            this.finishLayer(this.layer);
        }
    }

    // run(): Promise<void> {
    //     // this._done = false;
    //     return this.loop.run(this as unknown as IO.IOMap);
    // }

    // stop() {
    //     this._done = true;
    //     if (this.layer) this.layer.stop();
    //     this.layers.forEach((l) => l.stop());
    //     this.layer = null;
    //     this.layers.length = 0;
    // }

    async mousemove(e: IO.Event): Promise<boolean> {
        if (this.layer) await this.layer.mousemove(e);
        return this._done;
    }

    async click(e: IO.Event): Promise<boolean> {
        if (this.layer) await this.layer.click(e);
        return this._done;
    }

    async keypress(e: IO.Event): Promise<boolean> {
        if (this.layer) await this.layer.keypress(e);
        return this._done;
    }

    async dir(e: IO.Event): Promise<boolean> {
        if (this.layer) await this.layer.dir(e);
        return this._done;
    }

    async tick(e: IO.Event): Promise<boolean> {
        if (this.layer) await this.layer.tick(e);
        return this._done;
    }

    draw() {
        if (this.layer) this.layer.draw();
    }

    // UTILITY FUNCTIONS

    // async fadeTo(color: GWU.color.ColorBase = 'black', duration = 1000) {
    //     color = GWU.color.from(color);
    //     const buffer = this.startLayer();

    //     let pct = 0;
    //     let elapsed = 0;

    //     while (elapsed < duration) {
    //         elapsed += 32;
    //         if (await this.loop.pause(32)) {
    //             elapsed = duration;
    //         }

    //         pct = Math.floor((100 * elapsed) / duration);

    //         this.copyUIBuffer(buffer);
    //         buffer.mix(color, pct);
    //         buffer.render();
    //     }

    //     this.finishLayer();
    // }

    // async alert(opts: number | AlertOptions, text: string, args: any) {
    //     if (typeof opts === 'number') {
    //         opts = { duration: opts } as AlertOptions;
    //     }

    //     if (args) {
    //         text = GWU.text.apply(text, args);
    //     }

    //     const width = opts.width || GWU.text.length(text);
    //     opts.box = opts.box || { bg: opts.bg };
    //     // opts.box.bg = opts.box.bg || 'gray';

    //     const textOpts: Widget.TextOptions = {
    //         fg: opts.fg,
    //         text,
    //         x: 0,
    //         y: 0,
    //         wrap: width,
    //     };
    //     const textWidget = new Widget.Text('TEXT', textOpts);

    //     const height = textWidget.bounds.height;

    //     const dlg: Widget.Dialog = Widget.buildDialog(this, width, height)
    //         .with(textWidget, { x: 0, y: 0 })
    //         .addBox(opts.box)
    //         .center()
    //         .done();

    //     dlg.setEventHandlers({
    //         click: () => dlg.close(true),
    //         keypress: () => dlg.close(true),
    //         TIMEOUT: () => dlg.close(false),
    //     });

    //     if (!opts.waitForAck) {
    //         dlg.setTimeout('TIMEOUT', opts.duration || 3000);
    //     }

    //     return await dlg.show();
    // }

    // async confirm(text: string, args?: any): Promise<boolean>;
    // async confirm(
    //     opts: ConfirmOptions,
    //     text: string,
    //     args?: any
    // ): Promise<boolean>;
    // async confirm(...args: any[]): Promise<boolean> {
    //     let opts: ConfirmOptions;
    //     let text: string;
    //     let textArgs: any = null;
    //     if (args.length <= 2 && typeof args[0] === 'string') {
    //         opts = {};
    //         text = args[0];
    //         textArgs = args[1] || null;
    //     } else {
    //         opts = args[0];
    //         text = args[1];
    //         textArgs = args[2] || null;
    //     }

    //     if (textArgs) {
    //         text = GWU.text.apply(text, textArgs);
    //     }

    //     const width =
    //         opts.width ||
    //         Math.min(Math.floor(this.buffer.width / 2), GWU.text.length(text));

    //     const textOpts: Widget.TextOptions = {
    //         fg: opts.fg,
    //         text,
    //         wrap: width,
    //     };
    //     const textWidget = new Widget.Text('TEXT', textOpts);

    //     const height = textWidget.bounds.height + 2;

    //     opts.allowCancel = opts.allowCancel !== false;
    //     opts.buttons = Object.assign(
    //         {
    //             fg: 'white',
    //             activeFg: 'teal',
    //             bg: 'dark_gray',
    //             activeBg: 'darkest_gray',
    //         },
    //         opts.buttons || {}
    //     );
    //     if (typeof opts.ok === 'string') {
    //         opts.ok = { text: opts.ok };
    //     }
    //     if (typeof opts.cancel === 'string') {
    //         opts.cancel = { text: opts.cancel };
    //     }
    //     opts.ok = opts.ok || {};
    //     opts.cancel = opts.cancel || {};

    //     const okOpts = Object.assign({}, opts.buttons, { text: 'OK' }, opts.ok);
    //     const cancelOpts = Object.assign(
    //         {},
    //         opts.buttons,
    //         { text: 'CANCEL' },
    //         opts.cancel
    //     );

    //     const builder = Widget.buildDialog(this, width, height)
    //         .with(textWidget, { x: 0, y: 0 })
    //         .with(new Widget.Button('OK', okOpts), { x: 0, bottom: 0 });

    //     if (opts.allowCancel) {
    //         builder.with(new Widget.Button('CANCEL', cancelOpts), {
    //             right: 0,
    //             bottom: 0,
    //         });
    //     }

    //     const dlg: Widget.Dialog = builder.center().addBox(opts.box).done();

    //     dlg.setEventHandlers({
    //         OK() {
    //             dlg.close(true);
    //         },
    //         CANCEL() {
    //             dlg.close(false);
    //         },
    //         Escape() {
    //             dlg.close(false);
    //         },
    //         Enter() {
    //             dlg.close(true);
    //         },
    //     });

    //     return await dlg.show();
    // }

    // async showWidget(widget: Widget.Widget, keymap: Widget.EventHandlers = {}) {
    //     const center = widget.bounds.x < 0 || widget.bounds.y < 0;

    //     const place = { x: widget.bounds.x, y: widget.bounds.y };
    //     const builder = Widget.buildDialog(this).with(widget, { x: 0, y: 0 });
    //     if (center) {
    //         builder.center();
    //     } else {
    //         builder.place(place.x, place.y);
    //     }
    //     const dlg = builder.done();

    //     keymap.Escape =
    //         keymap.Escape ||
    //         (() => {
    //             dlg.close(false);
    //         });
    //     dlg.setEventHandlers(keymap);

    //     return await dlg.show();
    // }

    // // assumes you are in a dialog and give the buffer for that dialog
    // async getInputAt(
    //     x: number,
    //     y: number,
    //     maxLength: number,
    //     opts: Widget.InputOptions = {}
    // ): Promise<string> {
    //     opts.width = maxLength;
    //     opts.x = x;
    //     opts.y = y;
    //     const widget = new Widget.Input('INPUT', opts);

    //     return this.showWidget(widget, {
    //         INPUT(_e, dlg) {
    //             dlg.close(widget.text);
    //         },
    //         Escape(_e, dlg) {
    //             dlg.close('');
    //         },
    //     });
    // }

    // async inputBox(opts: InputBoxOptions, prompt: string, args?: any) {
    //     if (args) {
    //         prompt = GWU.text.apply(prompt, args);
    //     }

    //     const width =
    //         opts.width ||
    //         Math.min(
    //             Math.floor(this.buffer.width / 2),
    //             GWU.text.length(prompt)
    //         );

    //     const promptOpts: Widget.TextOptions = {
    //         fg: opts.fg,
    //         text: prompt,
    //         wrap: width,
    //     };
    //     const promptWidget = new Widget.Text('TEXT', promptOpts);

    //     const height =
    //         promptWidget.bounds.height +
    //         2 + // skip + input
    //         2; // skip + ok/cancel
    //     opts.allowCancel = opts.allowCancel !== false;
    //     opts.buttons = Object.assign(
    //         {
    //             fg: 'white',
    //             activeFg: 'teal',
    //             bg: 'dark_gray',
    //             activeBg: 'darkest_gray',
    //         },
    //         opts.buttons || {}
    //     );
    //     if (typeof opts.ok === 'string') {
    //         opts.ok = { text: opts.ok };
    //     }
    //     if (typeof opts.cancel === 'string') {
    //         opts.cancel = { text: opts.cancel };
    //     }
    //     opts.ok = opts.ok || {};
    //     opts.cancel = opts.cancel || {};

    //     const okOpts = Object.assign({}, opts.buttons, { text: 'OK' }, opts.ok);
    //     const cancelOpts = Object.assign(
    //         {},
    //         opts.buttons,
    //         { text: 'CANCEL' },
    //         opts.cancel
    //     );

    //     opts.input = opts.input || {};
    //     opts.input.width = opts.input.width || width;
    //     opts.input.bg = opts.input.bg || opts.fg;
    //     opts.input.fg = opts.input.fg || opts.bg;

    //     const inputWidget = new Widget.Input('INPUT', opts.input || {});
    //     const builder = Widget.buildDialog(this, width, height)
    //         .with(promptWidget, { x: 0, y: 0 })
    //         .with(inputWidget, { bottom: 2, x: 0 })
    //         .with(new Widget.Button('OK', okOpts), { bottom: 0, x: 0 })
    //         .addBox(opts.box);

    //     if (opts.allowCancel) {
    //         builder.with(new Widget.Button('CANCEL', cancelOpts), {
    //             bottom: 0,
    //             right: 0,
    //         });
    //     }

    //     const dlg: Widget.Dialog = builder.center().done();

    //     dlg.setEventHandlers({
    //         OK() {
    //             dlg.close(inputWidget.text);
    //         },
    //         CANCEL() {
    //             dlg.close('');
    //         },
    //         Escape() {
    //             dlg.close('');
    //         },
    //         INPUT() {
    //             dlg.close(inputWidget.text);
    //         },
    //     });

    //     return await dlg.show();
    // }
}
