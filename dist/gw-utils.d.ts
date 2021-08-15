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

type index$c_ColorData = ColorData;
type index$c_ColorBase = ColorBase;
type index$c_LightValue = LightValue;
declare const index$c_colors: typeof colors;
type index$c_Color = Color;
declare const index$c_Color: typeof Color;
declare const index$c_fromArray: typeof fromArray;
declare const index$c_fromCss: typeof fromCss;
declare const index$c_fromName: typeof fromName;
declare const index$c_fromNumber: typeof fromNumber;
declare const index$c_separate: typeof separate;
declare const index$c_swap: typeof swap;
declare const index$c_relativeLuminance: typeof relativeLuminance;
declare const index$c_distance: typeof distance;
declare const index$c_installSpread: typeof installSpread;
declare const index$c_NONE: typeof NONE;
declare namespace index$c {
  export {
    index$c_ColorData as ColorData,
    index$c_ColorBase as ColorBase,
    index$c_LightValue as LightValue,
    index$c_colors as colors,
    index$c_Color as Color,
    index$c_fromArray as fromArray,
    index$c_fromCss as fromCss,
    index$c_fromName as fromName,
    index$c_fromNumber as fromNumber,
    make$b as make,
    from$6 as from,
    index$c_separate as separate,
    index$c_swap as swap,
    index$c_relativeLuminance as relativeLuminance,
    index$c_distance as distance,
    install$5 as install,
    index$c_installSpread as installSpread,
    index$c_NONE as NONE,
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

type types_XY = XY;
declare namespace types {
  export {
    Loc$1 as Loc,
    types_XY as XY,
    SpriteData$1 as SpriteData,
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
declare class Chain<T extends Chainable<T>> {
    data: T | null;
    sort: ChainSort<T>;
    onchange: ChainChangeFn;
    constructor(sort?: ChainSort<T>, onchange?: ChainChangeFn);
    add(obj: T): boolean;
    has(obj: T): boolean;
    remove(obj: T): boolean;
    find(cb: ChainMatch<T>): T | null;
    forEach(cb: ChainFn<T>): number;
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

type index$b_XY = XY;
declare const index$b_DIRS: typeof DIRS;
declare const index$b_NO_DIRECTION: typeof NO_DIRECTION;
declare const index$b_UP: typeof UP;
declare const index$b_RIGHT: typeof RIGHT;
declare const index$b_DOWN: typeof DOWN;
declare const index$b_LEFT: typeof LEFT;
declare const index$b_RIGHT_UP: typeof RIGHT_UP;
declare const index$b_RIGHT_DOWN: typeof RIGHT_DOWN;
declare const index$b_LEFT_DOWN: typeof LEFT_DOWN;
declare const index$b_LEFT_UP: typeof LEFT_UP;
declare const index$b_CLOCK_DIRS: typeof CLOCK_DIRS;
declare const index$b_NOOP: typeof NOOP;
declare const index$b_TRUE: typeof TRUE;
declare const index$b_FALSE: typeof FALSE;
declare const index$b_ONE: typeof ONE;
declare const index$b_ZERO: typeof ZERO;
declare const index$b_IDENTITY: typeof IDENTITY;
declare const index$b_IS_ZERO: typeof IS_ZERO;
declare const index$b_IS_NONZERO: typeof IS_NONZERO;
declare const index$b_clamp: typeof clamp;
declare const index$b_x: typeof x;
declare const index$b_y: typeof y;
type index$b_Bounds = Bounds;
declare const index$b_Bounds: typeof Bounds;
declare const index$b_copyXY: typeof copyXY;
declare const index$b_addXY: typeof addXY;
declare const index$b_equalsXY: typeof equalsXY;
declare const index$b_lerpXY: typeof lerpXY;
type index$b_XYFunc = XYFunc;
declare const index$b_eachNeighbor: typeof eachNeighbor;
type index$b_XYMatchFunc = XYMatchFunc;
declare const index$b_matchingNeighbor: typeof matchingNeighbor;
declare const index$b_distanceBetween: typeof distanceBetween;
declare const index$b_distanceFromTo: typeof distanceFromTo;
declare const index$b_calcRadius: typeof calcRadius;
declare const index$b_dirBetween: typeof dirBetween;
declare const index$b_dirFromTo: typeof dirFromTo;
declare const index$b_dirIndex: typeof dirIndex;
declare const index$b_isOppositeDir: typeof isOppositeDir;
declare const index$b_isSameDir: typeof isSameDir;
declare const index$b_dirSpread: typeof dirSpread;
declare const index$b_stepFromTo: typeof stepFromTo;
declare const index$b_smoothHiliteGradient: typeof smoothHiliteGradient;
declare const index$b_copyObject: typeof copyObject;
declare const index$b_assignObject: typeof assignObject;
declare const index$b_assignOmitting: typeof assignOmitting;
declare const index$b_setDefault: typeof setDefault;
type index$b_AssignCallback = AssignCallback;
declare const index$b_setDefaults: typeof setDefaults;
declare const index$b_setOptions: typeof setOptions;
declare const index$b_kindDefaults: typeof kindDefaults;
declare const index$b_pick: typeof pick;
declare const index$b_clearObject: typeof clearObject;
declare const index$b_ERROR: typeof ERROR;
declare const index$b_WARN: typeof WARN;
declare const index$b_first: typeof first;
declare const index$b_getOpt: typeof getOpt;
declare const index$b_firstOpt: typeof firstOpt;
declare const index$b_arraysIntersect: typeof arraysIntersect;
declare const index$b_sum: typeof sum;
declare const index$b_forLine: typeof forLine;
declare const index$b_getLine: typeof getLine;
declare const index$b_getLineThru: typeof getLineThru;
declare const index$b_forCircle: typeof forCircle;
declare const index$b_forRect: typeof forRect;
declare const index$b_forBorder: typeof forBorder;
declare const index$b_arcCount: typeof arcCount;
declare const index$b_asyncForEach: typeof asyncForEach;
type index$b_Chainable<_0> = Chainable<_0>;
type index$b_ChainSort<_0> = ChainSort<_0>;
type index$b_ChainMatch<_0> = ChainMatch<_0>;
type index$b_ChainFn<_0> = ChainFn<_0>;
declare const index$b_chainLength: typeof chainLength;
declare const index$b_chainIncludes: typeof chainIncludes;
declare const index$b_eachChain: typeof eachChain;
declare const index$b_addToChain: typeof addToChain;
declare const index$b_removeFromChain: typeof removeFromChain;
declare const index$b_findInChain: typeof findInChain;
type index$b_ChainChangeFn = ChainChangeFn;
type index$b_Chain<_0> = Chain<_0>;
declare const index$b_Chain: typeof Chain;
declare namespace index$b {
  export {
    Loc$1 as Loc,
    index$b_XY as XY,
    index$b_DIRS as DIRS,
    index$b_NO_DIRECTION as NO_DIRECTION,
    index$b_UP as UP,
    index$b_RIGHT as RIGHT,
    index$b_DOWN as DOWN,
    index$b_LEFT as LEFT,
    index$b_RIGHT_UP as RIGHT_UP,
    index$b_RIGHT_DOWN as RIGHT_DOWN,
    index$b_LEFT_DOWN as LEFT_DOWN,
    index$b_LEFT_UP as LEFT_UP,
    index$b_CLOCK_DIRS as CLOCK_DIRS,
    index$b_NOOP as NOOP,
    index$b_TRUE as TRUE,
    index$b_FALSE as FALSE,
    index$b_ONE as ONE,
    index$b_ZERO as ZERO,
    index$b_IDENTITY as IDENTITY,
    index$b_IS_ZERO as IS_ZERO,
    index$b_IS_NONZERO as IS_NONZERO,
    index$b_clamp as clamp,
    index$b_x as x,
    index$b_y as y,
    index$b_Bounds as Bounds,
    index$b_copyXY as copyXY,
    index$b_addXY as addXY,
    index$b_equalsXY as equalsXY,
    index$b_lerpXY as lerpXY,
    index$b_XYFunc as XYFunc,
    index$b_eachNeighbor as eachNeighbor,
    index$b_XYMatchFunc as XYMatchFunc,
    index$b_matchingNeighbor as matchingNeighbor,
    index$b_distanceBetween as distanceBetween,
    index$b_distanceFromTo as distanceFromTo,
    index$b_calcRadius as calcRadius,
    index$b_dirBetween as dirBetween,
    index$b_dirFromTo as dirFromTo,
    index$b_dirIndex as dirIndex,
    index$b_isOppositeDir as isOppositeDir,
    index$b_isSameDir as isSameDir,
    index$b_dirSpread as dirSpread,
    index$b_stepFromTo as stepFromTo,
    index$b_smoothHiliteGradient as smoothHiliteGradient,
    index$b_copyObject as copyObject,
    index$b_assignObject as assignObject,
    index$b_assignOmitting as assignOmitting,
    index$b_setDefault as setDefault,
    index$b_AssignCallback as AssignCallback,
    index$b_setDefaults as setDefaults,
    index$b_setOptions as setOptions,
    index$b_kindDefaults as kindDefaults,
    index$b_pick as pick,
    index$b_clearObject as clearObject,
    index$b_ERROR as ERROR,
    index$b_WARN as WARN,
    index$b_first as first,
    index$b_getOpt as getOpt,
    index$b_firstOpt as firstOpt,
    index$b_arraysIntersect as arraysIntersect,
    index$b_sum as sum,
    index$b_forLine as forLine,
    index$b_getLine as getLine,
    index$b_getLineThru as getLineThru,
    index$b_forCircle as forCircle,
    index$b_forRect as forRect,
    index$b_forBorder as forBorder,
    index$b_arcCount as arcCount,
    index$b_asyncForEach as asyncForEach,
    index$b_Chainable as Chainable,
    index$b_ChainSort as ChainSort,
    index$b_ChainMatch as ChainMatch,
    index$b_ChainFn as ChainFn,
    index$b_chainLength as chainLength,
    index$b_chainIncludes as chainIncludes,
    index$b_eachChain as eachChain,
    index$b_addToChain as addToChain,
    index$b_removeFromChain as removeFromChain,
    index$b_findInChain as findInChain,
    index$b_ChainChangeFn as ChainChangeFn,
    index$b_Chain as Chain,
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
    copy(other: Range): this;
    toString(): string;
}
declare function make$a(config: RangeBase | null, rng?: Random): Range;
declare const from$5: typeof make$a;
declare function asFn(config: RangeBase | null, rng?: Random): () => number;

type range_RangeBase = RangeBase;
type range_Range = Range;
declare const range_Range: typeof Range;
declare const range_asFn: typeof asFn;
declare namespace range {
  export {
    range_RangeBase as RangeBase,
    range_Range as Range,
    make$a as make,
    from$5 as from,
    range_asFn as asFn,
  };
}

declare type FlagSource = number | string;
declare type FlagBase = number | string | FlagSource[] | null;
declare function fl(N: number): number;
declare function toString<T>(flagObj: T, value: number): string;
declare function from$4<T>(obj: T, ...args: (FlagBase | undefined)[]): number;

type flag_FlagBase = FlagBase;
declare const flag_fl: typeof fl;
declare const flag_toString: typeof toString;
declare namespace flag {
  export {
    flag_FlagBase as FlagBase,
    flag_fl as fl,
    flag_toString as toString,
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
    dump(fmtFn?: GridFormat<T>): void;
    dumpRect(left: number, top: number, width: number, height: number, fmtFn?: GridFormat<T>): void;
    dumpAround(x: number, y: number, radius: number): void;
    closestMatchingLoc(x: number, y: number, v: T | GridMatch<T>): Loc;
    firstMatchingLoc(v: T | GridMatch<T>): Loc;
    randomMatchingLoc(v: T | GridMatch<T>): Loc;
    matchingLocNear(x: number, y: number, v: T | GridMatch<T>): Loc;
    arcCount(x: number, y: number, testFn: GridMatch<T>): number;
}
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

type grid_ArrayInit<_0> = ArrayInit<_0>;
declare const grid_makeArray: typeof makeArray;
type grid_GridInit<_0> = GridInit<_0>;
type grid_GridEach<_0> = GridEach<_0>;
type grid_AsyncGridEach<_0> = AsyncGridEach<_0>;
type grid_GridUpdate<_0> = GridUpdate<_0>;
type grid_GridMatch<_0> = GridMatch<_0>;
type grid_GridFormat<_0> = GridFormat<_0>;
type grid_Grid<_0> = Grid<_0>;
declare const grid_Grid: typeof Grid;
type grid_NumGrid = NumGrid;
declare const grid_NumGrid: typeof NumGrid;
declare const grid_alloc: typeof alloc;
declare const grid_free: typeof free;
type grid_GridZip<_0, _1> = GridZip<_0, _1>;
declare const grid_offsetZip: typeof offsetZip;
declare const grid_intersection: typeof intersection;
declare const grid_unite: typeof unite;
declare namespace grid {
  export {
    grid_ArrayInit as ArrayInit,
    grid_makeArray as makeArray,
    grid_GridInit as GridInit,
    grid_GridEach as GridEach,
    grid_AsyncGridEach as AsyncGridEach,
    grid_GridUpdate as GridUpdate,
    grid_GridMatch as GridMatch,
    grid_GridFormat as GridFormat,
    grid_Grid as Grid,
    grid_NumGrid as NumGrid,
    grid_alloc as alloc,
    grid_free as free,
    make$9 as make,
    grid_GridZip as GridZip,
    grid_offsetZip as offsetZip,
    grid_intersection as intersection,
    grid_unite as unite,
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

type io_CommandFn = CommandFn;
declare const io_commands: typeof commands;
declare const io_addCommand: typeof addCommand;
type io_KeyMap = KeyMap;
type io_EventMatchFn = EventMatchFn;
declare const io_KEYPRESS: typeof KEYPRESS;
declare const io_MOUSEMOVE: typeof MOUSEMOVE;
declare const io_CLICK: typeof CLICK;
declare const io_TICK: typeof TICK;
declare const io_MOUSEUP: typeof MOUSEUP;
declare const io_setKeymap: typeof setKeymap;
declare const io_dispatchEvent: typeof dispatchEvent;
declare const io_makeTickEvent: typeof makeTickEvent;
declare const io_makeKeyEvent: typeof makeKeyEvent;
declare const io_keyCodeDirection: typeof keyCodeDirection;
declare const io_ignoreKeyEvent: typeof ignoreKeyEvent;
declare const io_onkeydown: typeof onkeydown;
declare const io_makeMouseEvent: typeof makeMouseEvent;
type io_Loop = Loop;
declare const io_Loop: typeof Loop;
declare const io_loop: typeof loop;
declare namespace io {
  export {
    Event$1 as Event,
    io_CommandFn as CommandFn,
    io_commands as commands,
    io_addCommand as addCommand,
    io_KeyMap as KeyMap,
    io_EventMatchFn as EventMatchFn,
    io_KEYPRESS as KEYPRESS,
    io_MOUSEMOVE as MOUSEMOVE,
    io_CLICK as CLICK,
    io_TICK as TICK,
    io_MOUSEUP as MOUSEUP,
    io_setKeymap as setKeymap,
    io_dispatchEvent as dispatchEvent,
    io_makeTickEvent as makeTickEvent,
    io_makeKeyEvent as makeKeyEvent,
    io_keyCodeDirection as keyCodeDirection,
    io_ignoreKeyEvent as ignoreKeyEvent,
    io_onkeydown as onkeydown,
    io_makeMouseEvent as makeMouseEvent,
    io_Loop as Loop,
    make$8 as make,
    io_loop as loop,
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
    cellRevealed(x: number, y: number): void;
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

type index$a_FovFlags = FovFlags;
declare const index$a_FovFlags: typeof FovFlags;
type index$a_FovStrategy = FovStrategy;
type index$a_SetVisibleFn = SetVisibleFn;
type index$a_ViewportCb = ViewportCb;
type index$a_FovSite = FovSite;
type index$a_FovSystemType = FovSystemType;
type index$a_FOV = FOV;
declare const index$a_FOV: typeof FOV;
type index$a_FovSystemOptions = FovSystemOptions;
type index$a_FovSystem = FovSystem;
declare const index$a_FovSystem: typeof FovSystem;
declare namespace index$a {
  export {
    index$a_FovFlags as FovFlags,
    index$a_FovStrategy as FovStrategy,
    index$a_SetVisibleFn as SetVisibleFn,
    index$a_ViewportCb as ViewportCb,
    index$a_FovSite as FovSite,
    index$a_FovSystemType as FovSystemType,
    index$a_FOV as FOV,
    index$a_FovSystemOptions as FovSystemOptions,
    index$a_FovSystem as FovSystem,
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

declare const path_FORBIDDEN: typeof FORBIDDEN;
declare const path_OBSTRUCTION: typeof OBSTRUCTION;
declare const path_AVOIDED: typeof AVOIDED;
declare const path_NO_PATH: typeof NO_PATH;
type path_BlockedFn = BlockedFn;
declare const path_calculateDistances: typeof calculateDistances;
declare const path_nextStep: typeof nextStep;
declare const path_getPath: typeof getPath;
declare namespace path {
  export {
    path_FORBIDDEN as FORBIDDEN,
    path_OBSTRUCTION as OBSTRUCTION,
    path_AVOIDED as AVOIDED,
    path_NO_PATH as NO_PATH,
    path_BlockedFn as BlockedFn,
    path_calculateDistances as calculateDistances,
    path_nextStep as nextStep,
    path_getPath as getPath,
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

type events_EventFn = EventFn;
type events_Listener = Listener;
declare const events_Listener: typeof Listener;
declare const events_addListener: typeof addListener;
declare const events_on: typeof on;
declare const events_once: typeof once;
declare const events_removeListener: typeof removeListener;
declare const events_off: typeof off;
declare const events_clearEvent: typeof clearEvent;
declare const events_removeAllListeners: typeof removeAllListeners;
declare const events_emit: typeof emit;
declare namespace events {
  export {
    events_EventFn as EventFn,
    events_Listener as Listener,
    events_addListener as addListener,
    events_on as on,
    events_once as once,
    events_removeListener as removeListener,
    events_off as off,
    events_clearEvent as clearEvent,
    events_removeAllListeners as removeAllListeners,
    events_emit as emit,
  };
}

declare type FrequencyFn = (danger: number) => number;
declare type FrequencyConfig = FrequencyFn | number | string | Record<string, number> | null;
declare function make$7(v?: FrequencyConfig): FrequencyFn;

type frequency_FrequencyFn = FrequencyFn;
type frequency_FrequencyConfig = FrequencyConfig;
declare namespace frequency {
  export {
    frequency_FrequencyFn as FrequencyFn,
    frequency_FrequencyConfig as FrequencyConfig,
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

type scheduler_ScheduleFn = ScheduleFn;
type scheduler_Scheduler = Scheduler;
declare const scheduler_Scheduler: typeof Scheduler;
declare namespace scheduler {
  export {
    scheduler_ScheduleFn as ScheduleFn,
    scheduler_Scheduler as Scheduler,
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

type index$9_MouseEventFn = MouseEventFn;
type index$9_CanvasOptions = CanvasOptions;
type index$9_NotSupportedError = NotSupportedError;
declare const index$9_NotSupportedError: typeof NotSupportedError;
type index$9_BaseCanvas = BaseCanvas;
declare const index$9_BaseCanvas: typeof BaseCanvas;
type index$9_Canvas = Canvas;
declare const index$9_Canvas: typeof Canvas;
type index$9_Canvas2D = Canvas2D;
declare const index$9_Canvas2D: typeof Canvas2D;
type index$9_GlyphOptions = GlyphOptions;
type index$9_Glyphs = Glyphs;
declare const index$9_Glyphs: typeof Glyphs;
type index$9_DrawData = DrawData;
type index$9_BufferTarget = BufferTarget;
type index$9_DataBuffer = DataBuffer;
declare const index$9_DataBuffer: typeof DataBuffer;
declare const index$9_makeDataBuffer: typeof makeDataBuffer;
type index$9_Buffer = Buffer;
declare const index$9_Buffer: typeof Buffer;
declare const index$9_makeBuffer: typeof makeBuffer;
declare namespace index$9 {
  export {
    index$9_MouseEventFn as MouseEventFn,
    index$9_CanvasOptions as CanvasOptions,
    index$9_NotSupportedError as NotSupportedError,
    index$9_BaseCanvas as BaseCanvas,
    index$9_Canvas as Canvas,
    index$9_Canvas2D as Canvas2D,
    make$6 as make,
    index$9_GlyphOptions as GlyphOptions,
    index$9_Glyphs as Glyphs,
    index$9_DrawData as DrawData,
    index$9_BufferTarget as BufferTarget,
    index$9_DataBuffer as DataBuffer,
    index$9_makeDataBuffer as makeDataBuffer,
    index$9_Buffer as Buffer,
    index$9_makeBuffer as makeBuffer,
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

type index$8_SpriteConfig = SpriteConfig;
type index$8_Sprite = Sprite;
declare const index$8_Sprite: typeof Sprite;
declare const index$8_sprites: typeof sprites;
type index$8_DrawInfo = DrawInfo;
type index$8_Mixer = Mixer;
declare const index$8_Mixer: typeof Mixer;
declare const index$8_makeMixer: typeof makeMixer;
type index$8_SpriteData = SpriteData;
declare namespace index$8 {
  export {
    index$8_SpriteConfig as SpriteConfig,
    index$8_Sprite as Sprite,
    index$8_sprites as sprites,
    make$5 as make,
    from$3 as from,
    install$4 as install,
    index$8_DrawInfo as DrawInfo,
    index$8_Mixer as Mixer,
    index$8_makeMixer as makeMixer,
    index$8_SpriteData as SpriteData,
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
declare function configure$1(opts?: Options): void;

declare const index$7_compile: typeof compile;
declare const index$7_apply: typeof apply;
declare const index$7_eachChar: typeof eachChar;
declare const index$7_length: typeof length;
declare const index$7_padStart: typeof padStart;
declare const index$7_padEnd: typeof padEnd;
declare const index$7_center: typeof center;
declare const index$7_firstChar: typeof firstChar;
declare const index$7_capitalize: typeof capitalize;
declare const index$7_removeColors: typeof removeColors;
declare const index$7_wordWrap: typeof wordWrap;
declare const index$7_splitIntoLines: typeof splitIntoLines;
declare const index$7_addHelper: typeof addHelper;
declare const index$7_options: typeof options;
type index$7_Template = Template;
declare namespace index$7 {
  export {
    index$7_compile as compile,
    index$7_apply as apply,
    index$7_eachChar as eachChar,
    index$7_length as length,
    index$7_padStart as padStart,
    index$7_padEnd as padEnd,
    index$7_center as center,
    index$7_firstChar as firstChar,
    index$7_capitalize as capitalize,
    index$7_removeColors as removeColors,
    index$7_wordWrap as wordWrap,
    index$7_splitIntoLines as splitIntoLines,
    configure$1 as configure,
    index$7_addHelper as addHelper,
    index$7_options as options,
    index$7_Template as Template,
  };
}

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

type flags$3_Depth = Depth;
declare const flags$3_Depth: typeof Depth;
type flags$3_DepthString = DepthString;
declare namespace flags$3 {
  export {
    GameObject$1 as GameObject,
    flags$3_Depth as Depth,
    flags$3_DepthString as DepthString,
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
declare function install$3(id: string, color: ColorBase, radius: RangeBase, fadeTo?: number, pass?: boolean): Light;
declare function install$3(id: string, base: LightBase): Light;
declare function install$3(id: string, config: LightConfig): Light;
declare function installAll$3(config?: Record<string, LightConfig | LightBase>): void;

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

type index$6_LightConfig = LightConfig;
type index$6_LightBase = LightBase;
type index$6_LightType = LightType;
type index$6_LightCb = LightCb;
type index$6_PaintSite = PaintSite;
type index$6_LightSystemSite = LightSystemSite;
type index$6_LightSystemType = LightSystemType;
type index$6_Light = Light;
declare const index$6_Light: typeof Light;
declare const index$6_intensity: typeof intensity;
declare const index$6_isDarkLight: typeof isDarkLight;
declare const index$6_isShadowLight: typeof isShadowLight;
declare const index$6_lights: typeof lights;
type index$6_StaticLightInfo = StaticLightInfo;
type index$6_LightSystemOptions = LightSystemOptions;
type index$6_LightSystem = LightSystem;
declare const index$6_LightSystem: typeof LightSystem;
declare namespace index$6 {
  export {
    index$6_LightConfig as LightConfig,
    index$6_LightBase as LightBase,
    index$6_LightType as LightType,
    index$6_LightCb as LightCb,
    index$6_PaintSite as PaintSite,
    index$6_LightSystemSite as LightSystemSite,
    index$6_LightSystemType as LightSystemType,
    config$1 as config,
    index$6_Light as Light,
    index$6_intensity as intensity,
    index$6_isDarkLight as isDarkLight,
    index$6_isShadowLight as isShadowLight,
    make$4 as make,
    index$6_lights as lights,
    from$2 as from,
    install$3 as install,
    installAll$3 as installAll,
    index$6_StaticLightInfo as StaticLightInfo,
    index$6_LightSystemOptions as LightSystemOptions,
    index$6_LightSystem as LightSystem,
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
}

type index$5_ObjectFlags = ObjectFlags;
type index$5_ObjectType = ObjectType;
type index$5_GameObject = GameObject;
declare const index$5_GameObject: typeof GameObject;
declare namespace index$5 {
  export {
    flags$3 as flags,
    index$5_ObjectFlags as ObjectFlags,
    index$5_ObjectType as ObjectType,
    index$5_GameObject as GameObject,
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
    T_DIVIDES_LEVEL,
    T_LAKE_PATHING_BLOCKER,
    T_WAYPOINT_BLOCKER,
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

interface TileFlags extends ObjectFlags {
    readonly tile: number;
    readonly tileMech: number;
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
    priority: number;
    dissipate: number;
    depth: Depth | DepthString;
    effects: Record<string, Partial<EffectConfig> | string | null>;
    groundTile: string;
    light: LightBase | null;
}
declare function make$3(options: Partial<TileOptions>): Tile;
declare const tiles: Record<string, Tile>;
declare const all: Tile[];
declare function get(id: string | number): Tile;
declare function install$2(id: string, options: Partial<TileOptions>): Tile;
declare function install$2(id: string, base: string, options: Partial<TileOptions>): Tile;
declare function installAll$2(tiles: Record<string, Partial<TileOptions>>): void;

declare const flags$2: {
    Tile: typeof Tile$1;
    TileMech: typeof TileMech;
};

type index$4_TileFlags = TileFlags;
type index$4_NameConfig = NameConfig;
type index$4_TileType = TileType;
type index$4_TileConfig = TileConfig;
type index$4_Tile = Tile;
declare const index$4_Tile: typeof Tile;
type index$4_TileOptions = TileOptions;
declare const index$4_tiles: typeof tiles;
declare const index$4_all: typeof all;
declare const index$4_get: typeof get;
declare namespace index$4 {
  export {
    flags$2 as flags,
    index$4_TileFlags as TileFlags,
    index$4_NameConfig as NameConfig,
    index$4_TileType as TileType,
    index$4_TileConfig as TileConfig,
    index$4_Tile as Tile,
    index$4_TileOptions as TileOptions,
    make$3 as make,
    index$4_tiles as tiles,
    index$4_all as all,
    index$4_get as get,
    install$2 as install,
    installAll$2 as installAll,
  };
}

interface CellFlags {
    cell: number;
}
interface MapFlags {
    map: number;
}
interface CellType {
    flags: CellFlags;
    tileFlags(): number;
    tileMechFlags(): number;
    objects: Chain<GameObject>;
    chokeCount: number;
    hasTileFlag(flag: number): boolean;
    hasAllTileFlags(flags: number): boolean;
    hasObjectFlag(flag: number): boolean;
    hasAllObjectFlags(flags: number): boolean;
    objectFlags(): number;
    tileFlags(): number;
    tileMechFlags(): number;
    depthPriority(depth: number): number;
    highestPriority(): number;
    depthTile(depth: number): Tile;
    hasTile(tile?: string | number | Tile): boolean;
    isWall(): boolean;
    blocksVision(): boolean;
    blocksPathing(): boolean;
    blocksMove(): boolean;
    blocksEffects(): boolean;
    blocksLayer(depth: number): boolean;
    hasCellFlag(flag: number): boolean;
    setCellFlag(flag: number): void;
    clearCellFlag(flag: number): void;
    setTile(tile: Tile): boolean;
    clear(): void;
    clearLayer(depth: number): boolean;
    eachGlowLight(cb: (light: LightType) => any): void;
    activate(event: string, map: MapType, x: number, y: number, ctx: Partial<EffectCtx>): Promise<boolean> | boolean;
    hasEffect(name: string): boolean;
    hasItem(): boolean;
    hasActor(): boolean;
    redraw(): void;
    needsRedraw: boolean;
    clearMemory(): void;
    storeMemory(): void;
    getSnapshot(dest: Mixer): void;
    putSnapshot(src: Mixer): void;
}
declare type ObjectMatchFn = (obj: GameObject) => boolean;
declare type ObjectFn = (obj: GameObject) => any;
interface ObjectListType {
    at(x: number, y: number, cb: ObjectMatchFn): GameObject | null;
    has(obj: GameObject): boolean;
    add(x: number, y: number, obj: GameObject): boolean;
    remove(obj: GameObject): boolean;
    move(obj: GameObject, x: number, y: number): boolean;
    forEach(cb: ObjectFn): void;
    forEachAt(x: number, y: number, cb: ObjectFn): void;
}
declare type EachCellCb = (cell: CellType, x: number, y: number, map: MapType) => void;
declare type MapTestFn = (cell: CellType, x: number, y: number, map: MapType) => boolean;
interface MapType {
    readonly width: number;
    readonly height: number;
    readonly objects: ObjectListType;
    light: LightSystemType;
    fov: FovSystemType;
    properties: Record<string, any>;
    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;
    cell(x: number, y: number): CellType;
    get(x: number, y: number): CellType | undefined;
    eachCell(cb: EachCellCb): void;
    hasItem(x: number, y: number): boolean;
    hasActor(x: number, y: number): boolean;
    isVisible(x: number, y: number): boolean;
    blocksVision(x: number, y: number): boolean;
    blocksMove(x: number, y: number): boolean;
    isStairs(x: number, y: number): boolean;
    isWall(x: number, y: number): boolean;
    count(cb: MapTestFn): number;
    dump(fmt?: (cell: CellType) => string): void;
    hasMapFlag(flag: number): boolean;
    setMapFlag(flag: number): void;
    clearMapFlag(flag: number): void;
    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;
    hasCellFlag(x: number, y: number, flag: number): boolean;
    hasObjectFlag(x: number, y: number, flag: number): boolean;
    hasTileFlag(x: number, y: number, flag: number): boolean;
    fill(tile: string, boundary?: string): void;
    setTile(x: number, y: number, tile: string | number | Tile, opts?: any): boolean;
    hasTile(x: number, y: number, tile: string | number | Tile): boolean;
    update(dt: number): Promise<void>;
    getAppearanceAt(x: number, y: number, dest: Mixer): void;
}

interface ActorFlags extends ObjectFlags {
    actor: number;
}

declare enum Actor$1 {
    IS_PLAYER
}

type flags$1_Depth = Depth;
declare const flags$1_Depth: typeof Depth;
declare namespace flags$1 {
  export {
    Actor$1 as Actor,
    GameObject$1 as GameObject,
    flags$1_Depth as Depth,
  };
}

declare class Actor extends GameObject {
    flags: ActorFlags;
    constructor();
    hasActorFlag(flag: number): boolean;
    hasAllActorFlags(flags: number): boolean;
    isPlayer(): boolean;
    isVisible(): boolean;
    forbidsCell(_cell: CellType): boolean;
}

type index$3_Actor = Actor;
declare const index$3_Actor: typeof Actor;
type index$3_ActorFlags = ActorFlags;
declare namespace index$3 {
  export {
    index$3_Actor as Actor,
    flags$1 as flags,
    index$3_ActorFlags as ActorFlags,
  };
}

declare const templates: Record<string, Template>;
declare function install$1(id: string, msg: string): void;
declare function installAll$1(config: Record<string, string>): void;
declare function needsUpdate(needs?: boolean): boolean;
interface MessageOptions {
    length: number;
    width: number;
}
declare function configure(opts: Partial<MessageOptions>): void;
declare function add(msg: string, args?: any): void;
declare function fromActor(actor: Actor, msg: string, args?: any): void;
declare function forPlayer(actor: Actor, msg: string, args?: any): void;
declare function addCombat(actor: Actor, msg: string, args?: any): void;
declare function confirmAll(): void;
declare type EachMsgFn = (msg: string, confirmed: boolean, i: number) => any;
declare function forEach(fn: EachMsgFn): void;

declare const message_templates: typeof templates;
declare const message_needsUpdate: typeof needsUpdate;
type message_MessageOptions = MessageOptions;
declare const message_configure: typeof configure;
declare const message_add: typeof add;
declare const message_fromActor: typeof fromActor;
declare const message_forPlayer: typeof forPlayer;
declare const message_addCombat: typeof addCombat;
declare const message_confirmAll: typeof confirmAll;
type message_EachMsgFn = EachMsgFn;
declare const message_forEach: typeof forEach;
declare namespace message {
  export {
    message_templates as templates,
    install$1 as install,
    installAll$1 as installAll,
    message_needsUpdate as needsUpdate,
    message_MessageOptions as MessageOptions,
    message_configure as configure,
    message_add as add,
    message_fromActor as fromActor,
    message_forPlayer as forPlayer,
    message_addCombat as addCombat,
    message_confirmAll as confirmAll,
    message_EachMsgFn as EachMsgFn,
    message_forEach as forEach,
  };
}

declare enum Effect {
    E_NEXT_ALWAYS,
    E_NEXT_EVERYWHERE,
    E_TREAT_AS_BLOCKING,
    E_PERMIT_BLOCKING,
    E_ABORT_IF_BLOCKS_MAP,
    E_BLOCKED_BY_ITEMS,
    E_BLOCKED_BY_ACTORS,
    E_BLOCKED_BY_OTHER_LAYERS,
    E_SUPERPRIORITY,
    E_NO_MARK_FIRED,
    E_PROTECTED,
    E_SPREAD_CIRCLE,
    E_SPREAD_LINE,
    E_EVACUATE_CREATURES,
    E_EVACUATE_ITEMS,
    E_BUILD_IN_WALLS,
    E_MUST_TOUCH_WALLS,
    E_NO_TOUCH_WALLS,
    E_FIRED,
    E_CLEAR_GROUND,
    E_CLEAR_SURFACE,
    E_CLEAR_LIQUID,
    E_CLEAR_GAS,
    E_CLEAR_CELL,
    E_ONLY_IF_EMPTY,
    E_ACTIVATE_DORMANT_MONSTER,
    E_AGGRAVATES_MONSTERS,
    E_RESURRECT_ALLY,
    E_EMIT_EVENT
}

interface EffectHandler {
    make: (src: Partial<EffectConfig>, dest: EffectInfo) => boolean;
    fire: (config: EffectInfo, map: MapType, x: number, y: number, ctx: EffectCtx) => boolean | Promise<boolean>;
}

declare function reset(effect: EffectInfo): void;
declare function resetAll(): void;
declare const effects: Record<string, EffectInfo>;
declare function install(id: string, config: Partial<EffectConfig>): EffectInfo;
declare function installAll(effects: Record<string, Partial<EffectConfig>>): void;
declare const effectTypes: Record<string, EffectHandler>;
declare function installType(id: string, effectType: EffectHandler): void;

declare function make$2(opts: EffectBase): EffectInfo;
declare function from$1(opts: EffectBase | string): EffectInfo;

declare function fire(effect: EffectInfo | string, map: MapType, x: number, y: number, ctx_?: Partial<EffectCtx>): Promise<boolean>;

declare class MessageEffect implements EffectHandler {
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean;
    fire(config: any, map: MapType, x: number, y: number, ctx: EffectCtx): Promise<boolean>;
}

declare class EmitEffect implements EffectHandler {
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean;
    fire(config: any, _map: MapType, x: number, y: number, ctx: EffectCtx): Promise<boolean>;
}

type index$2_EffectInfo = EffectInfo;
type index$2_EffectCtx = EffectCtx;
type index$2_EffectConfig = EffectConfig;
type index$2_EffectBase = EffectBase;
type index$2_EffectHandler = EffectHandler;
declare const index$2_reset: typeof reset;
declare const index$2_resetAll: typeof resetAll;
declare const index$2_effects: typeof effects;
declare const index$2_install: typeof install;
declare const index$2_installAll: typeof installAll;
declare const index$2_effectTypes: typeof effectTypes;
declare const index$2_installType: typeof installType;
declare const index$2_fire: typeof fire;
type index$2_MessageEffect = MessageEffect;
declare const index$2_MessageEffect: typeof MessageEffect;
type index$2_EmitEffect = EmitEffect;
declare const index$2_EmitEffect: typeof EmitEffect;
declare namespace index$2 {
  export {
    Effect as Flags,
    index$2_EffectInfo as EffectInfo,
    index$2_EffectCtx as EffectCtx,
    index$2_EffectConfig as EffectConfig,
    index$2_EffectBase as EffectBase,
    index$2_EffectHandler as EffectHandler,
    index$2_reset as reset,
    index$2_resetAll as resetAll,
    index$2_effects as effects,
    index$2_install as install,
    index$2_installAll as installAll,
    index$2_effectTypes as effectTypes,
    index$2_installType as installType,
    make$2 as make,
    from$1 as from,
    index$2_fire as fire,
    index$2_MessageEffect as MessageEffect,
    index$2_EmitEffect as EmitEffect,
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

type blob_BlobConfig = BlobConfig;
type blob_Blob = Blob;
declare const blob_Blob: typeof Blob;
declare const blob_fillBlob: typeof fillBlob;
declare namespace blob {
  export {
    blob_BlobConfig as BlobConfig,
    blob_Blob as Blob,
    blob_fillBlob as fillBlob,
    make$1 as make,
  };
}

interface ItemFlags extends ObjectFlags {
    item: number;
}

declare class Item extends GameObject {
    flags: ItemFlags;
    quantity: number;
    constructor();
    hasItemFlag(flag: number): boolean;
    hasAllItemFlags(flags: number): boolean;
    forbidsCell(_cell: CellType): boolean;
}

type index$1_Item = Item;
declare const index$1_Item: typeof Item;
type index$1_ItemFlags = ItemFlags;
declare namespace index$1 {
  export {
    index$1_Item as Item,
    index$1_ItemFlags as ItemFlags,
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
interface AllCellFlags extends CellFlags, ActorFlags, ItemFlags, TileFlags {
}
declare class CellMemory {
    snapshot: Mixer;
    flags: AllCellFlags;
    constructor();
}
declare class Cell implements CellType {
    flags: CellFlags;
    chokeCount: number;
    tiles: TileArray;
    objects: Chain<GameObject>;
    gasVolume: number;
    liquidVolume: number;
    memory: CellMemory;
    constructor();
    hasTileFlag(flag: number): boolean;
    hasAllTileFlags(flags: number): boolean;
    hasObjectFlag(flag: number): boolean;
    hasAllObjectFlags(flags: number): boolean;
    objectFlags(): number;
    tileFlags(): number;
    tileMechFlags(): number;
    get needsRedraw(): boolean;
    set needsRedraw(v: boolean);
    depthPriority(depth: number): number;
    highestPriority(): number;
    depthTile(depth: number): Tile;
    hasTile(tile?: string | number | Tile): boolean;
    blocksVision(): boolean;
    blocksPathing(): boolean;
    blocksMove(): boolean;
    blocksEffects(): boolean;
    blocksLayer(depth: number): boolean;
    isWall(): boolean;
    hasCellFlag(flag: number): boolean;
    setCellFlag(flag: number): void;
    clearCellFlag(flag: number): void;
    setTile(tile: Tile): boolean;
    clear(): void;
    clearLayer(depth: Depth): boolean;
    eachGlowLight(cb: (light: LightType) => any): void;
    activate(event: string, map: MapType, x: number, y: number, ctx?: Partial<EffectCtx>): Promise<boolean>;
    hasEffect(name: string): boolean;
    hasItem(): boolean;
    hasActor(): boolean;
    redraw(): void;
    clearMemory(): void;
    storeMemory(): void;
    getSnapshot(dest: Mixer): void;
    putSnapshot(src: Mixer): void;
    dump(): string;
}

declare class MapLayer {
    map: Map;
    depth: number;
    properties: Record<string, any>;
    name: string;
    constructor(map: Map, name?: string);
}
declare abstract class ObjectLayer extends MapLayer {
    constructor(map: Map, name?: string);
    abstract add(x: number, y: number, obj: GameObject, _opts?: any): boolean;
    abstract remove(obj: GameObject): boolean;
    putAppearance(dest: Mixer, x: number, y: number): void;
    update(_dt: number): void;
}
declare class ActorLayer extends ObjectLayer {
    constructor(map: Map, name?: string);
    add(x: number, y: number, obj: GameObject, _opts?: any): boolean;
    remove(obj: GameObject): boolean;
    putAppearance(dest: Mixer, x: number, y: number): void;
    update(_dt: number): void;
}
declare class ItemLayer extends ObjectLayer {
    constructor(map: Map, name?: string);
    add(x: number, y: number, obj: GameObject, _opts?: any): boolean;
    remove(obj: GameObject): boolean;
    putAppearance(dest: Mixer, x: number, y: number): void;
    update(_dt: number): void;
}
interface TileSetOptions {
    force?: boolean;
}
declare class TileLayer extends MapLayer {
    constructor(map: Map, name?: string);
    set(x: number, y: number, tile: Tile, opts?: TileSetOptions): boolean;
    update(_dt: number): Promise<void>;
    putAppearance(dest: Mixer, x: number, y: number): void;
}

declare class ObjectList implements ObjectListType {
    map: Map;
    constructor(map: Map);
    at(x: number, y: number, cb: ObjectMatchFn): GameObject | null;
    has(obj: GameObject): boolean;
    add(x: number, y: number, obj: GameObject): boolean;
    remove(obj: GameObject): boolean;
    move(obj: GameObject, x: number, y: number): boolean;
    forEach(cb: ObjectFn): void;
    forEachAt(x: number, y: number, cb: ObjectFn): number;
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
    _objects: ObjectList;
    layers: LayerType[];
    flags: {
        map: 0;
    };
    light: LightSystemType;
    fov: FovSystemType;
    properties: Record<string, any>;
    constructor(width: number, height: number, opts?: Partial<MapOptions>);
    initLayers(): void;
    addLayer(depth: number, layer: LayerType): void;
    removeLayer(depth: number): void;
    getLayer(depth: number): LayerType | null;
    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;
    cell(x: number, y: number): Cell;
    get(x: number, y: number): Cell | undefined;
    eachCell(cb: EachCellCb): void;
    drawInto(dest: Canvas | DataBuffer, opts?: Partial<MapDrawOptions> | boolean): void;
    hasItem(x: number, y: number): boolean;
    hasActor(x: number, y: number): boolean;
    isVisible(x: number, y: number): boolean;
    blocksVision(x: number, y: number): boolean;
    blocksMove(x: number, y: number): boolean;
    isStairs(x: number, y: number): boolean;
    count(cb: MapTestFn): number;
    dump(fmt?: (cell: CellType) => string): void;
    hasMapFlag(flag: number): boolean;
    setMapFlag(flag: number): void;
    clearMapFlag(flag: number): void;
    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;
    hasCellFlag(x: number, y: number, flag: number): boolean;
    hasObjectFlag(x: number, y: number, flag: number): boolean;
    hasTileFlag(x: number, y: number, flag: number): boolean;
    fill(tile: string, boundary?: string): void;
    setTile(x: number, y: number, tile: string | number | Tile, opts?: any): boolean;
    hasTile(x: number, y: number, tile: string | number | Tile): boolean;
    get objects(): ObjectList;
    update(dt: number): Promise<void>;
    copy(_src: Map): void;
    clone(): void;
    getAppearanceAt(x: number, y: number, dest: Mixer): void;
    eachGlowLight(cb: LightCb): void;
    eachDynamicLight(_cb: LightCb): void;
    eachViewport(_cb: ViewportCb): void;
    lightingChanged(): boolean;
    hasVisibleLight(x: number, y: number): boolean;
    cellRevealed(_x: number, _y: number): void;
    redrawCell(x: number, y: number, clearMemory?: boolean): void;
    storeMemory(x: number, y: number): void;
    isWall(x: number, y: number): boolean;
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
    mapDisruptedBy(map: MapType, blockingGrid: NumGrid, blockingToMapX?: number, blockingToMapY?: number): boolean;
}
declare function spawnTiles(flags: number, spawnMap: NumGrid, map: MapType, tile: Tile, volume?: number): boolean;
declare function computeSpawnMap(effect: EffectInfo, map: MapType, x: number, y: number, ctx: EffectCtx): boolean;
declare function clearCells(map: MapType, spawnMap: NumGrid, flags?: number): boolean;
declare function evacuateCreatures(map: MapType, blockingMap: NumGrid): boolean;
declare function evacuateItems(map: MapType, blockingMap: NumGrid): boolean;

declare const flags: {
    Cell: typeof Cell$1;
    Map: typeof Map$1;
    GameObject: typeof GameObject$1;
};

declare const index_flags: typeof flags;
type index_CellFlags = CellFlags;
type index_MapFlags = MapFlags;
type index_CellType = CellType;
type index_ObjectMatchFn = ObjectMatchFn;
type index_ObjectFn = ObjectFn;
type index_ObjectListType = ObjectListType;
type index_EachCellCb = EachCellCb;
type index_MapTestFn = MapTestFn;
type index_MapType = MapType;
type index_AllCellFlags = AllCellFlags;
type index_CellMemory = CellMemory;
declare const index_CellMemory: typeof CellMemory;
type index_Cell = Cell;
declare const index_Cell: typeof Cell;
type index_MapOptions = MapOptions;
type index_LayerType = LayerType;
type index_MapDrawOptions = MapDrawOptions;
type index_Map = Map;
declare const index_Map: typeof Map;
declare const index_make: typeof make;
declare const index_from: typeof from;
declare const index_analyze: typeof analyze;
declare const index_updateChokepoints: typeof updateChokepoints;
declare const index_floodFillCount: typeof floodFillCount;
declare const index_updateLoopiness: typeof updateLoopiness;
declare const index_resetLoopiness: typeof resetLoopiness;
declare const index_checkLoopiness: typeof checkLoopiness;
declare const index_fillInnerLoopGrid: typeof fillInnerLoopGrid;
declare const index_cleanLoopiness: typeof cleanLoopiness;
type index_SpawnConfig = SpawnConfig;
type index_SpawnInfo = SpawnInfo;
type index_SpawnEffect = SpawnEffect;
declare const index_SpawnEffect: typeof SpawnEffect;
declare const index_spawnTiles: typeof spawnTiles;
declare const index_computeSpawnMap: typeof computeSpawnMap;
declare const index_clearCells: typeof clearCells;
declare const index_evacuateCreatures: typeof evacuateCreatures;
declare const index_evacuateItems: typeof evacuateItems;
declare namespace index {
  export {
    index_flags as flags,
    index_CellFlags as CellFlags,
    index_MapFlags as MapFlags,
    index_CellType as CellType,
    index_ObjectMatchFn as ObjectMatchFn,
    index_ObjectFn as ObjectFn,
    index_ObjectListType as ObjectListType,
    index_EachCellCb as EachCellCb,
    index_MapTestFn as MapTestFn,
    index_MapType as MapType,
    index_AllCellFlags as AllCellFlags,
    index_CellMemory as CellMemory,
    index_Cell as Cell,
    index_MapOptions as MapOptions,
    index_LayerType as LayerType,
    index_MapDrawOptions as MapDrawOptions,
    index_Map as Map,
    index_make as make,
    index_from as from,
    index_analyze as analyze,
    index_updateChokepoints as updateChokepoints,
    index_floodFillCount as floodFillCount,
    index_updateLoopiness as updateLoopiness,
    index_resetLoopiness as resetLoopiness,
    index_checkLoopiness as checkLoopiness,
    index_fillInnerLoopGrid as fillInnerLoopGrid,
    index_cleanLoopiness as cleanLoopiness,
    index_SpawnConfig as SpawnConfig,
    index_SpawnInfo as SpawnInfo,
    index_SpawnEffect as SpawnEffect,
    index_spawnTiles as spawnTiles,
    index_computeSpawnMap as computeSpawnMap,
    index_clearCells as clearCells,
    index_evacuateCreatures as evacuateCreatures,
    index_evacuateItems as evacuateItems,
  };
}

export { Random, index$3 as actor, blob, index$9 as canvas, index$c as color, colors, config, cosmetic, data, index$2 as effect, events, flag, index$a as fov, frequency, index$5 as gameObject, grid, io, index$1 as item, index$6 as light, loop, index as map, message, path, random, range, scheduler, index$8 as sprite, sprites, index$7 as text, index$4 as tile, types, index$b as utils };
