import { data as DATA } from '../gw';
import * as Grid from '../grid';
import { random } from '../random';
import { MapType } from '../map/types';

import { EffectInfo, EffectCtx } from './types';
import { Effect as Flags } from './flags';

import { effectTypes } from './effect';
import { from } from './make';

export async function fire(
    effect: EffectInfo | string,
    map: MapType,
    x: number,
    y: number,
    ctx_: Partial<EffectCtx> = {}
) {
    if (!effect) return false;
    if (typeof effect === 'string') {
        const name = effect;
        effect = from(name);
        if (!effect) throw new Error('Failed to find effect: ' + name);
    }

    const ctx = ctx_ as EffectCtx;
    if (!ctx.force && effect.chance && !random.chance(effect.chance, 10000))
        return false;

    const grid = (ctx.grid = Grid.alloc(map.width, map.height));

    let didSomething = true;
    const handlers = Object.values(effectTypes);
    for (let h of handlers) {
        if (await h.fire(effect, map, x, y, ctx)) {
            didSomething = true;
        }
    }

    // bookkeeping
    if (
        didSomething &&
        map.isVisible(x, y) &&
        !(effect.flags & Flags.E_NO_MARK_FIRED)
    ) {
        effect.flags |= Flags.E_FIRED;
    }

    // do the next effect - if applicable
    if (
        effect.next &&
        (didSomething || effect.flags & Flags.E_NEXT_ALWAYS) &&
        !DATA.gameHasEnded
    ) {
        const nextInfo =
            typeof effect.next === 'string' ? from(effect.next) : effect.next;
        if (effect.flags & Flags.E_NEXT_EVERYWHERE) {
            await grid.forEachAsync(async (v, i, j) => {
                if (!v) return;
                // @ts-ignore
                await fire(nextInfo, map, i, j, ctx);
            });
        } else {
            await fire(nextInfo, map, x, y, ctx);
        }
    }

    Grid.free(grid);
    return didSomething;
}
