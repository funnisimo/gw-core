import { ColorBase } from './color';
// import { LightType } from './light/types';
// import { Chainable } from './utils/chain';

import { CellType, MapType } from './map/types';
export { CellType, MapType };

export type Loc = [number, number];
export interface XY {
    x: number;
    y: number;
}

export interface SpriteData {
    readonly ch?: string | null;
    readonly fg?: ColorBase;
    readonly bg?: ColorBase;
    readonly opacity?: number;
}

// export interface ObjectFlags {
//     readonly object: number;
// }

// export interface GameObjectType {
//     readonly sprite: SpriteData;
//     readonly priority: number;
//     readonly depth: number;
//     // readonly light: LightType | null;
//     readonly flags: ObjectFlags;

//     hasObjectFlag(flag: number): boolean;
// }

// export interface TileFlags extends ObjectFlags {
//     readonly tile: number;
//     readonly tileMech: number;
// }

// export interface TileType extends GameObjectType {
//     readonly id: string;
//     readonly flags: TileFlags;
// }

// export interface ActorFlags extends ObjectFlags {
//     actor: number;
// }

// export interface ActorType
//     extends XY,
//         Chainable<GameObjectType>,
//         GameObjectType {
//     isPlayer: () => boolean;
//     isVisible: () => boolean;
//     isDetected: () => boolean;
//     blocksVision: () => boolean; // kind.flags & Flags.ActorKind.AK_BLOCKS_VISION

//     layerFlags: () => number;
//     avoidsCell: (cell: CellType) => boolean;
//     // if (cell.flags & Flags.Cell.HAS_ACTOR) return false;
//     // return !cell.hasTileFlag(forbidTileFlags);

//     forbidsCell: (cell: CellType) => boolean;
//     delete: () => void;
//     rememberedInCell: CellType | null;
//     readonly flags: ActorFlags;
//     next: GameObjectType | null;
// }

// export interface ItemFlags extends ObjectFlags {
//     item: number;
// }

// export interface ItemType
//     extends XY,
//         Chainable<GameObjectType>,
//         GameObjectType {
//     quantity: number;
//     readonly flags: ItemFlags;

//     layerFlags: () => number;
//     blocksMove: () => boolean;
//     avoidsCell: (cell: CellType) => boolean;
//     forbidsCell: (cell: CellType) => boolean;
//     // if (cell.flags & Flags.Cell.HAS_ITEM) return false;
//     // return !cell.hasTileFlag(theItem.kind.forbiddenTileFlags());

//     isDetected: () => boolean; // flags & Flags.Item.ITEM_MAGIC_DETECTED && GW.item.magicChar(theItem)
//     delete: () => void;
//     clone: () => this;
//     next: GameObjectType | null;
// }

// export interface FxType extends XY, Chainable<GameObjectType>, GameObjectType {
//     next: GameObjectType | null;
// }
