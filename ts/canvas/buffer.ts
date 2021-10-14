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
    copyTo(dest: DataBuffer): void;
    draw(src: DataBuffer): void;
    toGlyph(ch: string | number): number;
}

export class DataBuffer {
    _data: Uint32Array;
    protected _width: number;
    protected _height: number;
    changed = false;

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
        this._data = this._makeData();
    }

    protected _makeData(): Uint32Array {
        return new Uint32Array(this.width * this.height);
    }

    get width(): number {
        return this._width;
    }
    get height(): number {
        return this._height;
    }

    hasXY(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    clone(): DataBuffer {
        const other = new DataBuffer(this._width, this._height);
        other.copy(this);
        return other;
    }

    resize(width: number, height: number): void {
        const orig = this._data;
        this._width = width;
        this._height = height;

        if (orig.length < width * height) {
            this._data = new Uint32Array(width * height);
            this._data.set(orig, 0);
        } else {
            this._data = orig.slice(width * height);
        }
        this.changed = true;
    }

    protected _index(x: number, y: number): number {
        return y * this.width + x;
    }

    get(x: number, y: number): number {
        if (!this.hasXY(x, y)) return 0;

        let index = this._index(x, y);
        return this._data[index] || 0;
    }

    info(x: number, y: number): DrawData {
        const style = this.get(x, y);
        const glyph = style >> 24;
        const bg = (style >> 12) & 0xfff;
        const fg = style & 0xfff;
        return { glyph, fg, bg };
    }

    set(x: number, y: number, style: number) {
        if (!this.hasXY(x, y)) return;
        let index = this._index(x, y);
        const current = this._data[index];
        if (current !== style) {
            this._data[index] = style;
            return true;
        }
        return false;
    }

    toGlyph(ch: string | number): number {
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
    ): this {
        if (!this.hasXY(x, y)) return this;

        const current = this.get(x, y);

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
        this.set(x, y, style);
        if (style !== current) this.changed = true;
        return this;
    }

    // This is without opacity - opacity must be done in Mixer
    drawSprite(x: number, y: number, sprite: Partial<DrawInfo>): this {
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

    fill(color: Color.ColorBase): this;
    fill(
        glyph?: number | string,
        fg?: Color.ColorBase,
        bg?: Color.ColorBase
    ): this;
    fill(
        glyph: number | string | Color.ColorBase = 0,
        fg: Color.ColorBase = 0xfff,
        bg: Color.ColorBase = 0
    ): this {
        if (arguments.length == 1) {
            bg = Color.from(glyph).toInt();
            glyph = 0;
            fg = 0;
        } else {
            if (typeof glyph !== 'number') {
                if (typeof glyph === 'string') {
                    glyph = this.toGlyph(glyph);
                } else {
                    throw new Error('glyph must be number or char');
                }
            }
            if (typeof fg !== 'number') {
                fg = Color.from(fg).toInt();
            }
            if (typeof bg !== 'number') {
                bg = Color.from(bg).toInt();
            }
        }
        glyph = glyph & 0xff;
        fg = fg & 0xfff;
        bg = bg & 0xfff;
        const style = (glyph << 24) + (bg << 12) + fg;
        this._data.fill(style);
        this.changed = true;

        return this;
    }

    copy(other: DataBuffer): this {
        this._width = other._width;
        this._height = other._height;
        this._data.set(other._data);
        this.changed = true;
        return this;
    }

    drawText(
        x: number,
        y: number,
        text: string,
        fg: Color.ColorBase = 0xfff,
        bg: Color.ColorBase = -1,
        maxWidth = 0,
        align: Text.Align = 'left'
    ): number {
        if (!this.hasXY(x, y)) return 0;

        if (typeof fg !== 'number') fg = Color.from(fg);
        if (typeof bg !== 'number') bg = Color.from(bg);
        maxWidth = Math.min(maxWidth || this.width, this.width - x);

        if (align == 'right') {
            const len = Text.length(text);
            x += maxWidth - len;
        } else if (align == 'center') {
            const len = Text.length(text);
            x += Math.floor((maxWidth - len) / 2);
        }

        Text.eachChar(
            text,
            (ch, fg0, bg0, i) => {
                if (x + i >= this.width || i >= maxWidth) return;
                this.draw(i + x, y, ch, fg0, bg0);
            },
            { fg, bg }
        );
        return 1; // used 1 line
    }

    wrapText(
        x: number,
        y: number,
        width: number,
        text: string,
        fg: Color.ColorBase = 0xfff,
        bg: Color.ColorBase = -1,
        indent = 0
    ): number {
        if (!this.hasXY(x, y)) return 0;

        if (typeof fg !== 'number') fg = Color.from(fg);
        if (typeof bg !== 'number') bg = Color.from(bg);

        width = Math.min(width, this.width - x);
        text = Text.wordWrap(text, width, indent);

        let lineCount = 0;
        let xi = x;
        Text.eachChar(
            text,
            (ch, fg0, bg0) => {
                if (ch == '\n') {
                    while (xi < x + width) {
                        this.draw(xi++, y + lineCount, 0, 0x000, bg0);
                    }
                    ++lineCount;
                    xi = x + indent;
                    return;
                }
                this.draw(xi++, y + lineCount, ch, fg0, bg0);
            },
            { fg, bg }
        );

        while (xi < x + width) {
            this.draw(xi++, y + lineCount, 0, 0x000, bg);
        }

        return lineCount + 1;
    }

    fillRect(
        x: number,
        y: number,
        w: number,
        h: number,
        ch: string | number | null = -1,
        fg: Color.ColorBase | null = -1,
        bg: Color.ColorBase | null = -1
    ): this {
        if (ch === null) ch = -1;
        if (typeof ch !== 'number') ch = this.toGlyph(ch);
        if (typeof fg !== 'number') fg = Color.from(fg).toInt();
        if (typeof bg !== 'number') bg = Color.from(bg).toInt();

        const xw = Math.min(x + w, this.width);
        const yh = Math.min(y + h, this.height);
        for (let i = x; i < xw; ++i) {
            for (let j = y; j < yh; ++j) {
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
    ): this {
        if (typeof bg !== 'number') bg = Color.from(bg);
        return this.fillRect(x, y, w, h, 0, bg, bg);
    }

    highlight(
        x: number,
        y: number,
        color: Color.ColorBase,
        strength: number
    ): this {
        if (!this.hasXY(x, y)) return this;

        if (typeof color !== 'number') {
            color = Color.from(color);
        }
        const mixer = new Mixer();
        const data = this.info(x, y);
        mixer.drawSprite(data);
        mixer.fg.add(color, strength);
        mixer.bg.add(color, strength);
        this.drawSprite(x, y, mixer);
        return this;
    }

    mix(color: Color.ColorBase, percent: number): this;
    mix(color: Color.ColorBase, percent: number, x: number, y: number): this;
    mix(
        color: Color.ColorBase,
        percent: number,
        x: number,
        y: number,
        width: number,
        height: number
    ): this;
    mix(
        color: Color.ColorBase,
        percent: number,
        x = 0,
        y = 0,
        width = 0,
        height = 0
    ): this {
        color = Color.from(color);
        const mixer = new Mixer();

        if (!width) width = x ? 1 : this.width;
        if (!height) height = y ? 1 : this.height;

        const endX = Math.min(width + x, this.width);
        const endY = Math.min(height + y, this.height);

        for (let i = x; i < endX; ++i) {
            for (let j = y; j < endY; ++j) {
                const data = this.info(i, j);
                mixer.drawSprite(data);
                mixer.fg.mix(color, percent);
                mixer.bg.mix(color, percent);
                this.drawSprite(i, j, mixer);
            }
        }
        return this;
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
                const data = this.info(x, y);
                const glyph = data.glyph;
                line += String.fromCharCode(glyph || 32);
            }
            data.push(line);
        }
        console.log(data.join('\n'));
    }
}

export class Buffer extends DataBuffer {
    private _target: BufferTarget;

    constructor(canvas: BufferTarget) {
        super(canvas.width, canvas.height);
        this._target = canvas;
        canvas.copyTo(this);
    }

    // get canvas() { return this._target; }

    clone(): this {
        const other = new (<new (canvas: BufferTarget) => this>(
            this.constructor
        ))(this._target);
        other.copy(this);
        return other;
    }

    toGlyph(ch: string | number) {
        return this._target.toGlyph(ch);
    }

    render() {
        this._target.draw(this);
        return this;
    }

    load() {
        this._target.copyTo(this);
        return this;
    }
}
