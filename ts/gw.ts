
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

export function configure(config:Partial<GWConfig>) {
    if (config.random) {
        Random.configure(config.random);
    }
}

export var types = {
    Random: Random.Random,
    Range: Range.Range,
    Grid: Grid.Grid,
}
