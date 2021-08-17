import {
    Cell as Flags,
    GameObject as ObjectFlags,
    Tile as TileFlags,
} from './flags';
import * as TILE from '../tile';
import { Depth } from '../gameObject/flags';
import { MapType } from './types';
import * as Effect from '../effect';
import { CellType, CellFlags } from './types';
import * as Light from '../light';
import { GameObject } from '../gameObject';
import { Actor } from '../actor';
import { Item } from '../item';

type TileData = TILE.Tile | null;
type TileArray = [TILE.Tile, ...TileData[]];

type EachCb<T> = (t: T) => any;
type MatchCb<T> = (t: T) => boolean;
type ReduceCb<T> = (out: any, t: T) => any;

class CellObjects {
    cell: Cell;

    constructor(cell: Cell) {
        this.cell = cell;
    }

    forEach(cb: EachCb<GameObject>): void {
        let object: GameObject | null = this.cell._item;
        while (object) {
            cb(object);
            object = object.next;
        }
        object = this.cell._actor;
        while (object) {
            cb(object);
            object = object.next;
        }
    }

    some(cb: MatchCb<GameObject>): boolean {
        let object: GameObject | null = this.cell._item;
        while (object) {
            if (cb(object)) return true;
            object = object.next;
        }
        object = this.cell._actor;
        while (object) {
            if (cb(object)) return true;
            object = object.next;
        }
        return false;
    }

    reduce(cb: ReduceCb<GameObject>, start?: any): any {
        let object: GameObject | null = this.cell._item;
        while (object) {
            if (start === undefined) {
                start = object;
            } else {
                start = cb(start, object);
            }
            object = object.next;
        }
        object = this.cell._actor;
        while (object) {
            if (start === undefined) {
                start = object;
            } else {
                start = cb(start, object);
            }
            object = object.next;
        }
        return start;
    }
}

export class Cell implements CellType {
    flags: CellFlags;
    chokeCount = 0;
    tiles: TileArray;
    // gasVolume: number = 0;
    // liquidVolume: number = 0;
    _actor: Actor | null = null;
    _item: Item | null = null;
    _objects: CellObjects;

    constructor(groundTile?: number | string | TILE.Tile) {
        this._objects = new CellObjects(this);
        this.flags = { cell: 0 };
        this.tiles = [TILE.tiles.NULL];

        if (groundTile) {
            const tile = TILE.get(groundTile);
            this.setTile(tile);
        }
    }

    copy(other: Cell) {
        Object.assign(this.flags, other.flags);
        this.chokeCount = other.chokeCount;
        this.tiles = other.tiles.slice() as TileArray;
        this._actor = other._actor;
        this._item = other._item;
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

    hasObjectFlag(flag: number): boolean {
        return (
            this.tiles.some((t) => t && t.flags.object & flag) ||
            this._objects.some((o) => !!(o.flags.object & flag))
        );
    }
    hasAllObjectFlags(flags: number): boolean {
        return (this.objectFlags() & flags) == flags;
    }
    hasTileFlag(flag: number): boolean {
        return this.tiles.some((t) => t && t.flags.tile & flag);
    }
    hasAllTileFlags(flags: number): boolean {
        return (this.tileFlags() & flags) == flags;
    }
    hasTileMechFlag(flag: number): boolean {
        return this.tiles.some((t) => t && t.flags.tileMech & flag);
    }
    hasAllTileMechFlags(flags: number): boolean {
        return (this.tileMechFlags() & flags) == flags;
    }

    cellFlags(): number {
        return this.flags.cell;
    }
    objectFlags(): number {
        return (
            this.tiles.reduce((out, t) => out | (t ? t.flags.object : 0), 0) |
            this._objects.reduce((out, o) => out | o.flags.object, 0)
        );
    }
    tileFlags(): number {
        return this.tiles.reduce((out, t) => out | (t ? t.flags.tile : 0), 0);
    }
    tileMechFlags(): number {
        return this.tiles.reduce(
            (out, t) => out | (t ? t.flags.tileMech : 0),
            0
        );
    }
    itemFlags(): number {
        return this._objects.reduce((out, o) => out | o.itemFlags(), 0);
    }
    actorFlags(): number {
        return this._objects.reduce((out, o) => out | o.actorFlags(), 0);
    }

    get needsRedraw() {
        return !!(this.flags.cell & Flags.NEEDS_REDRAW);
    }
    set needsRedraw(v: boolean) {
        if (v) {
            this.flags.cell |= Flags.NEEDS_REDRAW;
        } else {
            this.flags.cell &= ~Flags.NEEDS_REDRAW;
        }
    }

    depthPriority(depth: number): number {
        const tile = this.tiles[depth];
        return tile ? tile.priority : TILE.tiles.NULL.priority;
    }
    highestPriority(): number {
        return this.tiles.reduce(
            (out, t) => Math.max(out, t ? t.priority : 0),
            TILE.tiles.NULL.priority
        );
    }
    depthTile(depth: number): TILE.Tile {
        return this.tiles[depth] || TILE.tiles.NULL;
    }

    hasTile(tile?: string | number | TILE.Tile): boolean {
        if (!tile) return this.tiles.some((t) => t);
        if (!(tile instanceof TILE.Tile)) {
            tile = TILE.get(tile);
        }
        return this.tiles.includes(tile);
    }
    hasDepthTile(depth: number): boolean {
        const t = this.tiles[depth];
        return !!t && t !== TILE.tiles.NULL;
    }
    highestPriorityTile(): TILE.Tile {
        return this.tiles.reduce((out, tile) => {
            if (!tile) return out;
            if (tile.priority >= out!.priority) return tile; // higher depth will get picked with >=
            return out;
        }, TILE.tiles.NULL)!;
    }
    get tile(): TILE.Tile {
        return this.highestPriorityTile();
    }

    tileWithObjectFlag(flag: number) {
        return this.tiles.find((t) => t && t.flags.object & flag) || null;
    }

    tileWithFlag(flag: number) {
        return this.tiles.find((t) => t && t.flags.tile & flag) || null;
    }

    tileWithMechFlag(flag: number) {
        return this.tiles.find((t) => t && t.flags.tileMech & flag) || null;
    }

    blocksVision(): boolean {
        return (
            this.tiles.some((t) => t && t.blocksVision()) ||
            this._objects.some((o) => o.blocksVision())
        );
    }
    blocksPathing(): boolean {
        return (
            this.tiles.some((t) => t && t.blocksPathing()) ||
            this._objects.some((o) => o.blocksPathing())
        );
    }
    blocksMove(): boolean {
        return (
            this.tiles.some((t) => t && t.blocksMove()) ||
            this._objects.some((o) => o.blocksMove())
        );
    }
    blocksEffects(): boolean {
        return (
            this.tiles.some((t) => t && t.blocksEffects()) ||
            this._objects.some((o) => o.blocksEffects())
        );
    }
    blocksLayer(depth: number): boolean {
        return this.tiles.some(
            (t) =>
                t &&
                !!(t.flags.tile & TILE.flags.Tile.T_BLOCKS_OTHER_LAYERS) &&
                t.depth != depth
        );
    }

    // Tests

    isEmpty(): boolean {
        return (
            this.tiles.every((t) => !t || t === TILE.tiles.NULL) &&
            this._actor == null &&
            this._item == null
        );
    }
    isPassable() {
        return !this.blocksMove();
    }
    isWall(): boolean {
        return this.hasAllObjectFlags(ObjectFlags.L_WALL_FLAGS);
    }
    isStairs(): boolean {
        return this.hasTileFlag(TileFlags.T_HAS_STAIRS);
    }

    // @returns - whether or not the change results in a change to the cell lighting.
    setTile(tile: string | number | TILE.Tile): boolean {
        if (!(tile instanceof TILE.Tile)) {
            tile = TILE.get(tile);
            if (!tile) return false;
        }

        // const current = this.tiles[tile.depth] || TILE.tiles.NULL;

        // if (current !== tile) {
        //     this.gasVolume = 0;
        //     this.liquidVolume = 0;
        // }

        // Check priority, etc...

        this.tiles[tile.depth] = tile;
        this.needsRedraw = true;

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
    clear() {
        this.tiles = [TILE.tiles.NULL];
        this.needsRedraw = true;
    }
    clearDepth(depth: Depth): boolean {
        if (depth == 0) {
            this.tiles[0] = TILE.tiles.NULL;
            this.needsRedraw = true;
            return true;
        } else if (this.tiles[depth] !== null) {
            this.tiles[depth] = null;
            this.needsRedraw = true;
            return true;
        }
        return false;
    }
    clearDepthsWithFlags(tileFlag: number, tileMechFlag = 0): void {
        for (let i = 0; i < this.tiles.length; ++i) {
            const tile = this.tiles[i];
            if (!tile) continue;
            if (!tile.hasTileFlag(tileFlag)) continue;
            if (tileMechFlag && !tile.hasTileMechFlag(tileMechFlag)) continue;
            this.clearDepth(i);
        }
    }

    // Lights

    eachGlowLight(cb: (light: Light.LightType) => any) {
        this.tiles.forEach((tile) => {
            if (tile && tile.light) cb(tile.light);
        });
    }

    // Effects

    async activate(
        event: string,
        map: MapType,
        x: number,
        y: number,
        ctx: Partial<Effect.EffectCtx> = {}
    ): Promise<boolean> {
        ctx.cell = this;
        let didSomething = false;

        if (ctx.depth !== undefined) {
            const tile = this.depthTile(ctx.depth);
            if (tile && tile.effects) {
                const ev = tile.effects[event];
                let effect: Effect.EffectInfo;
                if (typeof ev === 'string') {
                    effect = Effect.effects[ev];
                } else {
                    effect = ev;
                }
                if (effect) {
                    // console.log(' - has event');
                    // if (
                    //     ctx.force ||
                    //     !effect.chance ||
                    //     random.chance(effect.chance, 10000)
                    // ) {
                    ctx.tile = tile;
                    // console.log(' - spawn event @%d,%d - %s', x, y, event);
                    didSomething = await Effect.fire(effect, map, x, y, ctx);
                    // cell.debug(" - spawned");
                    // }
                }
            }
        } else {
            // console.log('fire event - %s', event);
            for (let tile of this.tiles) {
                if (!tile || !tile.effects) continue;
                const ev = tile.effects[event];
                // console.log(' - ', ev);

                let effect: Effect.EffectInfo;
                if (typeof ev === 'string') {
                    effect = Effect.effects[ev];
                } else {
                    effect = ev;
                }
                if (effect) {
                    // cell.debug(" - has event");
                    // if (
                    //     ctx.force ||
                    //     !effect.chance ||
                    //     random.chance(effect.chance, 10000)
                    // ) {
                    ctx.tile = tile;
                    // console.log(' - spawn event @%d,%d - %s', x, y, name);
                    didSomething =
                        (await Effect.fire(effect, map, x, y, ctx)) ||
                        didSomething;
                    // cell.debug(" - spawned");
                    if (didSomething) {
                        break;
                    }
                    // }
                }
            }
        }
        return didSomething;
    }

    hasEffect(name: string) {
        for (let tile of this.tiles) {
            if (tile && tile.hasEffect(name)) return true;
        }
        return false;
    }

    // // Items

    hasItem(): boolean {
        return this.hasCellFlag(Flags.HAS_ITEM);
    }
    get item(): Item | null {
        return this._item;
    }
    set item(val: Item | null) {
        this._item = val;
        if (val) {
            this.setCellFlag(Flags.HAS_ITEM);
        } else {
            this.clearCellFlag(Flags.HAS_ITEM);
        }
        this.needsRedraw = true;
    }

    // // Actors

    hasActor(): boolean {
        return this.hasCellFlag(Flags.HAS_ACTOR);
    }
    hasPlayer(): boolean {
        return this.hasCellFlag(Flags.HAS_PLAYER);
    }
    get actor(): Actor | null {
        return this._actor;
    }
    set actor(val: Actor | null) {
        this._actor = val;
        if (val) {
            this.setCellFlag(Flags.HAS_ACTOR);
        } else {
            this.clearCellFlag(Flags.HAS_ACTOR);
        }
        this.needsRedraw = true;
    }

    getDescription() {
        return this.highestPriorityTile().description;
    }

    getFlavor() {
        return this.highestPriorityTile().flavor;
    }

    getName(opts = {}) {
        return this.highestPriorityTile().getName(opts);
    }

    dump(): string {
        if (this._actor?.sprite?.ch) return this._actor.sprite.ch as string;
        if (this._item?.sprite?.ch) return this._item.sprite.ch as string;
        return this.highestPriorityTile().sprite.ch || ' ';
    }
}
