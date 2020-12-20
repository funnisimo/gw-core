import { compile, apply } from "./compile";
import { eachChar } from "./each";
import { length, padStart, padEnd, center, capitalize, removeColors, firstChar } from "./utils";
import { wordWrap, splitIntoLines } from "./lines";
import { addHelper, options } from "./config";
interface Options {
    fg?: any;
    bg?: any;
    colorStart?: string;
    colorEnd?: string;
    field?: string;
}
declare function configure(opts?: Options): void;
export { compile, apply, eachChar, length, padStart, padEnd, center, firstChar, capitalize, removeColors, wordWrap, splitIntoLines, configure, addHelper, options, };
