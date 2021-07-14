import { Cell as Flags } from './flags';
import { GameObject as ObjectFlags } from '../gameObject/flags';

export class Cell {
    flags: {
        cell: 0;
        cellMech: 0;
        object: 0;
    };

    constructor() {
        this.flags = { cell: 0, cellMech: 0, object: 0 };
    }

    isVisible(): boolean {
        return !!(this.flags.cell & Flags.ANY_KIND_OF_VISIBLE);
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
}
