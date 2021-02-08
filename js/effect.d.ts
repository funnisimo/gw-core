import * as Types from './types';
import * as Grid from './grid';
export declare enum Flags {
    E_NEXT_ALWAYS,
    E_NEXT_EVERYWHERE,
    E_TREAT_AS_BLOCKING,
    E_PERMIT_BLOCKING,
    E_ABORT_IF_BLOCKS_MAP,
    E_BLOCKED_BY_ITEMS,
    E_BLOCKED_BY_ACTORS,
    E_BLOCKED_BY_OTHER_LAYERS,
    E_SUPERPRIORITY,
    E_NO_MARK_FIRED,
    E_SPREAD_CIRCLE,
    E_SPREAD_LINE,
    E_CLEAR_CELL,
    E_EVACUATE_CREATURES,
    E_EVACUATE_ITEMS,
    E_BUILD_IN_WALLS,
    E_MUST_TOUCH_WALLS,
    E_NO_TOUCH_WALLS,
    E_FIRED,
    E_ONLY_IF_EMPTY,
    E_ACTIVATE_DORMANT_MONSTER,
    E_AGGRAVATES_MONSTERS,
    E_RESURRECT_ALLY,
    E_EMIT_EVENT
}
export interface EffectCtx {
    actor?: Types.ActorType;
    target?: Types.ActorType;
    item?: Types.ItemType;
    layer?: number;
    force?: boolean;
}
export declare type EffectFn = (this: any, effect: Effect, x: number, y: number) => Promise<boolean> | boolean;
export declare class Effect {
    map: Types.MapType | null;
    ctx: any;
    protected effects: EffectFn[];
    flags: Flags;
    chance: number;
    next: Effect | string | null;
    id: string | null;
    protected _grid: Grid.NumGrid | null;
    constructor(effects: EffectFn | EffectFn[], next?: Effect | string | null);
    get grid(): Grid.NumGrid;
    fire(map: Types.MapType, x: number, y: number, ctx?: any): Promise<boolean>;
    reset(): void;
}
export declare function makeEffects(opts: any): EffectFn[];
export declare const effects: Record<string, Effect>;
export declare function make(opts: string | any): Effect;
export declare function from(opts: Effect | string): Effect;
export declare function install(id: string, effect: Effect | any): any;
export declare function installAll(effects: Record<string, Effect | any>): void;
export declare function resetAll(): void;
export declare type EffectMakeFn = (config: any) => EffectFn | null;
export declare const effectTypes: Record<string, EffectMakeFn>;
export declare function installType(id: string, fn: EffectMakeFn): void;
export declare function effectEmit(this: any, effect: Effect, x: number, y: number): Promise<boolean>;
export declare function makeEmit(config: any): EffectFn | null;
export declare function effectMessage(this: any, effect: Effect, x: number, y: number): Promise<boolean>;
export declare function makeMessage(config: any): EffectFn | null;
