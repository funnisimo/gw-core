import { Cell as Flags } from './flags';
import { GameObject as ObjectFlags } from '../gameObject/flags';

export class Cell {
    flags: {
        cell: 0;
        object: 0;
    };

    constructor() {
        this.flags = { cell: 0, object: 0 };
    }

    hasActor(): boolean {
        return !!(this.flags.cell & Flags.HAS_ANY_ACTOR);
    }
    blocksVision(): boolean {
        return !!(this.flags.object & ObjectFlags.L_BLOCKS_VISION);
    }

    setCellFlag(flag: number) {
        this.flags.cell |= flag;
    }
    clearCellFlag(flag: number) {
        this.flags.cell &= ~flag;
    }

    redraw() {
        this.flags.cell |= Flags.NEEDS_REDRAW;
    }
    clearMemory() {
        // TODO
    }
    storeMemory() {
        // TODO
    }
}
