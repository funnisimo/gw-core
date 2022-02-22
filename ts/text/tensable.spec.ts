import * as Tensable from './tensable';

describe('Tensable', () => {
    describe('nouns', () => {
        test('moose', () => {
            expect(Tensable.toSingularNoun('moose')).toEqual('moose');
            expect(Tensable.toPluralNoun('moose')).toEqual('moose');
            expect(Tensable.toQuantity('moose', 1)).toEqual('a moose');
            expect(Tensable.toQuantity('moose', 2)).toEqual('2 moose');
        });

        test('& moose', () => {
            expect(Tensable.toSingularNoun('& moose')).toEqual('moose');
            expect(Tensable.toPluralNoun('& moose')).toEqual('moose');
            expect(Tensable.toQuantity('& moose', 1)).toEqual('a moose');
            expect(Tensable.toQuantity('& moose', 2)).toEqual('2 moose');
        });

        test('test~', () => {
            expect(Tensable.toSingularNoun('test~')).toEqual('test');
            expect(Tensable.toPluralNoun('test~')).toEqual('tests');
            expect(Tensable.toQuantity('test~', 1)).toEqual('a test');
            expect(Tensable.toQuantity('test~', 2)).toEqual('2 tests');
        });

        test('& test~', () => {
            expect(Tensable.toSingularNoun('& test~')).toEqual('test');
            expect(Tensable.toPluralNoun('& test~')).toEqual('tests');
            expect(Tensable.toQuantity('& test~', 1)).toEqual('a test');
            expect(Tensable.toQuantity('& test~', 2)).toEqual('2 tests');
        });

        test('test[s]', () => {
            expect(Tensable.toSingularNoun('test[s]')).toEqual('test');
            expect(Tensable.toPluralNoun('test[s]')).toEqual('tests');
            expect(Tensable.toQuantity('test[s]', 1)).toEqual('a test');
            expect(Tensable.toQuantity('test[s]', 2)).toEqual('2 tests');
        });

        test('& test[s]', () => {
            expect(Tensable.toSingularNoun('& test[s]')).toEqual('test');
            expect(Tensable.toPluralNoun('& test[s]')).toEqual('tests');
            expect(Tensable.toQuantity('& test[s]', 1)).toEqual('a test');
            expect(Tensable.toQuantity('& test[s]', 2)).toEqual('2 tests');
        });

        test.todo('aaa[...|...]');

        test('|goose|geese|', () => {
            expect(Tensable.toSingularNoun('|goose|geese|')).toEqual('goose');
            expect(Tensable.toPluralNoun('|goose|geese|')).toEqual('geese');
            expect(Tensable.toQuantity('|goose|geese|', 1)).toEqual('a goose');
            expect(Tensable.toQuantity('|goose|geese|', 2)).toEqual('2 geese');
        });

        test('& |goose|geese|', () => {
            expect(Tensable.toSingularNoun('& |goose|geese|')).toEqual('goose');
            expect(Tensable.toPluralNoun('& |goose|geese|')).toEqual('geese');
            expect(Tensable.toQuantity('& |goose|geese|', 1)).toEqual(
                'a goose'
            );
            expect(Tensable.toQuantity('& |goose|geese|', 2)).toEqual(
                '2 geese'
            );
        });
    });

    describe('verbs', () => {
        test.todo('same ??');

        test('~', () => {
            expect(Tensable.toSingularVerb('test~')).toEqual('tests');
            expect(Tensable.toPluralVerb('test~')).toEqual('test');
        });

        test('eat[s]', () => {
            expect(Tensable.toSingularVerb('eat[s]')).toEqual('eats');
            expect(Tensable.toPluralVerb('eat[s]')).toEqual('eat');
        });

        test('go[es]', () => {
            expect(Tensable.toSingularVerb('go[es]')).toEqual('goes');
            expect(Tensable.toPluralVerb('go[es]')).toEqual('go');
        });

        test.todo('aaa[...|aaa]');
        test.todo('|a|b|');
    });
});
