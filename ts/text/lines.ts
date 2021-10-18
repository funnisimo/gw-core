import { Color } from '../color';
import * as Config from './config';
import * as Utils from './utils';
import { eachChar } from './each';

export function nextBreak(text: string, start: number) {
    const CS = Config.options.colorStart;
    const CE = Config.options.colorEnd;

    let i = start;
    let l = 0;
    let count = true;

    while (i < text.length) {
        const ch = text[i];
        if (ch == ' ') {
            while (text[i + 1] == ' ') {
                ++i;
                ++l; // need to count the extra spaces as part of the word
            }
            return [i, l];
        }
        if (ch == '-') {
            return [i, l];
        }
        if (ch == '\n') {
            return [i, l];
        }
        if (ch == CS) {
            if (text[i + 1] == CS && count) {
                l += 1;
                i += 2;
                continue;
            }
            count = !count;
            ++i;
            continue;
        } else if (ch == CE) {
            if (text[i + 1] == CE) {
                l += 1;
                ++i;
            }
            i++;
            continue;
        }
        l += count ? 1 : 0;
        ++i;
    }

    return [i, l];
}

export function splice(
    text: string,
    start: number,
    len: number,
    add: string = ''
) {
    return text.substring(0, start) + add + text.substring(start + len);
}

export function hyphenate(
    text: string,
    lineWidth: number,
    start: number,
    end: number,
    wordWidth: number,
    spaceLeftOnLine: number
): [string, number] {
    while (start < end) {
        // do not need to hyphenate
        if (spaceLeftOnLine >= wordWidth) return [text, end];

        // not much room left and word fits on next line
        if (spaceLeftOnLine < 4 && wordWidth <= lineWidth) {
            text = splice(text, start - 1, 1, '\n');
            return [text, end + 1];
        }

        // if will fit on this line and next...
        if (wordWidth < spaceLeftOnLine + lineWidth) {
            const w = Utils.advanceChars(text, start, spaceLeftOnLine - 1);
            text = splice(text, w, 0, '-\n');
            return [text, end + 2];
        }

        if (spaceLeftOnLine < 5) {
            text = splice(text, start - 1, 1, '\n');
            spaceLeftOnLine = lineWidth;
            continue;
        }

        // one hyphen will work...
        // if (spaceLeftOnLine + width > wordWidth) {
        const hyphenAt = Math.min(
            spaceLeftOnLine - 1,
            Math.floor(wordWidth / 2)
        );
        const w = Utils.advanceChars(text, start, hyphenAt);
        text = splice(text, w, 0, '-\n');
        start = w + 2;
        end += 2;
        wordWidth -= hyphenAt;
    }

    return [text, end];

    // // do not have a strategy for this right now...
    // if (wordWidth + 1 > width * 2) {
    //     throw new Error('Cannot hyphenate - word length > 2 * width');
    // }

    // }

    // if (width >= wordWidth) {
    //     return [text, end];
    // }

    // console.log('hyphenate', { text, start, end, width, wordWidth, spaceLeftOnLine });
    // throw new Error('Did not expect to get here...');

    // wordWidth >= spaceLeftOnLine + width
    // text = splice(text, start - 1, 1, "\n");
    // spaceLeftOnLine = width;
    // const hyphenAt = Math.min(wordWidth, width - 1);
    // const w = Utils.advanceChars(text, start, hyphenAt);
    // text = splice(text, w, 0, "-\n");

    // return [text, end + 2];
}

export function wordWrap(text: string, width: number, indent = 0) {
    if (!width) throw new Error('Need string and width');
    if (text.length < width) return text;
    if (Utils.length(text) < width) return text;

    if (text.indexOf('\n') == -1) {
        return wrapLine(text, width, indent);
    }

    const lines = text.split('\n');
    const split = lines.map((line, i) => wrapLine(line, width, i ? indent : 0));

    return split.join('\n');
}

// Returns the number of lines, including the newlines already in the text.
// Puts the output in "to" only if we receive a "to" -- can make it null and just get a line count.
function wrapLine(text: string, width: number, indent: number) {
    if (text.length < width) return text;
    if (Utils.length(text) < width) return text;

    let spaceLeftOnLine = width;
    width = width - indent;

    let printString = text;

    // Now go through and replace spaces with newlines as needed.

    // console.log('wordWrap - ', text, width, indent);

    let removeSpace = true;
    let i = -1;
    while (i < printString.length) {
        // wordWidth counts the word width of the next word without color escapes.
        // w indicates the position of the space or newline or null terminator that terminates the word.
        let [w, wordWidth] = nextBreak(printString, i + (removeSpace ? 1 : 0));

        let hyphen = false;
        if (printString[w] == '-') {
            w++;
            wordWidth++;
            hyphen = true;
        }

        // console.log('- w=%d, width=%d, space=%d, word=%s', w, wordWidth, spaceLeftOnLine, printString.substring(i, w));

        if (wordWidth > width) {
            [printString, w] = hyphenate(
                printString,
                width,
                i + 1,
                w,
                wordWidth,
                spaceLeftOnLine
            );
        } else if (wordWidth == spaceLeftOnLine) {
            const nl = w < printString.length ? '\n' : '';
            const remove = hyphen ? 0 : 1;
            printString = splice(printString, w, remove, nl); // [i] = '\n';
            w += 1 - remove; // if we change the length we need to advance our pointer

            spaceLeftOnLine = width;
        } else if (wordWidth > spaceLeftOnLine) {
            const remove = removeSpace ? 1 : 0;
            printString = splice(printString, i, remove, '\n'); // [i] = '\n';
            w += 1 - remove; // if we change the length we need to advance our pointer

            const extra = hyphen ? 0 : 1;
            spaceLeftOnLine = width - wordWidth - extra; // line width minus the width of the word we just wrapped and the space
            //printf("\n\n%s", printString);
        } else {
            const extra = hyphen ? 0 : 1;
            spaceLeftOnLine -= wordWidth + extra;
        }

        removeSpace = !hyphen;
        i = w; // Advance to the terminator that follows the word.
    }

    return printString;
}

// Returns the number of lines, including the newlines already in the text.
// Puts the output in "to" only if we receive a "to" -- can make it null and just get a line count.
export function splitIntoLines(source: string, width = 200, indent = 0) {
    const CS = Config.options.colorStart;
    const output: string[] = [];
    if (!source) return output;
    if (width <= 0) width = 200;
    let text = wordWrap(source, width, indent);

    let start = 0;
    let fg0: Color | number | null = null;
    let bg0: Color | number | null = null;
    eachChar(text, (ch, fg, bg, _, n) => {
        if (ch == '\n') {
            let color =
                fg0 || bg0
                    ? `${CS}${fg0 ? fg0 : ''}${bg0 ? '|' + bg0 : ''}${CS}`
                    : '';
            output.push(color + text.substring(start, n));
            start = n + 1;
            fg0 = fg;
            bg0 = bg;
        }
    });

    let color =
        fg0 || bg0 ? `${CS}${fg0 ? fg0 : ''}${bg0 ? '|' + bg0 : ''}${CS}` : '';

    if (start < text.length - 1) {
        output.push(color + text.substring(start));
    }

    return output;
}
