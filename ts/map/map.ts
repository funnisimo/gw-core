import * as Grid from '../grid';
import {
    LightSystemType,
    LightSystem,
    LightSystemSite,
    LightCb,
} from '../light';
import { Map as Flags } from './flags';
import { Cell } from './cell';
import * as FOV from '../fov';

export type EachCellCb = (cell: Cell, x: number, y: number, map: Map) => void;
export type MapTestFn = (cell: Cell, x: number, y: number, map: Map) => boolean;

export interface MapOptions {
    tile: string | true;
    boundary: string | true;
    visible: boolean;
    revealed: boolean;
}

export class Map implements LightSystemSite, FOV.FovSite {
    width: number;
    height: number;
    cells: Grid.Grid<Cell>;
    flags: { map: 0 };
    light: LightSystemType;
    fov: FOV.FovSystemType;

    constructor(width: number, height: number, opts: Partial<MapOptions> = {}) {
        this.width = width;
        this.height = height;
        this.flags = { map: 0 };

        this.cells = Grid.make(width, height, () => new Cell());

        this.light = new LightSystem(this);
        this.light.setAmbient([100, 100, 100]);

        this.fov = new FOV.FovSystem(this);

        if (opts.visible) {
            this.fov.makeAlwaysVisible();
        } else if (opts.revealed) {
            this.fov.revealAll();
        }
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

    // Information

    isVisible(x: number, y: number): boolean {
        return this.fov.isAnyKindOfVisible(x, y);
    }
    hasActor(x: number, y: number): boolean {
        return this.cell(x, y).hasActor();
    }
    blocksVision(x: number, y: number): boolean {
        return this.cell(x, y).blocksVision();
    }

    count(cb: MapTestFn) {
        return this.cells.count((cell, x, y) => cb(cell, x, y, this));
    }
    dump(fmt?: (cell: Cell) => string) {
        this.cells.dump(fmt || ((c: Cell) => c.dump()));
    }

    // flags

    setCellFlag(x: number, y: number, flag: number): void {
        this.cell(x, y).setCellFlag(flag);
    }
    clearCellFlag(x: number, y: number, flag: number): void {
        this.cell(x, y).clearCellFlag(flag);
    }
    hasCellFlag(x: number, y: number, flag: number): boolean {
        return !!(this.cell(x, y).flags.cell & flag);
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

    setTile(x: number, y: number, tile: string | number) {
        this.cell(x, y).setTile(tile);
    }

    // LightSystemSite

    get anyLightChanged(): boolean {
        return !(this.flags.map & Flags.MAP_STABLE_LIGHTS);
    }
    set anyLightChanged(value: boolean) {
        if (value) {
            this.flags.map &= ~Flags.MAP_STABLE_LIGHTS;
        } else {
            this.flags.map |= Flags.MAP_STABLE_LIGHTS;
        }
    }

    get glowLightChanged(): boolean {
        return !(this.flags.map & Flags.MAP_STABLE_GLOW_LIGHTS);
    }
    set glowLightChanged(value: boolean) {
        if (value) {
            this.flags.map &= ~(
                Flags.MAP_STABLE_GLOW_LIGHTS | Flags.MAP_STABLE_GLOW_LIGHTS
            );
        } else {
            this.flags.map |= Flags.MAP_STABLE_GLOW_LIGHTS;
        }
    }

    eachGlowLight(_cb: LightCb): void {}
    eachDynamicLight(_cb: LightCb): void {}

    // FOV System Site

    fovChanged(): boolean {
        return !!(this.flags.map & Flags.MAP_FOV_CHANGED);
    }
    eachViewport(_cb: FOV.ViewportCb): void {
        throw new Error('Method not implemented.');
    }
    lightChanged(x: number, y: number): boolean {
        return this.light.lightChanged(x, y);
    }
    hasVisibleLight(x: number, y: number): boolean {
        return this.light.isLit(x, y);
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
    const map = new Map(w, h, opts);
    if (opts.tile === true) {
        opts.tile = 'FLOOR';
    }
    if (opts.boundary === true) {
        opts.boundary = 'WALL';
    }
    if (opts.tile) {
        map.fill(opts.tile, opts.boundary);
    }

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

    return map;
}
