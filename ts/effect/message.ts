import * as EFFECT from './effect';
import { EffectInfo } from './types';
import { Effect as Flags } from './flags';
import * as Msg from '../message';
import * as Types from '../types';

//////////////////////////////////////////////
// MESSAGE

export class MessageEffect implements EFFECT.EffectHandler {
    make(src: Partial<EFFECT.EffectConfig>, dest: EffectInfo): boolean {
        if (!src.message) return true;

        if (typeof src.message !== 'string') {
            throw new Error(
                'Emit must be configured with name of event to emit'
            );
        }
        dest.message = src.message;
        return true;
    }

    async fire(
        config: any,
        map: Types.MapType,
        x: number,
        y: number,
        ctx: Partial<EFFECT.EffectCtx>
    ) {
        if (!config.message) return false;

        const fired = config.flags & Flags.E_FIRED ? true : false;

        ctx.actor = ctx.actor || map?.actorAt(x, y);
        ctx.item = ctx.item || map?.itemAt(x, y);
        if (
            config.message &&
            config.message.length &&
            !fired &&
            map.isVisible(x, y)
        ) {
            Msg.add(config.message, ctx);
            return true;
        }
        return false;
    }
}

EFFECT.installType('message', new MessageEffect());
