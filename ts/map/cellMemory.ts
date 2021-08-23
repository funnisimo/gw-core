import { Actor } from '../actor';
import { Cell as CellFlags, Tile as TileFlags } from './flags';
import { Item } from '../item';
import { Mixer } from '../sprite';
import * as TILE from '../tile';
import { CellInfoType } from './types';

export class CellMemory implements CellInfoType {
    chokeCount = 0;
    machineId = 0;
    flags = {
        cell: 0,
        item: 0,
        actor: 0,
        tile: 0,
        tileMech: 0,
        object: 0,
    };
    blocks = {
        vision: false,
        effects: false,
        move: false,
        pathing: false,
    };
    _tile: TILE.Tile = TILE.tiles.NULL;
    _item: Item | null = null;
    _actor: Actor | null = null;
    _hasKey: boolean = false;
    snapshot: Mixer;

    constructor() {
        this.snapshot = new Mixer();
    }

    clear() {
        this.snapshot.blackOut();
        this._item = null;
        this._actor = null;
        this._tile = TILE.tiles.NULL;
        this.flags.cell = 0;
        this.flags.object = 0;
        this.flags.tile = 0;
        this.flags.tileMech = 0;
        this.blocks.effects = false;
        this.blocks.move = false;
        this.blocks.pathing = false;
        this.blocks.vision = false;
        this._hasKey = false;
        this.machineId = 0;
        this.chokeCount = 0;
    }

    store(cell: CellInfoType) {
        this._item = null;
        if (cell.hasItem()) {
            this._item = cell.item;
        }
        this._actor = null;
        if (cell.hasActor()) {
            this._actor = cell.actor;
        }
        this._tile = cell.tile;
        this.flags.cell = cell.cellFlags();
        this.flags.tile = cell.tileFlags();
        this.flags.tileMech = cell.tileMechFlags();
        this.flags.object = cell.objectFlags();
        this.flags.item = cell.itemFlags();
        this.flags.actor = cell.actorFlags();

        this.blocks.effects = cell.blocksEffects();
        this.blocks.move = cell.blocksMove();
        this.blocks.pathing = cell.blocksPathing();
        this.blocks.vision = cell.blocksVision();

        this._hasKey = cell.hasKey();
        this.chokeCount = cell.chokeCount;
        this.machineId = cell.machineId;
    }

    getSnapshot(dest: Mixer) {
        dest.copy(this.snapshot);
    }
    putSnapshot(src: Mixer) {
        this.snapshot.copy(src);
    }

    hasCellFlag(flag: number): boolean {
        return !!(this.flags.cell & flag);
    }
    hasTileFlag(flag: number): boolean {
        return !!(this.flags.tile & flag);
    }
    hasAllTileFlags(flags: number): boolean {
        return (this.flags.tile & flags) == flags;
    }
    hasObjectFlag(flag: number): boolean {
        return !!(this.flags.object & flag);
    }
    hasAllObjectFlags(flags: number): boolean {
        return (this.flags.object & flags) == flags;
    }
    hasTileMechFlag(flag: number): boolean {
        return !!(this.flags.tileMech & flag);
    }

    cellFlags(): number {
        return this.flags.cell;
    }
    objectFlags(): number {
        return this.flags.object;
    }
    tileFlags(): number {
        return this.flags.tile;
    }
    tileMechFlags(): number {
        return this.flags.tileMech;
    }
    itemFlags(): number {
        return this.flags.item;
    }
    actorFlags(): number {
        return this.flags.actor;
    }
    blocksVision(): boolean {
        return this.blocks.vision;
    }
    blocksPathing(): boolean {
        return this.blocks.pathing;
    }
    blocksMove(): boolean {
        return this.blocks.move;
    }
    blocksEffects(): boolean {
        return this.blocks.effects;
    }

    isWall(): boolean {
        return this.blocksVision() && this.blocksMove();
    }
    isStairs(): boolean {
        return this.hasTileFlag(TileFlags.T_HAS_STAIRS);
    }
    hasKey(): boolean {
        return this._hasKey;
    }

    get tile(): TILE.Tile {
        return this._tile;
    }
    hasTile(tile: string | number | TILE.Tile): boolean {
        if (!(tile instanceof TILE.Tile)) {
            tile = TILE.get(tile);
        }
        return this._tile === tile;
    }

    hasItem(): boolean {
        return !!this._item;
    }
    get item(): Item | null {
        return this._item;
    }

    hasActor(): boolean {
        return !!this._actor;
    }
    hasPlayer(): boolean {
        return !!(this.flags.cell & CellFlags.HAS_PLAYER);
    }
    get actor(): Actor | null {
        return this._actor;
    }

    getDescription(): string {
        throw new Error('Method not implemented.');
    }
    getFlavor(): string {
        throw new Error('Method not implemented.');
    }
    getName(_opts: any): string {
        throw new Error('Method not implemented.');
    }
}
