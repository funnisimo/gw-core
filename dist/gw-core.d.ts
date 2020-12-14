/**
 * GW.utils
 * @module utils
 */
declare const DIRS: number[][];
declare const NO_DIRECTION = -1;
declare const UP = 0;
declare const RIGHT = 1;
declare const DOWN = 2;
declare const LEFT = 3;
declare const RIGHT_UP = 4;
declare const RIGHT_DOWN = 5;
declare const LEFT_DOWN = 6;
declare const LEFT_UP = 7;
declare const CLOCK_DIRS: number[][];
declare function NOOP(): void;
declare function TRUE(): boolean;
declare function FALSE(): boolean;
declare function ONE(): number;
declare function ZERO(): number;
declare function IDENTITY(x: any): any;
/**
 * clamps a value between min and max (inclusive)
 * @param v {Number} the value to clamp
 * @param min {Number} the minimum value
 * @param max {Number} the maximum value
 * @returns {Number} the clamped value
 */
declare function clamp(v: number, min: number, max: number): number;
declare type Loc = [number, number];
interface XY {
    x: number;
    y: number;
}
declare function x(src: XY | Loc): any;
declare function y(src: XY | Loc): any;
declare function copyXY(dest: XY, src: XY | Loc): void;
declare function addXY(dest: XY, src: XY | Loc): void;
declare function equalsXY(dest: XY, src: XY | Loc): boolean;
declare function lerpXY(a: XY | Loc, b: XY | Loc, pct: number): any[];
declare function distanceBetween(x1: number, y1: number, x2: number, y2: number): number;
declare function distanceFromTo(a: XY | Loc, b: XY | Loc): number;
declare function calcRadius(x: number, y: number): number;
declare function dirBetween(x: number, y: number, toX: number, toY: number): number[];
declare function dirFromTo(a: XY | Loc, b: XY | Loc): number[];
declare function dirIndex(dir: XY | Loc): number;
declare function isOppositeDir(a: Loc, b: Loc): boolean;
declare function isSameDir(a: Loc, b: Loc): boolean;
declare function dirSpread(dir: Loc): Loc[];
declare function stepFromTo(a: XY | Loc, b: XY | Loc, fn: (x: number, y: number) => any): void;
declare function smoothHiliteGradient(currentXValue: number, maxXValue: number): number;
declare type BasicObject = {
    [key: string]: any;
};
declare function assignOmitting(omit: string | string[], dest: BasicObject, src: BasicObject): void;
declare function setDefault(obj: BasicObject, field: string, val: any): void;
declare type AssignCallback = (dest: BasicObject, key: string, current: any, def: any) => boolean;
declare function setDefaults(obj: BasicObject, def: any, custom?: AssignCallback | null): void;
declare function kindDefaults(obj: BasicObject, def: BasicObject): void;
declare function pick(obj: BasicObject, ...fields: string[]): BasicObject;
declare function clearObject(obj: BasicObject): void;
declare function ERROR(message: string): void;
declare function WARN(...args: string[]): void;
declare function getOpt(obj: BasicObject, member: string, _default: any): any;
declare function firstOpt(field: string, ...args: BasicObject[]): any;
declare function arraysIntersect(a: any[], b: any[]): boolean;
declare function sum(arr: number[]): number;
interface Chainable {
    next: Chainable | null;
}
declare function chainLength(root: Chainable | null): number;
declare function chainIncludes(chain: Chainable | null, entry: Chainable): boolean;
declare function eachChain(item: Chainable | null, fn: (item: Chainable, index: number) => any): number;
declare function addToChain(obj: BasicObject, name: string, entry: Chainable): boolean;
declare function removeFromChain(obj: BasicObject, name: string, entry: Chainable): boolean;

declare const utils_d_DIRS: typeof DIRS;
declare const utils_d_NO_DIRECTION: typeof NO_DIRECTION;
declare const utils_d_UP: typeof UP;
declare const utils_d_RIGHT: typeof RIGHT;
declare const utils_d_DOWN: typeof DOWN;
declare const utils_d_LEFT: typeof LEFT;
declare const utils_d_RIGHT_UP: typeof RIGHT_UP;
declare const utils_d_RIGHT_DOWN: typeof RIGHT_DOWN;
declare const utils_d_LEFT_DOWN: typeof LEFT_DOWN;
declare const utils_d_LEFT_UP: typeof LEFT_UP;
declare const utils_d_CLOCK_DIRS: typeof CLOCK_DIRS;
declare const utils_d_NOOP: typeof NOOP;
declare const utils_d_TRUE: typeof TRUE;
declare const utils_d_FALSE: typeof FALSE;
declare const utils_d_ONE: typeof ONE;
declare const utils_d_ZERO: typeof ZERO;
declare const utils_d_IDENTITY: typeof IDENTITY;
declare const utils_d_clamp: typeof clamp;
type utils_d_Loc = Loc;
type utils_d_XY = XY;
declare const utils_d_x: typeof x;
declare const utils_d_y: typeof y;
declare const utils_d_copyXY: typeof copyXY;
declare const utils_d_addXY: typeof addXY;
declare const utils_d_equalsXY: typeof equalsXY;
declare const utils_d_lerpXY: typeof lerpXY;
declare const utils_d_distanceBetween: typeof distanceBetween;
declare const utils_d_distanceFromTo: typeof distanceFromTo;
declare const utils_d_calcRadius: typeof calcRadius;
declare const utils_d_dirBetween: typeof dirBetween;
declare const utils_d_dirFromTo: typeof dirFromTo;
declare const utils_d_dirIndex: typeof dirIndex;
declare const utils_d_isOppositeDir: typeof isOppositeDir;
declare const utils_d_isSameDir: typeof isSameDir;
declare const utils_d_dirSpread: typeof dirSpread;
declare const utils_d_stepFromTo: typeof stepFromTo;
declare const utils_d_smoothHiliteGradient: typeof smoothHiliteGradient;
type utils_d_BasicObject = BasicObject;
declare const utils_d_assignOmitting: typeof assignOmitting;
declare const utils_d_setDefault: typeof setDefault;
type utils_d_AssignCallback = AssignCallback;
declare const utils_d_setDefaults: typeof setDefaults;
declare const utils_d_kindDefaults: typeof kindDefaults;
declare const utils_d_pick: typeof pick;
declare const utils_d_clearObject: typeof clearObject;
declare const utils_d_ERROR: typeof ERROR;
declare const utils_d_WARN: typeof WARN;
declare const utils_d_getOpt: typeof getOpt;
declare const utils_d_firstOpt: typeof firstOpt;
declare const utils_d_arraysIntersect: typeof arraysIntersect;
declare const utils_d_sum: typeof sum;
type utils_d_Chainable = Chainable;
declare const utils_d_chainLength: typeof chainLength;
declare const utils_d_chainIncludes: typeof chainIncludes;
declare const utils_d_eachChain: typeof eachChain;
declare const utils_d_addToChain: typeof addToChain;
declare const utils_d_removeFromChain: typeof removeFromChain;
declare namespace utils_d {
  export {
    utils_d_DIRS as DIRS,
    utils_d_NO_DIRECTION as NO_DIRECTION,
    utils_d_UP as UP,
    utils_d_RIGHT as RIGHT,
    utils_d_DOWN as DOWN,
    utils_d_LEFT as LEFT,
    utils_d_RIGHT_UP as RIGHT_UP,
    utils_d_RIGHT_DOWN as RIGHT_DOWN,
    utils_d_LEFT_DOWN as LEFT_DOWN,
    utils_d_LEFT_UP as LEFT_UP,
    utils_d_CLOCK_DIRS as CLOCK_DIRS,
    utils_d_NOOP as NOOP,
    utils_d_TRUE as TRUE,
    utils_d_FALSE as FALSE,
    utils_d_ONE as ONE,
    utils_d_ZERO as ZERO,
    utils_d_IDENTITY as IDENTITY,
    utils_d_clamp as clamp,
    utils_d_Loc as Loc,
    utils_d_XY as XY,
    utils_d_x as x,
    utils_d_y as y,
    utils_d_copyXY as copyXY,
    utils_d_addXY as addXY,
    utils_d_equalsXY as equalsXY,
    utils_d_lerpXY as lerpXY,
    utils_d_distanceBetween as distanceBetween,
    utils_d_distanceFromTo as distanceFromTo,
    utils_d_calcRadius as calcRadius,
    utils_d_dirBetween as dirBetween,
    utils_d_dirFromTo as dirFromTo,
    utils_d_dirIndex as dirIndex,
    utils_d_isOppositeDir as isOppositeDir,
    utils_d_isSameDir as isSameDir,
    utils_d_dirSpread as dirSpread,
    utils_d_stepFromTo as stepFromTo,
    utils_d_smoothHiliteGradient as smoothHiliteGradient,
    utils_d_BasicObject as BasicObject,
    utils_d_assignOmitting as assignOmitting,
    utils_d_setDefault as setDefault,
    utils_d_AssignCallback as AssignCallback,
    utils_d_setDefaults as setDefaults,
    utils_d_kindDefaults as kindDefaults,
    utils_d_pick as pick,
    utils_d_clearObject as clearObject,
    utils_d_ERROR as ERROR,
    utils_d_WARN as WARN,
    utils_d_getOpt as getOpt,
    utils_d_firstOpt as firstOpt,
    utils_d_arraysIntersect as arraysIntersect,
    utils_d_sum as sum,
    utils_d_Chainable as Chainable,
    utils_d_chainLength as chainLength,
    utils_d_chainIncludes as chainIncludes,
    utils_d_eachChain as eachChain,
    utils_d_addToChain as addToChain,
    utils_d_removeFromChain as removeFromChain,
  };
}

declare type RandomFunction = () => number;
declare type SeedFunction = (seed?: number) => RandomFunction;
interface RandomConfig {
    make: SeedFunction;
}
declare type WeightedArray = number[];
interface WeightedObject {
    [key: string]: number;
}
declare class Random {
    private _fn;
    constructor();
    seed(val?: number): void;
    value(): number;
    float(): number;
    number(max?: number): number;
    int(max?: number): number;
    range(lo: number, hi: number): number;
    dice(count: number, sides: number, addend?: number): number;
    weighted(weights: WeightedArray | WeightedObject): string | number;
    item(list: any[]): any;
    key(obj: BasicObject): any;
    shuffle(list: any[], fromIndex?: number, toIndex?: number): any[];
    sequence(n: number): any[];
    chance(percent: number, outOf?: number): boolean;
    clumped(lo: number, hi: number, clumps: number): number;
}
declare const random: Random;
declare const cosmetic: Random;

declare class Range {
    lo: number;
    hi: number;
    clumps: number;
    private _rng;
    constructor(lower: number | Range | number[], upper?: number, clumps?: number, rng?: Random);
    value(): number;
    toString(): string;
}
declare function make(config: Range | string | number[] | null, rng?: Random): Range;

type range_d_Range = Range;
declare const range_d_Range: typeof Range;
declare const range_d_make: typeof make;
declare namespace range_d {
  export {
    range_d_Range as Range,
    range_d_make as make,
  };
}

declare function fl(N: number): number;
declare function toString(flagObj: any, value: number): string;
declare function from(obj: any, ...args: any[]): number;
declare const flags: Record<string, Record<string, number>>;
declare function install(flagName: string, flag: Record<string, number>): Record<string, number>;

declare const flag_d_fl: typeof fl;
declare const flag_d_toString: typeof toString;
declare const flag_d_from: typeof from;
declare const flag_d_flags: typeof flags;
declare const flag_d_install: typeof install;
declare namespace flag_d {
  export {
    flag_d_fl as fl,
    flag_d_toString as toString,
    flag_d_from as from,
    flag_d_flags as flags,
    flag_d_install as install,
  };
}

declare type ArrayInit = (i: number) => any;
declare function makeArray(l: number, fn: ArrayInit): any[];
declare type GridInit = (x: number, y: number) => any;
declare type GridEachFunction = (value: any, x: number, y: number, grid: Grid) => any;
declare type GridMatchFunction = (value: any, x: number, y: number, grid: Grid) => boolean;
declare class Grid extends Array {
    x?: number;
    y?: number;
    private _width;
    private _height;
    constructor(w: number, h: number, v: GridInit | number);
    get width(): number;
    get height(): number;
    resize(width: number, height: number, value: any): this;
    forEach(fn: GridEachFunction): void;
    eachNeighbor(x: number, y: number, fn: GridEachFunction, only4dirs?: boolean): void;
    forRect(x: number, y: number, w: number, h: number, fn: GridEachFunction): void;
    map(fn: GridEachFunction): any[][];
    forCircle(x: number, y: number, radius: number, fn: GridEachFunction): void;
    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;
    calcBounds(): {
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
    update(fn: GridEachFunction): void;
    updateRect(x: number, y: number, width: number, height: number, fn: GridEachFunction): void;
    updateCircle(x: number, y: number, radius: number, fn: GridEachFunction): void;
    fill(v?: number): void;
    fillRect(x: number, y: number, w: number, h: number, v?: number): void;
    fillCircle(x: number, y: number, radius: number, v?: number): void;
    replace(findValue: number, replaceValue: number): void;
    copy(from: Grid): void;
    count(match: GridMatchFunction | number): number;
    dump(fmtFn: (v: any) => string): void;
    closestMatchingXY(x: number, y: number, fn: (v: any, x: number, y: number, grid: Grid) => boolean): number[];
    firstMatchingXY(v: any): number[];
    randomMatchingXY(v: any, deterministic?: boolean): number[];
    matchingXYNear(x: number, y: number, v: any, deterministic?: boolean): number[] | null;
    arcCount(x: number, y: number, testFn: (v: any, x: number, y: number, grid: Grid) => boolean): number;
}
declare function make$1(w: number, h: number, v: any): Grid;
declare function alloc(w: number, h: number, v?: any): Grid;
declare function free(grid: Grid): void;
declare function dump(grid: Grid, fmtFn: (v: any) => string): void;
declare function dumpRect(grid: Grid, left: number, top: number, width: number, height: number, fmtFn?: (v: any, x: number, y: number) => string): void;
declare function dumpAround(grid: Grid, x: number, y: number, radius: number): void;
declare function findAndReplace(grid: Grid, findValueMin: number, findValueMax: number, fillValue: number): void;
declare function floodFillRange(grid: Grid, x: number, y: number, eligibleValueMin?: number, eligibleValueMax?: number, fillValue?: number): number;
declare function invert(grid: Grid): void;
declare function intersection(onto: Grid, a: Grid, b: Grid): void;
declare function unite(onto: Grid, a: Grid, b: Grid): void;
declare function closestLocationWithValue(grid: Grid, x: number, y: number, value?: number): number[];
declare function randomLocationWithValue(grid: Grid, validValue: any): number[];
declare function getQualifyingLocNear(grid: Grid, x: number, y: number, deterministic?: boolean): number[] | null;
declare function leastPositiveValue(grid: Grid): number;
declare function randomLeastPositiveLocation(grid: Grid, deterministic?: boolean): number[];
declare function floodFill(grid: Grid, x: number, y: number, matchValue: any, fillValue: any): number;
declare function offsetZip(destGrid: Grid, srcGrid: Grid, srcToDestX: number, srcToDestY: number, value: any): void;
declare function directionOfDoorSite(grid: Grid, x: number, y: number, isOpen?: number): number;
declare function fillBlob(grid: Grid, roundCount: number, minBlobWidth: number, minBlobHeight: number, maxBlobWidth: number, maxBlobHeight: number, percentSeeded: number, birthParameters: string, survivalParameters: string): {
    x: number;
    y: number;
    width: number;
    height: number;
};

type grid_d_ArrayInit = ArrayInit;
declare const grid_d_makeArray: typeof makeArray;
type grid_d_GridInit = GridInit;
type grid_d_GridEachFunction = GridEachFunction;
type grid_d_GridMatchFunction = GridMatchFunction;
type grid_d_Grid = Grid;
declare const grid_d_Grid: typeof Grid;
declare const grid_d_alloc: typeof alloc;
declare const grid_d_free: typeof free;
declare const grid_d_dump: typeof dump;
declare const grid_d_dumpRect: typeof dumpRect;
declare const grid_d_dumpAround: typeof dumpAround;
declare const grid_d_findAndReplace: typeof findAndReplace;
declare const grid_d_floodFillRange: typeof floodFillRange;
declare const grid_d_invert: typeof invert;
declare const grid_d_intersection: typeof intersection;
declare const grid_d_unite: typeof unite;
declare const grid_d_closestLocationWithValue: typeof closestLocationWithValue;
declare const grid_d_randomLocationWithValue: typeof randomLocationWithValue;
declare const grid_d_getQualifyingLocNear: typeof getQualifyingLocNear;
declare const grid_d_leastPositiveValue: typeof leastPositiveValue;
declare const grid_d_randomLeastPositiveLocation: typeof randomLeastPositiveLocation;
declare const grid_d_floodFill: typeof floodFill;
declare const grid_d_offsetZip: typeof offsetZip;
declare const grid_d_directionOfDoorSite: typeof directionOfDoorSite;
declare const grid_d_fillBlob: typeof fillBlob;
declare namespace grid_d {
  export {
    grid_d_ArrayInit as ArrayInit,
    grid_d_makeArray as makeArray,
    grid_d_GridInit as GridInit,
    grid_d_GridEachFunction as GridEachFunction,
    grid_d_GridMatchFunction as GridMatchFunction,
    grid_d_Grid as Grid,
    make$1 as make,
    grid_d_alloc as alloc,
    grid_d_free as free,
    grid_d_dump as dump,
    grid_d_dumpRect as dumpRect,
    grid_d_dumpAround as dumpAround,
    grid_d_findAndReplace as findAndReplace,
    grid_d_floodFillRange as floodFillRange,
    grid_d_invert as invert,
    grid_d_intersection as intersection,
    grid_d_unite as unite,
    grid_d_closestLocationWithValue as closestLocationWithValue,
    grid_d_randomLocationWithValue as randomLocationWithValue,
    grid_d_getQualifyingLocNear as getQualifyingLocNear,
    grid_d_leastPositiveValue as leastPositiveValue,
    grid_d_randomLeastPositiveLocation as randomLeastPositiveLocation,
    grid_d_floodFill as floodFill,
    grid_d_offsetZip as offsetZip,
    grid_d_directionOfDoorSite as directionOfDoorSite,
    grid_d_fillBlob as fillBlob,
  };
}

interface GWConfig {
    random: Partial<RandomConfig>;
}
declare function configure(config: Partial<GWConfig>): void;
declare var types: {
    Random: typeof Random;
    Range: typeof Range;
    Grid: typeof Grid;
};

export { GWConfig, configure, cosmetic, flag_d as flag, flags, grid_d as grid, random, range_d as range, types, utils_d as utils };
