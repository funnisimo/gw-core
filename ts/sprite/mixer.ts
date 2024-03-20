import * as Color from '../color';
import { SpriteData } from '../types';
import * as Utils from '../utils';

export type DrawInfo = Omit<SpriteData, 'opacity'>;

export class Mixer implements SpriteData {
    public ch: string | null;
    public fg: Color.Color;
    public bg: Color.Color;

    constructor(base: DrawInfo = {}) {
        this.ch = Utils.firstDefined(base.ch, null);
        this.fg = Color.make(base.fg);
        this.bg = Color.make(base.bg);
    }

    get opacity(): number {
        return 100;
    }

    protected _changed() {
        return this;
    }

    copy(other: DrawInfo) {
        this.ch = other.ch || null;
        this.fg = Color.from(other.fg);
        this.bg = Color.from(other.bg);
        return this._changed();
    }

    fill(ch: string | null, fg: Color.ColorBase, bg: Color.ColorBase) {
        if (ch !== null) this.ch = ch;
        if (fg !== null) this.fg = Color.from(fg);
        if (bg !== null) this.bg = Color.from(bg);
        return this._changed();
    }

    clone() {
        const other = new Mixer();
        other.copy(this);
        return other;
    }

    equals(other: SpriteData) {
        return (
            this.ch == other.ch &&
            this.fg.equals(other.fg || null) &&
            this.bg.equals(other.bg || null)
        );
    }

    get dances(): boolean {
        return this.fg.dances || this.bg.dances;
    }

    nullify() {
        this.ch = null;
        this.fg = Color.NONE;
        this.bg = Color.NONE;
        return this._changed();
    }

    blackOut() {
        this.ch = null;
        this.fg = Color.BLACK;
        this.bg = Color.BLACK;
        return this._changed();
    }

    draw(
        ch: string | null = null,
        fg: Color.ColorBase = null,
        bg: Color.ColorBase = null
    ) {
        if (ch !== null) {
            this.ch = ch;
        }
        if (fg !== null) {
            fg = Color.from(fg);
            this.fg = this.fg.blend(fg);
        }
        if (bg !== null) {
            bg = Color.from(bg);
            this.bg = this.bg.blend(bg);
        }
        return this._changed();
    }

    drawSprite(src: SpriteData | Mixer) {
        if (src === this) return this;

        // @ts-ignore
        // if (opacity === undefined) opacity = src.opacity;
        // if (opacity === undefined) opacity = 100;
        // if (opacity <= 0) return;

        if (src.fg && src.fg !== -1) {
            const fg = Color.from(src.fg);
            if (src.ch && fg.a) {
                this.ch = src.ch;
            }
            this.fg = this.fg.apply(fg);
        }
        if (src.bg && src.bg !== -1) {
            this.bg = this.bg.apply(src.bg);
        }
        return this._changed();
    }

    invert() {
        this.bg = this.bg.inverse();
        this.fg = this.fg.inverse();
        return this._changed();
    }

    swap() {
        [this.bg, this.fg] = [this.fg, this.bg];
        return this._changed();
    }

    multiply(color: Color.ColorBase, fg = true, bg = true) {
        color = Color.from(color);
        if (fg) {
            this.fg = this.fg.multiply(color);
        }
        if (bg) {
            this.bg = this.bg.multiply(color);
        }
        return this._changed();
    }

    scale(multiplier: number, fg = true, bg = true) {
        if (fg) this.fg = this.fg.scale(multiplier);
        if (bg) this.bg = this.bg.scale(multiplier);
        return this._changed();
    }

    mix(color: Color.ColorBase, fg = 50, bg = fg) {
        color = Color.from(color);
        if (fg > 0) {
            this.fg = this.fg.mix(color, fg);
        }
        if (bg > 0) {
            this.bg = this.bg.mix(color, bg);
        }
        return this._changed();
    }

    add(color: Color.ColorBase, fg = 100, bg = fg) {
        color = Color.from(color);
        if (fg > 0) {
            this.fg = this.fg.add(color, fg);
        }
        if (bg > 0) {
            this.bg = this.bg.add(color, bg);
        }
        return this._changed();
    }

    separate() {
        [this.fg, this.bg] = Color.separate(this.fg, this.bg);
        return this._changed();
    }

    bake(clearDancing = false) {
        this.fg = this.fg.bake(clearDancing);
        this.bg = this.bg.bake(clearDancing);
        return this._changed();
    }

    toString() {
        // prettier-ignore
        return `{ ch: ${this.ch}, fg: ${this.fg.toString()}, bg: ${this.bg.toString()} }`;
    }
}

export function makeMixer(base?: Partial<DrawInfo>) {
    return new Mixer(base);
}
