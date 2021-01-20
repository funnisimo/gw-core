import { Mixer } from "./canvas/mixer";
import * as Color from "./color";
import * as Text from "./text/index";
export class DataBuffer {
    constructor(width, height) {
        this._width = width;
        this._height = height;
        this._data = new Uint32Array(width * height);
    }
    get data() {
        return this._data;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get(x, y) {
        let index = y * this.width + x;
        const style = this._data[index] || 0;
        const ch = style >> 24;
        const bg = (style >> 12) & 0xfff;
        const fg = style & 0xfff;
        return { ch, fg, bg };
    }
    _toGlyph(ch) {
        if (!ch)
            return -1; // 0 handled elsewhere
        return ch.charCodeAt(0);
    }
    draw(x, y, glyph = -1, fg = -1, // TODO - White?
    bg = -1 // TODO - Black?
    ) {
        let index = y * this.width + x;
        const current = this._data[index] || 0;
        if (typeof glyph !== "number") {
            glyph = this._toGlyph(glyph);
        }
        if (typeof fg !== "number") {
            fg = Color.from(fg).toInt();
        }
        if (typeof bg !== "number") {
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
    drawSprite(x, y, sprite) {
        const ch = sprite.ch === null ? -1 : sprite.ch;
        const fg = sprite.fg === null ? -1 : sprite.fg;
        const bg = sprite.bg === null ? -1 : sprite.bg;
        return this.draw(x, y, ch, fg, bg);
    }
    blackOut(...args) {
        if (args.length == 0) {
            return this.fill(0, 0, 0);
        }
        return this.draw(args[0], args[1], 0, 0, 0);
    }
    fill(glyph = 0, fg = 0xfff, bg = 0) {
        if (typeof glyph == "string") {
            glyph = this._toGlyph(glyph);
        }
        glyph = glyph & 0xff;
        fg = fg & 0xfff;
        bg = bg & 0xfff;
        const style = (glyph << 24) + (bg << 12) + fg;
        this._data.fill(style);
        return this;
    }
    copy(other) {
        this._data.set(other._data);
        return this;
    }
    drawText(x, y, text, fg = 0xfff, bg = -1) {
        if (typeof fg !== "number")
            fg = Color.from(fg);
        if (typeof bg !== "number")
            bg = Color.from(bg);
        Text.eachChar(text, (ch, fg0, bg0, i) => {
            if (x + i >= this.width)
                return;
            this.draw(i + x, y, ch, fg0, bg0);
        }, fg, bg);
        return ++y;
    }
    wrapText(x, y, width, text, fg = 0xfff, bg = -1, indent = 0) {
        if (typeof fg !== "number")
            fg = Color.from(fg);
        if (typeof bg !== "number")
            bg = Color.from(bg);
        width = Math.min(width, this.width - x);
        text = Text.wordWrap(text, width, indent);
        let xi = x;
        Text.eachChar(text, (ch, fg0, bg0) => {
            if (ch == "\n") {
                while (xi < x + width) {
                    this.draw(xi++, y, 0, 0x000, bg0);
                }
                ++y;
                xi = x + indent;
                return;
            }
            this.draw(xi++, y, ch, fg0, bg0);
        }, fg, bg);
        while (xi < x + width) {
            this.draw(xi++, y, 0, 0x000, bg);
        }
        return ++y;
    }
    fillRect(x, y, w, h, ch = -1, fg = -1, bg = -1) {
        if (ch === null)
            ch = -1;
        if (typeof ch !== "number")
            ch = this._toGlyph(ch);
        if (typeof fg !== "number")
            fg = Color.from(fg).toInt();
        if (typeof bg !== "number")
            bg = Color.from(bg).toInt();
        for (let i = x; i < x + w; ++i) {
            for (let j = y; j < y + h; ++j) {
                this.draw(i, j, ch, fg, bg);
            }
        }
        return this;
    }
    blackOutRect(x, y, w, h, bg = 0) {
        if (typeof bg !== "number")
            bg = Color.from(bg);
        return this.fillRect(x, y, w, h, 0, 0, bg);
    }
    highlight(x, y, color, strength) {
        if (typeof color !== "number") {
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
    mix(color, percent) {
        if (typeof color !== "number")
            color = Color.from(color);
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
        let header = "    ";
        for (let x = 0; x < this.width; ++x) {
            if (x % 10 == 0)
                header += " ";
            header += x % 10;
        }
        data.push(header);
        data.push("");
        for (let y = 0; y < this.height; ++y) {
            let line = `${("" + y).padStart(2)}] `;
            for (let x = 0; x < this.width; ++x) {
                if (x % 10 == 0)
                    line += " ";
                const data = this.get(x, y);
                const glyph = data.ch;
                line += String.fromCharCode(glyph || 32);
            }
            data.push(line);
        }
        console.log(data.join("\n"));
    }
}
export class Buffer extends DataBuffer {
    constructor(canvas) {
        super(canvas.width, canvas.height);
        this._target = canvas;
        canvas.copyTo(this.data);
    }
    // get canvas() { return this._target; }
    _toGlyph(ch) {
        return this._target.toGlyph(ch);
    }
    render() {
        this._target.copy(this.data);
        return this;
    }
    load() {
        this._target.copyTo(this.data);
        return this;
    }
}
//# sourceMappingURL=buffer.js.map