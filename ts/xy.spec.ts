import * as XY from './xy';

describe('XY', () => {
    test('contains', () => {
        expect(XY.contains({ width: 10, height: 10 }, 5, 5)).toBeTruthy();
        expect(XY.contains({ width: 10, height: 10 }, 0, 5)).toBeTruthy();
        expect(XY.contains({ width: 10, height: 10 }, 5, 9)).toBeTruthy();
        expect(XY.contains({ width: 10, height: 10 }, 5, 0)).toBeTruthy();
        expect(XY.contains({ width: 10, height: 10 }, 9, 5)).toBeTruthy();

        expect(XY.contains({ width: 10, height: 10 }, 10, 5)).toBeFalsy();
        expect(XY.contains({ width: 10, height: 10 }, 5, 10)).toBeFalsy();

        expect(XY.contains({ width: 10, height: 10 }, -1, 5)).toBeFalsy();
        expect(XY.contains({ width: 10, height: 10 }, 15, 5)).toBeFalsy();
        expect(XY.contains({ width: 10, height: 10 }, 5, -1)).toBeFalsy();
        expect(XY.contains({ width: 10, height: 10 }, 5, 15)).toBeFalsy();
    });

    describe('Bounds', () => {
        test('empty', () => {
            const b = new XY.Bounds();
            expect(b).toMatchObject({ x: 0, y: 0, width: 0, height: 0 });
            expect(b.top).toEqual(0);
            expect(b.bottom).toEqual(0);
            expect(b.left).toEqual(0);
            expect(b.right).toEqual(0);
            expect(b.contains(0, 0)).toBeFalsy(); // really a point at this juncture

            b.right = 3;
            expect(b).toMatchObject({ x: 3, y: 0, width: 0, height: 0 });
            expect(b.left).toEqual(3);
            expect(b.right).toEqual(3);

            b.left = 0;
            expect(b).toMatchObject({ x: 0, y: 0, width: 0, height: 0 });
            expect(b.left).toEqual(0);
            expect(b.right).toEqual(0);

            b.bottom = 3;
            expect(b).toMatchObject({ x: 0, y: 3, width: 0, height: 0 });
            expect(b.top).toEqual(3);
            expect(b.bottom).toEqual(3);

            b.top = 0;
            expect(b).toMatchObject({ x: 0, y: 0, width: 0, height: 0 });
            expect(b.top).toEqual(0);
            expect(b.bottom).toEqual(0);

            b.height = 1;
            b.width = 1;
            expect(b).toMatchObject({ x: 0, y: 0, width: 1, height: 1 });
            expect(b.top).toEqual(0);
            expect(b.bottom).toEqual(1);
            expect(b.left).toEqual(0);
            expect(b.right).toEqual(1);

            b.right = 3;
            expect(b).toMatchObject({ x: 2, y: 0, width: 1, height: 1 });
            expect(b.left).toEqual(2);
            expect(b.right).toEqual(3);

            b.bottom = 3;
            expect(b).toMatchObject({ x: 2, y: 2, width: 1, height: 1 });
            expect(b.top).toEqual(2);
            expect(b.bottom).toEqual(3);

            b.left = 3;
            expect(b).toMatchObject({ x: 3, y: 2, width: 1, height: 1 });
            expect(b.left).toEqual(3);
            expect(b.right).toEqual(4);

            b.top = 3;
            expect(b).toMatchObject({ x: 3, y: 3, width: 1, height: 1 });
            expect(b.top).toEqual(3);
            expect(b.bottom).toEqual(4);

            expect(b.contains(b.x, b.y)).toBeTruthy();
            expect(b.contains(b.left, b.top)).toBeTruthy();

            expect(b.contains(b.right, b.top)).toBeFalsy();
            expect(b.contains(b.left, b.bottom)).toBeFalsy();
            expect(b.contains(b.right, b.bottom)).toBeFalsy();

            expect(b.contains(b.right - 1, b.bottom - 1)).toBeTruthy();
        });

        test('clone', () => {
            const b = new XY.Bounds(5, 6, 7, 8);
            const c = b.clone();
            expect(c.x).toEqual(b.x);
            expect(c.y).toEqual(b.y);
            expect(c.width).toEqual(b.width);
            expect(c.height).toEqual(b.height);
        });

        test('contains', () => {
            const b = new XY.Bounds(5, 6, 7, 8);
            expect(b.contains(5, 6)).toBeTruthy();
            expect(b.contains([5, 6])).toBeTruthy();
            expect(b.contains({ x: 5, y: 6 })).toBeTruthy();
        });

        test('toString', () => {
            const b = new XY.Bounds(5, 6, 7, 8);
            expect(b.toString()).toEqual('[5,6 -> 12,14]');
        });
    });

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

    test('lerpXY', () => {
        const a: XY.Loc = [5, 5];
        const b: XY.Loc = [10, 10];

        expect(XY.lerpXY(a, b, 0)).toEqual(a);
        expect(XY.lerpXY(a, b, 100)).toEqual(b);
        expect(XY.lerpXY(a, b, 50)).toEqual([7, 7]);
    });

    test('eachNeighbor', () => {
        const fn = jest.fn();

        XY.eachNeighbor(1, 1, fn, true);
        expect(fn).toHaveBeenCalledTimes(4);

        fn.mockClear();
        XY.eachNeighbor(1, 1, fn);
        expect(fn).toHaveBeenCalledTimes(8);
    });

    test('eachNeighborAsync', async () => {
        const fn = jest.fn().mockResolvedValue(1);

        const p = XY.eachNeighborAsync(1, 1, fn, true);
        expect(fn).toHaveBeenCalledTimes(1);
        await p;
        expect(fn).toHaveBeenCalledTimes(4);

        fn.mockClear();
        await XY.eachNeighborAsync(1, 1, fn);
        expect(fn).toHaveBeenCalledTimes(8);

        fn.mockClear();
        await XY.eachNeighborAsync(1, 1, fn, false);
        expect(fn).toHaveBeenCalledTimes(8);
    });

    test('matchingNeighbor', () => {
        const fn = jest.fn().mockReturnValue(true);
        expect(XY.matchingNeighbor(5, 5, fn, true)).toEqual([5, 4]);

        fn.mockImplementation((x, y) => x == 6 && y == 6);
        expect(XY.matchingNeighbor(5, 5, fn, true)).toEqual([-1, -1]);
        expect(XY.matchingNeighbor(5, 5, fn)).toEqual([6, 6]);
    });

    test('straightDistanceBetween', () => {
        expect(XY.straightDistanceBetween(5, 5, 6, 6)).toEqual(2);
        expect(XY.straightDistanceBetween(5, 0, 10, 0)).toEqual(5);
        expect(XY.straightDistanceBetween(0, 5, 0, 10)).toEqual(5);
        expect(XY.straightDistanceBetween(5, 5, 10, 10)).toEqual(10);
    });

    test('distanceBetween', () => {
        expect(XY.distanceBetween(5, 0, 10, 0)).toEqual(5);
        expect(XY.distanceBetween(0, 5, 0, 10)).toEqual(5);
        expect(XY.distanceBetween(5, 5, 10, 10)).toEqual(5 * 1.4);
    });

    test('calcRadius', () => {
        expect(XY.calcRadius(1, 1)).toEqual(1.4);
        expect(XY.calcRadius(2, 0)).toEqual(2);
        expect(XY.calcRadius(0, 2)).toEqual(2);
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

    test('isOppositeDir', () => {
        expect(XY.isOppositeDir([1, 0], [-1, 0])).toBeTruthy();
        expect(XY.isOppositeDir([0, 1], [0, -1])).toBeTruthy();

        expect(XY.isOppositeDir([1, 0], [-2, 0])).toBeTruthy();
        expect(XY.isOppositeDir([0, 1], [0, -2])).toBeTruthy();

        expect(XY.isOppositeDir([1, 0], [0, -1])).toBeFalsy();
        expect(XY.isOppositeDir([1, 0], [0, 1])).toBeFalsy();
    });

    test('isSameDir', () => {
        expect(XY.isSameDir([1, 0], [3, 0])).toBeTruthy();
        expect(XY.isSameDir([0, -3], [0, -1])).toBeTruthy();

        expect(XY.isSameDir([1, 0], [0, 1])).toBeFalsy();
        expect(XY.isSameDir([0, 3], [0, -1])).toBeFalsy();
    });

    test('dirSpread', () => {
        expect(XY.dirSpread([0, 1])).toEqual([
            [0, 1],
            [1, 1],
            [-1, 1],
        ]);
        expect(XY.dirSpread([1, 0])).toEqual([
            [1, 0],
            [1, 1],
            [1, -1],
        ]);
        expect(XY.dirSpread([1, 1])).toEqual([
            [1, 1],
            [1, 0],
            [0, 1],
        ]);
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

    test('forLine', () => {
        const fn = jest.fn();
        XY.forLine(0, 0, [1, 0], 5, fn);
        expect(fn).toHaveBeenCalledTimes(5);
        expect(fn).toHaveBeenCalledWith(0, 0);
        expect(fn).toHaveBeenCalledWith(1, 0);
        expect(fn).toHaveBeenCalledWith(2, 0);
        expect(fn).toHaveBeenCalledWith(3, 0);
        expect(fn).toHaveBeenCalledWith(4, 0);
    });

    describe('forLineBetween', () => {
        test('same loc', () => {
            const fn = jest.fn();
            XY.forLineBetween(2, 2, 2, 2, fn);
            expect(fn).toHaveBeenCalledTimes(0);
        });

        test('stop', () => {
            const fn = jest.fn();
            expect(XY.forLineBetween(2, 2, 7, 3, fn)).toBeTruthy();
            expect(fn).toHaveBeenCalledTimes(5);

            fn.mockClear();
            fn.mockReturnValueOnce(true)
                .mockReturnValueOnce(true)
                .mockReturnValue(false);
            expect(XY.forLineBetween(2, 2, 7, 3, fn)).toBeFalsy();
            expect(fn).toHaveBeenCalledTimes(3);
        });
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
