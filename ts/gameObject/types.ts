import { Sprite } from '../sprite';
import { LightType } from '../light/types';
import { Chainable } from '../utils/chain';
import { XY } from '../types';

export interface ObjectFlags {
    object: number;
}

export interface ObjectType extends Chainable<ObjectType>, XY {
    sprite: Sprite;
    depth: number;
    light: LightType | null;
    flags: ObjectFlags;
}
