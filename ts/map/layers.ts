import { Mixer } from '../sprite';
import * as Tile from '../tile';
import { MapType } from './types';
import * as Flags from './flags';
import { Actor } from '../actor';
import { Item } from '../item';
import { SetTileOptions } from './types';
import * as Utils from '../utils';
import { Depth } from '../gameObject/flags';

export class MapLayer {
    map: MapType;
    depth: number;
    properties: Record<string, any>;
    name: string;

    constructor(map: MapType, name = 'layer') {
        this.map = map;
        this.depth = -1;
        this.properties = {};
        this.name = name;
    }

    copy(_other: MapLayer) {}

    async tick(_dt: number): Promise<boolean> {
        return false;
    }
}

export class ActorLayer extends MapLayer {
    constructor(map: MapType, name = 'actor') {
        super(map, name);
    }

    add(x: number, y: number, obj: Actor, _opts?: any): boolean {
        const cell = this.map.cell(x, y);

        const actor = obj as Actor;
        if (actor.forbidsCell(cell)) return false;

        if (!Utils.addToChain(cell, 'actor', obj)) return false;

        if (obj.isPlayer()) {
            cell.setCellFlag(Flags.Cell.HAS_PLAYER);
        }
        obj.x = x;
        obj.y = y;
        return true;
    }

    remove(obj: Actor) {
        const cell = this.map.cell(obj.x, obj.y);

        if (!Utils.removeFromChain(cell, 'actor', obj)) return false;

        if (obj.isPlayer()) {
            cell.clearCellFlag(Flags.Cell.HAS_PLAYER);
        }
        return true;
    }

    putAppearance(dest: Mixer, x: number, y: number) {
        const cell = this.map.cell(x, y);
        if (!cell.actor) return;
        dest.drawSprite(cell.actor.sprite);
    }
}

export class ItemLayer extends MapLayer {
    constructor(map: MapType, name = 'item') {
        super(map, name);
    }

    add(x: number, y: number, obj: Item, _opts?: any): boolean {
        const cell = this.map.cell(x, y);

        const item = obj as Item;
        if (item.forbidsCell(cell)) return false;

        if (!Utils.addToChain(cell, 'item', obj)) return false;
        obj.x = x;
        obj.y = y;
        return true;
    }

    remove(obj: Item) {
        const cell = this.map.cell(obj.x, obj.y);
        if (!Utils.removeFromChain(cell, 'item', obj)) return false;
        return true;
    }

    putAppearance(dest: Mixer, x: number, y: number) {
        const cell = this.map.cell(x, y);
        if (!cell.item) return;
        dest.drawSprite(cell.item.sprite);
    }
}

export class TileLayer extends MapLayer {
    constructor(map: MapType, name = 'tile') {
        super(map, name);
    }

    set(x: number, y: number, tile: Tile.Tile, opts: SetTileOptions = {}) {
        const cell = this.map.cell(x, y);

        const current = cell.depthTile(tile.depth) || Tile.tiles.NULL;

        if (!opts.superpriority) {
            // if (current !== tile) {
            //     this.gasVolume = 0;
            //     this.liquidVolume = 0;
            // }

            // Check priority, etc...
            if (current.priority > tile.priority) {
                return false;
            }
        }
        if (cell.blocksLayer(tile.depth)) return false;
        if (opts.blockedByItems && cell.hasItem()) return false;
        if (opts.blockedByActors && cell.hasActor()) return false;
        if (opts.blockedByOtherLayers && cell.highestPriority() > tile.priority)
            return false;

        if (tile.depth > Depth.GROUND && tile.groundTile) {
            const ground = cell.depthTile(Depth.GROUND);
            if (!ground || ground === Tile.tiles.NULL) {
                this.set(x, y, Tile.get(tile.groundTile));
            }
        }

        if (!cell.setTile(tile)) return false;

        if (opts.machine) {
            cell.machineId = opts.machine;
        }

        if (current.light !== tile.light) {
            this.map.light.glowLightChanged = true;
        }

        if (tile.hasTileFlag(Flags.Tile.T_IS_FIRE)) {
            cell.setCellFlag(Flags.Cell.CAUGHT_FIRE_THIS_TURN);
        }

        // if (volume) {
        //     if (tile.depth === Depth.GAS) {
        //         this.gasVolume = volume;
        //     }
        //     if (tile.depth === Depth.LIQUID) {
        //         this.liquidVolume = volume;
        //     }
        // }

        return true;
    }

    clear(x: number, y: number) {
        const cell = this.map.cell(x, y);
        return cell.clearDepth(this.depth);
    }

    async tick(_dt: number): Promise<boolean> {
        // Run any tick effects

        // Bookkeeping for fire, pressure plates and key-activated tiles.
        for (let x = 0; x < this.map.width; ++x) {
            for (let y = 0; y < this.map.height; ++y) {
                const cell = this.map.cell(x, y);
                if (
                    !cell.hasCellFlag(
                        Flags.Cell.HAS_ANY_ACTOR | Flags.Cell.HAS_ITEM
                    ) &&
                    cell.hasCellFlag(Flags.Cell.PRESSURE_PLATE_DEPRESSED)
                ) {
                    cell.clearCellFlag(Flags.Cell.PRESSURE_PLATE_DEPRESSED);
                }
                if (cell.hasEffect('noKey') && !cell.hasKey()) {
                    await cell.activate('noKey', this.map, x, y);
                }
            }
        }

        return true;
    }

    putAppearance(dest: Mixer, x: number, y: number) {
        const cell = this.map.cell(x, y);
        const tile = cell.depthTile(this.depth);
        if (tile && tile !== Tile.tiles.NULL) {
            dest.drawSprite(tile.sprite);
        }
    }
}
