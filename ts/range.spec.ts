import 'jest-extended';
import * as Range from './range';
import * as GW from './index';

describe('range', () => {
    test('constructor', () => {
        const r = new Range.Range(1, 3);
        expect(r.value()).toBeWithin(1, 4);
    });

    test('make', () => {
        expect(GW.range).toBeDefined();
        expect(GW.range.make).toBeFunction();

        const r = GW.range.make('1-3');
        expect(r.lo).toEqual(1);
        expect(r.hi).toEqual(3);
        expect(r.value()).toBeWithin(1, 4);

        const r2 = GW.range.make('5+');
        expect(r2.lo).toEqual(5);
        expect(r2.hi).toEqual(Number.MAX_SAFE_INTEGER);
    });
});
