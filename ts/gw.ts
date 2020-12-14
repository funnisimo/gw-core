
export * as utils from './utils';
export * as range from './range';
export { cosmetic, random } from './random';

import * as Random from './random';
import * as Range from './range';

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
}
