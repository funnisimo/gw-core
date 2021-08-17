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
import { Item } from '../item';
import { Actor } from '../actor';
import { Mixer } from '../sprite';
import * as Utils from '../utils';
import * as Canvas from '../canvas';
import { Depth } from '../gameObject/flags';
import {
    MapType,
    EachCellCb,
    MapTestFn,
    CellType,
    SetTileOptions,
    CellInfoType,
} from './types';
import * as Color from '../color';
import { EachCb } from '../types';
import { CellMemory } from './cellMemory';

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

export class Map implements LightSystemSite, FOV.FovSite, MapType {
    width: number;
    height: number;
    cells: Grid.Grid<Cell>;
    layers: LayerType[];
    flags: { map: 0 };
    light: LightSystemType;
    fov: FOV.FovSystemType;
    properties: Record<string, any>;
    memory: Grid.Grid<CellMemory>;

    constructor(width: number, height: number, opts: Partial<MapOptions> = {}) {
        this.width = width;
        this.height = height;
        this.flags = { map: 0 };
        this.layers = [];

        this.cells = Grid.make(width, height, () => new Cell());
        this.memory = Grid.make(width, height, () => new CellMemory());

        this.light = new LightSystem(this, opts);
        this.fov = new FOV.FovSystem(this, opts);
        this.properties = {};

        this.initLayers();
    }

    cellInfo(x: number, y: number, useMemory = false): CellInfoType {
        if (useMemory) return this.memory[x][y];
        return this.cell(x, y);
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

    cell(x: number, y: number): CellType {
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

    itemAt(x: number, y: number): Item | null {
        return this.cell(x, y).item;
    }
    eachItem(cb: EachCb<Item>): void {
        this.cells.forEach((cell) => {
            Utils.eachChain(cell.item, cb);
        });
    }
    addItem(x: number, y: number, item: Item): boolean {
        const layer = this.layers[item.depth] as ItemLayer;
        return layer.add(x, y, item);
    }
    removeItem(item: Item): boolean {
        const layer = this.layers[item.depth] as ItemLayer;
        return layer.remove(item);
    }
    moveItem(item: Item, x: number, y: number): boolean {
        const layer = this.layers[item.depth] as ItemLayer;
        if (!layer.remove(item)) return false;
        return layer.add(x, y, item);
    }

    // Actors

    hasPlayer(x: number, y: number): boolean {
        return this.cell(x, y).hasPlayer();
    }
    actorAt(x: number, y: number): Actor | null {
        return this.cell(x, y).actor;
    }
    eachActor(cb: EachCb<Actor>): void {
        this.cells.forEach((cell) => {
            Utils.eachChain(cell.actor, cb);
        });
    }
    addActor(x: number, y: number, item: Actor): boolean {
        const layer = this.layers[item.depth] as ActorLayer;
        return layer.add(x, y, item);
    }
    removeActor(item: Actor): boolean {
        const layer = this.layers[item.depth] as ActorLayer;
        return layer.remove(item);
    }
    moveActor(item: Actor, x: number, y: number): boolean {
        const layer = this.layers[item.depth] as ActorLayer;
        if (!layer.remove(item)) return false;
        return layer.add(x, y, item);
    }

    // Information

    isVisible(x: number, y: number): boolean {
        return this.fov.isAnyKindOfVisible(x, y);
    }

    count(cb: MapTestFn): number {
        return this.cells.count((cell, x, y) => cb(cell, x, y, this));
    }
    dump(fmt?: (cell: CellType) => string) {
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

    setCellFlag(x: number, y: number, flag: number) {
        this.cell(x, y).setCellFlag(flag);
    }
    clearCellFlag(x: number, y: number, flag: number) {
        this.cell(x, y).clearCellFlag(flag);
    }

    // Skips all the logic checks and just forces a clean cell with the given tile
    fill(tile: string | number | Tile, boundary?: string | number | Tile) {
        tile = TILE.get(tile);
        boundary = TILE.get(boundary || tile);

        let i, j;
        for (i = 0; i < this.width; ++i) {
            for (j = 0; j < this.height; ++j) {
                const cell = this.cell(i, j);
                cell.clear();
                cell.setTile(this.isBoundaryXY(i, j) ? boundary : tile);
            }
        }
    }

    setTile(
        x: number,
        y: number,
        tile: string | number | Tile,
        opts?: SetTileOptions
    ) {
        if (!(tile instanceof TILE.Tile)) {
            tile = TILE.get(tile);
            if (!tile) return false;
        }
        if (opts === true) {
            opts = { superpriority: true };
        }

        const depth = tile.depth || 0;
        const layer = this.layers[depth] || this.layers[0];
        if (!(layer instanceof TileLayer)) return false;
        return layer.set(x, y, tile, opts);
    }

    async update(dt: number): Promise<void> {
        await Utils.asyncForEach(this.layers, (l) => l.update(dt));
    }

    copy(_src: Map): void {}

    clone() {}

    getAppearanceAt(x: number, y: number, dest: Mixer) {
        dest.blackOut();
        const cell = this.cell(x, y);
        const isVisible = this.fov.isAnyKindOfVisible(x, y);

        if (cell.needsRedraw && isVisible) {
            this.layers.forEach((layer) => layer.putAppearance(dest, x, y));
            this.memory[x][y].putSnapshot(dest);
            cell.needsRedraw = false;
        } else {
            this.memory[x][y].getSnapshot(dest);
        }

        if (isVisible) {
            const light = this.light.getLight(x, y);
            dest.multiply(light);
        } else if (this.fov.isRevealed(x, y)) {
            dest.scale(50);
        } else {
            dest.blackOut();
        }

        dest.bake(!this.fov.isAnyKindOfVisible(x, y));
        if (cell.hasObjectFlag(Flags.GameObject.L_VISUALLY_DISTINCT)) {
            Color.separate(dest.fg, dest.bg);
        }

        if (dest.dances) {
            cell.setCellFlag(Flags.Cell.COLORS_DANCE);
        } else {
            cell.clearCellFlag(Flags.Cell.COLORS_DANCE);
        }
    }

    // // LightSystemSite

    hasActor(x: number, y: number): boolean {
        return this.cell(x, y).hasActor();
    }
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
    blocksVision(x: number, y: number): boolean {
        return this.cell(x, y).blocksVision();
    }
    onCellRevealed(_x: number, _y: number): void {
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
            this.clearMemory(x, y);
        }
        this.cells[x][y].needsRedraw = true;
    }
    clearMemory(x: number, y: number): void {
        this.memory[x][y].clear();
    }
    storeMemory(x: number, y: number): void {
        const cell = this.cell(x, y);
        this.memory[x][y].store(cell);
    }

    // // DigSite

    // isWall(x: number, y: number, useMemory = false): boolean {
    //     const info = this.cellInfo(x, y, useMemory);
    //     return info.blocksMove() && info.blocksVision();
    // }
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
