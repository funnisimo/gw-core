// import { Color } from '../color';
// import * as Utils from './utils';
import { eachWord } from './each';
import * as UTILS from '../utils';

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

    let output = '';
    let lineLen = 0;

    let lastFg: null | string = null;
    let lastBg: null | string = null;

    eachWord(text, (word, fg, bg, prefix) => {
        let newLen = lineLen + prefix.length + word.length;

        // console.log('word', word, lineLen, newLen);
        if (newLen > lineWidth && word.length > hyphenLen) {
            const lineLeft = lineWidth - lineLen - prefix.length;
            const parts = splitWord(word, lineWidth, lineLeft);

            if (parts[0].length === 0) {
                // line doesn't have enough space left, end it
                output += '\n';
                if (fg || bg) {
                    output += `#{${fg ? fg : ''}${bg ? ':' + bg : ''}}`;
                }

                lineLen = 0;
                parts.shift();
            }

            while (parts.length > 1) {
                output += parts.shift() + '-\n';
                if (fg || bg) {
                    output += `#{${fg ? fg : ''}${bg ? ':' + bg : ''}}`;
                }
            }

            output += parts[0];
            lineLen = parts[0].length;
            return;
        }

        if (word === '\n' || newLen > lineWidth) {
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
            lineLen = 0;
            if (word === '\n') return;
            newLen = word.length;
            prefix = '';
        }

        if (prefix.length) {
            output += prefix;
            lineLen += prefix.length;
        }

        if (fg !== lastFg || bg !== lastBg) {
            lastFg = fg;
            lastBg = bg;
            output += `#{${fg ? fg : ''}${bg ? ':' + bg : ''}}`;
        }

        lineLen += word.length;
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

// export function wordWrap(text: string, width: number, indent = 0) {
//     if (!width) throw new Error('Need string and width');
//     if (text.length < width) return text;
//     if (Utils.length(text) < width) return text;

//     if (text.indexOf('\n') == -1) {
//         return wrapLine(text, width, indent);
//     }

//     const lines = text.split('\n');
//     const split = lines.map((line, i) => wrapLine(line, width, i ? indent : 0));

//     return split.join('\n');
// }

// // Returns the number of lines, including the newlines already in the text.
// // Puts the output in "to" only if we receive a "to" -- can make it null and just get a line count.
// function wrapLine(text: string, width: number, indent: number) {
//     if (text.length < width) return text;
//     if (Utils.length(text) < width) return text;

//     let spaceLeftOnLine = width;
//     width = width - indent;

//     let printString = text;

//     // Now go through and replace spaces with newlines as needed.

//     // console.log('wordWrap - ', text, width, indent);

//     let removeSpace = true;
//     let i = -1;
//     while (i < printString.length) {
//         // wordWidth counts the word width of the next word without color escapes.
//         // w indicates the position of the space or newline or null terminator that terminates the word.
//         let [w, wordWidth] = nextBreak(printString, i + (removeSpace ? 1 : 0));

//         let hyphen = false;
//         if (printString[w] == '-') {
//             w++;
//             wordWidth++;
//             hyphen = true;
//         }

//         // console.log('- w=%d, width=%d, space=%d, word=%s', w, wordWidth, spaceLeftOnLine, printString.substring(i, w));

//         if (wordWidth > width) {
//             [printString, w] = hyphenate(
//                 printString,
//                 width,
//                 i + 1,
//                 w,
//                 wordWidth,
//                 spaceLeftOnLine
//             );
//         } else if (wordWidth == spaceLeftOnLine) {
//             const nl = w < printString.length ? '\n' : '';
//             const remove = hyphen ? 0 : 1;
//             printString = Utils.spliceRaw(printString, w, remove, nl); // [i] = '\n';
//             w += 1 - remove; // if we change the length we need to advance our pointer

//             spaceLeftOnLine = width;
//         } else if (wordWidth > spaceLeftOnLine) {
//             const remove = removeSpace ? 1 : 0;
//             printString = Utils.spliceRaw(printString, i, remove, '\n'); // [i] = '\n';
//             w += 1 - remove; // if we change the length we need to advance our pointer

//             const extra = hyphen ? 0 : 1;
//             spaceLeftOnLine = width - wordWidth - extra; // line width minus the width of the word we just wrapped and the space
//             //printf("\n\n%s", printString);
//         } else {
//             const extra = hyphen ? 0 : 1;
//             spaceLeftOnLine -= wordWidth + extra;
//         }

//         removeSpace = !hyphen;
//         i = w; // Advance to the terminator that follows the word.
//     }

//     return printString;
// }

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
