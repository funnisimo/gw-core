export { compile, apply, Template, CompileOptions } from './compile';
export { eachChar, EachOptions } from './each';
export * from './utils';
export { wordWrap, splitIntoLines } from './lines';
export * from './tensable';

export {
    addHelper,
    options,
    Align,
    VAlign,
    View,
    HelperFn,
    HelperObj,
} from './config';

interface Options {
    fg?: any;
    bg?: any;
    colorStart?: string;
    colorEnd?: string;
    field?: string;
}

import { options } from './config';

export function configure(opts: Options = {}) {
    if (opts.fg !== undefined) {
        options.defaultFg = opts.fg;
    }
    if (opts.bg !== undefined) {
        options.defaultBg = opts.bg;
    }
    if (opts.colorStart) {
        options.colorStart = opts.colorStart;
    }
    if (opts.colorEnd) {
        options.colorEnd = opts.colorEnd;
    }
    if (opts.field) {
        options.field = opts.field;
    }
}
