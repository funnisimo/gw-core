import * as Color from "../color";

export interface DrawInfo {
  ch: string | number;
  fg: Color.Color | number;
  bg: Color.Color | number;
}

export interface SpriteType extends DrawInfo {
  opacity?: number;
}

export class Mixer implements DrawInfo {
  public ch: string | number;
  public fg: Color.Color;
  public bg: Color.Color;

  constructor() {
    this.ch = -1;
    this.fg = new Color.Color();
    this.bg = new Color.Color();
  }

  protected _changed() {
    return this;
  }

  copy(other: Mixer) {
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

  drawSprite(info: SpriteType, opacity?: number) {
    if (opacity === undefined) opacity = info.opacity;
    if (opacity === undefined) opacity = 100;
    if (opacity <= 0) return;
    if (info.ch !== -1 && (info.ch || info.ch === 0)) this.ch = info.ch;

    if (info.fg && info.fg !== -1) this.fg.mix(info.fg, opacity);
    if (info.bg && info.bg !== -1) this.bg.mix(info.bg, opacity);
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

  bake() {
    this.fg.bake();
    this.bg.bake();
    this._changed();
    return {
      ch: this.ch,
      fg: this.fg.toInt(),
      bg: this.bg.toInt(),
    };
  }
}
