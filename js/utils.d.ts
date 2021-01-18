/**
 * GW.utils
 * @module utils
 */
export declare type Loc = [number, number];
export interface XY {
    x: number;
    y: number;
}
export declare const DIRS: Loc[];
export declare const NO_DIRECTION = -1;
export declare const UP = 0;
export declare const RIGHT = 1;
export declare const DOWN = 2;
export declare const LEFT = 3;
export declare const RIGHT_UP = 4;
export declare const RIGHT_DOWN = 5;
export declare const LEFT_DOWN = 6;
export declare const LEFT_UP = 7;
export declare const CLOCK_DIRS: Loc[];
export declare function NOOP(): void;
export declare function TRUE(): boolean;
export declare function FALSE(): boolean;
export declare function ONE(): number;
export declare function ZERO(): number;
export declare function IDENTITY(x: any): any;
export declare function IS_ZERO(x: number): boolean;
export declare function IS_NONZERO(x: number): boolean;
/**
 * clamps a value between min and max (inclusive)
 * @param v {Number} the value to clamp
 * @param min {Number} the minimum value
 * @param max {Number} the maximum value
 * @returns {Number} the clamped value
 */
export declare function clamp(v: number, min: number, max: number): number;
export interface XY {
    x: number;
    y: number;
}
export declare function x(src: XY | Loc): any;
export declare function y(src: XY | Loc): any;
export declare function copyXY(dest: XY, src: XY | Loc): void;
export declare function addXY(dest: XY, src: XY | Loc): void;
export declare function equalsXY(dest: XY, src: XY | Loc): boolean;
export declare function lerpXY(a: XY | Loc, b: XY | Loc, pct: number): any[];
export declare function distanceBetween(x1: number, y1: number, x2: number, y2: number): number;
export declare function distanceFromTo(a: XY | Loc, b: XY | Loc): number;
export declare function calcRadius(x: number, y: number): number;
export declare function dirBetween(x: number, y: number, toX: number, toY: number): number[];
export declare function dirFromTo(a: XY | Loc, b: XY | Loc): number[];
export declare function dirIndex(dir: XY | Loc): number;
export declare function isOppositeDir(a: Loc, b: Loc): boolean;
export declare function isSameDir(a: Loc, b: Loc): boolean;
export declare function dirSpread(dir: Loc): Loc[];
export declare function stepFromTo(a: XY | Loc, b: XY | Loc, fn: (x: number, y: number) => any): void;
export declare function smoothHiliteGradient(currentXValue: number, maxXValue: number): number;
export declare type BasicObject = {
    [key: string]: any;
};
export declare function copyObject(dest: any, src: any): void;
export declare function assignObject(dest: any, src: any): void;
export declare function assignOmitting(omit: string | string[], dest: any, src: any): void;
export declare function setDefault(obj: any, field: string, val: any): void;
export declare type AssignCallback = (dest: any, key: string, current: any, def: any) => boolean;
export declare function setDefaults(obj: any, def: any, custom?: AssignCallback | null): void;
export declare function kindDefaults(obj: any, def: any): void;
export declare function pick(obj: any, ...fields: string[]): any;
export declare function clearObject(obj: any): void;
export declare function ERROR(message: string): void;
export declare function WARN(...args: string[]): void;
export declare function first(...args: any[]): any;
export declare function getOpt(obj: BasicObject, member: string, _default: any): any;
export declare function firstOpt(field: string, ...args: any[]): any;
export declare function arraysIntersect(a: any[], b: any[]): boolean;
export declare function sum(arr: number[]): number;
export interface Chainable {
    next: any | null;
}
export declare function chainLength<T extends Chainable>(root: T | null): number;
export declare function chainIncludes<T extends Chainable>(chain: T | null, entry: T): boolean;
export declare function eachChain<T extends Chainable>(item: T | null, fn: (item: T, index: number) => any): number;
export declare function addToChain<T extends Chainable>(obj: any, name: string, entry: T): boolean;
export declare function removeFromChain<T extends Chainable>(obj: any, name: string, entry: T): boolean;
export declare function forLine(fromX: number, fromY: number, toX: number, toY: number, stepFn: (x: number, y: number) => boolean): void;
export declare function getLine(fromX: number, fromY: number, toX: number, toY: number): Loc[];
export declare function getLineThru(fromX: number, fromY: number, toX: number, toY: number, width: number, height: number): Loc[];
