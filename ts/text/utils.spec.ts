import * as Utils from './utils';

//
// Embeded color syntax
//
// #{red}       << set fg:red
// #{:blue}     << set bg: blue
// #{red:blue}  << set fg: red, bg: blue
// #{}          << clear fg, bg to default
//
// \\#{          << mark as not a color command (ignore \\)
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
// After coloring this text, the color returns to where it started
//

describe('length', () => {
    test('empty', () => {
        // @ts-ignore
        expect(Utils.length(null)).toEqual(0);
        expect(Utils.length('')).toEqual(0);
    });

    test('no colors', () => {
        expect(Utils.length('test')).toEqual(4);
    });

    test('colors', () => {
        expect(Utils.length('#{red}test#{}')).toEqual(4);
        expect(Utils.length('a #{red}middle#{} test')).toEqual(13);
        expect(Utils.length('\\#{red}test\\#{}')).toEqual(13);
        expect(Utils.length('#{red test}')).toEqual(4);
        expect(Utils.length('a #{red test} case')).toEqual(11);
    });
});

describe('padStart', () => {
    test('no colors', () => {
        expect(Utils.padStart('test', 10)).toEqual('      test');
    });

    test('colors', () => {
        expect(Utils.padStart('#{red}test#{}', 10)).toEqual(
            '      #{red}test#{}'
        );
    });

    test('too long', () => {
        expect(Utils.padStart('testing a long message', 10)).toEqual(
            'testing a long message'
        );
    });
});

describe('padEnd', () => {
    test('no colors', () => {
        expect(Utils.padEnd('test', 10)).toEqual('test      ');
    });

    test('colors', () => {
        expect(Utils.padEnd('#{red}test#{}', 10)).toEqual(
            '#{red}test#{}      '
        );
    });

    test('too long', () => {
        expect(Utils.padEnd('testing a long message', 10)).toEqual(
            'testing a long message'
        );
    });
});

describe('center', () => {
    test('too long', () => {
        expect(Utils.center('reallyreally', 10)).toEqual('reallyreally');
    });

    test('no colors', () => {
        expect(Utils.center('test', 10)).toEqual('   test   ');
    });

    test('colors', () => {
        expect(Utils.center('#{red}test#{}', 10)).toEqual(
            '   #{red}test#{}   '
        );
    });
});

test('capitalize', () => {
    expect(Utils.capitalize('test')).toEqual('Test');
    expect(Utils.capitalize(' test')).toEqual(' Test');
    expect(Utils.capitalize('#{red}test#{}')).toEqual('#{red}Test#{}');
    expect(Utils.capitalize('#{red} test')).toEqual('#{red} Test');
    expect(Utils.capitalize('#{} test')).toEqual('#{} Test');
    expect(Utils.capitalize('   ')).toEqual('   ');
    expect(Utils.capitalize('#{red test}')).toEqual('#{red Test}');
});

test('removeColors', () => {
    expect(Utils.removeColors('test')).toEqual('test');
    expect(Utils.removeColors('#{red}test#{}')).toEqual('test');
    expect(Utils.removeColors('a \\#{red} horseshoe \\#{}!')).toEqual(
        'a \\#{red} horseshoe \\#{}!'
    );
    expect(Utils.removeColors('a #{red test}')).toEqual('a test');
});

test('firstChar', () => {
    expect(Utils.firstChar('test')).toEqual('t');
    expect(Utils.firstChar('#{red}test#{}')).toEqual('t');
    expect(Utils.firstChar('#{red} test')).toEqual(' ');
    expect(Utils.firstChar('#{} test')).toEqual(' ');
    expect(Utils.firstChar('#{red}#{}test')).toEqual('t');
    expect(Utils.firstChar('#{red test} case')).toEqual('t');
    expect(Utils.firstChar('')).toEqual(null);
});

describe('advanceChars', () => {
    test('no color', () => {
        expect(Utils.advanceChars('test test test', 0, 4)).toEqual(4);
        expect(Utils.advanceChars('test test test', 4, 4)).toEqual(8);
    });

    test('inline color', () => {
        expect(Utils.advanceChars('test #{red test} test', 0, 6)).toEqual(12);
    });

    test('color start/end', () => {
        expect(Utils.advanceChars('test #{red} test', 0, 4)).toEqual(4);
        expect(Utils.advanceChars('test #{red} test', 0, 6)).toEqual(12);
        expect(Utils.advanceChars('test #{} test', 0, 6)).toEqual(9);
        expect(Utils.advanceChars('#{red}test#{} test', 0, 6)).toEqual(15);
    });
});

describe('truncate', () => {
    test('basic', () => {
        expect(Utils.truncate('test', 20)).toEqual('test');
        expect(Utils.truncate('123456789012345678901234567890', 20)).toEqual(
            '12345678901234567890'
        );
        expect(
            Utils.truncate(
                '1#{red}23#{}4#{red}56#{}7#{red}89#{}0#{red}1234567890',
                10
            )
        ).toEqual('1#{red}23#{}4#{red}56#{}7#{red}89#{}0');
    });

    test('inside color', () => {
        expect(Utils.truncate('a #{red}test case#{}', 6)).toEqual(
            'a #{red}test#{}'
        );
    });

    test('inline color', () => {
        expect(Utils.truncate('a #{red test} case', 8)).toEqual(
            'a #{red test} c'
        );
        expect(Utils.truncate('a #{red test} case', 3)).toEqual('a #{red t}');
    });
});

describe('spliceRaw', () => {
    test('basic', () => {
        expect(Utils.spliceRaw('testing', 8, 3)).toEqual('testing');
        expect(Utils.spliceRaw('testing', 4, 4)).toEqual('test');
        expect(
            Utils.spliceRaw('123456789012345678901234567890', 10, 5, 'TACO')
        ).toEqual('1234567890TACO678901234567890');
    });

    test('splice', () => {
        expect(Utils.spliceRaw('testing', 4, 3)).toEqual('test');
    });
});

describe('hash', () => {
    test('basic', () => {
        expect(Utils.hash('')).toEqual(0);
        expect(Utils.hash('taco')).toEqual(3552153);
        expect(Utils.hash('tacos')).toEqual(110116858);
        expect(Utils.hash('#{red}tacos#{}')).toEqual(1144837967);
    });
});

describe('splitArgs', () => {
    test('basic', () => {
        expect(Utils.splitArgs('aaaa')).toEqual(['aaaa']);
        expect(Utils.splitArgs('aaaa bbbb')).toEqual(['aaaa', 'bbbb']);
        expect(Utils.splitArgs('  aaaa   bbbb')).toEqual(['aaaa', 'bbbb']);
        expect(Utils.splitArgs('a b.c.d')).toEqual(['a', 'b.c.d']);
        expect(Utils.splitArgs('a "b c d"')).toEqual(['a', 'b c d']);
    });
});
