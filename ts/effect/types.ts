import * as Grid from '../grid';
import * as Flag from '../flag';

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
