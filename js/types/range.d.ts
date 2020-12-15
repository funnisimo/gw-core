import { Random } from "./random";
export declare class Range {
    lo: number;
    hi: number;
    clumps: number;
    private _rng;
    constructor(lower: number | Range | number[], upper?: number, clumps?: number, rng?: Random);
    value(): number;
    toString(): string;
}
export declare function make(config: Range | string | number[] | null, rng?: Random): Range;
