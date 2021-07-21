import * as EFFECT from './effect';
import { EffectInfo } from './types';
import * as Types from '../types';

//////////////////////////////////////////////
// FN

class FnEffect implements EFFECT.EffectHandler {
    make(src: Partial<EFFECT.EffectConfig>, dest: EffectInfo): boolean {
        if (!src.fn) return true;

        if (typeof src.fn !== 'function') {
            throw new Error('fn effects must be functions.');
        }
        dest.fn = src.fn;
        return true;
    }

    async fire(
        config: any,
        map: Types.MapType,
        x: number,
        y: number,
        ctx: Partial<EFFECT.EffectCtx>
    ) {
        if (config.fn) {
            return await config.fn(config, map, x, y, ctx);
        }
        return false;
    }
}

EFFECT.installType('fn', new FnEffect());
