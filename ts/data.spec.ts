import 'jest-extended';
import * as DATA from './data';

describe('DATA', () => {
    test('Obj', () => {
        const d = new DATA.Data();

        d.set('test', 4);
        expect(d.get('test')).toEqual(4);
        // @ts-ignore
        expect(d.test).toEqual(4);

        d.set('kind', 'apple');
        expect(d.get('kind')).toEqual('apple');
        // @ts-ignore
        expect(d.kind).toEqual('apple');
    });

    test('defaults', () => {
        const d = new DATA.Data({ a: 4, b: { c: 5 } });

        expect(d.get('a')).toEqual(4);
        expect(d.get('b.c')).toEqual(5);
    });
});
