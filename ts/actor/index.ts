import { GameObject } from '../gameObject';
import { CellType } from '../map/types';
import * as Flags from './flags';
import { ActorFlags } from './types';

export * as flags from './flags';
export { ActorFlags } from './types';

export class Actor extends GameObject {
    flags: ActorFlags;

    constructor() {
        super();
        // @ts-ignore
        this.flags = this.flags || {};
        this.flags.actor = 0;
        this.depth = Flags.Depth.ACTOR;
    }

    hasActorFlag(flag: number) {
        return !!(this.flags.actor & flag);
    }
    hasAllActorFlags(flags: number) {
        return (this.flags.actor & flags) === flags;
    }

    isPlayer() {
        return this.hasActorFlag(Flags.Actor.IS_PLAYER);
    }
    isVisible() {
        return true;
    }

    forbidsCell(_cell: CellType): boolean {
        return false;
    }
}
