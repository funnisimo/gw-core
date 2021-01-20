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

        expect(() => GW.grid.alloc(0, 4)).toThrow();
        expect(() => GW.grid.alloc(4, 0)).toThrow();
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
        a.x = 4;
        a.y = 3;
        GW.grid.free(a);

        const b = GW.grid.alloc(10, 10);
        expect(b).toBe(a);
        expect(b[0][0]).toEqual(0);
        expect(b.x).toBeUndefined();
        expect(b.y).toBeUndefined();
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

    test('matchingLocNear', () => {

        a = GW.grid.alloc(10, 10, 0);
        a[4][1] = 1;
        a[2][3] = 1;

        expect(a.matchingLocNear(3, 0, 1)).toEqual([4, 1]);
        expect(a.matchingLocNear(2, 3, 1)).toEqual([2, 3]);
        expect(a.matchingLocNear(2, 3, 2)).toEqual([-1, -1]);

        function one(v: number) { return v == 1; }
        expect(a.matchingLocNear(3, 0, one)).toEqual([4, 1]);

        a[4][3] = 1;
        expect(a.matchingLocNear(4, 2, 1)).toEqual([4, 1]);
        expect(a.matchingLocNear(4, 2, 1, true)).toEqual([4, 3]);

        // This is an error condition...
        let normal = true;
        const match = jest.fn().mockImplementation((v: number, x: number, y: number) => {
            if (!normal) return false;
            if (x == 4 && y == 3) normal = false;
            return v == 1;
        });

        expect(a.matchingLocNear(4, 2, match)).toEqual([-1, -1]);
    });

    test('arcCount', () => {

        a = GW.grid.alloc(10, 10, 0);

        // all open around
        expect(a.arcCount(4, 3, GW.utils.IS_ZERO)).toEqual(1);

        // one blocked
        a[3][3] = 1;
        expect(a.arcCount(4, 3, GW.utils.IS_ZERO)).toEqual(1);
        a[3][2] = 1;
        expect(a.arcCount(4, 3, GW.utils.IS_ZERO)).toEqual(1);
        a[3][4] = 1;
        expect(a.arcCount(4, 3, GW.utils.IS_ZERO)).toEqual(1);

        // two blocked
        a[5][3] = 1;
        expect(a.arcCount(4, 3, GW.utils.IS_ZERO)).toEqual(2);
        a[5][2] = 1;
        expect(a.arcCount(4, 3, GW.utils.IS_ZERO)).toEqual(2);
        a[5][4] = 1;
        expect(a.arcCount(4, 3, GW.utils.IS_ZERO)).toEqual(2);

        // T intersection
        a[5][3] = 0;
        expect(a.arcCount(4, 3, GW.utils.IS_ZERO)).toEqual(3);

        // + intersection
        a[3][3] = 0;
        expect(a.arcCount(4, 3, GW.utils.IS_ZERO)).toEqual(4);

        // all filled around
        a.fill(1);
        expect(a.arcCount(4, 3, GW.utils.IS_ZERO)).toEqual(0);

    });

    test('findReplaceRange', () => {
        a = GW.grid.alloc(10, 10);

        a[5][4] = 5;
        a[3][2] = 4;
        a[1][2] = 3;
        a[7][6] = 2;

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

        expect(a[2][7]).toEqual(3);
        expect(a[9][2]).toEqual(4);

        expect(a.floodFillRange(4, 4, 2, 5, 9)).toEqual(25);
        expect(a[2][7]).toEqual(9);
        expect(a[9][2]).toEqual(9);

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

    test('randomLeastPositiveLoc', () => {
        a = GW.grid.alloc(10, 10);
        a.fillRect(0, 0, 4, 4, -1);
        a.fillRect(7, 7, 3, 3, 2);
        a.fillRect(2, 4, 4, 4, 3);
        a.fillRect(6, 2, 4, 4, -4);
        a.fillRect(4, 5, 3, 3, 6);
        expect(a.randomLeastPositiveLoc()).toEqual([9, 7]);
        expect(a.randomLeastPositiveLoc(true)).toEqual([8, 8]);
    });

    test('fillBlob', () => {
        UTILS.mockRandom(12345);
        a = GW.grid.alloc(50, 50);
        let results = a.fillBlob(5, 5, 5, 20, 20, 55);

        expect(results).toEqual({
            x: 17, y: 25, width: 16, height: 9
        });

        // force an odd return from '_cellularAutomataRound'

        // @ts-ignore
        jest.spyOn(a, '_cellularAutomataRound').mockReturnValueOnce(false);

        a.fill(0);
        results = a.fillBlob(5, 5, 5, 20, 20, 55);

        expect(results).toEqual({
            x: 18, y: 15, width: 10, height: 20
        });

    });

    test('make', () => {
        const g = GW.grid.make(5, 6, () => 'taco');
        expect(g.width).toEqual(5);
        expect(g.height).toEqual(6);
        expect(g[0][0]).toEqual('taco');
    });

    test('offsetZip', () => {
        a = Grid.alloc(10, 10, 0);
        a.fillRect(2, 2, 3, 3, 1);

        const dest = Grid.make(10, 10, 0);

        Grid.offsetZip(dest, a, 3, 2, 6);
        expect(dest[5][4]).toEqual(6);
        expect(dest[2][2]).toEqual(0);
    });

    test('directionOfDoorSite', () => {
        a = Grid.alloc(10, 10, 0);

        a.fillRect(2, 2, 3, 3, 1);
        expect(Grid.directionOfDoorSite(a, 2, 4, 1)).toEqual(GW.utils.NO_DIRECTION);
        expect(Grid.directionOfDoorSite(a, 1, 3, 1)).toEqual(GW.utils.LEFT);
        expect(Grid.directionOfDoorSite(a, 5, 3, 1)).toEqual(GW.utils.RIGHT);
        expect(Grid.directionOfDoorSite(a, 3, 1, 1)).toEqual(GW.utils.DOWN);
        expect(Grid.directionOfDoorSite(a, 3, 5, 1)).toEqual(GW.utils.UP);
    });

    test('intersection', () => {
        a = Grid.alloc(10, 10, 0);
        a.fillRect(2, 2, 3, 3, 1);

        const b = Grid.make(10, 10, 0);
        b.fillRect(4, 4, 3, 3, 2);

        Grid.intersection(b, a);
        expect(b[4][4]).toEqual(2);
        expect(b[2][2]).toEqual(0);
        expect(b[5][5]).toEqual(0);
    });

    test('unite', () => {
        a = Grid.alloc(10, 10, 0);
        a.fillRect(2, 2, 3, 3, 1);

        const b = Grid.make(10, 10, 0);
        b.fillRect(4, 4, 3, 3, 2);

        Grid.unite(b, a);
        expect(b[4][4]).toEqual(2);
        expect(b[2][2]).toEqual(1);
        expect(b[5][5]).toEqual(2);
    });

});
