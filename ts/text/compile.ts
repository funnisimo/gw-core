import * as Config from './config';

export type Args = any;

export type Template = (args: Args) => string;

export type FieldFn = (args: Args) => any;

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

    return function (args: Args | string = {}) {
        if (typeof args === 'string') {
            args = { value: args };
        }
        return sections.map((f) => f(args as Args)).join('');
    };
}

export function apply(template: string, args: Args | string = {}) {
    const fn = compile(template);
    const result = fn(args);
    return result;
}

export function textSegment(value: string) {
    return () => value;
}

export function baseValue(name: string, debug = false): FieldFn {
    return function (args: Args) {
        let h = Config.helpers[name];
        if (h) {
            return h(name, args);
        }

        const v = args[name];
        if (v !== undefined) return v;

        h = debug ? Config.helpers.debug : Config.helpers.default;
        return h(name, args);
    };
}

export function fieldValue(
    name: string,
    source: FieldFn,
    debug = false
): FieldFn {
    const helper = debug ? Config.helpers.debug : Config.helpers.default;
    return function (args: Args) {
        const obj = source(args);
        if (!obj) return helper(name, args, obj);
        const value = obj[name];
        if (value === undefined) return helper(name, args, obj);
        return value;
    };
}

export function helperValue(
    name: string,
    source: FieldFn,
    debug = false
): FieldFn {
    const helper =
        Config.helpers[name] ||
        (debug ? Config.helpers.debug : Config.helpers.default);

    return function (args: Args) {
        const base = source(args);
        return helper(name, args, base);
    };
}

export function stringFormat(format: string, source: FieldFn): FieldFn {
    const data = /%(-?\d*)s/.exec(format) || [];
    const length = Number.parseInt(data[1] || '0');

    return function (args: Args) {
        let text = '' + source(args);
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

    return function (args: Args) {
        const value = Number.parseInt(source(args) || 0);
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

    return function (args: Args) {
        const value = Number.parseFloat(source(args) || 0);
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
    opts: CompileOptions = {}
): FieldFn {
    const data =
        /((\w+) )?(\w+)(\.(\w+))?(%[\+\.\-\d]*[dsf])?/.exec(pattern) || [];
    const helper = data[2];
    const base = data[3];
    const field = data[5];
    const format = data[6];

    let result = baseValue(base, opts.debug);
    if (field && field.length) {
        result = fieldValue(field, result, opts.debug);
    }
    if (helper && helper.length) {
        result = helperValue(helper, result, opts.debug);
    }
    if (format && format.length) {
        if (format.endsWith('s')) {
            result = stringFormat(format, result);
        } else if (format.endsWith('d')) {
            result = intFormat(format, result);
        } else {
            result = floatFormat(format, result);
        }
    }

    return result;
}
