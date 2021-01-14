import * as Color from "../color";
import * as Utils from "../utils";
import { make } from "../gw";
export class Mixer {
    constructor(base) {
        this.ch = Utils.first(base === null || base === void 0 ? void 0 : base.ch, -1);
        this.fg = Color.from(base === null || base === void 0 ? void 0 : base.fg);
        this.bg = Color.from(base === null || base === void 0 ? void 0 : base.bg);
    }
    _changed() {
        return this;
    }
    copy(other) {
        this.ch = other.ch;
        this.fg.copy(other.fg);
        this.bg.copy(other.bg);
        return this._changed();
    }
    clone() {
        const other = new Mixer();
        other.copy(this);
        return other;
    }
    equals(other) {
        return (this.ch == other.ch &&
            this.fg.equals(other.fg) &&
            this.bg.equals(other.bg));
    }
    nullify() {
        this.ch = -1;
        this.fg.nullify();
        this.bg.nullify();
        return this._changed();
    }
    blackOut() {
        this.ch = 0;
        this.fg.blackOut();
        this.bg.blackOut();
        return this._changed();
    }
    draw(ch = -1, fg = -1, bg = -1) {
        if (ch && ch !== -1) {
            this.ch = ch;
        }
        if (fg !== -1 && fg !== null) {
            fg = Color.from(fg);
            this.fg.copy(fg);
        }
        if (bg !== -1 && bg !== null) {
            bg = Color.from(bg);
            this.bg.copy(bg);
        }
        return this._changed();
    }
    drawSprite(info, opacity) {
        if (opacity === undefined)
            opacity = info.opacity;
        if (opacity === undefined)
            opacity = 100;
        if (opacity <= 0)
            return;
        if ((info.ch && info.ch !== -1) || info.ch === 0)
            this.ch = info.ch;
        if ((info.fg && info.fg !== -1) || info.fg === 0)
            this.fg.mix(info.fg, opacity);
        if ((info.bg && info.bg !== -1) || info.bg === 0)
            this.bg.mix(info.bg, opacity);
        return this._changed();
    }
    invert() {
        [this.bg, this.fg] = [this.fg, this.bg];
        return this._changed();
    }
    multiply(color, fg = true, bg = true) {
        color = Color.from(color);
        if (fg) {
            this.fg.multiply(color);
        }
        if (bg) {
            this.bg.multiply(color);
        }
        return this._changed();
    }
    mix(color, fg = 50, bg = fg) {
        color = Color.from(color);
        if (fg > 0) {
            this.fg.mix(color, fg);
        }
        if (bg > 0) {
            this.bg.mix(color, bg);
        }
        return this._changed();
    }
    add(color, fg = 100, bg = fg) {
        color = Color.from(color);
        if (fg > 0) {
            this.fg.add(color, fg);
        }
        if (bg > 0) {
            this.bg.add(color, bg);
        }
        return this._changed();
    }
    separate() {
        Color.separate(this.fg, this.bg);
        return this._changed();
    }
    bake(clearDancing = false) {
        this.fg.bake(clearDancing);
        this.bg.bake(clearDancing);
        this._changed();
        return {
            ch: this.ch,
            fg: this.fg.toInt(),
            bg: this.bg.toInt(),
        };
    }
    toString() {
        // prettier-ignore
        return `{ ch: ${this.ch}, fg: ${this.fg.toString(true)}, bg: ${this.bg.toString(true)} }`;
    }
}
make.mixer = function (base) {
    return new Mixer(base);
};
//# sourceMappingURL=mixer.js.map