import * as Config from './config';

export function length(text: string) {
    if (!text || text.length == 0) return 0;

    let len = 0;
    const CS = Config.options.colorStart;
    const CE = Config.options.colorEnd;

    for (let i = 0; i < text.length; ++i) {
        const ch = text[i];
        if (ch == CS) {
            const end = text.indexOf(CS, i + 1);
            i = end;
        } else if (ch == CE) {
            // skip
        } else {
            ++len;
        }
    }
    return len;
}

let inColor = false;
export function advanceChars(text: string, start: number, count: number) {
    const CS = Config.options.colorStart;
    const CE = Config.options.colorEnd;

    inColor = false;
    let i = start;
    while (count > 0 && i < text.length) {
        const ch = text[i];
        if (ch === CS) {
            ++i;
            if (text[i] === CS) {
                --count;
            } else {
                while (text[i] !== CS) ++i;
                inColor = true;
            }
            ++i;
        } else if (ch === CE) {
            if (text[i + 1] === CE) {
                --count;
                ++i;
            } else {
                inColor = false;
            }
            ++i;
        } else {
            --count;
            ++i;
        }
    }
    return i;
}

export function firstChar(text: string) {
    const CS = Config.options.colorStart;
    const CE = Config.options.colorEnd;

    let i = 0;
    while (i < text.length) {
        const ch = text[i];
        if (ch === CS) {
            if (text[i + 1] === CS) return CS;
            ++i;
            while (text[i] !== CS) ++i;
            ++i;
        } else if (ch === CE) {
            if (text[i + 1] === CE) return CE;
            ++i;
        } else {
            return ch;
        }
    }
    return null;
}

export function padStart(text: string, width: number, pad: string = ' ') {
    const len = length(text);
    if (len >= width) return text;
    const colorLen = text.length - len;
    return text.padStart(width + colorLen, pad);
}

export function padEnd(text: string, width: number, pad: string = ' ') {
    const len = length(text);
    if (len >= width) return text;
    const colorLen = text.length - len;
    return text.padEnd(width + colorLen, pad);
}

export function center(text: string, width: number, pad: string = ' ') {
    const rawLen = text.length;
    const len = length(text);
    const padLen = width - len;
    if (padLen <= 0) return text;

    const left = Math.floor(padLen / 2);

    return text.padStart(rawLen + left, pad).padEnd(rawLen + padLen, pad);
}

export function truncate(text: string, width: number): string {
    const len = length(text);
    if (len <= width) return text;

    const index = advanceChars(text, 0, width);
    if (!inColor) return text.substring(0, index);

    const CE = Config.options.colorEnd;
    return text.substring(0, index) + CE;
}

export function capitalize(text: string) {
    const CS = Config.options.colorStart;
    const CE = Config.options.colorEnd;
    let i = 0;
    while (i < text.length) {
        const ch = text[i];
        if (ch == CS) {
            ++i;
            while (text[i] != CS && i < text.length) {
                ++i;
            }
            ++i;
        } else if (ch == CE) {
            ++i;
            while (text[i] == CE && i < text.length) {
                ++i;
            }
        } else if (/[A-Za-z]/.test(ch)) {
            return (
                text.substring(0, i) + ch.toUpperCase() + text.substring(i + 1)
            );
        } else {
            ++i;
        }
    }
    return text;
}

export function removeColors(text: string) {
    const CS = Config.options.colorStart;
    const CE = Config.options.colorEnd;

    let out = '';
    let start = 0;
    for (let i = 0; i < text.length; ++i) {
        const k = text[i];
        if (k === CS) {
            if (text[i + 1] == CS) {
                ++i;
                continue;
            }
            out += text.substring(start, i);
            ++i;
            while (text[i] != CS && i < text.length) {
                ++i;
            }
            start = i + 1;
        } else if (k === CE) {
            if (text[i + 1] == CE) {
                ++i;
                continue;
            }
            out += text.substring(start, i);
            start = i + 1;
        }
    }
    if (start == 0) return text;
    out += text.substring(start);
    return out;
}

export function spliceRaw(
    msg: string,
    begin: number,
    deleteLength: number,
    add = ''
) {
    const maxLen = msg.length;
    if (begin >= maxLen) return msg;
    const preText = msg.substring(0, begin);
    if (begin + deleteLength >= maxLen) {
        return preText;
    }
    const postText = msg.substring(begin + deleteLength);
    return preText + add + postText;
}
