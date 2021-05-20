import { Color, ColorBase } from './color';
import { Range } from './range';
import * as Utils from './utils';

export interface SpriteType {
    readonly ch?: string | null;
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
    paint(
        map: MapType,
        x: number,
        y: number,
        maintainShadows: boolean
    ): boolean;
    paint(
        map: MapType,
        x: number,
        y: number,
        maintainShadows: boolean,
        isMinersLight: boolean
    ): boolean;
}

export interface LayerFlags {
    readonly layer: number;
}

export interface EntityType {
    readonly sprite: SpriteType;
    readonly priority: number;
    readonly layer: number;
    readonly light: LightType | null;
    readonly flags: LayerFlags;

    hasLayerFlag(flag: number): boolean;
}

export interface TileFlags extends LayerFlags {
    readonly tile: number;
    readonly tileMech: number;
}

export interface TileType extends EntityType {
    readonly id: string;
    readonly flags: TileFlags;
}

export interface ActorFlags extends LayerFlags {
    actor: number;
}

export interface ActorType extends Utils.XY, Utils.Chainable, EntityType {
    isPlayer: () => boolean;
    isVisible: () => boolean;
    isDetected: () => boolean;
    blocksVision: () => boolean; // kind.flags & Flags.ActorKind.AK_BLOCKS_VISION

    layerFlags: () => number;
    avoidsCell: (cell: CellType) => boolean;
    // if (cell.flags & Flags.Cell.HAS_ACTOR) return false;
    // return !cell.hasTileFlag(forbidTileFlags);

    forbidsCell: (cell: CellType) => boolean;
    delete: () => void;
    rememberedInCell: CellType | null;
    readonly flags: ActorFlags;
    next: ActorType | null;
}

export interface ItemFlags extends LayerFlags {
    item: number;
}

export interface ItemType extends Utils.XY, Utils.Chainable, EntityType {
    quantity: number;
    readonly flags: ItemFlags;

    layerFlags: () => number;
    blocksMove: () => boolean;
    avoidsCell: (cell: CellType) => boolean;
    forbidsCell: (cell: CellType) => boolean;
    // if (cell.flags & Flags.Cell.HAS_ITEM) return false;
    // return !cell.hasTileFlag(theItem.kind.forbiddenTileFlags());

    isDetected: () => boolean; // flags & Flags.Item.ITEM_MAGIC_DETECTED && GW.item.magicChar(theItem)
    delete: () => void;
    clone: () => this;
    next: ItemType | null;
}

export interface FxType extends Utils.XY, Utils.Chainable, EntityType {
    next: FxType | null;
}

export interface CellFlags {
    cell: number;
    cellMech: number;
}

export interface CellType {
    flags: CellFlags;
    tileFlags: () => number;
    tileMechFlags: () => number;
    actor: ActorType | null;
    item: ItemType | null;
    storeMemory: () => void;
    isAnyKindOfVisible: () => boolean;
    isVisible: () => boolean;
}

export interface MapType {
    readonly width: number;
    readonly height: number;
    // cell: (x: number, y: number) => CellType;
    isVisible: (x: number, y: number) => boolean;
    actorAt: (x: number, y: number) => ActorType | null;
    itemAt: (x: number, y: number) => ItemType | null;
}

export class Bounds {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    contains(x: number, y: number): boolean;
    contains(loc: Utils.Loc | Utils.XY): boolean;
    contains(...args: any[]) {
        let x = args[0];
        let y = args[1];
        if (typeof x !== 'number') {
            y = Utils.y(x);
            x = Utils.x(x);
        }
        return (
            this.x <= x &&
            this.y <= y &&
            this.x + this.width > x &&
            this.y + this.height > y
        );
    }
}
