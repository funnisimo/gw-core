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
declare function forLine(fromX: number, fromY: number, toX: number, toY: number, stepFn: (x: number, y: number) => boolean): void;
declare function getLine(fromX: number, fromY: number, toX: number, toY: number): Loc[];
declare function getLineThru(fromX: number, fromY: number, toX: number, toY: number, width: number, height: number): Loc[];

type utils_d_Loc = Loc;
type utils_d_XY = XY;
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
declare const utils_d_forLine: typeof forLine;
declare const utils_d_getLine: typeof getLine;
declare const utils_d_getLineThru: typeof getLineThru;
declare namespace utils_d {
  export {
    utils_d_Loc as Loc,
    utils_d_XY as XY,
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
    utils_d_forLine as forLine,
    utils_d_getLine as getLine,
    utils_d_getLineThru as getLineThru,
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
    protected _width: number;
    protected _height: number;
    constructor(w: number, h: number, v: GridInit<T> | T);
    get width(): number;
    get height(): number;
    /**
     * Calls the supplied function for each cell in the grid.
     * @param fn - The function to call on each item in the grid.
     */
     // @ts-ignore

    forEach(fn: GridEach<T>): void;
    eachNeighbor(x: number, y: number, fn: GridEach<T>, only4dirs?: boolean): void;
    forRect(x: number, y: number, w: number, h: number, fn: GridEach<T>): void;
    /**
     * Returns a new Grid with the cells mapped according to the supplied function.
     * @param fn - The function that maps the cell values
     */
     // @ts-ignore

    map(fn: GridEach<T>): any;
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

interface Event {
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
    dir: Loc | null;
    dt: number;
}
declare type CommandFn = (event: Event) => Promise<boolean>;
declare var commands: Record<string, CommandFn>;
declare function addCommand(id: string, fn: CommandFn): void;
declare type KeyMap = Record<string, CommandFn | boolean>;
declare type EventMatchFn = (event: Event) => boolean;
declare const KEYPRESS = "keypress";
declare const MOUSEMOVE = "mousemove";
declare const CLICK = "click";
declare const TICK = "tick";
declare const MOUSEUP = "mouseup";
declare function setKeymap(keymap: KeyMap): void;
declare function hasEvents(): number;
declare function clearEvents(): void;
declare function pushEvent(ev: Event): void;
declare function dispatchEvent(ev: Event, km?: KeyMap | CommandFn): Promise<any>;
declare function makeTickEvent(dt: number): Event;
declare function makeKeyEvent(e: KeyboardEvent): Event;
declare function keyCodeDirection(key: string): Loc | null;
declare function ignoreKeyEvent(e: KeyboardEvent): boolean;
declare var mouse: XY;
declare function makeMouseEvent(e: MouseEvent, x: number, y: number): Event;
declare function pauseEvents(): void;
declare function resumeEvents(): void;
declare function nextEvent(ms?: number, match?: EventMatchFn): Promise<Event | null>;
declare function tickMs(ms?: number): Promise<unknown>;
declare function nextKeyPress(ms?: number, match?: EventMatchFn): Promise<Event | null>;
declare function nextKeyOrClick(ms?: number, matchFn?: EventMatchFn): Promise<Event | null>;
declare function pause(ms: number): Promise<boolean | null>;
declare function waitForAck(): Promise<boolean | null>;
declare function loop(keymap: KeyMap): Promise<void>;

type io_d_Event = Event;
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
declare const io_d_hasEvents: typeof hasEvents;
declare const io_d_clearEvents: typeof clearEvents;
declare const io_d_pushEvent: typeof pushEvent;
declare const io_d_dispatchEvent: typeof dispatchEvent;
declare const io_d_makeTickEvent: typeof makeTickEvent;
declare const io_d_makeKeyEvent: typeof makeKeyEvent;
declare const io_d_keyCodeDirection: typeof keyCodeDirection;
declare const io_d_ignoreKeyEvent: typeof ignoreKeyEvent;
declare const io_d_mouse: typeof mouse;
declare const io_d_makeMouseEvent: typeof makeMouseEvent;
declare const io_d_pauseEvents: typeof pauseEvents;
declare const io_d_resumeEvents: typeof resumeEvents;
declare const io_d_nextEvent: typeof nextEvent;
declare const io_d_tickMs: typeof tickMs;
declare const io_d_nextKeyPress: typeof nextKeyPress;
declare const io_d_nextKeyOrClick: typeof nextKeyOrClick;
declare const io_d_pause: typeof pause;
declare const io_d_waitForAck: typeof waitForAck;
declare const io_d_loop: typeof loop;
declare namespace io_d {
  export {
    io_d_Event as Event,
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
    io_d_hasEvents as hasEvents,
    io_d_clearEvents as clearEvents,
    io_d_pushEvent as pushEvent,
    io_d_dispatchEvent as dispatchEvent,
    io_d_makeTickEvent as makeTickEvent,
    io_d_makeKeyEvent as makeKeyEvent,
    io_d_keyCodeDirection as keyCodeDirection,
    io_d_ignoreKeyEvent as ignoreKeyEvent,
    io_d_mouse as mouse,
    io_d_makeMouseEvent as makeMouseEvent,
    io_d_pauseEvents as pauseEvents,
    io_d_resumeEvents as resumeEvents,
    io_d_nextEvent as nextEvent,
    io_d_tickMs as tickMs,
    io_d_nextKeyPress as nextKeyPress,
    io_d_nextKeyOrClick as nextKeyOrClick,
    io_d_pause as pause,
    io_d_waitForAck as waitForAck,
    io_d_loop as loop,
  };
}

interface FovStrategy {
    isBlocked: (x: number, y: number) => boolean;
    calcRadius: (x: number, y: number) => number;
    setVisible: (x: number, y: number, v: number) => void;
    hasXY: (x: number, y: number) => boolean;
}
declare class FOV {
    protected _isBlocked: (x: number, y: number) => boolean;
    protected _calcRadius: (x: number, y: number) => number;
    protected _setVisible: (x: number, y: number, v: number) => void;
    protected _hasXY: (x: number, y: number) => boolean;
    protected _startX: number;
    protected _startY: number;
    protected _maxRadius: number;
    constructor(strategy: FovStrategy);
    calculate(x: number, y: number, maxRadius: number): void;
    castLight(row: number, startSlope: number, endSlope: number, xx: number, xy: number, yx: number, yy: number): void;
}

type fov_d_FovStrategy = FovStrategy;
type fov_d_FOV = FOV;
declare const fov_d_FOV: typeof FOV;
declare namespace fov_d {
  export {
    fov_d_FovStrategy as FovStrategy,
    fov_d_FOV as FOV,
  };
}

declare const FORBIDDEN = -1;
declare const OBSTRUCTION = -2;
declare const AVOIDED = 10;
declare const NO_PATH = 30000;
declare type BlockedFn = (toX: number, toY: number, fromX: number, fromY: number, distanceMap: NumGrid) => boolean;
declare function calculateDistances(distanceMap: NumGrid, destinationX: number, destinationY: number, costMap: NumGrid, eightWays?: boolean): void;
declare function nextStep(distanceMap: NumGrid, x: number, y: number, isBlocked: BlockedFn, useDiagonals?: boolean): Loc;
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
declare class Listener implements Chainable {
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
declare function removeListener(event: string, fn: EventFn, context?: any, once?: boolean): void;
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
declare function off(event: string, fn: EventFn, context?: any, once?: boolean): void;
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
declare function removeAllListeners(event: string): void;
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
declare function make$2(v?: FrequencyConfig): (level: number) => any;

type frequency_d_FrequencyFn = FrequencyFn;
type frequency_d_FrequencyConfig = FrequencyConfig;
declare namespace frequency_d {
  export {
    frequency_d_FrequencyFn as FrequencyFn,
    frequency_d_FrequencyConfig as FrequencyConfig,
    make$2 as make,
  };
}

declare type ScheduleFn = Function;
interface Event$1 {
    fn: ScheduleFn | null;
    time: number;
    next: Event$1 | null;
}
declare class Scheduler {
    private next;
    time: number;
    private cache;
    constructor();
    clear(): void;
    push(fn: ScheduleFn, delay?: number): Event$1;
    pop(): Function | null;
    remove(item: Event$1): void;
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

interface CanvasOptions {
    width?: number;
    height?: number;
    glyphs: Glyphs;
    div?: HTMLElement | string;
    render?: boolean;
}
interface ImageOptions extends CanvasOptions {
    image: HTMLImageElement | string;
}
declare type FontOptions = CanvasOptions & GlyphOptions;
declare class NotSupportedError extends Error {
    constructor(...params: any[]);
}
declare abstract class BaseCanvas {
    protected _data: Uint32Array;
    protected _renderRequested: boolean;
    protected _glyphs: Glyphs;
    protected _autoRender: boolean;
    protected _node: HTMLCanvasElement;
    protected _width: number;
    protected _height: number;
    constructor(options: CanvasOptions);
    get node(): HTMLCanvasElement;
    get width(): number;
    get height(): number;
    get tileWidth(): number;
    get tileHeight(): number;
    get pxWidth(): number;
    get pxHeight(): number;
    get glyphs(): Glyphs;
    set glyphs(glyphs: Glyphs);
    protected _createNode(): HTMLCanvasElement;
    protected abstract _createContext(): void;
    private _configure;
    protected _setGlyphs(glyphs: Glyphs): boolean;
    resize(width: number, height: number): void;
    draw(x: number, y: number, glyph: number, fg: number, bg: number): void;
    protected _requestRender(): void;
    protected _set(x: number, y: number, style: number): boolean;
    copy(data: Uint32Array): void;
    copyTo(data: Uint32Array): void;
    abstract render(): void;
    hasXY(x: number, y: number): boolean;
    toX(x: number): number;
    toY(y: number): number;
}
declare class Canvas extends BaseCanvas {
    private _gl;
    private _buffers;
    private _attribs;
    private _uniforms;
    private _texture;
    constructor(options: CanvasOptions);
    protected _createContext(): void;
    private _createGeometry;
    private _createData;
    protected _setGlyphs(glyphs: Glyphs): boolean;
    _uploadGlyphs(): void;
    resize(width: number, height: number): void;
    protected _set(x: number, y: number, style: number): boolean;
    copy(data: Uint32Array): void;
    copyTo(data: Uint32Array): void;
    render(): void;
}
declare class Canvas2D extends BaseCanvas {
    private _ctx;
    private _changed;
    constructor(options: CanvasOptions);
    protected _createContext(): void;
    protected _set(x: number, y: number, style: number): boolean;
    resize(width: number, height: number): void;
    copy(data: Uint32Array): void;
    render(): void;
    protected _renderCell(index: number): void;
}
declare function withImage(image: ImageOptions | HTMLImageElement | string): Canvas | Canvas2D;
declare function withFont(src: FontOptions | string): Canvas | Canvas2D;

declare type ColorData = number[];
declare type ColorBase = string | number | Color | ColorData;
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
    equals(other: ColorBase): boolean;
    copy(other: ColorBase): this;
    protected _changed(): this;
    clone(): any;
    assign(_r?: number, _g?: number, _b?: number, _rand?: number, _redRand?: number, _greenRand?: number, _blueRand?: number, dances?: boolean): this;
    assignRGB(_r?: number, _g?: number, _b?: number, _rand?: number, _redRand?: number, _greenRand?: number, _blueRand?: number, dances?: boolean): this;
    nullify(): this;
    blackOut(): this;
    toInt(base256?: boolean): number;
    clamp(): this;
    mix(other: ColorBase, percent: number): this;
    lighten(percent: number): this | undefined;
    darken(percent: number): this | undefined;
    bake(): this;
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
declare function make$3(): Color;
declare function make$3(rgb: number, base256?: boolean): Color;
declare function make$3(color?: ColorBase | null): Color;
declare function make$3(arrayLike: ArrayLike<number>, base256?: boolean): Color;
declare function make$3(...rgb: number[]): Color;
declare function from$1(): Color;
declare function from$1(rgb: number, base256?: boolean): Color;
declare function from$1(color?: ColorBase | null): Color;
declare function from$1(arrayLike: ArrayLike<number>, base256?: boolean): Color;
declare function from$1(...rgb: number[]): Color;
declare function separate(a: Color, b: Color): void;
declare function swap(a: Color, b: Color): void;
declare function diff(a: Color, b: Color): number;
declare function install$1(name: string, info: ColorBase): Color;
declare function install$1(name: string, ...rgb: number[]): Color;
declare function installSpread(name: string, info: ColorBase): Color;
declare function installSpread(name: string, ...rgb: number[]): Color;

type color_d_ColorBase = ColorBase;
declare const color_d_colors: typeof colors;
type color_d_Color = Color;
declare const color_d_Color: typeof Color;
declare const color_d_fromArray: typeof fromArray;
declare const color_d_fromCss: typeof fromCss;
declare const color_d_fromName: typeof fromName;
declare const color_d_fromNumber: typeof fromNumber;
declare const color_d_separate: typeof separate;
declare const color_d_swap: typeof swap;
declare const color_d_diff: typeof diff;
declare const color_d_installSpread: typeof installSpread;
declare namespace color_d {
  export {
    color_d_ColorBase as ColorBase,
    color_d_colors as colors,
    color_d_Color as Color,
    color_d_fromArray as fromArray,
    color_d_fromCss as fromCss,
    color_d_fromName as fromName,
    color_d_fromNumber as fromNumber,
    make$3 as make,
    from$1 as from,
    color_d_separate as separate,
    color_d_swap as swap,
    color_d_diff as diff,
    install$1 as install,
    color_d_installSpread as installSpread,
  };
}

interface DrawInfo {
    ch: string | number;
    fg: Color | number;
    bg: Color | number;
}
interface SpriteType extends DrawInfo {
    opacity?: number;
}
declare class Mixer implements DrawInfo {
    ch: string | number;
    fg: Color;
    bg: Color;
    constructor();
    protected _changed(): this;
    copy(other: Mixer): this;
    clone(): Mixer;
    equals(other: Mixer): boolean;
    nullify(): this;
    blackOut(): this;
    draw(ch?: string | number, fg?: ColorBase, bg?: ColorBase): this;
    drawSprite(info: SpriteType, opacity?: number): this | undefined;
    invert(): this;
    multiply(color: ColorBase, fg?: boolean, bg?: boolean): this;
    mix(color: ColorBase, fg?: number, bg?: number): this;
    add(color: ColorBase, fg?: number, bg?: number): this;
    separate(): this;
    bake(): {
        ch: string | number;
        fg: number;
        bg: number;
    };
}

interface SpriteConfig {
    ch?: string | number | null;
    fg?: ColorBase | null;
    bg?: ColorBase | null;
    opacity?: number;
}
declare class Sprite implements SpriteType {
    ch: string | number;
    fg: number | Color;
    bg: number | Color;
    opacity?: number;
    name?: string;
    constructor(ch?: string | number | null, fg?: Color | number | null, bg?: Color | number | null, opacity?: number);
}
declare const sprites: Record<string, Sprite>;
declare function makeSprite(): Sprite;
declare function makeSprite(bg: ColorBase, opacity?: number): Sprite;
declare function makeSprite(ch: string | null, fg: ColorBase | null, bg: ColorBase | null, opacity?: number): Sprite;
declare function makeSprite(args: any[]): Sprite;
declare function makeSprite(info: Partial<SpriteConfig>): Sprite;
declare function installSprite(name: string, bg: ColorBase, opacity?: number): Sprite;
declare function installSprite(name: string, ch: string | null, fg: Color | number | string | number[] | null, bg: Color | number | string | number[] | null, opacity?: number): Sprite;
declare function installSprite(name: string, args: any[]): Sprite;
declare function installSprite(name: string, info: Partial<SpriteConfig>): Sprite;

type index_d_CanvasOptions = CanvasOptions;
type index_d_ImageOptions = ImageOptions;
type index_d_FontOptions = FontOptions;
type index_d_NotSupportedError = NotSupportedError;
declare const index_d_NotSupportedError: typeof NotSupportedError;
type index_d_BaseCanvas = BaseCanvas;
declare const index_d_BaseCanvas: typeof BaseCanvas;
type index_d_Canvas = Canvas;
declare const index_d_Canvas: typeof Canvas;
type index_d_Canvas2D = Canvas2D;
declare const index_d_Canvas2D: typeof Canvas2D;
declare const index_d_withImage: typeof withImage;
declare const index_d_withFont: typeof withFont;
type index_d_SpriteConfig = SpriteConfig;
type index_d_Sprite = Sprite;
declare const index_d_Sprite: typeof Sprite;
declare const index_d_sprites: typeof sprites;
declare const index_d_makeSprite: typeof makeSprite;
declare const index_d_installSprite: typeof installSprite;
type index_d_DrawInfo = DrawInfo;
type index_d_SpriteType = SpriteType;
type index_d_Mixer = Mixer;
declare const index_d_Mixer: typeof Mixer;
type index_d_GlyphOptions = GlyphOptions;
type index_d_Glyphs = Glyphs;
declare const index_d_Glyphs: typeof Glyphs;
declare namespace index_d {
  export {
    index_d_CanvasOptions as CanvasOptions,
    index_d_ImageOptions as ImageOptions,
    index_d_FontOptions as FontOptions,
    index_d_NotSupportedError as NotSupportedError,
    index_d_BaseCanvas as BaseCanvas,
    index_d_Canvas as Canvas,
    index_d_Canvas2D as Canvas2D,
    index_d_withImage as withImage,
    index_d_withFont as withFont,
    index_d_SpriteConfig as SpriteConfig,
    index_d_Sprite as Sprite,
    index_d_sprites as sprites,
    index_d_makeSprite as makeSprite,
    index_d_installSprite as installSprite,
    index_d_DrawInfo as DrawInfo,
    index_d_SpriteType as SpriteType,
    index_d_Mixer as Mixer,
    index_d_GlyphOptions as GlyphOptions,
    index_d_Glyphs as Glyphs,
  };
}

interface Data {
    ch: number;
    fg: number;
    bg: number;
}
declare class DataBuffer {
    private _data;
    private _width;
    private _height;
    constructor(width: number, height: number);
    get data(): Uint32Array;
    get width(): number;
    get height(): number;
    get(x: number, y: number): Data;
    protected _toGlyph(ch: string): number;
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
declare class Buffer extends DataBuffer {
    private _canvas;
    constructor(canvas: Canvas);
    _toGlyph(ch: string): number;
    render(): this;
    copyFromCanvas(): this;
}

type buffer_d_Data = Data;
type buffer_d_DataBuffer = DataBuffer;
declare const buffer_d_DataBuffer: typeof DataBuffer;
type buffer_d_Buffer = Buffer;
declare const buffer_d_Buffer: typeof Buffer;
declare namespace buffer_d {
  export {
    buffer_d_Data as Data,
    buffer_d_DataBuffer as DataBuffer,
    buffer_d_Buffer as Buffer,
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
  };
}

declare const data: any;
declare const config: any;

export { Random, buffer_d as buffer, index_d as canvas, color_d as color, colors, config, cosmetic, data, events_d as events, flag_d as flag, flags, fov_d as fov, frequency_d as frequency, grid_d as grid, io_d as io, path_d as path, random, range_d as range, scheduler_d as scheduler, sprites, index_d$1 as text, utils_d as utils };
