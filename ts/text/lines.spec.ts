import * as Lines from './lines';

describe('Lines', () => {
    test('simple stuff', () => {
        expect(Lines.wordWrap('test', 10)).toEqual('test');
        expect(Lines.wordWrap('test test', 10)).toEqual('test test');
        expect(Lines.wordWrap('test test test', 10)).toEqual('test test\ntest');
        expect(Lines.wordWrap('aaaa bbbb cccc dddd eeee', 10)).toEqual(
            'aaaa bbbb\ncccc dddd\neeee'
        );
    });

    test('simple stuff {color}', () => {
        expect(Lines.wordWrap('#{red}test', 10)).toEqual('#{red}test');
        expect(Lines.wordWrap('test #{red}test', 10)).toEqual(
            'test #{red}test'
        );
        expect(Lines.wordWrap('test #{red}test test', 10)).toEqual(
            'test #{red}test\n#{red}test'
        );
        expect(
            Lines.wordWrap(
                '#{red}aaaa #{:blue}bbbb #{white}cccc #{:teal}dddd#{} eeee',
                10
            )
        ).toEqual(
            '#{red}aaaa #{red:blue}bbbb\n#{white:blue}cccc #{white:teal}dddd\n#{}eeee'
        );
    });

    test('word goes over line', () => {
        expect(Lines.wordWrap('test testtest', 10)).toEqual('test\ntesttest');
        expect(
            Lines.wordWrap('test testtest testtest test testtest', 10)
        ).toEqual('test\ntesttest\ntesttest\ntest\ntesttest');
    });

    test('word goes over line', () => {
        expect(Lines.wordWrap('test testtest', 10)).toEqual('test\ntesttest');
        expect(
            Lines.wordWrap('test testtest testtest test testtest', 10)
        ).toEqual('test\ntesttest\ntesttest\ntest\ntesttest');
    });
});

test('double wrap', () => {
    const raw =
        '#{yellow}Welcome to Town!\n#{dark_purple}Visit our shops to equip yourself for a journey into the #{green Dungeons of Moria}.  Once you are prepared, enter the dungeon and seek the #{dark_red #Balrog}.  Destroy him to free us all!\n#{white}Press <?> for help.';
    const wrapped =
        '#{yellow}Welcome to Town!\n#{dark_purple}Visit our shops to equip yourself for a journey into the #{green}Dungeons of Moria#{dark_purple}.\n#{dark_purple}Once you are prepared, enter the dungeon and seek the #{dark_red}#Balrog#{dark_purple}.  Destroy him to\n#{dark_purple}free us all!\n#{white}Press <?> for help.';

    const output = Lines.wordWrap(raw, 80);

    expect(output).not.toEqual(raw);
    expect(output).toEqual(wrapped);
});

test('basic', () => {
    expect(Lines.wordWrap('test', 10)).toEqual('test');
    expect(Lines.wordWrap('test test test', 10)).toEqual('test test\ntest');
    expect(Lines.wordWrap('test tests test', 10)).toEqual('test tests\ntest');
    expect(Lines.wordWrap('tests tests tests', 10)).toEqual(
        'tests\ntests\ntests'
    );
});

test('basic indent', () => {
    expect(Lines.wordWrap('test', 10, { indent: 2 })).toEqual('test');
    expect(Lines.wordWrap('test test test', 10, { indent: 2 })).toEqual(
        'test test\n  test'
    );
    expect(Lines.wordWrap('test tests test', 10, { indent: 2 })).toEqual(
        'test tests\n  test'
    );
    expect(Lines.wordWrap('tests tests tests', 10, { indent: 2 })).toEqual(
        'tests\n  tests\n  tests'
    );
});

//     test('indent', () => {
//         const raw =
//             'ΩyellowΩWelcome to Town!∆\nΩdark_purpleΩVisit our shops to equip yourself for a journey into the ΩgreenΩDungeons of Moria∆.  Once you are prepared, enter the dungeon and seek the Ωdark_redΩ#Balrog∆.  Destroy him to free us all!∆\nΩwhiteΩPress <?> for help.';
//         const wrapped = Lines.wordWrap(raw, 80, 20);
//         expect(wrapped.split('\n')).toEqual([
//             'ΩyellowΩWelcome to Town!∆',
//             'Ωdark_purpleΩVisit our shops to equip yourself for a journey into the ΩgreenΩDungeons of Moria∆. ',
//             'Once you are prepared, enter the dungeon and seek the',
//             'Ωdark_redΩ#Balrog∆.  Destroy him to free us all!∆',
//             'ΩwhiteΩPress <?> for help.',
//         ]);
//     });

test('colors', () => {
    expect(Lines.wordWrap('#{orange}test#{}', 10)).toEqual('#{orange}test');

    expect(Lines.wordWrap('#{orange}test test test#{}', 10)).toEqual(
        '#{orange}test test\n#{orange}test'
    );
    expect(Lines.wordWrap('test #{orange}test test#{}', 10)).toEqual(
        'test #{orange}test\n#{orange}test'
    );
    expect(Lines.wordWrap('test #{orange}test#{} test', 10)).toEqual(
        'test #{orange}test\n#{}test'
    );

    expect(Lines.wordWrap('test tests test', 10)).toEqual('test tests\ntest');
    expect(Lines.wordWrap('#{orange}test tests test#{}', 10)).toEqual(
        '#{orange}test tests\n#{orange}test'
    );
    expect(Lines.wordWrap('test #{orange}tests#{} test', 10)).toEqual(
        'test #{orange}tests\n#{}test'
    );

    expect(Lines.wordWrap('tests tests tests', 10)).toEqual(
        'tests\ntests\ntests'
    );
    expect(Lines.wordWrap('tests #{orange}tests#{} tests', 10)).toEqual(
        'tests\n#{orange}tests\n#{}tests'
    );
});

test('colors ending mid-sequence', () => {
    expect(Lines.wordWrap('testing #{orange}test#{}test', 10)).toEqual(
        'testing\n#{orange}test#{}test'
    );

    expect(Lines.wordWrap('testing #{orange test}test', 10)).toEqual(
        'testing\n#{orange}test#{}test'
    );
});

test('Split Word', () => {
    // hyphenate long words near middle if possible
    expect(Lines.splitWord('reallyreally', 10)).toEqual(['reallyrea', 'lly']);
    expect(Lines.splitWord('reallyreallylongwordsthrow', 10)).toEqual([
        'reallyrea',
        'llylongwo',
        'rdsthrow',
    ]);
});

test('with hyphens already', () => {
    expect(Lines.wordWrap('really-really-long-words', 10)).toEqual(
        'really-\nreally-\nlong-words'
    );

    expect(Lines.wordWrap('123456789-123456789-123456789', 10)).toEqual(
        '123456789-\n123456789-\n123456789'
    );
});

test('add hyphens', () => {
    expect(Lines.wordWrap('reallyreallylongwords', 10)).toEqual(
        'reallyrea-\nllylongwo-\nrds'
    );

    expect(Lines.wordWrap('12345678901234567890123456789', 10)).toEqual(
        '123456789-\n012345678-\n901234567-\n89'
    );
});

//     });

//     describe('splitIntoLines', () => {
//         test('basic', () => {
//             // @ts-ignore
//             expect(Lines.splitIntoLines(undefined, 10)).toEqual([]);
//             expect(Lines.splitIntoLines('', 10)).toEqual([]);
//             expect(Lines.splitIntoLines('\n', 10)).toEqual(['']);
//             expect(Lines.splitIntoLines('a')).toEqual(['a']);

//             expect(Lines.splitIntoLines('reallyreally', 0)).toEqual([
//                 'reallyreally',
//             ]);

//             expect(Lines.splitIntoLines('reallyreally', 10)).toEqual([
//                 'reallyrea-',
//                 'lly',
//             ]);
//             expect(Lines.splitIntoLines('test reallyreally', 10)).toEqual([
//                 'test real-',
//                 'lyreally',
//             ]);
//             expect(Lines.splitIntoLines('testing reallyreally', 10)).toEqual([
//                 'testing',
//                 'reallyrea-',
//                 'lly',
//             ]);
//             expect(Lines.splitIntoLines('testing reallyreally', 12)).toEqual([
//                 'testing',
//                 'reallyreally',
//             ]);
//             expect(
//                 Lines.splitIntoLines('reallyreallylongwordsthrow', 10)
//             ).toEqual(['reallyrea-', 'llylongwo-', 'rdsthrow']);
//         });

//         test('newlines only', () => {
//             expect(Lines.splitIntoLines('really\nreally')).toEqual([
//                 'really',
//                 'really',
//             ]);
//             expect(Lines.splitIntoLines('test reallyreally\n')).toEqual([
//                 'test reallyreally',
//             ]);
//             expect(Lines.splitIntoLines('reallyreallylongwordsthrow')).toEqual([
//                 'reallyreallylongwordsthrow',
//             ]);
//         });

//         test('withColor', () => {
//             const raw =
//                 'Ω|yellowΩWelcome to Town!∆\nΩwhite|purpleΩVisit our shops to equip yourself for a journey into the ΩgreenΩDungeons of Moria∆.  Once you are prepared, enter the dungeon and seek the Ωdark_redΩ#Balrog∆.  Destroy him to free us all!∆\nΩwhiteΩPress <?> for help.';
//             const wrapped = Lines.splitIntoLines(raw, 80, 20);
//             expect(wrapped).toEqual([
//                 'Ω|yellowΩWelcome to Town!∆',
//                 'Ωwhite|purpleΩVisit our shops to equip yourself for a journey into the ΩgreenΩDungeons of Moria∆. ',
//                 'Ωwhite|purpleΩOnce you are prepared, enter the dungeon and seek the',
//                 'Ωwhite|purpleΩΩdark_redΩ#Balrog∆.  Destroy him to free us all!∆',
//                 'ΩwhiteΩPress <?> for help.',
//             ]);

//             expect(
//                 Lines.splitIntoLines('ΩyellowΩtesting reallyreally', 10)
//             ).toEqual(['ΩyellowΩtesting', 'ΩyellowΩreallyrea-', 'ΩyellowΩlly']);
//             expect(
//                 Lines.splitIntoLines('Ω|yellowΩtesting reallyreally', 10)
//             ).toEqual([
//                 'Ω|yellowΩtesting',
//                 'Ω|yellowΩreallyrea-',
//                 'Ω|yellowΩlly',
//             ]);
//         });
//     });
// });
