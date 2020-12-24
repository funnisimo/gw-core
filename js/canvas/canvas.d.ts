import { Glyphs, GlyphOptions } from "./glyphs";
import { BufferTarget } from "../buffer";
export interface CanvasOptions {
    width?: number;
    height?: number;
    glyphs: Glyphs;
    div?: HTMLElement | string;
    render?: boolean;
}
export interface ImageOptions extends CanvasOptions {
    image: HTMLImageElement | string;
}
export declare type FontOptions = CanvasOptions & GlyphOptions;
export declare class NotSupportedError extends Error {
    constructor(...params: any[]);
}
export declare abstract class BaseCanvas implements BufferTarget {
    protected _data: Uint32Array;
    protected _renderRequested: boolean;
    protected _glyphs: Glyphs;
    protected _autoRender: boolean;
    protected _node: HTMLCanvasElement;
    protected _width: number;
    protected _height: number;
    constructor(options: CanvasOptions);
    get node(): HTMLCanvasElement;
    get width(): number;
    get height(): number;
    get tileWidth(): number;
    get tileHeight(): number;
    get pxWidth(): number;
    get pxHeight(): number;
    get glyphs(): Glyphs;
    set glyphs(glyphs: Glyphs);
    toGlyph(ch: string): number;
    protected _createNode(): HTMLCanvasElement;
    protected abstract _createContext(): void;
    private _configure;
    protected _setGlyphs(glyphs: Glyphs): boolean;
    resize(width: number, height: number): void;
    draw(x: number, y: number, glyph: number, fg: number, bg: number): void;
    protected _requestRender(): void;
    protected _set(x: number, y: number, style: number): boolean;
    copy(data: Uint32Array): void;
    copyTo(data: Uint32Array): void;
    abstract render(): void;
    hasXY(x: number, y: number): boolean;
    toX(x: number): number;
    toY(y: number): number;
}
export declare class Canvas extends BaseCanvas {
    private _gl;
    private _buffers;
    private _attribs;
    private _uniforms;
    private _texture;
    constructor(options: CanvasOptions);
    protected _createContext(): void;
    private _createGeometry;
    private _createData;
    protected _setGlyphs(glyphs: Glyphs): boolean;
    _uploadGlyphs(): void;
    resize(width: number, height: number): void;
    protected _set(x: number, y: number, style: number): boolean;
    copy(data: Uint32Array): void;
    copyTo(data: Uint32Array): void;
    render(): void;
}
export declare class Canvas2D extends BaseCanvas {
    private _ctx;
    private _changed;
    constructor(options: CanvasOptions);
    protected _createContext(): void;
    protected _set(x: number, y: number, style: number): boolean;
    resize(width: number, height: number): void;
    copy(data: Uint32Array): void;
    render(): void;
    protected _renderCell(index: number): void;
}
export declare function withImage(image: ImageOptions | HTMLImageElement | string): Canvas | Canvas2D;
export declare function withFont(src: FontOptions | string): Canvas | Canvas2D;
