import * as GW from './index';
// import * as UTILS from '../test/utils';

describe('Blob', () => {
    let a: GW.grid.NumGrid;

    afterEach(() => {
        GW.grid.free(a);
    });

    test('fillBlob', () => {
        a = GW.grid.alloc(80, 30, 0);
        expect(a.count(1)).toEqual(0);

        GW.blob.fillBlob(a, {
            minBlobWidth: 4,
            minBlobHeight: 4,
            maxBlobWidth: 30,
            maxBlobHeight: 15,
            percentSeeded: 55,
        });
        expect(a.count(1)).toBeGreaterThan(10);
    });

    test('fillBlob - can handle min >= max', () => {
        GW.random.seed(123456);
        a = GW.grid.alloc(50, 30, 0);
        expect(a.count(1)).toEqual(0);

        GW.blob.fillBlob(a, {
            minBlobWidth: 12,
            minBlobHeight: 12,
            maxBlobWidth: 10,
            maxBlobHeight: 10,
            percentSeeded: 55,
        });

        expect(a.count(1)).toBeGreaterThan(10);
    });

    test('fillBlob', () => {
        GW.random.seed(12345);
        a = GW.grid.alloc(50, 50);

        const blob = new GW.blob.Blob({
            minBlobWidth: 5,
            minBlobHeight: 5,
            maxBlobWidth: 20,
            maxBlobHeight: 20,
            percentSeeded: 55,
        });

        let results = blob.carve(a.width, a.height, (x, y) => (a[x][y] = 1));
        expect(results).toEqual({
            x: 16,
            y: 23,
            width: 18,
            height: 12,
        });

        // force an odd return from '_cellularAutomataRound'

        // @ts-ignore
        jest.spyOn(blob, '_cellularAutomataRound').mockReturnValueOnce(false);

        a.fill(0);
        results = blob.carve(a.width, a.height, (x, y) => (a[x][y] = 1));

        expect(results).toEqual({
            x: 23,
            y: 15,
            width: 12,
            height: 14,
        });
    });
});
