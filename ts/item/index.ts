import { GameObject } from '../gameObject';
import { CellType } from '../map/types';
import { Depth } from '../gameObject/flags';

import { ItemFlags } from './types';

export { ItemFlags } from './types';

export class Item extends GameObject {
    flags: ItemFlags;
    quantity = 1;
    next: Item | null = null;

    constructor() {
        super();
        // @ts-ignore
        this.flags = this.flags || {};
        this.flags.item = 0;
        this.depth = Depth.ITEM;
    }

    itemFlags(): number {
        return this.flags.item;
    }
    hasItemFlag(flag: number) {
        return !!(this.flags.item & flag);
    }
    hasAllItemFlags(flags: number) {
        return (this.flags.item & flags) === flags;
    }

    forbidsCell(_cell: CellType): boolean {
        return false;
    }
}
