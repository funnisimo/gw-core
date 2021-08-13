import * as Grid from '../grid';
import * as Flag from '../flag';
import * as Map from '../map';

export interface EffectInfo {
    flags: number;
    chance: number;
    next: EffectInfo | string | null;
    id: string;

    [id: string]: any; // other config from subtypes
}

export interface EffectCtx {
    // actor?: Types.ActorType | null;
    // target?: Types.ActorType | null;
    // item?: Types.ItemType | null;
    depth?: number;
    force?: boolean;
    grid: Grid.NumGrid;

    [id: string]: any; // other config from subtypes
}

export interface EffectConfig {
    flags: Flag.FlagBase;
    chance: number;
    next: Partial<EffectConfig> | string | null;

    [id: string]: any; // other config from subtypes
}

export type EffectBase = Partial<EffectConfig> | Function;

export interface EffectHandler {
    make: (src: Partial<EffectConfig>, dest: EffectInfo) => boolean;
    fire: (
        config: EffectInfo,
        map: Map.Map,
        x: number,
        y: number,
        ctx: EffectCtx
    ) => boolean | Promise<boolean>;
}
