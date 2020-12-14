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

declare function test(): number;

export { test, utils_d as utils };
