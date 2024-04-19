import { Glyphs, GlyphOptions } from './glyphs.js';
import { Canvas } from './canvas.js';
// import * as IO from '../io.js';

interface BaseOptions {
    width?: number;
    height?: number;
    glyphs?: Glyphs;
    div?: HTMLElement | string;
    io?: true; // if true, hookup events to standard IO loop.
    // loop?: IO.Loop; // The loop to attach to
    image?: HTMLImageElement | string;
}

export type CanvasOptions = BaseOptions & GlyphOptions;

export function make(opts: Partial<CanvasOptions>): Canvas;
export function make(
    width: number,
    height: number,
    opts?: Partial<CanvasOptions>
): Canvas;
export function make(...args: any[]): Canvas {
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

    const canvas: Canvas = new Canvas({ width, height, glyphs });

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

    return canvas;
}
