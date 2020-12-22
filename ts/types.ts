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
export interface ActorType extends Utils.XY, Utils.Chainable {
  x: number;
  y: number;
  readonly sprite: SpriteType;
  readonly light: LightType | null;
  isPlayer: () => boolean;
  isDetected: () => boolean;
  blocksVision: () => boolean; // kind.flags & Flags.ActorKind.AK_BLOCKS_VISION

  avoidsCell: (cell: CellType) => boolean;
  // if (cell.flags & Flags.Cell.HAS_ACTOR) return false;
  // return !cell.hasTileFlag(forbidTileFlags);

  forbidsCell: (cell: CellType) => boolean;
  delete: () => void;
  rememberedInCell: CellType | null;
  next: ActorType | null;
}

export interface ItemType extends Utils.XY, Utils.Chainable {
  x: number;
  y: number;
  quantity: number;
  avoidsCell: (cell: CellType) => boolean;
  forbidsCell: (cell: CellType) => boolean;
  // if (cell.flags & Flags.Cell.HAS_ITEM) return false;
  // return !cell.hasTileFlag(theItem.kind.forbiddenTileFlags());

  readonly sprite: SpriteType;
  readonly light: LightType | null;
  isDetected: () => boolean; // flags & Flags.Item.ITEM_MAGIC_DETECTED && GW.item.magicChar(theItem)
  delete: () => void;
  next: ItemType | null;
}

export interface FxType extends Utils.XY, Utils.Chainable {
  x: number;
  y: number;
  readonly sprite: SpriteType;
  next: FxType | null;
}

export interface TileType {
  flags: number;
  mechFlags: number;
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
  contains(loc: Utils.Loc): boolean;
  contains(...args: any[]) {
    let x = args[0];
    let y = args[1];
    if (Array.isArray(x)) {
      y = x[1];
      x = x[0];
    }
    return (
      this.x <= x &&
      this.y <= y &&
      this.x + this.width > x &&
      this.y + this.height > y
    );
  }
}
