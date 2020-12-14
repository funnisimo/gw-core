export * as utils from './utils';
export * as range from './range';
export * as flag from './flag';
export * as grid from './grid';
export { flags } from './flag';
export { cosmetic, random } from './random';
import * as Random from './random';
import * as Range from './range';
import * as Grid from './grid';
export interface GWConfig {
    random: Partial<Random.RandomConfig>;
}
export declare function configure(config: Partial<GWConfig>): void;
export declare var types: {
    Random: typeof Random.Random;
    Range: typeof Range.Range;
    Grid: typeof Grid.Grid;
};
