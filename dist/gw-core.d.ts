/**
 * GW.utils
 * @module utils
 */
declare type Loc = [number, number];
declare const DIRS: Loc[];
declare const NO_DIRECTION = -1;
declare const UP = 0;
declare const RIGHT = 1;
declare const DOWN = 2;
declare const LEFT = 3;
declare const RIGHT_UP = 4;
declare const RIGHT_DOWN = 5;
declare const LEFT_DOWN = 6;
declare const LEFT_UP = 7;
declare const CLOCK_DIRS: Loc[];
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

type utils_d_Loc = Loc;
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
    utils_d_Loc as Loc,
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
    static configure(opts: Partial<RandomConfig>): void;
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

declare type Loc$1 = Loc;
declare type ArrayInit<T> = (i: number) => T;
declare function makeArray<T>(l: number, fn?: T | ArrayInit<T>): Array<T>;
declare type GridInit<T> = (x: number, y: number) => T;
declare type GridEach<T> = (value: T, x: number, y: number, grid: Grid<T>) => void;
declare type GridUpdate<T> = (value: T, x: number, y: number, grid: Grid<T>) => T;
declare type GridMatch<T> = (value: T, x: number, y: number, grid: Grid<T>) => boolean;
declare type GridFormat<T> = (value: T, x: number, y: number) => string;
declare class Grid<T> extends Array<Array<T>> {
    type: string;
    protected _width: number;
    protected _height: number;
    constructor(w: number, h: number, v: GridInit<T> | T);
    get width(): number;
    get height(): number;
    forEach(fn: GridEach<T>): void;
    eachNeighbor(x: number, y: number, fn: GridEach<T>, only4dirs?: boolean): void;
    forRect(x: number, y: number, w: number, h: number, fn: GridEach<T>): void;
    map(fn: GridEach<T>): void[][];
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
    fill(v: T | GridUpdate<T>): void;
    fillRect(x: number, y: number, w: number, h: number, v: T | GridUpdate<T>): void;
    fillCircle(x: number, y: number, radius: number, v: T | GridUpdate<T>): void;
    replace(findValue: T, replaceValue: T): void;
    copy(from: Grid<T>): void;
    count(match: GridMatch<T> | T): number;
    dump(fmtFn?: GridFormat<T>): void;
    dumpRect(left: number, top: number, width: number, height: number, fmtFn?: GridFormat<T>): void;
    dumpAround(x: number, y: number, radius: number): void;
    closestMatchingLoc(x: number, y: number, fn: GridMatch<T>): Loc$1;
    firstMatchingLoc(v: T | GridMatch<T>): Loc$1;
    randomMatchingLoc(v: T | GridMatch<T>, deterministic?: boolean): Loc$1;
    matchingLocNear(x: number, y: number, v: T | GridMatch<T>, deterministic?: boolean): Loc$1;
    arcCount(x: number, y: number, testFn: GridMatch<T>): number;
}
declare class NumGrid extends Grid<number> {
    x?: number;
    y?: number;
    static alloc(w: number, h: number, v?: number): NumGrid;
    static free(grid: NumGrid): void;
    constructor(w: number, h: number, v?: number);
    resize(width: number, height: number, v?: GridInit<number> | number): void;
    findReplaceRange(findValueMin: number, findValueMax: number, fillValue: number): void;
    floodFillRange(x: number, y: number, eligibleValueMin?: number, eligibleValueMax?: number, fillValue?: number): number;
    invert(): void;
    closestLocWithValue(x: number, y: number, value?: number): Loc$1;
    randomLocWithValue(validValue?: number): Loc$1;
    getQualifyingLocNear(x: number, y: number, deterministic?: boolean): Loc;
    leastPositiveValue(): number;
    randomLeastPositiveLoc(deterministic?: boolean): Loc$1;
    floodFill(x: number, y: number, matchValue: number | GridMatch<number>, fillValue: number | GridUpdate<number>): number;
    protected _cellularAutomataRound(birthParameters: string, survivalParameters: string): boolean;
    fillBlob(roundCount: number, minBlobWidth: number, minBlobHeight: number, maxBlobWidth: number, maxBlobHeight: number, percentSeeded: number, birthParameters: string, survivalParameters: string): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
declare const alloc: typeof NumGrid.alloc;
declare const free: typeof NumGrid.free;
declare function make$1<T>(w: number, h: number, v?: T | GridInit<T>): NumGrid | Grid<T>;
declare type GridZip<T, U> = (destVal: T, sourceVal: U, destX: number, destY: number, sourceX: number, sourceY: number, destGrid: Grid<T>, sourceGrid: Grid<U>) => void;
declare function offsetZip<T, U>(destGrid: Grid<T>, srcGrid: Grid<U>, srcToDestX: number, srcToDestY: number, value: T | GridZip<T, U>): void;
declare function directionOfDoorSite<T>(grid: Grid<T>, x: number, y: number, isOpen: T | GridMatch<T>): number;
declare function intersection(onto: NumGrid, a: NumGrid, b: NumGrid): void;
declare function unite(onto: NumGrid, a: NumGrid, b: NumGrid): void;

type grid_d_ArrayInit<_0> = ArrayInit<_0>;
declare const grid_d_makeArray: typeof makeArray;
type grid_d_GridInit<_0> = GridInit<_0>;
type grid_d_GridEach<_0> = GridEach<_0>;
type grid_d_GridUpdate<_0> = GridUpdate<_0>;
type grid_d_GridMatch<_0> = GridMatch<_0>;
type grid_d_GridFormat<_0> = GridFormat<_0>;
type grid_d_Grid<_0> = Grid<_0>;
declare const grid_d_Grid: typeof Grid;
type grid_d_NumGrid = NumGrid;
declare const grid_d_NumGrid: typeof NumGrid;
declare const grid_d_alloc: typeof alloc;
declare const grid_d_free: typeof free;
type grid_d_GridZip<_0, _1> = GridZip<_0, _1>;
declare const grid_d_offsetZip: typeof offsetZip;
declare const grid_d_directionOfDoorSite: typeof directionOfDoorSite;
declare const grid_d_intersection: typeof intersection;
declare const grid_d_unite: typeof unite;
declare namespace grid_d {
  export {
    grid_d_ArrayInit as ArrayInit,
    grid_d_makeArray as makeArray,
    grid_d_GridInit as GridInit,
    grid_d_GridEach as GridEach,
    grid_d_GridUpdate as GridUpdate,
    grid_d_GridMatch as GridMatch,
    grid_d_GridFormat as GridFormat,
    grid_d_Grid as Grid,
    grid_d_NumGrid as NumGrid,
    grid_d_alloc as alloc,
    grid_d_free as free,
    make$1 as make,
    grid_d_GridZip as GridZip,
    grid_d_offsetZip as offsetZip,
    grid_d_directionOfDoorSite as directionOfDoorSite,
    grid_d_intersection as intersection,
    grid_d_unite as unite,
  };
}

declare var data: {};

export { Random, cosmetic, data, flag_d as flag, flags, grid_d as grid, random, range_d as range, utils_d as utils };
