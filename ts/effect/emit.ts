import * as EFFECT from './effect';
import * as TYPES from './types';
import { EffectHandler } from './handler';
import { MapType } from '../map/types';
import * as Events from '../events';

//////////////////////////////////////////////
// EMIT

export class EmitEffect implements EffectHandler {
    make(src: Partial<TYPES.EffectConfig>, dest: TYPES.EffectInfo): boolean {
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
        _map: MapType,
        x: number,
        y: number,
        ctx: TYPES.EffectCtx
    ) {
        if (config.emit) {
            return await Events.emit(config.emit, x, y, ctx);
        }
        return false;
    }
}

EFFECT.installType('emit', new EmitEffect());
