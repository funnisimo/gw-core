import * as Grid from '../grid';
import {
    LightSystemType,
    LightSystem,
    LightSystemSite,
    LightCb,
    LightSystemOptions,
} from '../light';
import * as Flags from './flags';
import { Cell } from './cell';
import * as FOV from '../fov';
import * as TILE from '../tile';
import { Tile } from '../tile';
import { TileLayer, ActorLayer, ItemLayer } from './layers';
import { ObjectList } from './objects';
import { Mixer } from '../sprite';
import { asyncForEach } from '../utils';
import * as Canvas from '../canvas';
import { Depth } from '../gameObject/flags';

export type EachCellCb = (cell: Cell, x: number, y: number, map: Map) => void;
export type MapTestFn = (cell: Cell, x: number, y: number, map: Map) => boolean;

export interface MapOptions extends LightSystemOptions, FOV.FovSystemOptions {
    tile: string | true;
    boundary: string | true;
}

export type LayerType = TileLayer | ActorLayer | ItemLayer;

export interface MapDrawOptions {
    x: number;
    y: number;
    width: number;
    height: number;
    mapOffsetX: number;
    mapOffsetY: number;
    force: boolean;
}

export class Map implements LightSystemSite, FOV.FovSite {
    width: number;
    height: number;
    cells: Grid.Grid<Cell>;
    _objects: ObjectList;
    layers: LayerType[];
    flags: { map: 0 };
    light: LightSystemType;
    fov: FOV.FovSystemType;
    properties: Record<string, any>;

    constructor(width: number, height: number, opts: Partial<MapOptions> = {}) {
        this.width = width;
        this.height = height;
        this.flags = { map: 0 };
        this.layers = [];

        this.cells = Grid.make(width, height, () => new Cell());
        this._objects = new ObjectList(this);

        this.light = new LightSystem(this, opts);
        this.fov = new FOV.FovSystem(this, opts);
        this.properties = {};

        this.initLayers();
    }

    // LAYERS

    initLayers() {
        this.addLayer(Depth.GROUND, new TileLayer(this, 'ground'));
        this.addLayer(Depth.SURFACE, new TileLayer(this, 'surface'));
        this.addLayer(Depth.ITEM, new ItemLayer(this, 'item'));
        this.addLayer(Depth.ACTOR, new ActorLayer(this, 'actor'));
    }

    addLayer(depth: number, layer: LayerType) {
        layer.depth = depth;
        this.layers[depth] = layer;
    }

    removeLayer(depth: number) {
        if (!depth) throw new Error('Cannot remove layer with depth=0.');
        delete this.layers[depth];
    }

    getLayer(depth: number): LayerType | null {
        return this.layers[depth] || null;
    }

    hasXY(x: number, y: number): boolean {
        return this.cells.hasXY(x, y);
    }
    isBoundaryXY(x: number, y: number): boolean {
        return x == 0 || y == 0 || x == this.width - 1 || y == this.height - 1;
    }

    cell(x: number, y: number): Cell {
        return this.cells[x][y];
    }
    get(x: number, y: number): Cell | undefined {
        return this.cells.get(x, y);
    }
    eachCell(cb: EachCellCb) {
        this.cells.forEach((cell, x, y) => cb(cell, x, y, this));
    }

    // DRAW

    drawInto(
        dest: Canvas.Canvas | Canvas.DataBuffer,
        opts: Partial<MapDrawOptions> | boolean = {}
    ) {
        const buffer: Canvas.DataBuffer =
            dest instanceof Canvas.Canvas ? dest.buffer : dest;

        if (typeof opts === 'boolean') opts = { force: opts };
        const mixer = new Mixer();
        for (let x = 0; x < buffer.width; ++x) {
            for (let y = 0; y < buffer.height; ++y) {
                const cell = this.cell(x, y);
                this.getAppearanceAt(x, y, mixer);
                const glyph =
                    typeof mixer.ch === 'number'
                        ? mixer.ch
                        : buffer.toGlyph(mixer.ch);
                buffer.draw(x, y, glyph, mixer.fg.toInt(), mixer.bg.toInt());
                cell.needsRedraw = false;
            }
        }
    }

    // items

    hasItem(x: number, y: number): boolean {
        return this.hasCellFlag(x, y, Flags.Cell.HAS_ITEM);
    }
    // addItem(x: number, y: number, item: TYPES.ItemType) {
    //     if (!this.hasXY(x, y)) return false;
    //     const cell = this.cell(x, y);
    //     return cell.objects.add(item);
    // }
    // removeItem(item: TYPES.ItemType) {
    //     const cell = this.cell(item.x, item.y);
    //     cell.objects.remove(item);
    // }

    // moveItem(x: number, y: number, item: TYPES.ItemType) {
    //     if (!this.hasXY(x, y)) return false;
    //     const newCell = this.cell(x, y);
    //     const oldCell = this.cell(item.x, item.y);
    //     return oldCell.removeItem(item) && newCell.addItem(item);
    // }

    // Actors

    hasActor(x: number, y: number): boolean {
        return this.hasCellFlag(x, y, Flags.Cell.HAS_ANY_ACTOR);
    }
    // addActor(x: number, y: number, actor: TYPES.ActorType): boolean {
    //     if (!this.hasXY(x, y)) return false;
    //     const cell = this.cell(x, y);
    //     return cell.objects.add(actor);
    // }
    // removeActor(actor: TYPES.ActorType): boolean {
    //     const cell = this.cell(actor.x, actor.y);
    //     return cell.objects.remove(actor);
    // }

    // moveActor(x: number, y: number, actor: TYPES.ActorType): boolean {
    //     if (!this.hasXY(x, y)) return false;
    //     const newCell = this.cell(x, y);
    //     const oldCell = this.cell(actor.x, actor.y);
    //     return oldCell.removeActor(actor) && newCell.addActor(actor);
    // }

    // Information

    isVisible(x: number, y: number): boolean {
        return this.fov.isAnyKindOfVisible(x, y);
    }
    blocksVision(x: number, y: number): boolean {
        return this.cell(x, y).blocksVision();
    }
    blocksMove(x: number, y: number): boolean {
        return this.cell(x, y).blocksMove();
    }

    isStairs(x: number, y: number): boolean {
        return this.cell(x, y).hasTileFlag(TILE.flags.Tile.T_HAS_STAIRS);
    }

    count(cb: MapTestFn) {
        return this.cells.count((cell, x, y) => cb(cell, x, y, this));
    }
    dump(fmt?: (cell: Cell) => string) {
        this.cells.dump(fmt || ((c: Cell) => c.dump()));
    }

    // flags

    hasMapFlag(flag: number): boolean {
        return !!(this.flags.map & flag);
    }
    setMapFlag(flag: number): void {
        this.flags.map |= flag;
    }
    clearMapFlag(flag: number): void {
        this.flags.map &= ~flag;
    }

    setCellFlag(x: number, y: number, flag: number): void {
        this.cell(x, y).setCellFlag(flag);
    }
    clearCellFlag(x: number, y: number, flag: number): void {
        this.cell(x, y).clearCellFlag(flag);
    }
    hasCellFlag(x: number, y: number, flag: number): boolean {
        return !!(this.cell(x, y).flags.cell & flag);
    }

    hasObjectFlag(x: number, y: number, flag: number): boolean {
        return this.cell(x, y).hasObjectFlag(flag);
    }

    hasTileFlag(x: number, y: number, flag: number): boolean {
        return this.cell(x, y).hasTileFlag(flag);
    }

    fill(tile: string, boundary?: string) {
        boundary = boundary || tile;
        let i, j;
        for (i = 0; i < this.width; ++i) {
            for (j = 0; j < this.height; ++j) {
                if (this.isBoundaryXY(i, j)) {
                    this.setTile(i, j, boundary);
                } else {
                    this.setTile(i, j, tile);
                }
            }
        }
    }

    setTile(x: number, y: number, tile: string | number | Tile, opts?: any) {
        if (!(tile instanceof TILE.Tile)) {
            tile = TILE.get(tile);
            if (!tile) return false;
        }
        if (opts === true) {
            opts = { force: true };
        }

        const depth = tile.depth || 0;
        const layer = this.layers[depth] || this.layers[0];
        if (!(layer instanceof TileLayer)) return false;
        return layer.set(x, y, tile, opts);
    }

    hasTile(x: number, y: number, tile: string | number | Tile): boolean {
        return this.cell(x, y)?.hasTile(tile);
    }

    get objects() {
        return this._objects;
    }

    async update(dt: number) {
        await asyncForEach(this.layers, (l) => l.update(dt));
    }

    copy(_src: Map) {}

    clone() {}

    getAppearanceAt(x: number, y: number, dest: Mixer) {
        dest.blackOut();
        const cell = this.cell(x, y);

        if (cell.needsRedraw) {
            this.layers.forEach((layer) => layer.putAppearance(dest, x, y));
            cell.putSnapshot(dest);
        } else {
            cell.getSnapshot(dest);
        }

        if (this.fov.isAnyKindOfVisible(x, y)) {
            const light = this.light.getLight(x, y);
            dest.multiply(light);
        } else if (this.fov.isRevealed(x, y)) {
            dest.scale(50);
        } else {
            dest.blackOut();
        }
    }

    // // LightSystemSite

    // get anyLightChanged(): boolean {
    //     return !(this.flags.map & Flags.Map.MAP_STABLE_LIGHTS);
    // }
    // set anyLightChanged(value: boolean) {
    //     if (value) {
    //         this.flags.map &= ~Flags.Map.MAP_STABLE_LIGHTS;
    //     } else {
    //         this.flags.map |= Flags.Map.MAP_STABLE_LIGHTS;
    //     }
    // }

    // get glowLightChanged(): boolean {
    //     return !(this.flags.map & Flags.Map.MAP_STABLE_GLOW_LIGHTS);
    // }
    // set glowLightChanged(value: boolean) {
    //     if (value) {
    //         this.flags.map &= ~(
    //             Flags.Map.MAP_STABLE_GLOW_LIGHTS |
    //             Flags.Map.MAP_STABLE_GLOW_LIGHTS
    //         );
    //     } else {
    //         this.flags.map |= Flags.Map.MAP_STABLE_GLOW_LIGHTS;
    //     }
    // }

    eachGlowLight(cb: LightCb): void {
        this.cells.forEach((cell, x, y) => {
            cell.eachGlowLight((light) => cb(x, y, light));
        });
    }
    eachDynamicLight(_cb: LightCb): void {}

    // FOV System Site

    eachViewport(_cb: FOV.ViewportCb): void {
        // TODO !!
    }
    lightingChanged(): boolean {
        return this.light.changed;
    }
    hasVisibleLight(x: number, y: number): boolean {
        return !this.light.isDark(x, y);
    }
    cellRevealed(_x: number, _y: number): void {
        // if (DATA.automationActive) {
        // if (cell.item) {
        //     const theItem: GW.types.ItemType = cell.item;
        //     if (
        //         theItem.hasLayerFlag(ObjectFlags.L_INTERRUPT_WHEN_SEEN)
        //     ) {
        //         GW.message.add(
        //             '§you§ §see§ ΩitemMessageColorΩ§item§∆.',
        //             {
        //                 item: theItem,
        //                 actor: DATA.player,
        //             }
        //         );
        //     }
        // }
        // if (
        //     !(this.fov.isMagicMapped(x, y)) &&
        //     this.site.hasObjectFlag(
        //         x,
        //         y,
        //         ObjectFlags.L_INTERRUPT_WHEN_SEEN
        //     )
        // ) {
        //     const tile = cell.tileWithLayerFlag(
        //         ObjectFlags.L_INTERRUPT_WHEN_SEEN
        //     );
        //     if (tile) {
        //         GW.message.add(
        //             '§you§ §see§ ΩbackgroundMessageColorΩ§item§∆.',
        //             {
        //                 actor: DATA.player,
        //                 item: tile.name,
        //             }
        //         );
        //     }
        // }
    }
    redrawCell(x: number, y: number, clearMemory?: boolean): void {
        if (clearMemory) {
            this.cells[x][y].clearMemory();
        }
        this.cells[x][y].redraw();
    }
    storeMemory(x: number, y: number): void {
        this.cells[x][y].storeMemory();
    }

    // DigSite

    isWall(x: number, y: number): boolean {
        if (!this.hasXY(x, y)) return true;
        const cell = this.cell(x, y);
        return cell.blocksMove() && cell.blocksVision();
    }
}

export function make(
    w: number,
    h: number,
    floor?: string,
    boundary?: string
): Map;
export function make(w: number, h: number, floor: string): Map;
export function make(w: number, h: number, opts: Partial<MapOptions>): Map;
export function make(
    w: number,
    h: number,
    opts: Partial<MapOptions> | string = {},
    boundary?: string
): Map {
    if (typeof opts === 'string') {
        opts = { tile: opts };
    }
    if (boundary) {
        opts.boundary = boundary;
    }
    if (opts.tile === true) {
        opts.tile = 'FLOOR';
    }
    if (opts.boundary === true) {
        opts.boundary = 'WALL';
    }
    const map = new Map(w, h, opts);
    if (opts.tile) {
        map.fill(opts.tile, opts.boundary);
    }

    map.light.update();

    // if (!DATA.map) {
    //     DATA.map = map;
    // }
    return map;
}

function isString(value: any): value is string {
    return typeof value === 'string';
}

function isStringArray(value: any): value is string[] {
    return Array.isArray(value) && typeof value[0] === 'string';
}

export function from(
    prefab: string | string[] | Grid.NumGrid,
    charToTile: Record<string, string | null>,
    opts: Partial<MapOptions> = {}
) {
    let height = 0;
    let width = 0;
    let map: Map;

    if (isString(prefab)) {
        prefab = prefab.split('\n');
    }

    if (isStringArray(prefab)) {
        height = prefab.length;
        width = prefab.reduce((len, line) => Math.max(len, line.length), 0);
        map = make(width, height, opts);

        prefab.forEach((line, y) => {
            for (let x = 0; x < width; ++x) {
                const ch = line[x] || '.';
                const tile = charToTile[ch] || 'FLOOR';
                map.setTile(x, y, tile);
            }
        });
    } else {
        height = prefab.height;
        width = prefab.width;
        map = make(width, height, opts);

        prefab.forEach((v, x, y) => {
            const tile = charToTile[v] || 'FLOOR';
            map.setTile(x, y, tile);
        });
    }

    map.light.update();
    return map;
}
