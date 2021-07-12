declare type ColorData = [number, number, number] | [number, number, number, number, number, number, number] | [number, number, number, number, number, number, number, boolean];
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
declare function make$9(): Color;
declare function make$9(rgb: number, base256?: boolean): Color;
declare function make$9(color?: ColorBase | null): Color;
declare function make$9(arrayLike: ColorData, base256?: boolean): Color;
declare function make$9(...rgb: number[]): Color;
declare function from$4(): Color;
declare function from$4(rgb: number, base256?: boolean): Color;
declare function from$4(color?: ColorBase | null): Color;
declare function from$4(arrayLike: ColorData, base256?: boolean): Color;
declare function from$4(...rgb: number[]): Color;
declare function separate(a: Color, b: Color): void;
declare function swap(a: Color, b: Color): void;
declare function relativeLuminance(a: Color, b: Color): number;
declare function distance(a: Color, b: Color): number;
declare function install$3(name: string, info: ColorBase): Color;
declare function install$3(name: string, ...rgb: ColorData): Color;
declare function installSpread(name: string, info: ColorBase): Color;
declare function installSpread(name: string, ...rgb: ColorData): Color;

type color_ColorBase = ColorBase;
declare const color_colors: typeof colors;
type color_Color = Color;
declare const color_Color: typeof Color;
declare const color_fromArray: typeof fromArray;
declare const color_fromCss: typeof fromCss;
declare const color_fromName: typeof fromName;
declare const color_fromNumber: typeof fromNumber;
declare const color_separate: typeof separate;
declare const color_swap: typeof swap;
declare const color_relativeLuminance: typeof relativeLuminance;
declare const color_distance: typeof distance;
declare const color_installSpread: typeof installSpread;
declare namespace color {
  export {
    color_ColorBase as ColorBase,
    color_colors as colors,
    color_Color as Color,
    color_fromArray as fromArray,
    color_fromCss as fromCss,
    color_fromName as fromName,
    color_fromNumber as fromNumber,
    make$9 as make,
    from$4 as from,
    color_separate as separate,
    color_swap as swap,
    color_relativeLuminance as relativeLuminance,
    color_distance as distance,
    install$3 as install,
    color_installSpread as installSpread,
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
    key(obj: BasicObject): any;
    shuffle(list: any[], fromIndex?: number, toIndex?: number): any[];
    sequence(n: number): any[];
    chance(percent: number, outOf?: number): boolean;
    clumped(lo: number, hi: number, clumps: number): number;
    matchingXY(width: number, height: number, matchFn: XYMatchFunc): Loc$1;
    matchingXYNear(x: number, y: number, matchFn: XYMatchFunc): Loc$1;
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
declare function make$8(config: RangeBase | null, rng?: Random): Range;
declare const from$3: typeof make$8;
declare function asFn(config: RangeBase | null, rng?: Random): () => number;

type range_RangeBase = RangeBase;
type range_Range = Range;
declare const range_Range: typeof Range;
declare const range_asFn: typeof asFn;
declare namespace range {
  export {
    range_RangeBase as RangeBase,
    range_Range as Range,
    make$8 as make,
    from$3 as from,
    range_asFn as asFn,
  };
}

declare type BasicObject = {
    [key: string]: any;
};
declare type Loc$1 = [number, number];
interface XY {
    x: number;
    y: number;
}
interface Chainable {
    next: any | null;
}
interface SpriteData {
    readonly ch?: string | null;
    readonly fg?: ColorBase;
    readonly bg?: ColorBase;
    readonly opacity?: number;
}
interface LightType {
    color: Color;
    radius: Range;
    fadeTo: number;
    passThroughActors: boolean;
    paint(map: MapType, x: number, y: number): boolean;
    paint(map: MapType, x: number, y: number, maintainShadows: boolean): boolean;
    paint(map: MapType, x: number, y: number, maintainShadows: boolean, isMinersLight: boolean): boolean;
}
interface LayerFlags {
    readonly layer: number;
}
interface EntityType {
    readonly sprite: SpriteData;
    readonly priority: number;
    readonly layer: number;
    readonly light: LightType | null;
    readonly flags: LayerFlags;
    hasLayerFlag(flag: number): boolean;
}
interface TileFlags extends LayerFlags {
    readonly tile: number;
    readonly tileMech: number;
}
interface TileType extends EntityType {
    readonly id: string;
    readonly flags: TileFlags;
}
interface ActorFlags extends LayerFlags {
    actor: number;
}
interface ActorType extends XY, Chainable, EntityType {
    isPlayer: () => boolean;
    isVisible: () => boolean;
    isDetected: () => boolean;
    blocksVision: () => boolean;
    layerFlags: () => number;
    avoidsCell: (cell: CellType) => boolean;
    forbidsCell: (cell: CellType) => boolean;
    delete: () => void;
    rememberedInCell: CellType | null;
    readonly flags: ActorFlags;
    next: ActorType | null;
}
interface ItemFlags extends LayerFlags {
    item: number;
}
interface ItemType extends XY, Chainable, EntityType {
    quantity: number;
    readonly flags: ItemFlags;
    layerFlags: () => number;
    blocksMove: () => boolean;
    avoidsCell: (cell: CellType) => boolean;
    forbidsCell: (cell: CellType) => boolean;
    isDetected: () => boolean;
    delete: () => void;
    clone: () => this;
    next: ItemType | null;
}
interface FxType extends XY, Chainable, EntityType {
    next: FxType | null;
}
interface CellFlags {
    cell: number;
    cellMech: number;
}
interface CellType {
    flags: CellFlags;
    tileFlags: () => number;
    tileMechFlags: () => number;
    actor: ActorType | null;
    item: ItemType | null;
    storeMemory: () => void;
    isAnyKindOfVisible: () => boolean;
    isVisible: () => boolean;
}
interface MapType {
    readonly width: number;
    readonly height: number;
    isVisible: (x: number, y: number) => boolean;
    actorAt: (x: number, y: number) => ActorType | null;
    itemAt: (x: number, y: number) => ItemType | null;
}

type types_BasicObject = BasicObject;
type types_XY = XY;
type types_Chainable = Chainable;
type types_SpriteData = SpriteData;
type types_LightType = LightType;
type types_LayerFlags = LayerFlags;
type types_EntityType = EntityType;
type types_TileFlags = TileFlags;
type types_TileType = TileType;
type types_ActorFlags = ActorFlags;
type types_ActorType = ActorType;
type types_ItemFlags = ItemFlags;
type types_ItemType = ItemType;
type types_FxType = FxType;
type types_CellFlags = CellFlags;
type types_CellType = CellType;
type types_MapType = MapType;
declare namespace types {
  export {
    types_BasicObject as BasicObject,
    Loc$1 as Loc,
    types_XY as XY,
    types_Chainable as Chainable,
    types_SpriteData as SpriteData,
    types_LightType as LightType,
    types_LayerFlags as LayerFlags,
    types_EntityType as EntityType,
    types_TileFlags as TileFlags,
    types_TileType as TileType,
    types_ActorFlags as ActorFlags,
    types_ActorType as ActorType,
    types_ItemFlags as ItemFlags,
    types_ItemType as ItemType,
    types_FxType as FxType,
    types_CellFlags as CellFlags,
    types_CellType as CellType,
    types_MapType as MapType,
  };
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
declare function getOpt(obj: BasicObject, member: string, _default: any): any;
declare function firstOpt(field: string, ...args: any[]): any;
declare function arraysIntersect(a: any[], b: any[]): boolean;
declare function sum(arr: number[]): number;
declare function chainLength<T extends Chainable>(root: T | null): number;
declare function chainIncludes<T extends Chainable>(chain: T | null, entry: T): boolean;
declare function eachChain<T extends Chainable>(item: T | null, fn: (item: T, index: number) => any): number;
declare function addToChain<T extends Chainable>(obj: any, name: string, entry: T): boolean;
declare function removeFromChain<T extends Chainable>(obj: any, name: string, entry: T): boolean;
declare function forLine(fromX: number, fromY: number, toX: number, toY: number, stepFn: (x: number, y: number) => boolean): void;
declare function getLine(fromX: number, fromY: number, toX: number, toY: number): Loc$1[];
declare function getLineThru(fromX: number, fromY: number, toX: number, toY: number, width: number, height: number): Loc$1[];
declare function forCircle(x: number, y: number, radius: number, fn: XYFunc): void;
declare function forRect(width: number, height: number, fn: XYFunc): void;
declare function forRect(x: number, y: number, width: number, height: number, fn: XYFunc): void;
declare function arcCount(x: number, y: number, testFn: XYMatchFunc): number;

type utils_BasicObject = BasicObject;
type utils_XY = XY;
type utils_Chainable = Chainable;
declare const utils_DIRS: typeof DIRS;
declare const utils_NO_DIRECTION: typeof NO_DIRECTION;
declare const utils_UP: typeof UP;
declare const utils_RIGHT: typeof RIGHT;
declare const utils_DOWN: typeof DOWN;
declare const utils_LEFT: typeof LEFT;
declare const utils_RIGHT_UP: typeof RIGHT_UP;
declare const utils_RIGHT_DOWN: typeof RIGHT_DOWN;
declare const utils_LEFT_DOWN: typeof LEFT_DOWN;
declare const utils_LEFT_UP: typeof LEFT_UP;
declare const utils_CLOCK_DIRS: typeof CLOCK_DIRS;
declare const utils_NOOP: typeof NOOP;
declare const utils_TRUE: typeof TRUE;
declare const utils_FALSE: typeof FALSE;
declare const utils_ONE: typeof ONE;
declare const utils_ZERO: typeof ZERO;
declare const utils_IDENTITY: typeof IDENTITY;
declare const utils_IS_ZERO: typeof IS_ZERO;
declare const utils_IS_NONZERO: typeof IS_NONZERO;
declare const utils_clamp: typeof clamp;
declare const utils_x: typeof x;
declare const utils_y: typeof y;
type utils_Bounds = Bounds;
declare const utils_Bounds: typeof Bounds;
declare const utils_copyXY: typeof copyXY;
declare const utils_addXY: typeof addXY;
declare const utils_equalsXY: typeof equalsXY;
declare const utils_lerpXY: typeof lerpXY;
type utils_XYFunc = XYFunc;
declare const utils_eachNeighbor: typeof eachNeighbor;
type utils_XYMatchFunc = XYMatchFunc;
declare const utils_matchingNeighbor: typeof matchingNeighbor;
declare const utils_distanceBetween: typeof distanceBetween;
declare const utils_distanceFromTo: typeof distanceFromTo;
declare const utils_calcRadius: typeof calcRadius;
declare const utils_dirBetween: typeof dirBetween;
declare const utils_dirFromTo: typeof dirFromTo;
declare const utils_dirIndex: typeof dirIndex;
declare const utils_isOppositeDir: typeof isOppositeDir;
declare const utils_isSameDir: typeof isSameDir;
declare const utils_dirSpread: typeof dirSpread;
declare const utils_stepFromTo: typeof stepFromTo;
declare const utils_smoothHiliteGradient: typeof smoothHiliteGradient;
declare const utils_copyObject: typeof copyObject;
declare const utils_assignObject: typeof assignObject;
declare const utils_assignOmitting: typeof assignOmitting;
declare const utils_setDefault: typeof setDefault;
type utils_AssignCallback = AssignCallback;
declare const utils_setDefaults: typeof setDefaults;
declare const utils_setOptions: typeof setOptions;
declare const utils_kindDefaults: typeof kindDefaults;
declare const utils_pick: typeof pick;
declare const utils_clearObject: typeof clearObject;
declare const utils_ERROR: typeof ERROR;
declare const utils_WARN: typeof WARN;
declare const utils_first: typeof first;
declare const utils_getOpt: typeof getOpt;
declare const utils_firstOpt: typeof firstOpt;
declare const utils_arraysIntersect: typeof arraysIntersect;
declare const utils_sum: typeof sum;
declare const utils_chainLength: typeof chainLength;
declare const utils_chainIncludes: typeof chainIncludes;
declare const utils_eachChain: typeof eachChain;
declare const utils_addToChain: typeof addToChain;
declare const utils_removeFromChain: typeof removeFromChain;
declare const utils_forLine: typeof forLine;
declare const utils_getLine: typeof getLine;
declare const utils_getLineThru: typeof getLineThru;
declare const utils_forCircle: typeof forCircle;
declare const utils_forRect: typeof forRect;
declare const utils_arcCount: typeof arcCount;
declare namespace utils {
  export {
    utils_BasicObject as BasicObject,
    Loc$1 as Loc,
    utils_XY as XY,
    utils_Chainable as Chainable,
    utils_DIRS as DIRS,
    utils_NO_DIRECTION as NO_DIRECTION,
    utils_UP as UP,
    utils_RIGHT as RIGHT,
    utils_DOWN as DOWN,
    utils_LEFT as LEFT,
    utils_RIGHT_UP as RIGHT_UP,
    utils_RIGHT_DOWN as RIGHT_DOWN,
    utils_LEFT_DOWN as LEFT_DOWN,
    utils_LEFT_UP as LEFT_UP,
    utils_CLOCK_DIRS as CLOCK_DIRS,
    utils_NOOP as NOOP,
    utils_TRUE as TRUE,
    utils_FALSE as FALSE,
    utils_ONE as ONE,
    utils_ZERO as ZERO,
    utils_IDENTITY as IDENTITY,
    utils_IS_ZERO as IS_ZERO,
    utils_IS_NONZERO as IS_NONZERO,
    utils_clamp as clamp,
    utils_x as x,
    utils_y as y,
    utils_Bounds as Bounds,
    utils_copyXY as copyXY,
    utils_addXY as addXY,
    utils_equalsXY as equalsXY,
    utils_lerpXY as lerpXY,
    utils_XYFunc as XYFunc,
    utils_eachNeighbor as eachNeighbor,
    utils_XYMatchFunc as XYMatchFunc,
    utils_matchingNeighbor as matchingNeighbor,
    utils_distanceBetween as distanceBetween,
    utils_distanceFromTo as distanceFromTo,
    utils_calcRadius as calcRadius,
    utils_dirBetween as dirBetween,
    utils_dirFromTo as dirFromTo,
    utils_dirIndex as dirIndex,
    utils_isOppositeDir as isOppositeDir,
    utils_isSameDir as isSameDir,
    utils_dirSpread as dirSpread,
    utils_stepFromTo as stepFromTo,
    utils_smoothHiliteGradient as smoothHiliteGradient,
    utils_copyObject as copyObject,
    utils_assignObject as assignObject,
    utils_assignOmitting as assignOmitting,
    utils_setDefault as setDefault,
    utils_AssignCallback as AssignCallback,
    utils_setDefaults as setDefaults,
    utils_setOptions as setOptions,
    utils_kindDefaults as kindDefaults,
    utils_pick as pick,
    utils_clearObject as clearObject,
    utils_ERROR as ERROR,
    utils_WARN as WARN,
    utils_first as first,
    utils_getOpt as getOpt,
    utils_firstOpt as firstOpt,
    utils_arraysIntersect as arraysIntersect,
    utils_sum as sum,
    utils_chainLength as chainLength,
    utils_chainIncludes as chainIncludes,
    utils_eachChain as eachChain,
    utils_addToChain as addToChain,
    utils_removeFromChain as removeFromChain,
    utils_forLine as forLine,
    utils_getLine as getLine,
    utils_getLineThru as getLineThru,
    utils_forCircle as forCircle,
    utils_forRect as forRect,
    utils_arcCount as arcCount,
  };
}

declare type FlagSource = number | string;
declare type FlagBase = number | string | FlagSource[] | null;
declare function fl(N: number): number;
declare function toString(flagObj: any, value: number): string;
declare function from$2(obj: any, ...args: (FlagBase | undefined)[]): number;

type flag_FlagBase = FlagBase;
declare const flag_fl: typeof fl;
declare const flag_toString: typeof toString;
declare namespace flag {
  export {
    flag_FlagBase as FlagBase,
    flag_fl as fl,
    flag_toString as toString,
    from$2 as from,
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
declare function make$7<T>(w: number, h: number, v?: number | GridInit<number>): NumGrid;
declare function make$7<T>(w: number, h: number, v?: T | GridInit<T>): Grid<T>;
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
    make$7 as make,
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
declare function make$6(): Loop;
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
    make$6 as make,
    io_loop as loop,
  };
}

interface FovStrategy {
    isBlocked: (x: number, y: number) => boolean;
    calcRadius?: (x: number, y: number) => number;
    setVisible: (x: number, y: number, v: number) => void;
    hasXY?: (x: number, y: number) => boolean;
    debug?: (...args: any[]) => void;
}
declare class FOV {
    protected _isBlocked: (x: number, y: number) => boolean;
    protected _calcRadius: (x: number, y: number) => number;
    protected _setVisible: (x: number, y: number, v: number) => void;
    protected _hasXY: (x: number, y: number) => boolean;
    protected _debug: (...args: any[]) => void;
    protected _startX: number;
    protected _startY: number;
    protected _maxRadius: number;
    constructor(strategy: FovStrategy);
    calculate(x: number, y: number, maxRadius?: number): void;
    castLight(row: number, startSlope: number, endSlope: number, xx: number, xy: number, yx: number, yy: number): void;
}

type fov_FovStrategy = FovStrategy;
type fov_FOV = FOV;
declare const fov_FOV: typeof FOV;
declare namespace fov {
  export {
    fov_FovStrategy as FovStrategy,
    fov_FOV as FOV,
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
declare function make$5(v?: FrequencyConfig): (level: number) => any;

type frequency_FrequencyFn = FrequencyFn;
type frequency_FrequencyConfig = FrequencyConfig;
declare namespace frequency {
  export {
    frequency_FrequencyFn as FrequencyFn,
    frequency_FrequencyConfig as FrequencyConfig,
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
    drawSprite(src: SpriteData | Mixer, opacity?: number): this | undefined;
    invert(): this;
    multiply(color: ColorBase, fg?: boolean, bg?: boolean): this;
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
    abstract render(): void;
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
    render(): void;
}
declare class Canvas2D extends BaseCanvas {
    private _ctx;
    private _changed;
    constructor(width: number, height: number, glyphs: Glyphs);
    protected _createContext(): void;
    resize(width: number, height: number): void;
    copy(data: Uint32Array): void;
    render(): void;
    protected _renderCell(index: number): void;
}
declare function make$4(opts: Partial<CanvasOptions>): BaseCanvas;
declare function make$4(width: number, height: number, opts?: Partial<CanvasOptions>): BaseCanvas;

type index$2_MouseEventFn = MouseEventFn;
type index$2_CanvasOptions = CanvasOptions;
type index$2_NotSupportedError = NotSupportedError;
declare const index$2_NotSupportedError: typeof NotSupportedError;
type index$2_BaseCanvas = BaseCanvas;
declare const index$2_BaseCanvas: typeof BaseCanvas;
type index$2_Canvas = Canvas;
declare const index$2_Canvas: typeof Canvas;
type index$2_Canvas2D = Canvas2D;
declare const index$2_Canvas2D: typeof Canvas2D;
type index$2_GlyphOptions = GlyphOptions;
type index$2_Glyphs = Glyphs;
declare const index$2_Glyphs: typeof Glyphs;
type index$2_DrawData = DrawData;
type index$2_BufferTarget = BufferTarget;
type index$2_DataBuffer = DataBuffer;
declare const index$2_DataBuffer: typeof DataBuffer;
type index$2_Buffer = Buffer;
declare const index$2_Buffer: typeof Buffer;
declare const index$2_makeBuffer: typeof makeBuffer;
declare namespace index$2 {
  export {
    index$2_MouseEventFn as MouseEventFn,
    index$2_CanvasOptions as CanvasOptions,
    index$2_NotSupportedError as NotSupportedError,
    index$2_BaseCanvas as BaseCanvas,
    index$2_Canvas as Canvas,
    index$2_Canvas2D as Canvas2D,
    make$4 as make,
    index$2_GlyphOptions as GlyphOptions,
    index$2_Glyphs as Glyphs,
    index$2_DrawData as DrawData,
    index$2_BufferTarget as BufferTarget,
    index$2_DataBuffer as DataBuffer,
    index$2_Buffer as Buffer,
    index$2_makeBuffer as makeBuffer,
  };
}

interface SpriteConfig {
    ch: string | null;
    fg: ColorBase | null;
    bg: ColorBase | null;
    opacity: number;
}
declare class Sprite implements SpriteData {
    ch: string | null;
    fg: Color;
    bg: Color;
    opacity: number;
    name?: string;
    constructor(ch?: string | null, fg?: ColorBase | null, bg?: ColorBase | null, opacity?: number);
    clone(): Sprite;
}
declare const sprites: Record<string, Sprite>;
declare function make$3(): Sprite;
declare function make$3(bg: ColorBase, opacity?: number): Sprite;
declare function make$3(ch: string | null, fg: ColorBase | null, bg: ColorBase | null, opacity?: number): Sprite;
declare function make$3(args: any[]): Sprite;
declare function make$3(info: Partial<SpriteConfig>): Sprite;
declare function from$1(name: string): Sprite;
declare function from$1(config: Partial<SpriteConfig>): Sprite;
declare function install$2(name: string, bg: ColorBase, opacity?: number): Sprite;
declare function install$2(name: string, ch: string | null, fg: Color | number | string | number[] | null, bg: Color | number | string | number[] | null, opacity?: number): Sprite;
declare function install$2(name: string, args: any[]): Sprite;
declare function install$2(name: string, info: Partial<SpriteConfig>): Sprite;

type index$1_SpriteConfig = SpriteConfig;
type index$1_Sprite = Sprite;
declare const index$1_Sprite: typeof Sprite;
declare const index$1_sprites: typeof sprites;
type index$1_DrawInfo = DrawInfo;
type index$1_Mixer = Mixer;
declare const index$1_Mixer: typeof Mixer;
declare namespace index$1 {
  export {
    index$1_SpriteConfig as SpriteConfig,
    index$1_Sprite as Sprite,
    index$1_sprites as sprites,
    make$3 as make,
    from$1 as from,
    install$2 as install,
    index$1_DrawInfo as DrawInfo,
    index$1_Mixer as Mixer,
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

declare const index_compile: typeof compile;
declare const index_apply: typeof apply;
declare const index_eachChar: typeof eachChar;
declare const index_length: typeof length;
declare const index_padStart: typeof padStart;
declare const index_padEnd: typeof padEnd;
declare const index_center: typeof center;
declare const index_firstChar: typeof firstChar;
declare const index_capitalize: typeof capitalize;
declare const index_removeColors: typeof removeColors;
declare const index_wordWrap: typeof wordWrap;
declare const index_splitIntoLines: typeof splitIntoLines;
declare const index_addHelper: typeof addHelper;
declare const index_options: typeof options;
type index_Template = Template;
declare namespace index {
  export {
    index_compile as compile,
    index_apply as apply,
    index_eachChar as eachChar,
    index_length as length,
    index_padStart as padStart,
    index_padEnd as padEnd,
    index_center as center,
    index_firstChar as firstChar,
    index_capitalize as capitalize,
    index_removeColors as removeColors,
    index_wordWrap as wordWrap,
    index_splitIntoLines as splitIntoLines,
    configure$1 as configure,
    index_addHelper as addHelper,
    index_options as options,
    index_Template as Template,
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
declare function fromActor(actor: ActorType, msg: string, args?: any): void;
declare function forPlayer(actor: ActorType, msg: string, args?: any): void;
declare function addCombat(actor: ActorType, msg: string, args?: any): void;
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

declare enum Flags {
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
interface EffectCtx {
    actor?: ActorType | null;
    target?: ActorType | null;
    item?: ItemType | null;
    layer?: number;
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
interface EffectInfo {
    flags: number;
    chance: number;
    next: EffectInfo | string | null;
    id: string;
    [id: string]: any;
}
interface EffectHandler {
    make: (src: Partial<EffectConfig>, dest: EffectInfo) => boolean;
    fire: (config: EffectInfo, map: MapType, x: number, y: number, ctx: EffectCtx) => boolean | Promise<boolean>;
}
declare function fire(effect: EffectInfo | string, map: MapType, x: number, y: number, ctx_?: Partial<EffectCtx>): Promise<boolean>;
declare function reset(effect: EffectInfo): void;
declare function resetAll(): void;
declare const effects: Record<string, EffectInfo>;
declare function make$2(opts: EffectBase): EffectInfo;
declare function from(opts: EffectBase | string): EffectInfo;
declare function install(id: string, config: Partial<EffectConfig>): EffectInfo;
declare function installAll(effects: Record<string, Partial<EffectConfig>>): void;
declare const effectTypes: Record<string, EffectHandler>;
declare function installType(id: string, effectType: EffectHandler): void;

type effect_Flags = Flags;
declare const effect_Flags: typeof Flags;
type effect_EffectCtx = EffectCtx;
type effect_EffectConfig = EffectConfig;
type effect_EffectBase = EffectBase;
type effect_EffectInfo = EffectInfo;
type effect_EffectHandler = EffectHandler;
declare const effect_fire: typeof fire;
declare const effect_reset: typeof reset;
declare const effect_resetAll: typeof resetAll;
declare const effect_effects: typeof effects;
declare const effect_from: typeof from;
declare const effect_install: typeof install;
declare const effect_installAll: typeof installAll;
declare const effect_effectTypes: typeof effectTypes;
declare const effect_installType: typeof installType;
declare namespace effect {
  export {
    effect_Flags as Flags,
    effect_EffectCtx as EffectCtx,
    effect_EffectConfig as EffectConfig,
    effect_EffectBase as EffectBase,
    effect_EffectInfo as EffectInfo,
    effect_EffectHandler as EffectHandler,
    effect_fire as fire,
    effect_reset as reset,
    effect_resetAll as resetAll,
    effect_effects as effects,
    make$2 as make,
    effect_from as from,
    effect_install as install,
    effect_installAll as installAll,
    effect_effectTypes as effectTypes,
    effect_installType as installType,
  };
}

declare const data: any;
declare const config: any;
declare const make$1: any;
declare const flags: any;

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
declare function make(opts?: Partial<BlobConfig>): Blob;

type blob_BlobConfig = BlobConfig;
type blob_Blob = Blob;
declare const blob_Blob: typeof Blob;
declare const blob_fillBlob: typeof fillBlob;
declare const blob_make: typeof make;
declare namespace blob {
  export {
    blob_BlobConfig as BlobConfig,
    blob_Blob as Blob,
    blob_fillBlob as fillBlob,
    blob_make as make,
  };
}

export { Random, blob, index$2 as canvas, color, colors, config, cosmetic, data, effect, events, flag, flags, fov, frequency, grid, io, loop, make$1 as make, message, path, random, range, scheduler, index$1 as sprite, sprites, index as text, types, utils };
