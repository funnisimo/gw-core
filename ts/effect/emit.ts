import * as EFFECT from './effect';
import { EffectInfo } from './types';
import * as Types from '../types';
import * as Events from '../events';

//////////////////////////////////////////////
// EMIT

export class EmitEffect implements EFFECT.EffectHandler {
    make(src: Partial<EFFECT.EffectConfig>, dest: EffectInfo): boolean {
        if (!src.emit) return true;

        if (typeof src.emit !== 'string') {
            throw new Error(
                'emit effects must be string name to emit: { emit: "EVENT" }'
            );
        }
        dest.emit = src.emit;
        return true;
    }

    async fire(
        config: any,
        _map: Types.MapType,
        x: number,
        y: number,
        ctx: Partial<EFFECT.EffectCtx>
    ) {
        if (config.emit) {
            return await Events.emit(config.emit, x, y, ctx);
        }
        return false;
    }
}

EFFECT.installType('emit', new EmitEffect());
