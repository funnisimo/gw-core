import * as EFFECT from './effect';
import * as TYPES from './types';
import * as Map from '../map';

//////////////////////////////////////////////
// FN

class FnEffect implements TYPES.EffectHandler {
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
        map: Map.Map,
        x: number,
        y: number,
        ctx: Partial<TYPES.EffectCtx>
    ) {
        if (config.fn) {
            return await config.fn(config, map, x, y, ctx);
        }
        return false;
    }
}

EFFECT.installType('fn', new FnEffect());
