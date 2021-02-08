import { fl as Fl, from as fromFlag } from './flag';
import { make as Make, data as DATA } from './gw';
import * as Utils from './utils';
import * as Msg from './message';
import * as Events from './events';
import * as Grid from './grid';
///////////////////////////////////////////////////////
// TILE EVENT
export var Flags;
(function (Flags) {
    // E_ALWAYS_FIRE = Fl(10), // Fire even if the cell is marked as having fired this turn
    Flags[Flags["E_NEXT_ALWAYS"] = Fl(0)] = "E_NEXT_ALWAYS";
    Flags[Flags["E_NEXT_EVERYWHERE"] = Fl(1)] = "E_NEXT_EVERYWHERE";
    // E_NO_REDRAW_CELL = Fl(2),
    Flags[Flags["E_TREAT_AS_BLOCKING"] = Fl(3)] = "E_TREAT_AS_BLOCKING";
    Flags[Flags["E_PERMIT_BLOCKING"] = Fl(4)] = "E_PERMIT_BLOCKING";
    Flags[Flags["E_ABORT_IF_BLOCKS_MAP"] = Fl(5)] = "E_ABORT_IF_BLOCKS_MAP";
    Flags[Flags["E_BLOCKED_BY_ITEMS"] = Fl(6)] = "E_BLOCKED_BY_ITEMS";
    Flags[Flags["E_BLOCKED_BY_ACTORS"] = Fl(7)] = "E_BLOCKED_BY_ACTORS";
    Flags[Flags["E_BLOCKED_BY_OTHER_LAYERS"] = Fl(8)] = "E_BLOCKED_BY_OTHER_LAYERS";
    Flags[Flags["E_SUPERPRIORITY"] = Fl(9)] = "E_SUPERPRIORITY";
    Flags[Flags["E_NO_MARK_FIRED"] = Fl(11)] = "E_NO_MARK_FIRED";
    // MUST_REPLACE_LAYER
    // NEEDS_EMPTY_LAYER
    // E_PROTECTED = Fl(12),
    Flags[Flags["E_SPREAD_CIRCLE"] = Fl(13)] = "E_SPREAD_CIRCLE";
    Flags[Flags["E_SPREAD_LINE"] = Fl(14)] = "E_SPREAD_LINE";
    // E_NULL_SURFACE = Fl(15), // Clear the surface layer
    // E_NULL_LIQUID = Fl(16), // Clear liquid layer
    // E_NULL_GAS = Fl(17), // Clear gas layer
    Flags[Flags["E_CLEAR_CELL"] = Fl(17)] = "E_CLEAR_CELL";
    Flags[Flags["E_EVACUATE_CREATURES"] = Fl(18)] = "E_EVACUATE_CREATURES";
    Flags[Flags["E_EVACUATE_ITEMS"] = Fl(19)] = "E_EVACUATE_ITEMS";
    Flags[Flags["E_BUILD_IN_WALLS"] = Fl(20)] = "E_BUILD_IN_WALLS";
    Flags[Flags["E_MUST_TOUCH_WALLS"] = Fl(21)] = "E_MUST_TOUCH_WALLS";
    Flags[Flags["E_NO_TOUCH_WALLS"] = Fl(22)] = "E_NO_TOUCH_WALLS";
    Flags[Flags["E_FIRED"] = Fl(23)] = "E_FIRED";
    Flags[Flags["E_ONLY_IF_EMPTY"] = Flags.E_BLOCKED_BY_ITEMS | Flags.E_BLOCKED_BY_ACTORS] = "E_ONLY_IF_EMPTY";
    // E_NULLIFY_CELL = E_NULL_SURFACE | E_NULL_LIQUID | E_NULL_GAS,
    // These should be effect types
    Flags[Flags["E_ACTIVATE_DORMANT_MONSTER"] = Fl(23)] = "E_ACTIVATE_DORMANT_MONSTER";
    Flags[Flags["E_AGGRAVATES_MONSTERS"] = Fl(24)] = "E_AGGRAVATES_MONSTERS";
    Flags[Flags["E_RESURRECT_ALLY"] = Fl(25)] = "E_RESURRECT_ALLY";
    Flags[Flags["E_EMIT_EVENT"] = Fl(26)] = "E_EMIT_EVENT";
})(Flags || (Flags = {}));
export class Effect {
    constructor(effects, next = null) {
        // if (typeof opts === 'function') {
        //     opts = {
        //         fn: opts,
        //     };
        // }
        // public tile: string | null;
        // public fn: Function | null;
        // public item: string | null;
        // public message: string | null;
        // public lightFlare: string | null;
        // public flashColor: Color.Color | null;
        // public fired: boolean;
        // public emit: string | null;
        this.map = null;
        this.ctx = {};
        this.effects = [];
        this.flags = 0;
        this.chance = 0;
        // public chance: number;
        // public volume: number;
        // public spread: number;
        // public radius: number;
        // public decrement: number;
        // public flags: number;
        // public matchTile: string | null;
        this.next = null;
        this.id = null;
        this._grid = null;
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
        if (!Array.isArray(effects))
            effects = [effects];
        this.effects = effects.slice();
        this.next = next;
    }
    get grid() {
        if (!this._grid) {
            this._grid = Grid.alloc(this.map.width, this.map.height);
        }
        return this._grid;
    }
    async fire(map, x, y, ctx = {}) {
        let didSomething = false;
        this.map = map;
        this.ctx = ctx;
        // fire all of my functions
        for (let i = 0; i < this.effects.length; ++i) {
            const eff = this.effects[i];
            didSomething = (await eff(this, x, y)) || didSomething;
        }
        // bookkeeping
        if (didSomething &&
            map.isVisible(x, y) &&
            !(this.flags & Flags.E_NO_MARK_FIRED)) {
            this.flags |= Flags.E_FIRED;
        }
        // do the next effect - if applicable
        if (this.next &&
            (didSomething || this.flags & Flags.E_NEXT_ALWAYS) &&
            !DATA.gameHasEnded) {
            let next = this.next;
            if (typeof next === 'string') {
                next = effects[next] || null;
            }
            if (!next) {
                Utils.ERROR('Unknown next effect - ' + this.next);
            }
            else if (this._grid && this.flags & Flags.E_NEXT_EVERYWHERE) {
                await this.grid.forEachAsync(async (v, i, j) => {
                    if (!v)
                        return;
                    // @ts-ignore
                    didSomething = (await next.fire(map, i, j)) || didSomething;
                });
            }
            else {
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
export function makeEffects(opts) {
    const results = [];
    Object.entries(opts).forEach(([key, value]) => {
        if (key === 'fn') {
            results.push(value);
        }
        else {
            const setup = effectTypes[key];
            if (!setup)
                return;
            const effect = setup(value);
            if (effect) {
                results.push(effect);
            }
        }
    });
    return results;
}
export const effects = {};
export function make(opts) {
    if (!opts)
        Utils.ERROR('opts required to make effect.');
    if (typeof opts === 'string') {
        const cached = effects[opts];
        if (cached)
            return cached;
        Utils.ERROR('string effect config must be id of installed effect.');
    }
    else if (typeof opts === 'function') {
        opts = { fn: opts };
    }
    // now make effects
    const fns = makeEffects(opts);
    let next = opts.next;
    if (next && typeof next !== 'string') {
        next = make(next);
    }
    const te = new Effect(fns, next);
    te.flags = fromFlag(Flags, opts.flags);
    te.chance = opts.chance || 0;
    return te;
}
Make.tileEvent = make;
export function from(opts) {
    if (typeof opts === 'string') {
        const effect = effects[opts];
        if (effect)
            return effect;
        Utils.ERROR('Unknown effect - ' + opts);
    }
    // @ts-ignore
    return opts;
}
export function install(id, effect) {
    if (!(effect instanceof Effect)) {
        effect = make(effect);
    }
    effects[id] = effect;
    if (effect)
        effect.id = id;
    return effect;
}
export function installAll(effects) {
    Object.entries(effects).forEach(([id, config]) => {
        install(id, config);
    });
}
export function resetAll() {
    Object.values(effects).forEach((e) => e.reset());
}
export const effectTypes = {};
export function installType(id, fn) {
    effectTypes[id] = fn;
}
//////////////////////////////////////////////
// EMIT
export async function effectEmit(effect, x, y) {
    if (this.emit) {
        await Events.emit(this.emit, x, y, effect);
        return true;
    }
    return false;
}
export function makeEmit(config) {
    if (typeof config !== 'string') {
        Utils.ERROR('Emit must be configured with name of event to emit');
        return null;
    }
    return effectEmit.bind({ emit: config });
}
installType('emit', makeEmit);
//////////////////////////////////////////////
// MESSAGE
export async function effectMessage(effect, x, y) {
    const map = effect.map;
    const fired = effect.flags & Flags.E_FIRED ? true : false;
    const ctx = effect.ctx;
    ctx.actor = ctx.actor || map.actorAt(x, y);
    ctx.item = ctx.item || map.itemAt(x, y);
    if (this.message && this.message.length && !fired && map.isVisible(x, y)) {
        Msg.add(this.message, effect.ctx);
        return true;
    }
    return false;
}
export function makeMessage(config) {
    if (typeof config !== 'string') {
        Utils.ERROR('Emit must be configured with name of event to emit');
        return null;
    }
    return effectMessage.bind({ message: config });
}
installType('message', makeMessage);
//# sourceMappingURL=effect.js.map