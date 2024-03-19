import * as GW from './index';
// import { xy } from './xy';
// import * as UTILS from '../test/utils';

describe('Blob', () => {
    let a: GW.grid.NumGrid;

    beforeEach(() => {
        GW.random.seed(12345);
    });
    afterEach(() => {
        GW.grid.free(a);
    });

    test('default constructor', () => {
        const blob = new GW.blob.Blob();
        expect(blob.options.minHeight).toBeGreaterThan(0);
        expect(blob.options.minHeight).toBeGreaterThan(0);
    });

    test('make', () => {
        const blob = GW.blob.make();
        expect(blob).toBeDefined();
    });

    test('fillBlob - default', () => {
        a = GW.grid.alloc(80, 30, 0);

        expect(a.count(1)).toEqual(0);

        GW.blob.fillBlob(a);

        expect(a.count(1)).toBeGreaterThan(0);

        GW.grid.free(a);
    });

    test('fillBlob', () => {
        a = GW.grid.alloc(80, 30, 0);
        expect(a.count(1)).toEqual(0);

        GW.blob.fillBlob(a, {
            minWidth: 4,
            minHeight: 4,
            maxWidth: 30,
            maxHeight: 15,
            percentSeeded: 55,
        });
        expect(a.count(1)).toBeGreaterThan(10);
    });

    test('fillBlob - can handle min >= max', () => {
        GW.rng.random.seed(123456);
        a = GW.grid.alloc(50, 30, 0);
        expect(a.count(1)).toEqual(0);

        GW.blob.fillBlob(a, {
            minWidth: 12,
            minHeight: 12,
            maxWidth: 10,
            maxHeight: 10,
            percentSeeded: 55,
        });

        expect(a.count(1)).toBeGreaterThan(10);
    });

    test('fillBlob', () => {
        GW.rng.random.seed(12345);
        a = GW.grid.alloc(50, 50);

        const blob = new GW.blob.Blob({
            minWidth: 5,
            minHeight: 5,
            maxWidth: 20,
            maxHeight: 20,
            percentSeeded: 55,
        });

        let results = blob.carve(a.width, a.height, (x, y) => a.set(x, y, 1));
        expect(results).toEqual({
            x: 16,
            y: 23,
            width: 18,
            height: 12,
        });

        // force an odd return from 'cellularAutomataRound'
        jest.spyOn(GW.blob, 'cellularAutomataRound').mockReturnValueOnce(false);

        a.fill(0);
        results = blob.carve(a.width, a.height, (x, y) => a.set(x, y, 1));

        expect(results).toEqual(new GW.xy.Bounds(24, 15, 9, 13));
    });
});
