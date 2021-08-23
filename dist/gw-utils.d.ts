declare type ColorData = [number, number, number] | [number, number, number, number, number, number, number] | [number, number, number, number, number, number, number, boolean];
declare type ColorBase = string | number | ColorData | Color;
declare type LightValue = [number, number, number];
declare const colors: Record<string, Color>;
declare class Color extends Int16Array {
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
    equals(other: Color | ColorBase): boolean;
    copy(other: Color | ColorBase): this;
    protected _changed(): this;
    clone(): any;
    assign(_r?: number, _g?: number, _b?: number, _rand?: number, _redRand?: number, _greenRand?: number, _blueRand?: number, dances?: boolean): this;
    assignRGB(_r?: number, _g?: number, _b?: number, _rand?: number, _redRand?: number, _greenRand?: number, _blueRand?: number, dances?: boolean): this;
    nullify(): this;
    blackOut(): this;
    toInt(base256?: boolean): number;
    toLight(): LightValue;
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
declare function fromArray(vals: ColorData, base256?: boolean): Color;
declare function fromCss(css: string): Color;
declare function fromName(name: string): Color;
declare function fromNumber(val: number, base256?: boolean): Color;
declare function make$b(): Color;
declare function make$b(rgb: number, base256?: boolean): Color;
declare function make$b(color?: ColorBase | null): Color;
declare function make$b(arrayLike: ColorData, base256?: boolean): Color;
declare function make$b(...rgb: number[]): Color;
declare function from$6(): Color;
declare function from$6(rgb: number, base256?: boolean): Color;
declare function from$6(color?: ColorBase | null): Color;
declare function from$6(arrayLike: ColorData, base256?: boolean): Color;
declare function from$6(...rgb: number[]): Color;
declare function separate(a: Color, b: Color): void;
declare function swap(a: Color, b: Color): void;
declare function relativeLuminance(a: Color, b: Color): number;
declare function distance(a: Color, b: Color): number;
declare function install$5(name: string, info: ColorBase): Color;
declare function install$5(name: string, ...rgb: ColorData): Color;
declare function installSpread(name: string, info: ColorBase): Color;
declare function installSpread(name: string, ...rgb: ColorData): Color;
declare const NONE: Color;

type index_d$c_ColorData = ColorData;
type index_d$c_ColorBase = ColorBase;
type index_d$c_LightValue = LightValue;
declare const index_d$c_colors: typeof colors;
type index_d$c_Color = Color;
declare const index_d$c_Color: typeof Color;
declare const index_d$c_fromArray: typeof fromArray;
declare const index_d$c_fromCss: typeof fromCss;
declare const index_d$c_fromName: typeof fromName;
declare const index_d$c_fromNumber: typeof fromNumber;
declare const index_d$c_separate: typeof separate;
declare const index_d$c_swap: typeof swap;
declare const index_d$c_relativeLuminance: typeof relativeLuminance;
declare const index_d$c_distance: typeof distance;
declare const index_d$c_installSpread: typeof installSpread;
declare const index_d$c_NONE: typeof NONE;
declare namespace index_d$c {
  export {
    index_d$c_ColorData as ColorData,
    index_d$c_ColorBase as ColorBase,
    index_d$c_LightValue as LightValue,
    index_d$c_colors as colors,
    index_d$c_Color as Color,
    index_d$c_fromArray as fromArray,
    index_d$c_fromCss as fromCss,
    index_d$c_fromName as fromName,
    index_d$c_fromNumber as fromNumber,
    make$b as make,
    from$6 as from,
    index_d$c_separate as separate,
    index_d$c_swap as swap,
    index_d$c_relativeLuminance as relativeLuminance,
    index_d$c_distance as distance,
    install$5 as install,
    index_d$c_installSpread as installSpread,
    index_d$c_NONE as NONE,
  };
}

declare type Loc$1 = [number, number];
interface XY {
    x: number;
    y: number;
}
interface SpriteData$1 {
    readonly ch?: string | null;
    readonly fg?: Color | ColorBase;
    readonly bg?: Color | ColorBase;
    readonly opacity?: number;
}
declare type EachCb$1<T> = (t: T) => any;

type types_d_XY = XY;
declare namespace types_d {
  export {
    Loc$1 as Loc,
    types_d_XY as XY,
    SpriteData$1 as SpriteData,
    EachCb$1 as EachCb,
  };
}

interface Chainable<T> {
    next: T | null;
}
declare type ChainSort<T> = (a: T, b: T) => number;
declare type ChainMatch<T> = (val: T) => boolean;
declare type ChainFn<T> = (val: T) => any;
declare function chainLength<T extends Chainable<T>>(root: T | null): number;
declare function chainIncludes<T extends Chainable<T>>(chain: T | null, entry: T): boolean;
declare function eachChain<T extends Chainable<T>>(item: T | null, fn: (item: T, index: number) => any): number;
declare function addToChain<T extends Chainable<T>>(obj: any, name: string, entry: T): boolean;
declare function removeFromChain<T extends Chainable<T>>(obj: any, name: string, entry: T): boolean;
declare function findInChain<T extends Chainable<T>>(root: T | null, cb: ChainMatch<T>): T | null;
declare type ChainChangeFn = () => any;
declare type ChainReduceFn<T> = (out: any, t: T) => any;
declare class Chain<T extends Chainable<T>> {
    data: T | null;
    sort: ChainSort<T>;
    onchange: ChainChangeFn;
    constructor(sort?: ChainSort<T>, onchange?: ChainChangeFn);
    copy(other: Chain<T>): void;
    get length(): number;
    add(obj: T): boolean;
    has(obj: T): boolean;
    remove(obj: T): boolean;
    find(cb: ChainMatch<T>): T | null;
    forEach(cb: ChainFn<T>): number;
    reduce(cb: ChainReduceFn<T>, out?: any): any;
    some(cb: ChainMatch<T>): boolean;
    every(cb: ChainMatch<T>): boolean;
}

/**
 * GW.utils
 * @module utils
 */

declare const DIRS: Loc$1[];
declare const NO_DIRECTION = -1;
declare const UP = 0;
declare const RIGHT = 1;
declare const DOWN = 2;
declare const LEFT = 3;
declare const RIGHT_UP = 4;
declare const RIGHT_DOWN = 5;
declare const LEFT_DOWN = 6;
declare const LEFT_UP = 7;
declare const CLOCK_DIRS: Loc$1[];
declare function NOOP(): void;
declare function TRUE(): boolean;
declare function FALSE(): boolean;
declare function ONE(): number;
declare function ZERO(): number;
declare function IDENTITY(x: any): any;
declare function IS_ZERO(x: number): boolean;
declare function IS_NONZERO(x: number): boolean;
/**
 * clamps a value between min and max (inclusive)
 * @param v {Number} the value to clamp
 * @param min {Number} the minimum value
 * @param max {Number} the maximum value
 * @returns {Number} the clamped value
 */
declare function clamp(v: number, min: number, max: number): number;
declare function x(src: XY | Loc$1): any;
declare function y(src: XY | Loc$1): any;
declare class Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, w: number, h: number);
    get left(): number;
    get right(): number;
    get top(): number;
    get bottom(): number;
    contains(x: number, y: number): boolean;
    contains(loc: Loc$1 | XY): boolean;
}
declare function copyXY(dest: XY, src: XY | Loc$1): void;
declare function addXY(dest: XY, src: XY | Loc$1): void;
declare function equalsXY(dest: XY | Loc$1 | null | undefined, src: XY | Loc$1 | null | undefined): boolean;
declare function lerpXY(a: XY | Loc$1, b: XY | Loc$1, pct: number): any[];
declare type XYFunc = (x: number, y: number) => any;
declare function eachNeighbor(x: number, y: number, fn: XYFunc, only4dirs?: boolean): void;
declare function eachNeighborAsync(x: number, y: number, fn: XYFunc, only4dirs?: boolean): Promise<void>;
declare type XYMatchFunc = (x: number, y: number) => boolean;
declare function matchingNeighbor(x: number, y: number, matchFn: XYMatchFunc, only4dirs?: boolean): Loc$1;
declare function distanceBetween(x1: number, y1: number, x2: number, y2: number): number;
declare function distanceFromTo(a: XY | Loc$1, b: XY | Loc$1): number;
declare function calcRadius(x: number, y: number): number;
declare function dirBetween(x: number, y: number, toX: number, toY: number): number[];
declare function dirFromTo(a: XY | Loc$1, b: XY | Loc$1): number[];
declare function dirIndex(dir: XY | Loc$1): number;
declare function isOppositeDir(a: Loc$1, b: Loc$1): boolean;
declare function isSameDir(a: Loc$1, b: Loc$1): boolean;
declare function dirSpread(dir: Loc$1): Loc$1[];
declare function stepFromTo(a: XY | Loc$1, b: XY | Loc$1, fn: (x: number, y: number) => any): void;
declare function smoothHiliteGradient(currentXValue: number, maxXValue: number): number;
declare function copyObject(dest: any, src: any): void;
declare function assignObject(dest: any, src: any): void;
declare function assignOmitting(omit: string | string[], dest: any, src: any): void;
declare function setDefault(obj: any, field: string, val: any): void;
declare type AssignCallback = (dest: any, key: string, current: any, def: any) => boolean;
declare function setDefaults(obj: any, def: any, custom?: AssignCallback | null): void;
declare function setOptions(obj: any, opts: any): void;
declare function kindDefaults(obj: any, def: any): void;
declare function pick(obj: any, ...fields: string[]): any;
declare function clearObject(obj: any): void;
declare function ERROR(message: string): void;
declare function WARN(...args: string[]): void;
declare function first(...args: any[]): any;
declare function getOpt(obj: any, member: string, _default: any): any;
declare function firstOpt(field: string, ...args: any[]): any;
declare function arraysIntersect(a: any[], b: any[]): boolean;
declare function sum(arr: number[]): number;
declare function forLine(fromX: number, fromY: number, toX: number, toY: number, stepFn: (x: number, y: number) => boolean): void;
declare function getLine(fromX: number, fromY: number, toX: number, toY: number): Loc$1[];
declare function getLineThru(fromX: number, fromY: number, toX: number, toY: number, width: number, height: number): Loc$1[];
declare function forCircle(x: number, y: number, radius: number, fn: XYFunc): void;
declare function forRect(width: number, height: number, fn: XYFunc): void;
declare function forRect(x: number, y: number, width: number, height: number, fn: XYFunc): void;
declare function forBorder(width: number, height: number, fn: XYFunc): void;
declare function forBorder(x: number, y: number, width: number, height: number, fn: XYFunc): void;
declare function arcCount(x: number, y: number, testFn: XYMatchFunc): number;
declare function asyncForEach<T>(iterable: Iterable<T>, fn: (t: T) => Promise<any> | any): Promise<void>;

type index_d$b_XY = XY;
declare const index_d$b_DIRS: typeof DIRS;
declare const index_d$b_NO_DIRECTION: typeof NO_DIRECTION;
declare const index_d$b_UP: typeof UP;
declare const index_d$b_RIGHT: typeof RIGHT;
declare const index_d$b_DOWN: typeof DOWN;
declare const index_d$b_LEFT: typeof LEFT;
declare const index_d$b_RIGHT_UP: typeof RIGHT_UP;
declare const index_d$b_RIGHT_DOWN: typeof RIGHT_DOWN;
declare const index_d$b_LEFT_DOWN: typeof LEFT_DOWN;
declare const index_d$b_LEFT_UP: typeof LEFT_UP;
declare const index_d$b_CLOCK_DIRS: typeof CLOCK_DIRS;
declare const index_d$b_NOOP: typeof NOOP;
declare const index_d$b_TRUE: typeof TRUE;
declare const index_d$b_FALSE: typeof FALSE;
declare const index_d$b_ONE: typeof ONE;
declare const index_d$b_ZERO: typeof ZERO;
declare const index_d$b_IDENTITY: typeof IDENTITY;
declare const index_d$b_IS_ZERO: typeof IS_ZERO;
declare const index_d$b_IS_NONZERO: typeof IS_NONZERO;
declare const index_d$b_clamp: typeof clamp;
declare const index_d$b_x: typeof x;
declare const index_d$b_y: typeof y;
type index_d$b_Bounds = Bounds;
declare const index_d$b_Bounds: typeof Bounds;
declare const index_d$b_copyXY: typeof copyXY;
declare const index_d$b_addXY: typeof addXY;
declare const index_d$b_equalsXY: typeof equalsXY;
declare const index_d$b_lerpXY: typeof lerpXY;
type index_d$b_XYFunc = XYFunc;
declare const index_d$b_eachNeighbor: typeof eachNeighbor;
declare const index_d$b_eachNeighborAsync: typeof eachNeighborAsync;
type index_d$b_XYMatchFunc = XYMatchFunc;
declare const index_d$b_matchingNeighbor: typeof matchingNeighbor;
declare const index_d$b_distanceBetween: typeof distanceBetween;
declare const index_d$b_distanceFromTo: typeof distanceFromTo;
declare const index_d$b_calcRadius: typeof calcRadius;
declare const index_d$b_dirBetween: typeof dirBetween;
declare const index_d$b_dirFromTo: typeof dirFromTo;
declare const index_d$b_dirIndex: typeof dirIndex;
declare const index_d$b_isOppositeDir: typeof isOppositeDir;
declare const index_d$b_isSameDir: typeof isSameDir;
declare const index_d$b_dirSpread: typeof dirSpread;
declare const index_d$b_stepFromTo: typeof stepFromTo;
declare const index_d$b_smoothHiliteGradient: typeof smoothHiliteGradient;
declare const index_d$b_copyObject: typeof copyObject;
declare const index_d$b_assignObject: typeof assignObject;
declare const index_d$b_assignOmitting: typeof assignOmitting;
declare const index_d$b_setDefault: typeof setDefault;
type index_d$b_AssignCallback = AssignCallback;
declare const index_d$b_setDefaults: typeof setDefaults;
declare const index_d$b_setOptions: typeof setOptions;
declare const index_d$b_kindDefaults: typeof kindDefaults;
declare const index_d$b_pick: typeof pick;
declare const index_d$b_clearObject: typeof clearObject;
declare const index_d$b_ERROR: typeof ERROR;
declare const index_d$b_WARN: typeof WARN;
declare const index_d$b_first: typeof first;
declare const index_d$b_getOpt: typeof getOpt;
declare const index_d$b_firstOpt: typeof firstOpt;
declare const index_d$b_arraysIntersect: typeof arraysIntersect;
declare const index_d$b_sum: typeof sum;
declare const index_d$b_forLine: typeof forLine;
declare const index_d$b_getLine: typeof getLine;
declare const index_d$b_getLineThru: typeof getLineThru;
declare const index_d$b_forCircle: typeof forCircle;
declare const index_d$b_forRect: typeof forRect;
declare const index_d$b_forBorder: typeof forBorder;
declare const index_d$b_arcCount: typeof arcCount;
declare const index_d$b_asyncForEach: typeof asyncForEach;
type index_d$b_Chainable<_0> = Chainable<_0>;
type index_d$b_ChainSort<_0> = ChainSort<_0>;
type index_d$b_ChainMatch<_0> = ChainMatch<_0>;
type index_d$b_ChainFn<_0> = ChainFn<_0>;
declare const index_d$b_chainLength: typeof chainLength;
declare const index_d$b_chainIncludes: typeof chainIncludes;
declare const index_d$b_eachChain: typeof eachChain;
declare const index_d$b_addToChain: typeof addToChain;
declare const index_d$b_removeFromChain: typeof removeFromChain;
declare const index_d$b_findInChain: typeof findInChain;
type index_d$b_ChainChangeFn = ChainChangeFn;
type index_d$b_ChainReduceFn<_0> = ChainReduceFn<_0>;
type index_d$b_Chain<_0> = Chain<_0>;
declare const index_d$b_Chain: typeof Chain;
declare namespace index_d$b {
  export {
    Loc$1 as Loc,
    index_d$b_XY as XY,
    index_d$b_DIRS as DIRS,
    index_d$b_NO_DIRECTION as NO_DIRECTION,
    index_d$b_UP as UP,
    index_d$b_RIGHT as RIGHT,
    index_d$b_DOWN as DOWN,
    index_d$b_LEFT as LEFT,
    index_d$b_RIGHT_UP as RIGHT_UP,
    index_d$b_RIGHT_DOWN as RIGHT_DOWN,
    index_d$b_LEFT_DOWN as LEFT_DOWN,
    index_d$b_LEFT_UP as LEFT_UP,
    index_d$b_CLOCK_DIRS as CLOCK_DIRS,
    index_d$b_NOOP as NOOP,
    index_d$b_TRUE as TRUE,
    index_d$b_FALSE as FALSE,
    index_d$b_ONE as ONE,
    index_d$b_ZERO as ZERO,
    index_d$b_IDENTITY as IDENTITY,
    index_d$b_IS_ZERO as IS_ZERO,
    index_d$b_IS_NONZERO as IS_NONZERO,
    index_d$b_clamp as clamp,
    index_d$b_x as x,
    index_d$b_y as y,
    index_d$b_Bounds as Bounds,
    index_d$b_copyXY as copyXY,
    index_d$b_addXY as addXY,
    index_d$b_equalsXY as equalsXY,
    index_d$b_lerpXY as lerpXY,
    index_d$b_XYFunc as XYFunc,
    index_d$b_eachNeighbor as eachNeighbor,
    index_d$b_eachNeighborAsync as eachNeighborAsync,
    index_d$b_XYMatchFunc as XYMatchFunc,
    index_d$b_matchingNeighbor as matchingNeighbor,
    index_d$b_distanceBetween as distanceBetween,
    index_d$b_distanceFromTo as distanceFromTo,
    index_d$b_calcRadius as calcRadius,
    index_d$b_dirBetween as dirBetween,
    index_d$b_dirFromTo as dirFromTo,
    index_d$b_dirIndex as dirIndex,
    index_d$b_isOppositeDir as isOppositeDir,
    index_d$b_isSameDir as isSameDir,
    index_d$b_dirSpread as dirSpread,
    index_d$b_stepFromTo as stepFromTo,
    index_d$b_smoothHiliteGradient as smoothHiliteGradient,
    index_d$b_copyObject as copyObject,
    index_d$b_assignObject as assignObject,
    index_d$b_assignOmitting as assignOmitting,
    index_d$b_setDefault as setDefault,
    index_d$b_AssignCallback as AssignCallback,
    index_d$b_setDefaults as setDefaults,
    index_d$b_setOptions as setOptions,
    index_d$b_kindDefaults as kindDefaults,
    index_d$b_pick as pick,
    index_d$b_clearObject as clearObject,
    index_d$b_ERROR as ERROR,
    index_d$b_WARN as WARN,
    index_d$b_first as first,
    index_d$b_getOpt as getOpt,
    index_d$b_firstOpt as firstOpt,
    index_d$b_arraysIntersect as arraysIntersect,
    index_d$b_sum as sum,
    index_d$b_forLine as forLine,
    index_d$b_getLine as getLine,
    index_d$b_getLineThru as getLineThru,
    index_d$b_forCircle as forCircle,
    index_d$b_forRect as forRect,
    index_d$b_forBorder as forBorder,
    index_d$b_arcCount as arcCount,
    index_d$b_asyncForEach as asyncForEach,
    index_d$b_Chainable as Chainable,
    index_d$b_ChainSort as ChainSort,
    index_d$b_ChainMatch as ChainMatch,
    index_d$b_ChainFn as ChainFn,
    index_d$b_chainLength as chainLength,
    index_d$b_chainIncludes as chainIncludes,
    index_d$b_eachChain as eachChain,
    index_d$b_addToChain as addToChain,
    index_d$b_removeFromChain as removeFromChain,
    index_d$b_findInChain as findInChain,
    index_d$b_ChainChangeFn as ChainChangeFn,
    index_d$b_ChainReduceFn as ChainReduceFn,
    index_d$b_Chain as Chain,
  };
}

declare type WeightedArray = number[];
interface WeightedObject {
    [key: string]: number;
}
declare class Random {
    private _fn;
    constructor();
    seed(val: number): void;
    value(): number;
    float(): number;
    number(max?: number): number;
    int(max?: number): number;
    range(lo: number, hi: number): number;
    dice(count: number, sides: number, addend?: number): number;
    weighted(weights: WeightedArray | WeightedObject): string | number;
    item(list: any[]): any;
    key(obj: object): any;
    shuffle(list: any[], fromIndex?: number, toIndex?: number): any[];
    sequence(n: number): any[];
    chance(percent: number, outOf?: number): boolean;
    clumped(lo: number, hi: number, clumps: number): number;
    matchingLoc(width: number, height: number, matchFn: XYMatchFunc): Loc$1;
    matchingLocNear(x: number, y: number, matchFn: XYMatchFunc): Loc$1;
}
declare const random: Random;
declare const cosmetic: Random;

declare type RangeBase = Range | string | number[] | number;
declare class Range {
    lo: number;
    hi: number;
    clumps: number;
    private _rng;
    constructor(lower: number, upper?: number, clumps?: number, rng?: Random);
    value(): number;
    contains(value: number): boolean;
    copy(other: Range): this;
    toString(): string;
}
declare function make$a(config: RangeBase | null, rng?: Random): Range;
declare const from$5: typeof make$a;
declare function asFn(config: RangeBase | null, rng?: Random): () => number;

type range_d_RangeBase = RangeBase;
type range_d_Range = Range;
declare const range_d_Range: typeof Range;
declare const range_d_asFn: typeof asFn;
declare namespace range_d {
  export {
    range_d_RangeBase as RangeBase,
    range_d_Range as Range,
    make$a as make,
    from$5 as from,
    range_d_asFn as asFn,
  };
}

declare type FlagSource = number | string;
declare type FlagBase = number | string | FlagSource[] | null;
declare function fl(N: number): number;
declare function toString<T>(flagObj: T, value: number): string;
declare function from$4<T>(obj: T, ...args: (FlagBase | undefined)[]): number;

type flag_d_FlagBase = FlagBase;
declare const flag_d_fl: typeof fl;
declare const flag_d_toString: typeof toString;
declare namespace flag_d {
  export {
    flag_d_FlagBase as FlagBase,
    flag_d_fl as fl,
    flag_d_toString as toString,
    from$4 as from,
  };
}

declare type Loc = Loc$1;
declare type ArrayInit<T> = (i: number) => T;
declare function makeArray<T>(l: number, fn?: T | ArrayInit<T>): Array<T>;
declare type GridInit<T> = (x: number, y: number) => T;
declare type GridEach<T> = (value: T, x: number, y: number, grid: Grid<T>) => any;
declare type AsyncGridEach<T> = (value: T, x: number, y: number, grid: Grid<T>) => Promise<any>;
declare type GridUpdate<T> = (value: T, x: number, y: number, grid: Grid<T>) => T;
declare type GridMatch<T> = (value: T, x: number, y: number, grid: Grid<T>) => boolean;
declare type GridFormat<T> = (value: T, x: number, y: number) => string;
declare class Grid<T> extends Array<Array<T>> {
    protected _width: number;
    protected _height: number;
    constructor(w: number, h: number, v: GridInit<T> | T);
    get width(): number;
    get height(): number;
    get(x: number, y: number): T | undefined;
    set(x: number, y: number, v: T): boolean;
    /**
     * Calls the supplied function for each cell in the grid.
     * @param fn - The function to call on each item in the grid.
     */
     // @ts-ignore

    forEach(fn: GridEach<T>): void;
    forEachAsync(fn: AsyncGridEach<T>): Promise<void>;
    eachNeighbor(x: number, y: number, fn: GridEach<T>, only4dirs?: boolean): void;
    eachNeighborAsync(x: number, y: number, fn: AsyncGridEach<T>, only4dirs?: boolean): Promise<void>;
    forRect(x: number, y: number, w: number, h: number, fn: GridEach<T>): void;
    randomEach(fn: GridEach<T>): void;
    /**
     * Returns a new Grid with the cells mapped according to the supplied function.
     * @param fn - The function that maps the cell values
     * TODO - Do we need this???
     * TODO - Should this only be in NumGrid?
     * TODO - Should it alloc instead of using constructor?
     */
     // @ts-ignore

    map(fn: GridEach<T>): any;
    /**
     * Returns whether or not an item in the grid matches the provided function.
     * @param fn - The function that matches
     * TODO - Do we need this???
     * TODO - Should this only be in NumGrid?
     * TODO - Should it alloc instead of using constructor?
     */
     // @ts-ignore

    some(fn: GridMatch<T>): boolean;
    forCircle(x: number, y: number, radius: number, fn: GridEach<T>): void;
    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;
    calcBounds(): {
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
    update(fn: GridUpdate<T>): void;
    updateRect(x: number, y: number, width: number, height: number, fn: GridUpdate<T>): void;
    updateCircle(x: number, y: number, radius: number, fn: GridUpdate<T>): void;
    /**
     * Fills the entire grid with the supplied value
     * @param v - The fill value or a function that returns the fill value.
     */
     // @ts-ignore

    fill(v: T | GridUpdate<T>): void;
    fillRect(x: number, y: number, w: number, h: number, v: T | GridUpdate<T>): void;
    fillCircle(x: number, y: number, radius: number, v: T | GridUpdate<T>): void;
    replace(findValue: T, replaceValue: T): void;
    copy(from: Grid<T>): void;
    count(match: GridMatch<T> | T): number;
    dump(fmtFn?: GridFormat<T>, log?: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    }): void;
    dumpRect(left: number, top: number, width: number, height: number, fmtFn?: GridFormat<T>, log?: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    }): void;
    dumpAround(x: number, y: number, radius: number, fmtFn?: GridFormat<T>, log?: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    }): void;
    closestMatchingLoc(x: number, y: number, v: T | GridMatch<T>): Loc;
    firstMatchingLoc(v: T | GridMatch<T>): Loc;
    randomMatchingLoc(v: T | GridMatch<T>): Loc;
    matchingLocNear(x: number, y: number, v: T | GridMatch<T>): Loc;
    arcCount(x: number, y: number, testFn: GridMatch<T>): number;
}
declare const stats: {
    active: number;
    alloc: number;
    create: number;
    free: number;
};
declare class NumGrid extends Grid<number> {
    x?: number;
    y?: number;
    static alloc(w: number, h: number, v: GridInit<number> | number): NumGrid;
    static alloc(w: number, h: number): NumGrid;
    static alloc(source: NumGrid): NumGrid;
    static free(grid: NumGrid): void;
    constructor(w: number, h: number, v?: GridInit<number> | number);
    protected _resize(width: number, height: number, v?: GridInit<number> | number): void;
    findReplaceRange(findValueMin: number, findValueMax: number, fillValue: number): void;
    floodFillRange(x: number, y: number, eligibleValueMin?: number, eligibleValueMax?: number, fillValue?: number): number;
    invert(): void;
    leastPositiveValue(): number;
    randomLeastPositiveLoc(): Loc;
    valueBounds(value: number, bounds?: Bounds): Bounds;
    floodFill(x: number, y: number, matchValue: number | GridMatch<number>, fillValue: number | GridUpdate<number>): number;
}
declare const alloc: typeof NumGrid.alloc;
declare const free: typeof NumGrid.free;
declare function make$9<T>(w: number, h: number, v?: number | GridInit<number>): NumGrid;
declare function make$9<T>(w: number, h: number, v?: T | GridInit<T>): Grid<T>;
declare type GridZip<T, U> = (destVal: T, sourceVal: U, destX: number, destY: number, sourceX: number, sourceY: number, destGrid: Grid<T>, sourceGrid: Grid<U>) => void;
declare function offsetZip<T, U>(destGrid: Grid<T>, srcGrid: Grid<U>, srcToDestX: number, srcToDestY: number, value: T | GridZip<T, U>): void;
declare function intersection(onto: NumGrid, a: NumGrid, b?: NumGrid): void;
declare function unite(onto: NumGrid, a: NumGrid, b?: NumGrid): void;

type grid_d_ArrayInit<_0> = ArrayInit<_0>;
declare const grid_d_makeArray: typeof makeArray;
type grid_d_GridInit<_0> = GridInit<_0>;
type grid_d_GridEach<_0> = GridEach<_0>;
type grid_d_AsyncGridEach<_0> = AsyncGridEach<_0>;
type grid_d_GridUpdate<_0> = GridUpdate<_0>;
type grid_d_GridMatch<_0> = GridMatch<_0>;
type grid_d_GridFormat<_0> = GridFormat<_0>;
type grid_d_Grid<_0> = Grid<_0>;
declare const grid_d_Grid: typeof Grid;
declare const grid_d_stats: typeof stats;
type grid_d_NumGrid = NumGrid;
declare const grid_d_NumGrid: typeof NumGrid;
declare const grid_d_alloc: typeof alloc;
declare const grid_d_free: typeof free;
type grid_d_GridZip<_0, _1> = GridZip<_0, _1>;
declare const grid_d_offsetZip: typeof offsetZip;
declare const grid_d_intersection: typeof intersection;
declare const grid_d_unite: typeof unite;
declare namespace grid_d {
  export {
    grid_d_ArrayInit as ArrayInit,
    grid_d_makeArray as makeArray,
    grid_d_GridInit as GridInit,
    grid_d_GridEach as GridEach,
    grid_d_AsyncGridEach as AsyncGridEach,
    grid_d_GridUpdate as GridUpdate,
    grid_d_GridMatch as GridMatch,
    grid_d_GridFormat as GridFormat,
    grid_d_Grid as Grid,
    grid_d_stats as stats,
    grid_d_NumGrid as NumGrid,
    grid_d_alloc as alloc,
    grid_d_free as free,
    make$9 as make,
    grid_d_GridZip as GridZip,
    grid_d_offsetZip as offsetZip,
    grid_d_intersection as intersection,
    grid_d_unite as unite,
  };
}

interface Event$1 {
    shiftKey: boolean;
    ctrlKey: boolean;
    altKey: boolean;
    metaKey: boolean;
    type: string;
    key: string | null;
    code: string | null;
    x: number;
    y: number;
    clientX: number;
    clientY: number;
    dir: Loc$1 | null;
    dt: number;
}
declare type CommandFn = (event: Event$1) => Promise<boolean>;
declare var commands: Record<string, CommandFn>;
declare function addCommand(id: string, fn: CommandFn): void;
declare type KeyMap = Record<string, CommandFn | boolean>;
declare type EventMatchFn = (event: Event$1) => boolean;
declare const KEYPRESS = "keypress";
declare const MOUSEMOVE = "mousemove";
declare const CLICK = "click";
declare const TICK = "tick";
declare const MOUSEUP = "mouseup";
declare type EventHandler = (event: Event$1) => void;
declare function setKeymap(keymap: KeyMap): void;
declare function dispatchEvent(ev: Event$1, km?: KeyMap | CommandFn): Promise<any>;
declare function makeTickEvent(dt: number): Event$1;
declare function makeKeyEvent(e: KeyboardEvent): Event$1;
declare function keyCodeDirection(key: string): Loc$1 | null;
declare function ignoreKeyEvent(e: KeyboardEvent): boolean;
declare function onkeydown(e: KeyboardEvent): void;
declare function makeMouseEvent(e: MouseEvent, x: number, y: number): Event$1;
declare class Loop {
    running: boolean;
    events: Event$1[];
    mouse: XY;
    protected CURRENT_HANDLER: EventHandler | null;
    protected PAUSED: EventHandler | null;
    protected LAST_CLICK: XY;
    constructor();
    hasEvents(): number;
    clearEvents(): void;
    pushEvent(ev: Event$1): void;
    nextEvent(ms?: number, match?: EventMatchFn): Promise<Event$1 | null>;
    run(keymap: KeyMap, ms?: number): Promise<void>;
    stop(): void;
    pauseEvents(): void;
    resumeEvents(): void;
    tickMs(ms?: number): Promise<unknown>;
    nextKeyPress(ms?: number, match?: EventMatchFn): Promise<Event$1 | null>;
    nextKeyOrClick(ms?: number, matchFn?: EventMatchFn): Promise<Event$1 | null>;
    pause(ms: number): Promise<boolean | null>;
    waitForAck(): Promise<boolean | null>;
}
declare function make$8(): Loop;
declare const loop: Loop;

type io_d_CommandFn = CommandFn;
declare const io_d_commands: typeof commands;
declare const io_d_addCommand: typeof addCommand;
type io_d_KeyMap = KeyMap;
type io_d_EventMatchFn = EventMatchFn;
declare const io_d_KEYPRESS: typeof KEYPRESS;
declare const io_d_MOUSEMOVE: typeof MOUSEMOVE;
declare const io_d_CLICK: typeof CLICK;
declare const io_d_TICK: typeof TICK;
declare const io_d_MOUSEUP: typeof MOUSEUP;
declare const io_d_setKeymap: typeof setKeymap;
declare const io_d_dispatchEvent: typeof dispatchEvent;
declare const io_d_makeTickEvent: typeof makeTickEvent;
declare const io_d_makeKeyEvent: typeof makeKeyEvent;
declare const io_d_keyCodeDirection: typeof keyCodeDirection;
declare const io_d_ignoreKeyEvent: typeof ignoreKeyEvent;
declare const io_d_onkeydown: typeof onkeydown;
declare const io_d_makeMouseEvent: typeof makeMouseEvent;
type io_d_Loop = Loop;
declare const io_d_Loop: typeof Loop;
declare const io_d_loop: typeof loop;
declare namespace io_d {
  export {
    Event$1 as Event,
    io_d_CommandFn as CommandFn,
    io_d_commands as commands,
    io_d_addCommand as addCommand,
    io_d_KeyMap as KeyMap,
    io_d_EventMatchFn as EventMatchFn,
    io_d_KEYPRESS as KEYPRESS,
    io_d_MOUSEMOVE as MOUSEMOVE,
    io_d_CLICK as CLICK,
    io_d_TICK as TICK,
    io_d_MOUSEUP as MOUSEUP,
    io_d_setKeymap as setKeymap,
    io_d_dispatchEvent as dispatchEvent,
    io_d_makeTickEvent as makeTickEvent,
    io_d_makeKeyEvent as makeKeyEvent,
    io_d_keyCodeDirection as keyCodeDirection,
    io_d_ignoreKeyEvent as ignoreKeyEvent,
    io_d_onkeydown as onkeydown,
    io_d_makeMouseEvent as makeMouseEvent,
    io_d_Loop as Loop,
    make$8 as make,
    io_d_loop as loop,
  };
}

declare enum FovFlags {
    VISIBLE,
    WAS_VISIBLE,
    CLAIRVOYANT_VISIBLE,
    WAS_CLAIRVOYANT_VISIBLE,
    TELEPATHIC_VISIBLE,
    WAS_TELEPATHIC_VISIBLE,
    ITEM_DETECTED,
    WAS_ITEM_DETECTED,
    MONSTER_DETECTED,
    WAS_MONSTER_DETECTED,
    REVEALED,
    MAGIC_MAPPED,
    IN_FOV,
    WAS_IN_FOV,
    ALWAYS_VISIBLE,
    ANY_KIND_OF_VISIBLE,
    IS_WAS_ANY_KIND_OF_VISIBLE,
    WAS_ANY_KIND_OF_VISIBLE,
    PLAYER,
    CLAIRVOYANT,
    TELEPATHIC,
    VIEWPORT_TYPES
}

interface FovStrategy {
    isBlocked(x: number, y: number): boolean;
    calcRadius?(x: number, y: number): number;
    hasXY?(x: number, y: number): boolean;
    debug?(...args: any[]): void;
}
declare type SetVisibleFn = (x: number, y: number, v: number) => void;
declare type ViewportCb = (x: number, y: number, radius: number, type: number) => void;
interface FovSite {
    readonly width: number;
    readonly height: number;
    eachViewport(cb: ViewportCb): void;
    lightingChanged(): boolean;
    hasVisibleLight(x: number, y: number): boolean;
    blocksVision(x: number, y: number): boolean;
    onCellRevealed(x: number, y: number): void;
    redrawCell(x: number, y: number, clearMemory?: boolean): void;
    storeMemory(x: number, y: number): void;
}
interface FovSystemType {
    isAnyKindOfVisible(x: number, y: number): boolean;
    isInFov(x: number, y: number): boolean;
    isDirectlyVisible(x: number, y: number): boolean;
    isMagicMapped(x: number, y: number): boolean;
    isRevealed(x: number, y: number): boolean;
    readonly changed: boolean;
    viewportChanged: boolean;
    makeAlwaysVisible(): void;
    makeCellAlwaysVisible(x: number, y: number): void;
    revealAll(): void;
    revealCell(x: number, y: number, isMagicMapped: boolean): void;
    hideCell(x: number, y: number): void;
    magicMapCell(x: number, y: number): void;
    update(): boolean;
}

declare class FOV {
    protected _isBlocked: (x: number, y: number) => boolean;
    protected _calcRadius: (x: number, y: number) => number;
    protected _setVisible: SetVisibleFn | null;
    protected _hasXY: (x: number, y: number) => boolean;
    protected _debug: (...args: any[]) => void;
    protected _startX: number;
    protected _startY: number;
    protected _maxRadius: number;
    constructor(strategy: FovStrategy);
    calculate(x: number, y: number, maxRadius: number | undefined, setVisible: SetVisibleFn): void;
    castLight(row: number, startSlope: number, endSlope: number, xx: number, xy: number, yx: number, yy: number): void;
}

interface FovSystemOptions {
    revealed: boolean;
    visible: boolean;
    fov: boolean;
}
declare class FovSystem implements FovSystemType {
    site: FovSite;
    flags: NumGrid;
    fov: FOV;
    protected _changed: boolean;
    viewportChanged: boolean;
    constructor(site: FovSite, opts?: Partial<FovSystemOptions>);
    get changed(): boolean;
    isVisible(x: number, y: number): boolean;
    isAnyKindOfVisible(x: number, y: number): boolean;
    isInFov(x: number, y: number): boolean;
    isDirectlyVisible(x: number, y: number): boolean;
    isMagicMapped(x: number, y: number): boolean;
    isRevealed(x: number, y: number): boolean;
    makeAlwaysVisible(): void;
    makeCellAlwaysVisible(x: number, y: number): void;
    revealAll(): void;
    revealCell(x: number, y: number): void;
    hideCell(x: number, y: number): void;
    magicMapCell(x: number, y: number): void;
    protected demoteCellVisibility(flag: number): number;
    protected updateCellVisibility(flag: number, x: number, y: number): boolean;
    protected updateCellClairyvoyance(flag: number, x: number, y: number): boolean;
    protected updateCellTelepathy(flag: number, x: number, y: number): boolean;
    protected updateCellDetect(flag: number, x: number, y: number): boolean;
    protected promoteCellVisibility(flag: number, x: number, y: number): void;
    update(): boolean;
    update(x: number, y: number, r: number): boolean;
}

type index_d$a_FovFlags = FovFlags;
declare const index_d$a_FovFlags: typeof FovFlags;
type index_d$a_FovStrategy = FovStrategy;
type index_d$a_SetVisibleFn = SetVisibleFn;
type index_d$a_ViewportCb = ViewportCb;
type index_d$a_FovSite = FovSite;
type index_d$a_FovSystemType = FovSystemType;
type index_d$a_FOV = FOV;
declare const index_d$a_FOV: typeof FOV;
type index_d$a_FovSystemOptions = FovSystemOptions;
type index_d$a_FovSystem = FovSystem;
declare const index_d$a_FovSystem: typeof FovSystem;
declare namespace index_d$a {
  export {
    index_d$a_FovFlags as FovFlags,
    index_d$a_FovStrategy as FovStrategy,
    index_d$a_SetVisibleFn as SetVisibleFn,
    index_d$a_ViewportCb as ViewportCb,
    index_d$a_FovSite as FovSite,
    index_d$a_FovSystemType as FovSystemType,
    index_d$a_FOV as FOV,
    index_d$a_FovSystemOptions as FovSystemOptions,
    index_d$a_FovSystem as FovSystem,
  };
}

declare const FORBIDDEN = -1;
declare const OBSTRUCTION = -2;
declare const AVOIDED = 10;
declare const NO_PATH = 30000;
declare type BlockedFn = (toX: number, toY: number, fromX: number, fromY: number, distanceMap: NumGrid) => boolean;
declare function calculateDistances(distanceMap: NumGrid, destinationX: number, destinationY: number, costMap: NumGrid, eightWays?: boolean, maxDistance?: number): void;
declare function nextStep(distanceMap: NumGrid, x: number, y: number, isBlocked: BlockedFn, useDiagonals?: boolean): Loc$1;
declare function getPath(distanceMap: NumGrid, originX: number, originY: number, isBlocked: BlockedFn): number[][] | null;

declare const path_d_FORBIDDEN: typeof FORBIDDEN;
declare const path_d_OBSTRUCTION: typeof OBSTRUCTION;
declare const path_d_AVOIDED: typeof AVOIDED;
declare const path_d_NO_PATH: typeof NO_PATH;
type path_d_BlockedFn = BlockedFn;
declare const path_d_calculateDistances: typeof calculateDistances;
declare const path_d_nextStep: typeof nextStep;
declare const path_d_getPath: typeof getPath;
declare namespace path_d {
  export {
    path_d_FORBIDDEN as FORBIDDEN,
    path_d_OBSTRUCTION as OBSTRUCTION,
    path_d_AVOIDED as AVOIDED,
    path_d_NO_PATH as NO_PATH,
    path_d_BlockedFn as BlockedFn,
    path_d_calculateDistances as calculateDistances,
    path_d_nextStep as nextStep,
    path_d_getPath as getPath,
  };
}

declare type EventFn = (...args: any[]) => Promise<any>;
/**
 * Data for an event listener.
 */
declare class Listener implements Chainable<Listener> {
    fn: EventFn;
    context: any;
    once: boolean;
    next: Listener | null;
    /**
     * Creates a Listener.
     * @param {Function} fn The listener function.
     * @param {Object} [context=null] The context to invoke the listener with.
     * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
     */
    constructor(fn: EventFn, context?: any, once?: boolean);
    /**
     * Compares this Listener to the parameters.
     * @param {Function} fn - The function
     * @param {Object} [context] - The context Object.
     * @param {Boolean} [once] - Whether or not it is a one time handler.
     * @returns Whether or not this Listener matches the parameters.
     */
    matches(fn: EventFn, context?: any, once?: boolean): boolean;
}
/**
 * Add a listener for a given event.
 *
 * @param {String} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {Listener}
 */
declare function addListener(event: string, fn: EventFn, context?: any, once?: boolean): Listener;
/**
 * Add a listener for a given event.
 *
 * @param {String} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {Listener}
 */
declare function on(event: string, fn: EventFn, context?: any, once?: boolean): Listener;
/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
declare function once(event: string, fn: EventFn, context?: any): Listener;
/**
 * Remove the listeners of a given event.
 *
 * @param {String} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
declare function removeListener(event: string, fn: EventFn, context?: any, once?: boolean): boolean;
/**
 * Remove the listeners of a given event.
 *
 * @param {String} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
declare function off(event: string, fn: EventFn, context?: any, once?: boolean): boolean;
/**
 * Clear event by name.
 *
 * @param {String} evt The Event name.
 */
declare function clearEvent(event: string): void;
/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
declare function removeAllListeners(event?: string): void;
/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {String} event The event name.
 * @param {...*} args The additional arguments to the event handlers.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
declare function emit(...args: any[]): Promise<boolean>;

type events_d_EventFn = EventFn;
type events_d_Listener = Listener;
declare const events_d_Listener: typeof Listener;
declare const events_d_addListener: typeof addListener;
declare const events_d_on: typeof on;
declare const events_d_once: typeof once;
declare const events_d_removeListener: typeof removeListener;
declare const events_d_off: typeof off;
declare const events_d_clearEvent: typeof clearEvent;
declare const events_d_removeAllListeners: typeof removeAllListeners;
declare const events_d_emit: typeof emit;
declare namespace events_d {
  export {
    events_d_EventFn as EventFn,
    events_d_Listener as Listener,
    events_d_addListener as addListener,
    events_d_on as on,
    events_d_once as once,
    events_d_removeListener as removeListener,
    events_d_off as off,
    events_d_clearEvent as clearEvent,
    events_d_removeAllListeners as removeAllListeners,
    events_d_emit as emit,
  };
}

declare type FrequencyFn = (danger: number) => number;
declare type FrequencyConfig = FrequencyFn | number | string | Record<string, number> | null;
declare function make$7(v?: FrequencyConfig): FrequencyFn;

type frequency_d_FrequencyFn = FrequencyFn;
type frequency_d_FrequencyConfig = FrequencyConfig;
declare namespace frequency_d {
  export {
    frequency_d_FrequencyFn as FrequencyFn,
    frequency_d_FrequencyConfig as FrequencyConfig,
    make$7 as make,
  };
}

declare type ScheduleFn = Function;
interface Event {
    fn: ScheduleFn | null;
    time: number;
    next: Event | null;
}
declare class Scheduler {
    private next;
    time: number;
    private cache;
    constructor();
    clear(): void;
    push(fn: ScheduleFn, delay?: number): Event;
    pop(): Function | null;
    remove(item: Event): void;
}

type scheduler_d_ScheduleFn = ScheduleFn;
type scheduler_d_Scheduler = Scheduler;
declare const scheduler_d_Scheduler: typeof Scheduler;
declare namespace scheduler_d {
  export {
    scheduler_d_ScheduleFn as ScheduleFn,
    scheduler_d_Scheduler as Scheduler,
  };
}

declare type CTX = CanvasRenderingContext2D;
declare type DrawFunction = (ctx: CTX, x: number, y: number, width: number, height: number) => void;
declare type DrawType = string | DrawFunction;
interface GlyphOptions {
    font: string;
    fontSize: number;
    size: number;
    tileWidth: number;
    tileHeight: number;
    basicOnly: boolean;
    basic: boolean;
}
declare class Glyphs {
    private _node;
    private _ctx;
    private _tileWidth;
    private _tileHeight;
    needsUpdate: boolean;
    private _map;
    static fromImage(src: string | HTMLImageElement): Glyphs;
    static fromFont(src: Partial<GlyphOptions> | string): Glyphs;
    private constructor();
    get node(): HTMLCanvasElement;
    get ctx(): CanvasRenderingContext2D;
    get tileWidth(): number;
    get tileHeight(): number;
    get pxWidth(): number;
    get pxHeight(): number;
    forChar(ch: string): number;
    private _configure;
    draw(n: number, ch: DrawType): void;
    _initGlyphs(basicOnly?: boolean): void;
}

interface DrawInfo {
    ch: string | number;
    fg: ColorBase;
    bg: ColorBase;
}
declare class Mixer implements DrawInfo {
    ch: string | number;
    fg: Color;
    bg: Color;
    constructor(base?: Partial<DrawInfo>);
    protected _changed(): this;
    copy(other: DrawInfo): this;
    clone(): Mixer;
    equals(other: Mixer): boolean;
    get dances(): boolean;
    nullify(): this;
    blackOut(): this;
    draw(ch?: string | number, fg?: ColorBase, bg?: ColorBase): this;
    drawSprite(src: SpriteData$1 | Mixer, opacity?: number): this | undefined;
    invert(): this;
    multiply(color: ColorBase, fg?: boolean, bg?: boolean): this;
    scale(multiplier: number, fg?: boolean, bg?: boolean): this;
    mix(color: ColorBase, fg?: number, bg?: number): this;
    add(color: ColorBase, fg?: number, bg?: number): this;
    separate(): this;
    bake(clearDancing?: boolean): {
        ch: string | number;
        fg: number;
        bg: number;
    };
    toString(): string;
}
declare function makeMixer(base?: Partial<DrawInfo>): Mixer;

interface DrawData {
    glyph: number;
    fg: number;
    bg: number;
}
interface BufferTarget {
    readonly width: number;
    readonly height: number;
    copyTo(dest: Uint32Array): void;
    copy(src: Uint32Array): void;
    toGlyph(ch: string | number): number;
}
declare class DataBuffer {
    protected _data: Uint32Array;
    private _width;
    private _height;
    constructor(width: number, height: number);
    get width(): number;
    get height(): number;
    resize(width: number, height: number): void;
    get(x: number, y: number): DrawData;
    toGlyph(ch: string | number): number;
    draw(x: number, y: number, glyph?: number | string, fg?: ColorBase, // TODO - White?
    bg?: ColorBase): this;
    drawSprite(x: number, y: number, sprite: Partial<DrawInfo>): this;
    blackOut(x: number, y: number): void;
    blackOut(): void;
    fill(glyph?: number | string, fg?: number, bg?: number): this;
    copy(other: DataBuffer): this;
    drawText(x: number, y: number, text: string, fg?: ColorBase, bg?: ColorBase): number;
    wrapText(x: number, y: number, width: number, text: string, fg?: Color | number | string, bg?: Color | number | string, indent?: number): number;
    fillRect(x: number, y: number, w: number, h: number, ch?: string | number | null, fg?: ColorBase | null, bg?: ColorBase | null): this;
    blackOutRect(x: number, y: number, w: number, h: number, bg?: ColorBase): this;
    highlight(x: number, y: number, color: ColorBase, strength: number): this;
    mix(color: ColorBase, percent: number): this;
    dump(): void;
}
declare function makeDataBuffer(width: number, height: number): DataBuffer;
declare class Buffer extends DataBuffer {
    private _target;
    constructor(canvas: BufferTarget);
    toGlyph(ch: string | number): number;
    render(): this;
    load(): this;
}
declare function makeBuffer(width: number, height: number): DataBuffer;
declare function makeBuffer(canvas: BufferTarget): Buffer;

declare type MouseEventFn = (ev: Event$1) => void;
interface BaseOptions {
    width: number;
    height: number;
    glyphs: Glyphs;
    div: HTMLElement | string;
    io: boolean;
    loop: Loop;
    image: HTMLImageElement | string;
}
declare type CanvasOptions = BaseOptions & GlyphOptions;
declare class NotSupportedError extends Error {
    constructor(...params: any[]);
}
declare abstract class BaseCanvas implements BufferTarget {
    mouse: XY;
    protected _data: Uint32Array;
    protected _renderRequested: boolean;
    protected _glyphs: Glyphs;
    protected _node: HTMLCanvasElement;
    protected _width: number;
    protected _height: number;
    protected _buffer: Buffer;
    constructor(width: number, height: number, glyphs: Glyphs);
    get node(): HTMLCanvasElement;
    get width(): number;
    get height(): number;
    get tileWidth(): number;
    get tileHeight(): number;
    get pxWidth(): number;
    get pxHeight(): number;
    get glyphs(): Glyphs;
    set glyphs(glyphs: Glyphs);
    toGlyph(ch: string | number): number;
    get buffer(): Buffer;
    protected _createNode(): HTMLCanvasElement;
    protected abstract _createContext(): void;
    private _configure;
    protected _setGlyphs(glyphs: Glyphs): boolean;
    resize(width: number, height: number): void;
    protected _requestRender(): void;
    copy(data: Uint32Array): void;
    copyTo(data: Uint32Array): void;
    render(): void;
    abstract _render(): void;
    hasXY(x: number, y: number): boolean;
    set onclick(fn: MouseEventFn | null);
    set onmousemove(fn: MouseEventFn | null);
    set onmouseup(fn: MouseEventFn | null);
    protected _toX(offsetX: number): number;
    protected _toY(offsetY: number): number;
}
declare class Canvas extends BaseCanvas {
    private _gl;
    private _buffers;
    private _attribs;
    private _uniforms;
    private _texture;
    constructor(width: number, height: number, glyphs: Glyphs);
    protected _createContext(): void;
    private _createGeometry;
    private _createData;
    protected _setGlyphs(glyphs: Glyphs): boolean;
    _uploadGlyphs(): void;
    resize(width: number, height: number): void;
    copy(data: Uint32Array): void;
    copyTo(data: Uint32Array): void;
    _render(): void;
}
declare class Canvas2D extends BaseCanvas {
    private _ctx;
    private _changed;
    constructor(width: number, height: number, glyphs: Glyphs);
    protected _createContext(): void;
    resize(width: number, height: number): void;
    copy(data: Uint32Array): void;
    _render(): void;
    protected _renderCell(index: number): void;
}
declare function make$6(opts: Partial<CanvasOptions>): BaseCanvas;
declare function make$6(width: number, height: number, opts?: Partial<CanvasOptions>): BaseCanvas;

type index_d$9_MouseEventFn = MouseEventFn;
type index_d$9_CanvasOptions = CanvasOptions;
type index_d$9_NotSupportedError = NotSupportedError;
declare const index_d$9_NotSupportedError: typeof NotSupportedError;
type index_d$9_BaseCanvas = BaseCanvas;
declare const index_d$9_BaseCanvas: typeof BaseCanvas;
type index_d$9_Canvas = Canvas;
declare const index_d$9_Canvas: typeof Canvas;
type index_d$9_Canvas2D = Canvas2D;
declare const index_d$9_Canvas2D: typeof Canvas2D;
type index_d$9_GlyphOptions = GlyphOptions;
type index_d$9_Glyphs = Glyphs;
declare const index_d$9_Glyphs: typeof Glyphs;
type index_d$9_DrawData = DrawData;
type index_d$9_BufferTarget = BufferTarget;
type index_d$9_DataBuffer = DataBuffer;
declare const index_d$9_DataBuffer: typeof DataBuffer;
declare const index_d$9_makeDataBuffer: typeof makeDataBuffer;
type index_d$9_Buffer = Buffer;
declare const index_d$9_Buffer: typeof Buffer;
declare const index_d$9_makeBuffer: typeof makeBuffer;
declare namespace index_d$9 {
  export {
    index_d$9_MouseEventFn as MouseEventFn,
    index_d$9_CanvasOptions as CanvasOptions,
    index_d$9_NotSupportedError as NotSupportedError,
    index_d$9_BaseCanvas as BaseCanvas,
    index_d$9_Canvas as Canvas,
    index_d$9_Canvas2D as Canvas2D,
    make$6 as make,
    index_d$9_GlyphOptions as GlyphOptions,
    index_d$9_Glyphs as Glyphs,
    index_d$9_DrawData as DrawData,
    index_d$9_BufferTarget as BufferTarget,
    index_d$9_DataBuffer as DataBuffer,
    index_d$9_makeDataBuffer as makeDataBuffer,
    index_d$9_Buffer as Buffer,
    index_d$9_makeBuffer as makeBuffer,
  };
}

interface SpriteConfig {
    ch: string | null;
    fg: ColorBase | null;
    bg: ColorBase | null;
    opacity: number;
}
declare class Sprite implements SpriteData$1 {
    ch: string | null;
    fg: Color;
    bg: Color;
    opacity: number;
    name?: string;
    constructor(ch?: string | null, fg?: ColorBase | null, bg?: ColorBase | null, opacity?: number);
    clone(): Sprite;
    toString(): string;
}
declare const sprites: Record<string, Sprite>;
declare function make$5(): Sprite;
declare function make$5(bg: ColorBase, opacity?: number): Sprite;
declare function make$5(ch: string | null, fg: ColorBase | null, bg: ColorBase | null, opacity?: number): Sprite;
declare function make$5(args: any[]): Sprite;
declare function make$5(info: Partial<SpriteConfig>): Sprite;
declare function from$3(name: string): Sprite;
declare function from$3(config: Partial<SpriteConfig>): Sprite;
declare function install$4(name: string, bg: ColorBase, opacity?: number): Sprite;
declare function install$4(name: string, ch: string | null, fg: Color | number | string | number[] | null, bg: Color | number | string | number[] | null, opacity?: number): Sprite;
declare function install$4(name: string, args: any[]): Sprite;
declare function install$4(name: string, info: Partial<SpriteConfig>): Sprite;

interface SpriteData {
    readonly ch: string | null;
    readonly fg: ColorBase;
    readonly bg: ColorBase;
    readonly opacity: number;
}

type index_d$8_SpriteConfig = SpriteConfig;
type index_d$8_Sprite = Sprite;
declare const index_d$8_Sprite: typeof Sprite;
declare const index_d$8_sprites: typeof sprites;
type index_d$8_DrawInfo = DrawInfo;
type index_d$8_Mixer = Mixer;
declare const index_d$8_Mixer: typeof Mixer;
declare const index_d$8_makeMixer: typeof makeMixer;
type index_d$8_SpriteData = SpriteData;
declare namespace index_d$8 {
  export {
    index_d$8_SpriteConfig as SpriteConfig,
    index_d$8_Sprite as Sprite,
    index_d$8_sprites as sprites,
    make$5 as make,
    from$3 as from,
    install$4 as install,
    index_d$8_DrawInfo as DrawInfo,
    index_d$8_Mixer as Mixer,
    index_d$8_makeMixer as makeMixer,
    index_d$8_SpriteData as SpriteData,
  };
}

declare type Args = Record<string, any>;
declare type Template = (args: Args) => any;
declare function compile(template: string): Template;
declare function apply(template: string, args?: {}): any;

declare type EachFn = (ch: string, fg: any, bg: any, i: number, n: number) => void;
declare function eachChar(text: string, fn: EachFn, fg?: any, bg?: any): void;

declare function length(text: string): number;
declare function firstChar(text: string): string | null;
declare function padStart(text: string, width: number, pad?: string): string;
declare function padEnd(text: string, width: number, pad?: string): string;
declare function center(text: string, width: number, pad?: string): string;
declare function capitalize(text: string): string;
declare function removeColors(text: string): string;

declare function wordWrap(text: string, width: number, indent?: number): string;
declare function splitIntoLines(source: string, width: number, indent?: number): string[];

declare var options: {
    colorStart: string;
    colorEnd: string;
    field: string;
    defaultFg: null;
    defaultBg: null;
};
declare function addHelper(name: string, fn: Function): void;

interface Options {
    fg?: any;
    bg?: any;
    colorStart?: string;
    colorEnd?: string;
    field?: string;
}
declare function configure(opts?: Options): void;

declare const index_d$7_compile: typeof compile;
declare const index_d$7_apply: typeof apply;
declare const index_d$7_eachChar: typeof eachChar;
declare const index_d$7_length: typeof length;
declare const index_d$7_padStart: typeof padStart;
declare const index_d$7_padEnd: typeof padEnd;
declare const index_d$7_center: typeof center;
declare const index_d$7_firstChar: typeof firstChar;
declare const index_d$7_capitalize: typeof capitalize;
declare const index_d$7_removeColors: typeof removeColors;
declare const index_d$7_wordWrap: typeof wordWrap;
declare const index_d$7_splitIntoLines: typeof splitIntoLines;
declare const index_d$7_configure: typeof configure;
declare const index_d$7_addHelper: typeof addHelper;
declare const index_d$7_options: typeof options;
type index_d$7_Template = Template;
declare namespace index_d$7 {
  export {
    index_d$7_compile as compile,
    index_d$7_apply as apply,
    index_d$7_eachChar as eachChar,
    index_d$7_length as length,
    index_d$7_padStart as padStart,
    index_d$7_padEnd as padEnd,
    index_d$7_center as center,
    index_d$7_firstChar as firstChar,
    index_d$7_capitalize as capitalize,
    index_d$7_removeColors as removeColors,
    index_d$7_wordWrap as wordWrap,
    index_d$7_splitIntoLines as splitIntoLines,
    index_d$7_configure as configure,
    index_d$7_addHelper as addHelper,
    index_d$7_options as options,
    index_d$7_Template as Template,
  };
}

declare const templates: Record<string, Template>;
declare function install$3(id: string, msg: string): Template;
declare function installAll$3(config: Record<string, string>): void;
interface MessageHandler {
    addMessage(x: number, y: number, msg: string): void;
    addCombatMessage(x: number, y: number, msg: string): void;
}
declare const handlers$1: MessageHandler[];
declare function add(msg: string, args?: any): void;
declare function addAt(x: number, y: number, msg: string, args?: any): void;
declare function addCombat(x: number, y: number, msg: string, args?: any): void;
interface CacheOptions {
    length: number;
    width: number;
}
declare type EachMsgFn = (msg: string, confirmed: boolean, i: number) => any;
declare class MessageCache implements MessageHandler {
    ARCHIVE: (string | null)[];
    CONFIRMED: boolean[];
    ARCHIVE_LINES: number;
    MSG_WIDTH: number;
    NEXT_WRITE_INDEX: number;
    NEEDS_UPDATE: boolean;
    COMBAT_MESSAGE: string | null;
    constructor(opts?: Partial<CacheOptions>);
    get needsUpdate(): boolean;
    set needsUpdate(needs: boolean);
    addMessageLine(msg: string): void;
    addMessage(_x: number, _y: number, msg: string): void;
    _addMessage(msg: string): void;
    addCombatMessage(_x: number, _y: number, msg: string): void;
    _addCombatMessage(msg: string): void;
    commitCombatMessage(): boolean;
    confirmAll(): void;
    forEach(fn: EachMsgFn): void;
}

declare const message_d_templates: typeof templates;
type message_d_MessageHandler = MessageHandler;
declare const message_d_add: typeof add;
declare const message_d_addAt: typeof addAt;
declare const message_d_addCombat: typeof addCombat;
type message_d_CacheOptions = CacheOptions;
type message_d_EachMsgFn = EachMsgFn;
type message_d_MessageCache = MessageCache;
declare const message_d_MessageCache: typeof MessageCache;
declare namespace message_d {
  export {
    message_d_templates as templates,
    install$3 as install,
    installAll$3 as installAll,
    message_d_MessageHandler as MessageHandler,
    handlers$1 as handlers,
    message_d_add as add,
    message_d_addAt as addAt,
    message_d_addCombat as addCombat,
    message_d_CacheOptions as CacheOptions,
    message_d_EachMsgFn as EachMsgFn,
    message_d_MessageCache as MessageCache,
  };
}

declare enum Effect {
    E_NEXT_ALWAYS,
    E_NEXT_EVERYWHERE,
    E_FIRED,
    E_NO_MARK_FIRED,
    E_PROTECTED,
    E_TREAT_AS_BLOCKING,
    E_PERMIT_BLOCKING,
    E_ABORT_IF_BLOCKS_MAP,
    E_BLOCKED_BY_ITEMS,
    E_BLOCKED_BY_ACTORS,
    E_BLOCKED_BY_OTHER_LAYERS,
    E_SUPERPRIORITY,
    E_SPREAD_CIRCLE,
    E_SPREAD_LINE,
    E_EVACUATE_CREATURES,
    E_EVACUATE_ITEMS,
    E_BUILD_IN_WALLS,
    E_MUST_TOUCH_WALLS,
    E_NO_TOUCH_WALLS,
    E_CLEAR_GROUND,
    E_CLEAR_SURFACE,
    E_CLEAR_LIQUID,
    E_CLEAR_GAS,
    E_CLEAR_TILE,
    E_CLEAR_CELL,
    E_ONLY_IF_EMPTY,
    E_ACTIVATE_DORMANT_MONSTER,
    E_AGGRAVATES_MONSTERS,
    E_RESURRECT_ALLY
}

interface EffectInfo {
    flags: number;
    chance: number;
    next: EffectInfo | string | null;
    id: string;
    [id: string]: any;
}
interface EffectCtx {
    depth?: number;
    force?: boolean;
    grid: NumGrid;
    [id: string]: any;
}
interface EffectConfig {
    flags: FlagBase;
    chance: number;
    next: Partial<EffectConfig> | string | null;
    [id: string]: any;
}
declare type EffectBase = Partial<EffectConfig> | Function;

declare enum GameObject$1 {
    L_SUPERPRIORITY,
    L_SECRETLY_PASSABLE,
    L_BLOCKS_MOVE,
    L_BLOCKS_VISION,
    L_BLOCKS_SURFACE,
    L_BLOCKS_LIQUID,
    L_BLOCKS_GAS,
    L_BLOCKS_ITEMS,
    L_BLOCKS_ACTORS,
    L_BLOCKS_EFFECTS,
    L_BLOCKS_DIAGONAL,
    L_INTERRUPT_WHEN_SEEN,
    L_LIST_IN_SIDEBAR,
    L_VISUALLY_DISTINCT,
    L_BRIGHT_MEMORY,
    L_INVERT_WHEN_HIGHLIGHTED,
    L_BLOCKED_BY_STAIRS,
    L_BLOCKS_SCENT,
    L_DIVIDES_LEVEL,
    L_WAYPOINT_BLOCKER,
    L_WALL_FLAGS,
    L_BLOCKS_EVERYTHING
}
declare enum Depth {
    ALL_LAYERS = -1,
    GROUND = 0,
    SURFACE = 1,
    ITEM = 2,
    ACTOR = 3,
    LIQUID = 4,
    GAS = 5,
    FX = 6,
    UI = 7
}
declare type DepthString = keyof typeof Depth;

type flags_d$1_Depth = Depth;
declare const flags_d$1_Depth: typeof Depth;
type flags_d$1_DepthString = DepthString;
declare namespace flags_d$1 {
  export {
    GameObject$1 as GameObject,
    flags_d$1_Depth as Depth,
    flags_d$1_DepthString as DepthString,
  };
}

interface LightConfig {
    color: ColorBase;
    radius: number;
    fadeTo?: number;
    pass?: boolean;
}
declare type LightBase = LightConfig | string | any[];
interface LightType {
    color: Color;
    radius: Range;
    fadeTo: number;
    passThroughActors: boolean;
    id: string | null;
    paint(map: PaintSite, x: number, y: number, maintainShadows?: boolean, isMinersLight?: boolean): boolean;
}
declare type LightCb = (x: number, y: number, light: LightType) => void;
interface PaintSite {
    readonly width: number;
    readonly height: number;
    calcFov(x: number, y: number, radius: number, passThroughActors: boolean, cb: (x: number, y: number) => void): void;
    addCellLight(x: number, y: number, light: LightValue, dispelShadows: boolean): void;
}
interface LightSystemSite {
    readonly width: number;
    readonly height: number;
    hasXY(x: number, y: number): boolean;
    hasActor(x: number, y: number): boolean;
    blocksVision(x: number, y: number): boolean;
    eachGlowLight(cb: LightCb): void;
    eachDynamicLight(cb: LightCb): void;
}
interface LightSystemType {
    update(force?: boolean): boolean;
    setAmbient(light: LightValue | Color): void;
    getAmbient(): LightValue;
    readonly changed: boolean;
    glowLightChanged: boolean;
    dynamicLightChanged: boolean;
    addStatic(x: number, y: number, light: LightType): void;
    removeStatic(x: number, y: number, light?: LightType): void;
    getLight(x: number, y: number): LightValue;
    lightChanged(x: number, y: number): boolean;
    isLit(x: number, y: number): boolean;
    isDark(x: number, y: number): boolean;
    isInShadow(x: number, y: number): boolean;
}

interface ObjectFlags {
    object: number;
}
interface ObjectType extends Chainable<ObjectType>, XY {
    sprite: Sprite;
    depth: number;
    light: LightType | null;
    flags: ObjectFlags;
}

declare const config$1: {
    INTENSITY_DARK: number;
    INTENSITY_SHADOW: number;
};
declare class Light implements LightType {
    color: Color;
    radius: Range;
    fadeTo: number;
    passThroughActors: boolean;
    id: string | null;
    constructor(color: ColorBase, range: string | Range, fadeTo: number, pass?: boolean);
    copy(other: Light): void;
    get intensity(): number;
    paint(map: PaintSite, x: number, y: number, maintainShadows?: boolean, isMinersLight?: boolean): boolean;
}
declare function intensity(light: Color | LightValue): number;
declare function isDarkLight(light: Color | LightValue, threshold?: number): boolean;
declare function isShadowLight(light: Color | LightValue, threshold?: number): boolean;
declare function make$4(color: ColorBase, radius: RangeBase, fadeTo?: number, pass?: boolean): Light;
declare function make$4(light: LightBase): Light;
declare const lights: Record<string, Light>;
declare function from$2(light: LightBase | LightType): Light;
declare function install$2(id: string, color: ColorBase, radius: RangeBase, fadeTo?: number, pass?: boolean): Light;
declare function install$2(id: string, base: LightBase): Light;
declare function install$2(id: string, config: LightConfig): Light;
declare function installAll$2(config?: Record<string, LightConfig | LightBase>): void;

interface StaticLightInfo {
    x: number;
    y: number;
    light: LightType;
    next: StaticLightInfo | null;
}
interface LightSystemOptions {
    ambient: ColorBase | LightValue;
}
declare class LightSystem implements LightSystemType, PaintSite {
    site: LightSystemSite;
    staticLights: StaticLightInfo | null;
    ambient: LightValue;
    glowLightChanged: boolean;
    dynamicLightChanged: boolean;
    protected _changed: boolean;
    light: Grid<LightValue>;
    oldLight: Grid<LightValue>;
    glowLight: Grid<LightValue>;
    flags: NumGrid;
    constructor(map: LightSystemSite, opts?: Partial<LightSystemOptions>);
    getAmbient(): LightValue;
    setAmbient(light: LightValue | Color): void;
    get anyLightChanged(): boolean;
    get changed(): boolean;
    getLight(x: number, y: number): LightValue;
    isLit(x: number, y: number): boolean;
    isDark(x: number, y: number): boolean;
    isInShadow(x: number, y: number): boolean;
    lightChanged(x: number, y: number): boolean;
    get width(): number;
    get height(): number;
    addStatic(x: number, y: number, light: LightType | LightBase): StaticLightInfo;
    removeStatic(x: number, y: number, light?: Light): void;
    eachStaticLight(fn: LightCb): void;
    eachDynamicLight(fn: LightCb): void;
    update(force?: boolean): boolean;
    startLightUpdate(): void;
    finishLightUpdate(): void;
    recordGlowLights(): void;
    restoreGlowLights(): void;
    calcFov(x: number, y: number, radius: number, passThroughActors: boolean, cb: (x: number, y: number) => void): void;
    addCellLight(x: number, y: number, light: LightValue, dispelShadows: boolean): void;
}

type index_d$6_LightConfig = LightConfig;
type index_d$6_LightBase = LightBase;
type index_d$6_LightType = LightType;
type index_d$6_LightCb = LightCb;
type index_d$6_PaintSite = PaintSite;
type index_d$6_LightSystemSite = LightSystemSite;
type index_d$6_LightSystemType = LightSystemType;
type index_d$6_Light = Light;
declare const index_d$6_Light: typeof Light;
declare const index_d$6_intensity: typeof intensity;
declare const index_d$6_isDarkLight: typeof isDarkLight;
declare const index_d$6_isShadowLight: typeof isShadowLight;
declare const index_d$6_lights: typeof lights;
type index_d$6_StaticLightInfo = StaticLightInfo;
type index_d$6_LightSystemOptions = LightSystemOptions;
type index_d$6_LightSystem = LightSystem;
declare const index_d$6_LightSystem: typeof LightSystem;
declare namespace index_d$6 {
  export {
    index_d$6_LightConfig as LightConfig,
    index_d$6_LightBase as LightBase,
    index_d$6_LightType as LightType,
    index_d$6_LightCb as LightCb,
    index_d$6_PaintSite as PaintSite,
    index_d$6_LightSystemSite as LightSystemSite,
    index_d$6_LightSystemType as LightSystemType,
    config$1 as config,
    index_d$6_Light as Light,
    index_d$6_intensity as intensity,
    index_d$6_isDarkLight as isDarkLight,
    index_d$6_isShadowLight as isShadowLight,
    make$4 as make,
    index_d$6_lights as lights,
    from$2 as from,
    install$2 as install,
    installAll$2 as installAll,
    index_d$6_StaticLightInfo as StaticLightInfo,
    index_d$6_LightSystemOptions as LightSystemOptions,
    index_d$6_LightSystem as LightSystem,
  };
}

declare class GameObject implements ObjectType {
    sprite: Sprite;
    depth: number;
    light: LightType | null;
    flags: ObjectFlags;
    next: GameObject | null;
    x: number;
    y: number;
    constructor();
    hasObjectFlag(flag: number): boolean;
    hasAllObjectFlags(flags: number): boolean;
    blocksMove(): boolean;
    blocksVision(): boolean;
    blocksPathing(): boolean;
    blocksEffects(): boolean;
    itemFlags(): number;
    actorFlags(): number;
}

type index_d$5_ObjectFlags = ObjectFlags;
type index_d$5_ObjectType = ObjectType;
type index_d$5_GameObject = GameObject;
declare const index_d$5_GameObject: typeof GameObject;
declare namespace index_d$5 {
  export {
    flags_d$1 as flags,
    index_d$5_ObjectFlags as ObjectFlags,
    index_d$5_ObjectType as ObjectType,
    index_d$5_GameObject as GameObject,
  };
}

interface ActorFlags extends ObjectFlags {
    actor: number;
}

declare enum Actor$1 {
    IS_PLAYER
}

type flags_d_Depth = Depth;
declare const flags_d_Depth: typeof Depth;
declare namespace flags_d {
  export {
    Actor$1 as Actor,
    GameObject$1 as GameObject,
    flags_d_Depth as Depth,
  };
}

declare class Actor extends GameObject {
    flags: ActorFlags;
    next: Actor | null;
    constructor();
    hasActorFlag(flag: number): boolean;
    hasAllActorFlags(flags: number): boolean;
    actorFlags(): number;
    isPlayer(): boolean;
    isVisible(): boolean;
    forbidsCell(_cell: CellType): boolean;
}

type index_d$4_Actor = Actor;
declare const index_d$4_Actor: typeof Actor;
type index_d$4_ActorFlags = ActorFlags;
declare namespace index_d$4 {
  export {
    index_d$4_Actor as Actor,
    flags_d as flags,
    index_d$4_ActorFlags as ActorFlags,
  };
}

interface ItemFlags extends ObjectFlags {
    item: number;
}

declare class Item extends GameObject {
    flags: ItemFlags;
    quantity: number;
    next: Item | null;
    constructor();
    itemFlags(): number;
    hasItemFlag(flag: number): boolean;
    hasAllItemFlags(flags: number): boolean;
    forbidsCell(_cell: CellType): boolean;
}

type index_d$3_Item = Item;
declare const index_d$3_Item: typeof Item;
type index_d$3_ItemFlags = ItemFlags;
declare namespace index_d$3 {
  export {
    index_d$3_Item as Item,
    index_d$3_ItemFlags as ItemFlags,
  };
}

declare enum Tile$1 {
    T_BRIDGE,
    T_AUTO_DESCENT,
    T_LAVA,
    T_DEEP_WATER,
    T_IS_FLAMMABLE,
    T_SPONTANEOUSLY_IGNITES,
    T_IS_FIRE,
    T_EXTINGUISHES_FIRE,
    T_IS_SECRET,
    T_IS_TRAP,
    T_SACRED,
    T_UP_STAIRS,
    T_DOWN_STAIRS,
    T_PORTAL,
    T_IS_DOOR,
    T_ALLOWS_SUBMERGING,
    T_ENTANGLES,
    T_REFLECTS,
    T_STAND_IN_TILE,
    T_CONNECTS_LEVEL,
    T_BLOCKS_OTHER_LAYERS,
    T_HAS_STAIRS,
    T_OBSTRUCTS_SCENT,
    T_PATHING_BLOCKER,
    T_LAKE_PATHING_BLOCKER,
    T_WAYPOINT_BLOCKER,
    T_DIVIDES_LEVEL,
    T_MOVES_ITEMS,
    T_CAN_BE_BRIDGED,
    T_IS_DEEP_LIQUID
}
declare enum TileMech {
    TM_IS_WIRED,
    TM_IS_CIRCUIT_BREAKER,
    TM_VANISHES_UPON_PROMOTION,
    TM_EXPLOSIVE_PROMOTE,
    TM_SWAP_ENCHANTS_ACTIVATION
}

interface TileFlags extends ObjectFlags {
    tile: number;
    tileMech: number;
}
interface NameConfig {
    article?: boolean | string;
    color?: boolean | string | ColorBase;
}
interface TileType {
    readonly id: string;
    readonly index: number;
    readonly flags: TileFlags;
    readonly dissipate: number;
    readonly effects: Record<string, string | EffectInfo>;
    readonly groundTile: string | null;
    hasObjectFlag(flag: number): boolean;
    hasTileFlag(flag: number): boolean;
    hasTileMechFlag(flag: number): boolean;
    hasAllObjectFlags(flag: number): boolean;
    hasAllTileFlags(flag: number): boolean;
    hasAllTileMechFlags(flag: number): boolean;
    hasEffect(name: string): boolean;
    getName(): string;
    getName(config: NameConfig): string;
    getName(article: string): string;
    getName(article: boolean): string;
    getDescription(): string;
    getFlavor(): string;
}

interface TileConfig extends SpriteConfig {
    id: string;
    flags: TileFlags;
    dissipate: number;
    effects: Record<string, EffectInfo | string>;
    priority: number;
    depth: number;
    light: LightType | null;
    groundTile: string | null;
    name: string;
    description: string;
    flavor: string;
    article: string | null;
}
declare class Tile implements TileType {
    id: string;
    index: number;
    flags: TileFlags;
    dissipate: number;
    effects: Record<string, string | EffectInfo>;
    sprite: Sprite;
    priority: number;
    depth: number;
    light: LightType | null;
    groundTile: string | null;
    name: string;
    description: string;
    flavor: string;
    article: string | null;
    constructor(config: Partial<TileConfig>);
    hasObjectFlag(flag: number): boolean;
    hasTileFlag(flag: number): boolean;
    hasTileMechFlag(flag: number): boolean;
    hasAllObjectFlags(flag: number): boolean;
    hasAllTileFlags(flag: number): boolean;
    hasAllTileMechFlags(flag: number): boolean;
    blocksVision(): boolean;
    blocksMove(): boolean;
    blocksPathing(): boolean;
    blocksEffects(): boolean;
    hasEffect(name: string): boolean;
    getName(): string;
    getName(config: NameConfig): string;
    getName(article: string): string;
    getName(article: boolean): string;
    getDescription(): string;
    getFlavor(): string;
}
interface TileOptions extends SpriteConfig {
    extends: string;
    id: string;
    name: string;
    description: string;
    flavor: string;
    article: string;
    flags: FlagBase;
    priority: number | string;
    dissipate: number;
    depth: Depth | DepthString;
    effects: Record<string, Partial<EffectConfig> | string | null>;
    groundTile: string;
    light: LightBase | null;
}
declare function make$3(options: Partial<TileOptions>): Tile;
declare const tiles: Record<string, Tile>;
declare const all: Tile[];
declare function get(id: string | number | Tile): Tile;
declare function install$1(id: string, options: Partial<TileOptions>): Tile;
declare function install$1(id: string, base: string, options: Partial<TileOptions>): Tile;
declare function installAll$1(tiles: Record<string, Partial<TileOptions>>): void;

declare const flags$1: {
    Tile: typeof Tile$1;
    TileMech: typeof TileMech;
};

type index_d$2_TileFlags = TileFlags;
type index_d$2_NameConfig = NameConfig;
type index_d$2_TileType = TileType;
type index_d$2_TileConfig = TileConfig;
type index_d$2_Tile = Tile;
declare const index_d$2_Tile: typeof Tile;
type index_d$2_TileOptions = TileOptions;
declare const index_d$2_tiles: typeof tiles;
declare const index_d$2_all: typeof all;
declare const index_d$2_get: typeof get;
declare namespace index_d$2 {
  export {
    flags$1 as flags,
    index_d$2_TileFlags as TileFlags,
    index_d$2_NameConfig as NameConfig,
    index_d$2_TileType as TileType,
    index_d$2_TileConfig as TileConfig,
    index_d$2_Tile as Tile,
    index_d$2_TileOptions as TileOptions,
    make$3 as make,
    index_d$2_tiles as tiles,
    index_d$2_all as all,
    index_d$2_get as get,
    install$1 as install,
    installAll$1 as installAll,
  };
}

interface CellFlags {
    cell: number;
}
interface MapFlags {
    map: number;
}
interface SetOptions {
    superpriority: boolean;
    blockedByOtherLayers: boolean;
    blockedByActors: boolean;
    blockedByItems: boolean;
    volume: number;
    machine: number;
}
declare type SetTileOptions = Partial<SetOptions>;
interface CellInfoType {
    chokeCount: number;
    machineId: number;
    hasCellFlag(flag: number): boolean;
    hasTileFlag(flag: number): boolean;
    hasAllTileFlags(flags: number): boolean;
    hasObjectFlag(flag: number): boolean;
    hasAllObjectFlags(flags: number): boolean;
    hasTileMechFlag(flag: number): boolean;
    cellFlags(): number;
    objectFlags(): number;
    tileFlags(): number;
    tileMechFlags(): number;
    itemFlags(): number;
    actorFlags(): number;
    blocksVision(): boolean;
    blocksPathing(): boolean;
    blocksMove(): boolean;
    blocksEffects(): boolean;
    isWall(): boolean;
    isStairs(): boolean;
    hasKey(): boolean;
    readonly tile: Tile;
    hasTile(tile: string | number | Tile): boolean;
    hasItem(): boolean;
    readonly item: Item | null;
    hasActor(): boolean;
    hasPlayer(): boolean;
    readonly actor: Actor | null;
    getDescription(): string;
    getFlavor(): string;
    getName(opts: any): string;
}
interface CellType extends CellInfoType {
    flags: CellFlags;
    setCellFlag(flag: number): void;
    clearCellFlag(flag: number): void;
    depthPriority(depth: number): number;
    highestPriority(): number;
    depthTile(depth: number): Tile | null;
    blocksLayer(depth: number): boolean;
    eachTile(cb: EachCb$1<Tile>): void;
    isPassable(): boolean;
    setTile(tile: Tile): boolean;
    clear(): void;
    clearDepth(depth: number): boolean;
    hasTile(tile?: string | number | Tile): boolean;
    hasDepthTile(depth: number): boolean;
    highestPriorityTile(): Tile;
    isEmpty(): boolean;
    isWall(): boolean;
    eachGlowLight(cb: (light: LightType) => any): void;
    activate(event: string, map: MapType, x: number, y: number, ctx?: Partial<EffectCtx>): Promise<boolean> | boolean;
    activateSync(event: string, map: MapType, x: number, y: number, ctx?: Partial<EffectCtx>): boolean;
    hasEffect(name: string): boolean;
    needsRedraw: boolean;
}
declare type EachCellCb = (cell: CellType, x: number, y: number, map: MapType) => any;
declare type EachItemCb = (item: Item) => any;
declare type EachActorCb = (actor: Actor) => any;
declare type MapTestFn = (cell: CellType, x: number, y: number, map: MapType) => boolean;
interface MapType {
    readonly width: number;
    readonly height: number;
    light: LightSystemType;
    fov: FovSystemType;
    properties: Record<string, any>;
    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;
    cellInfo(x: number, y: number, useMemory?: boolean): CellInfoType;
    cell(x: number, y: number): CellType;
    get(x: number, y: number): CellType | undefined;
    eachCell(cb: EachCellCb): void;
    eachItem(cb: EachItemCb): void;
    addItem(x: number, y: number, actor: Item): boolean;
    removeItem(actor: Item): boolean;
    moveItem(item: Item, x: number, y: number): boolean;
    eachActor(cb: EachActorCb): void;
    addActor(x: number, y: number, actor: Actor): boolean;
    removeActor(actor: Actor): boolean;
    moveActor(actor: Actor, x: number, y: number): boolean;
    isVisible(x: number, y: number): boolean;
    hasMapFlag(flag: number): boolean;
    setMapFlag(flag: number): void;
    clearMapFlag(flag: number): void;
    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;
    fill(tile: string, boundary?: string): void;
    hasTile(x: number, y: number, tile: string | number | Tile): boolean;
    setTile(x: number, y: number, tile: string | number | Tile, opts?: SetTileOptions): boolean;
    tick(dt: number): Promise<boolean>;
    fire(event: string, x: number, y: number, ctx?: Partial<EffectCtx>): Promise<boolean>;
    fireSync(event: string, x: number, y: number, ctx?: Partial<EffectCtx>): boolean;
    fireAll(event: string, ctx?: Partial<EffectCtx>): Promise<boolean>;
    fireAllSync(event: string, ctx?: Partial<EffectCtx>): boolean;
    activateMachine(machineId: number, originX: number, originY: number, ctx?: Partial<EffectCtx>): Promise<boolean>;
    activateMachineSync(machineId: number, originX: number, originY: number, ctx?: Partial<EffectCtx>): boolean;
    count(cb: MapTestFn): number;
    dump(fmt?: (cell: CellType) => string): void;
    getAppearanceAt(x: number, y: number, dest: Mixer): void;
}

interface EffectHandler {
    make: (src: Partial<EffectConfig>, dest: EffectInfo) => boolean;
    fire: (config: EffectInfo, map: MapType, x: number, y: number, ctx: EffectCtx) => boolean | Promise<boolean>;
    fireSync: (config: EffectInfo, map: MapType, x: number, y: number, ctx: EffectCtx) => boolean;
}

declare function reset(effect: EffectInfo): void;
declare function resetAll(): void;
declare const effects: Record<string, EffectInfo>;
declare function install(id: string, config: Partial<EffectConfig>): EffectInfo;
declare function installAll(effects: Record<string, Partial<EffectConfig>>): void;
declare const handlers: Record<string, EffectHandler>;
declare function installHandler(id: string, handler: EffectHandler): void;

declare function make$2(opts: EffectBase): EffectInfo;
declare function from$1(opts: EffectBase | string): EffectInfo;

declare function fire(effect: EffectInfo | string, map: MapType, x: number, y: number, ctx_?: Partial<EffectCtx>): Promise<boolean>;
declare function fireSync(effect: EffectInfo | string, map: MapType, x: number, y: number, ctx_?: Partial<EffectCtx>): boolean;

declare class MessageEffect implements EffectHandler {
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean;
    fire(config: EffectInfo, map: MapType, x: number, y: number, ctx: EffectCtx): Promise<boolean>;
    fireSync(config: EffectInfo, _map: MapType, _x: number, _y: number, _ctx: EffectCtx): boolean;
}

declare class EmitEffect implements EffectHandler {
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean;
    fire(config: any, _map: MapType, x: number, y: number, ctx: EffectCtx): Promise<boolean>;
    fireSync(config: EffectInfo, _map: MapType, _x: number, _y: number, _ctx: EffectCtx): boolean;
}

declare class FnEffect implements EffectHandler {
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean;
    fire(config: any, map: MapType, x: number, y: number, ctx: Partial<EffectCtx>): Promise<any>;
    fireSync(config: any, map: MapType, x: number, y: number, ctx: Partial<EffectCtx>): any;
}

declare class ActivateMachineEffect implements EffectHandler {
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean;
    fire(config: any, map: MapType, x: number, y: number, ctx: Partial<EffectCtx>): Promise<boolean>;
    fireSync(config: any, map: MapType, x: number, y: number, ctx: Partial<EffectCtx>): boolean;
}

type index_d$1_EffectInfo = EffectInfo;
type index_d$1_EffectCtx = EffectCtx;
type index_d$1_EffectConfig = EffectConfig;
type index_d$1_EffectBase = EffectBase;
type index_d$1_EffectHandler = EffectHandler;
declare const index_d$1_reset: typeof reset;
declare const index_d$1_resetAll: typeof resetAll;
declare const index_d$1_effects: typeof effects;
declare const index_d$1_install: typeof install;
declare const index_d$1_installAll: typeof installAll;
declare const index_d$1_handlers: typeof handlers;
declare const index_d$1_installHandler: typeof installHandler;
declare const index_d$1_fire: typeof fire;
declare const index_d$1_fireSync: typeof fireSync;
type index_d$1_MessageEffect = MessageEffect;
declare const index_d$1_MessageEffect: typeof MessageEffect;
type index_d$1_EmitEffect = EmitEffect;
declare const index_d$1_EmitEffect: typeof EmitEffect;
type index_d$1_FnEffect = FnEffect;
declare const index_d$1_FnEffect: typeof FnEffect;
type index_d$1_ActivateMachineEffect = ActivateMachineEffect;
declare const index_d$1_ActivateMachineEffect: typeof ActivateMachineEffect;
declare namespace index_d$1 {
  export {
    Effect as Flags,
    index_d$1_EffectInfo as EffectInfo,
    index_d$1_EffectCtx as EffectCtx,
    index_d$1_EffectConfig as EffectConfig,
    index_d$1_EffectBase as EffectBase,
    index_d$1_EffectHandler as EffectHandler,
    index_d$1_reset as reset,
    index_d$1_resetAll as resetAll,
    index_d$1_effects as effects,
    index_d$1_install as install,
    index_d$1_installAll as installAll,
    index_d$1_handlers as handlers,
    index_d$1_installHandler as installHandler,
    make$2 as make,
    from$1 as from,
    index_d$1_fire as fire,
    index_d$1_fireSync as fireSync,
    index_d$1_MessageEffect as MessageEffect,
    index_d$1_EmitEffect as EmitEffect,
    index_d$1_FnEffect as FnEffect,
    index_d$1_ActivateMachineEffect as ActivateMachineEffect,
  };
}

declare const data: any;
declare const config: any;

interface BlobConfig {
    rounds: number;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
    percentSeeded: number;
    birthParameters: string;
    survivalParameters: string;
}
declare class Blob {
    options: BlobConfig;
    constructor(opts?: Partial<BlobConfig>);
    carve(width: number, height: number, setFn: XYFunc): Bounds;
    _cellularAutomataRound(grid: NumGrid): boolean;
}
declare function fillBlob(grid: NumGrid, opts?: Partial<BlobConfig>): Bounds;
declare function make$1(opts?: Partial<BlobConfig>): Blob;

type blob_d_BlobConfig = BlobConfig;
type blob_d_Blob = Blob;
declare const blob_d_Blob: typeof Blob;
declare const blob_d_fillBlob: typeof fillBlob;
declare namespace blob_d {
  export {
    blob_d_BlobConfig as BlobConfig,
    blob_d_Blob as Blob,
    blob_d_fillBlob as fillBlob,
    make$1 as make,
  };
}

declare enum Cell$1 {
    SEARCHED_FROM_HERE,
    PRESSURE_PLATE_DEPRESSED,
    KNOWN_TO_BE_TRAP_FREE,
    CAUGHT_FIRE_THIS_TURN,
    EVENT_FIRED_THIS_TURN,
    EVENT_PROTECTED,
    IS_IN_LOOP,
    IS_CHOKEPOINT,
    IS_GATE_SITE,
    IS_IN_ROOM_MACHINE,
    IS_IN_AREA_MACHINE,
    IS_POWERED,
    IMPREGNABLE,
    NEEDS_REDRAW,
    CELL_CHANGED,
    HAS_SURFACE,
    HAS_LIQUID,
    HAS_GAS,
    HAS_PLAYER,
    HAS_ACTOR,
    HAS_DORMANT_MONSTER,
    HAS_ITEM,
    IS_IN_PATH,
    IS_CURSOR,
    STABLE_MEMORY,
    IS_WIRED,
    IS_CIRCUIT_BREAKER,
    COLORS_DANCE,
    IS_IN_MACHINE,
    PERMANENT_CELL_FLAGS,
    HAS_ANY_ACTOR,
    HAS_ANY_OBJECT,
    CELL_DEFAULT
}
declare enum Map$1 {
    MAP_CHANGED,
    MAP_ALWAYS_LIT,
    MAP_SAW_WELCOME,
    MAP_NO_LIQUID,
    MAP_NO_GAS,
    MAP_CALC_FOV,
    MAP_FOV_CHANGED,
    MAP_DANCES,
    MAP_DEFAULT = 0
}

declare type TileData = Tile | null;
declare type TileArray = [Tile, ...TileData[]];
declare type EachCb<T> = (t: T) => any;
declare type MatchCb<T> = (t: T) => boolean;
declare type ReduceCb<T> = (out: any, t: T) => any;
declare class CellObjects {
    cell: Cell;
    constructor(cell: Cell);
    forEach(cb: EachCb<GameObject>): void;
    some(cb: MatchCb<GameObject>): boolean;
    reduce(cb: ReduceCb<GameObject>, start?: any): any;
}
declare class Cell implements CellType {
    flags: CellFlags;
    chokeCount: number;
    tiles: TileArray;
    machineId: number;
    _actor: Actor | null;
    _item: Item | null;
    _objects: CellObjects;
    constructor(groundTile?: number | string | Tile);
    copy(other: Cell): void;
    hasCellFlag(flag: number): boolean;
    setCellFlag(flag: number): void;
    clearCellFlag(flag: number): void;
    hasObjectFlag(flag: number): boolean;
    hasAllObjectFlags(flags: number): boolean;
    hasTileFlag(flag: number): boolean;
    hasAllTileFlags(flags: number): boolean;
    hasTileMechFlag(flag: number): boolean;
    hasAllTileMechFlags(flags: number): boolean;
    cellFlags(): number;
    objectFlags(): number;
    tileFlags(): number;
    tileMechFlags(): number;
    itemFlags(): number;
    actorFlags(): number;
    get needsRedraw(): boolean;
    set needsRedraw(v: boolean);
    depthPriority(depth: number): number;
    highestPriority(): number;
    depthTile(depth: number): Tile | null;
    hasTile(tile?: string | number | Tile): boolean;
    hasDepthTile(depth: number): boolean;
    highestPriorityTile(): Tile;
    get tile(): Tile;
    eachTile(cb: EachCb<Tile>): void;
    tileWithObjectFlag(flag: number): Tile | null;
    tileWithFlag(flag: number): Tile | null;
    tileWithMechFlag(flag: number): Tile | null;
    blocksVision(): boolean;
    blocksPathing(): boolean;
    blocksMove(): boolean;
    blocksEffects(): boolean;
    blocksLayer(depth: number): boolean;
    isEmpty(): boolean;
    isPassable(): boolean;
    isWall(): boolean;
    isStairs(): boolean;
    hasKey(): boolean;
    setTile(tile: string | number | Tile): boolean;
    clear(): void;
    clearDepth(depth: Depth): boolean;
    clearDepthsWithFlags(tileFlag: number, tileMechFlag?: number): void;
    eachGlowLight(cb: (light: LightType) => any): void;
    activate(event: string, map: MapType, x: number, y: number, ctx?: Partial<EffectCtx>): Promise<boolean>;
    activateSync(event: string, map: MapType, x: number, y: number, ctx?: Partial<EffectCtx>): boolean;
    _fire(effect: string | EffectInfo, map: MapType, x: number, y: number, ctx: Partial<EffectCtx>): Promise<boolean>;
    _fireSync(effect: string | EffectInfo, map: MapType, x: number, y: number, ctx: Partial<EffectCtx>): boolean;
    hasEffect(name: string): boolean;
    hasItem(): boolean;
    get item(): Item | null;
    set item(val: Item | null);
    hasActor(): boolean;
    hasPlayer(): boolean;
    get actor(): Actor | null;
    set actor(val: Actor | null);
    getDescription(): string;
    getFlavor(): string;
    getName(opts?: {}): string;
    dump(): string;
}

declare class MapLayer {
    map: MapType;
    depth: number;
    properties: Record<string, any>;
    name: string;
    constructor(map: MapType, name?: string);
    copy(_other: MapLayer): void;
    tick(_dt: number): Promise<boolean>;
}
declare class ActorLayer extends MapLayer {
    constructor(map: MapType, name?: string);
    add(x: number, y: number, obj: Actor, _opts?: any): boolean;
    remove(obj: Actor): boolean;
    putAppearance(dest: Mixer, x: number, y: number): void;
}
declare class ItemLayer extends MapLayer {
    constructor(map: MapType, name?: string);
    add(x: number, y: number, obj: Item, _opts?: any): boolean;
    remove(obj: Item): boolean;
    putAppearance(dest: Mixer, x: number, y: number): void;
}
declare class TileLayer extends MapLayer {
    constructor(map: MapType, name?: string);
    set(x: number, y: number, tile: Tile, opts?: SetTileOptions): boolean;
    clear(x: number, y: number): boolean;
    tick(_dt: number): Promise<boolean>;
    putAppearance(dest: Mixer, x: number, y: number): void;
}

declare class CellMemory implements CellInfoType {
    chokeCount: number;
    machineId: number;
    flags: {
        cell: number;
        item: number;
        actor: number;
        tile: number;
        tileMech: number;
        object: number;
    };
    blocks: {
        vision: boolean;
        effects: boolean;
        move: boolean;
        pathing: boolean;
    };
    _tile: Tile;
    _item: Item | null;
    _actor: Actor | null;
    _hasKey: boolean;
    snapshot: Mixer;
    constructor();
    clear(): void;
    store(cell: CellInfoType): void;
    getSnapshot(dest: Mixer): void;
    putSnapshot(src: Mixer): void;
    hasCellFlag(flag: number): boolean;
    hasTileFlag(flag: number): boolean;
    hasAllTileFlags(flags: number): boolean;
    hasObjectFlag(flag: number): boolean;
    hasAllObjectFlags(flags: number): boolean;
    hasTileMechFlag(flag: number): boolean;
    cellFlags(): number;
    objectFlags(): number;
    tileFlags(): number;
    tileMechFlags(): number;
    itemFlags(): number;
    actorFlags(): number;
    blocksVision(): boolean;
    blocksPathing(): boolean;
    blocksMove(): boolean;
    blocksEffects(): boolean;
    isWall(): boolean;
    isStairs(): boolean;
    hasKey(): boolean;
    get tile(): Tile;
    hasTile(tile: string | number | Tile): boolean;
    hasItem(): boolean;
    get item(): Item | null;
    hasActor(): boolean;
    hasPlayer(): boolean;
    get actor(): Actor | null;
    getDescription(): string;
    getFlavor(): string;
    getName(_opts: any): string;
}

interface MapOptions extends LightSystemOptions, FovSystemOptions {
    tile: string | true;
    boundary: string | true;
}
declare type LayerType = TileLayer | ActorLayer | ItemLayer;
interface MapDrawOptions {
    x: number;
    y: number;
    width: number;
    height: number;
    mapOffsetX: number;
    mapOffsetY: number;
    force: boolean;
}
declare class Map implements LightSystemSite, FovSite, MapType {
    width: number;
    height: number;
    cells: Grid<Cell>;
    layers: LayerType[];
    flags: {
        map: 0;
    };
    light: LightSystemType;
    fov: FovSystemType;
    properties: Record<string, any>;
    memory: Grid<CellMemory>;
    constructor(width: number, height: number, opts?: Partial<MapOptions>);
    cellInfo(x: number, y: number, useMemory?: boolean): CellInfoType;
    initLayers(): void;
    addLayer(depth: number | keyof typeof Depth, layer: LayerType): void;
    removeLayer(depth: number | keyof typeof Depth): void;
    getLayer(depth: number | keyof typeof Depth): LayerType | null;
    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;
    cell(x: number, y: number): CellType;
    get(x: number, y: number): Cell | undefined;
    eachCell(cb: EachCellCb): void;
    drawInto(dest: Canvas | DataBuffer, opts?: Partial<MapDrawOptions> | boolean): void;
    itemAt(x: number, y: number): Item | null;
    eachItem(cb: EachCb$1<Item>): void;
    addItem(x: number, y: number, item: Item): boolean;
    removeItem(item: Item): boolean;
    moveItem(item: Item, x: number, y: number): boolean;
    hasPlayer(x: number, y: number): boolean;
    actorAt(x: number, y: number): Actor | null;
    eachActor(cb: EachCb$1<Actor>): void;
    addActor(x: number, y: number, item: Actor): boolean;
    removeActor(item: Actor): boolean;
    moveActor(item: Actor, x: number, y: number): boolean;
    isVisible(x: number, y: number): boolean;
    count(cb: MapTestFn): number;
    dump(fmt?: (cell: CellType) => string, log?: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    }): void;
    hasMapFlag(flag: number): boolean;
    setMapFlag(flag: number): void;
    clearMapFlag(flag: number): void;
    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;
    fill(tile: string | number | Tile, boundary?: string | number | Tile): void;
    hasTile(x: number, y: number, tile: string | number | Tile, useMemory?: boolean): boolean;
    setTile(x: number, y: number, tile: string | number | Tile, opts?: SetTileOptions): boolean;
    tick(dt: number): Promise<boolean>;
    copy(src: Map): void;
    clone(): Map;
    fire(event: string, x: number, y: number, ctx?: Partial<EffectCtx>): Promise<boolean>;
    fireSync(event: string, x: number, y: number, ctx?: Partial<EffectCtx>): boolean;
    fireAll(event: string, ctx?: Partial<EffectCtx>): Promise<boolean>;
    fireAllSync(event: string, ctx?: Partial<EffectCtx>): boolean;
    activateMachine(machineId: number, originX: number, originY: number, ctx?: Partial<EffectCtx>): Promise<boolean>;
    activateMachineSync(machineId: number, originX: number, originY: number, ctx?: Partial<EffectCtx>): boolean;
    getAppearanceAt(x: number, y: number, dest: Mixer): void;
    hasActor(x: number, y: number): boolean;
    eachGlowLight(cb: LightCb): void;
    eachDynamicLight(_cb: LightCb): void;
    eachViewport(_cb: ViewportCb): void;
    lightingChanged(): boolean;
    hasVisibleLight(x: number, y: number): boolean;
    blocksVision(x: number, y: number): boolean;
    onCellRevealed(_x: number, _y: number): void;
    redrawCell(x: number, y: number, clearMemory?: boolean): void;
    clearMemory(x: number, y: number): void;
    storeMemory(x: number, y: number): void;
}
declare function make(w: number, h: number, floor?: string, boundary?: string): Map;
declare function make(w: number, h: number, floor: string): Map;
declare function make(w: number, h: number, opts: Partial<MapOptions>): Map;
declare function from(prefab: string | string[] | NumGrid, charToTile: Record<string, string | null>, opts?: Partial<MapOptions>): Map;

declare function analyze(map: MapType, updateChokeCounts?: boolean): void;
declare function updateChokepoints(map: MapType, updateCounts: boolean): void;
declare function floodFillCount(map: MapType, results: NumGrid, passMap: NumGrid, startX: number, startY: number): number;
declare function updateLoopiness(map: MapType): void;
declare function resetLoopiness(cell: CellType, _x: number, _y: number, _map: MapType): void;
declare function checkLoopiness(cell: CellType, x: number, y: number, map: MapType): boolean;
declare function fillInnerLoopGrid(map: MapType, grid: NumGrid): void;
declare function cleanLoopiness(map: MapType): void;

interface SpawnConfig {
    tile: string;
    grow: number;
    decrement: number;
    matchTile: string;
    flags: FlagBase;
    volume: number;
    next: string;
}
interface SpawnInfo {
    tile: string;
    grow: number;
    decrement: number;
    matchTile: string;
    flags: number;
    volume: number;
    next: string | null;
}
declare class SpawnEffect implements EffectHandler {
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean;
    fire(effect: EffectInfo, map: MapType, x: number, y: number, ctx: EffectCtx): Promise<boolean>;
    fireSync(effect: EffectInfo, map: MapType, x: number, y: number, ctx: EffectCtx): boolean;
    mapDisruptedBy(map: MapType, blockingGrid: NumGrid, blockingToMapX?: number, blockingToMapY?: number): boolean;
}
declare function spawnTiles(flags: number, spawnMap: NumGrid, map: MapType, tile: Tile, volume?: number): boolean;
declare function computeSpawnMap(effect: EffectInfo, map: MapType, x: number, y: number, ctx: EffectCtx): boolean;
declare function clearCells(map: MapType, spawnMap: NumGrid, flags?: number): boolean;
declare function evacuateCreatures(map: MapType, blockingMap: NumGrid): boolean;
declare function evacuateItems(map: MapType, blockingMap: NumGrid): boolean;

declare class GasLayer extends TileLayer {
    volume: NumGrid;
    needsUpdate: boolean;
    constructor(map: MapType, name?: string);
    set(x: number, y: number, tile: Tile, opts?: SetTileOptions): boolean;
    clear(x: number, y: number): boolean;
    copy(other: GasLayer): void;
    tick(_dt: number): Promise<boolean>;
    dissipate(volume: NumGrid): void;
    calcOpacity(volume: number): number;
    updateCellVolume(x: number, y: number, startingVolume: NumGrid): void;
    spread(startingVolume: NumGrid): void;
    putAppearance(dest: Mixer, x: number, y: number): void;
}

declare class FireLayer extends TileLayer {
    constructor(map: MapType, name?: string);
    tick(_dt: number): Promise<boolean>;
    exposeToFire(x: number, y: number, alwaysIgnite?: boolean): Promise<boolean>;
}

declare const flags: {
    Cell: typeof Cell$1;
    Map: typeof Map$1;
    GameObject: typeof GameObject$1;
    Depth: typeof Depth;
    Tile: typeof Tile$1;
};

declare const index_d_flags: typeof flags;
type index_d_CellFlags = CellFlags;
type index_d_MapFlags = MapFlags;
type index_d_SetOptions = SetOptions;
type index_d_SetTileOptions = SetTileOptions;
type index_d_CellInfoType = CellInfoType;
type index_d_CellType = CellType;
type index_d_EachCellCb = EachCellCb;
type index_d_EachItemCb = EachItemCb;
type index_d_EachActorCb = EachActorCb;
type index_d_MapTestFn = MapTestFn;
type index_d_MapType = MapType;
type index_d_Cell = Cell;
declare const index_d_Cell: typeof Cell;
type index_d_MapOptions = MapOptions;
type index_d_LayerType = LayerType;
type index_d_MapDrawOptions = MapDrawOptions;
type index_d_Map = Map;
declare const index_d_Map: typeof Map;
declare const index_d_make: typeof make;
declare const index_d_from: typeof from;
declare const index_d_analyze: typeof analyze;
declare const index_d_updateChokepoints: typeof updateChokepoints;
declare const index_d_floodFillCount: typeof floodFillCount;
declare const index_d_updateLoopiness: typeof updateLoopiness;
declare const index_d_resetLoopiness: typeof resetLoopiness;
declare const index_d_checkLoopiness: typeof checkLoopiness;
declare const index_d_fillInnerLoopGrid: typeof fillInnerLoopGrid;
declare const index_d_cleanLoopiness: typeof cleanLoopiness;
type index_d_SpawnConfig = SpawnConfig;
type index_d_SpawnInfo = SpawnInfo;
type index_d_SpawnEffect = SpawnEffect;
declare const index_d_SpawnEffect: typeof SpawnEffect;
declare const index_d_spawnTiles: typeof spawnTiles;
declare const index_d_computeSpawnMap: typeof computeSpawnMap;
declare const index_d_clearCells: typeof clearCells;
declare const index_d_evacuateCreatures: typeof evacuateCreatures;
declare const index_d_evacuateItems: typeof evacuateItems;
type index_d_CellMemory = CellMemory;
declare const index_d_CellMemory: typeof CellMemory;
type index_d_MapLayer = MapLayer;
declare const index_d_MapLayer: typeof MapLayer;
type index_d_ActorLayer = ActorLayer;
declare const index_d_ActorLayer: typeof ActorLayer;
type index_d_ItemLayer = ItemLayer;
declare const index_d_ItemLayer: typeof ItemLayer;
type index_d_TileLayer = TileLayer;
declare const index_d_TileLayer: typeof TileLayer;
type index_d_GasLayer = GasLayer;
declare const index_d_GasLayer: typeof GasLayer;
type index_d_FireLayer = FireLayer;
declare const index_d_FireLayer: typeof FireLayer;
declare namespace index_d {
  export {
    index_d_flags as flags,
    index_d_CellFlags as CellFlags,
    index_d_MapFlags as MapFlags,
    index_d_SetOptions as SetOptions,
    index_d_SetTileOptions as SetTileOptions,
    index_d_CellInfoType as CellInfoType,
    index_d_CellType as CellType,
    index_d_EachCellCb as EachCellCb,
    index_d_EachItemCb as EachItemCb,
    index_d_EachActorCb as EachActorCb,
    index_d_MapTestFn as MapTestFn,
    index_d_MapType as MapType,
    index_d_Cell as Cell,
    index_d_MapOptions as MapOptions,
    index_d_LayerType as LayerType,
    index_d_MapDrawOptions as MapDrawOptions,
    index_d_Map as Map,
    index_d_make as make,
    index_d_from as from,
    index_d_analyze as analyze,
    index_d_updateChokepoints as updateChokepoints,
    index_d_floodFillCount as floodFillCount,
    index_d_updateLoopiness as updateLoopiness,
    index_d_resetLoopiness as resetLoopiness,
    index_d_checkLoopiness as checkLoopiness,
    index_d_fillInnerLoopGrid as fillInnerLoopGrid,
    index_d_cleanLoopiness as cleanLoopiness,
    index_d_SpawnConfig as SpawnConfig,
    index_d_SpawnInfo as SpawnInfo,
    index_d_SpawnEffect as SpawnEffect,
    index_d_spawnTiles as spawnTiles,
    index_d_computeSpawnMap as computeSpawnMap,
    index_d_clearCells as clearCells,
    index_d_evacuateCreatures as evacuateCreatures,
    index_d_evacuateItems as evacuateItems,
    index_d_CellMemory as CellMemory,
    index_d_MapLayer as MapLayer,
    index_d_ActorLayer as ActorLayer,
    index_d_ItemLayer as ItemLayer,
    index_d_TileLayer as TileLayer,
    index_d_GasLayer as GasLayer,
    index_d_FireLayer as FireLayer,
  };
}

export { Random, index_d$4 as actor, blob_d as blob, index_d$9 as canvas, index_d$c as color, colors, config, cosmetic, data, index_d$1 as effect, events_d as events, flag_d as flag, index_d$a as fov, frequency_d as frequency, index_d$5 as gameObject, grid_d as grid, io_d as io, index_d$3 as item, index_d$6 as light, loop, index_d as map, message_d as message, path_d as path, random, range_d as range, scheduler_d as scheduler, index_d$8 as sprite, sprites, index_d$7 as text, index_d$2 as tile, types_d as types, index_d$b as utils };
