import * as Utils from './utils';

describe('Utils', () => {
    test('basics', () => {
        expect(Utils.NOOP()).toBeUndefined();
        expect(Utils.FALSE()).toBeFalsy();
        expect(Utils.TRUE()).toBeTruthy();
        expect(Utils.IDENTITY(4)).toEqual(4);
    });

    test('clamp', () => {
        expect(Utils.clamp(0, 1, 4)).toEqual(1);
        expect(Utils.clamp(1, 1, 4)).toEqual(1);
        expect(Utils.clamp(4, 1, 4)).toEqual(4);
        expect(Utils.clamp(5, 1, 4)).toEqual(4);
    });

    test('arrayNext', () => {
        const arr = [1, 2, 3, 4, 5, 6, 7, 8];

        expect(Utils.arrayNext(arr, 5, (n) => n % 2 == 0)).toEqual(6);
        expect(Utils.arrayNext(arr, 5, (n) => n % 4 == 0)).toEqual(8);
        expect(Utils.arrayNext(arr, 5, (n) => n == 3)).toEqual(3);
        expect(Utils.arrayNext(arr, 5, (n) => n == 3, false)).toBeUndefined(); // no wrap
        expect(Utils.arrayNext(arr, 5, (n) => n == 5)).toBeUndefined();
        expect(Utils.arrayNext(arr, 5, () => false)).toBeUndefined();

        expect(Utils.arrayNext([], 5, () => true)).toBeUndefined();
        expect(Utils.arrayNext(arr, 10, () => true)).toBeUndefined();
    });

    test('arrayPrev', () => {
        const arr = [1, 2, 3, 4, 5, 6, 7, 8];

        expect(Utils.arrayPrev(arr, 5, (n) => n % 2 == 0)).toEqual(4);
        expect(Utils.arrayPrev(arr, 5, (n) => n % 3 == 0)).toEqual(3);
        expect(Utils.arrayPrev(arr, 5, (n) => n == 7)).toEqual(7);
        expect(Utils.arrayPrev(arr, 5, (n) => n == 7, false)).toBeUndefined(); // no wrap
        expect(Utils.arrayPrev(arr, 5, (n) => n == 5)).toBeUndefined();
        expect(Utils.arrayPrev(arr, 5, () => false)).toBeUndefined();

        expect(Utils.arrayPrev([], 5, () => true)).toBeUndefined();
        expect(Utils.arrayPrev(arr, 10, () => true)).toBeUndefined();
    });

    test('arrayInsert', () => {
        const arr: number[] = [];
        Utils.arrayInsert(arr, 4, (o) => o > 4);
        expect(arr).toEqual([4]);

        Utils.arrayInsert(arr, 3, (o) => o > 3);
        expect(arr).toEqual([3, 4]);

        Utils.arrayInsert(arr, 5);
        expect(arr).toEqual([3, 4, 5]);

        Utils.arrayInsert(arr, 6, (o) => o > 6);
        expect(arr).toEqual([3, 4, 5, 6]);

        Utils.arrayInsert(arr, 4, (o) => o > 4);
        expect(arr).toEqual([3, 4, 4, 5, 6]);
    });

    test('valueType', () => {
        expect(Utils.valueType(4)).toEqual('number');
        expect(Utils.valueType('test')).toEqual('string');
        expect(Utils.valueType({ obj: true })).toEqual('object');
        expect(Utils.valueType([])).toEqual('array');
        expect(Utils.valueType(['a'])).toEqual('array');
        expect(Utils.valueType([4])).toEqual('array');
        expect(Utils.valueType({})).toEqual('object');
    });

    // test('combineValues', () => {
    //     expect(Utils.combineValues(undefined, 4)).toEqual(4);
    //     expect(Utils.combineValues(4, undefined)).toEqual(4);
    //     expect(Utils.combineValues(3, 4)).toEqual(4);
    //     expect(Utils.combineValues(4, 3)).toEqual(4);

    //     expect(Utils.combineValues([4], 3)).toEqual([4]);
    //     expect(Utils.combineValues([3], 4)).toEqual([4]);
    //     expect(Utils.combineValues([], 3)).toEqual([3]);
    //     expect(Utils.combineValues([4], [3])).toEqual([4]);

    //     expect(Utils.combineValues(4, [3])).toEqual([4]);
    //     expect(Utils.combineValues(3, [4])).toEqual([4]);
    //     expect(Utils.combineValues(3, [])).toEqual([3]);

    //     expect(Utils.combineValues('a', 'b')).toEqual('b');
    //     expect(Utils.combineValues(4, 'b')).toEqual('b');
    //     expect(Utils.combineValues('a', 4)).toEqual(4);
    //     expect(Utils.combineValues(['a'], 'b')).toEqual(['b']);
    // });
});
