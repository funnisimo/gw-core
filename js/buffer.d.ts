import { Canvas, DrawInfo } from "./canvas/index";
import * as Color from "./color";
export declare class DataBuffer {
    private _data;
    private _width;
    private _height;
    constructor(width: number, height: number);
    get data(): Uint32Array;
    get width(): number;
    get height(): number;
    get(x: number, y: number): DrawInfo;
    protected _toGlyph(ch: string): number;
    draw(x: number, y: number, glyph?: number | string, fg?: Color.Color | number, bg?: Color.Color | number): this;
    drawSprite(x: number, y: number, sprite: DrawInfo): this;
    blackOut(x: number, y: number): this;
    fill(glyph?: number | string, fg?: number, bg?: number): this;
    copy(other: DataBuffer): this;
    drawText(x: number, y: number, text: string, fg?: Color.Color | number | string, bg?: Color.Color | number | string): number;
    wrapText(x0: number, y0: number, width: number, text: string, fg?: Color.Color | number | string, bg?: Color.Color | number | string, opts?: any): number;
    fillRect(x: number, y: number, w: number, h: number, ch?: string | number | null, fg?: Color.Color | number | string | null, bg?: Color.Color | number | string | null): this;
    blackOutRect(x: number, y: number, w: number, h: number, bg?: Color.Color | number): this;
    highlight(x: number, y: number, highlightColor: Color.Color | number | string, strength: number): this;
    mix(color: Color.Color | number | string, percent: number): this;
    dump(): void;
}
export declare class Buffer extends DataBuffer {
    private _canvas;
    constructor(canvas: Canvas);
    _toGlyph(ch: string): number;
    render(): this;
    copyFromCanvas(): this;
}
