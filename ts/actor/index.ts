import { GameObject, ObjectFlags } from '../gameObject';
import { Cell } from '../map/cell';
import * as Flags from './flags';

export * as flags from './flags';

export interface ActorFlags extends ObjectFlags {
    actor: number;
}

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

    forbidsCell(_cell: Cell): boolean {
        return false;
    }
}
