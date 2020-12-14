import * as utils_1 from './utils';
export { utils_1 as utils };
import * as range_1 from './range';
export { range_1 as range };
export { cosmetic, random } from './random';
import * as Random from './random';
import * as Range from './range';
export function configure(config) {
    if (config.random) {
        Random.configure(config.random);
    }
}
export var types = {
    Random: Random.Random,
    Range: Range.Range,
};
//# sourceMappingURL=gw.js.map