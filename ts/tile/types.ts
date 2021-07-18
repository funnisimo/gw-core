import * as ObjectTypes from '../gameObject/types';
import { EffectInfo } from '../effect/types';
import { ColorBase } from '../color';

export interface TileFlags extends ObjectTypes.ObjectFlags {
    readonly tile: number;
    readonly tileMech: number;
}

export interface NameConfig {
    article?: boolean | string;
    color?: boolean | string | ColorBase;
}

export interface TileType extends ObjectTypes.ObjectType {
    readonly id: string;
    readonly index: number;
    readonly flags: TileFlags;

    readonly dissipate: number;
    readonly effects: Record<string, string | EffectInfo>;

    hasObjectFlag(flag: number): boolean;
    hasTileFlag(flag: number): boolean;
    hasTileMechFlag(flag: number): boolean;

    hasAllObjectFlags(flag: number): boolean;
    hasAllTileFlags(flag: number): boolean;
    hasAllTileMechFlags(flag: number): boolean;

    hasEffect(name: string): boolean;

    getName(): string;
    getName(config: NameConfig): string;
    getName(article: string): string;
    getName(article: boolean): string;

    getDescription(): string;
    getFlavor(): string;
}
