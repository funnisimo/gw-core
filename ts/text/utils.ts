import { TRUE } from '../utils';

export function length(text: string) {
    if (!text || text.length == 0) return 0;

    let len = 0;
    let inside = false;
    let inline = false;
    for (let index = 0; index < text.length; ++index) {
        const ch = text.charAt(index);
        if (inline) {
            if (ch === '}') {
                inline = false;
                inside = false;
            } else {
                len += 1;
            }
        } else if (inside) {
            if (ch === ' ') {
                inline = true;
            } else if (ch === '}') {
                inside = false;
            }
        } else if (ch === '#') {
            if (text.charAt(index + 1) === '{') {
                inside = true;
                index += 1;
            } else {
                len += 1;
            }
        } else if (ch === '\\') {
            if (text.charAt(index + 1) === '#') {
                index += 1; // skip next char
            }
            len += 1;
        } else {
            len += 1;
        }
    }

    return len;
}

// let inColor = false;
export function advanceChars(text: string, start: number, count: number) {
    let len = 0;
    let inside = false;
    let inline = false;
    let index = start || 0;

    while (len < count) {
        const ch = text.charAt(index);
        if (inline) {
            if (ch === '}') {
                inline = false;
                inside = false;
            } else {
                len += 1;
            }
        } else if (inside) {
            if (ch === ' ') {
                inline = true;
            } else if (ch === '}') {
                inside = false;
            }
        } else if (ch === '#') {
            if (text.charAt(index + 1) === '{') {
                inside = true;
                index += 1;
            } else {
                len += 1;
            }
        } else if (ch === '\\') {
            if (text.charAt(index + 1) === '#') {
                index += 1; // skip next char
            }
            len += 1;
        } else {
            len += 1;
        }
        ++index;
    }

    return index;
}

export function findChar(
    text: string,
    matchFn: (ch: string, index: number) => boolean,
    start = 0
): number {
    let inside = false;
    let inline = false;
    let index = start;

    while (index < text.length) {
        let ch = text.charAt(index);
        if (inline) {
            if (ch === '}') {
                inline = false;
                inside = false;
            } else {
                if (matchFn(ch, index)) return index;
            }
        } else if (inside) {
            if (ch === ' ') {
                inline = true;
            } else if (ch === '}') {
                inside = false;
            }
        } else if (ch === '#') {
            if (text.charAt(index + 1) === '{') {
                inside = true;
                index += 1;
            } else {
                if (matchFn(ch, index)) return index;
            }
        } else if (ch === '\\') {
            if (text.charAt(index + 1) === '#') {
                index += 1; // skip next char
                ch = text.charAt(index);
            }
            if (matchFn(ch, index)) return index;
        } else {
            if (matchFn(ch, index)) return index;
        }
        ++index;
    }

    return -1;
}

export function firstChar(text: string) {
    const index = findChar(text, TRUE);
    if (index < 0) return null;
    return text.charAt(index);
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
    let len = 0;
    let inside = false;
    let inline = false;
    let index = 0;
    let colorCount = 0;

    while (len < width) {
        const ch = text.charAt(index);
        if (inline) {
            if (ch === '}') {
                inline = false;
                inside = false;
                colorCount -= 1;
            } else {
                len += 1;
            }
        } else if (inside) {
            if (ch === ' ') {
                inline = true;
            } else if (ch === '}') {
                inside = false;
            }
        } else if (ch === '#') {
            if (text.charAt(index + 1) === '{') {
                if (text.charAt(index + 2) === '}') {
                    index += 2;
                    colorCount = 0;
                } else {
                    inside = true;
                    index += 1;
                    colorCount += 1;
                }
            } else {
                len += 1;
            }
        } else if (ch === '\\') {
            if (text.charAt(index + 1) === '#') {
                index += 1; // skip next char
            }
            len += 1;
        } else {
            len += 1;
        }
        ++index;
    }

    if (inline) {
        return text.substring(0, index) + '}' + (colorCount > 1 ? '#{}' : '');
    }

    return text.substring(0, index) + (colorCount ? '#{}' : '');
}

export function capitalize(text: string) {
    // TODO - better test for first letter
    const i = findChar(text, (ch) => ch !== ' ');
    if (i < 0) return text;

    const ch = text.charAt(i);
    return text.substring(0, i) + ch.toUpperCase() + text.substring(i + 1);
}

export function removeColors(text: string) {
    let out = '';
    let inside = false;
    let inline = false;
    let index = 0;

    while (index < text.length) {
        let ch = text.charAt(index);
        if (inline) {
            if (ch === '}') {
                inline = false;
                inside = false;
            } else {
                out += ch;
            }
        } else if (inside) {
            if (ch === ' ') {
                inline = true;
            } else if (ch === '}') {
                inside = false;
            }
        } else if (ch === '#') {
            if (text.charAt(index + 1) === '{') {
                inside = true;
                index += 1;
            } else {
                out += ch;
            }
        } else if (ch === '\\') {
            if (text.charAt(index + 1) === '#') {
                out += ch;
                index += 1; // skip next char
                ch = text.charAt(index);
            }
            out += ch;
        } else {
            out += ch;
        }
        ++index;
    }

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

// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
export function hash(str: string): number {
    let hash = 0;
    const len = str.length;
    for (let i = 0; i < len; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export function splitArgs(text: string): string[] {
    const output: string[] = [];

    let index = 0;
    let start = 0;
    let insideQuote = false;
    let insideSingle = false;

    while (index < text.length) {
        const ch = text.charAt(index);
        if (insideQuote) {
            if (ch === '"') {
                output.push(text.substring(start, index));
                start = index + 1;
                insideSingle = false;
                insideQuote = false;
            }
        } else if (insideSingle) {
            if (ch === "'") {
                output.push(text.substring(start, index));
                start = index + 1;
                insideSingle = false;
                insideQuote = false;
            }
        } else if (ch === ' ') {
            if (start !== index) {
                output.push(text.substring(start, index));
            }
            start = index + 1;
        } else if (ch === '"') {
            start = index + 1;
            insideQuote = true;
        } else if (ch === "'") {
            start = index + 1;
            insideSingle = true;
        }

        ++index;
    }

    if (start === 0) {
        output.push(text);
    } else if (start < index) {
        output.push(text.substring(start));
    }

    return output;
}
