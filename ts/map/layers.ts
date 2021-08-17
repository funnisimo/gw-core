import { Mixer } from '../sprite';
import * as Tile from '../tile';
import * as Map from './map';
import * as Flags from './flags';
import { Actor } from '../actor';
import { Item } from '../item';
import { SetTileOptions } from './types';
import { utils } from '..';
import { Depth } from '../gameObject/flags';

export class MapLayer {
    map: Map.Map;
    depth: number;
    properties: Record<string, any>;
    name: string;

    constructor(map: Map.Map, name = 'layer') {
        this.map = map;
        this.depth = -1;
        this.properties = {};
        this.name = name;
    }
}

export class ActorLayer extends MapLayer {
    constructor(map: Map.Map, name = 'actor') {
        super(map, name);
    }

    add(x: number, y: number, obj: Actor, _opts?: any): boolean {
        const cell = this.map.cell(x, y);

        const actor = obj as Actor;
        if (actor.forbidsCell(cell)) return false;

        if (!utils.addToChain(cell, 'actor', obj)) return false;

        if (obj.isPlayer()) {
            cell.setCellFlag(Flags.Cell.HAS_PLAYER);
        }
        obj.x = x;
        obj.y = y;
        return true;
    }

    remove(obj: Actor) {
        const cell = this.map.cell(obj.x, obj.y);

        if (!utils.removeFromChain(cell, 'actor', obj)) return false;

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

    update(_dt: number) {}
}

export class ItemLayer extends MapLayer {
    constructor(map: Map.Map, name = 'item') {
        super(map, name);
    }

    add(x: number, y: number, obj: Item, _opts?: any): boolean {
        const cell = this.map.cell(x, y);

        const item = obj as Item;
        if (item.forbidsCell(cell)) return false;

        if (!utils.addToChain(cell, 'item', obj)) return false;
        obj.x = x;
        obj.y = y;
        return true;
    }

    remove(obj: Item) {
        const cell = this.map.cell(obj.x, obj.y);
        if (!utils.removeFromChain(cell, 'item', obj)) return false;
        return true;
    }

    putAppearance(dest: Mixer, x: number, y: number) {
        const cell = this.map.cell(x, y);
        if (!cell.item) return;
        dest.drawSprite(cell.item.sprite);
    }

    update(_dt: number) {}
}

export class TileLayer extends MapLayer {
    constructor(map: Map.Map, name = 'tile') {
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
            if (cell.depthTile(Depth.GROUND) === Tile.tiles.NULL) {
                this.set(x, y, Tile.get(tile.groundTile));
            }
        }

        if (!cell.setTile(tile)) return false;

        if (current.light !== tile.light) {
            this.map.light.glowLightChanged = true;
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

    async update(_dt: number) {
        // Run any tick effects
    }

    putAppearance(dest: Mixer, x: number, y: number) {
        const cell = this.map.cell(x, y);
        const tile = cell.depthTile(this.depth);
        if (tile) {
            dest.drawSprite(tile.sprite);
        }
    }
}

// class GasLayer extends TileLayer {
//     constructor(map: TileMap) {
//         super(map);
//     }

//     async update(dt: number) {
//         // do dissipation...
//     }
// }

// class LiquidLayer extends TileLayer {
//     constructor(map: TileMap) {
//         super(map);
//     }

//     async update(dt: number) {
//         // do dissipation...
//     }
// }
