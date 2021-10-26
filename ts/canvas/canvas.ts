import { Glyphs, GlyphOptions } from './glyphs';
import { BufferTarget, Buffer, DataBuffer } from './buffer';
import * as IO from '../io';
import * as Utils from '../utils';
import * as XY from '../xy';

export type EventFn = (ev: IO.Event) => void;

interface BaseOptions {
    width: number;
    height: number;
    glyphs: Glyphs;
    div: HTMLElement | string;
    io: boolean; // if true, hookup events to standard IO loop.
    loop: IO.Loop; // if provided, hookup events to this loop.
    image: HTMLImageElement | string;
}

export type CanvasOptions = BaseOptions & GlyphOptions;

export class NotSupportedError extends Error {
    constructor(...params: any[]) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        // @ts-ignore
        if (Error.captureStackTrace) {
            // @ts-ignore
            Error.captureStackTrace(this, NotSupportedError);
        }

        this.name = 'NotSupportedError';
    }
}

export abstract class BaseCanvas implements BufferTarget {
    public mouse: XY.XY = { x: -1, y: -1 };
    protected _data!: Uint32Array;
    protected _renderRequested: boolean = false;
    protected _glyphs!: Glyphs;
    protected _node: HTMLCanvasElement;

    protected _width: number = 50;
    protected _height: number = 25;
    protected _buffer: Buffer;

    constructor(width: number, height: number, glyphs: Glyphs) {
        this._node = this._createNode();
        this._createContext();
        this._configure(width, height, glyphs);

        this._buffer = new Buffer(this);
    }

    get node(): HTMLCanvasElement {
        return this._node;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get tileWidth() {
        return this._glyphs.tileWidth;
    }
    get tileHeight() {
        return this._glyphs.tileHeight;
    }
    get pxWidth() {
        return this.node.clientWidth;
    }
    get pxHeight() {
        return this.node.clientHeight;
    }

    get glyphs(): Glyphs {
        return this._glyphs;
    }
    set glyphs(glyphs: Glyphs) {
        this._setGlyphs(glyphs);
    }

    toGlyph(ch: string | number) {
        if (typeof ch === 'number') return ch;
        return this._glyphs.forChar(ch);
    }

    get buffer() {
        return this._buffer;
    }

    protected _createNode() {
        return document.createElement('canvas');
    }

    protected abstract _createContext(): void;

    private _configure(width: number, height: number, glyphs: Glyphs) {
        this._width = width;
        this._height = height;
        this._setGlyphs(glyphs);
    }

    protected _setGlyphs(glyphs: Glyphs) {
        if (glyphs === this._glyphs) return false;

        this._glyphs = glyphs;
        this.resize(this._width, this._height);
        return true;
    }

    resize(width: number, height: number) {
        this._width = width;
        this._height = height;

        if (this._buffer) {
            this._buffer.resize(width, height);
        }

        const node = this.node;
        node.width = this._width * this.tileWidth;
        node.height = this._height * this.tileHeight;
    }

    protected _requestRender() {
        if (this._renderRequested) return;
        this._renderRequested = true;
        requestAnimationFrame(() => this._render());
    }

    abstract draw(data: DataBuffer): boolean;

    copyTo(data: DataBuffer) {
        if (!this.buffer) return; // startup/constructor
        data.copy(this.buffer);
    }

    render(): void {
        this.buffer.render();
    }

    abstract _render(): void;

    hasXY(x: number, y: number) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    set onclick(fn: EventFn | null) {
        if (fn) {
            this.node.onclick = (e: MouseEvent) => {
                const x = this._toX(e.offsetX);
                const y = this._toY(e.offsetY);
                const ev = IO.makeMouseEvent(e, x, y);
                fn(ev);
            };
        } else {
            this.node.onclick = null;
        }
    }

    set onmousemove(fn: EventFn | null) {
        if (fn) {
            this.node.onmousemove = (e: MouseEvent) => {
                const x = this._toX(e.offsetX);
                const y = this._toY(e.offsetY);
                if (x == this.mouse.x && y == this.mouse.y) return;
                this.mouse.x = x;
                this.mouse.y = y;
                const ev = IO.makeMouseEvent(e, x, y);
                fn(ev);
            };
        } else {
            this.node.onmousemove = null;
        }
    }

    set onmouseup(fn: EventFn | null) {
        if (fn) {
            this.node.onmouseup = (e: MouseEvent) => {
                const x = this._toX(e.offsetX);
                const y = this._toY(e.offsetY);
                const ev = IO.makeMouseEvent(e, x, y);
                fn(ev);
            };
        } else {
            this.node.onmouseup = null;
        }
    }

    set onkeydown(fn: EventFn | null) {
        if (fn) {
            this.node.onkeydown = (e: KeyboardEvent) => {
                e.stopPropagation();
                const ev = IO.makeKeyEvent(e);
                fn(ev);
            };
        } else {
            this.node.onkeydown = null;
        }
    }

    protected _toX(offsetX: number) {
        return Utils.clamp(
            Math.floor(this.width * (offsetX / this.node.clientWidth)),
            0,
            this.width - 1
        );
    }

    protected _toY(offsetY: number) {
        return Utils.clamp(
            Math.floor(this.height * (offsetY / this.node.clientHeight)),
            0,
            this.height - 1
        );
    }
}

export class Canvas2D extends BaseCanvas {
    private _ctx!: CanvasRenderingContext2D;
    private _changed!: Int8Array;

    constructor(width: number, height: number, glyphs: Glyphs) {
        super(width, height, glyphs);
    }

    protected _createContext() {
        const ctx = this.node.getContext('2d');
        if (!ctx) {
            throw new NotSupportedError('2d context not supported!');
        }
        this._ctx = ctx;
    }

    // protected _set(x: number, y: number, style: number) {
    //     const result = super._set(x, y, style);
    //     if (result) {
    //         this._changed[y * this.width + x] = 1;
    //     }
    //     return result;
    // }

    resize(width: number, height: number) {
        super.resize(width, height);
        this._data = new Uint32Array(width * height);
        this._changed = new Int8Array(width * height);
    }

    draw(data: DataBuffer): boolean {
        // TODO - Remove?
        if (data._data.every((style, i) => style === this._data[i]))
            return false;
        data.changed = false;
        let changed = false;
        const src = data._data;
        const raw = this._data;
        for (let i = 0; i < raw.length; ++i) {
            if (raw[i] !== src[i]) {
                raw[i] = src[i];
                this._changed[i] = 1;
                changed = true;
            }
        }
        if (!changed) return false;
        this.buffer.changed = true;
        this._requestRender();
        return true;
    }

    _render() {
        this._renderRequested = false;
        for (let i = 0; i < this._changed.length; ++i) {
            if (this._changed[i]) this._renderCell(i);
            this._changed[i] = 0;
        }
        this.buffer.changed = false;
    }

    protected _renderCell(index: number) {
        const x = index % this.width;
        const y = Math.floor(index / this.width);

        const style = this._data[index];
        const glyph = (style / (1 << 24)) >> 0;
        const bg = (style >> 12) & 0xfff;
        const fg = style & 0xfff;

        const px = x * this.tileWidth;
        const py = y * this.tileHeight;

        const gx = (glyph % 16) * this.tileWidth;
        const gy = Math.floor(glyph / 16) * this.tileHeight;

        const d = this.glyphs.ctx.getImageData(
            gx,
            gy,
            this.tileWidth,
            this.tileHeight
        );
        for (let di = 0; di < d.width * d.height; ++di) {
            const pct = d.data[di * 4] / 255;
            const inv = 1.0 - pct;
            d.data[di * 4 + 0] =
                pct * (((fg & 0xf00) >> 8) * 17) +
                inv * (((bg & 0xf00) >> 8) * 17);
            d.data[di * 4 + 1] =
                pct * (((fg & 0xf0) >> 4) * 17) +
                inv * (((bg & 0xf0) >> 4) * 17);
            d.data[di * 4 + 2] =
                pct * ((fg & 0xf) * 17) + inv * ((bg & 0xf) * 17);
            d.data[di * 4 + 3] = 255; // not transparent anymore
        }
        this._ctx.putImageData(d, px, py);
    }
}

// export function withImage(image: ImageOptions | HTMLImageElement | string) {
//     let opts = {} as CanvasOptions;
//     if (typeof image === 'string') {
//         opts.glyphs = Glyphs.fromImage(image);
//     } else if (image instanceof HTMLImageElement) {
//         opts.glyphs = Glyphs.fromImage(image);
//     } else {
//         if (!image.image) throw new Error('You must supply the image.');
//         Object.assign(opts, image);
//         opts.glyphs = Glyphs.fromImage(image.image);
//     }

//     let canvas;
//     try {
//         canvas = new Canvas(opts);
//     } catch (e) {
//         if (!(e instanceof NotSupportedError)) throw e;
//     }

//     if (!canvas) {
//         canvas = new Canvas2D(opts);
//     }

//     return canvas;
// }

// export function withFont(src: FontOptions | string) {
//     if (typeof src === 'string') {
//         src = { font: src } as FontOptions;
//     }
//     src.glyphs = Glyphs.fromFont(src);
//     let canvas;
//     try {
//         canvas = new Canvas(src);
//     } catch (e) {
//         if (!(e instanceof NotSupportedError)) throw e;
//     }

//     if (!canvas) {
//         canvas = new Canvas2D(src);
//     }

//     return canvas;
// }
