import { LightType } from '../light';
import { Sprite } from '../sprite';
import { ObjectFlags, ObjectType } from './types';

export class GameObject implements ObjectType {
    sprite: Sprite;
    depth: number;
    light: LightType | null;
    flags: ObjectFlags;
    next: GameObject | null;
    x: number;
    y: number;

    constructor() {
        this.sprite = new Sprite();
        this.depth = 1; // default - TODO - enum/const
        this.light = null;
        this.flags = { object: 0 };
        this.next = null;
        this.x = -1;
        this.y = -1;
    }

    hasObjectFlag(flag: number) {
        return !!(this.flags.object & flag);
    }
    hasAllObjectFlags(flags: number) {
        return (this.flags.object & flags) === flags;
    }
}
