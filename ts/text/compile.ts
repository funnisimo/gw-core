import * as Config from './config.js';
import * as OBJECT from '../object.js';
import * as UTILS from './utils.js';

// export type Args = any;

export type Template = (view: Config.View | string) => string;

export type FieldFn = (view: Config.View) => string;

export interface CompileOptions {
    field?: string;
    fieldEnd?: string;
    debug?: boolean;
}

export function fieldSplit(
    template: string,
    _opts: CompileOptions = {}
): string[] {
    // const FS = opts.field || Config.options.field;
    // const FE = opts.fieldEnd || Config.options.fieldEnd;

    const output: string[] = [];
    let inside = false;
    let start = 0;
    let hasEscape = false;

    let index = 0;
    while (index < template.length) {
        const ch = template.charAt(index);

        if (inside) {
            if (ch === '}') {
                if (template.charAt(index + 1) !== '}') {
                    throw new Error('Templates cannot contain }');
                }

                const snipet = template.slice(start, index);
                output.push(snipet);
                ++index;
                inside = false;
                start = index + 1;
            }
        } else {
            if (ch === '\\') {
                if (template.charAt(index + 1) === '{') {
                    ++index;
                    hasEscape = true;
                }
            } else if (ch === '{') {
                if (template.charAt(index + 1) === '{') {
                    while (template.charAt(index + 1) === '{') {
                        ++index;
                    }
                    inside = true;
                    let snipet = template.slice(start, index - 1);
                    if (hasEscape) {
                        snipet = snipet.replace(/\\\{/g, '{');
                    }
                    output.push(snipet);
                    start = index + 1;
                    hasEscape = false;
                }
            }
        }

        ++index;
    }

    if (start !== template.length) {
        let snipet = template.slice(start);
        if (hasEscape) {
            snipet = snipet.replace(/\\\{/g, '{');
        }
        output.push(snipet);
    }

    return output;
}

export function compile(template: string, opts: CompileOptions = {}): Template {
    const F = opts.field || Config.options.field;

    const parts = fieldSplit(template);
    const sections = parts.map((part, i) => {
        if (i % 2 == 0) return textSegment(part);
        if (part.length == 0) return textSegment(F);
        return makeVariable(part, opts);
    });

    return function (view: Config.View | string = {}) {
        if (typeof view === 'string') {
            view = { value: view };
        }
        return sections.map((f) => f(view as Config.View)).join('');
    };
}

export function apply(template: string, view: Config.View | string = {}) {
    const fn = compile(template);
    const result = fn(view);
    return result;
}

export function textSegment(value: string) {
    return () => value;
}

// export function baseValue(name: string, debug = false): FieldFn {
//     return function (view: Config.View) {
//         let h = Config.helpers[name];
//         if (h) {
//             return h(name, view);
//         }

//         const v = view[name];
//         if (v !== undefined) return v;

//         h = debug ? Config.helpers.debug : Config.helpers.default;
//         return h(name, view);
//     };
// }

// export function fieldValue(
//     name: string,
//     source: FieldFn,
//     debug = false
// ): FieldFn {
//     const helper = debug ? Config.helpers.debug : Config.helpers.default;
//     return function (view: Config.View) {
//         const obj = source(view);
//         if (!obj) return helper(name, view, obj);
//         const value = obj[name];
//         if (value === undefined) return helper(name, view, obj);
//         return value;
//     };
// }

// export function helperValue(
//     name: string,
//     source: FieldFn,
//     debug = false
// ): FieldFn {
//     const helper =
//         Config.helpers[name] ||
//         (debug ? Config.helpers.debug : Config.helpers.default);

//     return function (view: Config.View) {
//         const base = source(view);
//         return helper(name, view, base);
//     };
// }

export function stringFormat(format: string, source: FieldFn): FieldFn {
    const data = /%(-?\d*)s/.exec(format) || [];
    const length = Number.parseInt(data[1] || '0');

    return function (view: Config.View) {
        let text = '' + source(view);
        if (length < 0) {
            text = text.padEnd(-length);
        } else if (length) {
            text = text.padStart(length);
        }
        return text;
    };
}

export function intFormat(format: string, source: FieldFn): FieldFn {
    const data = /%([\+-]*)(\d*)d/.exec(format) || ['', '', '0'];
    let length = Number.parseInt(data[2] || '0');
    const wantSign = data[1].includes('+');
    const left = data[1].includes('-');

    return function (view: Config.View) {
        const value = Number.parseInt(source(view) || '0');
        let text = '' + value;
        if (value > 0 && wantSign) {
            text = '+' + text;
        }
        if (length && left) {
            return text.padEnd(length);
        } else if (length) {
            return text.padStart(length);
        }
        return text;
    };
}

export function floatFormat(format: string, source: FieldFn): FieldFn {
    const data = /%([\+-]*)(\d*)(\.(\d+))?f/.exec(format) || ['', '', '0'];
    let length = Number.parseInt(data[2] || '0');
    const wantSign = data[1].includes('+');
    const left = data[1].includes('-');
    const fixed = Number.parseInt(data[4]) || 0;

    return function (view: Config.View) {
        const value = Number.parseFloat(source(view) || '0');
        let text;
        if (fixed) {
            text = value.toFixed(fixed);
        } else {
            text = '' + value;
        }
        if (value > 0 && wantSign) {
            text = '+' + text;
        }
        if (length && left) {
            return text.padEnd(length);
        } else if (length) {
            return text.padStart(length);
        }
        return text;
    };
}

export function makeVariable(
    pattern: string,
    _opts: CompileOptions = {}
): FieldFn {
    let format = '';

    const formatStart = pattern.indexOf('%');
    if (formatStart > 0) {
        format = pattern.substring(formatStart);
        pattern = pattern.substring(0, formatStart);
    }

    const parts = UTILS.splitArgs(pattern);
    let name = 'default';
    if (parts[0] in Config.helpers) {
        name = parts[0];
        parts.shift();
    }

    const helper = Config.helpers[name];
    function base(this: Config.HelperObj, view: Config.View) {
        return helper.call(this, name, view, parts);
    }
    const valueFn = base.bind({ get: OBJECT.getPath });

    if (format.length) {
        if (format.endsWith('d')) {
            return intFormat(format, valueFn);
        } else if (format.endsWith('f')) {
            return floatFormat(format, valueFn);
        } else {
            return stringFormat(format, valueFn);
        }
    }
    return valueFn || (() => '!!!');

    // const data =
    //     /((\w+) )?(\w+)(\.(\w+))?(%[\+\.\-\d]*[dsf])?/.exec(pattern) || [];
    // const helper = data[2];
    // const base = data[3];
    // const field = data[5];
    // const format = data[6];
    // let result = baseValue(base, opts.debug);
    // if (field && field.length) {
    //     result = fieldValue(field, result, opts.debug);
    // }
    // if (helper && helper.length) {
    //     result = helperValue(helper, result, opts.debug);
    // }
    // if (format && format.length) {
    //     if (format.endsWith('s')) {
    //         result = stringFormat(format, result);
    //     } else if (format.endsWith('d')) {
    //         result = intFormat(format, result);
    //     } else {
    //         result = floatFormat(format, result);
    //     }
    // }
    // return result;
}
