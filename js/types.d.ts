import { SpriteType } from "./canvas/mixer";
import { Color } from "./color";
import { Range } from "./range";
import * as Utils from "./utils";
export interface LightType {
    color: Color;
    radius: Range;
    fadeTo: number;
    passThroughActors: boolean;
}
export interface TileType {
    readonly sprite: SpriteType;
    readonly priority: number;
    readonly layer: number;
    readonly light: LightType | null;
}
export interface ActorType extends Utils.XY, Utils.Chainable {
    x: number;
    y: number;
    readonly sprite: SpriteType;
    readonly light: LightType | null;
    isPlayer: () => boolean;
    isVisible: () => boolean;
    isDetected: () => boolean;
    blocksVision: () => boolean;
    avoidsCell: (cell: CellType) => boolean;
    forbidsCell: (cell: CellType) => boolean;
    delete: () => void;
    rememberedInCell: CellType | null;
    next: ActorType | null;
}
export interface ItemType extends Utils.XY, Utils.Chainable {
    x: number;
    y: number;
    quantity: number;
    blocksMove: () => boolean;
    avoidsCell: (cell: CellType) => boolean;
    forbidsCell: (cell: CellType) => boolean;
    readonly sprite: SpriteType;
    readonly light: LightType | null;
    isDetected: () => boolean;
    delete: () => void;
    clone: () => ItemType;
    next: ItemType | null;
}
export interface FxType extends Utils.XY, Utils.Chainable {
    x: number;
    y: number;
    readonly sprite: SpriteType;
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
    contains(loc: Utils.Loc): boolean;
}
