import * as Each from './each';

//
// Embeded color syntax
//
// #{red}       << set fg:red
// #{:blue}     << set bg: blue
// #{red:blue}  << set fg: red, bg: blue
// #{}          << set fg, bg to default
//
// \#{          << mark as not a color command (ignore \)
//
// Text shortcuts
//
// #{red Text}      << color "Text" in red
// #{red:blue Text} << color "Text" in red on blue
//
// NOTE: Text CANNOT contain '}'
// NOTE: Text is everything starting at first character after the space after color
//       This means if you put multiple spaces, they will be colored
//       e.g. #{:red     } << 4 red bg squares
// After coloring this text, the stack returns to where it started
//

describe('each', () => {
    describe('eachChar', () => {
        let output: string;
        let eachFn: jest.Mock<any, any>;

        beforeEach(() => {
            output = '';
            eachFn = jest.fn().mockImplementation((ch, fg, bg) => {
                if (!fg) fg = '';
                if (!bg) bg = '';
                if (fg || bg) {
                    output += `#${fg}|${bg}#`;
                }
                output += ch;
            });
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        test('Simple text', () => {
            const fn = jest.fn();

            Each.eachChar('test', fn);
            expect(fn).toHaveBeenCalledTimes(4);
            expect(fn).toHaveBeenCalledWith('t', null, null, 0, 0);
            expect(fn).toHaveBeenCalledWith('e', null, null, 1, 1);
            expect(fn).toHaveBeenCalledWith('s', null, null, 2, 2);
            expect(fn).toHaveBeenCalledWith('t', null, null, 3, 3);
        });

        test('starting fg color', () => {
            Each.eachChar('test', eachFn, { fg: 'red' });
            expect(eachFn).toHaveBeenCalledTimes(4);
            expect(output).toEqual('#red|#t#red|#e#red|#s#red|#t');
        });

        test('both starting colors', () => {
            Each.eachChar('test', eachFn, { fg: 'red', bg: 'blue' });
            expect(eachFn).toHaveBeenCalledTimes(4);
            expect(output).toEqual(
                '#red|blue#t#red|blue#e#red|blue#s#red|blue#t'
            );
        });

        test('color', () => {
            Each.eachChar('a #{red}test#{} text', eachFn);
            expect(output).toEqual('a #red|#t#red|#e#red|#s#red|#t text');
            expect(eachFn).toHaveBeenCalledTimes(11);
        });

        test('colors', () => {
            Each.eachChar('a #{red}test#{} #{}text', eachFn, { fg: 'teal' });
            expect(eachFn).toHaveBeenCalledTimes(11);
            expect(output).toEqual(
                '#teal|#a#teal|# #red|#t#red|#e#red|#s#red|#t#teal|# #teal|#t#teal|#e#teal|#x#teal|#t'
            );
        });

        test('inline bg color', () => {
            Each.eachChar('a #{:blue}test#{} text', eachFn);
            expect(eachFn).toHaveBeenCalledTimes(11);
            expect(output).toEqual('a #|blue#t#|blue#e#|blue#s#|blue#t text');
        });

        test('transform color', () => {
            const eachColor = jest.fn().mockImplementation((ctx) => {
                ctx.fg = ctx.fg ? 333 : 0;
            });

            Each.eachChar('a #{red}test#{} text', eachFn, { eachColor });
            expect(eachFn).toHaveBeenCalledTimes(11);
            expect(output).toEqual('a #333|#t#333|#e#333|#s#333|#t text');
        });

        test('placing color marker char', () => {
            Each.eachChar('a \\#{horseshoe}!', eachFn);
            expect(eachFn).toHaveBeenCalledTimes(15);
            expect(output).toEqual('a #{horseshoe}!');
        });

        test('Missing end of color', () => {
            jest.spyOn(console, 'warn').mockReturnValue();
            Each.eachChar('a #{red horseshoe !', eachFn);
            expect(output).toEqual(
                'a #red|#h#red|#o#red|#r#red|#s#red|#e#red|#s#red|#h#red|#o#red|#e#red|# #red|#!'
            );
            expect(console.warn).toHaveBeenCalled();
            expect(eachFn).toHaveBeenCalledTimes(13);
        });

        test('empty string', () => {
            Each.eachChar('', eachFn);
            expect(eachFn).toHaveBeenCalledTimes(0);
            expect(output).toEqual('');
        });

        test('null string', () => {
            let s = null;
            // @ts-ignore
            Each.eachChar(s, eachFn);
            expect(eachFn).toHaveBeenCalledTimes(0);
            expect(output).toEqual('');
        });

        test('undefined string', () => {
            let s = undefined;
            // @ts-ignore
            Each.eachChar(s, eachFn);
            expect(eachFn).toHaveBeenCalledTimes(0);
            expect(output).toEqual('');
        });

        test('number string', () => {
            let s = 0;
            // @ts-ignore
            Each.eachChar(s, eachFn);
            expect(eachFn).toHaveBeenCalledTimes(1);
            expect(output).toEqual('0');
        });

        test('no fn', () => {
            let fn = null;
            // @ts-ignore
            Each.eachChar('test', fn);
            expect(eachFn).toHaveBeenCalledTimes(0);
            expect(output).toEqual('');
        });
    });

    describe('eachWord', () => {
        let output: string[];
        let eachFn: jest.Mock<any, any>;

        beforeEach(() => {
            output = [];
            eachFn = jest.fn().mockImplementation((word, fg, bg, prefix) => {
                let result = '';
                if (!fg) fg = '';
                if (!bg) bg = '';

                if (prefix !== ' ' && (output.length != 0 || prefix.length)) {
                    result += '[' + prefix + ']';
                }

                if (fg || bg) {
                    result += `#{${fg}${bg ? ':' + bg : ''}}`;
                }
                result += word;
                output.push(result);
            });
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        test('one char', () => {
            Each.eachWord('a', eachFn);
            expect(eachFn).toHaveBeenCalledTimes(1);
            expect(output).toEqual(['a']);
        });

        test('just hyphen', () => {
            Each.eachWord('-', eachFn);
            expect(eachFn).toHaveBeenCalledTimes(1);
            expect(output).toEqual(['-']);
        });

        test('one word', () => {
            Each.eachWord('test', eachFn);
            expect(eachFn).toHaveBeenCalledTimes(1);
            expect(output).toEqual(['test']);
        });

        test('one word {color}', () => {
            Each.eachWord('#{red}test', eachFn);
            expect(eachFn).toHaveBeenCalledTimes(1);
            expect(output).toEqual(['#{red}test']);
        });

        test('one word {inline}', () => {
            Each.eachWord('#{red test}', eachFn);
            expect(eachFn).toHaveBeenCalledTimes(1);
            expect(output).toEqual(['#{red}test']);
        });

        test('multiple words', () => {
            Each.eachWord('test test test', eachFn);
            expect(eachFn).toHaveBeenCalledTimes(3);
            expect(output).toEqual(['test', 'test', 'test']);
        });

        test('multiple words {color}', () => {
            Each.eachWord('#{red}test test test', eachFn);
            expect(eachFn).toHaveBeenCalledTimes(3);
            expect(output).toEqual(['#{red}test', '#{red}test', '#{red}test']);
        });

        test('multiple words {color change}', () => {
            Each.eachWord('#{red}test #{blue}test #{:green}test', eachFn);
            expect(eachFn).toHaveBeenCalledTimes(3);
            expect(output).toEqual([
                '#{red}test',
                '#{blue}test',
                '#{blue:green}test',
            ]);
        });

        test('multiple words {color reset}', () => {
            Each.eachWord('#{red}test #{:blue}test#{} test', eachFn);
            expect(eachFn).toHaveBeenCalledTimes(3);
            expect(output).toEqual(['#{red}test', '#{red:blue}test', 'test']);
        });

        test('hyphenated words', () => {
            Each.eachWord('test test-test', eachFn);
            expect(eachFn).toHaveBeenCalledTimes(3);
            expect(output).toEqual(['test', 'test-', '[]test']);
        });

        test('hyphenated words {color}', () => {
            Each.eachWord('test #{red}test-test', eachFn);
            expect(eachFn).toHaveBeenCalledTimes(3);
            expect(output).toEqual(['test', '#{red}test-', '[]#{red}test']);
        });

        test('hyphenated words {inline}', () => {
            Each.eachWord('test #{red test-test}', eachFn);
            expect(eachFn).toHaveBeenCalledTimes(3);
            expect(output).toEqual(['test', '#{red}test-', '[]#{red}test']);
        });

        test('newlines', () => {
            Each.eachWord('test test\ntest', eachFn);
            expect(eachFn).toHaveBeenCalledTimes(4);
            expect(output).toEqual(['test', 'test', '[]\n', '[]test']);
        });

        test('newlines {color}', () => {
            Each.eachWord('test #{red}test\ntest', eachFn);
            expect(eachFn).toHaveBeenCalledTimes(4);
            expect(output).toEqual([
                'test',
                '#{red}test',
                '[]#{red}\n',
                '[]#{red}test',
            ]);
        });
        test('newlines {inline}', () => {
            Each.eachWord('test #{red test\ntest}', eachFn);
            expect(eachFn).toHaveBeenCalledTimes(4);
            expect(output).toEqual([
                'test',
                '#{red}test',
                '[]#{red}\n',
                '[]#{red}test',
            ]);
        });
    });
});
