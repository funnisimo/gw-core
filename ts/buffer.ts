import { Canvas, Mixer, DrawInfo } from "./canvas/index";
import * as Color from "./color";
import * as Text from "./text/index";

export class DataBuffer {
  private _data: Uint32Array;
  private _width: number;
  private _height: number;

  constructor(width: number, height: number) {
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

  get(x: number, y: number): DrawInfo {
    let index = y * this.width + x;
    const style = this._data[index] || 0;
    const ch = style >> 24;
    const bg = (style >> 12) & 0xfff;
    const fg = style & 0xfff;
    return { ch, fg, bg };
  }

  protected _toGlyph(ch: string) {
    if (ch === null || ch === undefined) return -1;
    return ch.charCodeAt(0);
  }

  draw(
    x: number,
    y: number,
    glyph: number | string = -1,
    fg: Color.Color | number = -1,
    bg: Color.Color | number = -1
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
  drawSprite(x: number, y: number, sprite: DrawInfo) {
    return this.draw(x, y, sprite.ch, sprite.fg, sprite.bg);
  }

  blackOut(x: number, y: number) {
    if (arguments.length == 0) {
      return this.fill(0, 0, 0);
    }
    return this.draw(x, y, 0, 0, 0);
  }

  fill(glyph: number | string = 0, fg: number = 0xfff, bg: number = 0) {
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

  copy(other: DataBuffer) {
    this._data.set(other._data);
    return this;
  }

  drawText(
    x: number,
    y: number,
    text: string,
    fg: Color.Color | number | string = 0xfff,
    bg: Color.Color | number | string = -1
  ) {
    if (typeof fg !== "number") fg = Color.from(fg);
    if (typeof bg !== "number") bg = Color.from(bg);

    Text.eachChar(
      text,
      (ch, color, bg, i) => {
        this.draw(i + x, y, ch, color, bg);
      },
      fg,
      bg
    );
    return ++y;
  }

  wrapText(
    x0: number,
    y0: number,
    width: number,
    text: string,
    fg: Color.Color | number | string = 0xfff,
    bg: Color.Color | number | string = -1,
    opts: any = {}
  ) {
    if (typeof opts === "number") {
      opts = { indent: opts };
    }
    if (typeof fg !== "number") fg = Color.from(fg);
    if (typeof bg !== "number") bg = Color.from(bg);

    width = Math.min(width, this.width - x0);
    const indent = opts.indent || 0;

    text = Text.wordWrap(text, width, indent);

    let x = x0;
    let y = y0;
    Text.eachChar(
      text,
      (ch, fg0, bg0) => {
        if (ch == "\n") {
          while (x < x0 + width) {
            this.draw(x++, y, 0, 0x000, bg0);
          }
          ++y;
          x = x0 + indent;
          return;
        }
        this.draw(x++, y, ch, fg0, bg0);
      },
      fg,
      bg
    );

    while (x < x0 + width) {
      this.draw(x++, y, " ", 0x000, bg);
    }

    return ++y;
  }

  fillRect(
    x: number,
    y: number,
    w: number,
    h: number,
    ch: string | number | null = -1,
    fg: Color.Color | number | string | null = -1,
    bg: Color.Color | number | string | null = -1
  ) {
    if (ch === null) ch = -1;
    fg = typeof fg === "number" ? fg : Color.from(fg);
    bg = typeof bg === "number" ? bg : Color.from(bg);

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
    bg?: Color.Color | number
  ) {
    bg = bg || 0x000;
    return this.fillRect(x, y, w, h, " ", 0, bg);
  }

  highlight(
    x: number,
    y: number,
    highlightColor: Color.Color | number | string,
    strength: number
  ) {
    if (typeof highlightColor !== "number") {
      highlightColor = Color.from(highlightColor);
    }
    const mixer = new Mixer();
    const data = this.get(x, y);
    mixer.drawSprite(data);
    mixer.fg.add(highlightColor, strength);
    mixer.bg.add(highlightColor, strength);
    this.drawSprite(x, y, mixer);
    return this;
  }

  mix(color: Color.Color | number | string, percent: number) {
    if (typeof color !== "number") color = Color.from(color);
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
      if (x % 10 == 0) header += " ";
      header += x % 10;
    }
    data.push(header);
    data.push("");

    for (let y = 0; y < this.height; ++y) {
      let line = `${("" + y).padStart(2)}] `;
      for (let x = 0; x < this.width; ++x) {
        if (x % 10 == 0) line += " ";
        const data = this.get(x, y);
        const glyph = data.ch as number;
        line += String.fromCharCode(glyph || 32);
      }
      data.push(line);
    }
    console.log(data.join("\n"));
  }
}

export class Buffer extends DataBuffer {
  private _canvas: Canvas;

  constructor(canvas: Canvas) {
    super(canvas.width, canvas.height);
    this._canvas = canvas;
    canvas.copyTo(this.data);
  }

  // get canvas() { return this._canvas; }

  _toGlyph(ch: string) {
    return this._canvas.glyphs.forChar(ch);
  }

  render() {
    this._canvas.copy(this.data);
    return this;
  }

  copyFromCanvas() {
    this._canvas.copyTo(this.data);
    return this;
  }
}
