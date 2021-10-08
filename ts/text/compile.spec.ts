import * as Compile from './compile';
import * as Config from './config';

describe('compile', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('no replacements', () => {
        const template = Compile.compile('test');
        expect(template({})).toEqual('test');
        // @ts-ignore
        expect(template()).toEqual('test');
    });

    test('placing a marker', () => {
        const template = Compile.compile('test §§!');
        expect(template({})).toEqual('test §!');
    });

    test('simple replacement', () => {
        const template = Compile.compile('My name is §name§.');
        expect(template({ name: 'Henry' })).toEqual('My name is Henry.');
    });

    test('simple object fields', () => {
        const template = Compile.compile('My name is §actor.name§.');
        expect(template({ actor: { name: 'Henry' } })).toEqual(
            'My name is Henry.'
        );
    });

    test('simple string data', () => {
        const template = Compile.compile('My name is §value§.');
        expect(template('Henry')).toEqual('My name is Henry.');
    });

    test('invalid format', () => {
        const t = Compile.compile('Test §a%4r§!');
        expect(t({ a: 4 })).toEqual('Test 4!');
    });

    test('base value', () => {
        let base = Compile.baseValue('field');

        expect(Config.helpers.default('field')).toEqual('!!field!!');

        expect(base({})).toEqual('!!field!!');
        expect(base({ field: 'test' })).toEqual('test');
        expect(base({ field: 3 })).toEqual(3);
        expect(base({ field: { obj: true } })).toEqual({ obj: true });
    });

    describe('field Value', () => {
        test('field from object', () => {
            const base = jest.fn().mockImplementation((a) => a);
            let field = Compile.fieldValue('field', base);
            expect(field({})).toEqual('[object Object].!!field!!');
            expect(field({ field: 'test' })).toEqual('test');
            expect(field({ field: 3 })).toEqual(3);
            expect(field({ field: { obj: true } })).toEqual({ obj: true });
        });

        test('field from types', () => {
            const base = jest.fn().mockImplementation((a) => a.test);
            let field = Compile.fieldValue('field', base);
            expect(field({ test: 4 })).toEqual('4.!!field!!');
            expect(field({ test: 'taco' })).toEqual('taco.!!field!!');
            expect(field({ test: null })).toEqual('null.!!field!!');
            expect(field({ test: [1, 2, 3] })).toEqual('1,2,3.!!field!!');
        });
    });

    describe('helper value', () => {
        test('missing helper', () => {
            const base = jest.fn().mockReturnValue('value');
            const helper = Compile.helperValue('missing', base);
            expect(helper({})).toEqual('value.!!missing!!');
        });

        test('helper', () => {
            const myHelper = jest.fn().mockReturnValue('test');
            Config.addHelper('myHelper', myHelper);
            const base = jest.fn().mockReturnValue('value');
            const helper = Compile.helperValue('myHelper', base);
            expect(helper({})).toEqual('test');
            expect(myHelper).toHaveBeenCalledWith('myHelper', {}, 'value');
        });
    });

    test('String Format', () => {
        const source = jest.fn().mockReturnValue('test');
        let format = Compile.stringFormat('%s', source);
        expect(format({})).toEqual('test');

        format = Compile.stringFormat('%10s', source);
        expect(format({})).toEqual('      test');

        format = Compile.stringFormat('%-10s', source);
        expect(format({})).toEqual('test      ');

        format = Compile.stringFormat('%', source);
        expect(format({})).toEqual('test');
    });

    test('Int Format', () => {
        const source = jest.fn().mockReturnValue('42');
        let format = Compile.intFormat('%d', source);
        expect(format({})).toEqual('42');

        format = Compile.intFormat('%4d', source);
        expect(format({})).toEqual('  42');

        format = Compile.intFormat('%+4d', source);
        expect(format({})).toEqual(' +42');

        format = Compile.intFormat('%-4d', source);
        expect(format({})).toEqual('42  ');

        format = Compile.intFormat('%-+4d', source);
        expect(format({})).toEqual('+42 ');

        format = Compile.intFormat('%', source);
        expect(format({})).toEqual('42');

        format = Compile.intFormat('%d', source);
        source.mockReturnValue(null);
        expect(format({})).toEqual('0');
    });

    test('Float Format', () => {
        const source = jest.fn().mockReturnValue('4.2');
        let format = Compile.floatFormat('%f', source);
        expect(format({})).toEqual('4.2');

        format = Compile.floatFormat('%5f', source);
        expect(format({})).toEqual('  4.2');

        format = Compile.floatFormat('%+5f', source);
        expect(format({})).toEqual(' +4.2');

        format = Compile.floatFormat('%-5f', source);
        expect(format({})).toEqual('4.2  ');

        format = Compile.floatFormat('%-+5f', source);
        expect(format({})).toEqual('+4.2 ');

        format = Compile.floatFormat('%5.2f', source);
        expect(format({})).toEqual(' 4.20');

        format = Compile.floatFormat('%', source);
        expect(format({})).toEqual('4.2');

        format = Compile.floatFormat('%2f', source);
        source.mockReturnValue(null);
        expect(format({})).toEqual(' 0');
    });

    describe('variable Value', () => {
        test('base', () => {
            const fn = Compile.makeVariable('base');
            expect(fn({ base: 'item' })).toEqual('item');
        });

        test('base.field', () => {
            const fn = Compile.makeVariable('base.field');
            expect(fn({ base: { field: 'item' } })).toEqual('item');
        });

        test('helper base', () => {
            const myHelper = jest
                .fn()
                .mockImplementation((_, __, v) => 'test:' + v);
            Config.addHelper('myHelper', myHelper);

            const fn = Compile.makeVariable('myHelper base');
            expect(fn({ base: 'item' })).toEqual('test:item');
        });

        test('helper base.field', () => {
            const myHelper = jest
                .fn()
                .mockImplementation((_, __, v) => 'test:' + v);
            Config.addHelper('myHelper', myHelper);

            const fn = Compile.makeVariable('myHelper base.field');
            expect(fn({ base: { field: 'item' } })).toEqual('test:item');
        });

        test('base%format', () => {
            const fn = Compile.makeVariable('base%10s');
            expect(fn({ base: 'item' })).toEqual('      item');
        });

        test('base.field%format', () => {
            const fn = Compile.makeVariable('base.field%4d');
            expect(fn({ base: { field: 4 } })).toEqual('   4');
        });

        test('helper base%format', () => {
            const myHelper = jest
                .fn()
                .mockImplementation((_, __, v) => v + 1.1);
            Config.addHelper('myHelper', myHelper);

            const fn = Compile.makeVariable('myHelper base%5.2f');
            expect(fn({ base: 2.2 })).toEqual(' 3.30');
        });

        test('helper base.field%format', () => {
            const myHelper = jest
                .fn()
                .mockImplementation((_, __, v) => 'test:' + v);
            Config.addHelper('myHelper', myHelper);

            const fn = Compile.makeVariable('myHelper base.field%-12s');
            expect(fn({ base: { field: 'item' } })).toEqual('test:item   ');
        });

        test('empty', () => {
            const fn = Compile.makeVariable('');
            expect(fn({})).toEqual('!!undefined!!');
        });

        test('invalid format', () => {
            const fn = Compile.makeVariable('test%4r');
            expect(fn({})).toEqual('!!test!!');
        });
    });

    describe('default helper', () => {
        let original: Config.HelperFn;

        beforeAll(() => {
            original = Config.helpers.default;
        });

        afterEach(() => {
            for (let key in Config.helpers) {
                delete Config.helpers[key];
            }
            Config.helpers.default = original;
        });

        test('custom default', () => {
            const defaultHelper = jest
                .fn()
                .mockImplementation((name, args, value) => {
                    if (name === 'you') {
                        args._current = value || args.actor;
                        return `you:${args._current}`;
                    }
                    if (name === 'the') {
                        args._current = value;
                        return `the:${value}`;
                    }
                    return `${name}:${args._current}`;
                });
            Config.addHelper('default', defaultHelper);

            const fn = Compile.compile('§you§ §ate§ §the item§.');
            const text = fn({ actor: 'Fred', item: 'taco' });
            expect(text).toEqual('you:Fred ate:Fred the:taco.');

            expect(defaultHelper).toHaveBeenCalledTimes(3);
        });

        test('helper chain', () => {
            const defaultHelper = jest
                .fn()
                .mockImplementation((name, args, _) => {
                    return `${name}:${args._current}`;
                });
            Config.addHelper('default', defaultHelper);

            const youHelper = jest.fn().mockImplementation((_, args, value) => {
                args._current = value || args.actor;
                return `you:${args._current}`;
            });
            Config.addHelper('you', youHelper);

            const theHelper = jest.fn().mockImplementation((_, args, value) => {
                args._current = value || args.actor;
                return `the:${args._current}`;
            });
            Config.addHelper('the', theHelper);

            const fn = Compile.compile('§you§ §ate§ §the item§.');
            const text = fn({ actor: 'Fred', item: 'taco' });
            expect(text).toEqual('you:Fred ate:Fred the:taco.');

            expect(defaultHelper).toHaveBeenCalledTimes(1);
            expect(youHelper).toHaveBeenCalledTimes(1);
            expect(theHelper).toHaveBeenCalledTimes(1);
        });

        test('helper parameters', () => {
            const verbHelper = jest.fn().mockImplementation((_, args, __) => {
                return `verb:${args.verb}`;
            });
            Config.addHelper('verb', verbHelper);

            const fn = Compile.compile('you §verb§ the item.');
            const text = fn({ verb: 'ate' });
            expect(text).toEqual('you verb:ate the item.');
            expect(verbHelper).toHaveBeenCalledTimes(1);
        });
    });

    test('apply', () => {
        expect(Compile.apply('a §test§!', { test: 'taco' })).toEqual('a taco!');
        expect(Compile.apply('a §test§!')).toEqual('a !!test!!!');
    });

    describe('options', () => {
        test('custom field marker', () => {
            const a = Compile.compile('a ^test^!', { field: '^' });
            expect(a({ test: 'taco' })).toEqual('a taco!');
            expect(a({})).toEqual('a !!test!!!');
        });
    });
});
