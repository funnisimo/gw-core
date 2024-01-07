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

type index$9_ColorData = ColorData;
type index$9_ColorBase = ColorBase;
type index$9_LightValue = LightValue;
declare const index$9_colors: typeof colors;
type index$9_Color = Color;
declare const index$9_Color: typeof Color;
declare const index$9_fromArray: typeof fromArray;
declare const index$9_fromCss: typeof fromCss;
declare const index$9_fromName: typeof fromName;
declare const index$9_fromNumber: typeof fromNumber;
declare const index$9_separate: typeof separate;
declare const index$9_relativeLuminance: typeof relativeLuminance;
declare const index$9_distance: typeof distance;
declare const index$9_smoothScalar: typeof smoothScalar;
declare const index$9_installSpread: typeof installSpread;
declare const index$9_NONE: typeof NONE;
declare const index$9_BLACK: typeof BLACK;
declare const index$9_WHITE: typeof WHITE;
declare namespace index$9 {
  export {
    index$9_ColorData as ColorData,
    index$9_ColorBase as ColorBase,
    index$9_LightValue as LightValue,
    index$9_colors as colors,
    index$9_Color as Color,
    index$9_fromArray as fromArray,
    index$9_fromCss as fromCss,
    index$9_fromName as fromName,
    index$9_fromNumber as fromNumber,
    make$e as make,
    from$4 as from,
    index$9_separate as separate,
    index$9_relativeLuminance as relativeLuminance,
    index$9_distance as distance,
    index$9_smoothScalar as smoothScalar,
    install$2 as install,
    index$9_installSpread as installSpread,
    index$9_NONE as NONE,
    index$9_BLACK as BLACK,
    index$9_WHITE as WHITE,
  };
}

declare type Loc$1 = [number, number];
interface XY {
    x: number;
    y: number;
}
declare type Pos = Loc$1 | XY;
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

type types_XY = XY;
type types_Pos = Pos;
type types_Size = Size;
type types_EachCb<T> = EachCb<T>;
type types_RandomFunction = RandomFunction;
type types_SeedFunction = SeedFunction;
type types_RandomConfig = RandomConfig;
type types_WeightedArray = WeightedArray;
type types_WeightedObject = WeightedObject;
declare namespace types {
  export {
    Loc$1 as Loc,
    types_XY as XY,
    types_Pos as Pos,
    types_Size as Size,
    SpriteData$1 as SpriteData,
    types_EachCb as EachCb,
    types_RandomFunction as RandomFunction,
    types_SeedFunction as SeedFunction,
    types_RandomConfig as RandomConfig,
    types_WeightedArray as WeightedArray,
    types_WeightedObject as WeightedObject,
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
declare function asLoc(v: Pos): Loc$1;
declare function asXY(v: Pos): XY;
declare function x(src: XY | Loc$1): number;
declare function y(src: XY | Loc$1): number;
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
    contains(loc: Loc$1 | XY): boolean;
    include(xy: Loc$1 | XY | Bounds): void;
    pad(n?: number): void;
    forEach(cb: XYFunc): void;
    toString(): string;
}
declare function copy(dest: XY, src: XY | Loc$1): void;
declare function addTo(dest: XY, src: XY | Loc$1): void;
declare function add(a: XY, b: XY | Loc$1): XY;
declare function add(a: Loc$1, b: XY | Loc$1): Loc$1;
declare function equals(dest: XY | Loc$1 | null | undefined, src: XY | Loc$1 | null | undefined): boolean;
declare function isDiagonal(xy: XY | Loc$1): boolean;
declare function lerp(a: XY | Loc$1, b: XY | Loc$1, pct: number): number[];
declare type XYFunc = (x: number, y: number) => void;
declare type NeighborFunc = (x: number, y: number, dir: Loc$1) => void;
declare function eachNeighbor(x: number, y: number, fn: NeighborFunc, only4dirs?: boolean): void;
declare function eachNeighborAsync(x: number, y: number, fn: NeighborFunc, only4dirs?: boolean): Promise<void>;
declare type XYMatchFunc = (x: number, y: number) => boolean;
declare type NeighborMatchFunc = (x: number, y: number, dir: Loc$1) => boolean;
declare function matchingNeighbor(x: number, y: number, matchFn: NeighborMatchFunc, only4dirs?: boolean): Loc$1;
declare function straightDistanceBetween(x1: number, y1: number, x2: number, y2: number): number;
declare function maxAxisFromTo(a: XY | Loc$1, b: XY | Loc$1): number;
declare function maxAxisBetween(x1: number, y1: number, x2: number, y2: number): number;
declare function distanceBetween(x1: number, y1: number, x2: number, y2: number): number;
declare function distanceFromTo(a: XY | Loc$1, b: XY | Loc$1): number;
declare function calcRadius(x: number, y: number): number;
declare function dirBetween(x: number, y: number, toX: number, toY: number): Loc$1;
declare function dirFromTo(a: XY | Loc$1, b: XY | Loc$1): Loc$1;
declare function dirIndex(dir: XY | Loc$1): number;
declare function isOppositeDir(a: Loc$1, b: Loc$1): boolean;
declare function isSameDir(a: Loc$1, b: Loc$1): boolean;
declare function dirSpread(dir: Loc$1): [Loc$1, Loc$1, Loc$1];
declare function stepFromTo(a: XY | Loc$1, b: XY | Loc$1, fn: (x: number, y: number) => any): void;
declare function forLine(x: number, y: number, dir: Loc$1, length: number, fn: (x: number, y: number) => any): void;
declare function forLineBetween(fromX: number, fromY: number, toX: number, toY: number, stepFn: (x: number, y: number) => boolean | void): boolean;
declare function forLineFromTo(a: XY | Loc$1, b: XY | Loc$1, stepFn: (x: number, y: number) => boolean | void): boolean;
declare function getLine(fromX: number, fromY: number, toX: number, toY: number): Loc$1[];
declare function getLineThru(fromX: number, fromY: number, toX: number, toY: number, width: number, height: number): Loc$1[];
declare function forCircle(x: number, y: number, radius: number, fn: XYFunc): void;
declare function forRect(width: number, height: number, fn: XYFunc): void;
declare function forRect(x: number, y: number, width: number, height: number, fn: XYFunc): void;
declare function dumpRect(left: number, top: number, width: number, height: number, fmtFn: (x: number, y: number) => string, log?: {
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
}): void;
declare function dumpAround(x: number, y: number, radius: number, fmtFn: (x: number, y: number) => string, log?: {
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
}): void;
declare function forBorder(width: number, height: number, fn: XYFunc): void;
declare function forBorder(x: number, y: number, width: number, height: number, fn: XYFunc): void;
declare function arcCount(x: number, y: number, testFn: XYMatchFunc): number;
declare function closestMatchingLocs(x: number, y: number, matchFn: XYMatchFunc): Loc$1[] | null;

type xy_XY = XY;
type xy_Size = Size;
type xy_Pos = Pos;
declare const xy_DIRS: typeof DIRS;
declare const xy_NO_DIRECTION: typeof NO_DIRECTION;
declare const xy_UP: typeof UP;
declare const xy_RIGHT: typeof RIGHT;
declare const xy_DOWN: typeof DOWN;
declare const xy_LEFT: typeof LEFT;
declare const xy_RIGHT_UP: typeof RIGHT_UP;
declare const xy_RIGHT_DOWN: typeof RIGHT_DOWN;
declare const xy_LEFT_DOWN: typeof LEFT_DOWN;
declare const xy_LEFT_UP: typeof LEFT_UP;
declare const xy_CLOCK_DIRS: typeof CLOCK_DIRS;
declare const xy_isLoc: typeof isLoc;
declare const xy_isXY: typeof isXY;
declare const xy_asLoc: typeof asLoc;
declare const xy_asXY: typeof asXY;
declare const xy_x: typeof x;
declare const xy_y: typeof y;
declare const xy_contains: typeof contains;
type xy_BoundsOpts = BoundsOpts;
type xy_Bounds = Bounds;
declare const xy_Bounds: typeof Bounds;
declare const xy_copy: typeof copy;
declare const xy_addTo: typeof addTo;
declare const xy_add: typeof add;
declare const xy_equals: typeof equals;
declare const xy_isDiagonal: typeof isDiagonal;
declare const xy_lerp: typeof lerp;
type xy_XYFunc = XYFunc;
type xy_NeighborFunc = NeighborFunc;
declare const xy_eachNeighbor: typeof eachNeighbor;
declare const xy_eachNeighborAsync: typeof eachNeighborAsync;
type xy_XYMatchFunc = XYMatchFunc;
type xy_NeighborMatchFunc = NeighborMatchFunc;
declare const xy_matchingNeighbor: typeof matchingNeighbor;
declare const xy_straightDistanceBetween: typeof straightDistanceBetween;
declare const xy_maxAxisFromTo: typeof maxAxisFromTo;
declare const xy_maxAxisBetween: typeof maxAxisBetween;
declare const xy_distanceBetween: typeof distanceBetween;
declare const xy_distanceFromTo: typeof distanceFromTo;
declare const xy_calcRadius: typeof calcRadius;
declare const xy_dirBetween: typeof dirBetween;
declare const xy_dirFromTo: typeof dirFromTo;
declare const xy_dirIndex: typeof dirIndex;
declare const xy_isOppositeDir: typeof isOppositeDir;
declare const xy_isSameDir: typeof isSameDir;
declare const xy_dirSpread: typeof dirSpread;
declare const xy_stepFromTo: typeof stepFromTo;
declare const xy_forLine: typeof forLine;
declare const xy_forLineBetween: typeof forLineBetween;
declare const xy_forLineFromTo: typeof forLineFromTo;
declare const xy_getLine: typeof getLine;
declare const xy_getLineThru: typeof getLineThru;
declare const xy_forCircle: typeof forCircle;
declare const xy_forRect: typeof forRect;
declare const xy_dumpRect: typeof dumpRect;
declare const xy_dumpAround: typeof dumpAround;
declare const xy_forBorder: typeof forBorder;
declare const xy_arcCount: typeof arcCount;
declare const xy_closestMatchingLocs: typeof closestMatchingLocs;
declare namespace xy {
  export {
    Loc$1 as Loc,
    xy_XY as XY,
    xy_Size as Size,
    xy_Pos as Pos,
    xy_DIRS as DIRS,
    xy_NO_DIRECTION as NO_DIRECTION,
    xy_UP as UP,
    xy_RIGHT as RIGHT,
    xy_DOWN as DOWN,
    xy_LEFT as LEFT,
    xy_RIGHT_UP as RIGHT_UP,
    xy_RIGHT_DOWN as RIGHT_DOWN,
    xy_LEFT_DOWN as LEFT_DOWN,
    xy_LEFT_UP as LEFT_UP,
    xy_CLOCK_DIRS as CLOCK_DIRS,
    xy_isLoc as isLoc,
    xy_isXY as isXY,
    xy_asLoc as asLoc,
    xy_asXY as asXY,
    xy_x as x,
    xy_y as y,
    xy_contains as contains,
    xy_BoundsOpts as BoundsOpts,
    xy_Bounds as Bounds,
    xy_copy as copy,
    xy_addTo as addTo,
    xy_add as add,
    xy_equals as equals,
    xy_isDiagonal as isDiagonal,
    xy_lerp as lerp,
    xy_XYFunc as XYFunc,
    xy_NeighborFunc as NeighborFunc,
    xy_eachNeighbor as eachNeighbor,
    xy_eachNeighborAsync as eachNeighborAsync,
    xy_XYMatchFunc as XYMatchFunc,
    xy_NeighborMatchFunc as NeighborMatchFunc,
    xy_matchingNeighbor as matchingNeighbor,
    xy_straightDistanceBetween as straightDistanceBetween,
    xy_maxAxisFromTo as maxAxisFromTo,
    xy_maxAxisBetween as maxAxisBetween,
    xy_distanceBetween as distanceBetween,
    xy_distanceFromTo as distanceFromTo,
    xy_calcRadius as calcRadius,
    xy_dirBetween as dirBetween,
    xy_dirFromTo as dirFromTo,
    xy_dirIndex as dirIndex,
    xy_isOppositeDir as isOppositeDir,
    xy_isSameDir as isSameDir,
    xy_dirSpread as dirSpread,
    xy_stepFromTo as stepFromTo,
    xy_forLine as forLine,
    xy_forLineBetween as forLineBetween,
    xy_forLineFromTo as forLineFromTo,
    xy_getLine as getLine,
    xy_getLineThru as getLineThru,
    xy_forCircle as forCircle,
    xy_forRect as forRect,
    xy_dumpRect as dumpRect,
    xy_dumpAround as dumpAround,
    xy_forBorder as forBorder,
    xy_arcCount as arcCount,
    xy_closestMatchingLocs as closestMatchingLocs,
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

type list_ListEntry<T> = ListEntry<T>;
type list_ListItem<T> = ListItem<T>;
type list_ListObject = ListObject;
type list_ListSort<T> = ListSort<T>;
type list_ListMatch<T> = ListMatch<T>;
type list_ListEachFn<T> = ListEachFn<T>;
type list_ListReduceFn<T> = ListReduceFn<T>;
declare const list_at: typeof at;
declare const list_includes: typeof includes;
declare const list_forEach: typeof forEach;
declare const list_push: typeof push;
declare const list_remove: typeof remove;
declare const list_find: typeof find;
declare const list_insert: typeof insert;
declare const list_reduce: typeof reduce;
declare const list_some: typeof some;
declare const list_every: typeof every;
declare namespace list {
  export {
    list_ListEntry as ListEntry,
    list_ListItem as ListItem,
    list_ListObject as ListObject,
    list_ListSort as ListSort,
    list_ListMatch as ListMatch,
    list_ListEachFn as ListEachFn,
    list_ListReduceFn as ListReduceFn,
    length$1 as length,
    list_at as at,
    list_includes as includes,
    list_forEach as forEach,
    list_push as push,
    list_remove as remove,
    list_find as find,
    list_insert as insert,
    list_reduce as reduce,
    list_some as some,
    list_every as every,
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
declare type AnyObj = Record<string, any>;
declare function copyObject(dest: AnyObj, src: AnyObj): AnyObj;
declare function assignObject(dest: AnyObj, src: AnyObj): AnyObj;
declare function assignOmitting(omit: string | string[], dest: AnyObj, src: AnyObj): AnyObj;
declare function setDefault(obj: AnyObj, field: string, val: any): void;
declare type AssignCallback = (dest: AnyObj, key: string, current: any, def: any) => boolean;
declare function setDefaults(obj: AnyObj, def: AnyObj | null | undefined, custom?: AssignCallback | null): void;
declare function setOptions(obj: AnyObj, opts: AnyObj | null | undefined): void;
declare function kindDefaults(obj: AnyObj, def: AnyObj | null | undefined): void;
declare function pick(obj: AnyObj, ...fields: string[]): any;
declare function clearObject(obj: AnyObj): void;
declare function getOpt(obj: AnyObj, member: string, _default: any): any;
declare function firstOpt(field: string, ...args: any[]): any;

declare const object_getValue: typeof getValue;
type object_AnyObj = AnyObj;
declare const object_copyObject: typeof copyObject;
declare const object_assignObject: typeof assignObject;
declare const object_assignOmitting: typeof assignOmitting;
declare const object_setDefault: typeof setDefault;
type object_AssignCallback = AssignCallback;
declare const object_setDefaults: typeof setDefaults;
declare const object_setOptions: typeof setOptions;
declare const object_kindDefaults: typeof kindDefaults;
declare const object_pick: typeof pick;
declare const object_clearObject: typeof clearObject;
declare const object_getOpt: typeof getOpt;
declare const object_firstOpt: typeof firstOpt;
declare namespace object {
  export {
    object_getValue as getValue,
    object_AnyObj as AnyObj,
    object_copyObject as copyObject,
    object_assignObject as assignObject,
    object_assignOmitting as assignOmitting,
    object_setDefault as setDefault,
    object_AssignCallback as AssignCallback,
    object_setDefaults as setDefaults,
    object_setOptions as setOptions,
    object_kindDefaults as kindDefaults,
    object_pick as pick,
    object_clearObject as clearObject,
    object_getOpt as getOpt,
    object_firstOpt as firstOpt,
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
declare function make$d(seed?: number): Random;

type rng_WeightedArray = WeightedArray;
type rng_WeightedObject = WeightedObject;
type rng_RandomConfig = RandomConfig;
type rng_RandomFunction = RandomFunction;
declare const rng_Alea: typeof Alea;
type rng_Random = Random;
declare const rng_Random: typeof Random;
declare const rng_random: typeof random;
declare const rng_cosmetic: typeof cosmetic;
declare namespace rng {
  export {
    rng_WeightedArray as WeightedArray,
    rng_WeightedObject as WeightedObject,
    rng_RandomConfig as RandomConfig,
    rng_RandomFunction as RandomFunction,
    rng_Alea as Alea,
    configure$1 as configure,
    rng_Random as Random,
    rng_random as random,
    rng_cosmetic as cosmetic,
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

type range_RangeBase = RangeBase;
type range_Range = Range;
declare const range_Range: typeof Range;
declare const range_asFn: typeof asFn;
declare const range_value: typeof value;
declare namespace range {
  export {
    range_RangeBase as RangeBase,
    range_Range as Range,
    make$c as make,
    from$3 as from,
    range_asFn as asFn,
    range_value as value,
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

type tags_TagBase = TagBase;
type tags_Tags = Tags;
type tags_TagMatchFn = TagMatchFn;
type tags_TagMatchOptions = TagMatchOptions;
declare const tags_makeMatch: typeof makeMatch;
declare const tags_match: typeof match;
declare namespace tags {
  export {
    tags_TagBase as TagBase,
    tags_Tags as Tags,
    tags_TagMatchFn as TagMatchFn,
    tags_TagMatchOptions as TagMatchOptions,
    make$b as make,
    tags_makeMatch as makeMatch,
    tags_match as match,
  };
}

declare type FlagSource = number | string;
declare type FlagBase = FlagSource | FlagSource[] | null;
declare function fl(N: number): number;
declare function toString<T extends {}>(flagObj: T, value: number): string;
/**
 * Converts from a flag base to a flag.
 *
 * @param {Object} flagObj - The flag we are getting values from
 * @param {...FlagSource | FlagSource[]} args - The args to concatenate from flagObj
 * @returns {number}
 * @throws {Error} - If it encounters an unknown flag in args
 */
declare function from$2<T>(obj: T, ...args: (FlagBase | undefined)[]): number;
/**
 * Converts from a flag base to a flag.  Will not throw if an unknown flag is encountered.
 *
 * @param {Object} flagObj - The flag we are getting values from
 * @param {...FlagSource | FlagSource[]} args - The args to concatenate from flagObj
 * @returns {number}
 */
declare function from_safe<T>(flagObj: T, ...args: (FlagBase | undefined)[]): number;
declare function make$a(obj: Record<string, FlagBase> | string[] | string): Record<string, number>;

type flag_FlagBase = FlagBase;
declare const flag_fl: typeof fl;
declare const flag_toString: typeof toString;
declare const flag_from_safe: typeof from_safe;
declare namespace flag {
  export {
    flag_FlagBase as FlagBase,
    flag_fl as fl,
    flag_toString as toString,
    from$2 as from,
    flag_from_safe as from_safe,
    make$a as make,
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
    protected _resize(width: number, height: number, v: GridInit<number> | number): void;
    findReplaceRange(findValueMin: number, findValueMax: number, fillValue: number): void;
    floodFillRange(x: number, y: number, eligibleValueMin: number, eligibleValueMax: number, fillValue: number): number;
    invert(): void;
    leastPositiveValue(): number;
    randomLeastPositiveLoc(): Loc;
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

type grid_ArrayInit<T> = ArrayInit<T>;
declare const grid_makeArray: typeof makeArray;
type grid_GridInit<T> = GridInit<T>;
type grid_GridEach<T> = GridEach<T>;
type grid_AsyncGridEach<T> = AsyncGridEach<T>;
type grid_GridUpdate<T> = GridUpdate<T>;
type grid_GridMatch<T> = GridMatch<T>;
type grid_GridFormat<T> = GridFormat<T>;
type grid_Grid<T> = Grid<T>;
declare const grid_Grid: typeof Grid;
declare const grid_stats: typeof stats;
type grid_NumGrid = NumGrid;
declare const grid_NumGrid: typeof NumGrid;
type grid_GridZip<T, U> = GridZip<T, U>;
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
    grid_stats as stats,
    grid_NumGrid as NumGrid,
    alloc$1 as alloc,
    free$1 as free,
    make$9 as make,
    grid_GridZip as GridZip,
    grid_offsetZip as offsetZip,
    grid_intersection as intersection,
    grid_unite as unite,
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

type queue_AsyncQueue<T> = AsyncQueue<T>;
declare const queue_AsyncQueue: typeof AsyncQueue;
declare namespace queue {
  export {
    queue_AsyncQueue as AsyncQueue,
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
/**
 * Advances the number of chars given by passing any color information in the text
 * @param {string} text - The text to scan
 * @param {number} start - The index to start from
 * @param {number} count - The number of characters to skip
 * @returns - The new index in the string
 */
declare function advanceChars(text: string, start: number, count: number): number;
declare function findChar(text: string, matchFn: (ch: string, index: number) => boolean, start?: number): number;
declare function firstChar(text: string): string;
declare function startsWith(text: string, match: string | RegExp): boolean;
declare function padStart(text: string, width: number, pad?: string): string;
declare function padEnd(text: string, width: number, pad?: string): string;
declare function center(text: string, width: number, pad?: string): string;
declare function truncate(text: string, width: number): string;
/**
 * Capitalizes the first letter in the given text.
 *
 * @param {string} text - The text to capitalize
 * @returns {string} - The text with the first word capitalized
 */
declare function capitalize(text: string): string;
/**
 * Capitalizes the first letter all words of the given text.
 *
 * @param {string} text - The text to capitalize
 * @returns {string} - The text with the words capitalized
 */
declare function title_case(text: string): string;
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

declare const index$8_configure: typeof configure;
declare const index$8_apply: typeof apply;
type index$8_Template = Template;
type index$8_CompileOptions = CompileOptions;
declare const index$8_eachChar: typeof eachChar;
type index$8_EachOptions = EachOptions;
declare const index$8_wordWrap: typeof wordWrap;
declare const index$8_splitIntoLines: typeof splitIntoLines;
declare const index$8_addHelper: typeof addHelper;
declare const index$8_options: typeof options;
type index$8_Align = Align;
type index$8_VAlign = VAlign;
type index$8_View = View;
type index$8_HelperFn = HelperFn;
type index$8_HelperObj = HelperObj;
declare const index$8_length: typeof length;
declare const index$8_advanceChars: typeof advanceChars;
declare const index$8_findChar: typeof findChar;
declare const index$8_firstChar: typeof firstChar;
declare const index$8_startsWith: typeof startsWith;
declare const index$8_padStart: typeof padStart;
declare const index$8_padEnd: typeof padEnd;
declare const index$8_center: typeof center;
declare const index$8_truncate: typeof truncate;
declare const index$8_capitalize: typeof capitalize;
declare const index$8_title_case: typeof title_case;
declare const index$8_removeColors: typeof removeColors;
declare const index$8_spliceRaw: typeof spliceRaw;
declare const index$8_hash: typeof hash;
declare const index$8_splitArgs: typeof splitArgs;
declare const index$8_toSingularVerb: typeof toSingularVerb;
declare const index$8_toPluralVerb: typeof toPluralVerb;
declare const index$8_toSingularNoun: typeof toSingularNoun;
declare const index$8_toPluralNoun: typeof toPluralNoun;
declare const index$8_toQuantity: typeof toQuantity;
declare namespace index$8 {
  export {
    index$8_configure as configure,
    compile$1 as compile,
    index$8_apply as apply,
    index$8_Template as Template,
    index$8_CompileOptions as CompileOptions,
    index$8_eachChar as eachChar,
    index$8_EachOptions as EachOptions,
    index$8_wordWrap as wordWrap,
    index$8_splitIntoLines as splitIntoLines,
    index$8_addHelper as addHelper,
    index$8_options as options,
    index$8_Align as Align,
    index$8_VAlign as VAlign,
    index$8_View as View,
    index$8_HelperFn as HelperFn,
    index$8_HelperObj as HelperObj,
    index$8_length as length,
    index$8_advanceChars as advanceChars,
    index$8_findChar as findChar,
    index$8_firstChar as firstChar,
    index$8_startsWith as startsWith,
    index$8_padStart as padStart,
    index$8_padEnd as padEnd,
    index$8_center as center,
    index$8_truncate as truncate,
    index$8_capitalize as capitalize,
    index$8_title_case as title_case,
    index$8_removeColors as removeColors,
    index$8_spliceRaw as spliceRaw,
    index$8_hash as hash,
    index$8_splitArgs as splitArgs,
    index$8_toSingularVerb as toSingularVerb,
    index$8_toPluralVerb as toPluralVerb,
    index$8_toSingularNoun as toSingularNoun,
    index$8_toPluralNoun as toPluralNoun,
    index$8_toQuantity as toQuantity,
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

type buffer_DrawData = DrawData;
type buffer_BufferBase = BufferBase;
declare const buffer_BufferBase: typeof BufferBase;
declare namespace buffer {
  export {
    buffer_DrawData as DrawData,
    buffer_BufferBase as BufferBase,
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
    _castLight(row: number, startSlope: number, endSlope: number, xx: number, xy: number, yx: number, yy: number): void;
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

declare const index$7_FovFlags: typeof FovFlags;
type index$7_FovStrategy = FovStrategy;
type index$7_SetVisibleFn = SetVisibleFn;
type index$7_ViewportCb = ViewportCb;
type index$7_FovSite = FovSite;
type index$7_FovSubject = FovSubject;
type index$7_FovTracker = FovTracker;
type index$7_FOV = FOV;
declare const index$7_FOV: typeof FOV;
declare const index$7_calculate: typeof calculate;
type index$7_FovChangeFn = FovChangeFn;
type index$7_FovNoticer = FovNoticer;
type index$7_FovSystemOptions = FovSystemOptions;
type index$7_FovSystem = FovSystem;
declare const index$7_FovSystem: typeof FovSystem;
declare namespace index$7 {
  export {
    index$7_FovFlags as FovFlags,
    index$7_FovStrategy as FovStrategy,
    index$7_SetVisibleFn as SetVisibleFn,
    index$7_ViewportCb as ViewportCb,
    index$7_FovSite as FovSite,
    index$7_FovSubject as FovSubject,
    index$7_FovTracker as FovTracker,
    index$7_FOV as FOV,
    index$7_calculate as calculate,
    index$7_FovChangeFn as FovChangeFn,
    index$7_FovNoticer as FovNoticer,
    index$7_FovSystemOptions as FovSystemOptions,
    index$7_FovSystem as FovSystem,
  };
}

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
    _width: number;
    _height: number;
    constructor();
    constructor(width: number, height: number);
    get width(): number;
    get height(): number;
    copy(other: DijkstraMap): void;
    hasXY(x: number, y: number): boolean;
    reset(width: number, height: number, distance?: number): void;
    _get(pos: Pos): Item;
    _get(x: number, y: number): Item;
    setGoal(pos: Pos, cost?: number): void;
    setGoal(x: number, y: number, cost?: number): void;
    setDistance(x: number, y: number, distance: number): void;
    _add(x: number, y: number, distance: number, cost: number): boolean;
    _insert(item: Item): boolean;
    calculate(costFn: SimpleCostFn, only4dirs?: boolean): void;
    rescan(costFn: SimpleCostFn, only4dirs?: boolean): void;
    getDistance(x: number, y: number): number;
    addObstacle(x: number, y: number, costFn: SimpleCostFn, radius: number, penalty?: number): void;
    nextDir(fromX: number, fromY: number, isBlocked: XYMatchFunc, only4dirs?: boolean): Loc$1 | null;
    getPath(fromX: number, fromY: number, isBlocked: XYMatchFunc, only4dirs?: boolean): Loc$1[] | null;
    forPath(fromX: number, fromY: number, isBlocked: XYMatchFunc, pathFn: XYFunc, only4dirs?: boolean): number;
    update(fn: UpdateFn): void;
    add(other: DijkstraMap): void;
    forEach(fn: EachFn): void;
    dump(fmtFn?: (v: number) => string, log?: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    }): void;
    dumpRect(left: number, top: number, width: number, height: number, fmtFn?: (v: number) => string, log?: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    }): void;
    dumpAround(x: number, y: number, radius: number, fmtFn?: (v: number) => string, log?: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    }): void;
    _dumpTodo(): string[];
}
declare function computeDistances(grid: NumGrid, from: Pos, costFn?: SimpleCostFn, only4dirs?: boolean): void;
declare function alloc(): DijkstraMap;
declare function free(map: DijkstraMap): void;

declare type CostFn = (x: number, y: number) => number;
declare function fromTo(from: Pos, to: Pos, costFn?: CostFn, only4dirs?: boolean): Loc$1[];

type index$6_SimpleCostFn = SimpleCostFn;
type index$6_UpdateFn = UpdateFn;
type index$6_EachFn = EachFn;
declare const index$6_OK: typeof OK;
declare const index$6_AVOIDED: typeof AVOIDED;
declare const index$6_BLOCKED: typeof BLOCKED;
declare const index$6_OBSTRUCTION: typeof OBSTRUCTION;
declare const index$6_NOT_DONE: typeof NOT_DONE;
type index$6_DijkstraMap = DijkstraMap;
declare const index$6_DijkstraMap: typeof DijkstraMap;
declare const index$6_computeDistances: typeof computeDistances;
declare const index$6_alloc: typeof alloc;
declare const index$6_free: typeof free;
type index$6_CostFn = CostFn;
declare const index$6_fromTo: typeof fromTo;
declare namespace index$6 {
  export {
    index$6_SimpleCostFn as SimpleCostFn,
    index$6_UpdateFn as UpdateFn,
    index$6_EachFn as EachFn,
    index$6_OK as OK,
    index$6_AVOIDED as AVOIDED,
    index$6_BLOCKED as BLOCKED,
    index$6_OBSTRUCTION as OBSTRUCTION,
    index$6_NOT_DONE as NOT_DONE,
    index$6_DijkstraMap as DijkstraMap,
    index$6_computeDistances as computeDistances,
    index$6_alloc as alloc,
    index$6_free as free,
    index$6_CostFn as CostFn,
    index$6_fromTo as fromTo,
  };
}

declare type FrequencyFn = (danger: number) => number;
declare type FrequencyConfig = FrequencyFn | number | string | Record<string, number | FrequencyFn> | null;
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

type scheduler_Scheduler = Scheduler;
declare const scheduler_Scheduler: typeof Scheduler;
declare namespace scheduler {
  export {
    scheduler_Scheduler as Scheduler,
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
    constructor(ctx?: any, events?: CallbackObj);
    has(name: string): boolean;
    on(cfg: CallbackObj): CancelFn;
    on(ev: string | string[], fn: CallbackFn): CancelFn;
    once(ev: string | string[], fn: CallbackFn): CancelFn;
    off(ev: string | string[], cb?: CallbackFn): void;
    trigger(ev: string | string[], ...args: any[]): boolean;
    _unhandled(ev: string, args: any[]): boolean;
    clear(): void;
    clear_event(name: string): void;
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

type data_Data = Data;
declare const data_Data: typeof Data;
declare namespace data {
  export {
    data_Data as Data,
  };
}

declare type Callback = () => void;
declare class Loop {
    _timer: number;
    get isRunning(): boolean;
    start(cb: Callback, dt?: number): void;
    stop(): void;
}

declare type TweenCb<T> = (obj: T, dt: number) => any;
declare type TweenFinishCb<T> = (obj: T, success: boolean) => any;
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
interface TweenUpdate {
    isRunning(): boolean;
    update(dt: number): void;
}
declare class Tween<T> extends BaseObj<Tween<T>> implements TweenUpdate {
    _obj: T;
    _repeat: number;
    _count: number;
    _from: boolean;
    _duration: number;
    _delay: number;
    _repeatDelay: number;
    _yoyo: boolean;
    _time: number;
    _startTime: number;
    _goal: Partial<Record<keyof T, any>>;
    _start: Partial<Record<keyof T, any>>;
    _success: boolean;
    _easing: EasingFn;
    _interpolate: InterpolateFn;
    constructor(src: T);
    isRunning(): boolean;
    onStart(cb: TweenCb<T>): this;
    onUpdate(cb: TweenCb<T>): this;
    onRepeat(cb: TweenCb<T>): this;
    onFinish(cb: TweenFinishCb<T>): this;
    to(goal: Partial<Record<keyof T, any>>, dynamic?: boolean | Array<keyof T>): this;
    from(start: Partial<Record<keyof T, any>>, dynamic?: boolean | Array<keyof T>): this;
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
        add: (tween: Tween<T>) => void;
    }): this;
    update(dt: number): void;
    _restart(): void;
    stop(success?: boolean): void;
    _updateProperties(obj: T, start: Partial<T>, goal: Partial<T>, pct: number): boolean;
}
declare function make$6<T>(src: T, duration?: number): Tween<T>;
declare const move: typeof make$6;
declare function linear(pct: number): number;
declare function interpolate(start: any, goal: any, pct: number): any;

type tween_TweenCb<T> = TweenCb<T>;
type tween_TweenFinishCb<T> = TweenFinishCb<T>;
type tween_EasingFn = EasingFn;
type tween_InterpolateFn = InterpolateFn;
type tween_BaseObj<T extends {
    update(t: number): void;
}> = BaseObj<T>;
declare const tween_BaseObj: typeof BaseObj;
type tween_TweenUpdate = TweenUpdate;
type tween_Tween<T> = Tween<T>;
declare const tween_Tween: typeof Tween;
declare const tween_move: typeof move;
declare const tween_linear: typeof linear;
declare const tween_interpolate: typeof interpolate;
declare namespace tween {
  export {
    tween_TweenCb as TweenCb,
    tween_TweenFinishCb as TweenFinishCb,
    tween_EasingFn as EasingFn,
    tween_InterpolateFn as InterpolateFn,
    tween_BaseObj as BaseObj,
    tween_TweenUpdate as TweenUpdate,
    tween_Tween as Tween,
    make$6 as make,
    tween_move as move,
    tween_linear as linear,
    tween_interpolate as interpolate,
  };
}

declare class Tweens {
    _tweens: TweenUpdate[];
    constructor();
    get length(): number;
    clear(): void;
    add(tween: TweenUpdate): void;
    remove(tween: TweenUpdate): void;
    update(dt: number): void;
}

type index$5_EventType = EventType;
type index$5_Event = Event;
declare const index$5_Event: typeof Event;
type index$5_ControlFn = ControlFn;
type index$5_EventFn = EventFn;
type index$5_IOMap = IOMap;
type index$5_EventMatchFn = EventMatchFn;
declare const index$5_KEYPRESS: typeof KEYPRESS;
declare const index$5_MOUSEMOVE: typeof MOUSEMOVE;
declare const index$5_CLICK: typeof CLICK;
declare const index$5_TICK: typeof TICK;
declare const index$5_MOUSEUP: typeof MOUSEUP;
declare const index$5_STOP: typeof STOP;
declare const index$5_isControlCode: typeof isControlCode;
declare const index$5_recycleEvent: typeof recycleEvent;
declare const index$5_makeStopEvent: typeof makeStopEvent;
declare const index$5_makeCustomEvent: typeof makeCustomEvent;
declare const index$5_makeTickEvent: typeof makeTickEvent;
declare const index$5_makeKeyEvent: typeof makeKeyEvent;
declare const index$5_keyCodeDirection: typeof keyCodeDirection;
declare const index$5_ignoreKeyEvent: typeof ignoreKeyEvent;
declare const index$5_makeMouseEvent: typeof makeMouseEvent;
type index$5_Queue = Queue;
declare const index$5_Queue: typeof Queue;
type index$5_CancelFn = CancelFn;
type index$5_CallbackFn = CallbackFn;
type index$5_CallbackObj = CallbackObj;
type index$5_UnhandledFn = UnhandledFn;
type index$5_Events = Events;
declare const index$5_Events: typeof Events;
type index$5_Callback = Callback;
type index$5_Loop = Loop;
declare const index$5_Loop: typeof Loop;
type index$5_TimerFn = TimerFn;
type index$5_Timers = Timers;
declare const index$5_Timers: typeof Timers;
type index$5_Tweens = Tweens;
declare const index$5_Tweens: typeof Tweens;
type index$5_UISelectable = UISelectable;
type index$5_MatchFn = MatchFn;
type index$5_Selector = Selector;
declare const index$5_Selector: typeof Selector;
declare const index$5_compile: typeof compile;
type index$5_UIStyle = UIStyle;
type index$5_StyleOptions = StyleOptions;
type index$5_UIStylable = UIStylable;
type index$5_StyleType = StyleType;
type index$5_Style = Style;
declare const index$5_Style: typeof Style;
declare const index$5_makeStyle: typeof makeStyle;
type index$5_ComputedStyle = ComputedStyle;
declare const index$5_ComputedStyle: typeof ComputedStyle;
type index$5_Sheet = Sheet;
declare const index$5_Sheet: typeof Sheet;
declare const index$5_defaultStyle: typeof defaultStyle;
type index$5_DataValue = DataValue;
type index$5_DataObject = DataObject;
type index$5_DataItem = DataItem;
type index$5_DataType = DataType;
type index$5_EventCb = EventCb;
type index$5_UpdatePosOpts = UpdatePosOpts;
type index$5_SetParentOptions = SetParentOptions;
type index$5_WidgetOpts = WidgetOpts;
type index$5_PropType = PropType;
type index$5_Widget = Widget;
declare const index$5_Widget: typeof Widget;
declare const index$5_alignChildren: typeof alignChildren;
declare const index$5_spaceChildren: typeof spaceChildren;
declare const index$5_wrapChildren: typeof wrapChildren;
type index$5_SceneCallback = SceneCallback;
type index$5_SceneMakeFn = SceneMakeFn;
type index$5_CreateOpts = CreateOpts;
type index$5_StartOpts = StartOpts;
type index$5_ResumeOpts = ResumeOpts;
type index$5_PauseOpts = PauseOpts;
type index$5_SceneObj = SceneObj;
type index$5_Scene = Scene;
declare const index$5_Scene: typeof Scene;
type index$5_Scenes = Scenes;
declare const index$5_Scenes: typeof Scenes;
declare const index$5_scenes: typeof scenes;
declare const index$5_installScene: typeof installScene;
type index$5_AppOpts = AppOpts;
type index$5_App = App;
declare const index$5_App: typeof App;
declare namespace index$5 {
  export {
    index$5_EventType as EventType,
    index$5_Event as Event,
    index$5_ControlFn as ControlFn,
    index$5_EventFn as EventFn,
    index$5_IOMap as IOMap,
    index$5_EventMatchFn as EventMatchFn,
    index$5_KEYPRESS as KEYPRESS,
    index$5_MOUSEMOVE as MOUSEMOVE,
    index$5_CLICK as CLICK,
    index$5_TICK as TICK,
    index$5_MOUSEUP as MOUSEUP,
    index$5_STOP as STOP,
    index$5_isControlCode as isControlCode,
    index$5_recycleEvent as recycleEvent,
    index$5_makeStopEvent as makeStopEvent,
    index$5_makeCustomEvent as makeCustomEvent,
    index$5_makeTickEvent as makeTickEvent,
    index$5_makeKeyEvent as makeKeyEvent,
    index$5_keyCodeDirection as keyCodeDirection,
    index$5_ignoreKeyEvent as ignoreKeyEvent,
    index$5_makeMouseEvent as makeMouseEvent,
    index$5_Queue as Queue,
    index$5_CancelFn as CancelFn,
    index$5_CallbackFn as CallbackFn,
    index$5_CallbackObj as CallbackObj,
    index$5_UnhandledFn as UnhandledFn,
    index$5_Events as Events,
    index$5_Callback as Callback,
    index$5_Loop as Loop,
    index$5_TimerFn as TimerFn,
    index$5_Timers as Timers,
    index$5_Tweens as Tweens,
    index$5_UISelectable as UISelectable,
    index$5_MatchFn as MatchFn,
    index$5_Selector as Selector,
    index$5_compile as compile,
    index$5_UIStyle as UIStyle,
    index$5_StyleOptions as StyleOptions,
    index$5_UIStylable as UIStylable,
    index$5_StyleType as StyleType,
    index$5_Style as Style,
    index$5_makeStyle as makeStyle,
    index$5_ComputedStyle as ComputedStyle,
    index$5_Sheet as Sheet,
    index$5_defaultStyle as defaultStyle,
    index$5_DataValue as DataValue,
    index$5_DataObject as DataObject,
    index$5_DataItem as DataItem,
    index$5_DataType as DataType,
    index$5_EventCb as EventCb,
    index$5_UpdatePosOpts as UpdatePosOpts,
    index$5_SetParentOptions as SetParentOptions,
    index$5_WidgetOpts as WidgetOpts,
    index$5_PropType as PropType,
    index$5_Widget as Widget,
    index$5_alignChildren as alignChildren,
    index$5_spaceChildren as spaceChildren,
    index$5_wrapChildren as wrapChildren,
    index$5_SceneCallback as SceneCallback,
    index$5_SceneMakeFn as SceneMakeFn,
    index$5_CreateOpts as CreateOpts,
    index$5_StartOpts as StartOpts,
    index$5_ResumeOpts as ResumeOpts,
    index$5_PauseOpts as PauseOpts,
    index$5_SceneObj as SceneObj,
    index$5_Scene as Scene,
    index$5_Scenes as Scenes,
    index$5_scenes as scenes,
    index$5_installScene as installScene,
    index$5_AppOpts as AppOpts,
    index$5_App as App,
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
    _active: Scene[];
    _busy: boolean;
    _pending: PendingInfo[];
    constructor(gw: App);
    get isBusy(): boolean;
    config(scenes: Record<string, CreateOpts | SceneMakeFn>): void;
    config(id: string, opts: CreateOpts | SceneMakeFn): void;
    get(): Scene;
    get(id?: string): Scene | null;
    trigger(ev: string, ...args: any[]): void;
    _create(id: string, opts?: CreateOpts): Scene;
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
    fixed_update(dt: number): void;
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
    dt?: number;
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
    _fixed_update(dt?: number): void;
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
    fixed_update(dt: number): void;
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
    slide(widget: Widget, from: XY | Loc$1, to: XY | Loc$1, ms: number): this;
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
    on(cfg: CallbackObj): CancelFn;
    on(ev: string | string[], cb: CallbackFn): CancelFn;
    once(ev: string, cb: CallbackFn): CancelFn;
    trigger(ev: string | string[], ...args: any[]): boolean;
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
    fixed_update(dt: number): void;
    destroy(): void;
}
declare function alignChildren(widget: Widget, align?: Align): void;
declare function spaceChildren(widget: Widget, space?: number): void;
declare function wrapChildren(widget: Widget, pad?: number): void;

interface EventType {
    type: string;
    defaultPrevented: boolean;
    propagationStopped: boolean;
    doDefault(): void;
    preventDefault(): void;
    propagate(): void;
    stopPropagation(): void;
    reset(type: string, opts?: Record<string, any>): void;
    [key: string]: any;
}
declare class Event implements EventType {
    type: string;
    target: Widget | null;
    defaultPrevented: boolean;
    propagationStopped: boolean;
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
    constructor(type: string, opts?: Partial<Event>);
    doDefault(): void;
    preventDefault(): void;
    propagate(): void;
    stopPropagation(): void;
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
declare function keyCodeDirection(key: string): Loc$1 | null;
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

type index$4_GlyphInitFn = GlyphInitFn;
type index$4_GlyphOptions = GlyphOptions;
type index$4_Glyphs = Glyphs;
declare const index$4_Glyphs: typeof Glyphs;
declare const index$4_initGlyphs: typeof initGlyphs;
type index$4_Layer = Layer;
declare const index$4_Layer: typeof Layer;
type index$4_BufferTarget = BufferTarget;
type index$4_Buffer = Buffer;
declare const index$4_Buffer: typeof Buffer;
type index$4_IOCallback = IOCallback;
declare const index$4_VERTICES_PER_TILE: typeof VERTICES_PER_TILE;
type index$4_Options = Options;
type index$4_NotSupportedError = NotSupportedError;
declare const index$4_NotSupportedError: typeof NotSupportedError;
type index$4_Canvas = Canvas;
declare const index$4_Canvas: typeof Canvas;
type index$4_ImageOptions = ImageOptions;
type index$4_FontOptions = FontOptions;
declare const index$4_withImage: typeof withImage;
declare const index$4_withFont: typeof withFont;
declare const index$4_createProgram: typeof createProgram;
declare const index$4_QUAD: typeof QUAD;
type index$4_CanvasOptions = CanvasOptions;
declare namespace index$4 {
  export {
    index$4_GlyphInitFn as GlyphInitFn,
    index$4_GlyphOptions as GlyphOptions,
    index$4_Glyphs as Glyphs,
    index$4_initGlyphs as initGlyphs,
    index$4_Layer as Layer,
    index$4_BufferTarget as BufferTarget,
    index$4_Buffer as Buffer,
    index$4_IOCallback as IOCallback,
    index$4_VERTICES_PER_TILE as VERTICES_PER_TILE,
    index$4_Options as Options,
    index$4_NotSupportedError as NotSupportedError,
    index$4_Canvas as Canvas,
    index$4_ImageOptions as ImageOptions,
    index$4_FontOptions as FontOptions,
    index$4_withImage as withImage,
    index$4_withFont as withFont,
    index$4_createProgram as createProgram,
    index$4_QUAD as QUAD,
    index$4_CanvasOptions as CanvasOptions,
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

type index$3_SpriteConfig = SpriteConfig;
type index$3_Sprite = Sprite;
declare const index$3_Sprite: typeof Sprite;
declare const index$3_sprites: typeof sprites;
type index$3_DrawInfo = DrawInfo;
type index$3_Mixer = Mixer;
declare const index$3_Mixer: typeof Mixer;
declare const index$3_makeMixer: typeof makeMixer;
type index$3_SpriteData = SpriteData;
declare namespace index$3 {
  export {
    index$3_SpriteConfig as SpriteConfig,
    index$3_Sprite as Sprite,
    index$3_sprites as sprites,
    make$3 as make,
    from$1 as from,
    install$1 as install,
    index$3_DrawInfo as DrawInfo,
    index$3_Mixer as Mixer,
    index$3_makeMixer as makeMixer,
    index$3_SpriteData as SpriteData,
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

type message_CacheOptions = CacheOptions;
type message_EachMsgFn = EachMsgFn;
type message_Cache = Cache;
declare const message_Cache: typeof Cache;
declare namespace message {
  export {
    message_CacheOptions as CacheOptions,
    message_EachMsgFn as EachMsgFn,
    message_Cache as Cache,
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

type blob_BlobConfig = BlobConfig;
type blob_Blob = Blob;
declare const blob_Blob: typeof Blob;
declare const blob_fillBlob: typeof fillBlob;
declare namespace blob {
  export {
    blob_BlobConfig as BlobConfig,
    blob_Blob as Blob,
    blob_fillBlob as fillBlob,
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

type index$2_LightConfig = LightConfig;
type index$2_LightBase = LightBase;
type index$2_LightType = LightType;
type index$2_LightCb = LightCb;
type index$2_PaintSite = PaintSite;
type index$2_LightSystemSite = LightSystemSite;
type index$2_LightSystemType = LightSystemType;
type index$2_Light = Light;
declare const index$2_Light: typeof Light;
declare const index$2_intensity: typeof intensity;
declare const index$2_isDarkLight: typeof isDarkLight;
declare const index$2_isShadowLight: typeof isShadowLight;
declare const index$2_lights: typeof lights;
declare const index$2_from: typeof from;
declare const index$2_install: typeof install;
declare const index$2_installAll: typeof installAll;
type index$2_StaticLightInfo = StaticLightInfo;
type index$2_LightSystemOptions = LightSystemOptions;
type index$2_LightSystem = LightSystem;
declare const index$2_LightSystem: typeof LightSystem;
declare namespace index$2 {
  export {
    index$2_LightConfig as LightConfig,
    index$2_LightBase as LightBase,
    index$2_LightType as LightType,
    index$2_LightCb as LightCb,
    index$2_PaintSite as PaintSite,
    index$2_LightSystemSite as LightSystemSite,
    index$2_LightSystemType as LightSystemType,
    index$2_Light as Light,
    index$2_intensity as intensity,
    index$2_isDarkLight as isDarkLight,
    index$2_isShadowLight as isShadowLight,
    make$1 as make,
    index$2_lights as lights,
    index$2_from as from,
    index$2_install as install,
    index$2_installAll as installAll,
    index$2_StaticLightInfo as StaticLightInfo,
    index$2_LightSystemOptions as LightSystemOptions,
    index$2_LightSystem as LightSystem,
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

type index$1_AlertOptions = AlertOptions;
declare const index$1_AlertScene: typeof AlertScene;
type index$1_ConfirmOptions = ConfirmOptions;
declare const index$1_ConfirmScene: typeof ConfirmScene;
declare const index$1_PromptScene: typeof PromptScene;
type index$1_MenuOptions = MenuOptions;
declare const index$1_MenuScene: typeof MenuScene;
declare namespace index$1 {
  export {
    index$1_AlertOptions as AlertOptions,
    index$1_AlertScene as AlertScene,
    index$1_ConfirmOptions as ConfirmOptions,
    index$1_ConfirmScene as ConfirmScene,
    PromptOptions$1 as PromptOptions,
    index$1_PromptScene as PromptScene,
    index$1_MenuOptions as MenuOptions,
    index$1_MenuScene as MenuScene,
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

type index_DataValue = DataValue;
type index_DataObject = DataObject;
type index_DataItem = DataItem;
type index_DataType = DataType;
type index_EventCb = EventCb;
type index_UpdatePosOpts = UpdatePosOpts;
type index_SetParentOptions = SetParentOptions;
type index_WidgetOpts = WidgetOpts;
type index_PropType = PropType;
type index_Widget = Widget;
declare const index_Widget: typeof Widget;
declare const index_alignChildren: typeof alignChildren;
declare const index_spaceChildren: typeof spaceChildren;
declare const index_wrapChildren: typeof wrapChildren;
type index_TextOptions = TextOptions;
type index_Text = Text;
declare const index_Text: typeof Text;
type index_BorderOptions = BorderOptions;
type index_Border = Border;
declare const index_Border: typeof Border;
declare const index_drawBorder: typeof drawBorder;
type index_ButtonOptions = ButtonOptions;
type index_Button = Button;
declare const index_Button: typeof Button;
type index_PadInfo = PadInfo;
type index_DialogOptions = DialogOptions;
declare const index_toPadArray: typeof toPadArray;
type index_Dialog = Dialog;
declare const index_Dialog: typeof Dialog;
type index_AddDialogOptions = AddDialogOptions;
declare const index_dialog: typeof dialog;
type index_FieldsetOptions = FieldsetOptions;
type index_Fieldset = Fieldset;
declare const index_Fieldset: typeof Fieldset;
type index_FieldOptions = FieldOptions;
type index_Field = Field;
declare const index_Field: typeof Field;
type index_OrderedListOptions = OrderedListOptions;
type index_OrderedList = OrderedList;
declare const index_OrderedList: typeof OrderedList;
type index_UnorderedListOptions = UnorderedListOptions;
type index_UnorderedList = UnorderedList;
declare const index_UnorderedList: typeof UnorderedList;
type index_InputOptions = InputOptions;
type index_Input = Input;
declare const index_Input: typeof Input;
type index_PrefixType = PrefixType;
type index_FormatFn = FormatFn;
type index_SelectType = SelectType;
type index_HoverType = HoverType;
type index_BorderType = BorderType;
type index_ColumnOptions = ColumnOptions;
type index_DataTableOptions = DataTableOptions;
type index_Column = Column;
declare const index_Column: typeof Column;
type index_DataTable = DataTable;
declare const index_DataTable: typeof DataTable;
type index_DataListOptions = DataListOptions;
type index_DataList = DataList;
declare const index_DataList: typeof DataList;
type index_Rec<T> = Rec<T>;
type index_DropdownConfig = DropdownConfig;
type index_ActionConfig = ActionConfig;
type index_ButtonConfig = ButtonConfig;
type index_Menu = Menu;
declare const index_Menu: typeof Menu;
type index_MenuButtonOptions = MenuButtonOptions;
type index_MenuButton = MenuButton;
declare const index_MenuButton: typeof MenuButton;
type index_MenubarOptions = MenubarOptions;
type index_Menubar = Menubar;
declare const index_Menubar: typeof Menubar;
type index_SelectOptions = SelectOptions;
type index_Select = Select;
declare const index_Select: typeof Select;
type index_NextType = NextType;
type index_PromptChoice = PromptChoice;
type index_PromptOptions = PromptOptions;
type index_Prompt = Prompt;
declare const index_Prompt: typeof Prompt;
type index_ChoiceOptions = ChoiceOptions;
type index_Choice = Choice;
declare const index_Choice: typeof Choice;
type index_Inquiry = Inquiry;
declare const index_Inquiry: typeof Inquiry;
type index_Builder = Builder;
declare const index_Builder: typeof Builder;
type index_WidgetMake<T> = WidgetMake<T>;
declare const index_make: typeof make;
declare namespace index {
  export {
    index_DataValue as DataValue,
    index_DataObject as DataObject,
    index_DataItem as DataItem,
    index_DataType as DataType,
    index_EventCb as EventCb,
    index_UpdatePosOpts as UpdatePosOpts,
    index_SetParentOptions as SetParentOptions,
    index_WidgetOpts as WidgetOpts,
    index_PropType as PropType,
    index_Widget as Widget,
    index_alignChildren as alignChildren,
    index_spaceChildren as spaceChildren,
    index_wrapChildren as wrapChildren,
    index_TextOptions as TextOptions,
    index_Text as Text,
    index_BorderOptions as BorderOptions,
    index_Border as Border,
    index_drawBorder as drawBorder,
    index_ButtonOptions as ButtonOptions,
    index_Button as Button,
    index_PadInfo as PadInfo,
    index_DialogOptions as DialogOptions,
    index_toPadArray as toPadArray,
    index_Dialog as Dialog,
    index_AddDialogOptions as AddDialogOptions,
    index_dialog as dialog,
    index_FieldsetOptions as FieldsetOptions,
    index_Fieldset as Fieldset,
    index_FieldOptions as FieldOptions,
    index_Field as Field,
    index_OrderedListOptions as OrderedListOptions,
    index_OrderedList as OrderedList,
    index_UnorderedListOptions as UnorderedListOptions,
    index_UnorderedList as UnorderedList,
    index_InputOptions as InputOptions,
    index_Input as Input,
    index_PrefixType as PrefixType,
    index_FormatFn as FormatFn,
    index_SelectType as SelectType,
    index_HoverType as HoverType,
    index_BorderType as BorderType,
    index_ColumnOptions as ColumnOptions,
    index_DataTableOptions as DataTableOptions,
    index_Column as Column,
    index_DataTable as DataTable,
    index_DataListOptions as DataListOptions,
    index_DataList as DataList,
    index_Rec as Rec,
    index_DropdownConfig as DropdownConfig,
    index_ActionConfig as ActionConfig,
    index_ButtonConfig as ButtonConfig,
    MenuOptions$1 as MenuOptions,
    index_Menu as Menu,
    index_MenuButtonOptions as MenuButtonOptions,
    index_MenuButton as MenuButton,
    index_MenubarOptions as MenubarOptions,
    index_Menubar as Menubar,
    index_SelectOptions as SelectOptions,
    index_Select as Select,
    index_NextType as NextType,
    index_PromptChoice as PromptChoice,
    index_PromptOptions as PromptOptions,
    index_Prompt as Prompt,
    index_ChoiceOptions as ChoiceOptions,
    index_Choice as Choice,
    index_Inquiry as Inquiry,
    index_Builder as Builder,
    index_WidgetMake as WidgetMake,
    index_make as make,
  };
}

export { ERROR, FALSE, IDENTITY, IS_NONZERO, IS_ZERO, NOOP, ONE, TRUE, WARN, ZERO, index$5 as app, arrayDelete, arrayFindRight, arrayIncludesAll, arrayInsert, arrayNext, arrayNullify, arrayPrev, arrayRevEach, arraysIntersect, blob, buffer, index$4 as canvas, clamp, index$9 as color, colors, cosmetic, data, first, flag, index$7 as fov, frequency, grid, lerp$1 as lerp, index$2 as light, list, message, nextIndex, object, index$6 as path, prevIndex, queue, random, range, rng, scheduler, index$3 as sprite, sum, tags, index$8 as text, tween, types, index$1 as ui, index as widget, xave, xy };
