// import { Color } from '../color';
// import * as Utils from './utils';
import { eachWord } from './each.js';
import * as UTILS from '../utils.js';

export interface WrapOptions {
    hyphenate?: number | boolean;
    indent?: number;
}

export function wordWrap(
    text: string,
    lineWidth: number,
    opts: WrapOptions = {}
): string {
    // let inside = false;
    // let inline = false;

    if (lineWidth < 5) return text;

    // hyphenate is the wordlen needed to hyphenate
    // smaller words are not hyphenated
    let hyphenLen = lineWidth;
    if (opts.hyphenate) {
        if (opts.hyphenate === true) {
            opts.hyphenate = Math.floor(lineWidth / 2);
        }
        hyphenLen = UTILS.clamp(opts.hyphenate, 6, lineWidth + 1);
    }

    opts.indent = opts.indent || 0;
    const indent = ' '.repeat(opts.indent);

    let output = '';

    let lastFg: null | string = null;
    let lastBg: null | string = null;

    let lineLeft = lineWidth;
    lineWidth -= opts.indent;

    eachWord(text, (word, fg, bg, prefix) => {
        let totalLen = prefix.length + word.length;

        // console.log('word', word, lineLen, newLen);
        if (totalLen > lineLeft && word.length > hyphenLen) {
            const parts = splitWord(word, lineWidth, lineLeft - prefix.length);

            if (parts[0].length === 0) {
                // line doesn't have enough space left, end it
                output += '\n';
                if (fg || bg) {
                    output += `#{${fg ? fg : ''}${bg ? ':' + bg : ''}}`;
                }

                lineLeft = lineWidth;
                parts.shift();
            } else {
                output += prefix;
                lineLeft -= prefix.length;
            }

            while (parts.length > 1) {
                output += parts.shift() + '-\n';
                if (fg || bg) {
                    output += `#{${fg ? fg : ''}${bg ? ':' + bg : ''}}`;
                }
                output += indent;
            }

            output += parts[0];
            lineLeft = lineWidth - parts[0].length - indent.length;
            return;
        }

        if (word === '\n' || totalLen > lineLeft) {
            output += '\n';
            // if (fg || bg || lastFg !== fg || lastBg !== bg) {
            //     output += `#{${fg ? fg : ''}${bg ? ':' + bg : ''}}`;
            // }
            // lastFg = fg;
            // lastBg = bg;

            if (fg || bg) {
                lastFg = 'INVALID';
                lastBg = 'INVALID';
            }
            lineLeft = lineWidth;
            output += indent;
            lineLeft -= indent.length;
            if (word === '\n') return;
            // lineLeft -= word.length;
            prefix = '';
        }

        if (prefix.length) {
            output += prefix;
            lineLeft -= prefix.length;
        }

        if (fg !== lastFg || bg !== lastBg) {
            lastFg = fg;
            lastBg = bg;
            output += `#{${fg ? fg : ''}${bg ? ':' + bg : ''}}`;
        }

        lineLeft -= word.length;
        output += word;
    });

    return output;
}

export function splitWord(
    word: string,
    lineWidth: number,
    firstWidth?: number
): string[] {
    let index = 0;
    let output: string[] = [];
    let spaceLeftOnLine = firstWidth || lineWidth;

    while (index < word.length) {
        const wordWidth = word.length - index;

        // do not need to hyphenate
        if (spaceLeftOnLine >= wordWidth) {
            output.push(word.substring(index));
            return output;
        }

        // not much room left
        if (spaceLeftOnLine < 4) {
            spaceLeftOnLine = lineWidth;
            output.push(''); // need to fill first line
        }

        // if will fit on this line and next...
        if (wordWidth < spaceLeftOnLine + lineWidth) {
            output.push(word.substring(index, index + spaceLeftOnLine - 1));
            output.push(word.substring(index + spaceLeftOnLine - 1));
            return output;
        }

        // hyphenate next part
        const hyphenAt = Math.min(
            spaceLeftOnLine - 1,
            Math.floor(wordWidth / 2)
        );
        const hyphen = word.substring(index, index + hyphenAt);
        output.push(hyphen);
        index += hyphenAt;
        spaceLeftOnLine = lineWidth;
    }

    return output;
}

// // Returns the number of lines, including the newlines already in the text.
// // Puts the output in "to" only if we receive a "to" -- can make it null and just get a line count.
// export function splitIntoLines(source: string, width = 200, indent = 0) {
//     const output: string[] = [];
//     if (!source) return output;
//     if (width <= 0) width = 200;
//     let text = wordWrap(source, width, indent);

//     let start = 0;
//     let fg0: Color | number | null = null;
//     let bg0: Color | number | null = null;
//     eachChar(text, (ch, fg, bg, _, n) => {
//         if (ch == '\n') {
//             let color =
//                 fg0 || bg0 ? `#{${fg0 ? fg0 : ''}${bg0 ? ':' + bg0 : ''}}` : '';
//             output.push(color + text.substring(start, n));
//             start = n + 1;
//             fg0 = fg;
//             bg0 = bg;
//         }
//     });

//     let color = fg0 || bg0 ? `#{${fg0 ? fg0 : ''}${bg0 ? ':' + bg0 : ''}}` : '';

//     if (start < text.length) {
//         output.push(color + text.substring(start));
//     }

//     return output;
// }

export function splitIntoLines(
    text: string,
    width = 200,
    opts: WrapOptions = {}
): string[] {
    if (typeof text !== 'string') return [];
    text = text.trimEnd();
    // if (text.endsWith('\n')) {
    //     text = text.trimEnd();
    // }
    const updated = wordWrap(text, width, opts);
    return updated.split('\n');
}
