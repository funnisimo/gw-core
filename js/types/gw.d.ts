export * as utils from './utils';
export * as range from './range';
export * as flag from './flag';
export * as grid from './grid';
export { flags } from './flag';
export { cosmetic, random, Random } from './random';
import * as Random from './random';
export interface GWConfig {
    random: Random.RandomConfig;
}
export declare function configure(config: Partial<GWConfig>): void;
export declare var data: {};
