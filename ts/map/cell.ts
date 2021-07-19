import { Cell as Flags } from './flags';
import * as TILE from '../tile';

export class Cell {
    flags: {
        cell: 0;
    };
    chokeCount = 0;
    tile: TILE.Tile;

    constructor() {
        this.flags = { cell: 0 };
        this.tile = TILE.tiles.NULL;
    }

    hasTileFlag(flag: number): boolean {
        return !!(this.tile.flags.tile & flag);
    }
    hasObjectFlag(flag: number): boolean {
        return !!(this.tile.flags.object & flag);
    }

    hasActor(): boolean {
        return !!(this.flags.cell & Flags.HAS_ANY_ACTOR);
    }
    blocksVision(): boolean {
        return this.tile.blocksVision();
    }
    blocksPathing(): boolean {
        return this.tile.blocksPathing();
    }
    blocksMove(): boolean {
        return this.tile.blocksMove();
    }

    hasCellFlag(flag: number): boolean {
        return !!(this.flags.cell & flag);
    }
    setCellFlag(flag: number) {
        this.flags.cell |= flag;
    }
    clearCellFlag(flag: number) {
        this.flags.cell &= ~flag;
    }

    setTile(tile: string | number) {
        this.tile = TILE.get(tile);
    }

    redraw() {
        this.flags.cell |= Flags.NEEDS_REDRAW;
    }
    clearMemory() {
        // TODO
    }
    storeMemory() {
        // TODO
    }

    dump(): string {
        // if (this.actor) return this.actor.sprite.ch as string;
        // if (this.item) return this.item.sprite.ch as string;

        // for (let i = this._tiles.length - 1; i >= 0; --i) {
        //     if (!this._tiles[i]) continue;
        //     const tile = this._tiles[i] || TILES.NULL;
        //     if (tile.sprite.ch) return tile.sprite.ch as string;
        // }
        // return TILES.NULL.sprite.ch as string;
        return this.tile.sprite.ch || ' ';
    }
}
