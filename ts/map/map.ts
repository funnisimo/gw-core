import * as Grid from '../grid';
import {
    LightSystemType,
    LightSystem,
    LightSystemSite,
    LightCb,
    LightValue,
} from '../light';
import { Map as Flags } from './flags';
import { Cell } from './cell';

export class Map implements LightSystemSite {
    width: number;
    height: number;
    cells: Grid.Grid<Cell>;
    flags: { map: 0 };
    light: LightSystemType;
    ambientLight: LightValue;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.flags = { map: 0 };

        this.cells = Grid.make(width, height, () => new Cell());
        this.light = new LightSystem(this);
        this.ambientLight = [100, 100, 100];
    }

    hasXY(x: number, y: number): boolean {
        return this.cells.hasXY(x, y);
    }

    cell(x: number, y: number): Cell {
        return this.cells[x][y];
    }

    // Information

    isVisible(x: number, y: number): boolean {
        return this.cell(x, y).isVisible();
    }
    hasActor(x: number, y: number): boolean {
        return this.cell(x, y).hasActor();
    }
    blocksVision(x: number, y: number): boolean {
        return this.cell(x, y).blocksVision();
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
            this.flags.map &= ~Flags.MAP_STABLE_GLOW_LIGHTS;
        } else {
            this.flags.map |= Flags.MAP_STABLE_GLOW_LIGHTS;
        }
    }

    eachGlowLight(_cb: LightCb): void {}
    eachDynamicLight(_cb: LightCb): void {}
}
