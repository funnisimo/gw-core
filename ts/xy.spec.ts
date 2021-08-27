import * as XY from './xy';

describe('XY', () => {
    test('copyXY', () => {
        const dest = { x: 0, y: 0 };

        XY.copyXY(dest, { x: 4, y: 5 });
        expect(dest).toEqual({ x: 4, y: 5 });

        XY.copyXY(dest, [2, 3]);
        expect(dest).toEqual({ x: 2, y: 3 });
    });

    test('addXY', () => {
        const dest = { x: 0, y: 0 };

        XY.addXY(dest, { x: 4, y: 5 });
        expect(dest).toEqual({ x: 4, y: 5 });

        XY.addXY(dest, [2, 3]);
        expect(dest).toEqual({ x: 6, y: 8 });
    });

    test('equalsXY', () => {
        const dest = { x: 2, y: 3 };

        expect(XY.equalsXY(dest, { x: 4, y: 5 })).toBeFalsy();
        expect(XY.equalsXY(dest, { x: 4, y: 3 })).toBeFalsy();
        expect(XY.equalsXY(dest, { x: 2, y: 5 })).toBeFalsy();
        expect(XY.equalsXY(dest, { x: 2, y: 3 })).toBeTruthy();

        expect(XY.equalsXY(dest, [4, 5])).toBeFalsy();
        expect(XY.equalsXY(dest, [4, 3])).toBeFalsy();
        expect(XY.equalsXY(dest, [2, 5])).toBeFalsy();
        expect(XY.equalsXY(dest, [2, 3])).toBeTruthy();
    });

    test('distanceBetween', () => {
        expect(XY.distanceBetween(5, 0, 10, 0)).toEqual(5);
        expect(XY.distanceBetween(0, 5, 0, 10)).toEqual(5);
        expect(XY.distanceBetween(5, 5, 10, 10)).toEqual(5 * 1.4);
    });

    test('distanceFromTo', () => {
        expect(XY.distanceFromTo({ x: 5, y: 0 }, { x: 10, y: 0 })).toEqual(5);
        expect(XY.distanceFromTo([5, 0], [10, 0])).toEqual(5);
    });

    test('dirBetween', () => {
        expect(XY.dirBetween(0, 0, 3, 0)).toEqual([1, 0]);
        expect(XY.dirBetween(0, 0, 0, -3)).toEqual([0, -1]);
        expect(XY.dirBetween(0, 0, 10, 9)).toEqual([1, 1]);
        expect(XY.dirBetween(0, 0, -10, 9)).toEqual([-1, 1]);
    });

    test('dirFromTo', () => {
        expect(XY.dirFromTo({ x: 0, y: 0 }, { x: 5, y: -1 })).toEqual([1, 0]);
        expect(XY.dirFromTo([0, 0], { x: -5, y: -10 })).toEqual([0, -1]);
    });

    test('dirIndex', () => {
        expect(XY.dirIndex([0, 0])).toEqual(XY.NO_DIRECTION);
        expect(XY.dirIndex([2, 0])).toEqual(XY.NO_DIRECTION);
        expect(XY.dirIndex([1, 0])).toEqual(XY.RIGHT);
        expect(XY.dirIndex([-1, 1])).toEqual(XY.LEFT_DOWN);
    });

    test('stepFromTo', () => {
        const fn = jest.fn();
        XY.stepFromTo([0, 0], [2, 4], fn);
        expect(fn).toHaveBeenCalledWith(0, 0);
        expect(fn).toHaveBeenCalledWith(0, 1);
        expect(fn).toHaveBeenCalledWith(1, 2);
        expect(fn).toHaveBeenCalledWith(1, 3);
        expect(fn).toHaveBeenCalledWith(2, 4);
        expect(fn).toHaveBeenCalledTimes(5);
    });

    describe('getLine', () => {
        test('straight', () => {
            const a = XY.getLine(2, 0, 6, 0);
            expect(a).toEqual([
                [3, 0],
                [4, 0],
                [5, 0],
                [6, 0],
            ]);

            const b = XY.getLine(0, 2, 0, 6);
            expect(b).toEqual([
                [0, 3],
                [0, 4],
                [0, 5],
                [0, 6],
            ]);

            const c = XY.getLine(6, 0, 2, 0);
            expect(c).toEqual([
                [5, 0],
                [4, 0],
                [3, 0],
                [2, 0],
            ]);

            const d = XY.getLine(0, 6, 0, 2);
            expect(d).toEqual([
                [0, 5],
                [0, 4],
                [0, 3],
                [0, 2],
            ]);
        });

        test('diagonal', () => {
            const a = XY.getLine(2, 0, 6, 4);
            expect(a).toEqual([
                [3, 1],
                [4, 2],
                [5, 3],
                [6, 4],
            ]);

            const b = XY.getLine(0, 2, 4, 6);
            expect(b).toEqual([
                [1, 3],
                [2, 4],
                [3, 5],
                [4, 6],
            ]);

            const c = XY.getLine(6, 4, 2, 0);
            expect(c).toEqual([
                [5, 3],
                [4, 2],
                [3, 1],
                [2, 0],
            ]);

            const d = XY.getLine(4, 6, 0, 2);
            expect(d).toEqual([
                [3, 5],
                [2, 4],
                [1, 3],
                [0, 2],
            ]);
        });

        test('crooked', () => {
            const a = XY.getLine(2, 0, 5, 5);
            expect(a).toEqual([
                [3, 1],
                [3, 2],
                [4, 3],
                [4, 4],
                [5, 5],
            ]);

            const b = XY.getLine(0, 2, 5, 5);
            expect(b).toEqual([
                [1, 3],
                [2, 3],
                [3, 4],
                [4, 4],
                [5, 5],
            ]);

            const c = XY.getLine(5, 5, 2, 0);
            expect(c).toEqual([
                [4, 4],
                [4, 3],
                [3, 2],
                [3, 1],
                [2, 0],
            ]);

            const d = XY.getLine(5, 5, 0, 2);
            expect(d).toEqual([
                [4, 4],
                [3, 4],
                [2, 3],
                [1, 3],
                [0, 2],
            ]);
        });
    });
});
