import { fl as Fl, from as fromFlag } from './flag';
import * as Types from './types';
import { make as Make, data as DATA } from './gw';
import * as Utils from './utils';
import * as Msg from './message';
import * as Events from './events';
import * as Grid from './grid';

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
    // E_PROTECTED = Fl(12),

    E_SPREAD_CIRCLE = Fl(13), // Spread in a circle around the spot (using FOV), radius calculated using spread+decrement
    E_SPREAD_LINE = Fl(14), // Spread in a line in one random direction

    // E_NULL_SURFACE = Fl(15), // Clear the surface layer
    // E_NULL_LIQUID = Fl(16), // Clear liquid layer
    // E_NULL_GAS = Fl(17), // Clear gas layer

    E_CLEAR_CELL = Fl(17), // clear all existing tiles
    E_EVACUATE_CREATURES = Fl(18), // Creatures in the effect area get moved outside of it
    E_EVACUATE_ITEMS = Fl(19), // Creatures in the effect area get moved outside of it

    E_BUILD_IN_WALLS = Fl(20),
    E_MUST_TOUCH_WALLS = Fl(21),
    E_NO_TOUCH_WALLS = Fl(22),

    E_FIRED = Fl(23), // has already been fired once

    E_ONLY_IF_EMPTY = E_BLOCKED_BY_ITEMS | E_BLOCKED_BY_ACTORS,
    // E_NULLIFY_CELL = E_NULL_SURFACE | E_NULL_LIQUID | E_NULL_GAS,

    // These should be effect types
    E_ACTIVATE_DORMANT_MONSTER = Fl(23), // Dormant monsters on this tile will appear -- e.g. when a statue bursts to reveal a monster.
    E_AGGRAVATES_MONSTERS = Fl(24), // Will act as though an aggravate monster scroll of effectRadius radius had been read at that point.
    E_RESURRECT_ALLY = Fl(25), // Will bring back to life your most recently deceased ally.
    E_EMIT_EVENT = Fl(26), // Will emit the effect when activated
}

export interface EffectCtx {
    actor?: Types.ActorType;
    target?: Types.ActorType;
    item?: Types.ItemType;
    layer?: number;
    force?: boolean;
}

export type EffectFn = (
    this: any,
    effect: Effect,
    x: number,
    y: number
) => Promise<boolean> | boolean;

export class Effect {
    // public tile: string | null;
    // public fn: Function | null;
    // public item: string | null;
    // public message: string | null;
    // public lightFlare: string | null;
    // public flashColor: Color.Color | null;
    // public fired: boolean;
    // public emit: string | null;

    public map: Types.MapType | null = null;
    public ctx: any = {};

    protected effects: EffectFn[] = [];
    public flags: Flags = 0;
    public chance = 0;

    // public chance: number;
    // public volume: number;
    // public spread: number;
    // public radius: number;
    // public decrement: number;
    // public flags: number;
    // public matchTile: string | null;

    public next: Effect | string | null = null;
    public id: string | null = null;

    protected _grid: Grid.NumGrid | null = null;

    constructor(
        effects: EffectFn | EffectFn[],
        next: Effect | string | null = null
    ) {
        // if (typeof opts === 'function') {
        //     opts = {
        //         fn: opts,
        //     };
        // }

        // this.tile = opts.tile || null;
        // this.fn = opts.fn || null;
        // this.item = opts.item || null;
        // this.chance = opts.chance || 0;
        // this.volume = opts.volume || 0;

        // // spawning pattern:
        // this.spread = opts.spread || 0;
        // this.radius = opts.radius || 0;
        // this.decrement = opts.decrement || 0;
        // this.flags = Flag.from(Flags, opts.flags);
        // this.matchTile = opts.matchTile || opts.needs || 0; /* ENUM tileType */
        // this.next = opts.next || null; /* ENUM makeEventTypes */

        // this.message = opts.message || null;
        // this.lightFlare = opts.flare || null;
        // this.flashColor = opts.flash ? Color.from(opts.flash) : null;
        // // this.effectRadius = radius || 0;
        // this.fired = false;
        // this.emit = opts.emit || null; // name of the effect to emit when activated
        // this.id = opts.id || null;

        if (!Array.isArray(effects)) effects = [effects];
        this.effects = effects.slice();
        this.next = next;
    }

    get grid() {
        if (!this._grid) {
            this._grid = Grid.alloc(this.map!.width, this.map!.height);
        }
        return this._grid;
    }

    async fire(
        map: Types.MapType,
        x: number,
        y: number,
        ctx: any = {}
    ): Promise<boolean> {
        let didSomething = false;
        this.map = map;
        this.ctx = ctx;

        // fire all of my functions
        for (let i = 0; i < this.effects.length; ++i) {
            const eff = this.effects[i];
            didSomething = (await eff(this, x, y)) || didSomething;
        }

        // bookkeeping
        if (
            didSomething &&
            map.isVisible(x, y) &&
            !(this.flags & Flags.E_NO_MARK_FIRED)
        ) {
            this.flags |= Flags.E_FIRED;
        }

        // do the next effect - if applicable
        if (
            this.next &&
            (didSomething || this.flags & Flags.E_NEXT_ALWAYS) &&
            !DATA.gameHasEnded
        ) {
            let next = this.next;
            if (typeof next === 'string') {
                next = effects[next] || null;
            }
            if (!next) {
                Utils.ERROR('Unknown next effect - ' + this.next);
            } else if (this._grid && this.flags & Flags.E_NEXT_EVERYWHERE) {
                await this.grid.forEachAsync(async (v, i, j) => {
                    if (!v) return;
                    // @ts-ignore
                    didSomething = (await next.fire(map, i, j)) || didSomething;
                });
            } else {
                didSomething = (await next.fire(map, x, y)) || didSomething;
            }
        }

        if (this._grid) {
            Grid.free(this._grid);
            this._grid = null;
        }

        return didSomething;
    }

    // resetMessageDisplayed
    reset() {
        this.flags &= ~Flags.E_FIRED;
    }
}

export function makeEffects(opts: any): EffectFn[] {
    const results: EffectFn[] = [];
    Object.entries(opts).forEach(([key, value]) => {
        if (key === 'fn') {
            results.push(value as EffectFn);
        } else {
            const setup = effectTypes[key];
            if (!setup) return;

            const effect = setup(value);
            if (effect) {
                results.push(effect);
            }
        }
    });
    return results;
}

export const effects: Record<string, Effect> = {};

export function make(opts: string | any): Effect {
    if (!opts) Utils.ERROR('opts required to make effect.');
    if (typeof opts === 'string') {
        const cached = effects[opts];
        if (cached) return cached;
        Utils.ERROR('string effect config must be id of installed effect.');
    } else if (typeof opts === 'function') {
        opts = { fn: opts };
    }

    // now make effects
    const fns: EffectFn[] = makeEffects(opts);

    let next: Effect | string | null = opts.next;
    if (next && typeof next !== 'string') {
        next = make(next);
    }

    const te = new Effect(fns, next);
    te.flags = fromFlag(Flags, opts.flags);
    te.chance = opts.chance || 0;
    return te;
}

Make.tileEvent = make;

export function from(opts: Effect | string): Effect {
    if (typeof opts === 'string') {
        const effect = effects[opts];
        if (effect) return effect;
        Utils.ERROR('Unknown effect - ' + opts);
    }
    // @ts-ignore
    return opts;
}

export function install(id: string, effect: Effect | any) {
    if (!(effect instanceof Effect)) {
        effect = make(effect);
    }
    effects[id] = effect;
    if (effect) effect.id = id;
    return effect;
}

export function installAll(effects: Record<string, Effect | any>) {
    Object.entries(effects).forEach(([id, config]) => {
        install(id, config);
    });
}

export function resetAll() {
    Object.values(effects).forEach((e) => e.reset());
}

export type EffectMakeFn = (config: any) => EffectFn | null;
export const effectTypes: Record<string, EffectMakeFn> = {};

export function installType(id: string, fn: EffectMakeFn) {
    effectTypes[id] = fn;
}

//////////////////////////////////////////////
// EMIT

export async function effectEmit(
    this: any,
    effect: Effect,
    x: number,
    y: number
) {
    if (this.emit) {
        await Events.emit(this.emit, x, y, effect);
        return true;
    }
    return false;
}

export function makeEmit(config: any): EffectFn {
    if (typeof config !== 'string') {
        Utils.ERROR('Emit must be configured with name of event to emit');
    }
    return effectEmit.bind({ emit: config });
}

installType('emit', makeEmit);

//////////////////////////////////////////////
// MESSAGE

export async function effectMessage(
    this: any,
    effect: Effect,
    x: number,
    y: number
) {
    const map = effect.map!;
    const fired = effect.flags & Flags.E_FIRED ? true : false;
    const ctx = effect.ctx;

    ctx.actor = ctx.actor || map.actorAt(x, y);
    ctx.item = ctx.item || map.itemAt(x, y);
    if (this.message && this.message.length && !fired && map!.isVisible(x, y)) {
        Msg.add(this.message, effect.ctx);
        return true;
    }
    return false;
}

export function makeMessage(config: any): EffectFn {
    if (typeof config !== 'string') {
        Utils.ERROR('Emit must be configured with name of event to emit');
    }
    return effectMessage.bind({ message: config });
}

installType('message', makeMessage);
