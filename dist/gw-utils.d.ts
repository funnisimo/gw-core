import * as lodash from 'lodash';

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
declare const clamp: {
    (number: number, lower: number, upper: number): number;
    (number: number, upper: number): number;
};
declare function lerp$1(from: number, to: number, pct: number): number;
declare function xave(rate: number, value: number, newValue: number): number;
declare function ERROR(message: string): void;
declare function WARN(...args: string[]): void;
declare function first(...args: any[]): any;
declare function arraysIntersect(a: any[], b: any[]): boolean;
declare function arrayIncludesAll(a: any[], b: any[]): boolean;
declare function arrayRevEach<T>(a: T[], fn: (v: T, i: number, a: T[]) => void): void;
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
declare type ColorBase = string | number | ColorData | Color | null;
declare type LightValue = [number, number, number];
declare const colors: Record<string, Color>;
declare class Color {
    _data: [number, number, number, number];
    _rand: [number, number, number, number] | null;
    dances: boolean;
    name?: string;
    constructor(r?: number, g?: number, b?: number, a?: number);
    rgb(): number[];
    rgba(): number[];
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
    toInt(useRand?: boolean): number;
    toLight(): LightValue;
    clamp(): Color;
    blend(other: ColorBase): Color;
    mix(other: ColorBase, percent: number): Color;
    apply(other: ColorBase): Color;
    lighten(percent: number): Color;
    darken(percent: number): Color;
    bake(clearDancing?: boolean): Color;
    add(other: ColorBase, percent?: number): Color;
    scale(percent: number): Color;
    multiply(other: ColorData | Color): Color;
    normalize(): Color;
    inverse(): Color;
    /**
     * Returns the css code for the current RGB values of the color.
     */
    css(useRand?: boolean): string;
    toString(): string;
}
declare function fromArray(vals: ColorData, base256?: boolean): Color;
declare function fromCss(css: string): Color;
declare function fromName(name: string): Color;
declare function fromNumber(val: number, base256?: boolean): Color;
declare function make$e(): Color;
declare function make$e(rgb: number, base256?: boolean): Color;
declare function make$e(color?: ColorBase | null): Color;
declare function make$e(arrayLike: ColorData, base256?: boolean): Color;
declare function make$e(...rgb: number[]): Color;
declare function from$4(): Color;
declare function from$4(rgb: number, base256?: boolean): Color;
declare function from$4(color?: ColorBase | null): Color;
declare function from$4(arrayLike: ColorData, base256?: boolean): Color;
declare function from$4(...rgb: number[]): Color;
declare function separate(a: Color, b: Color): [Color, Color];
declare function relativeLuminance(a: Color, b: Color): number;
declare function distance(a: Color, b: Color): number;
declare function smoothScalar(rgb: number, maxRgb?: number): number;
declare function install$2(name: string, info: ColorBase): Color;
declare function install$2(name: string, ...rgb: ColorData): Color;
declare function installSpread(name: string, info: ColorBase): Color;
declare function installSpread(name: string, ...rgb: ColorData): Color;
declare const NONE: Color;
declare const BLACK: Color;
declare const WHITE: Color;

type index_d$9_ColorData = ColorData;
type index_d$9_ColorBase = ColorBase;
type index_d$9_LightValue = LightValue;
declare const index_d$9_colors: typeof colors;
type index_d$9_Color = Color;
declare const index_d$9_Color: typeof Color;
declare const index_d$9_fromArray: typeof fromArray;
declare const index_d$9_fromCss: typeof fromCss;
declare const index_d$9_fromName: typeof fromName;
declare const index_d$9_fromNumber: typeof fromNumber;
declare const index_d$9_separate: typeof separate;
declare const index_d$9_relativeLuminance: typeof relativeLuminance;
declare const index_d$9_distance: typeof distance;
declare const index_d$9_smoothScalar: typeof smoothScalar;
declare const index_d$9_installSpread: typeof installSpread;
declare const index_d$9_NONE: typeof NONE;
declare const index_d$9_BLACK: typeof BLACK;
declare const index_d$9_WHITE: typeof WHITE;
declare namespace index_d$9 {
  export {
    index_d$9_ColorData as ColorData,
    index_d$9_ColorBase as ColorBase,
    index_d$9_LightValue as LightValue,
    index_d$9_colors as colors,
    index_d$9_Color as Color,
    index_d$9_fromArray as fromArray,
    index_d$9_fromCss as fromCss,
    index_d$9_fromName as fromName,
    index_d$9_fromNumber as fromNumber,
    make$e as make,
    from$4 as from,
    index_d$9_separate as separate,
    index_d$9_relativeLuminance as relativeLuminance,
    index_d$9_distance as distance,
    index_d$9_smoothScalar as smoothScalar,
    install$2 as install,
    index_d$9_installSpread as installSpread,
    index_d$9_NONE as NONE,
    index_d$9_BLACK as BLACK,
    index_d$9_WHITE as WHITE,
  };
}

declare type Loc$2 = [number, number];
interface XY {
    x: number;
    y: number;
}
interface Size {
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
type types_d_Size = Size;
type types_d_EachCb<T> = EachCb<T>;
type types_d_RandomFunction = RandomFunction;
type types_d_SeedFunction = SeedFunction;
type types_d_RandomConfig = RandomConfig;
type types_d_WeightedArray = WeightedArray;
type types_d_WeightedObject = WeightedObject;
declare namespace types_d {
  export {
    Loc$2 as Loc,
    types_d_XY as XY,
    types_d_Size as Size,
    SpriteData$1 as SpriteData,
    types_d_EachCb as EachCb,
    types_d_RandomFunction as RandomFunction,
    types_d_SeedFunction as SeedFunction,
    types_d_RandomConfig as RandomConfig,
    types_d_WeightedArray as WeightedArray,
    types_d_WeightedObject as WeightedObject,
  };
}

declare const DIRS: Loc$2[];
declare const NO_DIRECTION = -1;
declare const UP = 0;
declare const RIGHT = 1;
declare const DOWN = 2;
declare const LEFT = 3;
declare const RIGHT_UP = 4;
declare const RIGHT_DOWN = 5;
declare const LEFT_DOWN = 6;
declare const LEFT_UP = 7;
declare const CLOCK_DIRS: Loc$2[];
declare function isLoc(a: any): a is Loc$2;
declare function isXY(a: any): a is XY;
declare function x(src: XY | Loc$2): any;
declare function y(src: XY | Loc$2): any;
declare function contains(size: Size, x: number, y: number): boolean;
interface BoundsOpts {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}
declare class Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(bounds: BoundsOpts);
    constructor(x?: number, y?: number, w?: number, h?: number);
    get left(): number;
    set left(v: number);
    get right(): number;
    set right(v: number);
    get top(): number;
    set top(v: number);
    get bottom(): number;
    set bottom(v: number);
    get center(): number;
    set center(v: number);
    get middle(): number;
    set middle(v: number);
    clone(): Bounds;
    copy(other: Bounds): void;
    contains(x: number, y: number): boolean;
    contains(loc: Loc$2 | XY): boolean;
    include(xy: Loc$2 | XY | Bounds): void;
    pad(n?: number): void;
    forEach(cb: XYFunc): void;
    toString(): string;
}
declare function copy(dest: XY, src: XY | Loc$2): void;
declare function addTo(dest: XY, src: XY | Loc$2): void;
declare function add(a: XY, b: XY | Loc$2): XY;
declare function add(a: Loc$2, b: XY | Loc$2): Loc$2;
declare function equals(dest: XY | Loc$2 | null | undefined, src: XY | Loc$2 | null | undefined): boolean;
declare function isDiagonal(xy: XY | Loc$2): boolean;
declare function lerp(a: XY | Loc$2, b: XY | Loc$2, pct: number): any[];
declare type XYFunc = (x: number, y: number) => void;
declare type NeighborFunc = (x: number, y: number, dir: Loc$2) => void;
declare function eachNeighbor(x: number, y: number, fn: NeighborFunc, only4dirs?: boolean): void;
declare function eachNeighborAsync(x: number, y: number, fn: NeighborFunc, only4dirs?: boolean): Promise<void>;
declare type XYMatchFunc = (x: number, y: number) => boolean;
declare type NeighborMatchFunc = (x: number, y: number, dir: Loc$2) => boolean;
declare function matchingNeighbor(x: number, y: number, matchFn: NeighborMatchFunc, only4dirs?: boolean): Loc$2;
declare function straightDistanceBetween(x1: number, y1: number, x2: number, y2: number): number;
declare function maxAxisFromTo(a: XY | Loc$2, b: XY | Loc$2): number;
declare function maxAxisBetween(x1: number, y1: number, x2: number, y2: number): number;
declare function distanceBetween(x1: number, y1: number, x2: number, y2: number): number;
declare function distanceFromTo(a: XY | Loc$2, b: XY | Loc$2): number;
declare function calcRadius(x: number, y: number): number;
declare function dirBetween(x: number, y: number, toX: number, toY: number): Loc$2;
declare function dirFromTo(a: XY | Loc$2, b: XY | Loc$2): Loc$2;
declare function dirIndex(dir: XY | Loc$2): number;
declare function isOppositeDir(a: Loc$2, b: Loc$2): boolean;
declare function isSameDir(a: Loc$2, b: Loc$2): boolean;
declare function dirSpread(dir: Loc$2): [Loc$2, Loc$2, Loc$2];
declare function stepFromTo(a: XY | Loc$2, b: XY | Loc$2, fn: (x: number, y: number) => any): void;
declare function forLine(x: number, y: number, dir: Loc$2, length: number, fn: (x: number, y: number) => any): void;
declare function forLineBetween(fromX: number, fromY: number, toX: number, toY: number, stepFn: (x: number, y: number) => boolean | void): boolean;
declare function forLineFromTo(a: XY | Loc$2, b: XY | Loc$2, stepFn: (x: number, y: number) => boolean | void): boolean;
declare function getLine(fromX: number, fromY: number, toX: number, toY: number): Loc$2[];
declare function getLineThru(fromX: number, fromY: number, toX: number, toY: number, width: number, height: number): Loc$2[];
declare function forCircle(x: number, y: number, radius: number, fn: XYFunc): void;
declare function forRect(width: number, height: number, fn: XYFunc): void;
declare function forRect(x: number, y: number, width: number, height: number, fn: XYFunc): void;
declare function forBorder(width: number, height: number, fn: XYFunc): void;
declare function forBorder(x: number, y: number, width: number, height: number, fn: XYFunc): void;
declare function arcCount(x: number, y: number, testFn: XYMatchFunc): number;
declare function closestMatchingLocs(x: number, y: number, matchFn: XYMatchFunc): Loc$2[] | null;

type xy_d_XY = XY;
type xy_d_Size = Size;
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
type xy_d_BoundsOpts = BoundsOpts;
type xy_d_Bounds = Bounds;
declare const xy_d_Bounds: typeof Bounds;
declare const xy_d_copy: typeof copy;
declare const xy_d_addTo: typeof addTo;
declare const xy_d_add: typeof add;
declare const xy_d_equals: typeof equals;
declare const xy_d_isDiagonal: typeof isDiagonal;
declare const xy_d_lerp: typeof lerp;
type xy_d_XYFunc = XYFunc;
type xy_d_NeighborFunc = NeighborFunc;
declare const xy_d_eachNeighbor: typeof eachNeighbor;
declare const xy_d_eachNeighborAsync: typeof eachNeighborAsync;
type xy_d_XYMatchFunc = XYMatchFunc;
type xy_d_NeighborMatchFunc = NeighborMatchFunc;
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
declare const xy_d_closestMatchingLocs: typeof closestMatchingLocs;
declare namespace xy_d {
  export {
    Loc$2 as Loc,
    xy_d_XY as XY,
    xy_d_Size as Size,
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
    xy_d_BoundsOpts as BoundsOpts,
    xy_d_Bounds as Bounds,
    xy_d_copy as copy,
    xy_d_addTo as addTo,
    xy_d_add as add,
    xy_d_equals as equals,
    xy_d_isDiagonal as isDiagonal,
    xy_d_lerp as lerp,
    xy_d_XYFunc as XYFunc,
    xy_d_NeighborFunc as NeighborFunc,
    xy_d_eachNeighbor as eachNeighbor,
    xy_d_eachNeighborAsync as eachNeighborAsync,
    xy_d_XYMatchFunc as XYMatchFunc,
    xy_d_NeighborMatchFunc as NeighborMatchFunc,
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
    xy_d_closestMatchingLocs as closestMatchingLocs,
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

type list_d_ListEntry<T> = ListEntry<T>;
type list_d_ListItem<T> = ListItem<T>;
type list_d_ListObject = ListObject;
type list_d_ListSort<T> = ListSort<T>;
type list_d_ListMatch<T> = ListMatch<T>;
type list_d_ListEachFn<T> = ListEachFn<T>;
type list_d_ListReduceFn<T> = ListReduceFn<T>;
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

declare const getValue: {
    <TObject extends object, TKey extends keyof TObject>(object: TObject, path: TKey | [TKey]): TObject[TKey];
    <TObject_1 extends object, TKey_1 extends keyof TObject_1>(object: TObject_1 | null | undefined, path: TKey_1 | [TKey_1]): TObject_1[TKey_1] | undefined;
    <TObject_2 extends object, TKey_2 extends keyof TObject_2, TDefault>(object: TObject_2 | null | undefined, path: TKey_2 | [TKey_2], defaultValue: TDefault): TDefault | Exclude<TObject_2[TKey_2], undefined>;
    <TObject_3 extends object, TKey1 extends keyof TObject_3, TKey2 extends keyof TObject_3[TKey1]>(object: TObject_3, path: [TKey1, TKey2]): TObject_3[TKey1][TKey2];
    <TObject_4 extends object, TKey1_1 extends keyof TObject_4, TKey2_1 extends keyof TObject_4[TKey1_1]>(object: TObject_4 | null | undefined, path: [TKey1_1, TKey2_1]): TObject_4[TKey1_1][TKey2_1] | undefined;
    <TObject_5 extends object, TKey1_2 extends keyof TObject_5, TKey2_2 extends keyof TObject_5[TKey1_2], TDefault_1>(object: TObject_5 | null | undefined, path: [TKey1_2, TKey2_2], defaultValue: TDefault_1): TDefault_1 | Exclude<TObject_5[TKey1_2][TKey2_2], undefined>;
    <TObject_6 extends object, TKey1_3 extends keyof TObject_6, TKey2_3 extends keyof TObject_6[TKey1_3], TKey3 extends keyof TObject_6[TKey1_3][TKey2_3]>(object: TObject_6, path: [TKey1_3, TKey2_3, TKey3]): TObject_6[TKey1_3][TKey2_3][TKey3];
    <TObject_7 extends object, TKey1_4 extends keyof TObject_7, TKey2_4 extends keyof TObject_7[TKey1_4], TKey3_1 extends keyof TObject_7[TKey1_4][TKey2_4]>(object: TObject_7 | null | undefined, path: [TKey1_4, TKey2_4, TKey3_1]): TObject_7[TKey1_4][TKey2_4][TKey3_1] | undefined;
    <TObject_8 extends object, TKey1_5 extends keyof TObject_8, TKey2_5 extends keyof TObject_8[TKey1_5], TKey3_2 extends keyof TObject_8[TKey1_5][TKey2_5], TDefault_2>(object: TObject_8 | null | undefined, path: [TKey1_5, TKey2_5, TKey3_2], defaultValue: TDefault_2): TDefault_2 | Exclude<TObject_8[TKey1_5][TKey2_5][TKey3_2], undefined>;
    <TObject_9 extends object, TKey1_6 extends keyof TObject_9, TKey2_6 extends keyof TObject_9[TKey1_6], TKey3_3 extends keyof TObject_9[TKey1_6][TKey2_6], TKey4 extends keyof TObject_9[TKey1_6][TKey2_6][TKey3_3]>(object: TObject_9, path: [TKey1_6, TKey2_6, TKey3_3, TKey4]): TObject_9[TKey1_6][TKey2_6][TKey3_3][TKey4];
    <TObject_10 extends object, TKey1_7 extends keyof TObject_10, TKey2_7 extends keyof TObject_10[TKey1_7], TKey3_4 extends keyof TObject_10[TKey1_7][TKey2_7], TKey4_1 extends keyof TObject_10[TKey1_7][TKey2_7][TKey3_4]>(object: TObject_10 | null | undefined, path: [TKey1_7, TKey2_7, TKey3_4, TKey4_1]): TObject_10[TKey1_7][TKey2_7][TKey3_4][TKey4_1] | undefined;
    <TObject_11 extends object, TKey1_8 extends keyof TObject_11, TKey2_8 extends keyof TObject_11[TKey1_8], TKey3_5 extends keyof TObject_11[TKey1_8][TKey2_8], TKey4_2 extends keyof TObject_11[TKey1_8][TKey2_8][TKey3_5], TDefault_3>(object: TObject_11 | null | undefined, path: [TKey1_8, TKey2_8, TKey3_5, TKey4_2], defaultValue: TDefault_3): TDefault_3 | Exclude<TObject_11[TKey1_8][TKey2_8][TKey3_5][TKey4_2], undefined>;
    <T>(object: lodash.NumericDictionary<T>, path: number): T;
    <T_1>(object: lodash.NumericDictionary<T_1> | null | undefined, path: number): T_1 | undefined;
    <T_2, TDefault_4>(object: lodash.NumericDictionary<T_2> | null | undefined, path: number, defaultValue: TDefault_4): T_2 | TDefault_4;
    <TDefault_5>(object: null | undefined, path: lodash.PropertyPath, defaultValue: TDefault_5): TDefault_5;
    (object: null | undefined, path: lodash.PropertyPath): undefined;
    (object: any, path: lodash.PropertyPath, defaultValue?: any): any;
};
declare type AnyObj$1 = Record<string, any>;
declare function copyObject(dest: AnyObj$1, src: AnyObj$1): AnyObj$1;
declare function assignObject(dest: AnyObj$1, src: AnyObj$1): AnyObj$1;
declare function assignOmitting(omit: string | string[], dest: AnyObj$1, src: AnyObj$1): AnyObj$1;
declare function setDefault(obj: AnyObj$1, field: string, val: any): void;
declare type AssignCallback = (dest: AnyObj$1, key: string, current: any, def: any) => boolean;
declare function setDefaults(obj: AnyObj$1, def: AnyObj$1 | null | undefined, custom?: AssignCallback | null): void;
declare function setOptions(obj: AnyObj$1, opts: AnyObj$1 | null | undefined): void;
declare function kindDefaults(obj: AnyObj$1, def: AnyObj$1 | null | undefined): void;
declare function pick(obj: AnyObj$1, ...fields: string[]): any;
declare function clearObject(obj: AnyObj$1): void;
declare function getOpt(obj: AnyObj$1, member: string, _default: any): any;
declare function firstOpt(field: string, ...args: any[]): any;

declare const object_d_getValue: typeof getValue;
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
    object_d_getValue as getValue,
    AnyObj$1 as AnyObj,
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
    matchingLoc(width: number, height: number, matchFn: XYMatchFunc): Loc$2;
    matchingLocNear(x: number, y: number, matchFn: XYMatchFunc): Loc$2;
}
declare const random: Random;
declare const cosmetic: Random;
declare function make$d(seed?: number): Random;

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
    make$d as make,
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
declare function make$c(config: RangeBase | null): Range;
declare const from$3: typeof make$c;
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
    make$c as make,
    from$3 as from,
    range_d_asFn as asFn,
    range_d_value as value,
  };
}

declare type TagBase = string | string[];
declare type Tags = string[];
declare type TagMatchFn = (tags: Tags) => boolean;
interface TagMatchOptions {
    tags: string | string[];
    forbidTags?: string | string[];
}
declare function make$b(base: TagBase): Tags;
declare function makeMatch(rules: string | TagMatchOptions): TagMatchFn;
declare function match(tags: Tags, matchRules: string): boolean;

type tags_d_TagBase = TagBase;
type tags_d_Tags = Tags;
type tags_d_TagMatchFn = TagMatchFn;
type tags_d_TagMatchOptions = TagMatchOptions;
declare const tags_d_makeMatch: typeof makeMatch;
declare const tags_d_match: typeof match;
declare namespace tags_d {
  export {
    tags_d_TagBase as TagBase,
    tags_d_Tags as Tags,
    tags_d_TagMatchFn as TagMatchFn,
    tags_d_TagMatchOptions as TagMatchOptions,
    make$b as make,
    tags_d_makeMatch as makeMatch,
    tags_d_match as match,
  };
}

declare type FlagSource = number | string;
declare type FlagBase = FlagSource | FlagSource[] | null;
declare function fl(N: number): number;
declare function toString<T>(flagObj: T, value: number): string;
declare function from$2<T>(obj: T, ...args: (FlagBase | undefined)[]): number;
declare function make$a(obj: Record<string, FlagBase> | string[]): Record<string, number>;

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

declare type Loc$1 = Loc$2;
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
    copy(from: Grid<T>): void;
    count(match: GridMatch<T> | T): number;
    /**
     * Finds the first matching value/result and returns that location as an xy.Loc
     * @param v - The fill value or a function that returns the fill value.
     * @returns xy.Loc | null - The location of the first cell matching the criteria or null if not found.
     */
     // @ts-ignore

    find(match: GridMatch<T> | T): Loc$2 | null;
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
    closestMatchingLoc(x: number, y: number, v: T | GridMatch<T>): Loc$1;
    firstMatchingLoc(v: T | GridMatch<T>): Loc$1;
    randomMatchingLoc(v: T | GridMatch<T>): Loc$1;
    matchingLocNear(x: number, y: number, v: T | GridMatch<T>): Loc$1;
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
    protected _resize(width: number, height: number, v: GridInit<number> | number): void;
    findReplaceRange(findValueMin: number, findValueMax: number, fillValue: number): void;
    floodFillRange(x: number, y: number, eligibleValueMin: number, eligibleValueMax: number, fillValue: number): number;
    invert(): void;
    leastPositiveValue(): number;
    randomLeastPositiveLoc(): Loc$1;
    valueBounds(value: number, bounds?: Bounds): Bounds;
    floodFill(x: number, y: number, matchValue: number | GridMatch<number>, fillValue: number | GridUpdate<number>): number;
}
declare const alloc$1: typeof NumGrid.alloc;
declare const free$1: typeof NumGrid.free;
declare function make$9<T>(w: number, h: number, v?: number | GridInit<number>): NumGrid;
declare function make$9<T>(w: number, h: number, v?: T | GridInit<T>): Grid<T>;
declare type GridZip<T, U> = (destVal: T, sourceVal: U, destX: number, destY: number, sourceX: number, sourceY: number, destGrid: Grid<T>, sourceGrid: Grid<U>) => void;
declare function offsetZip<T, U>(destGrid: Grid<T>, srcGrid: Grid<U>, srcToDestX: number, srcToDestY: number, value: T | GridZip<T, U>): void;
declare function intersection(onto: NumGrid, a: NumGrid, b?: NumGrid): void;
declare function unite(onto: NumGrid, a: NumGrid, b?: NumGrid): void;

type grid_d_ArrayInit<T> = ArrayInit<T>;
declare const grid_d_makeArray: typeof makeArray;
type grid_d_GridInit<T> = GridInit<T>;
type grid_d_GridEach<T> = GridEach<T>;
type grid_d_AsyncGridEach<T> = AsyncGridEach<T>;
type grid_d_GridUpdate<T> = GridUpdate<T>;
type grid_d_GridMatch<T> = GridMatch<T>;
type grid_d_GridFormat<T> = GridFormat<T>;
type grid_d_Grid<T> = Grid<T>;
declare const grid_d_Grid: typeof Grid;
declare const grid_d_stats: typeof stats;
type grid_d_NumGrid = NumGrid;
declare const grid_d_NumGrid: typeof NumGrid;
type grid_d_GridZip<T, U> = GridZip<T, U>;
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
    alloc$1 as alloc,
    free$1 as free,
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
    clear(): void;
    get last(): T | undefined;
    get first(): T | undefined;
    enqueue(obj: T): void;
    prepend(obj: T): void;
    dequeue(): Promise<T>;
}

type queue_d_AsyncQueue<T> = AsyncQueue<T>;
declare const queue_d_AsyncQueue: typeof AsyncQueue;
declare namespace queue_d {
  export {
    queue_d_AsyncQueue as AsyncQueue,
  };
}

interface DrawInfo {
    ch?: string | null;
    fg?: ColorBase;
    bg?: ColorBase;
}
declare class Mixer implements DrawInfo {
    ch: string | null;
    fg: Color;
    bg: Color;
    constructor(base?: DrawInfo);
    protected _changed(): this;
    copy(other: DrawInfo): this;
    fill(ch: string | null, fg: ColorBase, bg: ColorBase): this;
    clone(): Mixer;
    equals(other: Mixer): boolean;
    get dances(): boolean;
    nullify(): this;
    blackOut(): this;
    draw(ch?: string | null, fg?: ColorBase, bg?: ColorBase): this;
    drawSprite(src: SpriteData$1 | Mixer): this;
    invert(): this;
    swap(): this;
    multiply(color: ColorBase, fg?: boolean, bg?: boolean): this;
    scale(multiplier: number, fg?: boolean, bg?: boolean): this;
    mix(color: ColorBase, fg?: number, bg?: number): this;
    add(color: ColorBase, fg?: number, bg?: number): this;
    separate(): this;
    bake(clearDancing?: boolean): this;
    toString(): string;
}
declare function makeMixer(base?: Partial<DrawInfo>): Mixer;

declare var options: {
    colorStart: string;
    colorEnd: string;
    field: string;
    fieldEnd: string;
    defaultFg: null;
    defaultBg: null;
};
declare type Align = 'left' | 'center' | 'right';
declare type VAlign = 'top' | 'middle' | 'bottom';
declare type View = Record<string, any>;
interface HelperObj {
    get: (view: View, pattern: string) => any;
}
declare type HelperFn = (this: HelperObj, name: string, data: View, args: string[]) => string;
declare function addHelper(name: string, fn: HelperFn): void;

declare type Template = (view: View | string) => string;
interface CompileOptions {
    field?: string;
    fieldEnd?: string;
    debug?: boolean;
}
declare function compile$1(template: string, opts?: CompileOptions): Template;
declare function apply(template: string, view?: View | string): string;

interface Colors {
    fg: ColorBase | null;
    bg: ColorBase | null;
}
declare type ColorFunction = (colors: Colors) => void;
declare type EachFn$1 = (ch: string, fg: any, bg: any, i: number, n: number) => void;
interface EachOptions {
    fg?: ColorBase;
    bg?: ColorBase;
    eachColor?: ColorFunction;
}
declare function eachChar(text: string, fn: EachFn$1, opts?: EachOptions): void;

declare function length(text: string): number;
declare function advanceChars(text: string, start: number, count: number): number;
declare function findChar(text: string, matchFn: (ch: string, index: number) => boolean, start?: number): number;
declare function firstChar(text: string): string;
declare function startsWith(text: string, match: string | RegExp): boolean;
declare function padStart(text: string, width: number, pad?: string): string;
declare function padEnd(text: string, width: number, pad?: string): string;
declare function center(text: string, width: number, pad?: string): string;
declare function truncate(text: string, width: number): string;
declare function capitalize(text: string): string;
declare function removeColors(text: string): string;
declare function spliceRaw(msg: string, begin: number, deleteLength: number, add?: string): string;
declare function hash(str: string): number;
declare function splitArgs(text: string): string[];

interface WrapOptions {
    hyphenate?: number | boolean;
    indent?: number;
}
declare function wordWrap(text: string, lineWidth: number, opts?: WrapOptions): string;
declare function splitIntoLines(text: string, width?: number, opts?: WrapOptions): string[];

declare function toSingularVerb(text: string): string;
declare function toPluralVerb(text: string): string;
declare function toSingularNoun(text: string): string;
declare function toPluralNoun(text: string): string;
declare function toQuantity(text: string, count: number): string;

interface Options$1 {
    fg?: any;
    bg?: any;
    colorStart?: string;
    colorEnd?: string;
    field?: string;
}
declare function configure(opts?: Options$1): void;

declare const index_d$8_configure: typeof configure;
declare const index_d$8_apply: typeof apply;
type index_d$8_Template = Template;
type index_d$8_CompileOptions = CompileOptions;
declare const index_d$8_eachChar: typeof eachChar;
type index_d$8_EachOptions = EachOptions;
declare const index_d$8_wordWrap: typeof wordWrap;
declare const index_d$8_splitIntoLines: typeof splitIntoLines;
declare const index_d$8_addHelper: typeof addHelper;
declare const index_d$8_options: typeof options;
type index_d$8_Align = Align;
type index_d$8_VAlign = VAlign;
type index_d$8_View = View;
type index_d$8_HelperFn = HelperFn;
type index_d$8_HelperObj = HelperObj;
declare const index_d$8_length: typeof length;
declare const index_d$8_advanceChars: typeof advanceChars;
declare const index_d$8_findChar: typeof findChar;
declare const index_d$8_firstChar: typeof firstChar;
declare const index_d$8_startsWith: typeof startsWith;
declare const index_d$8_padStart: typeof padStart;
declare const index_d$8_padEnd: typeof padEnd;
declare const index_d$8_center: typeof center;
declare const index_d$8_truncate: typeof truncate;
declare const index_d$8_capitalize: typeof capitalize;
declare const index_d$8_removeColors: typeof removeColors;
declare const index_d$8_spliceRaw: typeof spliceRaw;
declare const index_d$8_hash: typeof hash;
declare const index_d$8_splitArgs: typeof splitArgs;
declare const index_d$8_toSingularVerb: typeof toSingularVerb;
declare const index_d$8_toPluralVerb: typeof toPluralVerb;
declare const index_d$8_toSingularNoun: typeof toSingularNoun;
declare const index_d$8_toPluralNoun: typeof toPluralNoun;
declare const index_d$8_toQuantity: typeof toQuantity;
declare namespace index_d$8 {
  export {
    index_d$8_configure as configure,
    compile$1 as compile,
    index_d$8_apply as apply,
    index_d$8_Template as Template,
    index_d$8_CompileOptions as CompileOptions,
    index_d$8_eachChar as eachChar,
    index_d$8_EachOptions as EachOptions,
    index_d$8_wordWrap as wordWrap,
    index_d$8_splitIntoLines as splitIntoLines,
    index_d$8_addHelper as addHelper,
    index_d$8_options as options,
    index_d$8_Align as Align,
    index_d$8_VAlign as VAlign,
    index_d$8_View as View,
    index_d$8_HelperFn as HelperFn,
    index_d$8_HelperObj as HelperObj,
    index_d$8_length as length,
    index_d$8_advanceChars as advanceChars,
    index_d$8_findChar as findChar,
    index_d$8_firstChar as firstChar,
    index_d$8_startsWith as startsWith,
    index_d$8_padStart as padStart,
    index_d$8_padEnd as padEnd,
    index_d$8_center as center,
    index_d$8_truncate as truncate,
    index_d$8_capitalize as capitalize,
    index_d$8_removeColors as removeColors,
    index_d$8_spliceRaw as spliceRaw,
    index_d$8_hash as hash,
    index_d$8_splitArgs as splitArgs,
    index_d$8_toSingularVerb as toSingularVerb,
    index_d$8_toPluralVerb as toPluralVerb,
    index_d$8_toSingularNoun as toSingularNoun,
    index_d$8_toPluralNoun as toPluralNoun,
    index_d$8_toQuantity as toQuantity,
  };
}

interface DrawData {
    glyph: number;
    fg: number;
    bg: number;
}
declare abstract class BufferBase {
    _width: number;
    _height: number;
    _clip: Bounds | null;
    constructor(opts: {
        width: number;
        height: number;
    });
    constructor(width: number, height: number);
    get width(): number;
    get height(): number;
    hasXY(x: number, y: number): boolean;
    abstract get(x: number, y: number): DrawInfo;
    abstract draw(x: number, y: number, glyph?: string | null, fg?: ColorBase, // TODO - White?
    bg?: ColorBase): this;
    abstract set(x: number, y: number, glyph?: string | null, fg?: ColorBase, // TODO - White?
    bg?: ColorBase): this;
    abstract nullify(x: number, y: number): void;
    abstract nullify(): void;
    abstract dump(): void;
    drawSprite(x: number, y: number, sprite: Partial<DrawInfo>): this;
    blackOut(x: number, y: number): void;
    blackOut(): void;
    fill(color: ColorBase): this;
    fill(glyph?: string | null, fg?: ColorBase, bg?: ColorBase): this;
    drawText(x: number, y: number, text: string, fg?: ColorBase, bg?: ColorBase, maxWidth?: number, align?: Align): number;
    wrapText(x: number, y: number, width: number, text: string, fg?: ColorBase, bg?: ColorBase, indent?: number): number;
    fillBounds(bounds: Bounds, ch?: string | null, fg?: ColorBase, bg?: ColorBase): this;
    fillRect(x: number, y: number, w: number, h: number, ch?: string | null, fg?: ColorBase, bg?: ColorBase): this;
    blackOutBounds(bounds: Bounds, bg?: ColorBase): this;
    blackOutRect(x: number, y: number, w: number, h: number, bg?: ColorBase): this;
    highlight(x: number, y: number, color: ColorBase, strength: number): this;
    mix(color: ColorBase, percent: number): this;
    mix(color: ColorBase, percent: number, x: number, y: number): this;
    mix(color: ColorBase, percent: number, x: number, y: number, width: number, height: number): this;
    blend(color: ColorBase): this;
    blend(color: ColorBase, x: number, y: number): this;
    blend(color: ColorBase, x: number, y: number, width: number, height: number): this;
    setClip(bounds: Bounds): this;
    setClip(x: number, y: number, width: number, height: number): this;
    clearClip(): this;
}
declare class Buffer$1 extends BufferBase {
    _data: Mixer[];
    changed: boolean;
    constructor(opts: {
        width: number;
        height: number;
    });
    constructor(width: number, height: number);
    clone(): this;
    resize(width: number, height: number): void;
    _index(x: number, y: number): number;
    get(x: number, y: number): Mixer;
    set(x: number, y: number, ch?: string | null, fg?: ColorBase | null, bg?: ColorBase | null): this;
    info(x: number, y: number): {
        ch: string | null;
        fg: number;
        bg: number;
    };
    copy(other: Buffer$1): this;
    apply(other: Buffer$1): this;
    draw(x: number, y: number, glyph?: string | null, fg?: ColorBase, // TODO - White?
    bg?: ColorBase): this;
    nullify(x: number, y: number): void;
    nullify(): void;
    dump(): void;
}
declare function make$8(opts: {
    width: number;
    height: number;
}): Buffer$1;
declare function make$8(width: number, height: number): Buffer$1;

type buffer_d_DrawData = DrawData;
type buffer_d_BufferBase = BufferBase;
declare const buffer_d_BufferBase: typeof BufferBase;
declare namespace buffer_d {
  export {
    buffer_d_DrawData as DrawData,
    buffer_d_BufferBase as BufferBase,
    Buffer$1 as Buffer,
    make$8 as make,
  };
}

declare const FovFlags: Record<string, number>;

interface FovStrategy {
    isBlocked: XYMatchFunc;
    calcRadius?(x: number, y: number): number;
    hasXY?: XYMatchFunc;
    debug?(...args: any[]): void;
}
declare type SetVisibleFn = (x: number, y: number, v: number) => void;
declare type ViewportCb = (x: number, y: number, radius: number, type: number) => void;
interface FovSite {
    readonly width: number;
    readonly height: number;
    eachViewport(cb: ViewportCb): void;
    lightingChanged(): boolean;
    hasVisibleLight: XYMatchFunc;
    blocksVision: XYMatchFunc;
}
interface FovSubject {
    readonly x: number;
    readonly y: number;
    readonly visionDistance: number;
}
interface FovTracker {
    follow: FovSubject | null;
    isAnyKindOfVisible: XYMatchFunc;
    isInFov: XYMatchFunc;
    isDirectlyVisible: XYMatchFunc;
    isMagicMapped: XYMatchFunc;
    isRevealed: XYMatchFunc;
    getFlag(x: number, y: number): number;
    makeAlwaysVisible(): void;
    makeCellAlwaysVisible: XYFunc;
    setCursor(x: number, y: number, keep?: boolean): void;
    clearCursor(x?: number, y?: number): void;
    isCursor: XYMatchFunc;
    setHighlight(x: number, y: number, keep?: boolean): void;
    clearHighlight(x?: number, y?: number): void;
    isHighlight: XYMatchFunc;
    revealAll(): void;
    revealCell(x: number, y: number, radius?: number, makeVisibleToo?: boolean): void;
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
declare function calculate(dest: NumGrid, isBlocked: XYMatchFunc, x: number, y: number, radius: number): void;

declare type FovChangeFn = (x: number, y: number, isVisible: boolean) => void;
interface FovNoticer {
    onFovChange: FovChangeFn;
}
interface FovSystemOptions {
    revealed?: boolean;
    visible?: boolean;
    alwaysVisible?: boolean;
    callback?: FovChangeFn | FovNoticer;
}
declare class FovSystem implements FovTracker {
    site: FovSite;
    flags: NumGrid;
    fov: FOV;
    changed: boolean;
    protected _callback: FovChangeFn;
    follow: FovSubject | null;
    constructor(site: FovSite, opts?: FovSystemOptions);
    get callback(): FovChangeFn;
    set callback(v: FovChangeFn | FovNoticer | null);
    getFlag(x: number, y: number): number;
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
    revealCell(x: number, y: number, radius?: number, makeVisibleToo?: boolean): void;
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

declare const index_d$7_FovFlags: typeof FovFlags;
type index_d$7_FovStrategy = FovStrategy;
type index_d$7_SetVisibleFn = SetVisibleFn;
type index_d$7_ViewportCb = ViewportCb;
type index_d$7_FovSite = FovSite;
type index_d$7_FovSubject = FovSubject;
type index_d$7_FovTracker = FovTracker;
type index_d$7_FOV = FOV;
declare const index_d$7_FOV: typeof FOV;
declare const index_d$7_calculate: typeof calculate;
type index_d$7_FovChangeFn = FovChangeFn;
type index_d$7_FovNoticer = FovNoticer;
type index_d$7_FovSystemOptions = FovSystemOptions;
type index_d$7_FovSystem = FovSystem;
declare const index_d$7_FovSystem: typeof FovSystem;
declare namespace index_d$7 {
  export {
    index_d$7_FovFlags as FovFlags,
    index_d$7_FovStrategy as FovStrategy,
    index_d$7_SetVisibleFn as SetVisibleFn,
    index_d$7_ViewportCb as ViewportCb,
    index_d$7_FovSite as FovSite,
    index_d$7_FovSubject as FovSubject,
    index_d$7_FovTracker as FovTracker,
    index_d$7_FOV as FOV,
    index_d$7_calculate as calculate,
    index_d$7_FovChangeFn as FovChangeFn,
    index_d$7_FovNoticer as FovNoticer,
    index_d$7_FovSystemOptions as FovSystemOptions,
    index_d$7_FovSystem as FovSystem,
  };
}

declare type Loc = XY | Loc$2;
declare type CostFn = (x: number, y: number) => number;
declare function fromTo(from: Loc, to: Loc, costFn?: CostFn, only4dirs?: boolean): Loc$2[];

declare type SimpleCostFn = (x: number, y: number) => number;
declare type UpdateFn = (value: number, x: number, y: number) => number;
declare type EachFn = (value: number, x: number, y: number) => void;
declare const OK = 1;
declare const AVOIDED = 10;
declare const BLOCKED = 10000;
declare const OBSTRUCTION = 20000;
declare const NOT_DONE = 30000;
interface Item {
    x: number;
    y: number;
    distance: number;
    next: Item | null;
    prev: Item | null;
}
declare class DijkstraMap {
    _data: Item[];
    _todo: Item;
    _maxDistance: number;
    _width: number;
    _height: number;
    constructor();
    constructor(width: number, height: number);
    get width(): number;
    get height(): number;
    copy(other: DijkstraMap): void;
    hasXY(x: number, y: number): boolean;
    reset(width: number, height: number, distance?: number): void;
    _get(loc: Loc): Item;
    _get(x: number, y: number): Item;
    setGoal(xy: Loc, cost?: number): void;
    setGoal(x: number, y: number, cost?: number): void;
    _add(x: number, y: number, distance: number): boolean;
    _insert(item: Item): boolean;
    calculate(costFn: SimpleCostFn, only4dirs?: boolean, maxDistance?: number): void;
    rescan(costFn: SimpleCostFn, only4dirs?: boolean, maxDistance?: number): void;
    getDistance(x: number, y: number): number;
    nextDir(fromX: number, fromY: number, isBlocked: XYMatchFunc, only4dirs?: boolean): Loc$2 | null;
    getPath(fromX: number, fromY: number, isBlocked: XYMatchFunc, only4dirs?: boolean): Loc$2[] | null;
    forPath(fromX: number, fromY: number, isBlocked: XYMatchFunc, pathFn: XYFunc, only4dirs?: boolean): number;
    update(fn: UpdateFn): void;
    add(other: DijkstraMap): void;
    forEach(fn: EachFn): void;
    dump(log?: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    }): void;
    _dumpTodo(): string[];
}
declare function computeDistances(grid: NumGrid, from: Loc, costFn?: SimpleCostFn, only4dirs?: boolean): void;
declare function alloc(): DijkstraMap;
declare function free(map: DijkstraMap): void;

type index_d$6_SimpleCostFn = SimpleCostFn;
type index_d$6_UpdateFn = UpdateFn;
type index_d$6_EachFn = EachFn;
declare const index_d$6_OK: typeof OK;
declare const index_d$6_AVOIDED: typeof AVOIDED;
declare const index_d$6_BLOCKED: typeof BLOCKED;
declare const index_d$6_OBSTRUCTION: typeof OBSTRUCTION;
declare const index_d$6_NOT_DONE: typeof NOT_DONE;
type index_d$6_DijkstraMap = DijkstraMap;
declare const index_d$6_DijkstraMap: typeof DijkstraMap;
declare const index_d$6_computeDistances: typeof computeDistances;
declare const index_d$6_alloc: typeof alloc;
declare const index_d$6_free: typeof free;
type index_d$6_Loc = Loc;
type index_d$6_CostFn = CostFn;
declare const index_d$6_fromTo: typeof fromTo;
declare namespace index_d$6 {
  export {
    index_d$6_SimpleCostFn as SimpleCostFn,
    index_d$6_UpdateFn as UpdateFn,
    index_d$6_EachFn as EachFn,
    index_d$6_OK as OK,
    index_d$6_AVOIDED as AVOIDED,
    index_d$6_BLOCKED as BLOCKED,
    index_d$6_OBSTRUCTION as OBSTRUCTION,
    index_d$6_NOT_DONE as NOT_DONE,
    index_d$6_DijkstraMap as DijkstraMap,
    index_d$6_computeDistances as computeDistances,
    index_d$6_alloc as alloc,
    index_d$6_free as free,
    index_d$6_Loc as Loc,
    index_d$6_CostFn as CostFn,
    index_d$6_fromTo as fromTo,
  };
}

declare type EventFn$1 = (...args: any[]) => void;
declare type Listener<L> = {
    [event in keyof L]: EventFn$1;
};
declare type Events$1 = {
    [k: string]: (...args: any[]) => any;
};
/**
 * Data for an event listener.
 */
declare class EventListener implements ListItem<EventListener> {
    fn: EventFn$1;
    context: any;
    once: boolean;
    next: EventListener | null;
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
declare class EventEmitter<L extends Listener<L> = Events$1> {
    _events: Record<string, EventListener | null>;
    constructor();
    /**
     * Add a listener for a given event.
     *
     * @param {String} event The event name.
     * @param {EventFn} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {boolean} once Specify if the listener is a one-time listener.
     * @returns {Listener}
     */
    addListener<U extends keyof L>(event: U, fn: L[U], context?: any, once?: boolean): this;
    /**
     * Add a listener for a given event.
     *
     * @param {String} event The event name.
     * @param {EventFn} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {boolean} once Specify if the listener is a one-time listener.
     * @returns {Listener}
     */
    on<U extends keyof L>(event: U, fn: L[U], context?: any, once?: boolean): this;
    /**
     * Add a one-time listener for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {EventFn} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @public
     */
    once<U extends keyof L>(event: U, fn: L[U], context?: any): this;
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
    removeListener<U extends keyof L>(event: U, fn: L[U], context?: any, once?: boolean): this;
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
    off<U extends keyof L>(event: U, fn: L[U], context?: any, once?: boolean): this;
    /**
     * Clear event by name.
     *
     * @param {String} evt The Event name.
     */
    clearEvent(event?: keyof L): this;
    /**
     * Remove all listeners, or those of the specified event.
     *
     * @param {(String|Symbol)} [event] The event name.
     * @returns {EventEmitter} `this`.
     * @public
     */
    removeAllListeners(event?: keyof L): this;
    /**
     * Calls each of the listeners registered for a given event.
     *
     * @param {String} event The event name.
     * @param {...*} args The additional arguments to the event handlers.
     * @returns {boolean} `true` if the event had listeners, else `false`.
     * @public
     */
    emit<U extends keyof L>(event: U, ...args: Parameters<L[U]>): boolean;
}

type events_d_Listener<L> = Listener<L>;
type events_d_EventListener = EventListener;
declare const events_d_EventListener: typeof EventListener;
type events_d_EventEmitter<L extends Listener<L> = Events$1> = EventEmitter<L>;
declare const events_d_EventEmitter: typeof EventEmitter;
declare namespace events_d {
  export {
    EventFn$1 as EventFn,
    events_d_Listener as Listener,
    Events$1 as Events,
    events_d_EventListener as EventListener,
    events_d_EventEmitter as EventEmitter,
  };
}

declare type FrequencyFn = (danger: number) => number;
declare type FrequencyConfig = FrequencyFn | number | string | Record<string, number | FrequencyFn> | null;
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

interface Event$1 {
    item: any;
    time: number;
    next: Event$1 | null;
}
declare class Scheduler {
    private next;
    time: number;
    private cache;
    constructor();
    clear(): void;
    push(item: any, delay?: number): Event$1;
    pop(): any;
    peek(): any;
    remove(item: any): void;
}

type scheduler_d_Scheduler = Scheduler;
declare const scheduler_d_Scheduler: typeof Scheduler;
declare namespace scheduler_d {
  export {
    scheduler_d_Scheduler as Scheduler,
  };
}

declare type CTX = CanvasRenderingContext2D;
declare type DrawFunction = (ctx: CTX, x: number, y: number, width: number, height: number) => void;
declare type DrawType = string | DrawFunction;
declare type GlyphInitFn = (g: Glyphs, basic?: boolean) => void;
interface GlyphOptions {
    font?: string;
    fontSize?: number;
    size?: number;
    tileWidth?: number;
    tileHeight?: number;
    init?: GlyphInitFn;
    basicOnly?: boolean;
    basic?: boolean;
}
declare class Glyphs {
    _node: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D;
    _tileWidth: number;
    _tileHeight: number;
    needsUpdate: boolean;
    _toGlyph: Record<string, number>;
    _toChar: string[];
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
    toChar(n: number): string;
    private _configure;
    draw(n: number, ch: DrawType): void;
}
declare function initGlyphs(glyphs: {
    draw: (n: number, ch: string) => void;
}, basicOnly?: boolean): void;

declare type CancelFn = () => void;
declare type CallbackFn = (...args: any[]) => void;
interface CallbackObj {
    [event: string]: CallbackFn;
}
interface CallbackInfo {
    fn: CallbackFn;
    ctx?: any;
    once?: boolean;
}
declare type UnhandledFn = (ev: string, ...args: any[]) => void;
declare class Events {
    _events: Record<string, (CallbackInfo | null)[]>;
    _ctx: any;
    onUnhandled: UnhandledFn | null;
    constructor(ctx?: any);
    has(name: string): boolean;
    on(ev: string | string[], fn: CallbackFn): CancelFn;
    once(ev: string | string[], fn: CallbackFn): CancelFn;
    off(ev: string | string[], cb?: CallbackFn): void;
    trigger(ev: string | string[], ...args: any[]): boolean;
    _unhandled(ev: string, args: any[]): boolean;
    load(cfg: CallbackObj): CancelFn;
    clear(): void;
    restart(): void;
}

interface UISelectable {
    readonly tag: string;
    readonly classes: string[];
    children: UISelectable[];
    attr(name: string): PropType | undefined;
    prop(name: string): PropType | undefined;
    parent: UISelectable | null;
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

interface UIStyle {
    readonly selector: Selector;
    dirty: boolean;
    readonly fg?: ColorBase;
    readonly bg?: ColorBase;
    readonly align?: Align;
    readonly valign?: VAlign;
    readonly opacity?: number;
    get(key: keyof UIStyle): any;
    set(key: keyof UIStyle, value: any): this;
    set(values: StyleOptions): this;
    unset(key: keyof UIStyle): this;
}
interface UIStylable extends UISelectable {
    style(): UIStyle;
}
declare type StyleType = string | StyleOptions;
interface StyleOptions {
    fg?: ColorBase;
    bg?: ColorBase;
    align?: Align;
    valign?: VAlign;
}
interface StyleOptions {
    fg?: ColorBase;
    bg?: ColorBase;
    align?: Align;
    valign?: VAlign;
    opacity?: number;
}
declare class Style implements UIStyle {
    _fg?: ColorBase;
    _bg?: ColorBase;
    _border?: ColorBase;
    _align?: Align;
    _valign?: VAlign;
    _opacity?: number;
    selector: Selector;
    protected _dirty: boolean;
    constructor(selector?: string, init?: StyleOptions);
    get dirty(): boolean;
    set dirty(v: boolean);
    get fg(): ColorBase | undefined;
    get bg(): ColorBase | undefined;
    get opacity(): number | undefined;
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
    _baseFg: Color | null;
    _baseBg: Color | null;
    constructor(sources?: UIStyle[]);
    get opacity(): number;
    set opacity(v: number);
    get dirty(): boolean;
    set dirty(v: boolean);
}
declare class Sheet {
    rules: UIStyle[];
    _parent: Sheet | null;
    _dirty: boolean;
    constructor(parentSheet?: Sheet | null);
    get dirty(): boolean;
    set dirty(v: boolean);
    setParent(sheet: Sheet | null): void;
    add(selector: string, props: StyleOptions): this;
    get(selector: string): UIStyle | null;
    load(styles: Record<string, StyleOptions>): this;
    remove(selector: string): void;
    _rulesFor(widget: UIStylable): UIStyle[];
    computeFor(widget: UIStylable): ComputedStyle;
}
declare const defaultStyle: Sheet;

declare type TimerFn = () => void | boolean;
interface TimerInfo {
    delay: number;
    fn: TimerFn;
    repeat: number;
}
declare class Timers {
    _timers: TimerInfo[];
    _ctx: any;
    constructor(ctx?: any);
    get length(): number;
    clear(): void;
    restart(): void;
    setTimeout(fn: TimerFn, delay: number): CancelFn;
    setInterval(fn: TimerFn, delay: number): CancelFn;
    update(dt: number): void;
}

declare class Data implements Record<string, any> {
    constructor(config?: Record<string, any>);
    get(path: string): any;
    set(path: string, value: any): this;
}

type data_d_Data = Data;
declare const data_d_Data: typeof Data;
declare namespace data_d {
  export {
    data_d_Data as Data,
  };
}

declare type Callback = () => void;
declare class Loop {
    _timer: number;
    get isRunning(): boolean;
    start(cb: Callback, dt?: number): void;
    stop(): void;
}

declare type AnyObj = Record<string, any>;
declare type TweenCb = (obj: AnyObj, dt: number) => any;
declare type TweenFinishCb = (obj: AnyObj, success: boolean) => any;
declare type EasingFn = (v: number) => number;
declare type InterpolateFn = (start: any, goal: any, pct: number) => any;
declare class BaseObj<T extends {
    update(t: number): void;
}> {
    events: Events;
    children: T[];
    on(ev: string | string[], fn: CallbackFn): this;
    once(ev: string | string[], fn: CallbackFn): this;
    off(ev: string | string[], fn: CallbackFn): this;
    trigger(ev: string | string[], ...args: any[]): boolean;
    addChild(t: T): this;
    removeChild(t: T): this;
    update(dt: number): void;
}
declare class Tween extends BaseObj<Tween> {
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
    start(animator?: {
        add: (tween: Tween) => void;
    }): this;
    update(dt: number): void;
    _restart(): void;
    stop(success?: boolean): void;
    _updateProperties(obj: AnyObj, start: AnyObj, goal: AnyObj, pct: number): boolean;
}
declare function make$6(src: AnyObj, duration?: number): Tween;
declare function linear(pct: number): number;
declare function interpolate(start: any, goal: any, pct: number): any;

type tween_d_AnyObj = AnyObj;
type tween_d_TweenCb = TweenCb;
type tween_d_TweenFinishCb = TweenFinishCb;
type tween_d_EasingFn = EasingFn;
type tween_d_InterpolateFn = InterpolateFn;
type tween_d_BaseObj<T extends {
    update(t: number): void;
}> = BaseObj<T>;
declare const tween_d_BaseObj: typeof BaseObj;
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
    tween_d_BaseObj as BaseObj,
    tween_d_Tween as Tween,
    make$6 as make,
    tween_d_linear as linear,
    tween_d_interpolate as interpolate,
  };
}

declare class Tweens {
    _tweens: Tween[];
    constructor();
    get length(): number;
    clear(): void;
    add(tween: Tween): void;
    remove(tween: Tween): void;
    update(dt: number): void;
}

type index_d$5_EventType = EventType;
type index_d$5_Event = Event;
declare const index_d$5_Event: typeof Event;
type index_d$5_ControlFn = ControlFn;
type index_d$5_EventFn = EventFn;
type index_d$5_IOMap = IOMap;
type index_d$5_EventMatchFn = EventMatchFn;
declare const index_d$5_KEYPRESS: typeof KEYPRESS;
declare const index_d$5_MOUSEMOVE: typeof MOUSEMOVE;
declare const index_d$5_CLICK: typeof CLICK;
declare const index_d$5_TICK: typeof TICK;
declare const index_d$5_MOUSEUP: typeof MOUSEUP;
declare const index_d$5_STOP: typeof STOP;
declare const index_d$5_isControlCode: typeof isControlCode;
declare const index_d$5_recycleEvent: typeof recycleEvent;
declare const index_d$5_makeStopEvent: typeof makeStopEvent;
declare const index_d$5_makeCustomEvent: typeof makeCustomEvent;
declare const index_d$5_makeTickEvent: typeof makeTickEvent;
declare const index_d$5_makeKeyEvent: typeof makeKeyEvent;
declare const index_d$5_keyCodeDirection: typeof keyCodeDirection;
declare const index_d$5_ignoreKeyEvent: typeof ignoreKeyEvent;
declare const index_d$5_makeMouseEvent: typeof makeMouseEvent;
type index_d$5_Queue = Queue;
declare const index_d$5_Queue: typeof Queue;
type index_d$5_CancelFn = CancelFn;
type index_d$5_CallbackFn = CallbackFn;
type index_d$5_CallbackObj = CallbackObj;
type index_d$5_UnhandledFn = UnhandledFn;
type index_d$5_Events = Events;
declare const index_d$5_Events: typeof Events;
type index_d$5_Callback = Callback;
type index_d$5_Loop = Loop;
declare const index_d$5_Loop: typeof Loop;
type index_d$5_TimerFn = TimerFn;
type index_d$5_Timers = Timers;
declare const index_d$5_Timers: typeof Timers;
type index_d$5_Tweens = Tweens;
declare const index_d$5_Tweens: typeof Tweens;
type index_d$5_UISelectable = UISelectable;
type index_d$5_MatchFn = MatchFn;
type index_d$5_Selector = Selector;
declare const index_d$5_Selector: typeof Selector;
declare const index_d$5_compile: typeof compile;
type index_d$5_UIStyle = UIStyle;
type index_d$5_StyleOptions = StyleOptions;
type index_d$5_UIStylable = UIStylable;
type index_d$5_StyleType = StyleType;
type index_d$5_Style = Style;
declare const index_d$5_Style: typeof Style;
declare const index_d$5_makeStyle: typeof makeStyle;
type index_d$5_ComputedStyle = ComputedStyle;
declare const index_d$5_ComputedStyle: typeof ComputedStyle;
type index_d$5_Sheet = Sheet;
declare const index_d$5_Sheet: typeof Sheet;
declare const index_d$5_defaultStyle: typeof defaultStyle;
type index_d$5_DataValue = DataValue;
type index_d$5_DataObject = DataObject;
type index_d$5_DataItem = DataItem;
type index_d$5_DataType = DataType;
type index_d$5_EventCb = EventCb;
type index_d$5_UpdatePosOpts = UpdatePosOpts;
type index_d$5_SetParentOptions = SetParentOptions;
type index_d$5_WidgetOpts = WidgetOpts;
type index_d$5_PropType = PropType;
type index_d$5_Widget = Widget;
declare const index_d$5_Widget: typeof Widget;
declare const index_d$5_alignChildren: typeof alignChildren;
declare const index_d$5_spaceChildren: typeof spaceChildren;
declare const index_d$5_wrapChildren: typeof wrapChildren;
type index_d$5_SceneCallback = SceneCallback;
type index_d$5_SceneMakeFn = SceneMakeFn;
type index_d$5_CreateOpts = CreateOpts;
type index_d$5_StartOpts = StartOpts;
type index_d$5_ResumeOpts = ResumeOpts;
type index_d$5_PauseOpts = PauseOpts;
type index_d$5_SceneObj = SceneObj;
type index_d$5_Scene = Scene;
declare const index_d$5_Scene: typeof Scene;
type index_d$5_Scenes = Scenes;
declare const index_d$5_Scenes: typeof Scenes;
declare const index_d$5_scenes: typeof scenes;
declare const index_d$5_installScene: typeof installScene;
type index_d$5_AppOpts = AppOpts;
type index_d$5_App = App;
declare const index_d$5_App: typeof App;
declare namespace index_d$5 {
  export {
    index_d$5_EventType as EventType,
    index_d$5_Event as Event,
    index_d$5_ControlFn as ControlFn,
    index_d$5_EventFn as EventFn,
    index_d$5_IOMap as IOMap,
    index_d$5_EventMatchFn as EventMatchFn,
    index_d$5_KEYPRESS as KEYPRESS,
    index_d$5_MOUSEMOVE as MOUSEMOVE,
    index_d$5_CLICK as CLICK,
    index_d$5_TICK as TICK,
    index_d$5_MOUSEUP as MOUSEUP,
    index_d$5_STOP as STOP,
    index_d$5_isControlCode as isControlCode,
    index_d$5_recycleEvent as recycleEvent,
    index_d$5_makeStopEvent as makeStopEvent,
    index_d$5_makeCustomEvent as makeCustomEvent,
    index_d$5_makeTickEvent as makeTickEvent,
    index_d$5_makeKeyEvent as makeKeyEvent,
    index_d$5_keyCodeDirection as keyCodeDirection,
    index_d$5_ignoreKeyEvent as ignoreKeyEvent,
    index_d$5_makeMouseEvent as makeMouseEvent,
    index_d$5_Queue as Queue,
    index_d$5_CancelFn as CancelFn,
    index_d$5_CallbackFn as CallbackFn,
    index_d$5_CallbackObj as CallbackObj,
    index_d$5_UnhandledFn as UnhandledFn,
    index_d$5_Events as Events,
    index_d$5_Callback as Callback,
    index_d$5_Loop as Loop,
    index_d$5_TimerFn as TimerFn,
    index_d$5_Timers as Timers,
    index_d$5_Tweens as Tweens,
    index_d$5_UISelectable as UISelectable,
    index_d$5_MatchFn as MatchFn,
    index_d$5_Selector as Selector,
    index_d$5_compile as compile,
    index_d$5_UIStyle as UIStyle,
    index_d$5_StyleOptions as StyleOptions,
    index_d$5_UIStylable as UIStylable,
    index_d$5_StyleType as StyleType,
    index_d$5_Style as Style,
    index_d$5_makeStyle as makeStyle,
    index_d$5_ComputedStyle as ComputedStyle,
    index_d$5_Sheet as Sheet,
    index_d$5_defaultStyle as defaultStyle,
    index_d$5_DataValue as DataValue,
    index_d$5_DataObject as DataObject,
    index_d$5_DataItem as DataItem,
    index_d$5_DataType as DataType,
    index_d$5_EventCb as EventCb,
    index_d$5_UpdatePosOpts as UpdatePosOpts,
    index_d$5_SetParentOptions as SetParentOptions,
    index_d$5_WidgetOpts as WidgetOpts,
    index_d$5_PropType as PropType,
    index_d$5_Widget as Widget,
    index_d$5_alignChildren as alignChildren,
    index_d$5_spaceChildren as spaceChildren,
    index_d$5_wrapChildren as wrapChildren,
    index_d$5_SceneCallback as SceneCallback,
    index_d$5_SceneMakeFn as SceneMakeFn,
    index_d$5_CreateOpts as CreateOpts,
    index_d$5_StartOpts as StartOpts,
    index_d$5_ResumeOpts as ResumeOpts,
    index_d$5_PauseOpts as PauseOpts,
    index_d$5_SceneObj as SceneObj,
    index_d$5_Scene as Scene,
    index_d$5_Scenes as Scenes,
    index_d$5_scenes as scenes,
    index_d$5_installScene as installScene,
    index_d$5_AppOpts as AppOpts,
    index_d$5_App as App,
    make$5 as make,
  };
}

interface PendingInfo {
    action: 'start' | 'stop' | 'run';
    scene: Scene;
    data: any;
}
declare class Scenes {
    _app: App;
    _config: Record<string, CreateOpts>;
    _scenes: Record<string, Scene>;
    _active: Scene[];
    _busy: boolean;
    _pending: PendingInfo[];
    constructor(gw: App);
    get isBusy(): boolean;
    add(id: string, opts: CreateOpts | SceneMakeFn): void;
    load(scenes: Record<string, CreateOpts | SceneMakeFn>): void;
    get(): Scene;
    get(id?: string): Scene | null;
    trigger(ev: string, ...args: any[]): void;
    _create(id: string, opts?: CreateOpts): Scene;
    create(id: string, data?: CreateOpts): Scene;
    start(id: string, data?: StartOpts): Scene;
    run(id: string, data?: StartOpts): Scene;
    _start(scene: Scene): void;
    stop(data?: any): void;
    stop(id: string, data?: any): void;
    _stop(_scene: Scene): void;
    destroy(id: string, data?: any): void;
    pause(id: string, opts?: PauseOpts): void;
    pause(opts?: PauseOpts): void;
    resume(opts?: PauseOpts): void;
    resume(id: string, opts?: PauseOpts): void;
    frameStart(): void;
    input(ev: Event): void;
    update(dt: number): void;
    draw(buffer: Buffer$1): void;
    frameDebug(buffer: Buffer$1): void;
    frameEnd(buffer: Buffer$1): void;
}
declare const scenes: Record<string, CreateOpts>;
declare function installScene(id: string, scene: CreateOpts | SceneMakeFn): void;

interface TextOptions extends WidgetOpts {
    text?: string;
}
declare class Text extends Widget {
    _text: string;
    _lines: string[];
    _fixedWidth: boolean;
    _fixedHeight: boolean;
    constructor(opts: TextOptions);
    text(): string;
    text(v: string): this;
    resize(w: number, h: number): this;
    addChild(): this;
    _draw(buffer: Buffer$1): void;
}

declare type PrefixType = 'none' | 'letter' | 'number' | 'bullet';
declare type FormatFn = Template;
declare type SelectType = 'none' | 'column' | 'row' | 'cell';
declare type HoverType = 'none' | 'column' | 'row' | 'cell' | 'select';
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
interface DataTableOptions extends Omit<WidgetOpts, 'height'> {
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
    data?: DataItem[];
    border?: boolean | BorderType;
}
declare class Column {
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
    columns: Column[];
    showHeader: boolean;
    rowHeight: number;
    size: number;
    selectedRow: number;
    selectedColumn: number;
    _data: DataItem[];
    constructor(opts: DataTableOptions);
    get selectedData(): any;
    select(col: number, row: number): this;
    selectNextRow(): this;
    selectPrevRow(): this;
    selectNextCol(): this;
    selectPrevCol(): this;
    blur(reverse?: boolean): void;
    _setData(v: DataItem[]): this;
    _draw(buffer: Buffer$1): boolean;
    keypress(e: Event): boolean;
    dir(e: Event): boolean;
}

declare type PadInfo = boolean | number | [number] | [number, number] | [number, number, number, number];
interface DialogOptions extends WidgetOpts {
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
    constructor(opts: DialogOptions);
    _adjustBounds(pad: [number, number, number, number]): this;
    get _innerLeft(): number;
    get _innerWidth(): number;
    get _innerTop(): number;
    get _innerHeight(): number;
    _addLegend(opts: DialogOptions): this;
    _draw(buffer: Buffer$1): boolean;
}
declare type AddDialogOptions = DialogOptions & UpdatePosOpts & {
    parent?: Widget;
};
declare function dialog(opts: AddDialogOptions): Dialog;

interface AlertOptions extends Partial<DialogOptions> {
    duration?: number;
    waitForAck?: boolean;
    textClass?: string;
    opacity?: number;
    text: string;
    args?: Record<string, any>;
}
declare const AlertScene: {
    create(this: Scene): void;
    start(this: Scene, data: AlertOptions): void;
    stop(this: Scene): void;
};

interface ConfirmOptions extends Partial<DialogOptions> {
    text: string;
    textClass?: string;
    opacity?: number;
    buttonWidth?: number;
    ok?: string;
    okClass?: string;
    cancel?: boolean | string;
    cancelClass?: string;
    done?: (result: boolean) => any;
}
declare const ConfirmScene: {
    create(this: Scene): void;
    start(this: Scene, opts: ConfirmOptions): void;
    stop(this: Scene): void;
};

interface ButtonOptions extends Omit<TextOptions, 'text'> {
    text?: string;
}
declare class Button extends Text {
    constructor(opts: ButtonOptions);
}

interface PromptOptions$1 extends Omit<DialogOptions, 'width' | 'height'> {
    width?: number;
    height?: number;
    prompt: string;
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
    done?: (result: string | null) => any;
}
declare const PromptScene: {
    create(this: Scene): void;
    start(this: Scene, opts: PromptOptions$1): void;
    stop(this: Scene): void;
};

interface AppOpts {
    width?: number;
    height?: number;
    glyphs?: Glyphs;
    div?: HTMLElement | string;
    image?: HTMLImageElement | string;
    font?: string;
    fontSize?: number;
    size?: number;
    tileWidth?: number;
    tileHeight?: number;
    basicOnly?: boolean;
    basic?: boolean;
    scene?: CreateOpts | boolean;
    scenes?: Record<string, CreateOpts>;
    loop?: Loop;
    canvas?: Canvas;
    start?: boolean | string;
    data?: Record<string, any>;
}
declare class App {
    canvas: Canvas;
    events: Events;
    timers: Timers;
    scenes: Scenes;
    io: Queue;
    loop: Loop;
    styles: Sheet;
    dt: number;
    time: number;
    realTime: number;
    skipTime: boolean;
    fps: number;
    fpsBuf: number[];
    fpsTimer: number;
    numFrames: number;
    loopID: number;
    stopped: boolean;
    paused: boolean;
    debug: boolean;
    buffer: Buffer$1;
    data: Data;
    constructor(opts?: Partial<AppOpts>);
    get width(): number;
    get height(): number;
    get node(): HTMLCanvasElement;
    get mouseXY(): XY;
    get scene(): Scene;
    on(ev: string, fn: CallbackFn): CancelFn;
    trigger(ev: string, ...args: any[]): void;
    wait(delay: number, fn: TimerFn): CancelFn;
    wait(delay: number, fn: string, ctx?: Record<string, any>): CancelFn;
    repeat(delay: number, fn: TimerFn): CancelFn;
    repeat(delay: number, fn: string, ctx?: Record<string, any>): CancelFn;
    start(): void;
    stop(): void;
    _frame(t?: number): void;
    _input(ev: Event): void;
    _update(dt?: number): void;
    _frameStart(): void;
    _draw(): void;
    _frameDebug(): void;
    _frameEnd(): void;
    alert(text: string, opts?: Omit<AlertOptions, 'text'>): Scene;
    confirm(text: string, opts?: Omit<ConfirmOptions, 'text'>): Scene;
    prompt(text: string, opts?: Omit<PromptOptions$1, 'prompt'>): Scene;
}
declare function make$5(opts: Partial<AppOpts>): App;

declare type SceneCallback = (this: Scene, ...args: any[]) => void;
declare type SceneMakeFn = (id: string, app: App) => Scene;
interface CreateOpts {
    bg?: ColorBase;
    data?: Record<string, string>;
    styles?: Sheet;
    make?: SceneMakeFn;
    create?: SceneCallback;
    delete?: SceneCallback;
    start?: SceneCallback;
    stop?: SceneCallback;
    pause?: SceneCallback;
    resume?: SceneCallback;
    frameStart?: SceneCallback;
    input?: SceneCallback;
    update?: SceneCallback;
    draw?: SceneCallback;
    frameDebug?: SceneCallback;
    frameEnd?: SceneCallback;
    on?: Record<string, SceneCallback>;
}
interface StartOpts {
    [key: string]: any;
}
interface ResumeOpts {
    timers?: boolean;
    tweens?: boolean;
    update?: boolean;
    draw?: boolean;
    input?: boolean;
}
interface PauseOpts extends ResumeOpts {
    duration?: number;
}
interface SceneObj {
    update(dt: number): void;
    draw(buffer: Buffer$1): void;
    destroy(): void;
    trigger(ev: string, ...args: any[]): void;
}
declare class Scene {
    id: string;
    app: App;
    events: Events;
    tweens: Tweens;
    timers: Timers;
    buffer: Buffer$1;
    all: Widget[];
    children: Widget[];
    focused: Widget | null;
    dt: number;
    time: number;
    realTime: number;
    skipTime: boolean;
    stopped: boolean;
    paused: ResumeOpts;
    debug: boolean;
    needsDraw: boolean;
    styles: Sheet;
    bg: Color;
    data: Record<string, any>;
    constructor(id: string, app: App);
    get width(): number;
    get height(): number;
    isActive(): boolean;
    isPaused(): () => any;
    isSleeping(): () => any;
    create(opts?: CreateOpts): void;
    destroy(data?: any): void;
    start(opts?: StartOpts): void;
    _start(opts?: StartOpts): void;
    run(data?: StartOpts): void;
    stop(data?: any): void;
    pause(opts?: PauseOpts): void;
    resume(opts?: ResumeOpts): void;
    frameStart(): void;
    input(e: Event): void;
    update(dt: number): void;
    draw(buffer: Buffer$1): void;
    _draw(buffer: Buffer$1): void;
    frameDebug(buffer: Buffer$1): void;
    frameEnd(buffer: Buffer$1): void;
    fadeIn(widget: Widget, ms: number): this;
    fadeOut(widget: Widget, ms: number): this;
    fadeTo(widget: Widget, opacity: number, ms: number): this;
    fadeToggle(widget: Widget, ms: number): this;
    slideIn(widget: Widget, x: number, y: number, from: 'left' | 'top' | 'right' | 'bottom', ms: number): this;
    slideOut(widget: Widget, dir: 'left' | 'top' | 'right' | 'bottom', ms: number): this;
    slide(widget: Widget, from: XY | Loc$2, to: XY | Loc$2, ms: number): this;
    get(id: string): Widget | null;
    _attach(widget: Widget): void;
    _detach(widget: Widget): void;
    addChild(child: Widget, opts?: UpdatePosOpts & {
        focused?: boolean;
    }): void;
    removeChild(child: Widget): void;
    childAt(xy: XY | number, y?: number): Widget | null;
    widgetAt(xy: XY | number, y?: number): Widget | null;
    setFocusWidget(w: Widget | null, reverse?: boolean): void;
    nextTabStop(): boolean;
    prevTabStop(): boolean;
    on(ev: string, cb: CallbackFn): CancelFn;
    once(ev: string, cb: CallbackFn): CancelFn;
    trigger(ev: string | string[], ...args: any[]): boolean;
    load(cfg: CallbackObj): CancelFn;
    wait(delay: number, fn: TimerFn): CancelFn;
    wait(delay: number, fn: string, ctx?: Record<string, any>): CancelFn;
    repeat(delay: number, fn: TimerFn): CancelFn;
    repeat(delay: number, fn: string, ctx?: Record<string, any>): CancelFn;
}

declare type DataValue = any;
declare type DataObject = Record<string, DataValue>;
declare type DataItem = DataValue | DataValue[] | DataObject;
declare type DataType = DataItem[] | DataObject;
declare type EventCb = (name: string, widget: Widget | null, args?: any) => boolean | any;
interface UpdatePosOpts {
    x?: number;
    y?: number;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    center?: boolean;
    centerX?: boolean;
    centerY?: boolean;
}
interface SetParentOptions extends UpdatePosOpts {
    first?: boolean;
    last?: boolean;
    before?: string | Widget;
    after?: string | Widget;
    focused?: boolean;
}
interface WidgetOpts extends StyleOptions, SetParentOptions {
    tag?: string;
    id?: string;
    data?: DataType;
    parent?: Widget | null;
    scene?: Scene | null;
    width?: number;
    height?: number;
    class?: string;
    tabStop?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    action?: string | boolean;
    create?: CallbackFn;
    input?: CallbackFn;
    update?: CallbackFn;
    draw?: CallbackFn;
    destroy?: CallbackFn;
    keypress?: CallbackFn;
    mouseenter?: CallbackFn;
    mousemove?: CallbackFn;
    mouseleave?: CallbackFn;
    click?: CallbackFn;
    on?: Record<string, CallbackFn>;
}
declare type PropType = string | number | boolean;
declare class Widget {
    parent: Widget | null;
    scene: Scene | null;
    children: Widget[];
    bounds: Bounds;
    events: Events;
    _style: Style;
    _used: ComputedStyle;
    _data: DataType;
    classes: string[];
    _props: Record<string, PropType>;
    _attrs: Record<string, PropType>;
    constructor(opts?: WidgetOpts);
    get needsDraw(): boolean;
    set needsDraw(v: boolean);
    get tag(): string;
    get id(): string;
    data(): DataType;
    data(all: DataType): this;
    data(key: string): any;
    data(key: string, value: any): this;
    _setData(v: Record<string, any> | any[]): void;
    _setDataItem(key: string, v: any): void;
    pos(): XY;
    pos(xy: XY): this;
    pos(x: number, y: number): this;
    updatePos(opts: UpdatePosOpts): void;
    contains(e: XY): boolean;
    contains(x: number, y: number): boolean;
    center(bounds?: Bounds): this;
    centerX(bounds?: Bounds): this;
    centerY(bounds?: Bounds): this;
    left(n: number): this;
    right(n: number): this;
    top(n: number): this;
    bottom(n: number): this;
    resize(w: number, h: number): this;
    style(): Style;
    style(opts: StyleOptions): this;
    style(name: keyof StyleOptions): any;
    style(name: keyof StyleOptions, value: any): this;
    addClass(c: string): this;
    removeClass(c: string): this;
    hasClass(c: string): boolean;
    toggleClass(c: string): this;
    attr(name: string): PropType;
    attr(name: string, v: PropType): this;
    _attrInt(name: string): number;
    _attrStr(name: string): string;
    _attrBool(name: string): boolean;
    text(): string;
    text(v: string): this;
    prop(name: string): PropType | undefined;
    prop(name: string, v: PropType): this;
    _setProp(name: string, v: PropType): void;
    _propInt(name: string): number;
    _propStr(name: string): string;
    _propBool(name: string): boolean;
    toggleProp(name: string): this;
    incProp(name: string, n?: number): this;
    get hovered(): boolean;
    set hovered(v: boolean);
    get disabled(): boolean;
    set disabled(v: boolean);
    get hidden(): boolean;
    set hidden(v: boolean);
    get needsStyle(): boolean;
    set needsStyle(v: boolean);
    get focused(): boolean;
    focus(reverse?: boolean): void;
    blur(reverse?: boolean): void;
    setParent(parent: Widget | null, opts?: SetParentOptions): void;
    addChild(child: Widget): void;
    removeChild(child: Widget): void;
    childAt(xy: XY): Widget | null;
    childAt(xy: number, y: number): Widget | null;
    getChild(id: string): Widget | null;
    on(ev: string | string[], cb: CallbackFn): CancelFn;
    once(ev: string | string[], cb: CallbackFn): CancelFn;
    off(ev: string | string[], cb: CallbackFn): void;
    trigger(ev: string | string[], ...args: any[]): boolean;
    action(ev?: Event): void;
    input(e: Event): void;
    _mouseenter(e: Event): void;
    mousemove(e: Event): void;
    _mousemove(e: Event): void;
    _mouseleave(e: Event): void;
    click(e: Event): void;
    _click(e: Event): void;
    keypress(e: Event): void;
    draw(buffer: Buffer$1): void;
    _draw(buffer: Buffer$1): void;
    _drawFill(buffer: Buffer$1): void;
    update(dt: number): void;
    destroy(): void;
}
declare function alignChildren(widget: Widget, align?: Align): void;
declare function spaceChildren(widget: Widget, space?: number): void;
declare function wrapChildren(widget: Widget, pad?: number): void;

interface EventType {
    type: string;
    defaultPrevented: boolean;
    propagationStopped: boolean;
    immediatePropagationStopped: boolean;
    preventDefault(): void;
    stopPropagation(): void;
    stopImmediatePropagation(): void;
    reset(type: string, opts?: Record<string, any>): void;
    [key: string]: any;
}
declare class Event implements EventType {
    type: string;
    target: Widget | null;
    defaultPrevented: boolean;
    propagationStopped: boolean;
    immediatePropagationStopped: boolean;
    key: string;
    code: string;
    shiftKey: boolean;
    ctrlKey: boolean;
    altKey: boolean;
    metaKey: boolean;
    dir: Loc$2 | null;
    x: number;
    y: number;
    clientX: number;
    clientY: number;
    dt: number;
    constructor(type: string, opts?: Partial<Event>);
    preventDefault(): void;
    stopPropagation(): void;
    stopImmediatePropagation(): void;
    reset(type: string, opts?: Partial<Event>): void;
    clone(): Event;
    dispatch(handler: {
        trigger(name: string | string[], e: Event): void;
    }): void;
}
declare type ControlFn = () => void | Promise<void>;
declare type EventFn = (event: Event) => boolean | void | Promise<boolean | void>;
declare type IOMap = Record<string, EventFn | ControlFn>;
declare type EventMatchFn = (event: Event) => boolean;
declare const KEYPRESS = "keypress";
declare const MOUSEMOVE = "mousemove";
declare const CLICK = "click";
declare const TICK = "tick";
declare const MOUSEUP = "mouseup";
declare const STOP = "stop";
declare function isControlCode(e: string | Event): boolean;
declare function recycleEvent(ev: Event): void;
declare function makeStopEvent(): Event;
declare function makeCustomEvent(type: string, opts?: Partial<Event>): Event;
declare function makeTickEvent(dt: number): Event;
declare function makeKeyEvent(e: KeyboardEvent): Event;
declare function keyCodeDirection(key: string): Loc$2 | null;
declare function ignoreKeyEvent(e: KeyboardEvent): boolean;
declare function makeMouseEvent(e: MouseEvent, x: number, y: number): Event;
declare class Queue {
    _events: Event[];
    lastClick: XY;
    constructor();
    get length(): number;
    clear(): void;
    enqueue(ev: Event): void;
    dequeue(): Event | undefined;
    peek(): Event | undefined;
}

declare type IOCallback = EventFn | null;
declare type GL = WebGL2RenderingContext;
declare const VERTICES_PER_TILE = 6;
interface Options {
    width?: number;
    height?: number;
    glyphs: Glyphs;
    div?: HTMLElement | string;
    render?: boolean;
    bg?: ColorBase;
}
declare class NotSupportedError extends Error {
    constructor(...params: any[]);
}
declare class Canvas {
    mouse: XY;
    _renderRequested: boolean;
    _glyphs: Glyphs;
    _autoRender: boolean;
    _node: HTMLCanvasElement;
    _width: number;
    _height: number;
    _gl: GL;
    _buffers: {
        position?: WebGLBuffer;
        uv?: WebGLBuffer;
        fg?: WebGLBuffer;
        bg?: WebGLBuffer;
        glyph?: WebGLBuffer;
    };
    _layers: Layer[];
    _attribs: Record<string, number>;
    _uniforms: Record<string, WebGLUniformLocation>;
    _texture: WebGLTexture;
    bg: Color;
    constructor(options: Options);
    get node(): HTMLCanvasElement;
    get width(): number;
    get height(): number;
    get tileWidth(): number;
    get tileHeight(): number;
    get pxWidth(): number;
    get pxHeight(): number;
    get glyphs(): Glyphs;
    set glyphs(glyphs: Glyphs);
    layer(depth?: number): Layer;
    clearLayer(depth?: number): void;
    removeLayer(depth?: number): void;
    _createNode(): HTMLCanvasElement;
    _configure(options: Options): void;
    _setGlyphs(glyphs: Glyphs): boolean;
    resize(width: number, height: number): void;
    _requestRender(): void;
    hasXY(x: number, y: number): boolean;
    toX(x: number): number;
    toY(y: number): number;
    get onclick(): IOCallback;
    set onclick(fn: IOCallback);
    get onmousemove(): IOCallback;
    set onmousemove(fn: IOCallback);
    get onmouseup(): IOCallback;
    set onmouseup(fn: IOCallback);
    get onkeydown(): IOCallback;
    set onkeydown(fn: IOCallback);
    _createContext(): void;
    _createGeometry(): void;
    _createData(): void;
    _uploadGlyphs(): void;
    draw(x: number, y: number, glyph: string | number, fg: ColorBase, bg: ColorBase): void;
    render(buffer?: Buffer$1): void;
    _render(): void;
}
interface ImageOptions extends Options {
    image: HTMLImageElement | string;
}
declare type FontOptions = Options & GlyphOptions;
declare function withImage(image: ImageOptions | HTMLImageElement | string): Canvas;
declare function withFont(src: FontOptions | string): Canvas;
declare function createProgram(gl: GL, ...sources: string[]): WebGLProgram;
declare const QUAD: number[];

interface BufferTarget {
    readonly width: number;
    readonly height: number;
    toGlyph(ch: string): number;
    copy(buffer: Buffer): void;
    copyTo(buffer: Buffer): void;
}
declare class Buffer extends Buffer$1 {
    _layer: BufferTarget;
    constructor(layer: BufferTarget);
    toGlyph(ch: string | number): number;
    render(): this;
    copyFromLayer(): this;
}

declare class Layer extends BufferBase implements BufferTarget {
    canvas: Canvas;
    fg: Uint16Array;
    bg: Uint16Array;
    glyph: Uint8Array;
    _depth: number;
    _empty: boolean;
    constructor(canvas: Canvas, depth?: number);
    get width(): number;
    get height(): number;
    get depth(): number;
    get empty(): boolean;
    detach(): void;
    resize(width: number, height: number): void;
    clear(): void;
    get(x: number, y: number): DrawInfo;
    set(x: number, y: number, glyph?: string | null, fg?: number | ColorData, bg?: number | ColorData): this;
    draw(x: number, y: number, glyph?: string | number | null, fg?: ColorBase, bg?: ColorBase): this;
    _set(index: number, glyph: number, fg: number, bg: number): void;
    nullify(x: number, y: number): void;
    nullify(): void;
    dump(): void;
    copy(buffer: Buffer$1): void;
    copyTo(buffer: Buffer$1): void;
    toGlyph(ch: string): number;
    fromGlyph(n: number): string;
    toChar(n: number): string;
}

interface BaseOptions {
    width?: number;
    height?: number;
    glyphs?: Glyphs;
    div?: HTMLElement | string;
    io?: true;
    image?: HTMLImageElement | string;
}
declare type CanvasOptions = BaseOptions & GlyphOptions;
declare function make$4(opts: Partial<CanvasOptions>): Canvas;
declare function make$4(width: number, height: number, opts?: Partial<CanvasOptions>): Canvas;

type index_d$4_GlyphInitFn = GlyphInitFn;
type index_d$4_GlyphOptions = GlyphOptions;
type index_d$4_Glyphs = Glyphs;
declare const index_d$4_Glyphs: typeof Glyphs;
declare const index_d$4_initGlyphs: typeof initGlyphs;
type index_d$4_Layer = Layer;
declare const index_d$4_Layer: typeof Layer;
type index_d$4_BufferTarget = BufferTarget;
type index_d$4_Buffer = Buffer;
declare const index_d$4_Buffer: typeof Buffer;
type index_d$4_IOCallback = IOCallback;
declare const index_d$4_VERTICES_PER_TILE: typeof VERTICES_PER_TILE;
type index_d$4_Options = Options;
type index_d$4_NotSupportedError = NotSupportedError;
declare const index_d$4_NotSupportedError: typeof NotSupportedError;
type index_d$4_Canvas = Canvas;
declare const index_d$4_Canvas: typeof Canvas;
type index_d$4_ImageOptions = ImageOptions;
type index_d$4_FontOptions = FontOptions;
declare const index_d$4_withImage: typeof withImage;
declare const index_d$4_withFont: typeof withFont;
declare const index_d$4_createProgram: typeof createProgram;
declare const index_d$4_QUAD: typeof QUAD;
type index_d$4_CanvasOptions = CanvasOptions;
declare namespace index_d$4 {
  export {
    index_d$4_GlyphInitFn as GlyphInitFn,
    index_d$4_GlyphOptions as GlyphOptions,
    index_d$4_Glyphs as Glyphs,
    index_d$4_initGlyphs as initGlyphs,
    index_d$4_Layer as Layer,
    index_d$4_BufferTarget as BufferTarget,
    index_d$4_Buffer as Buffer,
    index_d$4_IOCallback as IOCallback,
    index_d$4_VERTICES_PER_TILE as VERTICES_PER_TILE,
    index_d$4_Options as Options,
    index_d$4_NotSupportedError as NotSupportedError,
    index_d$4_Canvas as Canvas,
    index_d$4_ImageOptions as ImageOptions,
    index_d$4_FontOptions as FontOptions,
    index_d$4_withImage as withImage,
    index_d$4_withFont as withFont,
    index_d$4_createProgram as createProgram,
    index_d$4_QUAD as QUAD,
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
declare function install$1(name: string, bg: ColorBase, opacity?: number): Sprite;
declare function install$1(name: string, ch: string | null, fg: Color | number | string | number[] | null, bg: Color | number | string | number[] | null, opacity?: number): Sprite;
declare function install$1(name: string, args: any[]): Sprite;
declare function install$1(name: string, info: SpriteConfig): Sprite;

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
    install$1 as install,
    index_d$3_DrawInfo as DrawInfo,
    index_d$3_Mixer as Mixer,
    index_d$3_makeMixer as makeMixer,
    index_d$3_SpriteData as SpriteData,
  };
}

interface CacheOptions {
    length: number;
    width: number;
    reverseMultiLine: boolean;
}
declare type EachMsgFn = (msg: string, confirmed: boolean, i: number) => any;
declare class Cache {
    _archive: (string | null)[];
    _confirmed: boolean[];
    archiveLen: number;
    msgWidth: number;
    _nextWriteIndex: number;
    _combatMsg: string | null;
    _reverse: boolean;
    constructor(opts?: Partial<CacheOptions>);
    clear(): void;
    _addMessageLine(msg: string): void;
    add(msg: string): void;
    _addMessage(msg: string): void;
    addCombat(msg: string): void;
    protected _addCombatMessage(msg: string): void;
    commitCombatMessage(): boolean;
    confirmAll(): void;
    forEach(fn: EachMsgFn): void;
    get length(): number;
}

type message_d_CacheOptions = CacheOptions;
type message_d_EachMsgFn = EachMsgFn;
type message_d_Cache = Cache;
declare const message_d_Cache: typeof Cache;
declare namespace message_d {
  export {
    message_d_CacheOptions as CacheOptions,
    message_d_EachMsgFn as EachMsgFn,
    message_d_Cache as Cache,
  };
}

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
    eachMinersLight(cb: LightCb): void;
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
    ambient?: ColorBase | LightValue;
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
    constructor(map: LightSystemSite, opts?: LightSystemOptions);
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

interface Rec<T> {
    [keys: string]: T;
}
declare type DropdownConfig = Rec<ButtonConfig>;
declare type ActionConfig = string;
declare type ButtonConfig = ActionConfig | DropdownConfig;
interface MenuOptions$1 extends WidgetOpts {
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
    _selectedIndex: number;
    children: MenuButton[];
    constructor(opts: MenuOptions$1);
    _initButtons(opts: MenuOptions$1): void;
    show(): void;
    hide(): void;
    nextItem(): void;
    prevItem(): void;
    expandItem(): Menu | null;
    selectItemWithKey(key: string): void;
}
interface MenuButtonOptions extends WidgetOpts {
    text: string;
    buttons: ButtonConfig;
}
declare class MenuButton extends Text {
    menu: Menu | null;
    constructor(opts: MenuButtonOptions);
    collapse(): void;
    expand(): Menu | null;
    _setMenuPos(xy: XY, opts: MenuButtonOptions): void;
    _initMenu(opts: MenuButtonOptions): Menu | null;
}

interface MenuOptions {
    menu: Menu;
    origin: Scene;
}
declare const MenuScene: {
    create(this: Scene): void;
    start(this: Scene, data: MenuOptions): void;
    stop(this: Scene): void;
};

type index_d$1_AlertOptions = AlertOptions;
declare const index_d$1_AlertScene: typeof AlertScene;
type index_d$1_ConfirmOptions = ConfirmOptions;
declare const index_d$1_ConfirmScene: typeof ConfirmScene;
declare const index_d$1_PromptScene: typeof PromptScene;
type index_d$1_MenuOptions = MenuOptions;
declare const index_d$1_MenuScene: typeof MenuScene;
declare namespace index_d$1 {
  export {
    index_d$1_AlertOptions as AlertOptions,
    index_d$1_AlertScene as AlertScene,
    index_d$1_ConfirmOptions as ConfirmOptions,
    index_d$1_ConfirmScene as ConfirmScene,
    PromptOptions$1 as PromptOptions,
    index_d$1_PromptScene as PromptScene,
    index_d$1_MenuOptions as MenuOptions,
    index_d$1_MenuScene as MenuScene,
  };
}

interface BorderOptions extends WidgetOpts {
    width: number;
    height: number;
    ascii?: boolean;
}
declare class Border extends Widget {
    ascii: boolean;
    constructor(opts: BorderOptions);
    contains(): boolean;
    _draw(buffer: Buffer$1): boolean;
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
    constructor(opts: FieldsetOptions);
    _adjustBounds(pad: [number, number, number, number]): this;
    get _labelLeft(): number;
    get _dataLeft(): number;
    get _nextY(): number;
    add(label: string, format: string | FieldOptions): this;
    _setData(v: Record<string, any>): void;
    _setDataItem(key: string, v: any): void;
}
interface FieldOptions extends WidgetOpts {
    format: string | Template;
}
declare class Field extends Text {
    _format: Template;
    constructor(opts: FieldOptions);
    format(v: any): this;
}

interface OrderedListOptions extends WidgetOpts {
    pad?: number;
}
declare class OrderedList extends Widget {
    static default: {
        pad: number;
    };
    _fixedWidth: boolean;
    _fixedHeight: boolean;
    constructor(opts: OrderedListOptions);
    addChild(w: Widget): void;
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
    constructor(opts: UnorderedListOptions);
    _getBullet(_index: number): string;
}

interface InputOptions extends TextOptions {
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
    constructor(opts: InputOptions);
    reset(): void;
    _setProp(name: string, v: PropType): void;
    isValid(): boolean;
    keypress(ev: Event): void;
    click(e: Event): void;
    text(): string;
    text(v: string): this;
    _draw(buffer: Buffer$1, _force?: boolean): boolean;
}

interface DataListOptions extends ColumnOptions, WidgetOpts {
    size?: number;
    rowHeight?: number;
    hover?: HoverType;
    headerTag?: string;
    dataTag?: string;
    prefix?: PrefixType;
    data?: DataItem[];
    border?: boolean | BorderType;
}
declare class DataList extends DataTable {
    constructor(opts: DataListOptions);
}

interface MenubarOptions extends WidgetOpts {
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
    constructor(opts: MenubarOptions);
    _initButtons(opts: MenubarOptions): void;
}

interface SelectOptions extends WidgetOpts {
    text: string;
    buttons: DropdownConfig;
    buttonClass?: string;
    buttonTag?: string;
}
declare class Select extends Widget {
    dropdown: Text;
    menu: Menu;
    constructor(opts: SelectOptions);
    _initText(opts: SelectOptions): void;
    _initMenu(opts: SelectOptions): void;
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
interface ChoiceOptions extends WidgetOpts {
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
    _text: Widget;
    _list: DataList;
    _info: Text;
    _prompt: Prompt | null;
    _done: null | ((v: any) => void);
    constructor(opts: ChoiceOptions);
    get prompt(): Prompt | null;
    showPrompt(prompt: Prompt, arg?: any): Promise<any>;
    _addList(): this;
    _addInfo(): this;
    _addLegend(): this;
    _draw(buffer: Buffer$1): boolean;
}
declare class Inquiry {
    widget: Choice;
    _prompts: Prompt[];
    events: Record<string, EventCb[]>;
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
    _keypress(_n: string, _w: Widget | null, e: Event): boolean;
    _change(_n: string, _w: Widget | null, p: Prompt): boolean;
    on(event: string, cb: EventCb): this;
    off(event: string, cb?: EventCb): this;
    _fireEvent(name: string, source: Widget | null, args?: any): boolean;
}

interface CheckboxOptions extends TextOptions {
    uncheck?: string;
    check?: string;
    checked?: boolean;
    pad?: number;
    value?: string | [string, string];
}
declare class Checkbox extends Text {
    static default: {
        uncheck: string;
        check: string;
        pad: number;
        value: string;
    };
    constructor(opts: CheckboxOptions);
    value(): string;
    text(): string;
    text(v: string): this;
    keypress(ev: Event): void;
    _draw(buffer: Buffer$1): boolean;
}

declare class Builder {
    scene: Scene;
    _opts: WidgetOpts;
    constructor(scene: Scene);
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
    clear(color?: ColorBase): this;
    text(info?: TextOptions | string, opts?: TextOptions): Text;
    border(opts: BorderOptions): Border;
    button(opts: ButtonOptions): Button;
    checkbox(opts: CheckboxOptions): Checkbox;
    input(opts: InputOptions): Input;
    fieldset(opts: FieldsetOptions): Fieldset;
    datatable(opts: DataTableOptions): DataTable;
    datalist(opts: DataListOptions): DataList;
    menubar(opts: MenubarOptions): Menubar;
}

interface WidgetMake<T> extends WidgetOpts {
    with?: T;
}
declare function make<T>(opts: WidgetMake<T>): Widget & T;

type index_d_DataValue = DataValue;
type index_d_DataObject = DataObject;
type index_d_DataItem = DataItem;
type index_d_DataType = DataType;
type index_d_EventCb = EventCb;
type index_d_UpdatePosOpts = UpdatePosOpts;
type index_d_SetParentOptions = SetParentOptions;
type index_d_WidgetOpts = WidgetOpts;
type index_d_PropType = PropType;
type index_d_Widget = Widget;
declare const index_d_Widget: typeof Widget;
declare const index_d_alignChildren: typeof alignChildren;
declare const index_d_spaceChildren: typeof spaceChildren;
declare const index_d_wrapChildren: typeof wrapChildren;
type index_d_TextOptions = TextOptions;
type index_d_Text = Text;
declare const index_d_Text: typeof Text;
type index_d_BorderOptions = BorderOptions;
type index_d_Border = Border;
declare const index_d_Border: typeof Border;
declare const index_d_drawBorder: typeof drawBorder;
type index_d_ButtonOptions = ButtonOptions;
type index_d_Button = Button;
declare const index_d_Button: typeof Button;
type index_d_PadInfo = PadInfo;
type index_d_DialogOptions = DialogOptions;
declare const index_d_toPadArray: typeof toPadArray;
type index_d_Dialog = Dialog;
declare const index_d_Dialog: typeof Dialog;
type index_d_AddDialogOptions = AddDialogOptions;
declare const index_d_dialog: typeof dialog;
type index_d_FieldsetOptions = FieldsetOptions;
type index_d_Fieldset = Fieldset;
declare const index_d_Fieldset: typeof Fieldset;
type index_d_FieldOptions = FieldOptions;
type index_d_Field = Field;
declare const index_d_Field: typeof Field;
type index_d_OrderedListOptions = OrderedListOptions;
type index_d_OrderedList = OrderedList;
declare const index_d_OrderedList: typeof OrderedList;
type index_d_UnorderedListOptions = UnorderedListOptions;
type index_d_UnorderedList = UnorderedList;
declare const index_d_UnorderedList: typeof UnorderedList;
type index_d_InputOptions = InputOptions;
type index_d_Input = Input;
declare const index_d_Input: typeof Input;
type index_d_PrefixType = PrefixType;
type index_d_FormatFn = FormatFn;
type index_d_SelectType = SelectType;
type index_d_HoverType = HoverType;
type index_d_BorderType = BorderType;
type index_d_ColumnOptions = ColumnOptions;
type index_d_DataTableOptions = DataTableOptions;
type index_d_Column = Column;
declare const index_d_Column: typeof Column;
type index_d_DataTable = DataTable;
declare const index_d_DataTable: typeof DataTable;
type index_d_DataListOptions = DataListOptions;
type index_d_DataList = DataList;
declare const index_d_DataList: typeof DataList;
type index_d_Rec<T> = Rec<T>;
type index_d_DropdownConfig = DropdownConfig;
type index_d_ActionConfig = ActionConfig;
type index_d_ButtonConfig = ButtonConfig;
type index_d_Menu = Menu;
declare const index_d_Menu: typeof Menu;
type index_d_MenuButtonOptions = MenuButtonOptions;
type index_d_MenuButton = MenuButton;
declare const index_d_MenuButton: typeof MenuButton;
type index_d_MenubarOptions = MenubarOptions;
type index_d_Menubar = Menubar;
declare const index_d_Menubar: typeof Menubar;
type index_d_SelectOptions = SelectOptions;
type index_d_Select = Select;
declare const index_d_Select: typeof Select;
type index_d_NextType = NextType;
type index_d_PromptChoice = PromptChoice;
type index_d_PromptOptions = PromptOptions;
type index_d_Prompt = Prompt;
declare const index_d_Prompt: typeof Prompt;
type index_d_ChoiceOptions = ChoiceOptions;
type index_d_Choice = Choice;
declare const index_d_Choice: typeof Choice;
type index_d_Inquiry = Inquiry;
declare const index_d_Inquiry: typeof Inquiry;
type index_d_Builder = Builder;
declare const index_d_Builder: typeof Builder;
type index_d_WidgetMake<T> = WidgetMake<T>;
declare const index_d_make: typeof make;
declare namespace index_d {
  export {
    index_d_DataValue as DataValue,
    index_d_DataObject as DataObject,
    index_d_DataItem as DataItem,
    index_d_DataType as DataType,
    index_d_EventCb as EventCb,
    index_d_UpdatePosOpts as UpdatePosOpts,
    index_d_SetParentOptions as SetParentOptions,
    index_d_WidgetOpts as WidgetOpts,
    index_d_PropType as PropType,
    index_d_Widget as Widget,
    index_d_alignChildren as alignChildren,
    index_d_spaceChildren as spaceChildren,
    index_d_wrapChildren as wrapChildren,
    index_d_TextOptions as TextOptions,
    index_d_Text as Text,
    index_d_BorderOptions as BorderOptions,
    index_d_Border as Border,
    index_d_drawBorder as drawBorder,
    index_d_ButtonOptions as ButtonOptions,
    index_d_Button as Button,
    index_d_PadInfo as PadInfo,
    index_d_DialogOptions as DialogOptions,
    index_d_toPadArray as toPadArray,
    index_d_Dialog as Dialog,
    index_d_AddDialogOptions as AddDialogOptions,
    index_d_dialog as dialog,
    index_d_FieldsetOptions as FieldsetOptions,
    index_d_Fieldset as Fieldset,
    index_d_FieldOptions as FieldOptions,
    index_d_Field as Field,
    index_d_OrderedListOptions as OrderedListOptions,
    index_d_OrderedList as OrderedList,
    index_d_UnorderedListOptions as UnorderedListOptions,
    index_d_UnorderedList as UnorderedList,
    index_d_InputOptions as InputOptions,
    index_d_Input as Input,
    index_d_PrefixType as PrefixType,
    index_d_FormatFn as FormatFn,
    index_d_SelectType as SelectType,
    index_d_HoverType as HoverType,
    index_d_BorderType as BorderType,
    index_d_ColumnOptions as ColumnOptions,
    index_d_DataTableOptions as DataTableOptions,
    index_d_Column as Column,
    index_d_DataTable as DataTable,
    index_d_DataListOptions as DataListOptions,
    index_d_DataList as DataList,
    index_d_Rec as Rec,
    index_d_DropdownConfig as DropdownConfig,
    index_d_ActionConfig as ActionConfig,
    index_d_ButtonConfig as ButtonConfig,
    MenuOptions$1 as MenuOptions,
    index_d_Menu as Menu,
    index_d_MenuButtonOptions as MenuButtonOptions,
    index_d_MenuButton as MenuButton,
    index_d_MenubarOptions as MenubarOptions,
    index_d_Menubar as Menubar,
    index_d_SelectOptions as SelectOptions,
    index_d_Select as Select,
    index_d_NextType as NextType,
    index_d_PromptChoice as PromptChoice,
    index_d_PromptOptions as PromptOptions,
    index_d_Prompt as Prompt,
    index_d_ChoiceOptions as ChoiceOptions,
    index_d_Choice as Choice,
    index_d_Inquiry as Inquiry,
    index_d_Builder as Builder,
    index_d_WidgetMake as WidgetMake,
    index_d_make as make,
  };
}

export { ERROR, FALSE, IDENTITY, IS_NONZERO, IS_ZERO, NOOP, ONE, TRUE, WARN, ZERO, index_d$5 as app, arrayDelete, arrayFindRight, arrayIncludesAll, arrayInsert, arrayNext, arrayNullify, arrayPrev, arrayRevEach, arraysIntersect, blob_d as blob, buffer_d as buffer, index_d$4 as canvas, clamp, index_d$9 as color, colors, cosmetic, data_d as data, events_d as events, first, flag_d as flag, index_d$7 as fov, frequency_d as frequency, grid_d as grid, lerp$1 as lerp, index_d$2 as light, list_d as list, message_d as message, nextIndex, object_d as object, index_d$6 as path, prevIndex, queue_d as queue, random, range_d as range, rng_d as rng, scheduler_d as scheduler, index_d$3 as sprite, sum, tags_d as tags, index_d$8 as text, tween_d as tween, types_d as types, index_d$1 as ui, index_d as widget, xave, xy_d as xy };
