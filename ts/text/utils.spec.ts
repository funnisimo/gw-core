import * as Utils from './utils';

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
        expect(Utils.length('ΩredΩtest∆')).toEqual(4);
        expect(Utils.length('a ΩredΩmiddle∆ test')).toEqual(13);
    });
});

describe('padStart', () => {
    test('no colors', () => {
        expect(Utils.padStart('test', 10)).toEqual('      test');
    });

    test('colors', () => {
        expect(Utils.padStart('ΩredΩtest∆', 10)).toEqual('      ΩredΩtest∆');
    });
});

describe('padEnd', () => {
    test('no colors', () => {
        expect(Utils.padEnd('test', 10)).toEqual('test      ');
    });

    test('colors', () => {
        expect(Utils.padEnd('ΩredΩtest∆', 10)).toEqual('ΩredΩtest∆      ');
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
        expect(Utils.center('ΩredΩtest∆', 10)).toEqual('   ΩredΩtest∆   ');
    });
});

test('capitalize', () => {
    expect(Utils.capitalize('test')).toEqual('Test');
    expect(Utils.capitalize(' test')).toEqual(' Test');
    expect(Utils.capitalize('ΩredΩtest∆')).toEqual('ΩredΩTest∆');
    expect(Utils.capitalize('ΩΩ test')).toEqual('ΩΩ Test');
    expect(Utils.capitalize('∆∆ test')).toEqual('∆∆ Test');
    expect(Utils.capitalize('   ')).toEqual('   ');
});

test('removeColors', () => {
    expect(Utils.removeColors('test')).toEqual('test');
    expect(Utils.removeColors('ΩredΩtest∆')).toEqual('test');
    expect(Utils.removeColors('a ΩΩ horseshoe ∆∆!')).toEqual(
        'a ΩΩ horseshoe ∆∆!'
    );
});

test('firstChar', () => {
    expect(Utils.firstChar('test')).toEqual('t');
    expect(Utils.firstChar('ΩredΩtest∆')).toEqual('t');
    expect(Utils.firstChar('ΩΩ test')).toEqual('Ω');
    expect(Utils.firstChar('∆∆ test')).toEqual('∆');
    expect(Utils.firstChar('ΩredΩ∆test')).toEqual('t');
    expect(Utils.firstChar('')).toEqual(null);
});

describe('advanceChars', () => {
    test('color', () => {
        expect(Utils.advanceChars('test ΩredΩtest∆ test', 0, 6)).toEqual(11);
    });

    test('color start/end', () => {
        expect(Utils.advanceChars('test ΩΩ test', 0, 6)).toEqual(7);
        expect(Utils.advanceChars('test ∆∆ test', 0, 6)).toEqual(7);
        expect(Utils.advanceChars('ΩredΩtest∆ test', 0, 6)).toEqual(12);
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
                '1ΩredΩ2∆3ΩredΩ4∆5ΩredΩ6∆7ΩredΩ8∆9ΩredΩ0∆1234567890',
                10
            )
        ).toEqual('1ΩredΩ2∆3ΩredΩ4∆5ΩredΩ6∆7ΩredΩ8∆9ΩredΩ0∆');
    });
});
