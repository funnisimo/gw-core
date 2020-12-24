declare type ColorData = number[];
export declare type ColorBase = string | number | Color | ColorData;
export declare const colors: Record<string, Color>;
export declare class Color extends Int16Array {
    dances: boolean;
    name?: string;
    constructor(r?: number, g?: number, b?: number, rand?: number, redRand?: number, greenRand?: number, blueRand?: number, dances?: boolean);
    get r(): number;
    protected get _r(): number;
    protected set _r(v: number);
    get g(): number;
    protected get _g(): number;
    protected set _g(v: number);
    get b(): number;
    protected get _b(): number;
    protected set _b(v: number);
    protected get _rand(): number;
    protected get _redRand(): number;
    protected get _greenRand(): number;
    protected get _blueRand(): number;
    get l(): number;
    get s(): number;
    get h(): number;
    isNull(): boolean;
    equals(other: ColorBase): boolean;
    copy(other: ColorBase): this;
    protected _changed(): this;
    clone(): any;
    assign(_r?: number, _g?: number, _b?: number, _rand?: number, _redRand?: number, _greenRand?: number, _blueRand?: number, dances?: boolean): this;
    assignRGB(_r?: number, _g?: number, _b?: number, _rand?: number, _redRand?: number, _greenRand?: number, _blueRand?: number, dances?: boolean): this;
    nullify(): this;
    blackOut(): this;
    toInt(base256?: boolean): number;
    clamp(): this;
    mix(other: ColorBase, percent: number): this;
    lighten(percent: number): this | undefined;
    darken(percent: number): this | undefined;
    bake(clearDancing?: boolean): this | undefined;
    add(other: ColorBase, percent?: number): this;
    scale(percent: number): this;
    multiply(other: ColorData | Color): this;
    normalize(): this;
    /**
     * Returns the css code for the current RGB values of the color.
     * @param base256 - Show in base 256 (#abcdef) instead of base 16 (#abc)
     */
    css(base256?: boolean): string;
    toString(base256?: boolean): string;
}
export declare function fromArray(vals: ColorData, base256?: boolean): Color;
export declare function fromCss(css: string): Color;
export declare function fromName(name: string): Color;
export declare function fromNumber(val: number, base256?: boolean): Color;
export declare function make(): Color;
export declare function make(rgb: number, base256?: boolean): Color;
export declare function make(color?: ColorBase | null): Color;
export declare function make(arrayLike: ArrayLike<number>, base256?: boolean): Color;
export declare function make(...rgb: number[]): Color;
export declare function from(): Color;
export declare function from(rgb: number, base256?: boolean): Color;
export declare function from(color?: ColorBase | null): Color;
export declare function from(arrayLike: ArrayLike<number>, base256?: boolean): Color;
export declare function from(...rgb: number[]): Color;
export declare function separate(a: Color, b: Color): void;
export declare function swap(a: Color, b: Color): void;
export declare function relativeLuminance(a: Color, b: Color): number;
export declare function distance(a: Color, b: Color): number;
export declare function install(name: string, info: ColorBase): Color;
export declare function install(name: string, ...rgb: number[]): Color;
export declare function installSpread(name: string, info: ColorBase): Color;
export declare function installSpread(name: string, ...rgb: number[]): Color;
export {};
