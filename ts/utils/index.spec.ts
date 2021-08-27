import * as Utils from '.';

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
});
