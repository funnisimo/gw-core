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
    key(obj: object): any;
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
declare function make$a(config: RangeBase | null, rng?: Random): Range;
declare const from$5: typeof make$a;
declare function asFn(config: RangeBase | null, rng?: Random): () => number;

type range_RangeBase = RangeBase;
type range_Range = Range;
declare const range_Range: typeof Range;
declare const range_asFn: typeof asFn;
declare namespace range {
  export {
    range_RangeBase as RangeBase,
    range_Range as Range,
    make$a as make,
    from$5 as from,
    range_asFn as asFn,
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
declare type LightValue = [number, number, number];
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
    isVisible(x: number, y: number): boolean;
    hasActor(x: number, y: number): boolean;
    blocksVision(x: number, y: number): boolean;
    anyLightChanged: boolean;
    glowLightChanged: boolean;
    eachGlowLight(cb: LightCb): void;
    eachDynamicLight(cb: LightCb): void;
    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;
    hasCellFlag(x: number, y: number, flag: number): boolean;
}
interface LightSystemType {
    update(force?: boolean): boolean;
    setAmbient(light: LightValue | Color): void;
    addStatic(x: number, y: number, light: LightType): void;
    removeStatic(x: number, y: number, light?: LightType): void;
    getLight(x: number, y: number): LightValue;
}

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
declare function install$4(name: string, info: ColorBase): Color;
declare function install$4(name: string, ...rgb: ColorData): Color;
declare function installSpread(name: string, info: ColorBase): Color;
declare function installSpread(name: string, ...rgb: ColorData): Color;
declare const NONE: Color;

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
declare const color_NONE: typeof NONE;
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
    install$4 as install,
    color_installSpread as installSpread,
    color_NONE as NONE,
  };
}

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
interface LayerFlags {
    readonly layer: number;
}
interface EntityType {
    readonly sprite: SpriteData;
    readonly priority: number;
    readonly layer: number;
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

type types_XY = XY;
type types_Chainable = Chainable;
type types_SpriteData = SpriteData;
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
    Loc$1 as Loc,
    types_XY as XY,
    types_Chainable as Chainable,
    types_SpriteData as SpriteData,
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
declare function getOpt(obj: any, member: string, _default: any): any;
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
declare function forBorder(width: number, height: number, fn: XYFunc): void;
declare function forBorder(x: number, y: number, width: number, height: number, fn: XYFunc): void;
declare function arcCount(x: number, y: number, testFn: XYMatchFunc): number;

type index$7_XY = XY;
type index$7_Chainable = Chainable;
declare const index$7_DIRS: typeof DIRS;
declare const index$7_NO_DIRECTION: typeof NO_DIRECTION;
declare const index$7_UP: typeof UP;
declare const index$7_RIGHT: typeof RIGHT;
declare const index$7_DOWN: typeof DOWN;
declare const index$7_LEFT: typeof LEFT;
declare const index$7_RIGHT_UP: typeof RIGHT_UP;
declare const index$7_RIGHT_DOWN: typeof RIGHT_DOWN;
declare const index$7_LEFT_DOWN: typeof LEFT_DOWN;
declare const index$7_LEFT_UP: typeof LEFT_UP;
declare const index$7_CLOCK_DIRS: typeof CLOCK_DIRS;
declare const index$7_NOOP: typeof NOOP;
declare const index$7_TRUE: typeof TRUE;
declare const index$7_FALSE: typeof FALSE;
declare const index$7_ONE: typeof ONE;
declare const index$7_ZERO: typeof ZERO;
declare const index$7_IDENTITY: typeof IDENTITY;
declare const index$7_IS_ZERO: typeof IS_ZERO;
declare const index$7_IS_NONZERO: typeof IS_NONZERO;
declare const index$7_clamp: typeof clamp;
declare const index$7_x: typeof x;
declare const index$7_y: typeof y;
type index$7_Bounds = Bounds;
declare const index$7_Bounds: typeof Bounds;
declare const index$7_copyXY: typeof copyXY;
declare const index$7_addXY: typeof addXY;
declare const index$7_equalsXY: typeof equalsXY;
declare const index$7_lerpXY: typeof lerpXY;
type index$7_XYFunc = XYFunc;
declare const index$7_eachNeighbor: typeof eachNeighbor;
type index$7_XYMatchFunc = XYMatchFunc;
declare const index$7_matchingNeighbor: typeof matchingNeighbor;
declare const index$7_distanceBetween: typeof distanceBetween;
declare const index$7_distanceFromTo: typeof distanceFromTo;
declare const index$7_calcRadius: typeof calcRadius;
declare const index$7_dirBetween: typeof dirBetween;
declare const index$7_dirFromTo: typeof dirFromTo;
declare const index$7_dirIndex: typeof dirIndex;
declare const index$7_isOppositeDir: typeof isOppositeDir;
declare const index$7_isSameDir: typeof isSameDir;
declare const index$7_dirSpread: typeof dirSpread;
declare const index$7_stepFromTo: typeof stepFromTo;
declare const index$7_smoothHiliteGradient: typeof smoothHiliteGradient;
declare const index$7_copyObject: typeof copyObject;
declare const index$7_assignObject: typeof assignObject;
declare const index$7_assignOmitting: typeof assignOmitting;
declare const index$7_setDefault: typeof setDefault;
type index$7_AssignCallback = AssignCallback;
declare const index$7_setDefaults: typeof setDefaults;
declare const index$7_setOptions: typeof setOptions;
declare const index$7_kindDefaults: typeof kindDefaults;
declare const index$7_pick: typeof pick;
declare const index$7_clearObject: typeof clearObject;
declare const index$7_ERROR: typeof ERROR;
declare const index$7_WARN: typeof WARN;
declare const index$7_first: typeof first;
declare const index$7_getOpt: typeof getOpt;
declare const index$7_firstOpt: typeof firstOpt;
declare const index$7_arraysIntersect: typeof arraysIntersect;
declare const index$7_sum: typeof sum;
declare const index$7_chainLength: typeof chainLength;
declare const index$7_chainIncludes: typeof chainIncludes;
declare const index$7_eachChain: typeof eachChain;
declare const index$7_addToChain: typeof addToChain;
declare const index$7_removeFromChain: typeof removeFromChain;
declare const index$7_forLine: typeof forLine;
declare const index$7_getLine: typeof getLine;
declare const index$7_getLineThru: typeof getLineThru;
declare const index$7_forCircle: typeof forCircle;
declare const index$7_forRect: typeof forRect;
declare const index$7_forBorder: typeof forBorder;
declare const index$7_arcCount: typeof arcCount;
declare namespace index$7 {
  export {
    Loc$1 as Loc,
    index$7_XY as XY,
    index$7_Chainable as Chainable,
    index$7_DIRS as DIRS,
    index$7_NO_DIRECTION as NO_DIRECTION,
    index$7_UP as UP,
    index$7_RIGHT as RIGHT,
    index$7_DOWN as DOWN,
    index$7_LEFT as LEFT,
    index$7_RIGHT_UP as RIGHT_UP,
    index$7_RIGHT_DOWN as RIGHT_DOWN,
    index$7_LEFT_DOWN as LEFT_DOWN,
    index$7_LEFT_UP as LEFT_UP,
    index$7_CLOCK_DIRS as CLOCK_DIRS,
    index$7_NOOP as NOOP,
    index$7_TRUE as TRUE,
    index$7_FALSE as FALSE,
    index$7_ONE as ONE,
    index$7_ZERO as ZERO,
    index$7_IDENTITY as IDENTITY,
    index$7_IS_ZERO as IS_ZERO,
    index$7_IS_NONZERO as IS_NONZERO,
    index$7_clamp as clamp,
    index$7_x as x,
    index$7_y as y,
    index$7_Bounds as Bounds,
    index$7_copyXY as copyXY,
    index$7_addXY as addXY,
    index$7_equalsXY as equalsXY,
    index$7_lerpXY as lerpXY,
    index$7_XYFunc as XYFunc,
    index$7_eachNeighbor as eachNeighbor,
    index$7_XYMatchFunc as XYMatchFunc,
    index$7_matchingNeighbor as matchingNeighbor,
    index$7_distanceBetween as distanceBetween,
    index$7_distanceFromTo as distanceFromTo,
    index$7_calcRadius as calcRadius,
    index$7_dirBetween as dirBetween,
    index$7_dirFromTo as dirFromTo,
    index$7_dirIndex as dirIndex,
    index$7_isOppositeDir as isOppositeDir,
    index$7_isSameDir as isSameDir,
    index$7_dirSpread as dirSpread,
    index$7_stepFromTo as stepFromTo,
    index$7_smoothHiliteGradient as smoothHiliteGradient,
    index$7_copyObject as copyObject,
    index$7_assignObject as assignObject,
    index$7_assignOmitting as assignOmitting,
    index$7_setDefault as setDefault,
    index$7_AssignCallback as AssignCallback,
    index$7_setDefaults as setDefaults,
    index$7_setOptions as setOptions,
    index$7_kindDefaults as kindDefaults,
    index$7_pick as pick,
    index$7_clearObject as clearObject,
    index$7_ERROR as ERROR,
    index$7_WARN as WARN,
    index$7_first as first,
    index$7_getOpt as getOpt,
    index$7_firstOpt as firstOpt,
    index$7_arraysIntersect as arraysIntersect,
    index$7_sum as sum,
    index$7_chainLength as chainLength,
    index$7_chainIncludes as chainIncludes,
    index$7_eachChain as eachChain,
    index$7_addToChain as addToChain,
    index$7_removeFromChain as removeFromChain,
    index$7_forLine as forLine,
    index$7_getLine as getLine,
    index$7_getLineThru as getLineThru,
    index$7_forCircle as forCircle,
    index$7_forRect as forRect,
    index$7_forBorder as forBorder,
    index$7_arcCount as arcCount,
  };
}

declare type FlagSource = number | string;
declare type FlagBase = number | string | FlagSource[] | null;
declare function fl(N: number): number;
declare function toString(flagObj: any, value: number): string;
declare function from$3(obj: any, ...args: (FlagBase | undefined)[]): number;

type flag_FlagBase = FlagBase;
declare const flag_fl: typeof fl;
declare const flag_toString: typeof toString;
declare namespace flag {
  export {
    flag_FlagBase as FlagBase,
    flag_fl as fl,
    flag_toString as toString,
    from$3 as from,
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
declare function make$8<T>(w: number, h: number, v?: number | GridInit<number>): NumGrid;
declare function make$8<T>(w: number, h: number, v?: T | GridInit<T>): Grid<T>;
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
    make$8 as make,
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
declare function make$7(): Loop;
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
    make$7 as make,
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
declare function make$6(v?: FrequencyConfig): FrequencyFn;

type frequency_FrequencyFn = FrequencyFn;
type frequency_FrequencyConfig = FrequencyConfig;
declare namespace frequency {
  export {
    frequency_FrequencyFn as FrequencyFn,
    frequency_FrequencyConfig as FrequencyConfig,
    make$6 as make,
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
declare function make$5(opts: Partial<CanvasOptions>): BaseCanvas;
declare function make$5(width: number, height: number, opts?: Partial<CanvasOptions>): BaseCanvas;

type index$6_MouseEventFn = MouseEventFn;
type index$6_CanvasOptions = CanvasOptions;
type index$6_NotSupportedError = NotSupportedError;
declare const index$6_NotSupportedError: typeof NotSupportedError;
type index$6_BaseCanvas = BaseCanvas;
declare const index$6_BaseCanvas: typeof BaseCanvas;
type index$6_Canvas = Canvas;
declare const index$6_Canvas: typeof Canvas;
type index$6_Canvas2D = Canvas2D;
declare const index$6_Canvas2D: typeof Canvas2D;
type index$6_GlyphOptions = GlyphOptions;
type index$6_Glyphs = Glyphs;
declare const index$6_Glyphs: typeof Glyphs;
type index$6_DrawData = DrawData;
type index$6_BufferTarget = BufferTarget;
type index$6_DataBuffer = DataBuffer;
declare const index$6_DataBuffer: typeof DataBuffer;
type index$6_Buffer = Buffer;
declare const index$6_Buffer: typeof Buffer;
declare const index$6_makeBuffer: typeof makeBuffer;
declare namespace index$6 {
  export {
    index$6_MouseEventFn as MouseEventFn,
    index$6_CanvasOptions as CanvasOptions,
    index$6_NotSupportedError as NotSupportedError,
    index$6_BaseCanvas as BaseCanvas,
    index$6_Canvas as Canvas,
    index$6_Canvas2D as Canvas2D,
    make$5 as make,
    index$6_GlyphOptions as GlyphOptions,
    index$6_Glyphs as Glyphs,
    index$6_DrawData as DrawData,
    index$6_BufferTarget as BufferTarget,
    index$6_DataBuffer as DataBuffer,
    index$6_Buffer as Buffer,
    index$6_makeBuffer as makeBuffer,
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
declare function make$4(): Sprite;
declare function make$4(bg: ColorBase, opacity?: number): Sprite;
declare function make$4(ch: string | null, fg: ColorBase | null, bg: ColorBase | null, opacity?: number): Sprite;
declare function make$4(args: any[]): Sprite;
declare function make$4(info: Partial<SpriteConfig>): Sprite;
declare function from$2(name: string): Sprite;
declare function from$2(config: Partial<SpriteConfig>): Sprite;
declare function install$3(name: string, bg: ColorBase, opacity?: number): Sprite;
declare function install$3(name: string, ch: string | null, fg: Color | number | string | number[] | null, bg: Color | number | string | number[] | null, opacity?: number): Sprite;
declare function install$3(name: string, args: any[]): Sprite;
declare function install$3(name: string, info: Partial<SpriteConfig>): Sprite;

type index$5_SpriteConfig = SpriteConfig;
type index$5_Sprite = Sprite;
declare const index$5_Sprite: typeof Sprite;
declare const index$5_sprites: typeof sprites;
type index$5_DrawInfo = DrawInfo;
type index$5_Mixer = Mixer;
declare const index$5_Mixer: typeof Mixer;
declare namespace index$5 {
  export {
    index$5_SpriteConfig as SpriteConfig,
    index$5_Sprite as Sprite,
    index$5_sprites as sprites,
    make$4 as make,
    from$2 as from,
    install$3 as install,
    index$5_DrawInfo as DrawInfo,
    index$5_Mixer as Mixer,
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

declare const index$4_compile: typeof compile;
declare const index$4_apply: typeof apply;
declare const index$4_eachChar: typeof eachChar;
declare const index$4_length: typeof length;
declare const index$4_padStart: typeof padStart;
declare const index$4_padEnd: typeof padEnd;
declare const index$4_center: typeof center;
declare const index$4_firstChar: typeof firstChar;
declare const index$4_capitalize: typeof capitalize;
declare const index$4_removeColors: typeof removeColors;
declare const index$4_wordWrap: typeof wordWrap;
declare const index$4_splitIntoLines: typeof splitIntoLines;
declare const index$4_addHelper: typeof addHelper;
declare const index$4_options: typeof options;
type index$4_Template = Template;
declare namespace index$4 {
  export {
    index$4_compile as compile,
    index$4_apply as apply,
    index$4_eachChar as eachChar,
    index$4_length as length,
    index$4_padStart as padStart,
    index$4_padEnd as padEnd,
    index$4_center as center,
    index$4_firstChar as firstChar,
    index$4_capitalize as capitalize,
    index$4_removeColors as removeColors,
    index$4_wordWrap as wordWrap,
    index$4_splitIntoLines as splitIntoLines,
    configure$1 as configure,
    index$4_addHelper as addHelper,
    index$4_options as options,
    index$4_Template as Template,
  };
}

declare const templates: Record<string, Template>;
declare function install$2(id: string, msg: string): void;
declare function installAll$2(config: Record<string, string>): void;
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
    install$2 as install,
    installAll$2 as installAll,
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
declare function make$3(opts: EffectBase): EffectInfo;
declare function from$1(opts: EffectBase | string): EffectInfo;
declare function install$1(id: string, config: Partial<EffectConfig>): EffectInfo;
declare function installAll$1(effects: Record<string, Partial<EffectConfig>>): void;
declare const effectTypes: Record<string, EffectHandler>;
declare function installType(id: string, effectType: EffectHandler): void;

type index$3_Flags = Flags;
declare const index$3_Flags: typeof Flags;
type index$3_EffectCtx = EffectCtx;
type index$3_EffectConfig = EffectConfig;
type index$3_EffectBase = EffectBase;
type index$3_EffectInfo = EffectInfo;
type index$3_EffectHandler = EffectHandler;
declare const index$3_fire: typeof fire;
declare const index$3_reset: typeof reset;
declare const index$3_resetAll: typeof resetAll;
declare const index$3_effects: typeof effects;
declare const index$3_effectTypes: typeof effectTypes;
declare const index$3_installType: typeof installType;
declare namespace index$3 {
  export {
    index$3_Flags as Flags,
    index$3_EffectCtx as EffectCtx,
    index$3_EffectConfig as EffectConfig,
    index$3_EffectBase as EffectBase,
    index$3_EffectInfo as EffectInfo,
    index$3_EffectHandler as EffectHandler,
    index$3_fire as fire,
    index$3_reset as reset,
    index$3_resetAll as resetAll,
    index$3_effects as effects,
    make$3 as make,
    from$1 as from,
    install$1 as install,
    installAll$1 as installAll,
    index$3_effectTypes as effectTypes,
    index$3_installType as installType,
  };
}

declare const data: any;
declare const config$1: any;
declare const make$2: any;
declare const flags$2: any;

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
declare function make$1(opts?: Partial<BlobConfig>): Blob;

type blob_BlobConfig = BlobConfig;
type blob_Blob = Blob;
declare const blob_Blob: typeof Blob;
declare const blob_fillBlob: typeof fillBlob;
declare namespace blob {
  export {
    blob_BlobConfig as BlobConfig,
    blob_Blob as Blob,
    blob_fillBlob as fillBlob,
    make$1 as make,
  };
}

declare enum GameObject {
    L_SUPERPRIORITY,
    L_SECRETLY_PASSABLE,
    L_BLOCKS_MOVE,
    L_BLOCKS_VISION,
    L_BLOCKS_SURFACE,
    L_BLOCKS_LIQUID,
    L_BLOCKS_GAS,
    L_BLOCKS_ITEMS,
    L_BLOCKS_ACTORS,
    L_BLOCKS_EFFECTS,
    L_BLOCKS_DIAGONAL,
    L_INTERRUPT_WHEN_SEEN,
    L_LIST_IN_SIDEBAR,
    L_VISUALLY_DISTINCT,
    L_BRIGHT_MEMORY,
    L_INVERT_WHEN_HIGHLIGHTED,
    L_BLOCKED_BY_STAIRS,
    L_BLOCKS_SCENT,
    L_DIVIDES_LEVEL,
    L_WAYPOINT_BLOCKER,
    L_IS_WALL,
    L_BLOCKS_EVERYTHING
}

declare const flags$1: {
    GameObject: typeof GameObject;
};

declare namespace index$2 {
  export {
    flags$1 as flags,
  };
}

declare const config: {
    INTENSITY_DARK: number;
};
declare class Light implements LightType {
    color: Color;
    radius: Range;
    fadeTo: number;
    passThroughActors: boolean;
    id: string | null;
    constructor(color: ColorBase, range: string | Range, fadeTo: number, pass?: boolean);
    copy(other: Light): void;
    get intensity(): number;
    paint(map: PaintSite, x: number, y: number, maintainShadows?: boolean, isMinersLight?: boolean): boolean;
}
declare function intensity(light: Color | LightValue): number;
declare function isDarkLight(light: Color | LightValue, threshold?: number): boolean;
declare function make(color: ColorBase, radius: RangeBase, fadeTo?: number, pass?: boolean): Light;
declare function make(light: LightBase): Light;
declare const lights: Record<string, Light>;
declare function from(light: LightBase | LightType): Light;
declare function install(id: string, color: ColorBase, radius: RangeBase, fadeTo?: number, pass?: boolean): Light;
declare function install(id: string, base: LightBase): Light;
declare function install(id: string, config: LightConfig): Light;
declare function installAll(config?: Record<string, LightConfig | LightBase>): void;

interface StaticLightInfo {
    x: number;
    y: number;
    light: LightType;
    next: StaticLightInfo | null;
}
declare class LightSystem implements LightSystemType, PaintSite {
    site: LightSystemSite;
    staticLights: StaticLightInfo | null;
    ambient: LightValue;
    light: Grid<LightValue>;
    oldLight: Grid<LightValue>;
    glowLight: Grid<LightValue>;
    constructor(map: LightSystemSite);
    setAmbient(light: LightValue | Color): void;
    getLight(x: number, y: number): LightValue;
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

type index$1_LightConfig = LightConfig;
type index$1_LightBase = LightBase;
type index$1_LightType = LightType;
type index$1_LightValue = LightValue;
type index$1_LightCb = LightCb;
type index$1_PaintSite = PaintSite;
type index$1_LightSystemSite = LightSystemSite;
type index$1_LightSystemType = LightSystemType;
declare const index$1_config: typeof config;
type index$1_Light = Light;
declare const index$1_Light: typeof Light;
declare const index$1_intensity: typeof intensity;
declare const index$1_isDarkLight: typeof isDarkLight;
declare const index$1_make: typeof make;
declare const index$1_lights: typeof lights;
declare const index$1_from: typeof from;
declare const index$1_install: typeof install;
declare const index$1_installAll: typeof installAll;
type index$1_StaticLightInfo = StaticLightInfo;
type index$1_LightSystem = LightSystem;
declare const index$1_LightSystem: typeof LightSystem;
declare namespace index$1 {
  export {
    index$1_LightConfig as LightConfig,
    index$1_LightBase as LightBase,
    index$1_LightType as LightType,
    index$1_LightValue as LightValue,
    index$1_LightCb as LightCb,
    index$1_PaintSite as PaintSite,
    index$1_LightSystemSite as LightSystemSite,
    index$1_LightSystemType as LightSystemType,
    index$1_config as config,
    index$1_Light as Light,
    index$1_intensity as intensity,
    index$1_isDarkLight as isDarkLight,
    index$1_make as make,
    index$1_lights as lights,
    index$1_from as from,
    index$1_install as install,
    index$1_installAll as installAll,
    index$1_StaticLightInfo as StaticLightInfo,
    index$1_LightSystem as LightSystem,
  };
}

declare enum Cell$1 {
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
    NEEDS_REDRAW,
    CELL_CHANGED,
    HAS_SURFACE,
    HAS_LIQUID,
    HAS_GAS,
    HAS_PLAYER,
    HAS_ACTOR,
    HAS_DORMANT_MONSTER,
    HAS_ITEM,
    IS_IN_PATH,
    IS_CURSOR,
    STABLE_MEMORY,
    LIGHT_CHANGED,
    CELL_LIT,
    IS_IN_SHADOW,
    CELL_DARK,
    COLORS_DANCE,
    PERMANENT_CELL_FLAGS,
    ANY_KIND_OF_VISIBLE,
    HAS_ANY_ACTOR,
    IS_WAS_ANY_KIND_OF_VISIBLE,
    WAS_ANY_KIND_OF_VISIBLE,
    CELL_DEFAULT
}
declare enum CellMech {
    SEARCHED_FROM_HERE,
    PRESSURE_PLATE_DEPRESSED,
    KNOWN_TO_BE_TRAP_FREE,
    CAUGHT_FIRE_THIS_TURN,
    EVENT_FIRED_THIS_TURN,
    EVENT_PROTECTED,
    IS_IN_LOOP,
    IS_CHOKEPOINT,
    IS_GATE_SITE,
    IS_IN_ROOM_MACHINE,
    IS_IN_AREA_MACHINE,
    IS_POWERED,
    IMPREGNABLE,
    DARKENED,
    IS_IN_MACHINE,
    PERMANENT_MECH_FLAGS
}
declare enum Map$1 {
    MAP_CHANGED,
    MAP_STABLE_GLOW_LIGHTS,
    MAP_STABLE_LIGHTS,
    MAP_ALWAYS_LIT,
    MAP_SAW_WELCOME,
    MAP_NO_LIQUID,
    MAP_NO_GAS,
    MAP_CALC_FOV,
    MAP_FOV_CHANGED,
    MAP_DANCES,
    MAP_DEFAULT
}

declare class Cell {
    flags: {
        cell: 0;
        cellMech: 0;
        object: 0;
    };
    constructor();
    isVisible(): boolean;
    hasActor(): boolean;
    blocksVision(): boolean;
    setCellFlag(flag: number): void;
    clearCellFlag(flag: number): void;
}

declare class Map implements LightSystemSite {
    width: number;
    height: number;
    cells: Grid<Cell>;
    flags: {
        map: 0;
    };
    light: LightSystemType;
    ambientLight: LightValue;
    constructor(width: number, height: number);
    hasXY(x: number, y: number): boolean;
    cell(x: number, y: number): Cell;
    isVisible(x: number, y: number): boolean;
    hasActor(x: number, y: number): boolean;
    blocksVision(x: number, y: number): boolean;
    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;
    hasCellFlag(x: number, y: number, flag: number): boolean;
    get anyLightChanged(): boolean;
    set anyLightChanged(value: boolean);
    get glowLightChanged(): boolean;
    set glowLightChanged(value: boolean);
    eachGlowLight(_cb: LightCb): void;
    eachDynamicLight(_cb: LightCb): void;
}

declare const flags: {
    Cell: typeof Cell$1;
    CellMech: typeof CellMech;
    Map: typeof Map$1;
};

declare const index_flags: typeof flags;
type index_Cell = Cell;
declare const index_Cell: typeof Cell;
type index_Map = Map;
declare const index_Map: typeof Map;
declare namespace index {
  export {
    index_flags as flags,
    index_Cell as Cell,
    index_Map as Map,
  };
}

export { Random, blob, index$6 as canvas, color, colors, config$1 as config, cosmetic, data, index$3 as effect, events, flag, flags$2 as flags, fov, frequency, index$2 as gameObject, grid, io, index$1 as light, loop, make$2 as make, index as map, message, path, random, range, scheduler, index$5 as sprite, sprites, index$4 as text, types, index$7 as utils };
