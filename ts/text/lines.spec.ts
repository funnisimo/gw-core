
import * as Lines from './lines';


describe('wordWrap', () => {

    test('splice', () => {
        expect(Lines.splice('testing', 4, 3)).toEqual('test');
    });

    test('nextBreak', () => {
        expect(Lines.nextBreak('test', 0)).toEqual([4, 4]);

        expect(Lines.nextBreak('test test', 0)).toEqual([4, 4]);
        expect(Lines.nextBreak('test test', 5)).toEqual([9, 4]);

        expect(Lines.nextBreak('test test test', 5)).toEqual([9, 4]);
        expect(Lines.nextBreak('test test test', 10)).toEqual([14, 4]);

        expect(Lines.nextBreak('test tests test', 0)).toEqual([4, 4]);
        expect(Lines.nextBreak('test tests test', 5)).toEqual([10, 5]);
        expect(Lines.nextBreak('test tests test', 11)).toEqual([15, 4]);

        expect(Lines.nextBreak('ΩorangeΩtest∆', 0)).toEqual([13, 4]);

        expect(Lines.nextBreak('ΩorangeΩtest test test∆', 0)).toEqual([12, 4]);
        expect(Lines.nextBreak('ΩorangeΩtest test test∆', 13)).toEqual([17, 4]);
        expect(Lines.nextBreak('ΩorangeΩtest test test∆', 18)).toEqual([23, 4]);

        expect(Lines.nextBreak('test ΩorangeΩtest test∆', 0)).toEqual([4, 4]);
        expect(Lines.nextBreak('test ΩorangeΩtest test∆', 5)).toEqual([17, 4]);
        expect(Lines.nextBreak('test ΩorangeΩtest test∆', 18)).toEqual([23, 4]);

        expect(Lines.nextBreak('test ΩorangeΩtests∆ test', 0)).toEqual([4, 4]);
        expect(Lines.nextBreak('test ΩorangeΩtests∆ test', 5)).toEqual([19, 5]);
        expect(Lines.nextBreak('test ΩorangeΩtests∆ test', 20)).toEqual([24, 4]);

        expect(Lines.nextBreak('tests tests tests', 0)).toEqual([5, 5]);
        expect(Lines.nextBreak('tests tests tests', 6)).toEqual([11, 5]);
        expect(Lines.nextBreak('tests tests tests', 12)).toEqual([17, 5]);

        expect(Lines.nextBreak('tests ΩorangeΩtests∆ tests', 0)).toEqual([5, 5]);
        expect(Lines.nextBreak('tests ΩorangeΩtests∆ tests', 6)).toEqual([20, 5]);
        expect(Lines.nextBreak('tests ΩorangeΩtests∆ tests', 21)).toEqual([26, 5]);

        expect(Lines.nextBreak('test ΩorangeΩtests∆test', 0)).toEqual([4, 4]);
        expect(Lines.nextBreak('test ΩorangeΩtests∆test', 5)).toEqual([23, 9]);

        expect(Lines.nextBreak('test\ntest', 0)).toEqual([4, 4]);
        expect(Lines.nextBreak('testΩΩ test test', 0)).toEqual([6, 5]);
        expect(Lines.nextBreak('test∆∆ test', 0)).toEqual([6, 5]);
    });

    test('double wrap', () => {
        const raw = 'ΩyellowΩWelcome to Town!∆\nΩdark_purpleΩVisit our shops to equip yourself for a journey into the ΩgreenΩDungeons of Moria∆.  Once you are prepared, enter the dungeon and seek the Ωdark_redΩ#Balrog∆.  Destroy him to free us all!∆\nΩwhiteΩPress <?> for help.';
        const wrapped = Lines.wordWrap(raw, 80);

        expect(wrapped).not.toEqual(raw);
        expect(Lines.wordWrap(wrapped, 80)).toEqual(wrapped);
    });

    test('basic', () => {
        expect(Lines.wordWrap('test', 10)).toEqual('test');
        expect(Lines.wordWrap('test test test', 10)).toEqual('test test\ntest');
        expect(Lines.wordWrap('test tests test', 10)).toEqual('test tests\ntest');
        expect(Lines.wordWrap('tests tests tests', 10)).toEqual('tests\ntests\ntests');
    });

    test('indent', () => {
        const raw = 'ΩyellowΩWelcome to Town!∆\nΩdark_purpleΩVisit our shops to equip yourself for a journey into the ΩgreenΩDungeons of Moria∆.  Once you are prepared, enter the dungeon and seek the Ωdark_redΩ#Balrog∆.  Destroy him to free us all!∆\nΩwhiteΩPress <?> for help.';
        const wrapped = Lines.wordWrap(raw, 80, 20);
        expect(wrapped.split('\n')).toEqual([
            "ΩyellowΩWelcome to Town!∆",
            "Ωdark_purpleΩVisit our shops to equip yourself for a journey into the ΩgreenΩDungeons of Moria∆. ",
            "Once you are prepared, enter the dungeon and seek the",
            "Ωdark_redΩ#Balrog∆.  Destroy him to free us all!∆",
            "ΩwhiteΩPress <?> for help.",
        ]);
    });

    test('colors', () => {
        expect(Lines.wordWrap('ΩorangeΩtest∆', 10)).toEqual('ΩorangeΩtest∆');

        expect(Lines.wordWrap('ΩorangeΩtest test test∆', 10)).toEqual('ΩorangeΩtest test\ntest∆');
        expect(Lines.wordWrap('test ΩorangeΩtest test∆', 10)).toEqual('test ΩorangeΩtest\ntest∆');
        expect(Lines.wordWrap('test ΩorangeΩtest∆ test', 10)).toEqual('test ΩorangeΩtest∆\ntest');

        expect(Lines.wordWrap('test tests test', 10)).toEqual('test tests\ntest');
        expect(Lines.wordWrap('ΩorangeΩtest tests test∆', 10)).toEqual('ΩorangeΩtest tests\ntest∆');
        expect(Lines.wordWrap('test ΩorangeΩtests∆ test', 10)).toEqual('test ΩorangeΩtests∆\ntest');

        expect(Lines.wordWrap('tests tests tests', 10)).toEqual('tests\ntests\ntests');
        expect(Lines.wordWrap('tests ΩorangeΩtests∆ tests', 10)).toEqual('tests\nΩorangeΩtests∆\ntests');
    });

    test('colors ending mid-sequence', () => {
        expect(Lines.wordWrap('test ΩorangeΩtests∆test', 10)).toEqual('test\nΩorangeΩtests∆test');
    });

    describe('hyphenate', () => {

        test('hyphenate', () => {
            expect(Lines.hyphenate('test', 20, 0, 4, 4, 20)).toEqual(['test', 4]);
            expect(Lines.hyphenate('testing reallyreally', 12, 8, 21, 12, 3)).toEqual(['testing\nreallyreally', 22]);
        });

        test('basics', () => {
            // hyphenate long words near middle if possible
            expect(Lines.wordWrap('reallyreally', 10)).toEqual('really-\nreally');
            expect(Lines.wordWrap('test reallyreally', 10)).toEqual('test real-\nlyreally');
            expect(Lines.wordWrap('testing reallyreally', 10)).toEqual('testing\nreally-\nreally');
            expect(Lines.wordWrap('testing reallyreally', 12)).toEqual('testing\nreallyreally');
            expect(() => Lines.wordWrap('reallyreallylongwordsthrow', 10)).toThrow();
            // @ts-ignore
            expect(() => Lines.wordWrap('testing realllyreally')).toThrow();
        });

        test('with hyphens already', () => {
            expect(Lines.wordWrap('really-really-long-words', 10)).toEqual('really-\nreally-\nlong-words');

            expect(Lines.wordWrap('123456789-123456789-123456789', 10)).toEqual('123456789-\n123456789-\n123456789');
        });

    });

    describe('splitIntoLines', () => {

        test('basic', () => {
            expect(Lines.splitIntoLines('reallyreally', 10)).toEqual(['really-', 'really']);
            expect(Lines.splitIntoLines('test reallyreally', 10)).toEqual(['test real-', 'lyreally']);
            expect(Lines.splitIntoLines('testing reallyreally', 10)).toEqual(['testing', 'really-', 'really']);
            expect(Lines.splitIntoLines('testing reallyreally', 12)).toEqual(['testing', 'reallyreally']);
            expect(() => Lines.splitIntoLines('reallyreallylongwordsthrow', 10)).toThrow();
        });

        test('withColor', () => {
            const raw = 'Ω|yellowΩWelcome to Town!∆\nΩwhite|purpleΩVisit our shops to equip yourself for a journey into the ΩgreenΩDungeons of Moria∆.  Once you are prepared, enter the dungeon and seek the Ωdark_redΩ#Balrog∆.  Destroy him to free us all!∆\nΩwhiteΩPress <?> for help.';
            const wrapped = Lines.splitIntoLines(raw, 80, 20);
            expect(wrapped).toEqual([
                "Ω|yellowΩWelcome to Town!∆",
                "Ωwhite|purpleΩVisit our shops to equip yourself for a journey into the ΩgreenΩDungeons of Moria∆. ",
                "Ωwhite|purpleΩOnce you are prepared, enter the dungeon and seek the",
                "Ωwhite|purpleΩΩdark_redΩ#Balrog∆.  Destroy him to free us all!∆",
                "ΩwhiteΩPress <?> for help.",
            ]);

            expect(Lines.splitIntoLines('ΩyellowΩtesting reallyreally', 10)).toEqual([
                'ΩyellowΩtesting',
                'ΩyellowΩreally-',
                'ΩyellowΩreally'
            ]);
            expect(Lines.splitIntoLines('Ω|yellowΩtesting reallyreally', 10)).toEqual([
                'Ω|yellowΩtesting',
                'Ω|yellowΩreally-',
                'Ω|yellowΩreally'
            ]);

        });

    });


});

