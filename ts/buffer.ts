import { Mixer, DrawInfo } from './sprite/mixer.js';
import * as Color from './color/index.js';
import * as Text from './text/index.js';
import { Bounds } from './xy.js';

export interface DrawData {
    glyph: number;
    fg: number;
    bg: number;
}

export abstract class BufferBase {
    _width!: number;
    _height!: number;
    _clip: Bounds | null = null;

    constructor(opts: { width: number; height: number });
    constructor(width: number, height: number);
    constructor(
        width: number | { width: number; height: number },
        height?: number
    ) {
        if (typeof width !== 'number') {
            height = width.height;
            width = width.width;
        }
        this._width = width;
        this._height = height!;
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

    abstract get(x: number, y: number): DrawInfo;

    abstract draw(
        x: number,
        y: number,
        glyph?: string | null,
        fg?: Color.ColorBase, // TODO - White?
        bg?: Color.ColorBase // TODO - Black?
    ): this;

    abstract set(
        x: number,
        y: number,
        glyph?: string | null,
        fg?: Color.ColorBase, // TODO - White?
        bg?: Color.ColorBase // TODO - Black?
    ): this;

    abstract nullify(x: number, y: number): void;
    abstract nullify(): void;

    abstract dump(): void;

    // This is without opacity - opacity must be done in Mixer
    drawSprite(x: number, y: number, sprite: Partial<DrawInfo>): this {
        const ch = sprite.ch;
        const fg = sprite.fg;
        const bg = sprite.bg;
        return this.draw(x, y, ch, fg, bg);
    }

    blackOut(x: number, y: number): void;
    blackOut(): void;
    blackOut(...args: number[]) {
        if (args.length == 0) {
            return this.fill(' ', 0, 0);
        }
        return this.draw(args[0], args[1], ' ', 0, 0);
    }

    fill(color: Color.ColorBase): this;
    fill(
        glyph?: string | null,
        fg?: Color.ColorBase,
        bg?: Color.ColorBase
    ): this;
    fill(
        glyph: string | null | Color.ColorBase = ' ',
        fg: Color.ColorBase = 0xfff,
        bg: Color.ColorBase = 0
    ): this {
        if (arguments.length == 1) {
            bg = Color.from(glyph);
            glyph = null;
            fg = bg;
        }
        return this.fillRect(
            0,
            0,
            this.width,
            this.height,
            glyph as string | null,
            fg,
            bg
        );
    }

    drawText(
        x: number,
        y: number,
        text: string,
        fg: Color.ColorBase = 0xfff,
        bg: Color.ColorBase = null,
        maxWidth = 0,
        align: Text.Align = 'left'
    ): number {
        // if (!this.hasXY(x, y)) return 0;

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
        bg: Color.ColorBase = null,
        indent = 0 // TODO - convert to WrapOptions
    ): number {
        // if (!this.hasXY(x, y)) return 0;

        fg = Color.from(fg);
        bg = Color.from(bg);

        width = Math.min(width, this.width - x);
        text = Text.wordWrap(text, width, { indent });

        let lineCount = 0;
        let xi = x;
        Text.eachChar(
            text,
            (ch, fg0, bg0) => {
                if (ch == '\n') {
                    while (xi < x + width) {
                        this.draw(xi++, y + lineCount, ' ', 0x000, bg0);
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
            this.draw(xi++, y + lineCount, ' ', 0x000, bg);
        }

        return lineCount + 1;
    }

    fillBounds(
        bounds: Bounds,
        ch: string | null = null,
        fg: Color.ColorBase = null,
        bg: Color.ColorBase = null
    ): this {
        return this.fillRect(
            bounds.x,
            bounds.y,
            bounds.width,
            bounds.height,
            ch,
            fg,
            bg
        );
    }

    fillRect(
        x: number,
        y: number,
        w: number,
        h: number,
        ch: string | null = null,
        fg: Color.ColorBase = null,
        bg: Color.ColorBase = null
    ): this {
        fg = fg !== null ? Color.from(fg) : null;
        bg = bg !== null ? Color.from(bg) : null;

        const xw = Math.min(x + w, this.width);
        const yh = Math.min(y + h, this.height);
        for (let i = x; i < xw; ++i) {
            for (let j = y; j < yh; ++j) {
                this.set(i, j, ch, fg, bg);
            }
        }
        return this;
    }

    drawLineH(
        x: number,
        y: number,
        w: number,
        ch: string,
        fg: Color.ColorBase,
        bg: Color.ColorBase = null
    ) {
        for (let dx = 0; dx < w; ++dx) {
            this.draw(x + dx, y, ch, fg, bg);
        }
    }

    drawLineV(
        x: number,
        y: number,
        h: number,
        ch: string,
        fg: Color.ColorBase,
        bg: Color.ColorBase = null
    ) {
        for (let dy = 0; dy < h; ++dy) {
            this.draw(x, y + dy, ch, fg, bg);
        }
    }

    drawProgress(
        x: number,
        y: number,
        w: number,
        fg: Color.ColorBase,
        bg: Color.ColorBase,
        val: number,
        max: number,
        text = ''
    ) {
        const pct = val / max;
        const full = Math.floor(w * pct);
        const partialPct = Math.floor(100 * (w * pct - full));

        this.fillRect(x, y, full, 1, null, null, bg);
        this.draw(x + full, y, null, null, Color.from(bg).alpha(partialPct));

        if (text && text.length) {
            this.drawText(x, y, text, fg, null, w, 'center');
        }
    }

    blackOutBounds(bounds: Bounds, bg: Color.ColorBase = 0): this {
        return this.blackOutRect(
            bounds.x,
            bounds.y,
            bounds.width,
            bounds.height,
            bg
        );
    }

    blackOutRect(
        x: number,
        y: number,
        w: number,
        h: number,
        bg: Color.ColorBase = 'black'
    ): this {
        bg = Color.from(bg);
        return this.fillRect(x, y, w, h, ' ', bg, bg);
    }

    highlight(
        x: number,
        y: number,
        color: Color.ColorBase,
        strength: number = 50
    ): this {
        if (!this.hasXY(x, y)) return this;

        color = Color.from(color);
        const mixer = new Mixer();
        const data = this.get(x, y);
        mixer.drawSprite(data);
        mixer.fg = mixer.fg.add(color, strength);
        mixer.bg = mixer.bg.add(color, strength);
        this.drawSprite(x, y, mixer);
        return this;
    }

    invert(x: number, y: number): this {
        if (!this.hasXY(x, y)) return this;
        const data = this.get(x, y);
        if (data.fg == data.bg) {
            this.draw(x, y, data.ch, data.bg, Color.from(data.fg).inverse());
        } else {
            this.draw(x, y, data.ch, data.bg, data.fg);
        }

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
        if (color.isNull()) return this;
        const mixer = new Mixer();

        if (!width) width = x ? 1 : this.width;
        if (!height) height = y ? 1 : this.height;

        const endX = Math.min(width + x, this.width);
        const endY = Math.min(height + y, this.height);

        for (let i = x; i < endX; ++i) {
            for (let j = y; j < endY; ++j) {
                const data = this.get(i, j);
                mixer.drawSprite(data);
                mixer.fg = mixer.fg.mix(color, percent);
                mixer.bg = mixer.bg.mix(color, percent);
                this.drawSprite(i, j, mixer);
            }
        }
        return this;
    }

    blend(color: Color.ColorBase): this;
    blend(color: Color.ColorBase, x: number, y: number): this;
    blend(
        color: Color.ColorBase,
        x: number,
        y: number,
        width: number,
        height: number
    ): this;
    blend(color: Color.ColorBase, x = 0, y = 0, width = 0, height = 0): this {
        color = Color.from(color);
        if (color.isNull()) return this;
        const mixer = new Mixer();

        if (!width) width = x ? 1 : this.width;
        if (!height) height = y ? 1 : this.height;

        const endX = Math.min(width + x, this.width);
        const endY = Math.min(height + y, this.height);

        for (let i = x; i < endX; ++i) {
            for (let j = y; j < endY; ++j) {
                const data = this.get(i, j);
                mixer.drawSprite(data);
                mixer.fg = mixer.fg.blend(color);
                mixer.bg = mixer.bg.blend(color);
                this.drawSprite(i, j, mixer);
            }
        }
        return this;
    }

    setClip(bounds: Bounds): this;
    setClip(x: number, y: number, width: number, height: number): this;
    setClip(...args: any[]): this {
        if (args.length == 1) {
            this._clip = args[0].clone();
            return this;
        }

        this._clip = new Bounds(args[0], args[1], args[2], args[3]);
        return this;
    }

    clearClip(): this {
        this._clip = null;
        return this;
    }
}

export class Buffer extends BufferBase {
    _data: Mixer[];
    changed = false;

    constructor(opts: { width: number; height: number });
    constructor(width: number, height: number);
    constructor(...args: any[]) {
        super(args[0], args[1]);
        this._data = [];
        this.resize(this._width, this._height!);
    }

    clone(): this {
        const other = new (<new (w: number, h: number) => this>(
            this.constructor
        ))(this._width, this._height);
        other.copy(this);
        return other;
    }

    resize(width: number, height: number): void {
        if (this._data.length === width * height) return;

        this._width = width;
        this._height = height;
        while (this._data.length < width * height) {
            this._data.push(new Mixer());
        }
        this._data.length = width * height; // truncate if was too large
        this.changed = true;
    }

    _index(x: number, y: number): number {
        return y * this.width + x;
    }

    get(x: number, y: number): Mixer {
        if (!this.hasXY(x, y)) {
            throw new Error(`Invalid loc - ${x},${y}`);
        }

        let index = y * this.width + x;
        return this._data[index];
    }

    set(
        x: number,
        y: number,
        ch: string | null = null,
        fg: Color.ColorBase | null = null,
        bg: Color.ColorBase | null = null
    ): this {
        if (this._clip && !this._clip.contains(x, y)) return this;
        const m = this.get(x, y);
        m.fill(ch, fg, bg);
        return this;
    }

    info(x: number, y: number) {
        if (!this.hasXY(x, y)) {
            throw new Error(`Invalid loc - ${x},${y}`);
        }

        let index = y * this.width + x;
        const m = this._data[index];
        return {
            ch: m.ch,
            fg: m.fg.toInt(),
            bg: m.bg.toInt(),
        };
    }

    copy(other: Buffer): this {
        this._data.forEach((m, i) => {
            m.copy(other._data[i]);
        });
        this.changed = true;
        this._clip = other._clip ? other._clip.clone() : null;
        return this;
    }

    apply(other: Buffer): this {
        if (this._clip) {
            this._clip.forEach((x, y) => {
                const me = this.get(x, y);
                const you = other.get(x, y);
                me.drawSprite(you);
            });
            return this;
        }

        this._data.forEach((m, i) => {
            m.drawSprite(other._data[i]);
        });
        this.changed = true;
        return this;
    }

    // toGlyph(ch: string | number): number {
    //     if (typeof ch === 'number') return ch;
    //     if (!ch || !ch.length) return -1; // 0 handled elsewhere
    //     return ch.charCodeAt(0);
    // }

    draw(
        x: number,
        y: number,
        glyph: string | null = null,
        fg: Color.ColorBase = null, // TODO - White?
        bg: Color.ColorBase = null // TODO - Black?
    ): this {
        if (this._clip && !this._clip.contains(x, y)) return this;
        let index = y * this.width + x;
        const current = this._data[index];
        current.draw(glyph, fg, bg);
        this.changed = true;
        return this;
    }

    nullify(x: number, y: number): void;
    nullify(): void;
    nullify(...args: number[]) {
        if (args.length == 0) {
            if (this._clip) {
                this._clip.forEach((x, y) => {
                    this.nullify(x, y);
                });
            } else {
                this._data.forEach((d) => d.nullify());
            }
        } else {
            if (this._clip && !this._clip.contains(args[0], args[1]))
                return this;

            this.get(args[0], args[1]).nullify();
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
}

export function make(opts: { width: number; height: number }): Buffer;
export function make(width: number, height: number): Buffer;
export function make(...args: any[]): Buffer {
    return new Buffer(args[0], args[1]);
}
