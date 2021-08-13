import { GameObject } from '../gameObject';
import { Mixer } from '../sprite';
import * as Tile from '../tile';
import * as Map from './map';
import * as Flags from './flags';
import { Actor } from '../actor';
import { Item } from '../item';

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

export abstract class ObjectLayer extends MapLayer {
    constructor(map: Map.Map, name = 'object') {
        super(map, name);
    }

    abstract add(x: number, y: number, obj: GameObject, _opts?: any): boolean;
    abstract remove(obj: GameObject): boolean;

    putAppearance(dest: Mixer, x: number, y: number) {
        const cell = this.map.cell(x, y);
        const obj = cell.objects.find((o) => o.depth == this.depth);
        if (obj) {
            dest.drawSprite(obj.sprite);
        }
    }

    update(_dt: number) {}
}

export class ActorLayer extends ObjectLayer {
    constructor(map: Map.Map, name = 'actor') {
        super(map, name);
    }

    add(x: number, y: number, obj: GameObject, _opts?: any): boolean {
        const cell = this.map.cell(x, y);

        const actor = obj as Actor;
        if (actor.forbidsCell(cell)) return false;

        cell.objects.add(obj);
        let flag = actor.isPlayer()
            ? Flags.Cell.HAS_PLAYER
            : Flags.Cell.HAS_ACTOR;
        cell.setCellFlag(flag);
        obj.x = x;
        obj.y = y;
        return true;
    }

    remove(obj: GameObject) {
        const cell = this.map.cell(obj.x, obj.y);
        cell.objects.remove(obj);
        let flag = 0;
        cell.objects.forEach((o) => {
            if (!o) return;
            if (o instanceof Actor) {
                flag |= o.isPlayer()
                    ? Flags.Cell.HAS_PLAYER
                    : Flags.Cell.HAS_ACTOR;
            }
        });
        cell.clearCellFlag(Flags.Cell.HAS_ANY_ACTOR);
        cell.setCellFlag(flag);
        return true;
    }

    putAppearance(dest: Mixer, x: number, y: number) {
        const cell = this.map.cell(x, y);
        const obj = cell.objects.find((o) => o.depth == this.depth);
        if (obj) {
            dest.drawSprite(obj.sprite);
        }
    }

    update(_dt: number) {}
}

export class ItemLayer extends ObjectLayer {
    constructor(map: Map.Map, name = 'item') {
        super(map, name);
    }

    add(x: number, y: number, obj: GameObject, _opts?: any): boolean {
        const cell = this.map.cell(x, y);

        const item = obj as Item;
        if (item.forbidsCell(cell)) return false;

        cell.objects.add(obj);
        let flag = Flags.Cell.HAS_ITEM;
        cell.setCellFlag(flag);
        obj.x = x;
        obj.y = y;
        return true;
    }

    remove(obj: GameObject) {
        const cell = this.map.cell(obj.x, obj.y);
        cell.objects.remove(obj);
        let flag = 0;
        cell.objects.forEach((o) => {
            if (!o) return;
            if (o instanceof Item) {
                flag |= Flags.Cell.HAS_ITEM;
            }
        });
        cell.clearCellFlag(Flags.Cell.HAS_ITEM);
        cell.setCellFlag(flag);
        return true;
    }

    putAppearance(dest: Mixer, x: number, y: number) {
        const cell = this.map.cell(x, y);
        const obj = cell.objects.find((o) => o.depth == this.depth);
        if (obj) {
            dest.drawSprite(obj.sprite);
        }
    }

    update(_dt: number) {}
}

export interface TileSetOptions {
    force?: boolean;
}

export class TileLayer extends MapLayer {
    constructor(map: Map.Map, name = 'tile') {
        super(map, name);
    }

    set(x: number, y: number, tile: Tile.Tile, opts: TileSetOptions = {}) {
        const cell = this.map.cell(x, y);

        const current = cell.tiles[tile.depth] || Tile.tiles.NULL;

        if (!opts.force) {
            // if (current !== tile) {
            //     this.gasVolume = 0;
            //     this.liquidVolume = 0;
            // }

            // Check priority, etc...
            if (current.priority > tile.priority) {
                return false;
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
        const tile = cell.tiles[this.depth];
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
