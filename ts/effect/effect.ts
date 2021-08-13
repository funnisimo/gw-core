import { from as fromFlag } from '../flag';
import { data as DATA } from '../gw';
import * as Grid from '../grid';
import { random } from '../random';
import { Map } from '../map';

import {
    EffectInfo,
    EffectCtx,
    EffectBase,
    EffectHandler,
    EffectConfig,
} from './types';
import { Effect as Flags } from './flags';

export async function fire(
    effect: EffectInfo | string,
    map: Map,
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

// resetMessageDisplayed
export function reset(effect: EffectInfo) {
    effect.flags &= ~Flags.E_FIRED;
}

export function resetAll() {
    Object.values(effects).forEach((e) => reset(e));
}

export const effects: Record<string, EffectInfo> = {};

export function make(opts: EffectBase): EffectInfo {
    if (!opts) throw new Error('opts required to make effect.');

    if (typeof opts === 'string') {
        throw new Error('Cannot make effect from string: ' + opts);
    }

    if (typeof opts === 'function') {
        opts = { fn: opts };
    }

    // now make base effect stuff
    const info: EffectInfo = {
        flags: fromFlag(Flags, opts.flags),
        chance: opts.chance ?? 0, // 0 means always fire
        next: null,
        id: opts.id || 'n/a',
    };

    if (opts.next) {
        if (typeof opts.next === 'string') {
            info.next = opts.next;
        } else {
            info.next = make(opts.next);
        }
    }

    // and all the handlers
    Object.values(effectTypes).forEach((v: EffectHandler) =>
        v.make(opts, info)
    );

    return info;
}

export function from(opts: EffectBase | string): EffectInfo {
    if (!opts) throw new Error('Cannot make effect from null | undefined');
    if (typeof opts === 'string') {
        const effect = effects[opts];
        if (effect) return effect;
        throw new Error('Unknown effect - ' + opts);
    }
    return make(opts);
}

export function install(id: string, config: Partial<EffectConfig>): EffectInfo {
    const effect = make(config);
    effects[id] = effect;
    effect.id = id;
    return effect;
}

export function installAll(effects: Record<string, Partial<EffectConfig>>) {
    Object.entries(effects).forEach(([id, config]) => {
        install(id, config);
    });
}

export const effectTypes: Record<string, EffectHandler> = {};

export function installType(id: string, effectType: EffectHandler) {
    effectTypes[id] = effectType;
}
