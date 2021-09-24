/**
 * GW.utils
 * @module utils
 */
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
declare function ERROR(message: string): void;
declare function WARN(...args: string[]): void;
declare function first(...args: any[]): any;
declare function arraysIntersect(a: any[], b: any[]): boolean;
declare function arrayDelete<T>(a: T[], b: T): boolean;
declare function sum(arr: number[]): number;

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
declare function make$a(): Color;
declare function make$a(rgb: number, base256?: boolean): Color;
declare function make$a(color?: ColorBase | null): Color;
declare function make$a(arrayLike: ColorData, base256?: boolean): Color;
declare function make$a(...rgb: number[]): Color;
declare function from$4(): Color;
declare function from$4(rgb: number, base256?: boolean): Color;
declare function from$4(color?: ColorBase | null): Color;
declare function from$4(arrayLike: ColorData, base256?: boolean): Color;
declare function from$4(...rgb: number[]): Color;
declare function separate(a: Color, b: Color): void;
declare function swap(a: Color, b: Color): void;
declare function relativeLuminance(a: Color, b: Color): number;
declare function distance(a: Color, b: Color): number;
declare function smoothScalar(rgb: number, maxRgb?: number): number;
declare function install$3(name: string, info: ColorBase): Color;
declare function install$3(name: string, ...rgb: ColorData): Color;
declare function installSpread(name: string, info: ColorBase): Color;
declare function installSpread(name: string, ...rgb: ColorData): Color;
declare const NONE: Color;

type index_d$5_ColorData = ColorData;
type index_d$5_ColorBase = ColorBase;
type index_d$5_LightValue = LightValue;
declare const index_d$5_colors: typeof colors;
type index_d$5_Color = Color;
declare const index_d$5_Color: typeof Color;
declare const index_d$5_fromArray: typeof fromArray;
declare const index_d$5_fromCss: typeof fromCss;
declare const index_d$5_fromName: typeof fromName;
declare const index_d$5_fromNumber: typeof fromNumber;
declare const index_d$5_separate: typeof separate;
declare const index_d$5_swap: typeof swap;
declare const index_d$5_relativeLuminance: typeof relativeLuminance;
declare const index_d$5_distance: typeof distance;
declare const index_d$5_smoothScalar: typeof smoothScalar;
declare const index_d$5_installSpread: typeof installSpread;
declare const index_d$5_NONE: typeof NONE;
declare namespace index_d$5 {
  export {
    index_d$5_ColorData as ColorData,
    index_d$5_ColorBase as ColorBase,
    index_d$5_LightValue as LightValue,
    index_d$5_colors as colors,
    index_d$5_Color as Color,
    index_d$5_fromArray as fromArray,
    index_d$5_fromCss as fromCss,
    index_d$5_fromName as fromName,
    index_d$5_fromNumber as fromNumber,
    make$a as make,
    from$4 as from,
    index_d$5_separate as separate,
    index_d$5_swap as swap,
    index_d$5_relativeLuminance as relativeLuminance,
    index_d$5_distance as distance,
    index_d$5_smoothScalar as smoothScalar,
    install$3 as install,
    index_d$5_installSpread as installSpread,
    index_d$5_NONE as NONE,
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
declare type EachCb<T> = (t: T) => any;
declare type RandomFunction = () => number;
declare type SeedFunction = (seed?: number) => RandomFunction;
interface RandomConfig {
    make: SeedFunction;
}
declare type WeightedArray = number[];
interface WeightedObject {
    [key: string]: number;
}

type types_d_XY = XY;
type types_d_EachCb<_0> = EachCb<_0>;
type types_d_RandomFunction = RandomFunction;
type types_d_SeedFunction = SeedFunction;
type types_d_RandomConfig = RandomConfig;
type types_d_WeightedArray = WeightedArray;
type types_d_WeightedObject = WeightedObject;
declare namespace types_d {
  export {
    Loc$1 as Loc,
    types_d_XY as XY,
    SpriteData$1 as SpriteData,
    types_d_EachCb as EachCb,
    types_d_RandomFunction as RandomFunction,
    types_d_SeedFunction as SeedFunction,
    types_d_RandomConfig as RandomConfig,
    types_d_WeightedArray as WeightedArray,
    types_d_WeightedObject as WeightedObject,
  };
}

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
    toString(): string;
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
declare function straightDistanceBetween(x1: number, y1: number, x2: number, y2: number): number;
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
declare function forLine(x: number, y: number, dir: Loc$1, length: number, fn: (x: number, y: number) => any): void;
declare function forLineBetween(fromX: number, fromY: number, toX: number, toY: number, stepFn: (x: number, y: number) => boolean | void): boolean;
declare function getLine(fromX: number, fromY: number, toX: number, toY: number): Loc$1[];
declare function getLineThru(fromX: number, fromY: number, toX: number, toY: number, width: number, height: number): Loc$1[];
declare function forCircle(x: number, y: number, radius: number, fn: XYFunc): void;
declare function forRect(width: number, height: number, fn: XYFunc): void;
declare function forRect(x: number, y: number, width: number, height: number, fn: XYFunc): void;
declare function forBorder(width: number, height: number, fn: XYFunc): void;
declare function forBorder(x: number, y: number, width: number, height: number, fn: XYFunc): void;
declare function arcCount(x: number, y: number, testFn: XYMatchFunc): number;

type xy_d_XY = XY;
declare const xy_d_DIRS: typeof DIRS;
declare const xy_d_NO_DIRECTION: typeof NO_DIRECTION;
declare const xy_d_UP: typeof UP;
declare const xy_d_RIGHT: typeof RIGHT;
declare const xy_d_DOWN: typeof DOWN;
declare const xy_d_LEFT: typeof LEFT;
declare const xy_d_RIGHT_UP: typeof RIGHT_UP;
declare const xy_d_RIGHT_DOWN: typeof RIGHT_DOWN;
declare const xy_d_LEFT_DOWN: typeof LEFT_DOWN;
declare const xy_d_LEFT_UP: typeof LEFT_UP;
declare const xy_d_CLOCK_DIRS: typeof CLOCK_DIRS;
declare const xy_d_x: typeof x;
declare const xy_d_y: typeof y;
type xy_d_Bounds = Bounds;
declare const xy_d_Bounds: typeof Bounds;
declare const xy_d_copyXY: typeof copyXY;
declare const xy_d_addXY: typeof addXY;
declare const xy_d_equalsXY: typeof equalsXY;
declare const xy_d_lerpXY: typeof lerpXY;
type xy_d_XYFunc = XYFunc;
declare const xy_d_eachNeighbor: typeof eachNeighbor;
declare const xy_d_eachNeighborAsync: typeof eachNeighborAsync;
type xy_d_XYMatchFunc = XYMatchFunc;
declare const xy_d_matchingNeighbor: typeof matchingNeighbor;
declare const xy_d_straightDistanceBetween: typeof straightDistanceBetween;
declare const xy_d_distanceBetween: typeof distanceBetween;
declare const xy_d_distanceFromTo: typeof distanceFromTo;
declare const xy_d_calcRadius: typeof calcRadius;
declare const xy_d_dirBetween: typeof dirBetween;
declare const xy_d_dirFromTo: typeof dirFromTo;
declare const xy_d_dirIndex: typeof dirIndex;
declare const xy_d_isOppositeDir: typeof isOppositeDir;
declare const xy_d_isSameDir: typeof isSameDir;
declare const xy_d_dirSpread: typeof dirSpread;
declare const xy_d_stepFromTo: typeof stepFromTo;
declare const xy_d_forLine: typeof forLine;
declare const xy_d_forLineBetween: typeof forLineBetween;
declare const xy_d_getLine: typeof getLine;
declare const xy_d_getLineThru: typeof getLineThru;
declare const xy_d_forCircle: typeof forCircle;
declare const xy_d_forRect: typeof forRect;
declare const xy_d_forBorder: typeof forBorder;
declare const xy_d_arcCount: typeof arcCount;
declare namespace xy_d {
  export {
    Loc$1 as Loc,
    xy_d_XY as XY,
    xy_d_DIRS as DIRS,
    xy_d_NO_DIRECTION as NO_DIRECTION,
    xy_d_UP as UP,
    xy_d_RIGHT as RIGHT,
    xy_d_DOWN as DOWN,
    xy_d_LEFT as LEFT,
    xy_d_RIGHT_UP as RIGHT_UP,
    xy_d_RIGHT_DOWN as RIGHT_DOWN,
    xy_d_LEFT_DOWN as LEFT_DOWN,
    xy_d_LEFT_UP as LEFT_UP,
    xy_d_CLOCK_DIRS as CLOCK_DIRS,
    xy_d_x as x,
    xy_d_y as y,
    xy_d_Bounds as Bounds,
    xy_d_copyXY as copyXY,
    xy_d_addXY as addXY,
    xy_d_equalsXY as equalsXY,
    xy_d_lerpXY as lerpXY,
    xy_d_XYFunc as XYFunc,
    xy_d_eachNeighbor as eachNeighbor,
    xy_d_eachNeighborAsync as eachNeighborAsync,
    xy_d_XYMatchFunc as XYMatchFunc,
    xy_d_matchingNeighbor as matchingNeighbor,
    xy_d_straightDistanceBetween as straightDistanceBetween,
    xy_d_distanceBetween as distanceBetween,
    xy_d_distanceFromTo as distanceFromTo,
    xy_d_calcRadius as calcRadius,
    xy_d_dirBetween as dirBetween,
    xy_d_dirFromTo as dirFromTo,
    xy_d_dirIndex as dirIndex,
    xy_d_isOppositeDir as isOppositeDir,
    xy_d_isSameDir as isSameDir,
    xy_d_dirSpread as dirSpread,
    xy_d_stepFromTo as stepFromTo,
    xy_d_forLine as forLine,
    xy_d_forLineBetween as forLineBetween,
    xy_d_getLine as getLine,
    xy_d_getLineThru as getLineThru,
    xy_d_forCircle as forCircle,
    xy_d_forRect as forRect,
    xy_d_forBorder as forBorder,
    xy_d_arcCount as arcCount,
  };
}

declare type ListEntry<T> = T | null;
interface ListItem<T> {
    next: ListEntry<T>;
}
declare type ListObject = any;
declare type ListSort<T> = (a: T, b: T) => number;
declare type ListMatch<T> = (val: T) => boolean;
declare type ListEachFn<T> = (val: T, index: number) => any;
declare type ListReduceFn<T> = (out: any, t: T) => any;
declare function length$1<T extends ListItem<T>>(root: ListEntry<T>): number;
declare function includes<T extends ListItem<T>>(root: ListEntry<T>, entry: T): boolean;
declare function forEach<T extends ListItem<T>>(root: T | null, fn: ListEachFn<T>): number;
declare function push<T extends ListItem<T>>(obj: ListObject, name: string, entry: ListItem<T>): boolean;
declare function remove<T extends ListItem<T>>(obj: ListObject, name: string, entry: T): boolean;
declare function find<T extends ListItem<T>>(root: ListEntry<T>, cb: ListMatch<T>): ListEntry<T>;
declare function insert<T extends ListItem<T>>(obj: ListObject, name: string, entry: T, sort?: ListSort<T>): boolean;
declare function reduce<T extends ListItem<T>>(root: ListEntry<T>, cb: ListReduceFn<T>, out?: any): any;
declare function some<T extends ListItem<T>>(root: ListEntry<T>, cb: ListMatch<T>): boolean;
declare function every<T extends ListItem<T>>(root: ListEntry<T>, cb: ListMatch<T>): boolean;

type list_d_ListEntry<_0> = ListEntry<_0>;
type list_d_ListItem<_0> = ListItem<_0>;
type list_d_ListObject = ListObject;
type list_d_ListSort<_0> = ListSort<_0>;
type list_d_ListMatch<_0> = ListMatch<_0>;
type list_d_ListEachFn<_0> = ListEachFn<_0>;
type list_d_ListReduceFn<_0> = ListReduceFn<_0>;
declare const list_d_includes: typeof includes;
declare const list_d_forEach: typeof forEach;
declare const list_d_push: typeof push;
declare const list_d_remove: typeof remove;
declare const list_d_find: typeof find;
declare const list_d_insert: typeof insert;
declare const list_d_reduce: typeof reduce;
declare const list_d_some: typeof some;
declare const list_d_every: typeof every;
declare namespace list_d {
  export {
    list_d_ListEntry as ListEntry,
    list_d_ListItem as ListItem,
    list_d_ListObject as ListObject,
    list_d_ListSort as ListSort,
    list_d_ListMatch as ListMatch,
    list_d_ListEachFn as ListEachFn,
    list_d_ListReduceFn as ListReduceFn,
    length$1 as length,
    list_d_includes as includes,
    list_d_forEach as forEach,
    list_d_push as push,
    list_d_remove as remove,
    list_d_find as find,
    list_d_insert as insert,
    list_d_reduce as reduce,
    list_d_some as some,
    list_d_every as every,
  };
}

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
declare function getOpt(obj: any, member: string, _default: any): any;
declare function firstOpt(field: string, ...args: any[]): any;

declare const object_d_copyObject: typeof copyObject;
declare const object_d_assignObject: typeof assignObject;
declare const object_d_assignOmitting: typeof assignOmitting;
declare const object_d_setDefault: typeof setDefault;
type object_d_AssignCallback = AssignCallback;
declare const object_d_setDefaults: typeof setDefaults;
declare const object_d_setOptions: typeof setOptions;
declare const object_d_kindDefaults: typeof kindDefaults;
declare const object_d_pick: typeof pick;
declare const object_d_clearObject: typeof clearObject;
declare const object_d_getOpt: typeof getOpt;
declare const object_d_firstOpt: typeof firstOpt;
declare namespace object_d {
  export {
    object_d_copyObject as copyObject,
    object_d_assignObject as assignObject,
    object_d_assignOmitting as assignOmitting,
    object_d_setDefault as setDefault,
    object_d_AssignCallback as AssignCallback,
    object_d_setDefaults as setDefaults,
    object_d_setOptions as setOptions,
    object_d_kindDefaults as kindDefaults,
    object_d_pick as pick,
    object_d_clearObject as clearObject,
    object_d_getOpt as getOpt,
    object_d_firstOpt as firstOpt,
  };
}

/**
 * The code in this function is extracted from ROT.JS.
 * Source: https://github.com/ondras/rot.js/blob/v2.2.0/src/rng.ts
 * Copyright (c) 2012-now(), Ondrej Zara
 * All rights reserved.
 * License: BSD 3-Clause "New" or "Revised" License
 * See: https://github.com/ondras/rot.js/blob/v2.2.0/license.txt
 */
declare function Alea(seed?: number): RandomFunction;
declare function configure$1(config?: Partial<RandomConfig>): void;
declare class Random {
    private _fn;
    constructor(seed?: number);
    seed(val?: number): void;
    value(): number;
    float(): number;
    number(max?: number): number;
    int(max?: number): number;
    range(lo: number, hi: number): number;
    dice(count: number, sides: number, addend?: number): number;
    weighted(weights: WeightedArray): number;
    weighted(weights: WeightedObject): string;
    item(list: any[]): any;
    item(obj: {
        [k: string]: any;
    }): any;
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
declare function make$9(seed?: number): Random;

type rng_d_WeightedArray = WeightedArray;
type rng_d_WeightedObject = WeightedObject;
type rng_d_RandomConfig = RandomConfig;
type rng_d_RandomFunction = RandomFunction;
declare const rng_d_Alea: typeof Alea;
type rng_d_Random = Random;
declare const rng_d_Random: typeof Random;
declare const rng_d_random: typeof random;
declare const rng_d_cosmetic: typeof cosmetic;
declare namespace rng_d {
  export {
    rng_d_WeightedArray as WeightedArray,
    rng_d_WeightedObject as WeightedObject,
    rng_d_RandomConfig as RandomConfig,
    rng_d_RandomFunction as RandomFunction,
    rng_d_Alea as Alea,
    configure$1 as configure,
    rng_d_Random as Random,
    rng_d_random as random,
    rng_d_cosmetic as cosmetic,
    make$9 as make,
  };
}

declare type RangeBase = Range | string | number[] | number;
declare class Range {
    lo: number;
    hi: number;
    clumps: number;
    constructor(lower: number, upper?: number, clumps?: number);
    value(rng?: Random): number;
    contains(value: number): boolean;
    copy(other: Range): this;
    toString(): string;
}
declare function make$8(config: RangeBase | null): Range;
declare const from$3: typeof make$8;
declare function asFn(config: RangeBase | null): () => number;

type range_d_RangeBase = RangeBase;
type range_d_Range = Range;
declare const range_d_Range: typeof Range;
declare const range_d_asFn: typeof asFn;
declare namespace range_d {
  export {
    range_d_RangeBase as RangeBase,
    range_d_Range as Range,
    make$8 as make,
    from$3 as from,
    range_d_asFn as asFn,
  };
}

declare type FlagSource = number | string;
declare type FlagBase = FlagSource | FlagSource[] | null;
declare function fl(N: number): number;
declare function toString<T>(flagObj: T, value: number): string;
declare function from$2<T>(obj: T, ...args: (FlagBase | undefined)[]): number;
declare function make$7(obj: Record<string, FlagBase>): Record<string, number>;

type flag_d_FlagBase = FlagBase;
declare const flag_d_fl: typeof fl;
declare const flag_d_toString: typeof toString;
declare namespace flag_d {
  export {
    flag_d_FlagBase as FlagBase,
    flag_d_fl as fl,
    flag_d_toString as toString,
    from$2 as from,
    make$7 as make,
  };
}

declare type Loc = Loc$1;
declare type ArrayInit<T> = (i: number) => T;
declare function makeArray<T>(l: number, fn?: T | ArrayInit<T>): Array<T>;
declare type GridInit<T> = (x: number, y: number, grid: Grid<T>) => T;
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
    /**
     * Finds the first matching value/result and returns that location as an xy.Loc
     * @param v - The fill value or a function that returns the fill value.
     * @returns xy.Loc | null - The location of the first cell matching the criteria or null if not found.
     */
     // @ts-ignore

    find(match: GridMatch<T> | T): Loc$1 | null;
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
declare function make$6<T>(w: number, h: number, v?: number | GridInit<number>): NumGrid;
declare function make$6<T>(w: number, h: number, v?: T | GridInit<T>): Grid<T>;
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
    make$6 as make,
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
    onkeydown(e: KeyboardEvent): void;
}
declare function make$5(): Loop;
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
    io_d_makeMouseEvent as makeMouseEvent,
    io_d_Loop as Loop,
    make$5 as make,
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
}
interface FovSystemType {
    isAnyKindOfVisible(x: number, y: number): boolean;
    isInFov(x: number, y: number): boolean;
    isDirectlyVisible(x: number, y: number): boolean;
    isMagicMapped(x: number, y: number): boolean;
    isRevealed(x: number, y: number): boolean;
    fovChanged(x: number, y: number): boolean;
    changed: boolean;
    needsUpdate: boolean;
    copy(other: FovSystemType): void;
    makeAlwaysVisible(): void;
    makeCellAlwaysVisible(x: number, y: number): void;
    revealAll(): void;
    revealCell(x: number, y: number, isMagicMapped: boolean): void;
    hideCell(x: number, y: number): void;
    magicMapCell(x: number, y: number): void;
    update(): boolean;
    update(x: number, y: number, r?: number): boolean;
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
    calculate(x: number, y: number, maxRadius: number, setVisible: SetVisibleFn): void;
    castLight(row: number, startSlope: number, endSlope: number, xx: number, xy: number, yx: number, yy: number): void;
}

declare type FovChangeFn = (x: number, y: number, isVisible: boolean) => void;
interface FovNotice {
    onFovChange: FovChangeFn;
}
interface FovSystemOptions {
    revealed: boolean;
    visible: boolean;
    alwaysVisible: boolean;
    onFovChange: FovChangeFn | FovNotice;
}
declare class FovSystem implements FovSystemType {
    site: FovSite;
    flags: NumGrid;
    fov: FOV;
    needsUpdate: boolean;
    protected _changed: boolean;
    onFovChange: FovNotice;
    constructor(site: FovSite, opts?: Partial<FovSystemOptions>);
    isVisible(x: number, y: number): boolean;
    isAnyKindOfVisible(x: number, y: number): boolean;
    isInFov(x: number, y: number): boolean;
    isDirectlyVisible(x: number, y: number): boolean;
    isMagicMapped(x: number, y: number): boolean;
    isRevealed(x: number, y: number): boolean;
    fovChanged(x: number, y: number): boolean;
    makeAlwaysVisible(): void;
    makeCellAlwaysVisible(x: number, y: number): void;
    revealAll(makeVisibleToo?: boolean): void;
    revealCell(x: number, y: number): void;
    hideCell(x: number, y: number): void;
    magicMapCell(x: number, y: number): void;
    reset(): void;
    get changed(): boolean;
    set changed(v: boolean);
    copy(other: FovSystem): void;
    protected demoteCellVisibility(flag: number): number;
    protected updateCellVisibility(flag: number, x: number, y: number): boolean;
    protected updateCellClairyvoyance(flag: number, x: number, y: number): boolean;
    protected updateCellTelepathy(flag: number, x: number, y: number): boolean;
    protected updateCellDetect(flag: number, x: number, y: number): boolean;
    protected promoteCellVisibility(flag: number, x: number, y: number): void;
    update(): boolean;
    update(x: number, y: number, r?: number): boolean;
}

type index_d$4_FovFlags = FovFlags;
declare const index_d$4_FovFlags: typeof FovFlags;
type index_d$4_FovStrategy = FovStrategy;
type index_d$4_SetVisibleFn = SetVisibleFn;
type index_d$4_ViewportCb = ViewportCb;
type index_d$4_FovSite = FovSite;
type index_d$4_FovSystemType = FovSystemType;
type index_d$4_FOV = FOV;
declare const index_d$4_FOV: typeof FOV;
type index_d$4_FovChangeFn = FovChangeFn;
type index_d$4_FovNotice = FovNotice;
type index_d$4_FovSystemOptions = FovSystemOptions;
type index_d$4_FovSystem = FovSystem;
declare const index_d$4_FovSystem: typeof FovSystem;
declare namespace index_d$4 {
  export {
    index_d$4_FovFlags as FovFlags,
    index_d$4_FovStrategy as FovStrategy,
    index_d$4_SetVisibleFn as SetVisibleFn,
    index_d$4_ViewportCb as ViewportCb,
    index_d$4_FovSite as FovSite,
    index_d$4_FovSystemType as FovSystemType,
    index_d$4_FOV as FOV,
    index_d$4_FovChangeFn as FovChangeFn,
    index_d$4_FovNotice as FovNotice,
    index_d$4_FovSystemOptions as FovSystemOptions,
    index_d$4_FovSystem as FovSystem,
  };
}

declare const FORBIDDEN = -1;
declare const OBSTRUCTION = -2;
declare const AVOIDED = 10;
declare const NO_PATH = 30000;
declare type BlockedFn = (toX: number, toY: number, fromX: number, fromY: number, distanceMap: NumGrid) => boolean;
declare function calculateDistances(distanceMap: NumGrid, destinationX: number, destinationY: number, costMap: NumGrid, eightWays?: boolean, maxDistance?: number): void;
declare function nextStep(distanceMap: NumGrid, x: number, y: number, isBlocked: BlockedFn, useDiagonals?: boolean): Loc$1;
declare function getPath(distanceMap: NumGrid, originX: number, originY: number, isBlocked: BlockedFn, eightWays?: boolean): Loc$1[] | null;

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

declare type EventFn$1 = (...args: any[]) => Promise<any> | any;
/**
 * Data for an event listener.
 */
declare class Listener implements ListItem<Listener> {
    fn: EventFn$1;
    context: any;
    once: boolean;
    next: Listener | null;
    /**
     * Creates a Listener.
     * @param {EventFn} fn The listener function.
     * @param {any} [context=null] The context to invoke the listener with.
     * @param {boolean} [once=false] Specify if the listener is a one-time listener.
     */
    constructor(fn: EventFn$1, context?: any, once?: boolean);
    /**
     * Compares this Listener to the parameters.
     * @param {EventFn} fn - The function
     * @param {any} [context] - The context Object.
     * @param {boolean} [once] - Whether or not it is a one time handler.
     * @returns Whether or not this Listener matches the parameters.
     */
    matches(fn: EventFn$1, context?: any, once?: boolean): boolean;
}
/**
 * Add a listener for a given event.
 *
 * @param {String} event The event name.
 * @param {EventFn} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {boolean} once Specify if the listener is a one-time listener.
 * @returns {Listener}
 */
declare function addListener(event: string, fn: EventFn$1, context?: any, once?: boolean): Listener;
/**
 * Add a listener for a given event.
 *
 * @param {String} event The event name.
 * @param {EventFn} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {boolean} once Specify if the listener is a one-time listener.
 * @returns {Listener}
 */
declare function on(event: string, fn: EventFn$1, context?: any, once?: boolean): Listener;
/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {EventFn} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
declare function once(event: string, fn: EventFn$1, context?: any): Listener;
/**
 * Remove the listeners of a given event.
 *
 * @param {String} event The event name.
 * @param {EventFn} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
declare function removeListener(event: string, fn: EventFn$1, context?: any, once?: boolean): boolean;
/**
 * Remove the listeners of a given event.
 *
 * @param {String} event The event name.
 * @param {EventFn} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
declare function off(event: string, fn: EventFn$1, context?: any, once?: boolean): boolean;
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
 * @returns {boolean} `true` if the event had listeners, else `false`.
 * @public
 */
declare function emit(...args: any[]): Promise<boolean>;

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
    EventFn$1 as EventFn,
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
declare function make$4(v?: FrequencyConfig): FrequencyFn;

type frequency_d_FrequencyFn = FrequencyFn;
type frequency_d_FrequencyConfig = FrequencyConfig;
declare namespace frequency_d {
  export {
    frequency_d_FrequencyFn as FrequencyFn,
    frequency_d_FrequencyConfig as FrequencyConfig,
    make$4 as make,
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
    ch: string | number | null;
    fg: ColorBase;
    bg: ColorBase;
}
declare class Mixer implements DrawInfo {
    ch: string | number;
    fg: Color;
    bg: Color;
    constructor(base?: Partial<DrawInfo>);
    protected _changed(): this;
    copy(other: Partial<DrawInfo>): this;
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
    clone(): DataBuffer;
    resize(width: number, height: number): void;
    get(x: number, y: number): DrawData;
    toGlyph(ch: string | number): number;
    draw(x: number, y: number, glyph?: number | string, fg?: ColorBase, // TODO - White?
    bg?: ColorBase): this;
    drawSprite(x: number, y: number, sprite: Partial<DrawInfo>): this;
    blackOut(x: number, y: number): void;
    blackOut(): void;
    fill(color: ColorBase): this;
    fill(glyph?: number | string, fg?: ColorBase, bg?: ColorBase): this;
    copy(other: DataBuffer): this;
    drawText(x: number, y: number, text: string, fg?: ColorBase, bg?: ColorBase, maxWidth?: number): number;
    wrapText(x: number, y: number, width: number, text: string, fg?: ColorBase, bg?: ColorBase, indent?: number): number;
    fillRect(x: number, y: number, w: number, h: number, ch?: string | number | null, fg?: ColorBase | null, bg?: ColorBase | null): this;
    blackOutRect(x: number, y: number, w: number, h: number, bg?: ColorBase): this;
    highlight(x: number, y: number, color: ColorBase, strength: number): this;
    dump(): void;
}
declare function makeDataBuffer(width: number, height: number): DataBuffer;
declare class Buffer extends DataBuffer {
    private _target;
    constructor(canvas: BufferTarget);
    clone(): Buffer;
    toGlyph(ch: string | number): number;
    render(): this;
    load(): this;
}
declare function makeBuffer(width: number, height: number): DataBuffer;
declare function makeBuffer(canvas: BufferTarget): Buffer;

declare type EventFn = (ev: Event$1) => void;
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
    set onclick(fn: EventFn | null);
    set onmousemove(fn: EventFn | null);
    set onmouseup(fn: EventFn | null);
    set onkeydown(fn: EventFn | null);
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
declare function make$3(opts: Partial<CanvasOptions>): BaseCanvas;
declare function make$3(width: number, height: number, opts?: Partial<CanvasOptions>): BaseCanvas;

type index_d$3_EventFn = EventFn;
type index_d$3_CanvasOptions = CanvasOptions;
type index_d$3_NotSupportedError = NotSupportedError;
declare const index_d$3_NotSupportedError: typeof NotSupportedError;
type index_d$3_BaseCanvas = BaseCanvas;
declare const index_d$3_BaseCanvas: typeof BaseCanvas;
type index_d$3_Canvas = Canvas;
declare const index_d$3_Canvas: typeof Canvas;
type index_d$3_Canvas2D = Canvas2D;
declare const index_d$3_Canvas2D: typeof Canvas2D;
type index_d$3_GlyphOptions = GlyphOptions;
type index_d$3_Glyphs = Glyphs;
declare const index_d$3_Glyphs: typeof Glyphs;
type index_d$3_DrawData = DrawData;
type index_d$3_BufferTarget = BufferTarget;
type index_d$3_DataBuffer = DataBuffer;
declare const index_d$3_DataBuffer: typeof DataBuffer;
declare const index_d$3_makeDataBuffer: typeof makeDataBuffer;
type index_d$3_Buffer = Buffer;
declare const index_d$3_Buffer: typeof Buffer;
declare const index_d$3_makeBuffer: typeof makeBuffer;
declare namespace index_d$3 {
  export {
    index_d$3_EventFn as EventFn,
    index_d$3_CanvasOptions as CanvasOptions,
    index_d$3_NotSupportedError as NotSupportedError,
    index_d$3_BaseCanvas as BaseCanvas,
    index_d$3_Canvas as Canvas,
    index_d$3_Canvas2D as Canvas2D,
    make$3 as make,
    index_d$3_GlyphOptions as GlyphOptions,
    index_d$3_Glyphs as Glyphs,
    index_d$3_DrawData as DrawData,
    index_d$3_BufferTarget as BufferTarget,
    index_d$3_DataBuffer as DataBuffer,
    index_d$3_makeDataBuffer as makeDataBuffer,
    index_d$3_Buffer as Buffer,
    index_d$3_makeBuffer as makeBuffer,
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
declare function make$2(): Sprite;
declare function make$2(bg: ColorBase, opacity?: number): Sprite;
declare function make$2(ch: string | null, fg: ColorBase | null, bg: ColorBase | null, opacity?: number): Sprite;
declare function make$2(args: any[]): Sprite;
declare function make$2(info: Partial<SpriteConfig>): Sprite;
declare function from$1(name: string): Sprite;
declare function from$1(config: Partial<SpriteConfig>): Sprite;
declare function install$2(name: string, bg: ColorBase, opacity?: number): Sprite;
declare function install$2(name: string, ch: string | null, fg: Color | number | string | number[] | null, bg: Color | number | string | number[] | null, opacity?: number): Sprite;
declare function install$2(name: string, args: any[]): Sprite;
declare function install$2(name: string, info: Partial<SpriteConfig>): Sprite;

interface SpriteData {
    readonly ch: string | null;
    readonly fg: ColorBase;
    readonly bg: ColorBase;
    readonly opacity: number;
}

type index_d$2_SpriteConfig = SpriteConfig;
type index_d$2_Sprite = Sprite;
declare const index_d$2_Sprite: typeof Sprite;
declare const index_d$2_sprites: typeof sprites;
type index_d$2_DrawInfo = DrawInfo;
type index_d$2_Mixer = Mixer;
declare const index_d$2_Mixer: typeof Mixer;
declare const index_d$2_makeMixer: typeof makeMixer;
type index_d$2_SpriteData = SpriteData;
declare namespace index_d$2 {
  export {
    index_d$2_SpriteConfig as SpriteConfig,
    index_d$2_Sprite as Sprite,
    index_d$2_sprites as sprites,
    make$2 as make,
    from$1 as from,
    install$2 as install,
    index_d$2_DrawInfo as DrawInfo,
    index_d$2_Mixer as Mixer,
    index_d$2_makeMixer as makeMixer,
    index_d$2_SpriteData as SpriteData,
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

declare const index_d$1_compile: typeof compile;
declare const index_d$1_apply: typeof apply;
declare const index_d$1_eachChar: typeof eachChar;
declare const index_d$1_length: typeof length;
declare const index_d$1_padStart: typeof padStart;
declare const index_d$1_padEnd: typeof padEnd;
declare const index_d$1_center: typeof center;
declare const index_d$1_firstChar: typeof firstChar;
declare const index_d$1_capitalize: typeof capitalize;
declare const index_d$1_removeColors: typeof removeColors;
declare const index_d$1_wordWrap: typeof wordWrap;
declare const index_d$1_splitIntoLines: typeof splitIntoLines;
declare const index_d$1_configure: typeof configure;
declare const index_d$1_addHelper: typeof addHelper;
declare const index_d$1_options: typeof options;
type index_d$1_Template = Template;
declare namespace index_d$1 {
  export {
    index_d$1_compile as compile,
    index_d$1_apply as apply,
    index_d$1_eachChar as eachChar,
    index_d$1_length as length,
    index_d$1_padStart as padStart,
    index_d$1_padEnd as padEnd,
    index_d$1_center as center,
    index_d$1_firstChar as firstChar,
    index_d$1_capitalize as capitalize,
    index_d$1_removeColors as removeColors,
    index_d$1_wordWrap as wordWrap,
    index_d$1_splitIntoLines as splitIntoLines,
    index_d$1_configure as configure,
    index_d$1_addHelper as addHelper,
    index_d$1_options as options,
    index_d$1_Template as Template,
  };
}

declare const templates: Record<string, Template>;
declare function install$1(id: string, msg: string): Template;
declare function installAll$1(config: Record<string, string>): void;
interface MessageHandler {
    addMessage(x: number, y: number, msg: string): void;
    addCombatMessage(x: number, y: number, msg: string): void;
}
declare const handlers: MessageHandler[];
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
declare const message_d_handlers: typeof handlers;
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
    install$1 as install,
    installAll$1 as installAll,
    message_d_MessageHandler as MessageHandler,
    message_d_handlers as handlers,
    message_d_add as add,
    message_d_addAt as addAt,
    message_d_addCombat as addCombat,
    message_d_CacheOptions as CacheOptions,
    message_d_EachMsgFn as EachMsgFn,
    message_d_MessageCache as MessageCache,
  };
}

declare const data: any;
declare const config$1: any;

interface BlobConfig {
    rng: Random;
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
    copy(other: LightSystemType): void;
    changed: boolean;
    readonly needsUpdate: boolean;
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

declare const config: {
    INTENSITY_DARK: number;
    INTENSITY_SHADOW: number;
};
declare class Light implements LightType {
    color: Color;
    radius: Range;
    fadeTo: number;
    passThroughActors: boolean;
    id: string | null;
    constructor(color: ColorBase, radius?: RangeBase, fadeTo?: number, pass?: boolean);
    copy(other: Light): void;
    get intensity(): number;
    paint(site: PaintSite, x: number, y: number, maintainShadows?: boolean, isMinersLight?: boolean): boolean;
}
declare function intensity(light: Color | LightValue): number;
declare function isDarkLight(light: Color | LightValue, threshold?: number): boolean;
declare function isShadowLight(light: Color | LightValue, threshold?: number): boolean;
declare function make(color: ColorBase, radius?: RangeBase, fadeTo?: number, pass?: boolean): Light;
declare function make(light: LightBase): Light;
declare const lights: Record<string, Light>;
declare function from(light: LightBase | LightType): Light;
declare function install(id: string, color: ColorBase, radius: RangeBase, fadeTo?: number, pass?: boolean): Light;
declare function install(id: string, base: LightBase): Light;
declare function install(id: string, config: LightConfig): Light;
declare function installAll(config: Record<string, LightConfig | LightBase>): void;

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
    changed: boolean;
    light: Grid<LightValue>;
    oldLight: Grid<LightValue>;
    glowLight: Grid<LightValue>;
    flags: NumGrid;
    constructor(map: LightSystemSite, opts?: Partial<LightSystemOptions>);
    copy(other: LightSystem): void;
    getAmbient(): LightValue;
    setAmbient(light: LightValue | ColorBase): void;
    get needsUpdate(): boolean;
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

type index_d_LightConfig = LightConfig;
type index_d_LightBase = LightBase;
type index_d_LightType = LightType;
type index_d_LightCb = LightCb;
type index_d_PaintSite = PaintSite;
type index_d_LightSystemSite = LightSystemSite;
type index_d_LightSystemType = LightSystemType;
declare const index_d_config: typeof config;
type index_d_Light = Light;
declare const index_d_Light: typeof Light;
declare const index_d_intensity: typeof intensity;
declare const index_d_isDarkLight: typeof isDarkLight;
declare const index_d_isShadowLight: typeof isShadowLight;
declare const index_d_make: typeof make;
declare const index_d_lights: typeof lights;
declare const index_d_from: typeof from;
declare const index_d_install: typeof install;
declare const index_d_installAll: typeof installAll;
type index_d_StaticLightInfo = StaticLightInfo;
type index_d_LightSystemOptions = LightSystemOptions;
type index_d_LightSystem = LightSystem;
declare const index_d_LightSystem: typeof LightSystem;
declare namespace index_d {
  export {
    index_d_LightConfig as LightConfig,
    index_d_LightBase as LightBase,
    index_d_LightType as LightType,
    index_d_LightCb as LightCb,
    index_d_PaintSite as PaintSite,
    index_d_LightSystemSite as LightSystemSite,
    index_d_LightSystemType as LightSystemType,
    index_d_config as config,
    index_d_Light as Light,
    index_d_intensity as intensity,
    index_d_isDarkLight as isDarkLight,
    index_d_isShadowLight as isShadowLight,
    index_d_make as make,
    index_d_lights as lights,
    index_d_from as from,
    index_d_install as install,
    index_d_installAll as installAll,
    index_d_StaticLightInfo as StaticLightInfo,
    index_d_LightSystemOptions as LightSystemOptions,
    index_d_LightSystem as LightSystem,
  };
}

export { ERROR, FALSE, IDENTITY, IS_NONZERO, IS_ZERO, NOOP, ONE, TRUE, WARN, ZERO, arrayDelete, arraysIntersect, blob_d as blob, index_d$3 as canvas, clamp, index_d$5 as color, colors, config$1 as config, data, events_d as events, first, flag_d as flag, index_d$4 as fov, frequency_d as frequency, grid_d as grid, io_d as io, index_d as light, list_d as list, loop, message_d as message, object_d as object, path_d as path, range_d as range, rng_d as rng, scheduler_d as scheduler, index_d$2 as sprite, sprites, sum, index_d$1 as text, types_d as types, xy_d as xy };
