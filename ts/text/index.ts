import { compile, apply, Template, CompileOptions } from './compile';
import { eachChar, EachOptions } from './each';
import {
    length,
    padStart,
    padEnd,
    center,
    capitalize,
    removeColors,
    firstChar,
    spliceRaw,
    truncate,
    hash,
} from './utils';
import { wordWrap, splitIntoLines } from './lines';

import { addHelper, options, Align, VAlign } from './config';

interface Options {
    fg?: any;
    bg?: any;
    colorStart?: string;
    colorEnd?: string;
    field?: string;
}

function configure(opts: Options = {}) {
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

export {
    compile,
    apply,
    eachChar,
    length,
    padStart,
    padEnd,
    center,
    firstChar,
    capitalize,
    removeColors,
    wordWrap,
    splitIntoLines,
    configure,
    addHelper,
    options,
    Template,
    spliceRaw,
    truncate,
    CompileOptions,
    EachOptions,
    Align,
    VAlign,
    hash,
};
