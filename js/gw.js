import * as utils_1 from './utils';
export { utils_1 as utils };
import * as range_1 from './range';
export { range_1 as range };
import * as flag_1 from './flag';
export { flag_1 as flag };
import * as grid_1 from './grid';
export { grid_1 as grid };
export { flags } from './flag';
export { cosmetic, random, Random } from './random';
import * as Random from './random';
export function configure(config) {
    if (config.random) {
        Random.configure(config.random);
    }
}
export var data = {};
//# sourceMappingURL=gw.js.map