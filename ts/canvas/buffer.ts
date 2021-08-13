import { Mixer, DrawInfo } from '../sprite/mixer';
import * as Color from '../color';
import * as Text from '../text';

export interface DrawData {
    glyph: number;
    fg: number;
    bg: number;
}

export interface BufferTarget {
    readonly width: number;
    readonly height: number;
    // draw(
    //     x: number,
    //     y: number,
    //     glyph: number,
    //     fg: number,
    //     bg: number
    // ): DrawTarget;
    copyTo(dest: Uint32Array): void;
    copy(src: Uint32Array): void;
    toGlyph(ch: string | number): number;
}

export class DataBuffer {
    protected _data: Uint32Array;
    private _width: number;
    private _height: number;

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
        this._data = new Uint32Array(width * height);
    }

    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }

    resize(width: number, height: number) {
        const orig = this._data;
        this._width = width;
        this._height = height;

        if (orig.length < width * height) {
            this._data = new Uint32Array(width * height);
            this._data.set(orig, 0);
        } else {
            this._data = orig.slice(width * height);
        }
    }

    get(x: number, y: number): DrawData {
        let index = y * this.width + x;
        const style = this._data[index] || 0;
        const glyph = style >> 24;
        const bg = (style >> 12) & 0xfff;
        const fg = style & 0xfff;
        return { glyph, fg, bg };
    }

    toGlyph(ch: string | number) {
        if (typeof ch === 'number') return ch;
        if (!ch || !ch.length) return -1; // 0 handled elsewhere
        return ch.charCodeAt(0);
    }

    draw(
        x: number,
        y: number,
        glyph: number | string = -1,
        fg: Color.ColorBase = -1, // TODO - White?
        bg: Color.ColorBase = -1 // TODO - Black?
    ) {
        let index = y * this.width + x;
        const current = this._data[index] || 0;

        if (typeof glyph !== 'number') {
            glyph = this.toGlyph(glyph);
        }
        if (typeof fg !== 'number') {
            fg = Color.from(fg).toInt();
        }
        if (typeof bg !== 'number') {
            bg = Color.from(bg).toInt();
        }
        glyph = glyph >= 0 ? glyph & 0xff : current >> 24;
        bg = bg >= 0 ? bg & 0xfff : (current >> 12) & 0xfff;
        fg = fg >= 0 ? fg & 0xfff : current & 0xfff;
        const style = (glyph << 24) + (bg << 12) + fg;
        this._data[index] = style;
        return this;
    }

    // This is without opacity - opacity must be done in Mixer
    drawSprite(x: number, y: number, sprite: Partial<DrawInfo>) {
        const ch = sprite.ch === null ? -1 : sprite.ch;
        const fg = sprite.fg === null ? -1 : sprite.fg;
        const bg = sprite.bg === null ? -1 : sprite.bg;
        return this.draw(x, y, ch, fg, bg);
    }

    blackOut(x: number, y: number): void;
    blackOut(): void;
    blackOut(...args: number[]) {
        if (args.length == 0) {
            return this.fill(0, 0, 0);
        }
        return this.draw(args[0], args[1], 0, 0, 0);
    }

    fill(glyph: number | string = 0, fg: number = 0xfff, bg: number = 0) {
        if (typeof glyph == 'string') {
            glyph = this.toGlyph(glyph);
        }
        glyph = glyph & 0xff;
        fg = fg & 0xfff;
        bg = bg & 0xfff;
        const style = (glyph << 24) + (bg << 12) + fg;
        this._data.fill(style);
        return this;
    }

    copy(other: DataBuffer) {
        this._data.set(other._data);
        return this;
    }

    drawText(
        x: number,
        y: number,
        text: string,
        fg: Color.ColorBase = 0xfff,
        bg: Color.ColorBase = -1
    ) {
        if (typeof fg !== 'number') fg = Color.from(fg);
        if (typeof bg !== 'number') bg = Color.from(bg);

        Text.eachChar(
            text,
            (ch, fg0, bg0, i) => {
                if (x + i >= this.width) return;
                this.draw(i + x, y, ch, fg0, bg0);
            },
            fg,
            bg
        );
        return ++y;
    }

    wrapText(
        x: number,
        y: number,
        width: number,
        text: string,
        fg: Color.Color | number | string = 0xfff,
        bg: Color.Color | number | string = -1,
        indent = 0
    ) {
        if (typeof fg !== 'number') fg = Color.from(fg);
        if (typeof bg !== 'number') bg = Color.from(bg);

        width = Math.min(width, this.width - x);
        text = Text.wordWrap(text, width, indent);

        let xi = x;
        Text.eachChar(
            text,
            (ch, fg0, bg0) => {
                if (ch == '\n') {
                    while (xi < x + width) {
                        this.draw(xi++, y, 0, 0x000, bg0);
                    }
                    ++y;
                    xi = x + indent;
                    return;
                }
                this.draw(xi++, y, ch, fg0, bg0);
            },
            fg,
            bg
        );

        while (xi < x + width) {
            this.draw(xi++, y, 0, 0x000, bg);
        }

        return ++y;
    }

    fillRect(
        x: number,
        y: number,
        w: number,
        h: number,
        ch: string | number | null = -1,
        fg: Color.ColorBase | null = -1,
        bg: Color.ColorBase | null = -1
    ) {
        if (ch === null) ch = -1;
        if (typeof ch !== 'number') ch = this.toGlyph(ch);
        if (typeof fg !== 'number') fg = Color.from(fg).toInt();
        if (typeof bg !== 'number') bg = Color.from(bg).toInt();

        for (let i = x; i < x + w; ++i) {
            for (let j = y; j < y + h; ++j) {
                this.draw(i, j, ch, fg, bg);
            }
        }
        return this;
    }

    blackOutRect(
        x: number,
        y: number,
        w: number,
        h: number,
        bg: Color.ColorBase = 0
    ) {
        if (typeof bg !== 'number') bg = Color.from(bg);
        return this.fillRect(x, y, w, h, 0, 0, bg);
    }

    highlight(x: number, y: number, color: Color.ColorBase, strength: number) {
        if (typeof color !== 'number') {
            color = Color.from(color);
        }
        const mixer = new Mixer();
        const data = this.get(x, y);
        mixer.drawSprite(data);
        mixer.fg.add(color, strength);
        mixer.bg.add(color, strength);
        this.drawSprite(x, y, mixer);
        return this;
    }

    mix(color: Color.ColorBase, percent: number) {
        if (typeof color !== 'number') color = Color.from(color);
        const mixer = new Mixer();
        for (let x = 0; x < this.width; ++x) {
            for (let y = 0; y < this.height; ++y) {
                const data = this.get(x, y);
                mixer.drawSprite(data);
                mixer.fg.mix(color, percent);
                mixer.bg.mix(color, percent);
                this.drawSprite(x, y, mixer);
            }
        }
        return this;
    }

    dump() {
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
                const glyph = data.glyph;
                line += String.fromCharCode(glyph || 32);
            }
            data.push(line);
        }
        console.log(data.join('\n'));
    }
}

export function makeDataBuffer(width: number, height: number) {
    return new DataBuffer(width, height);
}

export class Buffer extends DataBuffer {
    private _target: BufferTarget;

    constructor(canvas: BufferTarget) {
        super(canvas.width, canvas.height);
        this._target = canvas;
        canvas.copyTo(this._data);
    }

    // get canvas() { return this._target; }

    toGlyph(ch: string | number) {
        return this._target.toGlyph(ch);
    }

    render() {
        this._target.copy(this._data);
        return this;
    }

    load() {
        this._target.copyTo(this._data);
        return this;
    }
}

// Make.buffer = function (canvas: BufferTarget) {
//     return new Buffer(canvas);
// };

export function makeBuffer(width: number, height: number): DataBuffer;
export function makeBuffer(canvas: BufferTarget): Buffer;
export function makeBuffer(...args: any[]): Buffer | DataBuffer {
    if (args.length == 1) {
        return new Buffer(args[0]);
    }
    return new DataBuffer(args[0], args[1]);
}
