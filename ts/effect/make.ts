import { from as fromFlag } from '../flag';

import { EffectInfo, EffectBase } from './types';
import { EffectHandler } from './handler';
import { Effect as Flags } from './flags';

import { handlers, effects } from './effect';

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
    Object.values(handlers).forEach((v: EffectHandler) => v.make(opts, info));

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
