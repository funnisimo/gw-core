import * as Grid from './grid';
import * as GW from './index';
// import * as UTILS from '../test/utils';
import { random } from './rng';

describe('GW.grid', () => {
    let a: Grid.NumGrid;

    // beforeEach(() => {
    //     UTILS.mockRandom();
    // });

    afterEach(() => {
        GW.grid.free(a);
        jest.restoreAllMocks();
    });

    test('alloc/free', () => {
        a = GW.grid.alloc(10, 10, 0);
        expect(a.width).toEqual(10);
        expect(a.height).toEqual(10);
        expect(a._data[9][9]).toEqual(0);
        expect(a.hasXY(0, 0)).toBeTruthy();

        GW.grid.free(a);
        GW.grid.free(a); // Can free multiple times

        const b = GW.grid.alloc(10, 10, 0);
        expect(b).toBe(a);
        const c = GW.grid.alloc(10, 10, 0);
        expect(c).not.toBe(a);

        GW.grid.free(c);
        GW.grid.free(b);

        expect(() => GW.grid.alloc(0, 4)).toThrow();
        expect(() => GW.grid.alloc(4, 0)).toThrow();

        // @ts-ignore
        GW.grid.free(null);

        GW.grid.free(a);
        a = GW.grid.alloc(8, 8, () => 2);
        expect(a.count(2)).toEqual(64);

        const d = GW.grid.alloc(6, 6, 2);
        expect(d.count(2)).toEqual(36);
        GW.grid.free(d);
    });

    test('get/set', () => {
        a = GW.grid.alloc(10, 10, 0);
        expect(a.set(3, 4, 5)).toBeTruthy();
        expect(a.get(3, 4)).toEqual(5);
        expect(a.set(-1, -1, 5)).toBeFalsy();
        expect(a.get(-1, -1)).toBeUndefined();
    });

    test('realloc', () => {
        a = GW.grid.alloc(10, 10);
        a.fill(1);
        expect(a._data[0][0]).toEqual(1);
        a.x = 4;
        a.y = 3;
        GW.grid.free(a);

        const b = GW.grid.alloc(10, 10);
        expect(b).toBe(a);
        expect(b._data[0][0]).toEqual(0);
        expect(b.x).toBeUndefined();
        expect(b.y).toBeUndefined();
        GW.grid.free(b);
    });

    test('alloc a clone', () => {
        a = GW.grid.alloc(10, 10);
        a.update(() => GW.rng.random.int(100) + 1);
        expect(a._data[0][0]).toBeGreaterThan(0);

        const b = GW.grid.alloc(a);
        b.forEach((v, x, y) => expect(a.get(x, y)).toEqual(v));

        GW.grid.free(a);
        GW.grid.free(b);
    });

    test('constructor', () => {
        a = new GW.grid.NumGrid(3, 3, (_x: number, _y: number) => 4);
        expect(a.count(4)).toEqual(9);
    });

    test('hasXY', () => {
        a = GW.grid.alloc(10, 10, 0);
        expect(a.hasXY(5, 5)).toBeTruthy();
        expect(a.hasXY(0, 0)).toBeTruthy();
        expect(a.hasXY(-1, 0)).toBeFalsy();
        expect(a.hasXY(0, -1)).toBeFalsy();
        expect(a.hasXY(9, 9)).toBeTruthy();
        expect(a.hasXY(10, 0)).toBeFalsy();
        expect(a.hasXY(0, 10)).toBeFalsy();
    });

    test('isBoundaryXY', () => {
        a = GW.grid.alloc(10, 10, 0);
        expect(a.isBoundaryXY(5, 5)).toBeFalsy();
        expect(a.isBoundaryXY(0, 0)).toBeTruthy();
        expect(a.isBoundaryXY(5, 0)).toBeTruthy();
        expect(a.isBoundaryXY(0, 5)).toBeTruthy();
        expect(a.isBoundaryXY(-1, 0)).toBeFalsy();
        expect(a.isBoundaryXY(0, -1)).toBeFalsy();
        expect(a.isBoundaryXY(9, 9)).toBeTruthy();
        expect(a.isBoundaryXY(5, 9)).toBeTruthy();
        expect(a.isBoundaryXY(9, 5)).toBeTruthy();
        expect(a.isBoundaryXY(10, 0)).toBeFalsy();
        expect(a.isBoundaryXY(0, 10)).toBeFalsy();
    });

    test('calcBounds', () => {
        a = GW.grid.alloc(10, 10);
        expect(a.calcBounds()).toEqual(new GW.xy.Bounds(0, 0, 0, 0));

        a._data[3][3] = 1;
        a._data[4][4] = 1;
        a._data[5][3] = 1;
        a._data[5][5] = 1;
        expect(a.calcBounds()).toEqual(new GW.xy.Bounds(3, 3, 3, 3));
    });

    test('forEachAsync', async () => {
        const fn = jest.fn().mockResolvedValue(true);

        a = GW.grid.alloc(10, 10, 0);

        await a.forEachAsync(fn);
        expect(fn).toHaveBeenCalledTimes(100);
    });

    test('eachNeighbor', () => {
        a = GW.grid.alloc(10, 10, 0);
        const fn = jest.fn();

        a.eachNeighbor(0, 0, fn);
        expect(fn).toHaveBeenCalledTimes(3);
        fn.mockClear();

        a.eachNeighbor(1, 1, fn);
        expect(fn).toHaveBeenCalledTimes(8);
        fn.mockClear();

        a.eachNeighbor(1, 1, fn, true);
        expect(fn).toHaveBeenCalledTimes(4);
        fn.mockClear();
    });

    test('eachNeighborAsync', async () => {
        a = GW.grid.alloc(10, 10, 0);
        const fn = jest.fn().mockResolvedValue(true);

        await a.eachNeighborAsync(0, 0, fn);
        expect(fn).toHaveBeenCalledTimes(3);
        fn.mockClear();

        await a.eachNeighborAsync(1, 1, fn);
        expect(fn).toHaveBeenCalledTimes(8);
        fn.mockClear();

        await a.eachNeighborAsync(1, 1, fn, true);
        expect(fn).toHaveBeenCalledTimes(4);
        fn.mockClear();
    });

    test('forRect', () => {
        a = GW.grid.alloc(10, 10, 0);
        const fn = jest.fn();

        a.forRect(0, 0, 2, 2, fn);
        expect(fn).toHaveBeenCalledTimes(4);
        fn.mockClear();

        a.forRect(1, 1, 3, 3, fn);
        expect(fn).toHaveBeenCalledTimes(9);
        fn.mockClear();

        a.forRect(-1, -1, 3, 3, fn);
        expect(fn).toHaveBeenCalledTimes(4);
    });

    test('randomEach', () => {
        GW.rng.random.seed(12345);
        const fn = jest.fn().mockReturnValue(false);

        a = GW.grid.alloc(10, 10);

        expect(a.randomEach(fn)).toBeFalsy();
        expect(fn).toHaveBeenCalledTimes(100);

        fn.mockClear();
        fn.mockImplementation((_v, x, y) => x === 3 && y === 5);

        expect(a.randomEach(fn)).toBeTruthy();
        expect(fn).toHaveBeenCalledTimes(11);
    });

    test('map', () => {
        a = GW.grid.alloc(10, 10, 0);
        a.fill(4);
        const fn = jest.fn().mockReturnValue(3);
        const b = a.map(fn);
        expect(fn).toHaveBeenCalledTimes(100);
        expect(b.count(3)).toEqual(100);
    });

    test('some', () => {
        a = GW.grid.alloc(10, 10);
        a._data[3][7] = 1;

        const fn = jest.fn().mockImplementation((v) => v === 1);
        expect(a.some(fn)).toBeTruthy();

        fn.mockReturnValue(false);
        expect(a.some(fn)).toBeFalsy();
    });

    test('forCircle', () => {
        a = GW.grid.alloc(10, 10);
        a.fill(4);
        const fn = jest
            .fn()
            .mockImplementation((v, x, y, g) => (g._data[x][y] = v / 2));
        a.forCircle(4, 4, 3, fn);
        expect(fn).toHaveBeenCalledTimes(37);
        expect(a.count(2)).toEqual(37);
        expect(a._data[0][4]).toEqual(4);
        expect(a._data[4][0]).toEqual(4);
        expect(a._data[8][4]).toEqual(4);
        expect(a._data[4][8]).toEqual(4);

        fn.mockClear();
        a.forCircle(-1, -1, 3, fn);
        expect(fn).toHaveBeenCalledTimes(6);
    });

    test('update', () => {
        a = GW.grid.alloc(10, 10);

        a.update(() => 2);
        expect(a._data[2][2]).toEqual(2);
    });

    test('updateRect', () => {
        a = GW.grid.alloc(10, 10);
        const fn = jest.fn().mockReturnValue(3);
        a.updateRect(2, 2, 3, 3, fn);
        expect(a.count(3)).toEqual(9);
        expect(fn).toHaveBeenCalledTimes(9);

        fn.mockClear();
        a.updateRect(-1, -1, 3, 3, fn);
        expect(fn).toHaveBeenCalledTimes(4);
    });

    test('updateCircle', () => {
        a = GW.grid.alloc(10, 10);
        const fn = jest.fn().mockReturnValue(3);
        a.updateCircle(4, 4, 3, fn);
        expect(a.count(3)).toEqual(37);

        fn.mockClear();
        a.updateCircle(-1, -1, 3, fn);
        expect(fn).toHaveBeenCalledTimes(6);
    });

    test('fill', () => {
        a = GW.grid.alloc(10, 10, 10);
        expect(a.count(0)).toEqual(0);
        a.fill(0);
        expect(a.count(0)).toEqual(100);

        const fn = jest.fn().mockReturnValue(2);
        a.fill(fn);
        expect(a.count(2)).toEqual(100);
    });

    test('fillRect', () => {
        a = GW.grid.alloc(10, 10);
        const fn = jest.fn().mockReturnValue(3);
        a.fillRect(2, 2, 3, 3, fn);
        expect(a.count(3)).toEqual(9);
        a.fillRect(3, 3, 3, 3, 9);
        expect(a.count(9)).toEqual(9);
    });

    test('fillCircle', () => {
        a = GW.grid.alloc(10, 10);
        const fn = jest.fn().mockReturnValue(3);
        a.fillCircle(4, 4, 3, fn);
        expect(a.count(3)).toEqual(37);
        a.fillCircle(4, 4, 3, 9);
        expect(a.count(9)).toEqual(37);
    });

    test('replace', () => {
        a = GW.grid.alloc(10, 10);
        a._data[3][3] = 4;
        expect(a._data[3][3]).toEqual(4);
        a.replace(4, 5);
        expect(a._data[3][3]).toEqual(5);
    });

    test('count', () => {
        a = GW.grid.alloc(10, 10);
        a._data[2][5] = 1;

        expect(a.count(1)).toEqual(1);
        expect(a.count((v) => !!v)).toEqual(1);
    });

    test('find', () => {
        a = GW.grid.alloc(10, 10);
        a._data[3][7] = 1;
        expect(a.find(1)).toEqual([3, 7]);
        expect(a.find(2)).toBeNull();
        const fn = jest.fn().mockImplementation((v) => v === 1);
        expect(a.find(fn)).toEqual([3, 7]);
        fn.mockReturnValue(false);
        expect(a.find(fn)).toBeFalsy();
    });

    test('dump', () => {
        a = GW.grid.alloc(10, 10, 10);
        a._data[1][1] = 1;
        // @ts-ignore
        a._data[2][2] = false;
        // @ts-ignore
        a._data[3][3] = true;
        a._data[4][4] = 14;
        a._data[5][5] = 56;
        // @ts-ignore
        a._data[6][6] = 'Fred';
        // @ts-ignore
        a._data[7][7] = [4, 5, 6];

        jest.spyOn(console, 'log').mockReturnValue(undefined);
        a.dump();
        expect(console.log).toHaveBeenCalledWith(
            ' 0] aaaaaaaaaa\n' +
                ' 1] a1aaaaaaaa\n' +
                ' 2] aa aaaaaaa\n' +
                ' 3] aaaTaaaaaa\n' +
                ' 4] aaaaeaaaaa\n' +
                ' 5] aaaaaUaaaa\n' +
                ' 6] aaaaaaFaaa\n' +
                ' 7] aaaaaaa#aa\n' +
                ' 8] aaaaaaaaaa\n' +
                ' 9] aaaaaaaaaa'
        );
    });

    test('dumpAround', () => {
        a = GW.grid.alloc(10, 10, 10);
        a._data[1][1] = 1;
        // @ts-ignore
        a._data[2][2] = false;
        // @ts-ignore
        a._data[3][3] = true;
        a._data[4][4] = 14;
        a._data[5][5] = 56;
        // @ts-ignore
        a._data[6][6] = 'Fred';
        // @ts-ignore
        a._data[7][7] = [4, 5, 6];

        jest.spyOn(console, 'log').mockReturnValue(undefined);
        a.dumpAround(4, 4, 3);
        expect(console.log).toHaveBeenCalledWith(
            ' 1]1aaaaaa\n' +
                ' 2]a aaaaa\n' +
                ' 3]aaTaaaa\n' +
                ' 4]aaaeaaa\n' +
                ' 5]aaaaUaa\n' +
                ' 6]aaaaaFa\n' +
                ' 7]aaaaaa#'
        );
    });

    test('floodFill', () => {
        a = GW.grid.alloc(20, 20, 0);
        a.fill(1);
        expect(a.count(1)).toEqual(400);
        a.floodFill(0, 0, 1, 2);
        expect(a.count(2)).toEqual(400);

        a.fillRect(2, 5, 9, 9, 3);
        expect(a.count(3)).toEqual(81);
        a.floodFill(5, 5, 3, 4);
        expect(a.count(4)).toEqual(81);

        a.floodFill(
            6,
            5,
            (v) => v === 4,
            () => 5
        );
        expect(a.count(5)).toEqual(81);
    });

    test('closestMatchingLocs', () => {
        a = GW.grid.alloc(10, 10, 0);
        a._data[4][1] = 1;
        a._data[2][3] = 1;

        function one(v: number) {
            return v == 1;
        }
        expect(a.closestMatchingLocs(2, 2, one)).toEqual([[2, 3]]);
        expect(a.closestMatchingLocs(4, 4, one)).toEqual([
            [2, 3],
            [4, 1],
        ]);
        expect(a.closestMatchingLocs(4, 2, one)).toEqual([[4, 1]]);
        expect(a.closestMatchingLocs(3, 2, one)).toEqual([
            [2, 3],
            [4, 1],
        ]);

        expect(a.closestMatchingLocs(2, 2, 1)).toEqual([[2, 3]]);
        expect(a.closestMatchingLocs(4, 4, 1)).toEqual([
            [2, 3],
            [4, 1],
        ]);
        expect(a.closestMatchingLocs(4, 2, 1)).toEqual([[4, 1]]);
        expect(a.closestMatchingLocs(3, 2, 1)).toEqual([
            [2, 3],
            [4, 1],
        ]);

        GW.grid.free(a);
    });

    test('firstMatchingLoc', () => {
        a = GW.grid.alloc(10, 10, 0);
        a._data[4][1] = 1;
        a._data[2][3] = 1;

        function one(v: number) {
            return v == 1;
        }
        expect(a.firstMatchingLoc(one)).toEqual([2, 3]);
        expect(a.firstMatchingLoc(1)).toEqual([2, 3]);

        function two(v: number) {
            return v == 2;
        }
        expect(a.firstMatchingLoc(two)).toEqual([-1, -1]);
        expect(a.firstMatchingLoc(2)).toEqual([-1, -1]);
    });

    test('randomMatchingXY', () => {
        // UTILS.mockRandom();
        random.seed(5);

        a = GW.grid.alloc(10, 10, 0);
        a._data[4][1] = 1;
        a._data[2][3] = 1;

        function one(v: number) {
            return v == 1;
        }

        const results: Record<number, number> = {};
        for (let i = 0; i < 1000; ++i) {
            const xy = GW.grid.randomMatchingXY(a, one)!;
            const v = xy.x * 10 + xy.y;
            results[v] = (results[v] || 0) + 1;
        }

        expect(results[23]).toBeGreaterThan(0);
        expect(results[41]).toBeGreaterThan(0);
        expect(Object.keys(results)).toEqual(['23', '41']);

        function two(v: number) {
            return v == 2;
        }
        expect(GW.grid.randomMatchingXY(a, two)).toBeUndefined();

        // random.seed(5);
        // expect(a.randomMatchingXY(one)).toEqual([4, 1]);
        // random.seed(50);
        // expect(a.randomMatchingXY(one)).toEqual([4, 1]);

        // some kind of error!
        const test = jest.fn().mockReturnValue(false);
        expect(GW.grid.randomMatchingXY(a, test)).toBeUndefined();
    });

    // test('matchingLocNear', () => {
    //     random.seed(12345);

    //     a = GW.grid.alloc(10, 10, 0);
    //     a._data[4][1] = 1;
    //     a._data[2][3] = 1;

    //     expect(a.matchingLocNear(3, 0, 1)).toEqual([4, 1]);
    //     expect(a.matchingLocNear(2, 3, 1)).toEqual([2, 3]);
    //     expect(a.matchingLocNear(2, 3, 2)).toEqual([-1, -1]);

    //     function one(v: number) {
    //         return v == 1;
    //     }
    //     expect(a.matchingLocNear(3, 0, one)).toEqual([4, 1]);

    //     a._data[4][3] = 1;
    //     expect(a.matchingLocNear(4, 2, 1)).toEqual([4, 1]);
    //     // expect(a.matchingLocNear(4, 2, 1, true)).toEqual([4, 3]);

    //     // // This is an error condition...
    //     // let normal = true;
    //     // const match = jest
    //     //     .fn()
    //     //     .mockImplementation((v: number, x: number, y: number) => {
    //     //         if (!normal) return false;
    //     //         if (x == 4 && y == 3) normal = false;
    //     //         return v == 1;
    //     //     });

    //     // expect(a.matchingLocNear(4, 2, match)).toEqual([-1, -1]);
    // });

    test('arcCount', () => {
        a = GW.grid.alloc(10, 10, 0);

        // all open around
        expect(a.arcCount(4, 3, GW.IS_ZERO)).toEqual(1);

        // one blocked
        a._data[3][3] = 1;
        expect(a.arcCount(4, 3, GW.IS_ZERO)).toEqual(1);
        a._data[3][2] = 1;
        expect(a.arcCount(4, 3, GW.IS_ZERO)).toEqual(1);
        a._data[3][4] = 1;
        expect(a.arcCount(4, 3, GW.IS_ZERO)).toEqual(1);

        // two blocked
        a._data[5][3] = 1;
        expect(a.arcCount(4, 3, GW.IS_ZERO)).toEqual(2);
        a._data[5][2] = 1;
        expect(a.arcCount(4, 3, GW.IS_ZERO)).toEqual(2);
        a._data[5][4] = 1;
        expect(a.arcCount(4, 3, GW.IS_ZERO)).toEqual(2);

        // T intersection
        a._data[5][3] = 0;
        expect(a.arcCount(4, 3, GW.IS_ZERO)).toEqual(3);

        // + intersection
        a._data[3][3] = 0;
        expect(a.arcCount(4, 3, GW.IS_ZERO)).toEqual(4);

        // all filled around
        a.fill(1);
        expect(a.arcCount(4, 3, GW.IS_ZERO)).toEqual(0);
    });

    test('findReplaceRange', () => {
        a = GW.grid.alloc(10, 10);

        a._data[5][4] = 5;
        a._data[3][2] = 4;
        a._data[1][2] = 3;
        a._data[7][6] = 2;

        expect(a.count(6)).toEqual(0);
        expect(a.count(3)).toEqual(1);
        expect(a.count(4)).toEqual(1);
        a.findReplaceRange(3, 4, 6);
        expect(a.count(6)).toEqual(2);
        expect(a.count(3)).toEqual(0);
        expect(a.count(4)).toEqual(0);
        expect(a.count(5)).toEqual(1);
        expect(a.count(2)).toEqual(1);
    });

    test('floodFillRange', () => {
        a = GW.grid.alloc(10, 10);
        a.fillRect(0, 0, 4, 4, 1);
        a.fillRect(7, 7, 3, 3, 2);
        a.fillRect(2, 4, 4, 4, 3);
        a.fillRect(6, 2, 4, 4, 4);
        a.fillRect(4, 5, 3, 3, 6);

        expect(a._data[2][7]).toEqual(3);
        expect(a._data[9][2]).toEqual(4);

        expect(a.floodFillRange(4, 4, 2, 5, 9)).toEqual(25);
        expect(a._data[2][7]).toEqual(9);
        expect(a._data[9][2]).toEqual(9);

        expect(a.count(2)).toEqual(9);
        expect(a.count(1)).toEqual(16);
        expect(a.count(6)).toEqual(9);
        expect(a.count(3)).toEqual(0);
        expect(a.count(4)).toEqual(0);
        expect(a.count(9)).toEqual(25);

        expect(a.floodFillRange(4, 5, 2, 5, 9)).toEqual(0);

        expect(() => a.floodFillRange(2, 2, 1, 5, 4)).toThrow();
    });

    test('invert', () => {
        a = GW.grid.alloc(10, 10);
        a.fillRect(0, 0, 4, 4, 1);
        a.fillRect(7, 7, 3, 3, 2);
        a.fillRect(2, 4, 4, 4, 3);
        a.fillRect(6, 2, 4, 4, 4);
        a.fillRect(4, 5, 3, 3, 6);

        expect(a.count(0)).toEqual(41);
        expect(a.count(1)).toEqual(16);
        expect(a.count(2)).toBeGreaterThan(0);
        a.invert();
        expect(a.count(0)).toEqual(59);
        expect(a.count(1)).toEqual(41);
        expect(a.count(2)).toEqual(0);
    });

    test('leastPositiveValue', () => {
        a = GW.grid.alloc(10, 10);
        a.fillRect(0, 0, 4, 4, -1);
        a.fillRect(7, 7, 3, 3, 2);
        a.fillRect(2, 4, 4, 4, 3);
        a.fillRect(6, 2, 4, 4, -4);
        a.fillRect(4, 5, 3, 3, 6);
        expect(a.leastPositiveValue()).toEqual(2);
    });

    test('randomLeastPositiveXY', () => {
        GW.rng.random.seed(12345);
        a = GW.grid.alloc(10, 10);
        a.fillRect(0, 0, 4, 4, -1);
        a.fillRect(7, 7, 3, 3, 2);
        a.fillRect(2, 4, 4, 4, 3);
        a.fillRect(6, 2, 4, 4, -4);
        a.fillRect(4, 5, 3, 3, 6);
        // a.dump();
        expect(GW.grid.randomLeastPositiveXY(a)).toEqual({ x: 8, y: 8 });
        expect(GW.grid.randomLeastPositiveXY(a)).toEqual({ x: 9, y: 9 });
        expect(GW.grid.randomLeastPositiveXY(a)).toEqual({ x: 8, y: 9 });
    });

    test('valueBounds', () => {
        a = GW.grid.alloc(10, 10);

        a.fillRect(3, 3, 4, 4, 1);
        const b = new GW.xy.Bounds();
        expect(a.calcBounds(1, b)).toBe(b);
        expect(b).toMatchObject({
            x: 3,
            y: 3,
            width: 4,
            height: 4,
        });
        expect(a.calcBounds(1)).toMatchObject({
            x: 3,
            y: 3,
            width: 4,
            height: 4,
        });
    });

    test('make', () => {
        const g = GW.grid.make(5, 6, () => 'taco');
        expect(g.width).toEqual(5);
        expect(g.height).toEqual(6);
        expect(g._data[0][0]).toEqual('taco');

        const v = GW.grid.make(3, 4, 6);
        expect(v._data[0][0]).toEqual(6);

        const u = GW.grid.make(10, 10);
        expect(u._data[0][0]).toEqual(0);
    });

    test('offsetZip', () => {
        a = Grid.alloc(10, 10, 0);
        a.fillRect(2, 2, 3, 3, 1);

        const dest = Grid.make(10, 10, 0);

        Grid.offsetZip(dest, a, 3, 2, 6);
        expect(dest._data[5][4]).toEqual(6);
        expect(dest._data[2][2]).toEqual(0);
    });

    test('intersection', () => {
        a = Grid.alloc(10, 10, 0);
        a.fillRect(2, 2, 3, 3, 1);

        const b = Grid.make(10, 10, 0);
        b.fillRect(4, 4, 3, 3, 2);

        Grid.intersection(b, a);
        expect(b._data[4][4]).toEqual(2);
        expect(b._data[2][2]).toEqual(0);
        expect(b._data[5][5]).toEqual(0);
    });

    test('unite', () => {
        a = Grid.alloc(10, 10, 0);
        a.fillRect(2, 2, 3, 3, 1);

        const b = Grid.make(10, 10, 0);
        b.fillRect(4, 4, 3, 3, 2);

        Grid.unite(b, a);
        expect(b._data[4][4]).toEqual(2);
        expect(b._data[2][2]).toEqual(1);
        expect(b._data[5][5]).toEqual(2);
    });
});

describe('Array', () => {
    test('makeArray', () => {
        const a = GW.grid.makeArray(10);
        expect(a).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

        const b = GW.grid.makeArray(10, 1);
        expect(b).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

        const c = GW.grid.makeArray(10, () => 2);
        expect(c).toEqual([2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
    });
});
