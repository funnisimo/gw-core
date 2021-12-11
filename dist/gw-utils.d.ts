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
declare function lerp(from: number, to: number, pct: number): number;
declare function ERROR(message: string): void;
declare function WARN(...args: string[]): void;
declare function first(...args: any[]): any;
declare function arraysIntersect(a: any[], b: any[]): boolean;
declare function arrayIncludesAll(a: any[], b: any[]): boolean;
declare function arrayDelete<T>(a: T[], b: T): boolean;
declare function arrayNullify<T>(a: (T | null)[], b: T): boolean;
declare function arrayInsert<T>(a: T[], b: T, beforeFn?: (t: T) => boolean): void;
declare function arrayFindRight<T>(a: T[], fn: (t: T) => boolean): T | undefined;
declare function sum(arr: number[]): number;
declare function arrayNext<T>(a: T[], current: T, fn: (t: T) => boolean, wrap?: boolean, forward?: boolean): T | undefined;
declare function arrayPrev<T>(a: T[], current: T, fn: (t: T) => boolean, wrap?: boolean): T | undefined;
declare function nextIndex(index: number, length: number, wrap?: boolean): number;
declare function prevIndex(index: number, length: number, wrap?: boolean): number;

declare type ColorData = [number, number, number] | [number, number, number, number];
declare type ColorBase = string | number | ColorData | Color;
declare type LightValue = [number, number, number];
declare const colors: Record<string, Color>;
declare class Color {
    _data: [number, number, number, number];
    _rand: [number, number, number, number] | null;
    dances: boolean;
    name?: string;
    constructor(r?: number, g?: number, b?: number, a?: number);
    rgb(): number[];
    get r(): number;
    get _r(): number;
    get _ra(): number;
    get g(): number;
    get _g(): number;
    get _ga(): number;
    get b(): number;
    get _b(): number;
    get _ba(): number;
    get a(): number;
    get _a(): number;
    rand(all: number, r?: number, g?: number, b?: number): this;
    dance(all: number, r?: number, g?: number, b?: number): this;
    isNull(): boolean;
    alpha(v: number): Color;
    get l(): number;
    get s(): number;
    get h(): number;
    equals(other: Color | ColorBase): boolean;
    toInt(base256?: boolean): number;
    toLight(): LightValue;
    clamp(): Color;
    blend(other: ColorBase): Color;
    mix(other: ColorBase, percent: number): Color;
    lighten(percent: number): Color;
    darken(percent: number): Color;
    bake(clearDancing?: boolean): Color;
    add(other: ColorBase, percent?: number): Color;
    scale(percent: number): Color;
    multiply(other: ColorData | Color): Color;
    normalize(): Color;
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
declare function make$d(): Color;
declare function make$d(rgb: number, base256?: boolean): Color;
declare function make$d(color?: ColorBase | null): Color;
declare function make$d(arrayLike: ColorData, base256?: boolean): Color;
declare function make$d(...rgb: number[]): Color;
declare function from$4(): Color;
declare function from$4(rgb: number, base256?: boolean): Color;
declare function from$4(color?: ColorBase | null): Color;
declare function from$4(arrayLike: ColorData, base256?: boolean): Color;
declare function from$4(...rgb: number[]): Color;
declare function separate(a: Color, b: Color): [Color, Color];
declare function relativeLuminance(a: Color, b: Color): number;
declare function distance(a: Color, b: Color): number;
declare function smoothScalar(rgb: number, maxRgb?: number): number;
declare function install$3(name: string, info: ColorBase): Color;
declare function install$3(name: string, ...rgb: ColorData): Color;
declare function installSpread(name: string, info: ColorBase): Color;
declare function installSpread(name: string, ...rgb: ColorData): Color;
declare const NONE: Color;
declare const BLACK: Color;
declare const WHITE: Color;

type index_d$7_ColorData = ColorData;
type index_d$7_ColorBase = ColorBase;
type index_d$7_LightValue = LightValue;
declare const index_d$7_colors: typeof colors;
type index_d$7_Color = Color;
declare const index_d$7_Color: typeof Color;
declare const index_d$7_fromArray: typeof fromArray;
declare const index_d$7_fromCss: typeof fromCss;
declare const index_d$7_fromName: typeof fromName;
declare const index_d$7_fromNumber: typeof fromNumber;
declare const index_d$7_separate: typeof separate;
declare const index_d$7_relativeLuminance: typeof relativeLuminance;
declare const index_d$7_distance: typeof distance;
declare const index_d$7_smoothScalar: typeof smoothScalar;
declare const index_d$7_installSpread: typeof installSpread;
declare const index_d$7_NONE: typeof NONE;
declare const index_d$7_BLACK: typeof BLACK;
declare const index_d$7_WHITE: typeof WHITE;
declare namespace index_d$7 {
  export {
    index_d$7_ColorData as ColorData,
    index_d$7_ColorBase as ColorBase,
    index_d$7_LightValue as LightValue,
    index_d$7_colors as colors,
    index_d$7_Color as Color,
    index_d$7_fromArray as fromArray,
    index_d$7_fromCss as fromCss,
    index_d$7_fromName as fromName,
    index_d$7_fromNumber as fromNumber,
    make$d as make,
    from$4 as from,
    index_d$7_separate as separate,
    index_d$7_relativeLuminance as relativeLuminance,
    index_d$7_distance as distance,
    index_d$7_smoothScalar as smoothScalar,
    install$3 as install,
    index_d$7_installSpread as installSpread,
    index_d$7_NONE as NONE,
    index_d$7_BLACK as BLACK,
    index_d$7_WHITE as WHITE,
  };
}

declare type Loc$1 = [number, number];
interface XY {
    x: number;
    y: number;
}
interface Size$1 {
    width: number;
    height: number;
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
    Size$1 as Size,
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
declare function isLoc(a: any): a is Loc$1;
declare function isXY(a: any): a is XY;
declare function x(src: XY | Loc$1): any;
declare function y(src: XY | Loc$1): any;
declare function contains(size: Size$1, x: number, y: number): boolean;
declare class Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x?: number, y?: number, w?: number, h?: number);
    get left(): number;
    set left(v: number);
    get right(): number;
    set right(v: number);
    get top(): number;
    set top(v: number);
    get bottom(): number;
    set bottom(v: number);
    clone(): Bounds;
    contains(x: number, y: number): boolean;
    contains(loc: Loc$1 | XY): boolean;
    toString(): string;
}
declare function copy(dest: XY, src: XY | Loc$1): void;
declare function addTo(dest: XY, src: XY | Loc$1): void;
declare function add$1(a: XY, b: XY | Loc$1): XY;
declare function add$1(a: Loc$1, b: XY | Loc$1): Loc$1;
declare function equalsXY(dest: XY | Loc$1 | null | undefined, src: XY | Loc$1 | null | undefined): boolean;
declare function lerpXY(a: XY | Loc$1, b: XY | Loc$1, pct: number): any[];
declare type XYFunc = (x: number, y: number) => any;
declare function eachNeighbor(x: number, y: number, fn: XYFunc, only4dirs?: boolean): void;
declare function eachNeighborAsync(x: number, y: number, fn: XYFunc, only4dirs?: boolean): Promise<void>;
declare type XYMatchFunc = (x: number, y: number) => boolean;
declare function matchingNeighbor(x: number, y: number, matchFn: XYMatchFunc, only4dirs?: boolean): Loc$1;
declare function straightDistanceBetween(x1: number, y1: number, x2: number, y2: number): number;
declare function maxAxisFromTo(a: XY | Loc$1, b: XY | Loc$1): number;
declare function maxAxisBetween(x1: number, y1: number, x2: number, y2: number): number;
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
declare function forLineFromTo(a: XY | Loc$1, b: XY | Loc$1, stepFn: (x: number, y: number) => boolean | void): boolean;
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
declare const xy_d_isLoc: typeof isLoc;
declare const xy_d_isXY: typeof isXY;
declare const xy_d_x: typeof x;
declare const xy_d_y: typeof y;
declare const xy_d_contains: typeof contains;
type xy_d_Bounds = Bounds;
declare const xy_d_Bounds: typeof Bounds;
declare const xy_d_copy: typeof copy;
declare const xy_d_addTo: typeof addTo;
declare const xy_d_equalsXY: typeof equalsXY;
declare const xy_d_lerpXY: typeof lerpXY;
type xy_d_XYFunc = XYFunc;
declare const xy_d_eachNeighbor: typeof eachNeighbor;
declare const xy_d_eachNeighborAsync: typeof eachNeighborAsync;
type xy_d_XYMatchFunc = XYMatchFunc;
declare const xy_d_matchingNeighbor: typeof matchingNeighbor;
declare const xy_d_straightDistanceBetween: typeof straightDistanceBetween;
declare const xy_d_maxAxisFromTo: typeof maxAxisFromTo;
declare const xy_d_maxAxisBetween: typeof maxAxisBetween;
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
declare const xy_d_forLineFromTo: typeof forLineFromTo;
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
    Size$1 as Size,
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
    xy_d_isLoc as isLoc,
    xy_d_isXY as isXY,
    xy_d_x as x,
    xy_d_y as y,
    xy_d_contains as contains,
    xy_d_Bounds as Bounds,
    xy_d_copy as copy,
    xy_d_addTo as addTo,
    add$1 as add,
    xy_d_equalsXY as equalsXY,
    xy_d_lerpXY as lerpXY,
    xy_d_XYFunc as XYFunc,
    xy_d_eachNeighbor as eachNeighbor,
    xy_d_eachNeighborAsync as eachNeighborAsync,
    xy_d_XYMatchFunc as XYMatchFunc,
    xy_d_matchingNeighbor as matchingNeighbor,
    xy_d_straightDistanceBetween as straightDistanceBetween,
    xy_d_maxAxisFromTo as maxAxisFromTo,
    xy_d_maxAxisBetween as maxAxisBetween,
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
    xy_d_forLineFromTo as forLineFromTo,
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
declare function at<T extends ListItem<T>>(root: ListEntry<T>, index: number): T | null;
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
declare const list_d_at: typeof at;
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
    list_d_at as at,
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
    /**
     * @param mean Mean value
     * @param stddev Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
     * @returns A normally distributed pseudorandom value
     * @see: https://github.com/ondras/rot.js/blob/v2.2.0/src/rng.ts
     */
    normal(mean?: number, stddev?: number): number;
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
declare function make$c(seed?: number): Random;

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
    make$c as make,
  };
}

declare type RangeBase = Range | string | number[] | number;
declare class Range {
    lo: number;
    hi: number;
    clumps: number;
    constructor(lower: number, upper?: number, clumps?: number);
    value(rng?: Random): number;
    max(): number;
    contains(value: number): boolean;
    copy(other: Range): this;
    toString(): string;
}
declare function make$b(config: RangeBase | null): Range;
declare const from$3: typeof make$b;
declare function asFn(config: RangeBase | null): () => number;
declare function value(base: RangeBase): number;

type range_d_RangeBase = RangeBase;
type range_d_Range = Range;
declare const range_d_Range: typeof Range;
declare const range_d_asFn: typeof asFn;
declare const range_d_value: typeof value;
declare namespace range_d {
  export {
    range_d_RangeBase as RangeBase,
    range_d_Range as Range,
    make$b as make,
    from$3 as from,
    range_d_asFn as asFn,
    range_d_value as value,
  };
}

declare type FlagSource = number | string;
declare type FlagBase = FlagSource | FlagSource[] | null;
declare function fl(N: number): number;
declare function toString<T>(flagObj: T, value: number): string;
declare function from$2<T>(obj: T, ...args: (FlagBase | undefined)[]): number;
declare function make$a(obj: Record<string, FlagBase>): Record<string, number>;

type flag_d_FlagBase = FlagBase;
declare const flag_d_fl: typeof fl;
declare const flag_d_toString: typeof toString;
declare namespace flag_d {
  export {
    flag_d_FlagBase as FlagBase,
    flag_d_fl as fl,
    flag_d_toString as toString,
    from$2 as from,
    make$a as make,
  };
}

declare type Loc = Loc$1;
declare type ArrayInit<T> = (i: number) => T;
declare function makeArray<T>(l: number, fn?: T | ArrayInit<T>): Array<T>;
declare type GridInit<T> = (x: number, y: number, grid: Grid$1<T>) => T;
declare type GridEach<T> = (value: T, x: number, y: number, grid: Grid$1<T>) => any;
declare type AsyncGridEach<T> = (value: T, x: number, y: number, grid: Grid$1<T>) => Promise<any>;
declare type GridUpdate<T> = (value: T, x: number, y: number, grid: Grid$1<T>) => T;
declare type GridMatch<T> = (value: T, x: number, y: number, grid: Grid$1<T>) => boolean;
declare type GridFormat<T> = (value: T, x: number, y: number) => string;
declare class Grid$1<T> extends Array<Array<T>> {
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
    randomEach(fn: GridEach<T>): boolean;
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
    copy(from: Grid$1<T>): void;
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
declare class NumGrid extends Grid$1<number> {
    x?: number;
    y?: number;
    static alloc(w: number, h: number, v: GridInit<number> | number): NumGrid;
    static alloc(w: number, h: number): NumGrid;
    static alloc(source: NumGrid): NumGrid;
    static free(grid: NumGrid): void;
    constructor(w: number, h: number, v?: GridInit<number> | number);
    protected _resize(width: number, height: number, v: GridInit<number> | number): void;
    findReplaceRange(findValueMin: number, findValueMax: number, fillValue: number): void;
    floodFillRange(x: number, y: number, eligibleValueMin: number, eligibleValueMax: number, fillValue: number): number;
    invert(): void;
    leastPositiveValue(): number;
    randomLeastPositiveLoc(): Loc;
    valueBounds(value: number, bounds?: Bounds): Bounds;
    floodFill(x: number, y: number, matchValue: number | GridMatch<number>, fillValue: number | GridUpdate<number>): number;
}
declare const alloc: typeof NumGrid.alloc;
declare const free: typeof NumGrid.free;
declare function make$9<T>(w: number, h: number, v?: number | GridInit<number>): NumGrid;
declare function make$9<T>(w: number, h: number, v?: T | GridInit<T>): Grid$1<T>;
declare type GridZip<T, U> = (destVal: T, sourceVal: U, destX: number, destY: number, sourceX: number, sourceY: number, destGrid: Grid$1<T>, sourceGrid: Grid$1<U>) => void;
declare function offsetZip<T, U>(destGrid: Grid$1<T>, srcGrid: Grid$1<U>, srcToDestX: number, srcToDestY: number, value: T | GridZip<T, U>): void;
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
    Grid$1 as Grid,
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

declare type AsyncQueueHandlerFn<T> = (obj: T) => void;
declare class AsyncQueue<T> {
    _data: T[];
    _waiting: AsyncQueueHandlerFn<T> | null;
    constructor();
    get length(): number;
    get last(): T | undefined;
    get first(): T | undefined;
    enqueue(obj: T): void;
    prepend(obj: T): void;
    dequeue(): Promise<T>;
}

type queue_d_AsyncQueue<_0> = AsyncQueue<_0>;
declare const queue_d_AsyncQueue: typeof AsyncQueue;
declare namespace queue_d {
  export {
    queue_d_AsyncQueue as AsyncQueue,
  };
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

declare type Args = any;
declare type Template = (args: Args) => string;
interface CompileOptions {
    field?: string;
    debug?: boolean;
}
declare function compile$1(template: string, opts?: CompileOptions): Template;
declare function apply(template: string, args?: Args | string): string;

interface Colors {
    fg: ColorBase | null;
    bg: ColorBase | null;
}
declare type ColorFunction = (colors: Colors) => void;
declare type EachFn = (ch: string, fg: any, bg: any, i: number, n: number) => void;
interface EachOptions {
    fg?: ColorBase;
    bg?: ColorBase;
    eachColor?: ColorFunction;
    colorStart?: string;
    colorEnd?: string;
}
declare function eachChar(text: string, fn: EachFn, opts?: EachOptions): void;

declare function length(text: string): number;
declare function advanceChars(text: string, start: number, count: number): number;
declare function firstChar(text: string): string | null;
declare function padStart(text: string, width: number, pad?: string): string;
declare function padEnd(text: string, width: number, pad?: string): string;
declare function center(text: string, width: number, pad?: string): string;
declare function truncate(text: string, width: number): string;
declare function capitalize(text: string): string;
declare function removeColors(text: string): string;
declare function spliceRaw(msg: string, begin: number, deleteLength: number, add?: string): string;
declare function hash(str: string): number;

declare function wordWrap(text: string, width: number, indent?: number): string;
declare function splitIntoLines(source: string, width?: number, indent?: number): string[];

declare var options: {
    colorStart: string;
    colorEnd: string;
    field: string;
    defaultFg: null;
    defaultBg: null;
};
declare type Align = 'left' | 'center' | 'right';
declare type VAlign = 'top' | 'middle' | 'bottom';
declare type HelperFn = (name: string, data?: Record<string, any>, obj?: any) => string;
declare function addHelper(name: string, fn: HelperFn): void;

interface Options {
    fg?: any;
    bg?: any;
    colorStart?: string;
    colorEnd?: string;
    field?: string;
}
declare function configure(opts?: Options): void;

declare const index_d$6_configure: typeof configure;
declare const index_d$6_apply: typeof apply;
type index_d$6_Template = Template;
type index_d$6_CompileOptions = CompileOptions;
declare const index_d$6_eachChar: typeof eachChar;
type index_d$6_EachOptions = EachOptions;
declare const index_d$6_wordWrap: typeof wordWrap;
declare const index_d$6_splitIntoLines: typeof splitIntoLines;
declare const index_d$6_addHelper: typeof addHelper;
declare const index_d$6_options: typeof options;
type index_d$6_Align = Align;
type index_d$6_VAlign = VAlign;
declare const index_d$6_length: typeof length;
declare const index_d$6_advanceChars: typeof advanceChars;
declare const index_d$6_firstChar: typeof firstChar;
declare const index_d$6_padStart: typeof padStart;
declare const index_d$6_padEnd: typeof padEnd;
declare const index_d$6_center: typeof center;
declare const index_d$6_truncate: typeof truncate;
declare const index_d$6_capitalize: typeof capitalize;
declare const index_d$6_removeColors: typeof removeColors;
declare const index_d$6_spliceRaw: typeof spliceRaw;
declare const index_d$6_hash: typeof hash;
declare namespace index_d$6 {
  export {
    index_d$6_configure as configure,
    compile$1 as compile,
    index_d$6_apply as apply,
    index_d$6_Template as Template,
    index_d$6_CompileOptions as CompileOptions,
    index_d$6_eachChar as eachChar,
    index_d$6_EachOptions as EachOptions,
    index_d$6_wordWrap as wordWrap,
    index_d$6_splitIntoLines as splitIntoLines,
    index_d$6_addHelper as addHelper,
    index_d$6_options as options,
    index_d$6_Align as Align,
    index_d$6_VAlign as VAlign,
    index_d$6_length as length,
    index_d$6_advanceChars as advanceChars,
    index_d$6_firstChar as firstChar,
    index_d$6_padStart as padStart,
    index_d$6_padEnd as padEnd,
    index_d$6_center as center,
    index_d$6_truncate as truncate,
    index_d$6_capitalize as capitalize,
    index_d$6_removeColors as removeColors,
    index_d$6_spliceRaw as spliceRaw,
    index_d$6_hash as hash,
  };
}

interface DrawData {
    glyph: number;
    fg: number;
    bg: number;
}
declare class Buffer$1 {
    _data: Uint32Array;
    protected _width: number;
    protected _height: number;
    changed: boolean;
    constructor(width: number, height: number);
    protected _makeData(): Uint32Array;
    get width(): number;
    get height(): number;
    hasXY(x: number, y: number): boolean;
    clone(): this;
    resize(width: number, height: number): void;
    protected _index(x: number, y: number): number;
    get(x: number, y: number): number;
    info(x: number, y: number): DrawData;
    set(x: number, y: number, style: number): boolean | undefined;
    toGlyph(ch: string | number): number;
    draw(x: number, y: number, glyph?: number | string, fg?: ColorBase, // TODO - White?
    bg?: ColorBase): this;
    drawSprite(x: number, y: number, sprite: Partial<DrawInfo>): this;
    blackOut(x: number, y: number): void;
    blackOut(): void;
    fill(color: ColorBase): this;
    fill(glyph?: number | string, fg?: ColorBase, bg?: ColorBase): this;
    copy(other: Buffer$1): this;
    drawText(x: number, y: number, text: string, fg?: ColorBase, bg?: ColorBase, maxWidth?: number, align?: Align): number;
    wrapText(x: number, y: number, width: number, text: string, fg?: ColorBase, bg?: ColorBase, indent?: number): number;
    fillRect(x: number, y: number, w: number, h: number, ch?: string | number | null, fg?: ColorBase | null, bg?: ColorBase | null): this;
    blackOutRect(x: number, y: number, w: number, h: number, bg?: ColorBase): this;
    highlight(x: number, y: number, color: ColorBase, strength: number): this;
    mix(color: ColorBase, percent: number): this;
    mix(color: ColorBase, percent: number, x: number, y: number): this;
    mix(color: ColorBase, percent: number, x: number, y: number, width: number, height: number): this;
    blend(color: ColorBase): this;
    blend(color: ColorBase, x: number, y: number): this;
    blend(color: ColorBase, x: number, y: number, width: number, height: number): this;
    dump(): void;
}
declare function make$8(width: number, height: number): Buffer$1;

type buffer_d_DrawData = DrawData;
declare namespace buffer_d {
  export {
    buffer_d_DrawData as DrawData,
    Buffer$1 as Buffer,
    make$8 as make,
  };
}

declare type AnyObj = Record<string, any>;
declare type TweenCb = (obj: AnyObj, dt: number) => void;
declare type TweenFinishCb = (obj: AnyObj, success: boolean) => any;
declare type EasingFn = (v: number) => number;
declare type InterpolateFn = (start: any, goal: any, pct: number) => any;
interface Animation {
    isRunning(): boolean;
    start(): void;
    tick(dt: number): boolean;
    stop(): void;
}
interface Animator {
    addAnimation(a: Animation): void;
    removeAnimation(a: Animation): void;
}
declare class Tween implements Animation {
    _obj: AnyObj;
    _repeat: number;
    _count: number;
    _from: boolean;
    _duration: number;
    _delay: number;
    _repeatDelay: number;
    _yoyo: boolean;
    _time: number;
    _startTime: number;
    _goal: AnyObj;
    _start: AnyObj;
    _startCb: TweenCb | null;
    _updateCb: TweenCb | null;
    _repeatCb: TweenCb | null;
    _finishCb: TweenFinishCb | null;
    _resolveCb: null | ((v?: any) => void);
    _easing: EasingFn;
    _interpolate: InterpolateFn;
    constructor(src: AnyObj);
    isRunning(): boolean;
    onStart(cb: TweenCb): this;
    onUpdate(cb: TweenCb): this;
    onRepeat(cb: TweenCb): this;
    onFinish(cb: TweenFinishCb): this;
    to(goal: AnyObj, duration?: number): this;
    from(start: AnyObj, duration?: number): this;
    duration(): number;
    duration(v: number): this;
    repeat(): number;
    repeat(v: number): this;
    delay(): number;
    delay(v: number): this;
    repeatDelay(): number;
    repeatDelay(v: number): this;
    yoyo(): boolean;
    yoyo(v: boolean): this;
    start(): Promise<any>;
    tick(dt: number): boolean;
    _restart(): void;
    stop(success?: boolean): void;
    _updateProperties(obj: AnyObj, start: AnyObj, goal: AnyObj, pct: number): boolean;
}
declare function make$7(src: AnyObj): Tween;
declare function linear(pct: number): number;
declare function interpolate(start: any, goal: any, pct: number): any;

type tween_d_AnyObj = AnyObj;
type tween_d_TweenCb = TweenCb;
type tween_d_TweenFinishCb = TweenFinishCb;
type tween_d_EasingFn = EasingFn;
type tween_d_InterpolateFn = InterpolateFn;
type tween_d_Animation = Animation;
type tween_d_Animator = Animator;
type tween_d_Tween = Tween;
declare const tween_d_Tween: typeof Tween;
declare const tween_d_linear: typeof linear;
declare const tween_d_interpolate: typeof interpolate;
declare namespace tween_d {
  export {
    tween_d_AnyObj as AnyObj,
    tween_d_TweenCb as TweenCb,
    tween_d_TweenFinishCb as TweenFinishCb,
    tween_d_EasingFn as EasingFn,
    tween_d_InterpolateFn as InterpolateFn,
    tween_d_Animation as Animation,
    tween_d_Animator as Animator,
    tween_d_Tween as Tween,
    make$7 as make,
    tween_d_linear as linear,
    tween_d_interpolate as interpolate,
  };
}

declare class Event$1 {
    type: string;
    source: any;
    target: any;
    defaultPrevented: boolean;
    propagationStopped: boolean;
    immediatePropagationStopped: boolean;
    key: string;
    code: string;
    shiftKey: boolean;
    ctrlKey: boolean;
    altKey: boolean;
    metaKey: boolean;
    dir: Loc$1 | null;
    x: number;
    y: number;
    clientX: number;
    clientY: number;
    dt: number;
    constructor(type: string, opts?: Partial<Event$1>);
    preventDefault(): void;
    stopPropagation(): void;
    stopImmediatePropagation(): void;
    reset(type: string, opts?: Partial<Event$1>): void;
}
declare type ControlFn = () => void | Promise<void>;
declare type EventFn$1 = (event: Event$1) => boolean | void | Promise<boolean | void>;
declare type IOMap = Record<string, EventFn$1 | ControlFn>;
declare type EventMatchFn = (event: Event$1) => boolean;
declare const KEYPRESS = "keypress";
declare const MOUSEMOVE = "mousemove";
declare const CLICK = "click";
declare const TICK = "tick";
declare const MOUSEUP = "mouseup";
declare const STOP = "stop";
declare function setKeymap(keymap: IOMap): void;
declare function handlerFor(ev: Event$1, km: Record<string, any>): any | null;
declare function dispatchEvent(ev: Event$1, km: IOMap, thisArg?: any): Promise<any>;
declare function makeStopEvent(): Event$1;
declare function makeCustomEvent(type: string, opts?: Partial<Event$1>): Event$1;
declare function makeTickEvent(dt: number): Event$1;
declare function makeKeyEvent(e: KeyboardEvent): Event$1;
declare function keyCodeDirection(key: string): Loc$1 | null;
declare function ignoreKeyEvent(e: KeyboardEvent): boolean;
declare function makeMouseEvent(e: MouseEvent, x: number, y: number): Event$1;
interface EventQueue extends Animator {
    enqueue(ev: Event$1): void;
    clearEvents(): void;
}
declare type TimerFn = () => void;
interface TimerInfo {
    action: TimerFn;
    time: number;
}
interface IOHandler {
    nextEvent(ms?: number): Promise<Event$1 | null>;
    nextTick(ms?: number): Promise<Event$1 | null>;
    nextKeyOrClick(ms?: number, match?: EventMatchFn): Promise<Event$1 | null>;
    nextKeyPress(ms?: number, match?: EventMatchFn): Promise<Event$1 | null>;
    pause(ms: number): Promise<boolean>;
    waitForAck(): Promise<boolean>;
    setTimeout(fn: TimerFn, ms: number): void;
    clearTimeout(fn: TimerFn): void;
    run(keymap: IOMap, thisArg?: any): Promise<any>;
    finish(r: any): void;
}
declare class Handler implements IOHandler, EventQueue, Animator {
    _running: boolean;
    _events: AsyncQueue<Event$1>;
    _result: any;
    _tweens: Animation[];
    _timers: TimerInfo[];
    mouse: XY;
    lastClick: XY;
    constructor(loop?: Loop);
    get running(): boolean;
    hasEvents(): number;
    clearEvents(): void;
    enqueue(ev: Event$1): void;
    nextEvent(ms?: number, match?: EventMatchFn): Promise<Event$1 | null>;
    run(keymap?: IOMap, ms?: number, thisArg?: any): Promise<any>;
    finish(result?: any): void;
    nextTick(ms?: number): Promise<Event$1 | null>;
    nextKeyPress(ms?: number, match?: EventMatchFn): Promise<Event$1 | null>;
    nextKeyOrClick(ms?: number, matchFn?: EventMatchFn): Promise<Event$1 | null>;
    pause(ms: number): Promise<boolean>;
    waitForAck(): Promise<boolean>;
    addAnimation(a: Animation): void;
    removeAnimation(a: Animation): void;
    setTimeout(action: TimerFn, time: number): void;
    clearTimeout(action: string | TimerFn): void;
    _tick(dt: number): boolean;
}
declare function make$6(andPush?: boolean): Handler;
declare function nextEvent(ms?: number): Promise<Event$1 | null>;
declare function nextTick(ms?: number): Promise<Event$1 | null>;
declare function nextKeyOrClick(ms?: number, match?: EventMatchFn): Promise<Event$1 | null>;
declare function nextKeyPress(ms?: number, match?: EventMatchFn): Promise<Event$1 | null>;
declare function pause(ms: number): Promise<boolean>;
declare function waitForAck(): Promise<boolean>;
interface IOLoop {
    pushHandler(handler: EventQueue): void;
    popHandler(handler: EventQueue): void;
    enqueue(ev: Event$1): void;
}
declare class Loop implements Animator {
    handlers: EventQueue[];
    currentHandler: EventQueue | null;
    _tickInterval: number;
    constructor();
    pushHandler(handler: EventQueue): void;
    popHandler(handler: EventQueue): void;
    enqueue(ev: Event$1): void;
    _startTicks(): void;
    _stopTicks(): void;
    onkeydown(e: KeyboardEvent): void;
    addAnimation(a: Animation): void;
    removeAnimation(a: Animation): void;
}
declare const loop: Loop;
declare function pushHandler(handler: EventQueue): void;
declare function popHandler(handler: EventQueue): void;
declare function enqueue(ev: Event$1): void;

type io_d_ControlFn = ControlFn;
type io_d_IOMap = IOMap;
type io_d_EventMatchFn = EventMatchFn;
declare const io_d_KEYPRESS: typeof KEYPRESS;
declare const io_d_MOUSEMOVE: typeof MOUSEMOVE;
declare const io_d_CLICK: typeof CLICK;
declare const io_d_TICK: typeof TICK;
declare const io_d_MOUSEUP: typeof MOUSEUP;
declare const io_d_STOP: typeof STOP;
declare const io_d_setKeymap: typeof setKeymap;
declare const io_d_handlerFor: typeof handlerFor;
declare const io_d_dispatchEvent: typeof dispatchEvent;
declare const io_d_makeStopEvent: typeof makeStopEvent;
declare const io_d_makeCustomEvent: typeof makeCustomEvent;
declare const io_d_makeTickEvent: typeof makeTickEvent;
declare const io_d_makeKeyEvent: typeof makeKeyEvent;
declare const io_d_keyCodeDirection: typeof keyCodeDirection;
declare const io_d_ignoreKeyEvent: typeof ignoreKeyEvent;
declare const io_d_makeMouseEvent: typeof makeMouseEvent;
type io_d_EventQueue = EventQueue;
type io_d_TimerFn = TimerFn;
type io_d_TimerInfo = TimerInfo;
type io_d_IOHandler = IOHandler;
type io_d_Handler = Handler;
declare const io_d_Handler: typeof Handler;
declare const io_d_nextEvent: typeof nextEvent;
declare const io_d_nextTick: typeof nextTick;
declare const io_d_nextKeyOrClick: typeof nextKeyOrClick;
declare const io_d_nextKeyPress: typeof nextKeyPress;
declare const io_d_pause: typeof pause;
declare const io_d_waitForAck: typeof waitForAck;
type io_d_IOLoop = IOLoop;
type io_d_Loop = Loop;
declare const io_d_Loop: typeof Loop;
declare const io_d_loop: typeof loop;
declare const io_d_pushHandler: typeof pushHandler;
declare const io_d_popHandler: typeof popHandler;
declare const io_d_enqueue: typeof enqueue;
declare namespace io_d {
  export {
    Event$1 as Event,
    io_d_ControlFn as ControlFn,
    EventFn$1 as EventFn,
    io_d_IOMap as IOMap,
    io_d_EventMatchFn as EventMatchFn,
    io_d_KEYPRESS as KEYPRESS,
    io_d_MOUSEMOVE as MOUSEMOVE,
    io_d_CLICK as CLICK,
    io_d_TICK as TICK,
    io_d_MOUSEUP as MOUSEUP,
    io_d_STOP as STOP,
    io_d_setKeymap as setKeymap,
    io_d_handlerFor as handlerFor,
    io_d_dispatchEvent as dispatchEvent,
    io_d_makeStopEvent as makeStopEvent,
    io_d_makeCustomEvent as makeCustomEvent,
    io_d_makeTickEvent as makeTickEvent,
    io_d_makeKeyEvent as makeKeyEvent,
    io_d_keyCodeDirection as keyCodeDirection,
    io_d_ignoreKeyEvent as ignoreKeyEvent,
    io_d_makeMouseEvent as makeMouseEvent,
    io_d_EventQueue as EventQueue,
    io_d_TimerFn as TimerFn,
    io_d_TimerInfo as TimerInfo,
    io_d_IOHandler as IOHandler,
    io_d_Handler as Handler,
    make$6 as make,
    io_d_nextEvent as nextEvent,
    io_d_nextTick as nextTick,
    io_d_nextKeyOrClick as nextKeyOrClick,
    io_d_nextKeyPress as nextKeyPress,
    io_d_pause as pause,
    io_d_waitForAck as waitForAck,
    io_d_IOLoop as IOLoop,
    io_d_Loop as Loop,
    io_d_loop as loop,
    io_d_pushHandler as pushHandler,
    io_d_popHandler as popHandler,
    io_d_enqueue as enqueue,
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
    ACTOR_DETECTED,
    WAS_ACTOR_DETECTED,
    REVEALED,
    MAGIC_MAPPED,
    IN_FOV,
    WAS_IN_FOV,
    ALWAYS_VISIBLE,
    IS_CURSOR,
    IS_HIGHLIGHTED,
    ANY_KIND_OF_VISIBLE,
    IS_WAS_ANY_KIND_OF_VISIBLE,
    WAS_ANY_KIND_OF_VISIBLE,
    WAS_DETECTED,
    IS_DETECTED,
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
interface FovSubject {
    readonly x: number;
    readonly y: number;
    readonly visionDistance: number;
}
interface FovTracker {
    follow: FovSubject | null;
    isAnyKindOfVisible(x: number, y: number): boolean;
    isInFov(x: number, y: number): boolean;
    isDirectlyVisible(x: number, y: number): boolean;
    isMagicMapped(x: number, y: number): boolean;
    isRevealed(x: number, y: number): boolean;
    getFlag(x: number, y: number): FovFlags;
    makeAlwaysVisible(): void;
    makeCellAlwaysVisible(x: number, y: number): void;
    setCursor(x: number, y: number, keep?: boolean): void;
    clearCursor(x?: number, y?: number): void;
    isCursor(x: number, y: number): boolean;
    setHighlight(x: number, y: number, keep?: boolean): void;
    clearHighlight(x?: number, y?: number): void;
    isHighlight(x: number, y: number): boolean;
    revealAll(): void;
    revealCell(x: number, y: number, isMagicMapped: boolean): void;
    hideCell(x: number, y: number): void;
    magicMapCell(x: number, y: number): void;
    update(): boolean;
    updateFor(subject: FovSubject): boolean;
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
interface FovNoticer {
    onFovChange: FovChangeFn;
}
interface FovSystemOptions {
    revealed: boolean;
    visible: boolean;
    alwaysVisible: boolean;
    callback: FovChangeFn | FovNoticer;
}
declare class FovSystem implements FovTracker {
    site: FovSite;
    flags: NumGrid;
    fov: FOV;
    changed: boolean;
    protected _callback: FovChangeFn;
    follow: FovSubject | null;
    constructor(site: FovSite, opts?: Partial<FovSystemOptions>);
    get callback(): FovChangeFn;
    set callback(v: FovChangeFn | FovNoticer | null);
    getFlag(x: number, y: number): FovFlags;
    isVisible(x: number, y: number): boolean;
    isAnyKindOfVisible(x: number, y: number): boolean;
    isClairvoyantVisible(x: number, y: number): boolean;
    isTelepathicVisible(x: number, y: number): boolean;
    isInFov(x: number, y: number): boolean;
    isDirectlyVisible(x: number, y: number): boolean;
    isActorDetected(x: number, y: number): boolean;
    isItemDetected(x: number, y: number): boolean;
    isMagicMapped(x: number, y: number): boolean;
    isRevealed(x: number, y: number): boolean;
    fovChanged(x: number, y: number): boolean;
    wasAnyKindOfVisible(x: number, y: number): boolean;
    makeAlwaysVisible(): void;
    makeCellAlwaysVisible(x: number, y: number): void;
    revealAll(makeVisibleToo?: boolean): void;
    revealCell(x: number, y: number, makeVisibleToo?: boolean): void;
    hideCell(x: number, y: number): void;
    magicMapCell(x: number, y: number): void;
    reset(): void;
    setCursor(x: number, y: number, keep?: boolean): void;
    clearCursor(x?: number, y?: number): void;
    isCursor(x: number, y: number): boolean;
    setHighlight(x: number, y: number, keep?: boolean): void;
    clearHighlight(x?: number, y?: number): void;
    isHighlight(x: number, y: number): boolean;
    protected demoteCellVisibility(flag: number): number;
    protected updateCellVisibility(flag: number, x: number, y: number): boolean;
    protected updateCellDetect(flag: number, x: number, y: number): boolean;
    protected promoteCellVisibility(flag: number, x: number, y: number): void;
    updateFor(subject: FovSubject): boolean;
    update(): boolean;
    update(cx: number, cy: number, cr?: number): boolean;
}

type index_d$5_FovFlags = FovFlags;
declare const index_d$5_FovFlags: typeof FovFlags;
type index_d$5_FovStrategy = FovStrategy;
type index_d$5_SetVisibleFn = SetVisibleFn;
type index_d$5_ViewportCb = ViewportCb;
type index_d$5_FovSite = FovSite;
type index_d$5_FovSubject = FovSubject;
type index_d$5_FovTracker = FovTracker;
type index_d$5_FOV = FOV;
declare const index_d$5_FOV: typeof FOV;
type index_d$5_FovChangeFn = FovChangeFn;
type index_d$5_FovNoticer = FovNoticer;
type index_d$5_FovSystemOptions = FovSystemOptions;
type index_d$5_FovSystem = FovSystem;
declare const index_d$5_FovSystem: typeof FovSystem;
declare namespace index_d$5 {
  export {
    index_d$5_FovFlags as FovFlags,
    index_d$5_FovStrategy as FovStrategy,
    index_d$5_SetVisibleFn as SetVisibleFn,
    index_d$5_ViewportCb as ViewportCb,
    index_d$5_FovSite as FovSite,
    index_d$5_FovSubject as FovSubject,
    index_d$5_FovTracker as FovTracker,
    index_d$5_FOV as FOV,
    index_d$5_FovChangeFn as FovChangeFn,
    index_d$5_FovNoticer as FovNoticer,
    index_d$5_FovSystemOptions as FovSystemOptions,
    index_d$5_FovSystem as FovSystem,
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

declare type EventFn = (...args: any[]) => void;
/**
 * Data for an event listener.
 */
declare class Listener implements ListItem<Listener> {
    fn: EventFn;
    context: any;
    once: boolean;
    next: Listener | null;
    /**
     * Creates a Listener.
     * @param {EventFn} fn The listener function.
     * @param {any} [context=null] The context to invoke the listener with.
     * @param {boolean} [once=false] Specify if the listener is a one-time listener.
     */
    constructor(fn: EventFn, context?: any, once?: boolean);
    /**
     * Compares this Listener to the parameters.
     * @param {EventFn} fn - The function
     * @param {any} [context] - The context Object.
     * @param {boolean} [once] - Whether or not it is a one time handler.
     * @returns Whether or not this Listener matches the parameters.
     */
    matches(fn: EventFn, context?: any, once?: boolean): boolean;
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
declare function addListener(event: string, fn: EventFn, context?: any, once?: boolean): Listener;
/**
 * Add a listener for a given event.
 *
 * @param {String} event The event name.
 * @param {EventFn} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {boolean} once Specify if the listener is a one-time listener.
 * @returns {Listener}
 */
declare function on(event: string, fn: EventFn, context?: any, once?: boolean): Listener;
/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {EventFn} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
declare function once(event: string, fn: EventFn, context?: any): Listener;
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
declare function removeListener(event: string, fn: EventFn, context?: any, once?: boolean): boolean;
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
 * @returns {boolean} `true` if the event had listeners, else `false`.
 * @public
 */
declare function emit(...args: any[]): boolean;

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
declare function make$5(v?: FrequencyConfig): FrequencyFn;

type frequency_d_FrequencyFn = FrequencyFn;
type frequency_d_FrequencyConfig = FrequencyConfig;
declare namespace frequency_d {
  export {
    frequency_d_FrequencyFn as FrequencyFn,
    frequency_d_FrequencyConfig as FrequencyConfig,
    make$5 as make,
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

interface BufferTarget {
    readonly width: number;
    readonly height: number;
    copyTo(dest: Buffer$1): void;
    draw(src: Buffer$1): void;
    toGlyph(ch: string | number): number;
}
declare class Buffer extends Buffer$1 {
    _target: BufferTarget;
    _parent: Buffer | null;
    constructor(canvas: BufferTarget, parent?: Buffer);
    toGlyph(ch: string | number): number;
    render(): this;
    reset(): void;
}

declare type CTX = CanvasRenderingContext2D;
declare type DrawFunction = (ctx: CTX, x: number, y: number, width: number, height: number) => void;
declare type DrawType = string | DrawFunction;
interface GlyphOptions {
    font?: string;
    fontSize?: number;
    size?: number;
    tileWidth?: number;
    tileHeight?: number;
    basicOnly?: boolean;
    basic?: boolean;
}
declare class Glyphs {
    private _node;
    private _ctx;
    private _tileWidth;
    private _tileHeight;
    needsUpdate: boolean;
    private _map;
    static fromImage(src: string | HTMLImageElement): Glyphs;
    static fromFont(src: GlyphOptions | string): Glyphs;
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

declare class NotSupportedError extends Error {
    constructor(...params: any[]);
}
declare abstract class BaseCanvas implements BufferTarget {
    mouse: XY;
    _data: Uint32Array;
    _renderRequested: boolean;
    _glyphs: Glyphs;
    _node: HTMLCanvasElement;
    _width: number;
    _height: number;
    _buffers: Buffer[];
    _current: number;
    loop: Loop;
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
    get parentBuffer(): Buffer;
    get root(): Buffer;
    pushBuffer(): Buffer;
    popBuffer(): void;
    protected _createNode(): HTMLCanvasElement;
    protected abstract _createContext(): void;
    private _configure;
    protected _setGlyphs(glyphs: Glyphs): boolean;
    resize(width: number, height: number): void;
    protected _requestRender(): void;
    abstract draw(data: Buffer$1): boolean;
    copyTo(data: Buffer$1): void;
    render(): void;
    abstract _render(): void;
    hasXY(x: number, y: number): boolean;
    set onclick(fn: EventFn$1 | null);
    set onmousemove(fn: EventFn$1 | null);
    set onmouseup(fn: EventFn$1 | null);
    set onkeydown(fn: EventFn$1 | null);
    protected _toX(offsetX: number): number;
    protected _toY(offsetY: number): number;
}
declare class Canvas2D extends BaseCanvas {
    private _ctx;
    private _changed;
    constructor(width: number, height: number, glyphs: Glyphs);
    protected _createContext(): void;
    resize(width: number, height: number): void;
    draw(data: Buffer$1): boolean;
    _render(): void;
    protected _renderCell(index: number): void;
}

declare class CanvasGL extends BaseCanvas {
    private _gl;
    private _glBuffers;
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
    draw(data: Buffer$1): boolean;
    copyTo(data: Buffer$1): void;
    _render(): void;
}

interface BaseOptions {
    width?: number;
    height?: number;
    glyphs?: Glyphs;
    div?: HTMLElement | string;
    io?: true;
    loop?: Loop;
    image?: HTMLImageElement | string;
}
declare type CanvasOptions = BaseOptions & GlyphOptions;
declare function make$4(opts: Partial<CanvasOptions>): BaseCanvas;
declare function make$4(width: number, height: number, opts?: Partial<CanvasOptions>): BaseCanvas;

type index_d$4_BufferTarget = BufferTarget;
type index_d$4_Buffer = Buffer;
declare const index_d$4_Buffer: typeof Buffer;
type index_d$4_GlyphOptions = GlyphOptions;
type index_d$4_Glyphs = Glyphs;
declare const index_d$4_Glyphs: typeof Glyphs;
type index_d$4_NotSupportedError = NotSupportedError;
declare const index_d$4_NotSupportedError: typeof NotSupportedError;
type index_d$4_BaseCanvas = BaseCanvas;
declare const index_d$4_BaseCanvas: typeof BaseCanvas;
type index_d$4_Canvas2D = Canvas2D;
declare const index_d$4_Canvas2D: typeof Canvas2D;
type index_d$4_CanvasGL = CanvasGL;
declare const index_d$4_CanvasGL: typeof CanvasGL;
type index_d$4_CanvasOptions = CanvasOptions;
declare namespace index_d$4 {
  export {
    index_d$4_BufferTarget as BufferTarget,
    index_d$4_Buffer as Buffer,
    index_d$4_GlyphOptions as GlyphOptions,
    index_d$4_Glyphs as Glyphs,
    index_d$4_NotSupportedError as NotSupportedError,
    index_d$4_BaseCanvas as BaseCanvas,
    index_d$4_Canvas2D as Canvas2D,
    index_d$4_CanvasGL as CanvasGL,
    index_d$4_CanvasOptions as CanvasOptions,
    make$4 as make,
  };
}

interface SpriteConfig {
    ch?: string | null;
    fg?: ColorBase | null;
    bg?: ColorBase | null;
    opacity?: number;
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
declare function make$3(): Sprite;
declare function make$3(bg: ColorBase, opacity?: number): Sprite;
declare function make$3(ch?: string | null, fg?: ColorBase | null, bg?: ColorBase | null, opacity?: number): Sprite;
declare function make$3(args: any[]): Sprite;
declare function make$3(info: SpriteConfig): Sprite;
declare function from$1(name: string): Sprite;
declare function from$1(config: SpriteConfig): Sprite;
declare function install$2(name: string, bg: ColorBase, opacity?: number): Sprite;
declare function install$2(name: string, ch: string | null, fg: Color | number | string | number[] | null, bg: Color | number | string | number[] | null, opacity?: number): Sprite;
declare function install$2(name: string, args: any[]): Sprite;
declare function install$2(name: string, info: SpriteConfig): Sprite;

interface SpriteData {
    readonly ch: string | null;
    readonly fg: ColorBase;
    readonly bg: ColorBase;
    readonly opacity: number;
}

type index_d$3_SpriteConfig = SpriteConfig;
type index_d$3_Sprite = Sprite;
declare const index_d$3_Sprite: typeof Sprite;
declare const index_d$3_sprites: typeof sprites;
type index_d$3_DrawInfo = DrawInfo;
type index_d$3_Mixer = Mixer;
declare const index_d$3_Mixer: typeof Mixer;
declare const index_d$3_makeMixer: typeof makeMixer;
type index_d$3_SpriteData = SpriteData;
declare namespace index_d$3 {
  export {
    index_d$3_SpriteConfig as SpriteConfig,
    index_d$3_Sprite as Sprite,
    index_d$3_sprites as sprites,
    make$3 as make,
    from$1 as from,
    install$2 as install,
    index_d$3_DrawInfo as DrawInfo,
    index_d$3_Mixer as Mixer,
    index_d$3_makeMixer as makeMixer,
    index_d$3_SpriteData as SpriteData,
  };
}

declare const templates: Record<string, Template>;
declare function install$1(id: string, msg: string): Template;
declare function installAll$1(config: Record<string, string>): void;
declare function get(msgOrId: string): Template | null;
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
    match?: XYMatchFunc;
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
    matchFn: XYMatchFunc;
    constructor(opts?: Partial<CacheOptions>);
    get needsUpdate(): boolean;
    set needsUpdate(needs: boolean);
    protected _addMessageLine(msg: string): void;
    addMessage(x: number, y: number, msg: string): void;
    protected _addMessage(msg: string): void;
    addCombatMessage(x: number, y: number, msg: string): void;
    protected _addCombatMessage(msg: string): void;
    commitCombatMessage(): boolean;
    confirmAll(): void;
    forEach(fn: EachMsgFn): void;
    get length(): number;
}

declare const message_d_templates: typeof templates;
declare const message_d_get: typeof get;
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
    message_d_get as get,
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
declare function make$2(opts?: Partial<BlobConfig>): Blob;

type blob_d_BlobConfig = BlobConfig;
type blob_d_Blob = Blob;
declare const blob_d_Blob: typeof Blob;
declare const blob_d_fillBlob: typeof fillBlob;
declare namespace blob_d {
  export {
    blob_d_BlobConfig as BlobConfig,
    blob_d_Blob as Blob,
    blob_d_fillBlob as fillBlob,
    make$2 as make,
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
    setLight(x: number, y: number, light: LightValue): void;
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
declare function make$1(color: ColorBase, radius?: RangeBase, fadeTo?: number, pass?: boolean): Light;
declare function make$1(light: LightBase): Light;
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
    light: Grid$1<LightValue>;
    oldLight: Grid$1<LightValue>;
    glowLight: Grid$1<LightValue>;
    flags: NumGrid;
    constructor(map: LightSystemSite, opts?: Partial<LightSystemOptions>);
    copy(other: LightSystem): void;
    getAmbient(): LightValue;
    setAmbient(light: LightValue | ColorBase): void;
    get needsUpdate(): boolean;
    getLight(x: number, y: number): LightValue;
    setLight(x: number, y: number, light: LightValue): void;
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

type index_d$2_LightConfig = LightConfig;
type index_d$2_LightBase = LightBase;
type index_d$2_LightType = LightType;
type index_d$2_LightCb = LightCb;
type index_d$2_PaintSite = PaintSite;
type index_d$2_LightSystemSite = LightSystemSite;
type index_d$2_LightSystemType = LightSystemType;
declare const index_d$2_config: typeof config;
type index_d$2_Light = Light;
declare const index_d$2_Light: typeof Light;
declare const index_d$2_intensity: typeof intensity;
declare const index_d$2_isDarkLight: typeof isDarkLight;
declare const index_d$2_isShadowLight: typeof isShadowLight;
declare const index_d$2_lights: typeof lights;
declare const index_d$2_from: typeof from;
declare const index_d$2_install: typeof install;
declare const index_d$2_installAll: typeof installAll;
type index_d$2_StaticLightInfo = StaticLightInfo;
type index_d$2_LightSystemOptions = LightSystemOptions;
type index_d$2_LightSystem = LightSystem;
declare const index_d$2_LightSystem: typeof LightSystem;
declare namespace index_d$2 {
  export {
    index_d$2_LightConfig as LightConfig,
    index_d$2_LightBase as LightBase,
    index_d$2_LightType as LightType,
    index_d$2_LightCb as LightCb,
    index_d$2_PaintSite as PaintSite,
    index_d$2_LightSystemSite as LightSystemSite,
    index_d$2_LightSystemType as LightSystemType,
    index_d$2_config as config,
    index_d$2_Light as Light,
    index_d$2_intensity as intensity,
    index_d$2_isDarkLight as isDarkLight,
    index_d$2_isShadowLight as isShadowLight,
    make$1 as make,
    index_d$2_lights as lights,
    index_d$2_from as from,
    index_d$2_install as install,
    index_d$2_installAll as installAll,
    index_d$2_StaticLightInfo as StaticLightInfo,
    index_d$2_LightSystemOptions as LightSystemOptions,
    index_d$2_LightSystem as LightSystem,
  };
}

declare type MatchFn = (el: UISelectable) => boolean;
declare type BuildFn = (next: MatchFn, e: UISelectable) => boolean;
declare class Selector {
    text: string;
    priority: number;
    matchFn: MatchFn;
    constructor(text: string);
    protected _parse(text: string): MatchFn;
    protected _parentMatch(): BuildFn;
    protected _ancestorMatch(): BuildFn;
    protected _matchElement(text: string): BuildFn;
    protected _matchTag(tag: string): MatchFn | null;
    protected _matchClass(cls: string): MatchFn;
    protected _matchProp(prop: string): MatchFn;
    protected _matchId(id: string): MatchFn;
    protected _matchFirst(): MatchFn;
    protected _matchLast(): MatchFn;
    protected _matchNot(fn: MatchFn): MatchFn;
    matches(obj: UISelectable): boolean;
}
declare function compile(text: string): Selector;

interface Size {
    width: number;
    height: number;
}
declare type PrefixType = 'none' | 'letter' | 'number' | 'bullet';
declare type PropType = string | number | boolean;
interface UIStyle {
    readonly selector: Selector;
    dirty: boolean;
    readonly fg?: ColorBase;
    readonly bg?: ColorBase;
    readonly align?: Align;
    readonly valign?: VAlign;
    get(key: keyof UIStyle): any;
    set(key: keyof UIStyle, value: any): this;
    set(values: StyleOptions): this;
    unset(key: keyof UIStyle): this;
}
interface StyleOptions {
    fg?: ColorBase;
    bg?: ColorBase;
    align?: Align;
    valign?: VAlign;
}
interface UISelectable {
    readonly tag: string;
    readonly classes: string[];
    children: UISelectable[];
    attr(name: string): PropType | undefined;
    prop(name: string): PropType | undefined;
    parent: UISelectable | null;
}
interface UIStylable extends UISelectable {
    style(): UIStyle;
    readonly opacity: number;
}
interface UILayer {
    readonly buffer: Buffer;
    readonly width: number;
    readonly height: number;
    finish(result?: any): void;
    click(e: Event$1): boolean;
    mousemove(e: Event$1): boolean;
    keypress(e: Event$1): boolean;
    dir(e: Event$1): boolean;
    tick(e: Event$1): boolean;
    draw(): void;
    needsDraw: boolean;
}

interface GridTarget {
    pos(): XY;
    pos(x: number, y: number): any;
}
declare class Grid {
    _left: number;
    _top: number;
    _colWidths: number[];
    _rowHeights: number[];
    _col: number;
    _row: number;
    target: GridTarget;
    constructor(target: GridTarget);
    cols(): number[];
    cols(count: number, width: number): this;
    cols(widths: number[]): this;
    rows(): number[];
    rows(count: number, height?: number): this;
    rows(heights: number[]): this;
    col(n?: number): this;
    nextCol(): this;
    row(n?: number): this;
    nextRow(): this;
    endRow(h: number): this;
    protected _setPos(): this;
}

declare type StyleType = string | StyleOptions;
declare class Style implements UIStyle {
    _fg?: ColorBase;
    _bg?: ColorBase;
    _border?: ColorBase;
    _align?: Align;
    _valign?: VAlign;
    selector: Selector;
    protected _dirty: boolean;
    constructor(selector?: string, init?: StyleOptions);
    get dirty(): boolean;
    set dirty(v: boolean);
    get fg(): ColorBase | undefined;
    get bg(): ColorBase | undefined;
    dim(pct?: number, fg?: boolean, bg?: boolean): this;
    bright(pct?: number, fg?: boolean, bg?: boolean): this;
    invert(): this;
    get align(): Align | undefined;
    get valign(): VAlign | undefined;
    get(key: keyof Style): any;
    set(opts: StyleOptions, setDirty?: boolean): this;
    set(key: keyof StyleOptions, value: any, setDirty?: boolean): this;
    unset(key: keyof Style): this;
    clone(): this;
    copy(other: Style): this;
}
declare function makeStyle(style: string, selector?: string): Style;
declare class ComputedStyle extends Style {
    sources: UIStyle[];
    _opacity: number;
    _baseFg: Color | null;
    _baseBg: Color | null;
    constructor(sources?: UIStyle[], opacity?: number);
    get opacity(): number;
    set opacity(v: number);
    get dirty(): boolean;
    set dirty(v: boolean);
}
declare class Sheet {
    rules: UIStyle[];
    _dirty: boolean;
    constructor(parentSheet?: Sheet | null);
    get dirty(): boolean;
    set dirty(v: boolean);
    add(selector: string, props: StyleOptions): this;
    get(selector: string): UIStyle | null;
    remove(selector: string): void;
    computeFor(widget: UIStylable): ComputedStyle;
}
declare const defaultStyle: Sheet;

declare type EventCb$1 = (name: string, widget: Widget | null, args?: any) => boolean | any;
interface WidgetOptions extends StyleOptions {
    id?: string;
    disabled?: boolean;
    hidden?: boolean;
    opacity?: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    class?: string;
    tag?: string;
    tabStop?: boolean;
    action?: string;
    depth?: number;
}
interface SetParentOptions {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    beforeIndex?: number;
}
declare class Widget implements UIStylable {
    tag: string;
    layer: WidgetLayer;
    bounds: Bounds;
    _depth: number;
    events: Record<string, EventCb$1[]>;
    children: Widget[];
    _style: Style;
    _used: ComputedStyle;
    _parent: Widget | null;
    classes: string[];
    _props: Record<string, PropType>;
    _attrs: Record<string, PropType>;
    constructor(term: WidgetLayer, opts?: WidgetOptions);
    get depth(): number;
    set depth(v: number);
    get parent(): Widget | null;
    set parent(v: Widget | null);
    setParent(v: Widget | null, opts?: SetParentOptions): void;
    pos(): XY;
    pos(xy: XY): this;
    pos(x: number, y: number): this;
    center(bounds?: Bounds): this;
    centerX(bounds?: Bounds): this;
    centerY(bounds?: Bounds): this;
    text(): string;
    text(v: string): this;
    attr(name: string): PropType;
    attr(name: string, v: PropType): this;
    _attrInt(name: string): number;
    _attrStr(name: string): string;
    _attrBool(name: string): boolean;
    prop(name: string): PropType | undefined;
    prop(name: string, v: PropType): this;
    _setProp(name: string, v: PropType): void;
    _propInt(name: string): number;
    _propStr(name: string): string;
    _propBool(name: string): boolean;
    toggleProp(name: string): this;
    incProp(name: string, n?: number): this;
    contains(e: XY): boolean;
    contains(x: number, y: number): boolean;
    style(): Style;
    style(opts: StyleOptions): this;
    addClass(c: string): this;
    removeClass(c: string): this;
    hasClass(c: string): boolean;
    toggleClass(c: string): this;
    get focused(): boolean;
    focus(reverse?: boolean): boolean;
    blur(reverse?: boolean): boolean;
    get hovered(): boolean;
    set hovered(v: boolean);
    get hidden(): boolean;
    set hidden(v: boolean);
    get opacity(): number;
    set opacity(v: number);
    updateStyle(): void;
    draw(buffer: Buffer$1): boolean;
    fadeIn(ms: number): this;
    fadeOut(ms: number): this;
    fadeTo(opacity: number, ms: number): this;
    fadeToggle(ms: number): this;
    slideIn(x: number, y: number, from: 'left' | 'top' | 'right' | 'bottom', ms: number): this;
    slideOut(dir: 'left' | 'top' | 'right' | 'bottom', ms: number): this;
    slide(from: XY | Loc$1, to: XY | Loc$1, ms: number): this;
    protected _draw(buffer: Buffer$1): boolean;
    protected _drawFill(buffer: Buffer$1): void;
    childAt(xy: XY): Widget | null;
    childAt(x: number, y: number): Widget | null;
    _addChild(w: Widget, opts?: SetParentOptions): this;
    _removeChild(w: Widget): this;
    resize(w: number, h: number): this;
    mouseenter(e: Event$1, over: Widget): void;
    mousemove(e: Event$1): boolean;
    mouseleave(e: Event$1): void;
    click(e: Event$1): boolean;
    keypress(e: Event$1): boolean;
    dir(e: Event$1): boolean;
    tick(e: Event$1): boolean;
    on(event: string, cb: EventCb$1): this;
    off(event: string, cb?: EventCb$1): this;
    _fireEvent(name: string, source: Widget | null, args?: any): boolean;
    _bubbleEvent(name: string, source: Widget | null, args?: any): boolean;
}

interface WidgetLayerOptions extends LayerOptions {
}
declare class WidgetLayer extends Layer {
    body: Widget;
    styles: Sheet;
    _attachOrder: Widget[];
    _depthOrder: Widget[];
    _focusWidget: Widget | null;
    _hasTabStop: boolean;
    _opts: WidgetOptions;
    constructor(ui: UI, opts?: WidgetLayerOptions);
    reset(): this;
    fg(v: ColorBase): this;
    bg(v: ColorBase): this;
    dim(pct?: number, fg?: boolean, bg?: boolean): this;
    bright(pct?: number, fg?: boolean, bg?: boolean): this;
    invert(): this;
    style(opts: StyleOptions): this;
    class(c: string): this;
    pos(): XY;
    pos(x: number, y: number): this;
    moveTo(x: number, y: number): this;
    move(dx: number, dy: number): this;
    up(n?: number): this;
    down(n?: number): this;
    left(n?: number): this;
    right(n?: number): this;
    nextLine(n?: number): this;
    prevLine(n?: number): this;
    grid(): Grid;
    clear(color?: ColorBase): this;
    sortWidgets(): this;
    attach(w: Widget): this;
    detach(w: Widget): this;
    widgetAt(x: number, y: number): Widget;
    widgetAt(xy: XY): Widget;
    get focusWidget(): Widget | null;
    setFocusWidget(w: Widget | null, reverse?: boolean): void;
    getWidget(id: string): Widget | null;
    nextTabStop(): boolean;
    prevTabStop(): boolean;
    on(event: string, cb: EventCb$1): this;
    off(event: string, cb?: EventCb$1): this;
    mousemove(e: Event$1): boolean;
    click(e: Event$1): boolean;
    keypress(e: Event$1): boolean;
    dir(e: Event$1): boolean;
    tick(e: Event$1): boolean;
    draw(): void;
    finish(result?: any): void;
}

interface TextOptions extends WidgetOptions {
    text: string;
}
declare class Text extends Widget {
    _text: string;
    _lines: string[];
    _fixedWidth: boolean;
    _fixedHeight: boolean;
    constructor(layer: WidgetLayer, opts: TextOptions);
    text(): string;
    text(v: string): this;
    resize(w: number, h: number): this;
    _draw(buffer: Buffer$1): boolean;
}
declare type AddTextOptions = Omit<TextOptions, 'text'> & SetParentOptions & {
    parent?: Widget;
};
declare module './layer' {
    interface WidgetLayer {
        text(text: string, opts?: AddTextOptions): Text;
    }
}

declare type FormatFn = Template;
declare type Value = string | number;
declare type SelectType = 'none' | 'column' | 'row' | 'cell';
declare type HoverType = 'none' | 'column' | 'row' | 'cell' | 'select';
declare type DataObject = Record<string, any>;
declare type DataItem = Value | Value[] | DataObject;
declare type DataType = DataItem[];
declare type BorderType = 'ascii' | 'fill' | 'none';
interface ColumnOptions {
    width?: number;
    format?: string | FormatFn;
    header?: string;
    headerTag?: string;
    headerClass?: string;
    empty?: string;
    dataTag?: string;
    dataClass?: string;
}
interface DataTableOptions extends Omit<WidgetOptions, 'height'> {
    size?: number;
    rowHeight?: number;
    header?: boolean;
    headerTag?: string;
    dataTag?: string;
    prefix?: PrefixType;
    select?: SelectType;
    hover?: HoverType;
    wrap?: boolean;
    columns: ColumnOptions[];
    data?: DataType;
    border?: boolean | BorderType;
}
declare class Column {
    static default: {
        select: string;
        hover: string;
        tag: string;
        headerTag: string;
        dataTag: string;
        border: string;
    };
    width: number;
    format: Template;
    header: string;
    headerTag: string;
    dataTag: string;
    empty: string;
    constructor(opts: ColumnOptions);
    addHeader(table: DataTable, x: number, y: number, col: number): Text;
    addData(table: DataTable, data: DataItem, x: number, y: number, col: number, row: number): Text;
    addEmpty(table: DataTable, x: number, y: number, col: number, row: number): Text;
}
declare class DataTable extends Widget {
    static default: {
        columnWidth: number;
        header: boolean;
        empty: string;
        tag: string;
        headerTag: string;
        dataTag: string;
        select: SelectType;
        hover: HoverType;
        prefix: PrefixType;
        border: BorderType;
        wrap: boolean;
    };
    _data: DataType;
    columns: Column[];
    showHeader: boolean;
    rowHeight: number;
    size: number;
    selectedRow: number;
    selectedColumn: number;
    constructor(layer: WidgetLayer, opts: DataTableOptions);
    get selectedData(): any;
    select(col: number, row: number): this;
    selectNextRow(): this;
    selectPrevRow(): this;
    selectNextCol(): this;
    selectPrevCol(): this;
    blur(reverse?: boolean): boolean;
    data(): DataType;
    data(data: DataType): this;
    _draw(buffer: Buffer$1): boolean;
    mouseenter(e: Event$1, over: Widget): void;
    click(e: Event$1): boolean;
    keypress(e: Event$1): boolean;
    dir(e: Event$1): boolean;
}
declare class TD extends Text {
    mouseleave(e: Event$1): void;
}
declare type AddDataTableOptions = DataTableOptions & SetParentOptions & {
    parent?: Widget;
};
declare module './layer' {
    interface WidgetLayer {
        datatable(opts: AddDataTableOptions): DataTable;
    }
}

declare type PadInfo = boolean | number | [number] | [number, number] | [number, number, number, number];
interface DialogOptions extends WidgetOptions {
    width: number;
    height: number;
    border?: BorderType;
    pad?: PadInfo;
    legend?: string;
    legendTag?: string;
    legendClass?: string;
    legendAlign?: Align;
}
declare function toPadArray(pad: PadInfo): [number, number, number, number];
declare class Dialog extends Widget {
    static default: {
        tag: string;
        border: BorderType;
        pad: boolean;
        legendTag: string;
        legendClass: string;
        legendAlign: Align;
    };
    legend: Widget | null;
    constructor(layer: WidgetLayer, opts: DialogOptions);
    _adjustBounds(pad: [number, number, number, number]): this;
    get _innerLeft(): number;
    get _innerWidth(): number;
    get _innerTop(): number;
    get _innerHeight(): number;
    _addLegend(opts: DialogOptions): this;
    _draw(buffer: Buffer$1): boolean;
}
declare type AddDialogOptions = DialogOptions & SetParentOptions & {
    parent?: Widget;
};
declare module './layer' {
    interface WidgetLayer {
        dialog(opts?: AddDialogOptions): Dialog;
    }
}

interface UIOptions extends CanvasOptions {
    canvas?: BaseCanvas;
    loop?: Loop;
}
interface AlertOptions extends DialogOptions {
    duration?: number;
    waitForAck?: boolean;
    textClass?: string;
    opacity?: number;
}
interface ConfirmOptions extends Omit<DialogOptions, 'width' | 'height'> {
    width?: number;
    height?: number;
    textClass?: string;
    opacity?: number;
    buttonWidth?: number;
    ok?: string;
    okClass?: string;
    cancel?: boolean | string;
    cancelClass?: string;
}
interface InputBoxOptions extends Omit<DialogOptions, 'width' | 'height'> {
    width?: number;
    height?: number;
    textClass?: string;
    opacity?: number;
    buttonWidth?: number;
    label?: string;
    labelClass?: string;
    default?: string;
    placeholder?: string;
    inputClass?: string;
    minLength?: number;
    maxLength?: number;
    numbersOnly?: boolean;
    min?: number;
    max?: number;
}
declare class UI {
    canvas: BaseCanvas;
    loop: Loop;
    buffer: Buffer;
    constructor(opts?: UIOptions);
    get width(): number;
    get height(): number;
    alert(text: string, args?: any): Promise<boolean>;
    alert(opts: AlertOptions | number, text: string, args?: any): Promise<boolean>;
    confirm(_text?: string | any, _args?: any): Promise<boolean>;
    confirm(_opts: ConfirmOptions | string, _text?: string | any, _args?: any): Promise<boolean>;
    inputbox(_text?: string | any, _args?: any): Promise<string | null>;
    inputbox(_opts: InputBoxOptions | string, _text?: string | any, _args?: any): Promise<string | null>;
}
declare function make(opts: UIOptions): UI;

declare type StartCb = () => void;
declare type DrawCb = (buffer: Buffer$1) => boolean;
declare type EventCb = (e: Event$1) => boolean;
declare type FinishCb = (result: any) => void;
interface LayerOptions {
    styles?: Sheet;
}
interface BufferStack {
    readonly buffer: Buffer;
    readonly parentBuffer: Buffer;
    readonly loop: Loop;
    pushBuffer(): Buffer;
    popBuffer(): void;
}
declare class Layer implements UILayer, Animator {
    ui: UI;
    buffer: Buffer;
    io: Handler;
    needsDraw: boolean;
    constructor(ui: UI, _opts?: LayerOptions);
    get width(): number;
    get height(): number;
    mousemove(_e: Event$1): boolean;
    click(_e: Event$1): boolean;
    keypress(_e: Event$1): boolean;
    dir(_e: Event$1): boolean;
    tick(_e: Event$1): boolean;
    draw(): void;
    setTimeout(action: TimerFn, time: number): void;
    clearTimeout(action: string | TimerFn): void;
    addAnimation(a: Animation): void;
    removeAnimation(a: Animation): void;
    run(keymap?: IOMap, ms?: number): Promise<any>;
    finish(result?: any): void;
}

interface ButtonOptions extends Omit<TextOptions, 'text'> {
    text?: string;
    id: string;
}
declare class Button extends Text {
    constructor(layer: WidgetLayer, opts: ButtonOptions);
    keypress(ev: Event$1): boolean;
    click(ev: Event$1): boolean;
}
declare type AddButtonOptions = Omit<ButtonOptions, 'text'> & SetParentOptions & {
    parent?: Widget;
};
declare module './layer' {
    interface WidgetLayer {
        button(text: string, opts?: AddButtonOptions): Button;
    }
}

type index_d$1_Size = Size;
type index_d$1_PrefixType = PrefixType;
type index_d$1_PropType = PropType;
type index_d$1_UIStyle = UIStyle;
type index_d$1_StyleOptions = StyleOptions;
type index_d$1_UISelectable = UISelectable;
type index_d$1_UIStylable = UIStylable;
type index_d$1_UILayer = UILayer;
type index_d$1_GridTarget = GridTarget;
type index_d$1_Grid = Grid;
declare const index_d$1_Grid: typeof Grid;
type index_d$1_MatchFn = MatchFn;
type index_d$1_Selector = Selector;
declare const index_d$1_Selector: typeof Selector;
declare const index_d$1_compile: typeof compile;
type index_d$1_StyleType = StyleType;
type index_d$1_Style = Style;
declare const index_d$1_Style: typeof Style;
declare const index_d$1_makeStyle: typeof makeStyle;
type index_d$1_ComputedStyle = ComputedStyle;
declare const index_d$1_ComputedStyle: typeof ComputedStyle;
type index_d$1_Sheet = Sheet;
declare const index_d$1_Sheet: typeof Sheet;
declare const index_d$1_defaultStyle: typeof defaultStyle;
type index_d$1_StartCb = StartCb;
type index_d$1_DrawCb = DrawCb;
type index_d$1_EventCb = EventCb;
type index_d$1_FinishCb = FinishCb;
type index_d$1_LayerOptions = LayerOptions;
type index_d$1_BufferStack = BufferStack;
type index_d$1_Layer = Layer;
declare const index_d$1_Layer: typeof Layer;
type index_d$1_UIOptions = UIOptions;
type index_d$1_AlertOptions = AlertOptions;
type index_d$1_ConfirmOptions = ConfirmOptions;
type index_d$1_InputBoxOptions = InputBoxOptions;
type index_d$1_UI = UI;
declare const index_d$1_UI: typeof UI;
declare const index_d$1_make: typeof make;
declare namespace index_d$1 {
  export {
    index_d$1_Size as Size,
    index_d$1_PrefixType as PrefixType,
    index_d$1_PropType as PropType,
    index_d$1_UIStyle as UIStyle,
    index_d$1_StyleOptions as StyleOptions,
    index_d$1_UISelectable as UISelectable,
    index_d$1_UIStylable as UIStylable,
    index_d$1_UILayer as UILayer,
    index_d$1_GridTarget as GridTarget,
    index_d$1_Grid as Grid,
    index_d$1_MatchFn as MatchFn,
    index_d$1_Selector as Selector,
    index_d$1_compile as compile,
    index_d$1_StyleType as StyleType,
    index_d$1_Style as Style,
    index_d$1_makeStyle as makeStyle,
    index_d$1_ComputedStyle as ComputedStyle,
    index_d$1_Sheet as Sheet,
    index_d$1_defaultStyle as defaultStyle,
    index_d$1_StartCb as StartCb,
    index_d$1_DrawCb as DrawCb,
    index_d$1_EventCb as EventCb,
    index_d$1_FinishCb as FinishCb,
    index_d$1_LayerOptions as LayerOptions,
    index_d$1_BufferStack as BufferStack,
    index_d$1_Layer as Layer,
    index_d$1_UIOptions as UIOptions,
    index_d$1_AlertOptions as AlertOptions,
    index_d$1_ConfirmOptions as ConfirmOptions,
    index_d$1_InputBoxOptions as InputBoxOptions,
    index_d$1_UI as UI,
    index_d$1_make as make,
  };
}

declare class Body extends Widget {
    constructor(layer: WidgetLayer);
    _drawFill(buffer: Buffer$1): void;
}

interface BorderOptions extends WidgetOptions {
    width: number;
    height: number;
    ascii?: boolean;
}
declare class Border extends Widget {
    ascii: boolean;
    constructor(layer: WidgetLayer, opts: BorderOptions);
    contains(e: XY): boolean;
    contains(x: number, y: number): boolean;
    _draw(buffer: Buffer$1): boolean;
}
declare type AddBorderOptions = BorderOptions & SetParentOptions & {
    parent?: Widget;
};
declare module './layer' {
    interface WidgetLayer {
        border(opts: AddBorderOptions): Border;
    }
}
declare function drawBorder(buffer: Buffer$1, x: number, y: number, w: number, h: number, style: UIStyle, ascii: boolean): void;

interface FieldsetOptions extends Omit<DialogOptions, 'width' | 'height'> {
    width?: number;
    height?: number;
    dataWidth: number;
    separator?: string;
    labelTag?: string;
    labelClass?: string;
    dataTag?: string;
    dataClass?: string;
}
declare class Fieldset extends Dialog {
    static default: {
        tag: string;
        border: BorderType;
        separator: string;
        pad: boolean;
        legendTag: string;
        legendClass: string;
        legendAlign: Align;
        labelTag: string;
        labelClass: string;
        dataTag: string;
        dataClass: string;
    };
    fields: Field[];
    constructor(layer: WidgetLayer, opts: FieldsetOptions);
    _adjustBounds(pad: [number, number, number, number]): this;
    get _labelLeft(): number;
    get _dataLeft(): number;
    get _nextY(): number;
    add(label: string, format: string | FieldOptions): this;
    data(d: any): this;
}
declare type AddFieldsetOptions = FieldsetOptions & SetParentOptions & {
    parent?: Widget;
};
declare module './layer' {
    interface WidgetLayer {
        fieldset(opts?: AddFieldsetOptions): Fieldset;
    }
}
interface FieldOptions extends WidgetOptions {
    format: string | Template;
}
declare class Field extends Text {
    _format: Template;
    constructor(layer: WidgetLayer, opts: FieldOptions);
    data(v: any): this;
}

interface OrderedListOptions extends WidgetOptions {
    pad?: number;
}
declare class OrderedList extends Widget {
    static default: {
        pad: number;
    };
    _fixedWidth: boolean;
    _fixedHeight: boolean;
    constructor(layer: WidgetLayer, opts: OrderedListOptions);
    _addChild(w: Widget, opts?: SetParentOptions): this;
    _draw(buffer: Buffer$1): boolean;
    _getBullet(index: number): string;
    _drawBulletFor(widget: Widget, buffer: Buffer$1, index: number): void;
}
interface UnorderedListOptions extends OrderedListOptions {
    bullet?: string;
}
declare class UnorderedList extends OrderedList {
    static default: {
        bullet: string;
        pad: number;
    };
    constructor(layer: WidgetLayer, opts: UnorderedListOptions);
    _getBullet(_index: number): string;
}
declare type AddOrderedListOptions = OrderedListOptions & SetParentOptions & {
    parent?: Widget;
};
declare type AddUnorderedListOptions = UnorderedListOptions & SetParentOptions & {
    parent?: Widget;
};
declare module './layer' {
    interface WidgetLayer {
        ol(opts?: AddOrderedListOptions): OrderedList;
        ul(opts?: AddUnorderedListOptions): UnorderedList;
    }
}

interface InputOptions extends Omit<TextOptions, 'text'> {
    text?: string;
    id: string;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    numbersOnly?: boolean;
    min?: number;
    max?: number;
    required?: boolean;
    disabled?: boolean;
}
declare class Input extends Text {
    static default: {
        tag: string;
        width: number;
        placeholder: string;
    };
    minLength: number;
    maxLength: number;
    numbersOnly: boolean;
    min: number;
    max: number;
    constructor(layer: WidgetLayer, opts: InputOptions);
    reset(): void;
    _setProp(name: string, v: PropType): void;
    isValid(): boolean;
    keypress(ev: Event$1): boolean;
    text(): string;
    text(v: string): this;
    _draw(buffer: Buffer$1, _force?: boolean): boolean;
}
declare type AddInputOptions = InputOptions & SetParentOptions & {
    parent?: Widget;
};
declare module './layer' {
    interface WidgetLayer {
        input(opts: AddInputOptions): Input;
    }
}

interface DataListOptions extends ColumnOptions, WidgetOptions {
    size?: number;
    rowHeight?: number;
    hover?: HoverType;
    headerTag?: string;
    dataTag?: string;
    prefix?: PrefixType;
    data?: DataType;
    border?: boolean | BorderType;
}
declare class DataList extends DataTable {
    constructor(layer: WidgetLayer, opts: DataListOptions);
}
declare type AddDataListOptions = DataListOptions & SetParentOptions & {
    parent?: Widget;
};
declare module './layer' {
    interface WidgetLayer {
        datalist(opts: AddDataListOptions): DataList;
    }
}

interface Rec<T> {
    [keys: string]: T;
}
declare type DropdownConfig = Rec<ButtonConfig>;
declare type ActionConfig = string;
declare type ButtonConfig = ActionConfig | DropdownConfig;
interface MenuOptions extends WidgetOptions {
    buttons: DropdownConfig;
    buttonClass?: string | string[];
    buttonTag?: string;
    minWidth?: number;
    marker?: string;
}
declare class Menu extends Widget {
    static default: {
        tag: string;
        class: string;
        buttonClass: string;
        buttonTag: string;
        marker: string;
        minWidth: number;
    };
    constructor(layer: WidgetLayer, opts: MenuOptions);
    _initButtons(opts: MenuOptions): void;
    collapse(): this;
}
interface MenuButtonOptions extends WidgetOptions {
    text: string;
    buttons: ButtonConfig;
}
declare class MenuButton extends Text {
    menu: Menu | null;
    constructor(layer: WidgetLayer, opts: MenuButtonOptions);
    collapse(): this;
    expand(): this;
    _setMenuPos(xy: XY, opts: MenuButtonOptions): void;
    _initMenu(opts: MenuButtonOptions): Menu | null;
}
declare type AddMenuOptions = MenuOptions & SetParentOptions & {
    parent?: Widget;
};
declare module './layer' {
    interface WidgetLayer {
        menu(opts: AddMenuOptions): Menu;
    }
}

interface MenubarOptions extends WidgetOptions {
    buttons: DropdownConfig;
    buttonClass?: string | string[];
    buttonTag?: string;
    menuClass?: string | string[];
    menuTag?: string;
    minWidth?: number;
    prefix?: string;
    separator?: string;
}
declare class Menubar extends Widget {
    static default: {
        buttonClass: string;
        buttonTag: string;
        menuClass: string;
        menuTag: string;
        prefix: string;
        separator: string;
    };
    _config: DropdownConfig;
    _buttons: MenubarButton[];
    _selectedIndex: number;
    constructor(layer: WidgetLayer, opts: MenubarOptions);
    get selectedIndex(): number;
    set selectedIndex(v: number);
    get selectedButton(): Widget;
    focus(reverse?: boolean): boolean;
    blur(reverse?: boolean): boolean;
    collapse(): boolean;
    keypress(e: Event$1): boolean;
    mousemove(e: Event$1): boolean;
    _initButtons(opts: MenubarOptions): void;
    _buttonClick(_action: string, button: Widget | null): boolean;
}
interface MenubarButtonOptions extends WidgetOptions {
    text: string;
    buttons: ButtonConfig;
}
declare class MenubarButton extends Text {
    menu: Menu | null;
    constructor(layer: WidgetLayer, opts: MenubarButtonOptions);
    collapse(): boolean;
    expand(): this;
    _setMenuPos(xy: XY, opts: MenubarButtonOptions): void;
    _initMenu(opts: MenubarButtonOptions): Menu | null;
}
declare type AddMenubarOptions = MenubarOptions & SetParentOptions & {
    parent?: Widget;
};
declare module './layer' {
    interface WidgetLayer {
        menubar(opts?: AddMenubarOptions): Menubar;
    }
}
declare class MenuViewer extends Widget {
    menubar: Menubar;
    mainMenu: Menu;
    constructor(menubar: Menubar, buttons: DropdownConfig);
    contains(): boolean;
    finish(): void;
    _initMenu(buttons: DropdownConfig): Menu;
    keypress(e: Event$1): boolean;
}

interface SelectOptions extends WidgetOptions {
    text: string;
    buttons: DropdownConfig;
    buttonClass?: string;
    buttonTag?: string;
}
declare class Select extends Widget {
    dropdown: Text;
    menu: Menu;
    constructor(layer: WidgetLayer, opts: SelectOptions);
    _initText(opts: SelectOptions): void;
    _initMenu(opts: SelectOptions): void;
}
declare type AddSelectOptions = SelectOptions & SetParentOptions & {
    parent?: Widget;
};
declare module './layer' {
    interface WidgetLayer {
        select(opts: AddSelectOptions): Select;
    }
}

declare type NextType = string | null;
interface PromptChoice {
    info?: string | Template;
    next?: string;
    value?: any;
}
interface PromptOptions {
    field?: string;
    next?: string;
    id?: string;
}
declare class Prompt {
    _id: string | null;
    _field: string;
    _prompt: string | Template;
    _choices: string[];
    _infos: (string | Template)[];
    _next: NextType[];
    _values: any[];
    _defaultNext: NextType;
    selection: number;
    constructor(question: string | Template, field?: string | PromptOptions);
    reset(): void;
    field(): string;
    field(v: string): this;
    id(): string | null;
    id(v: string | null): this;
    prompt(arg?: any): string;
    next(): string | null;
    next(v: string | null): this;
    choices(): string[];
    choices(choices: Record<string, string | PromptChoice>): this;
    choices(choices: string[], infos?: (string | PromptChoice)[]): this;
    choice(choice: string, info?: string | PromptChoice): this;
    info(arg?: any): string;
    choose(n: number): this;
    value(): any;
    updateResult(res: any): this;
}
interface ChoiceOptions extends WidgetOptions {
    width: number;
    height: number;
    choiceWidth: number;
    border?: BorderType;
    promptTag?: string;
    promptClass?: string;
    choiceTag?: string;
    choiceClass?: string;
    infoTag?: string;
    infoClass?: string;
    prompt?: Prompt;
}
declare class Choice extends Widget {
    static default: {
        tag: string;
        border: string;
        promptTag: string;
        promptClass: string;
        choiceTag: string;
        choiceClass: string;
        infoTag: string;
        infoClass: string;
    };
    choiceWidth: number;
    prompt: Widget;
    list: DataList;
    info: Text;
    _prompt: Prompt | null;
    _done: null | ((v: any) => void);
    constructor(layer: WidgetLayer, opts: ChoiceOptions);
    showPrompt(prompt: Prompt, arg?: any): Promise<any>;
    _addList(): this;
    _addInfo(): this;
    _addLegend(): this;
    _draw(buffer: Buffer$1): boolean;
}
declare type AddChoiceOptions = ChoiceOptions & SetParentOptions & {
    parent?: Widget;
};
declare module './layer' {
    interface WidgetLayer {
        choice(opts?: AddChoiceOptions): Choice;
    }
}
declare class Inquiry {
    widget: Choice;
    _prompts: Prompt[];
    events: Record<string, EventCb$1[]>;
    _result: any;
    _stack: Prompt[];
    _current: Prompt | null;
    constructor(widget: Choice);
    prompts(v: Prompt[] | Prompt, ...args: Prompt[]): this;
    _finish(): void;
    _cancel(): void;
    start(): void;
    back(): void;
    restart(): void;
    quit(): void;
    _keypress(_n: string, _w: Widget | null, e: Event$1): boolean;
    _change(_n: string, _w: Widget | null, p: Prompt): boolean;
    on(event: string, cb: EventCb$1): this;
    off(event: string, cb?: EventCb$1): this;
    _fireEvent(name: string, source: Widget | null, args?: any): boolean;
}

type index_d_WidgetOptions = WidgetOptions;
type index_d_SetParentOptions = SetParentOptions;
type index_d_Widget = Widget;
declare const index_d_Widget: typeof Widget;
type index_d_WidgetLayerOptions = WidgetLayerOptions;
type index_d_WidgetLayer = WidgetLayer;
declare const index_d_WidgetLayer: typeof WidgetLayer;
type index_d_Body = Body;
declare const index_d_Body: typeof Body;
type index_d_TextOptions = TextOptions;
type index_d_Text = Text;
declare const index_d_Text: typeof Text;
type index_d_AddTextOptions = AddTextOptions;
type index_d_BorderOptions = BorderOptions;
type index_d_Border = Border;
declare const index_d_Border: typeof Border;
type index_d_AddBorderOptions = AddBorderOptions;
declare const index_d_drawBorder: typeof drawBorder;
type index_d_ButtonOptions = ButtonOptions;
type index_d_Button = Button;
declare const index_d_Button: typeof Button;
type index_d_AddButtonOptions = AddButtonOptions;
type index_d_PadInfo = PadInfo;
type index_d_DialogOptions = DialogOptions;
declare const index_d_toPadArray: typeof toPadArray;
type index_d_Dialog = Dialog;
declare const index_d_Dialog: typeof Dialog;
type index_d_AddDialogOptions = AddDialogOptions;
type index_d_FieldsetOptions = FieldsetOptions;
type index_d_Fieldset = Fieldset;
declare const index_d_Fieldset: typeof Fieldset;
type index_d_AddFieldsetOptions = AddFieldsetOptions;
type index_d_FieldOptions = FieldOptions;
type index_d_Field = Field;
declare const index_d_Field: typeof Field;
type index_d_OrderedListOptions = OrderedListOptions;
type index_d_OrderedList = OrderedList;
declare const index_d_OrderedList: typeof OrderedList;
type index_d_UnorderedListOptions = UnorderedListOptions;
type index_d_UnorderedList = UnorderedList;
declare const index_d_UnorderedList: typeof UnorderedList;
type index_d_AddOrderedListOptions = AddOrderedListOptions;
type index_d_AddUnorderedListOptions = AddUnorderedListOptions;
type index_d_InputOptions = InputOptions;
type index_d_Input = Input;
declare const index_d_Input: typeof Input;
type index_d_AddInputOptions = AddInputOptions;
type index_d_FormatFn = FormatFn;
type index_d_Value = Value;
type index_d_SelectType = SelectType;
type index_d_HoverType = HoverType;
type index_d_DataObject = DataObject;
type index_d_DataItem = DataItem;
type index_d_DataType = DataType;
type index_d_BorderType = BorderType;
type index_d_ColumnOptions = ColumnOptions;
type index_d_DataTableOptions = DataTableOptions;
type index_d_Column = Column;
declare const index_d_Column: typeof Column;
type index_d_DataTable = DataTable;
declare const index_d_DataTable: typeof DataTable;
type index_d_TD = TD;
declare const index_d_TD: typeof TD;
type index_d_AddDataTableOptions = AddDataTableOptions;
type index_d_DataListOptions = DataListOptions;
type index_d_DataList = DataList;
declare const index_d_DataList: typeof DataList;
type index_d_AddDataListOptions = AddDataListOptions;
type index_d_Rec<_0> = Rec<_0>;
type index_d_DropdownConfig = DropdownConfig;
type index_d_ActionConfig = ActionConfig;
type index_d_ButtonConfig = ButtonConfig;
type index_d_MenuOptions = MenuOptions;
type index_d_Menu = Menu;
declare const index_d_Menu: typeof Menu;
type index_d_MenuButtonOptions = MenuButtonOptions;
type index_d_MenuButton = MenuButton;
declare const index_d_MenuButton: typeof MenuButton;
type index_d_AddMenuOptions = AddMenuOptions;
type index_d_MenubarOptions = MenubarOptions;
type index_d_Menubar = Menubar;
declare const index_d_Menubar: typeof Menubar;
type index_d_MenubarButtonOptions = MenubarButtonOptions;
type index_d_MenubarButton = MenubarButton;
declare const index_d_MenubarButton: typeof MenubarButton;
type index_d_AddMenubarOptions = AddMenubarOptions;
type index_d_MenuViewer = MenuViewer;
declare const index_d_MenuViewer: typeof MenuViewer;
type index_d_SelectOptions = SelectOptions;
type index_d_Select = Select;
declare const index_d_Select: typeof Select;
type index_d_AddSelectOptions = AddSelectOptions;
type index_d_NextType = NextType;
type index_d_PromptChoice = PromptChoice;
type index_d_PromptOptions = PromptOptions;
type index_d_Prompt = Prompt;
declare const index_d_Prompt: typeof Prompt;
type index_d_ChoiceOptions = ChoiceOptions;
type index_d_Choice = Choice;
declare const index_d_Choice: typeof Choice;
type index_d_AddChoiceOptions = AddChoiceOptions;
type index_d_Inquiry = Inquiry;
declare const index_d_Inquiry: typeof Inquiry;
declare namespace index_d {
  export {
    EventCb$1 as EventCb,
    index_d_WidgetOptions as WidgetOptions,
    index_d_SetParentOptions as SetParentOptions,
    index_d_Widget as Widget,
    index_d_WidgetLayerOptions as WidgetLayerOptions,
    index_d_WidgetLayer as WidgetLayer,
    index_d_Body as Body,
    index_d_TextOptions as TextOptions,
    index_d_Text as Text,
    index_d_AddTextOptions as AddTextOptions,
    index_d_BorderOptions as BorderOptions,
    index_d_Border as Border,
    index_d_AddBorderOptions as AddBorderOptions,
    index_d_drawBorder as drawBorder,
    index_d_ButtonOptions as ButtonOptions,
    index_d_Button as Button,
    index_d_AddButtonOptions as AddButtonOptions,
    index_d_PadInfo as PadInfo,
    index_d_DialogOptions as DialogOptions,
    index_d_toPadArray as toPadArray,
    index_d_Dialog as Dialog,
    index_d_AddDialogOptions as AddDialogOptions,
    index_d_FieldsetOptions as FieldsetOptions,
    index_d_Fieldset as Fieldset,
    index_d_AddFieldsetOptions as AddFieldsetOptions,
    index_d_FieldOptions as FieldOptions,
    index_d_Field as Field,
    index_d_OrderedListOptions as OrderedListOptions,
    index_d_OrderedList as OrderedList,
    index_d_UnorderedListOptions as UnorderedListOptions,
    index_d_UnorderedList as UnorderedList,
    index_d_AddOrderedListOptions as AddOrderedListOptions,
    index_d_AddUnorderedListOptions as AddUnorderedListOptions,
    index_d_InputOptions as InputOptions,
    index_d_Input as Input,
    index_d_AddInputOptions as AddInputOptions,
    index_d_FormatFn as FormatFn,
    index_d_Value as Value,
    index_d_SelectType as SelectType,
    index_d_HoverType as HoverType,
    index_d_DataObject as DataObject,
    index_d_DataItem as DataItem,
    index_d_DataType as DataType,
    index_d_BorderType as BorderType,
    index_d_ColumnOptions as ColumnOptions,
    index_d_DataTableOptions as DataTableOptions,
    index_d_Column as Column,
    index_d_DataTable as DataTable,
    index_d_TD as TD,
    index_d_AddDataTableOptions as AddDataTableOptions,
    index_d_DataListOptions as DataListOptions,
    index_d_DataList as DataList,
    index_d_AddDataListOptions as AddDataListOptions,
    index_d_Rec as Rec,
    index_d_DropdownConfig as DropdownConfig,
    index_d_ActionConfig as ActionConfig,
    index_d_ButtonConfig as ButtonConfig,
    index_d_MenuOptions as MenuOptions,
    index_d_Menu as Menu,
    index_d_MenuButtonOptions as MenuButtonOptions,
    index_d_MenuButton as MenuButton,
    index_d_AddMenuOptions as AddMenuOptions,
    index_d_MenubarOptions as MenubarOptions,
    index_d_Menubar as Menubar,
    index_d_MenubarButtonOptions as MenubarButtonOptions,
    index_d_MenubarButton as MenubarButton,
    index_d_AddMenubarOptions as AddMenubarOptions,
    index_d_MenuViewer as MenuViewer,
    index_d_SelectOptions as SelectOptions,
    index_d_Select as Select,
    index_d_AddSelectOptions as AddSelectOptions,
    index_d_NextType as NextType,
    index_d_PromptChoice as PromptChoice,
    index_d_PromptOptions as PromptOptions,
    index_d_Prompt as Prompt,
    index_d_ChoiceOptions as ChoiceOptions,
    index_d_Choice as Choice,
    index_d_AddChoiceOptions as AddChoiceOptions,
    index_d_Inquiry as Inquiry,
  };
}

export { ERROR, FALSE, IDENTITY, IS_NONZERO, IS_ZERO, NOOP, ONE, TRUE, WARN, ZERO, arrayDelete, arrayFindRight, arrayIncludesAll, arrayInsert, arrayNext, arrayNullify, arrayPrev, arraysIntersect, blob_d as blob, buffer_d as buffer, index_d$4 as canvas, clamp, index_d$7 as color, colors, config$1 as config, cosmetic, data, events_d as events, first, flag_d as flag, index_d$5 as fov, frequency_d as frequency, grid_d as grid, io_d as io, lerp, index_d$2 as light, list_d as list, message_d as message, nextIndex, object_d as object, path_d as path, prevIndex, queue_d as queue, random, range_d as range, rng_d as rng, scheduler_d as scheduler, index_d$3 as sprite, sprites, sum, index_d$6 as text, tween_d as tween, types_d as types, index_d$1 as ui, index_d as widget, xy_d as xy };
