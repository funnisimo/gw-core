import { SpriteData } from '../sprite/types';
import { LightType } from '../light/types';
import { Layer } from './flags';

export interface ObjectFlags {
    object: number;
}

export interface ObjectType {
    sprite: SpriteData;
    priority: number;
    layer: Layer;
    light: LightType | null;
    flags: ObjectFlags;
}
