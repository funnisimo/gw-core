import { fl as Fl, from as fromFlag, FlagBase } from './flag';
import * as Types from './types';
import { data as DATA } from './gw';
import * as Msg from './message';
import * as Events from './events';
import * as Grid from './grid';
import { random } from './random';

///////////////////////////////////////////////////////
// TILE EVENT

export enum Flags {
    // E_ALWAYS_FIRE = Fl(10), // Fire even if the cell is marked as having fired this turn
    E_NEXT_ALWAYS = Fl(0), // Always fire the next effect, even if no tiles changed.
    E_NEXT_EVERYWHERE = Fl(1), // next effect spawns in every cell that this effect spawns in, instead of only the origin

    // E_NO_REDRAW_CELL = Fl(2),
    E_TREAT_AS_BLOCKING = Fl(3), // If filling the footprint of this effect with walls would disrupt level connectivity, then abort.
    E_PERMIT_BLOCKING = Fl(4), // Generate this effect without regard to level connectivity.
    E_ABORT_IF_BLOCKS_MAP = Fl(5),
    E_BLOCKED_BY_ITEMS = Fl(6), // Do not fire this effect in a cell that has an item.
    E_BLOCKED_BY_ACTORS = Fl(7), // Do not fire this effect in a cell that has an item.
    E_BLOCKED_BY_OTHER_LAYERS = Fl(8), // Will not propagate into a cell if any layer in that cell has a superior priority.
    E_SUPERPRIORITY = Fl(9), // Will overwrite terrain of a superior priority.

    E_NO_MARK_FIRED = Fl(11), // Do not mark this cell as having fired an effect (so can log messages multiple times)
    // MUST_REPLACE_LAYER
    // NEEDS_EMPTY_LAYER
    E_PROTECTED = Fl(12),

    E_SPREAD_CIRCLE = Fl(13), // Spread in a circle around the spot (using FOV), radius calculated using spread+decrement
    E_SPREAD_LINE = Fl(14), // Spread in a line in one random direction

    // E_NULL_SURFACE = Fl(15), // Clear the surface layer
    // E_NULL_LIQUID = Fl(16), // Clear liquid layer
    // E_NULL_GAS = Fl(17), // Clear gas layer

    E_EVACUATE_CREATURES = Fl(18), // Creatures in the effect area get moved outside of it
    E_EVACUATE_ITEMS = Fl(19), // Creatures in the effect area get moved outside of it

    E_BUILD_IN_WALLS = Fl(20),
    E_MUST_TOUCH_WALLS = Fl(21),
    E_NO_TOUCH_WALLS = Fl(22),

    E_FIRED = Fl(23), // has already been fired once

    E_CLEAR_GROUND = Fl(17), // clear all existing tiles
    E_CLEAR_SURFACE = Fl(24),
    E_CLEAR_LIQUID = Fl(25),
    E_CLEAR_GAS = Fl(26),

    E_CLEAR_CELL = E_CLEAR_GROUND |
        E_CLEAR_SURFACE |
        E_CLEAR_LIQUID |
        E_CLEAR_GAS,

    E_ONLY_IF_EMPTY = E_BLOCKED_BY_ITEMS | E_BLOCKED_BY_ACTORS,
    // E_NULLIFY_CELL = E_NULL_SURFACE | E_NULL_LIQUID | E_NULL_GAS,

    // These should be effect types
    E_ACTIVATE_DORMANT_MONSTER = Fl(27), // Dormant monsters on this tile will appear -- e.g. when a statue bursts to reveal a monster.
    E_AGGRAVATES_MONSTERS = Fl(28), // Will act as though an aggravate monster scroll of effectRadius radius had been read at that point.
    E_RESURRECT_ALLY = Fl(29), // Will bring back to life your most recently deceased ally.
    E_EMIT_EVENT = Fl(30), // Will emit the effect when activated
}

export interface EffectCtx {
    actor?: Types.ActorType | null;
    target?: Types.ActorType | null;
    item?: Types.ItemType | null;
    layer?: number;
    force?: boolean;
    grid: Grid.NumGrid;

    [id: string]: any; // other config from subtypes
}

export interface EffectConfig {
    flags: FlagBase;
    chance: number;
    next: Partial<EffectConfig> | string | null;

    [id: string]: any; // other config from subtypes
}

export type EffectBase = Partial<EffectConfig> | Function;

export interface EffectInfo {
    flags: number;
    chance: number;
    next: EffectInfo | string | null;
    id: string;

    [id: string]: any; // other config from subtypes
}

export interface EffectHandler {
    make: (src: Partial<EffectConfig>, dest: EffectInfo) => boolean;
    fire: (
        config: EffectInfo,
        map: Types.MapType,
        x: number,
        y: number,
        ctx: EffectCtx
    ) => boolean | Promise<boolean>;
}

export async function fire(
    effect: EffectInfo | string,
    map: Types.MapType,
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

//////////////////////////////////////////////
// FN

class FnEffect implements EffectHandler {
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean {
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
        ctx: Partial<EffectCtx>
    ) {
        if (config.fn) {
            return await config.fn(config, map, x, y, ctx);
        }
        return false;
    }
}

installType('fn', new FnEffect());

//////////////////////////////////////////////
// EMIT

class EmitEffect implements EffectHandler {
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean {
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
        ctx: Partial<EffectCtx>
    ) {
        if (config.emit) {
            return await Events.emit(config.emit, x, y, ctx);
        }
        return false;
    }
}

installType('emit', new EmitEffect());

//////////////////////////////////////////////
// MESSAGE

class MessageEffect implements EffectHandler {
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean {
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
        ctx: Partial<EffectCtx>
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

installType('message', new MessageEffect());
