import { DrawInfo } from "./canvas/index";
import * as Color from "./color";
export interface Data {
    ch: number;
    fg: number;
    bg: number;
}
export declare class DataBuffer {
    private _data;
    private _width;
    private _height;
    constructor(width: number, height: number);
    get data(): Uint32Array;
    get width(): number;
    get height(): number;
    get(x: number, y: number): Data;
    protected _toGlyph(ch: string): number;
    draw(x: number, y: number, glyph?: number | string, fg?: Color.ColorBase, // TODO - White?
    bg?: Color.ColorBase): this;
    drawSprite(x: number, y: number, sprite: Partial<DrawInfo>): this;
    blackOut(x: number, y: number): void;
    blackOut(): void;
    fill(glyph?: number | string, fg?: number, bg?: number): this;
    copy(other: DataBuffer): this;
    drawText(x: number, y: number, text: string, fg?: Color.ColorBase, bg?: Color.ColorBase): number;
    wrapText(x: number, y: number, width: number, text: string, fg?: Color.Color | number | string, bg?: Color.Color | number | string, indent?: number): number;
    fillRect(x: number, y: number, w: number, h: number, ch?: string | number | null, fg?: Color.ColorBase | null, bg?: Color.ColorBase | null): this;
    blackOutRect(x: number, y: number, w: number, h: number, bg?: Color.ColorBase): this;
    highlight(x: number, y: number, color: Color.ColorBase, strength: number): this;
    mix(color: Color.ColorBase, percent: number): this;
    dump(): void;
}
export interface BufferTarget {
    readonly width: number;
    readonly height: number;
    copyTo(dest: Uint32Array): void;
    copy(src: Uint32Array): void;
    toGlyph(ch: string): number;
}
export declare class Buffer extends DataBuffer {
    private _target;
    constructor(canvas: BufferTarget);
    _toGlyph(ch: string): number;
    render(): this;
    load(): this;
}
