import * as Grid from "./grid";
import * as GW from "./index";
import * as UTILS from '../test/utils';
import { random } from "./random";

describe("GW.grid", () => {
    let a: Grid.NumGrid;

    afterEach(() => {
        GW.grid.free(a);
        jest.restoreAllMocks();
    });

    test("alloc/free", () => {
        a = GW.grid.alloc(10, 10, 0);
        expect(a.width).toEqual(10);
        expect(a.height).toEqual(10);
        expect(a[9][9]).toEqual(0);
        expect(a.hasXY(0, 0)).toBeTruthy();

    });

    test('get/set', () => {
        a = GW.grid.alloc(10, 10, 0);
        expect(a.set(3, 4, 5)).toBeTruthy();
        expect(a.get(3, 4)).toEqual(5);
        expect(a.set(-1, -1, 5)).toBeFalsy();
        expect(a.get(-1, -1)).toBeUndefined();
    });

    test("realloc", () => {
        a = GW.grid.alloc(10, 10);
        a.fill(1);
        expect(a[0][0]).toEqual(1);
        GW.grid.free(a);

        const b = GW.grid.alloc(10, 10);
        expect(b).toBe(a);
        expect(b[0][0]).toEqual(0);
        GW.grid.free(b);
    });

    test('constructor', () => {
        a = new GW.grid.NumGrid(3, 3, (_x: number, _y: number) => 4);
        expect(a.count(4)).toEqual(9);
    });

    test("hasXY", () => {
        a = GW.grid.alloc(10, 10, 0);
        expect(a.hasXY(5, 5)).toBeTruthy();
        expect(a.hasXY(0, 0)).toBeTruthy();
        expect(a.hasXY(-1, 0)).toBeFalsy();
        expect(a.hasXY(0, -1)).toBeFalsy();
        expect(a.hasXY(9, 9)).toBeTruthy();
        expect(a.hasXY(10, 0)).toBeFalsy();
        expect(a.hasXY(0, 10)).toBeFalsy();
    });

    test("isBoundaryXY", () => {
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
        expect(a.calcBounds()).toEqual({ left: 10, top: 10, right: 0, bottom: 0 });

        a[3][3] = 1;
        a[5][5] = 1;
        expect(a.calcBounds()).toEqual({ left: 3, top: 3, right: 5, bottom: 5 });
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

    test('forRect', () => {
        a = GW.grid.alloc(10, 10, 0);
        const fn = jest.fn();

        a.forRect(0, 0, 2, 2, fn);
        expect(fn).toHaveBeenCalledTimes(4);
        fn.mockClear();

        a.forRect(1, 1, 3, 3, fn);
        expect(fn).toHaveBeenCalledTimes(9);
        fn.mockClear();

    });

    test('map', () => {
        a = GW.grid.alloc(10, 10, 0);
        a.fill(4);
        const fn = jest.fn().mockReturnValue(3);
        const b = a.map(fn);
        expect(fn).toHaveBeenCalledTimes(100);
        expect(b.count(3)).toEqual(100);
    });

    test('forCircle', () => {
        a = GW.grid.alloc(10, 10);
        a.fill(4);
        const fn = jest.fn().mockImplementation((v, x, y, g) => g[x][y] = v / 2);
        a.forCircle(4, 4, 3, fn);
        expect(fn).toHaveBeenCalledTimes(37);
        expect(a.count(2)).toEqual(37);
        expect(a[0][4]).toEqual(4);
        expect(a[4][0]).toEqual(4);
        expect(a[8][4]).toEqual(4);
        expect(a[4][8]).toEqual(4);
    });

    test('updateRect', () => {
        a = GW.grid.alloc(10, 10);
        const fn = jest.fn().mockReturnValue(3);
        a.updateRect(2, 2, 3, 3, fn);
        expect(a.count(3)).toEqual(9);
    });

    test('updateCircle', () => {
        a = GW.grid.alloc(10, 10);
        const fn = jest.fn().mockReturnValue(3);
        a.updateCircle(4, 4, 3, fn);
        expect(a.count(3)).toEqual(37);
    });

    test("fill", () => {
        a = GW.grid.alloc(10, 10, 10);
        expect(a.count(0)).toEqual(0);
        a.fill(0);
        expect(a.count(0)).toEqual(100);
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
        a[3][3] = 4;
        expect(a[3][3]).toEqual(4);
        a.replace(4, 5);
        expect(a[3][3]).toEqual(5);
    });

    test('dump', () => {
        a = GW.grid.alloc(10, 10, 10);
        a[1][1] = 1;
        // @ts-ignore
        a[2][2] = false;
        // @ts-ignore
        a[3][3] = true;
        a[4][4] = 14;
        a[5][5] = 56;
        // @ts-ignore
        a[6][6] = 'Fred';
        // @ts-ignore
        a[7][7] = [4, 5, 6];

        jest.spyOn(console, 'log').mockReturnValue(undefined);
        a.dump();
        expect(console.log).toHaveBeenCalledWith(' 0] aaaaaaaaaa\n' +
            ' 1] a1aaaaaaaa\n' +
            ' 2] aa aaaaaaa\n' +
            ' 3] aaaTaaaaaa\n' +
            ' 4] aaaaeaaaaa\n' +
            ' 5] aaaaaUaaaa\n' +
            ' 6] aaaaaaFaaa\n' +
            ' 7] aaaaaaa#aa\n' +
            ' 8] aaaaaaaaaa\n' +
            ' 9] aaaaaaaaaa');
    });

    test('dumpAround', () => {
        a = GW.grid.alloc(10, 10, 10);
        a[1][1] = 1;
        // @ts-ignore
        a[2][2] = false;
        // @ts-ignore
        a[3][3] = true;
        a[4][4] = 14;
        a[5][5] = 56;
        // @ts-ignore
        a[6][6] = 'Fred';
        // @ts-ignore
        a[7][7] = [4, 5, 6];

        jest.spyOn(console, 'log').mockReturnValue(undefined);
        a.dumpAround(4, 4, 3);
        expect(console.log).toHaveBeenCalledWith(
            ' 1]1aaaaaa\n' +
            ' 2]a aaaaa\n' +
            ' 3]aaTaaaa\n' +
            ' 4]aaaeaaa\n' +
            ' 5]aaaaUaa\n' +
            ' 6]aaaaaFa\n' +
            ' 7]aaaaaa#');

    });

    test("fillBlob", () => {
        a = GW.grid.alloc(80, 30, 0);
        expect(a.count(1)).toEqual(0);

        a.fillBlob(5, 4, 4, 30, 15, 55, "ffffftttt", "ffffttttt");
        expect(a.count(1)).toBeGreaterThan(10);
    });

    test("fillBlob - can handle min >= max", () => {
        GW.random.seed(123456);
        a = GW.grid.alloc(50, 30, 0);
        expect(a.count(1)).toEqual(0);

        a.fillBlob(5, 12, 12, 10, 10, 55, "ffffftttt", "ffffttttt");
        expect(a.count(1)).toBeGreaterThan(10);
    });

    test("floodFill", () => {
        a = GW.grid.alloc(20, 20, 0);
        a.fill(1);
        expect(a.count(1)).toEqual(400);
        a.floodFill(0, 0, 1, 2);
        expect(a.count(2)).toEqual(400);
    });

    test('closestMatchingLoc', () => {
        UTILS.mockRandom();
        random.seed(5);

        a = GW.grid.alloc(10, 10, 0);
        a[4][1] = 1;
        a[2][3] = 1;

        function one(v: number) { return v == 1; }
        expect(a.closestMatchingLoc(2, 2, one)).toEqual([2, 3]);
        expect(a.closestMatchingLoc(4, 4, one)).toEqual([2, 3]);
        expect(a.closestMatchingLoc(4, 2, one)).toEqual([4, 1]);
        expect(a.closestMatchingLoc(3, 2, one)).toEqual([4, 1]);
    });

    test('firstMatchingLoc', () => {
        a = GW.grid.alloc(10, 10, 0);
        a[4][1] = 1;
        a[2][3] = 1;

        function one(v: number) { return v == 1; }
        expect(a.firstMatchingLoc(one)).toEqual([2, 3]);
        function two(v: number) { return v == 2; }
        expect(a.firstMatchingLoc(two)).toEqual([-1, -1]);
    });

    test('randomMatchingLoc', () => {
        UTILS.mockRandom();
        random.seed(5);

        a = GW.grid.alloc(10, 10, 0);
        a[4][1] = 1;
        a[2][3] = 1;

        function one(v: number) { return v == 1; }
        expect(a.randomMatchingLoc(one)).toEqual([2, 3]);

        random.seed(50);
        expect(a.randomMatchingLoc(one)).toEqual([4, 1]);

        function two(v: number) { return v == 2; }
        expect(a.randomMatchingLoc(two)).toEqual([-1, -1]);

        random.seed(5);
        expect(a.randomMatchingLoc(one, true)).toEqual([4, 1]);
        random.seed(50);
        expect(a.randomMatchingLoc(one, true)).toEqual([4, 1]);

        // some kind of error!
        let ok = false;
        const test = jest.fn().mockImplementation((v: number, x: number, y: number) => {
            if (x == 0 && y == 0) ok = !ok;
            if (!v) return false;
            return ok;
        });

        expect(a.randomMatchingLoc(test)).toEqual([-1, -1]);

    });
});
