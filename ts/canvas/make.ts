import { Glyphs, GlyphOptions } from './glyphs';
import { BaseCanvas, Canvas2D, NotSupportedError } from './canvas';
import { CanvasGL } from './canvasGL';
import * as IO from '../io';

interface BaseOptions {
    width?: number;
    height?: number;
    glyphs?: Glyphs;
    div?: HTMLElement | string;
    io?: true; // if true, hookup events to standard IO loop.
    loop?: IO.Loop; // The loop to attach to
    image?: HTMLImageElement | string;
}

export type CanvasOptions = BaseOptions & GlyphOptions;

export function make(opts: Partial<CanvasOptions>): BaseCanvas;
export function make(
    width: number,
    height: number,
    opts?: Partial<CanvasOptions>
): BaseCanvas;
export function make(...args: any[]): BaseCanvas {
    let width: number = args[0];
    let height: number = args[1];
    let opts: Partial<CanvasOptions> = args[2];
    if (args.length == 1) {
        opts = args[0];
        height = opts.height || 34;
        width = opts.width || 80;
    }
    opts = opts || { font: 'monospace' };
    let glyphs: Glyphs;
    if (opts.image) {
        glyphs = Glyphs.fromImage(opts.image);
    } else {
        glyphs = Glyphs.fromFont(opts);
    }

    let canvas: CanvasGL | Canvas2D;
    try {
        canvas = new CanvasGL(width, height, glyphs);
    } catch (e) {
        if (!(e instanceof NotSupportedError)) throw e;
    }

    if (canvas! === undefined) {
        canvas = new Canvas2D(width, height, glyphs);
    }

    if (opts.div) {
        let el;
        if (typeof opts.div === 'string') {
            el = document.getElementById(opts.div);
            if (!el) {
                console.warn(
                    'Failed to find parent element by ID: ' + opts.div
                );
            }
        } else {
            el = opts.div;
        }
        if (el && el.appendChild) {
            el.appendChild(canvas.node);
        }
    }

    if (opts.loop) {
        canvas.loop = opts.loop;
    }

    if (opts.io || opts.loop) {
        canvas.onclick = (e) => canvas.loop.enqueue(e);
        canvas.onmousemove = (e) => canvas.loop.enqueue(e);
        canvas.onmouseup = (e) => canvas.loop.enqueue(e);
        // canvas.onkeydown = (e) => loop.enqueue(e); // Keyboard events require tabindex to be set, better to let user do this.
    }

    return canvas;
}
