import * as Color from '../color';
import { SpriteType } from '../types';
import * as Utils from '../utils';
import { make } from '../gw';

export interface DrawInfo {
    ch: string | number;
    fg: Color.ColorBase;
    bg: Color.ColorBase;
}

export class Mixer implements DrawInfo {
    public ch: string | number;
    public fg: Color.Color;
    public bg: Color.Color;

    constructor(base?: Partial<DrawInfo>) {
        this.ch = Utils.first(base?.ch, -1);
        this.fg = Color.from(base?.fg);
        this.bg = Color.from(base?.bg);
    }

    protected _changed() {
        return this;
    }

    copy(other: DrawInfo) {
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

    equals(other: Mixer) {
        return (
            this.ch == other.ch &&
            this.fg.equals(other.fg) &&
            this.bg.equals(other.bg)
        );
    }

    get dances(): boolean {
        return this.fg.dances || this.bg.dances;
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

    draw(
        ch: string | number = -1,
        fg: Color.ColorBase = -1,
        bg: Color.ColorBase = -1
    ) {
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

    drawSprite(src: SpriteType | Mixer, opacity?: number) {
        if (src === this) return this;

        // @ts-ignore
        if (opacity === undefined) opacity = src.opacity;
        if (opacity === undefined) opacity = 100;
        if (opacity <= 0) return;

        if (src.ch) this.ch = src.ch;
        if ((src.fg && src.fg !== -1) || src.fg === 0)
            this.fg.mix(src.fg, opacity);
        if ((src.bg && src.bg !== -1) || src.bg === 0)
            this.bg.mix(src.bg, opacity);
        return this._changed();
    }

    invert() {
        [this.bg, this.fg] = [this.fg, this.bg];
        return this._changed();
    }

    multiply(color: Color.ColorBase, fg = true, bg = true) {
        color = Color.from(color);
        if (fg) {
            this.fg.multiply(color);
        }
        if (bg) {
            this.bg.multiply(color);
        }
        return this._changed();
    }

    mix(color: Color.ColorBase, fg = 50, bg = fg) {
        color = Color.from(color);
        if (fg > 0) {
            this.fg.mix(color, fg);
        }
        if (bg > 0) {
            this.bg.mix(color, bg);
        }
        return this._changed();
    }

    add(color: Color.ColorBase, fg = 100, bg = fg) {
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

make.mixer = function (base?: Partial<DrawInfo>) {
    return new Mixer(base);
};
