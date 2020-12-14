import { BasicObject } from './utils';
export declare type RandomFunction = () => number;
export declare type SeedFunction = (seed?: number) => RandomFunction;
export interface RandomConfig {
    make: SeedFunction;
}
export declare function configure(opts: Partial<RandomConfig>): void;
export declare type WeightedArray = number[];
export interface WeightedObject {
    [key: string]: number;
}
export declare class Random {
    private _fn;
    constructor();
    seed(val?: number): void;
    value(): number;
    float(): number;
    number(max?: number): number;
    int(max?: number): number;
    range(lo: number, hi: number): number;
    dice(count: number, sides: number, addend?: number): number;
    weighted(weights: WeightedArray | WeightedObject): string | number;
    item(list: any[]): any;
    key(obj: BasicObject): any;
    shuffle(list: any[], fromIndex?: number, toIndex?: number): any[];
    sequence(n: number): any[];
    chance(percent: number, outOf?: number): boolean;
    clumped(lo: number, hi: number, clumps: number): number;
}
export declare const random: Random;
export declare const cosmetic: Random;
