import * as EFFECT from './effect';
import * as TYPES from './types';
import { EffectHandler } from './handler';
import { MapType } from '../map/types';

//////////////////////////////////////////////
// FN

export class FnEffect implements EffectHandler {
    make(src: Partial<TYPES.EffectConfig>, dest: TYPES.EffectInfo): boolean {
        if (!src.fn) return true;

        if (typeof src.fn !== 'function') {
            throw new Error('fn effects must be functions.');
        }
        dest.fn = src.fn;
        return true;
    }

    async fire(
        config: any,
        map: MapType,
        x: number,
        y: number,
        ctx: Partial<TYPES.EffectCtx>
    ) {
        if (config.fn) {
            return await config.fn(config, map, x, y, ctx);
        }
        return false;
    }

    fireSync(
        config: any,
        map: MapType,
        x: number,
        y: number,
        ctx: Partial<TYPES.EffectCtx>
    ) {
        if (config.fn) {
            const result = config.fn(config, map, x, y, ctx);
            if (result === true || result === false) {
                return result;
            }
            throw new Error(
                'Cannot use async function effects in build steps.'
            );
        }
        return false;
    }
}

EFFECT.installHandler('fn', new FnEffect());
