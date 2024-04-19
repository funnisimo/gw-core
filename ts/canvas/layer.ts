import { Canvas, VERTICES_PER_TILE } from './canvas.js';
import { BufferTarget } from './buffer.js';
import { Buffer, BufferBase } from '../buffer.js';
import { DrawInfo } from '../sprite/mixer.js';
import * as Color from '../color/index.js';

export class Layer extends BufferBase implements BufferTarget {
    canvas: Canvas;

    fg!: Uint16Array;
    bg!: Uint16Array;
    glyph!: Uint8Array;

    _depth: number;
    _empty = true;

    constructor(canvas: Canvas, depth = 0) {
        super(canvas.width, canvas.height);
        this.canvas = canvas;
        this.resize(canvas.width, canvas.height);
        this._depth = depth;
    }

    get width(): number {
        return this.canvas.width;
    }
    get height(): number {
        return this.canvas.height;
    }
    get depth(): number {
        return this._depth;
    }
    get empty(): boolean {
        return this._empty;
    }

    detach() {
        // @ts-ignore
        this.canvas = null;
    }

    resize(width: number, height: number) {
        const size = width * height * VERTICES_PER_TILE;
        if (!this.fg || this.fg.length !== size) {
            this.fg = new Uint16Array(size);
            this.bg = new Uint16Array(size);
            this.glyph = new Uint8Array(size);
        }
    }

    clear() {
        this.fg.fill(0);
        this.bg.fill(0);
        this.glyph.fill(0);
        this._empty = true;
    }

    get(x: number, y: number): DrawInfo {
        const index = x * y * VERTICES_PER_TILE;

        return {
            ch: this.fromGlyph(this.glyph[index]),
            fg: this.fg[index],
            bg: this.bg[index],
        };
    }

    set(
        x: number,
        y: number,
        glyph: string | null = null,
        fg: number | Color.ColorVals = 0xfff,
        bg: number | Color.ColorVals = -1
    ): this {
        return this.draw(x, y, glyph, fg, bg);
    }

    draw(
        x: number,
        y: number,
        glyph: string | number | null = null,
        fg: Color.ColorBase = 0xfff,
        bg: Color.ColorBase = -1
    ): this {
        const index = x + y * this.canvas.width;
        if (typeof glyph === 'string') {
            glyph = this.toGlyph(glyph);
        } else if (glyph === null) {
            glyph = this.glyph[index];
        }

        fg = Color.from(fg).toInt();
        bg = Color.from(bg).toInt();

        this._set(index, glyph, fg, bg);
        if (glyph || bg || fg) {
            this._empty = false;
            this.canvas._requestRender();
        }
        return this;
    }

    _set(index: number, glyph: number, fg: number, bg: number): void {
        index *= VERTICES_PER_TILE;
        glyph = glyph & 0xff;
        bg = bg & 0xffff;
        fg = fg & 0xffff;

        for (let i = 0; i < VERTICES_PER_TILE; ++i) {
            this.glyph[index + i] = glyph;
            this.fg[index + i] = fg;
            this.bg[index + i] = bg;
        }
    }

    nullify(x: number, y: number): void;
    nullify(): void;
    nullify(...args: number[]) {
        if (args.length === 2) {
            this._set(args[0] * args[1], 0, 0, 0);
        } else {
            this.glyph.fill(0);
            this.fg.fill(0);
            this.bg.fill(0);
        }
    }

    dump(): void {
        const data = [];
        let header = '    ';
        for (let x = 0; x < this.width; ++x) {
            if (x % 10 == 0) header += ' ';
            header += x % 10;
        }
        data.push(header);
        data.push('');

        for (let y = 0; y < this.height; ++y) {
            let line = `${('' + y).padStart(2)}] `;
            for (let x = 0; x < this.width; ++x) {
                if (x % 10 == 0) line += ' ';
                const data = this.get(x, y);
                let glyph = data.ch;
                if (glyph === null) glyph = ' ';
                line += glyph;
            }
            data.push(line);
        }
        console.log(data.join('\n'));
    }

    copy(buffer: Buffer) {
        if (buffer.width !== this.width || buffer.height !== this.height) {
            console.log('auto resizing buffer');
            buffer.resize(this.width, this.height);
        }
        if (!this.canvas) {
            throw new Error('Layer is detached.  Did you resize the canvas?');
        }

        buffer._data.forEach((mixer, i) => {
            let glyph = mixer.ch ? this.canvas.glyphs.forChar(mixer.ch) : 0;
            this._set(i, glyph, mixer.fg.toInt(), mixer.bg.toInt());
        });
        this._empty = false;
        this.canvas._requestRender();
    }

    copyTo(buffer: Buffer) {
        buffer.resize(this.width, this.height);
        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                const index = (x + y * this.width) * VERTICES_PER_TILE;
                buffer.draw(
                    x,
                    y,
                    this.toChar(this.glyph[index]),
                    this.fg[index],
                    this.bg[index]
                );
            }
        }
    }

    toGlyph(ch: string): number {
        return this.canvas.glyphs.forChar(ch);
    }

    fromGlyph(n: number): string {
        return this.canvas.glyphs.toChar(n);
    }

    toChar(n: number): string {
        return this.canvas.glyphs.toChar(n);
    }
}
