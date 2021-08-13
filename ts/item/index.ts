import { GameObject, ObjectFlags } from '../gameObject';
import { Cell } from '../map/cell';
import { Depth } from '../gameObject/flags';

export interface ItemFlags extends ObjectFlags {
    item: number;
}

export class Item extends GameObject {
    flags: ItemFlags;
    quantity = 1;

    constructor() {
        super();
        // @ts-ignore
        this.flags = this.flags || {};
        this.flags.item = 0;
        this.depth = Depth.ITEM;
    }

    hasItemFlag(flag: number) {
        return !!(this.flags.item & flag);
    }
    hasAllItemFlags(flags: number) {
        return (this.flags.item & flags) === flags;
    }

    forbidsCell(_cell: Cell): boolean {
        return false;
    }
}
