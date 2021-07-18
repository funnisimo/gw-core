export interface EffectInfo {
    flags: number;
    chance: number;
    next: EffectInfo | string | null;
    id: string;

    [id: string]: any; // other config from subtypes
}
