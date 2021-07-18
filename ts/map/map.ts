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
import * as FOV from '../fov';

export class Map implements LightSystemSite, FOV.FovSite {
    width: number;
    height: number;
    cells: Grid.Grid<Cell>;
    flags: { map: 0 };
    light: LightSystemType;
    fov: FOV.FovSystemType;
    ambientLight: LightValue;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.flags = { map: 0 };

        this.cells = Grid.make(width, height, () => new Cell());
        this.light = new LightSystem(this);
        this.fov = new FOV.FovSystem(this);
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
        return this.fov.isAnyKindOfVisible(x, y);
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
