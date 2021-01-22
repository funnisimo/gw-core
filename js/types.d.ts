import { Color, ColorBase } from "./color";
import { Range } from "./range";
import * as Utils from "./utils";
export interface SpriteType {
    readonly ch?: string | number;
    readonly fg?: ColorBase;
    readonly bg?: ColorBase;
    readonly opacity?: number;
}
export interface LightType {
    color: Color;
    radius: Range;
    fadeTo: number;
    passThroughActors: boolean;
    paint(map: MapType, x: number, y: number): boolean;
    paint(map: MapType, x: number, y: number, maintainShadows: boolean): boolean;
    paint(map: MapType, x: number, y: number, maintainShadows: boolean, isMinersLight: boolean): boolean;
}
export interface LayerFlags {
    readonly layer: number;
}
export interface LayerType {
    readonly sprite: SpriteType;
    readonly priority: number;
    readonly depth: number;
    readonly light: LightType | null;
    readonly flags: LayerFlags;
    hasLayerFlag(flag: number): boolean;
}
export interface TileFlags extends LayerFlags {
    readonly tile: number;
    readonly tileMech: number;
}
export interface TileType extends LayerType {
    readonly id: string;
    readonly flags: TileFlags;
}
export interface ActorFlags extends LayerFlags {
    actor: number;
}
export interface ActorType extends Utils.XY, Utils.Chainable, LayerType {
    isPlayer: () => boolean;
    isVisible: () => boolean;
    isDetected: () => boolean;
    blocksVision: () => boolean;
    avoidsCell: (cell: CellType) => boolean;
    forbidsCell: (cell: CellType) => boolean;
    delete: () => void;
    rememberedInCell: CellType | null;
    readonly flags: ActorFlags;
    next: ActorType | null;
}
export interface ItemFlags extends LayerFlags {
    item: number;
}
export interface ItemType extends Utils.XY, Utils.Chainable, LayerType {
    quantity: number;
    readonly flags: ItemFlags;
    blocksMove: () => boolean;
    avoidsCell: (cell: CellType) => boolean;
    forbidsCell: (cell: CellType) => boolean;
    isDetected: () => boolean;
    delete: () => void;
    clone: () => this;
    next: ItemType | null;
}
export interface FxType extends Utils.XY, Utils.Chainable, LayerType {
    next: FxType | null;
}
export interface CellType {
    flags: number;
    mechFlags: number;
    tileFlags: () => number;
    tileMechFlags: () => number;
    actor: ActorType | null;
    item: ItemType | null;
    storeMemory: () => void;
}
export interface MapType {
    readonly width: number;
    readonly height: number;
    cell: (x: number, y: number) => CellType;
}
export declare class Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, w: number, h: number);
    contains(x: number, y: number): boolean;
    contains(loc: Utils.Loc | Utils.XY): boolean;
}
