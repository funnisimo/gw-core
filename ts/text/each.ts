import { NOOP } from '../utils';
import { ColorBase } from '../color';
import * as Config from './config';

interface Colors {
    fg: ColorBase | null;
    bg: ColorBase | null;
}

type ColorFunction = (colors: Colors) => void;

type EachFn = (ch: string, fg: any, bg: any, i: number, n: number) => void;

type EachWordFn = (ch: string, fg: any, bg: any, prefix: string) => void;

export interface EachOptions {
    fg?: ColorBase;
    bg?: ColorBase;
    eachColor?: ColorFunction;
}

export function eachChar(text: string, fn: EachFn, opts: EachOptions = {}) {
    if (text === null || text === undefined) return;
    if (!fn) return;
    text = '' + text; // force string
    if (!text.length) return;

    const colorFn = opts.eachColor || NOOP;

    const fg = opts.fg || Config.options.defaultFg;
    const bg = opts.bg || Config.options.defaultBg;

    const ctx = {
        fg,
        bg,
    };

    colorFn(ctx);

    const priorCtx = Object.assign({}, ctx);

    let len = 0;
    let inside = false;
    let inline = false;
    let index = 0;
    let colorText = '';

    while (index < text.length) {
        const ch = text.charAt(index);
        if (inline) {
            if (ch === '}') {
                inline = false;
                inside = false;
                Object.assign(ctx, priorCtx);
                colorFn(ctx);
            } else {
                fn(ch, ctx.fg, ctx.bg, len, index);
                ++len;
            }
        } else if (inside) {
            if (ch === ' ') {
                inline = true;
                Object.assign(priorCtx, ctx);

                const colors = colorText.split(':');
                if (colors[0].length) {
                    ctx.fg = colors[0];
                }
                if (colors[1]) {
                    ctx.bg = colors[1];
                }
                colorFn(ctx);
                colorText = '';
            } else if (ch === '}') {
                inside = false;
                const colors = colorText.split(':');
                if (colors[0].length) {
                    ctx.fg = colors[0];
                }
                if (colors[1]) {
                    ctx.bg = colors[1];
                }
                colorFn(ctx);
                colorText = '';
            } else {
                colorText += ch;
            }
        } else if (ch === '#') {
            if (text.charAt(index + 1) === '{') {
                if (text.charAt(index + 2) === '}') {
                    index += 2;
                    ctx.fg = fg;
                    ctx.bg = bg;
                    colorFn(ctx);
                } else {
                    inside = true;
                    index += 1;
                }
            } else {
                fn(ch, ctx.fg, ctx.bg, len, index);
                ++len;
            }
        } else if (ch === '\\') {
            index += 1; // skip next char
            const ch = text.charAt(index);
            fn(ch, ctx.fg, ctx.bg, len, index);
            ++len;
        } else {
            fn(ch, ctx.fg, ctx.bg, len, index);
            ++len;
        }
        ++index;
    }

    if (inline) {
        console.warn('Ended text without ending inline color!');
    }
}

export function eachWord(text: string, fn: EachWordFn, opts: EachOptions = {}) {
    let currentWord = '';
    let fg = '';
    let bg = '';
    let prefix = '';

    eachChar(
        text,
        (ch, fg0, bg0) => {
            if (fg0 !== fg || bg0 !== bg) {
                if (currentWord.length) {
                    fn(currentWord, fg, bg, prefix);
                    currentWord = '';
                    prefix = '';
                }

                fg = fg0;
                bg = bg0;
            }

            if (ch === ' ') {
                if (currentWord.length) {
                    fn(currentWord, fg, bg, prefix);
                    currentWord = '';
                    prefix = '';
                }
                prefix += ' ';
            } else if (ch === '\n') {
                if (currentWord.length) {
                    fn(currentWord, fg, bg, prefix);
                    currentWord = '';
                    prefix = '';
                }
                fn('\n', fg, bg, prefix);
                prefix = '';
            } else if (ch === '-') {
                currentWord += ch;
                if (currentWord.length > 3) {
                    fn(currentWord, fg, bg, prefix);
                    currentWord = '';
                    prefix = '';
                }
            } else {
                currentWord += ch;
            }
        },
        opts
    );

    if (currentWord) {
        fn(currentWord, fg, bg, prefix);
    }
}
