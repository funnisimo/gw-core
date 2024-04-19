import type { Color, ColorBase } from './color/index.js';
// import { LightType } from './light/types.js';
// import { Chainable } from './utils/chain.js';

// import { CellType, MapType } from './map/types.js';
// export { CellType, MapType };

export type Loc = [number, number];
export interface XY {
    x: number;
    y: number;
}
export type AnyPoint = Loc | XY;

export interface Size {
    width: number;
    height: number;
}

export interface SpriteData {
    readonly ch?: string | null;
    readonly fg?: Color | ColorBase;
    readonly bg?: Color | ColorBase;
    readonly opacity?: number;
}

export type EachCb<T> = (t: T) => any;

export type RandomFunction = () => number;
export type SeedFunction = (seed?: number) => RandomFunction;

export interface RandomConfig {
    make: SeedFunction;
}

export type WeightedArray = number[];

export interface WeightedObject {
    [key: string]: number;
}
