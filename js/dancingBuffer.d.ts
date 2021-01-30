import { Mixer, DrawInfo } from "./canvas/mixer";
import * as Color from "./color";
import { DataBuffer, BufferTarget } from "./buffer";
export declare class DancingData {
    protected _data: Mixer[];
    private _width;
    private _height;
    constructor(width: number, height: number);
    get width(): number;
    get height(): number;
    get(x: number, y: number): Mixer;
    toGlyph(ch: string | number): number;
    draw(x: number, y: number, glyph?: number | string, fg?: Color.ColorBase, // TODO - White?
    bg?: Color.ColorBase): this | undefined;
    drawSprite(x: number, y: number, sprite: Partial<DrawInfo>): this | undefined;
    blackOut(x: number, y: number): void;
    blackOut(): void;
    fill(glyph?: number | string, fg?: number, bg?: number): this;
    copy(other: DataBuffer | DancingData): this;
    drawText(x: number, y: number, text: string, fg?: Color.ColorBase, bg?: Color.ColorBase): number;
    wrapText(x: number, y: number, width: number, text: string, fg?: Color.Color | number | string, bg?: Color.Color | number | string, indent?: number): number;
    fillRect(x: number, y: number, w: number, h: number, ch?: string | number | null, fg?: Color.ColorBase | null, bg?: Color.ColorBase | null): this;
    blackOutRect(x: number, y: number, w: number, h: number, bg?: Color.ColorBase): this;
    highlight(x: number, y: number, color: Color.ColorBase, strength: number): this;
    mix(color: Color.ColorBase, percent: number): this;
    dump(): void;
}
export declare class DancingBuffer extends DancingData {
    private _target;
    constructor(canvas: BufferTarget);
    toGlyph(ch: string | number): number;
    render(): this;
    load(): this;
}
