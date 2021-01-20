import { Random } from "./random";
export declare type RangeBase = Range | string | number[] | number;
export declare class Range {
    lo: number;
    hi: number;
    clumps: number;
    private _rng;
    constructor(lower: number, upper?: number, clumps?: number, rng?: Random);
    value(): number;
    copy(other: Range): this;
    toString(): string;
}
export declare function make(config: RangeBase | null, rng?: Random): Range;
export declare const from: typeof make;
