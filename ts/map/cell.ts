import { Cell as Flags } from './flags';
import * as TILE from '../tile';
import { Depth } from '../gameObject/flags';
import { GameObject } from '../gameObject/gameObject';
import { GameObject as ObjectFlags } from '../gameObject/flags';
import { MapType } from './types';
import * as Effect from '../effect';
import { Chain } from '../utils';
import { CellType, CellFlags } from './types';
import * as Light from '../light';
import { Mixer } from '../sprite';
import { ActorFlags } from '../actor/types';
import { ItemFlags } from '../item/types';

type TileData = TILE.Tile | null;
type TileArray = [TILE.Tile, ...TileData[]];

export interface AllCellFlags
    extends CellFlags,
        ActorFlags,
        ItemFlags,
        TILE.TileFlags {}

export class CellMemory {
    snapshot: Mixer;
    flags: AllCellFlags;

    constructor() {
        this.snapshot = new Mixer();
        this.flags = {
            cell: 0,
            tile: 0,
            actor: 0,
            item: 0,
            object: 0,
            tileMech: 0,
        };
    }
}

export class Cell implements CellType {
    flags: CellFlags;
    chokeCount = 0;
    tiles: TileArray;
    objects: Chain<GameObject>;
    gasVolume: number = 0;
    liquidVolume: number = 0;
    memory: CellMemory;

    constructor() {
        this.flags = { cell: 0 };
        this.tiles = [TILE.tiles.NULL];
        this.objects = new Chain<GameObject>(
            (a, b) => a.depth - b.depth,
            () => {
                this.needsRedraw = true;
            }
        );
        this.memory = new CellMemory();
    }

    hasTileFlag(flag: number): boolean {
        return this.tiles.some((t) => t && t.flags.tile & flag);
    }
    hasAllTileFlags(flags: number): boolean {
        return (this.tileFlags() & flags) == flags;
    }
    hasObjectFlag(flag: number): boolean {
        return this.tiles.some((t) => t && t.flags.object & flag);
    }
    hasAllObjectFlags(flags: number): boolean {
        return (this.objectFlags() & flags) == flags;
    }

    objectFlags(): number {
        return this.tiles.reduce((out, t) => out | (t ? t.flags.object : 0), 0);
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

    blocksVision(): boolean {
        return this.tiles.some((t) => t && t.blocksVision());
    }
    blocksPathing(): boolean {
        return this.tiles.some((t) => t && t.blocksPathing());
    }
    blocksMove(): boolean {
        return this.tiles.some((t) => t && t.blocksMove());
    }
    blocksEffects(): boolean {
        return this.tiles.some((t) => t && t.blocksEffects());
    }
    blocksLayer(depth: number): boolean {
        return this.tiles.some(
            (t) =>
                t &&
                !!(t.flags.tile & TILE.flags.Tile.T_BLOCKS_OTHER_LAYERS) &&
                t.depth != depth
        );
    }
    isWall(): boolean {
        return this.hasAllObjectFlags(ObjectFlags.L_WALL_FLAGS);
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

    // @returns - whether or not the change results in a change to the cell lighting.
    setTile(tile: TILE.Tile): boolean {
        // if (!(tile instanceof TILE.Tile)) {
        //     tile = TILE.get(tile);
        //     if (!tile) return false;
        // }

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
    clearLayer(depth: Depth): boolean {
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
    // addItem(item: ItemType): boolean {
    //     if (this.item) {
    //         return false;
    //     }
    //     this.item = item;
    //     return true;
    // }
    // removeItem(item: ItemType): boolean {
    //     const current = this.item;
    //     if (current !== item) return false;
    //     this.item = null;
    //     return true;
    // }

    // // Actors

    hasActor(): boolean {
        return this.hasCellFlag(Flags.HAS_ANY_ACTOR);
    }
    // addActor(actor: ActorType): boolean {
    //     if (this.actor) {
    //         return false;
    //     }
    //     this.actor = actor;
    //     return true;
    // }
    // removeActor(actor: ActorType): boolean {
    //     const current = this.actor;
    //     if (current !== actor) return false;
    //     this.actor = null;
    //     return true;
    // }

    redraw() {
        this.flags.cell |= Flags.NEEDS_REDRAW;
    }
    clearMemory() {
        // TODO
    }
    storeMemory() {
        // TODO
    }

    getSnapshot(dest: Mixer) {
        dest.copy(this.memory.snapshot);
    }
    putSnapshot(src: Mixer) {
        this.memory.snapshot.copy(src);
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
        return this.tiles[0].sprite.ch || ' ';
    }
}
