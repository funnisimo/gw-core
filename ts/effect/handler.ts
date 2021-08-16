import { EffectConfig, EffectInfo, EffectCtx } from './types';
import { MapType } from '../map/types';

export interface EffectHandler {
    make: (src: Partial<EffectConfig>, dest: EffectInfo) => boolean;
    fire: (
        config: EffectInfo,
        map: MapType,
        x: number,
        y: number,
        ctx: EffectCtx
    ) => boolean | Promise<boolean>;

    fireSync: (
        config: EffectInfo,
        map: MapType,
        x: number,
        y: number,
        ctx: EffectCtx
    ) => boolean;
}
