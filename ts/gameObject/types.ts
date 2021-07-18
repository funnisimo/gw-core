import { SpriteData } from '../sprite/types';
import { LightType } from '../light/types';

export interface ObjectFlags {
    object: number;
}

export interface ObjectType {
    sprite: SpriteData;
    priority: number;
    layer: number;
    light: LightType | null;
    flags: ObjectFlags;
}
