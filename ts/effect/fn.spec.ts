import 'jest-extended';
import '../../test/matchers';
import * as UTILS from '../../test/utils';
import * as Effect from '.';

describe('fn', () => {
    test('fn', async () => {
        const map = UTILS.mockMap(10, 10);
        const fn = jest.fn();
        const eff = Effect.make({ fn });

        expect(eff).not.toBeNull();
        const ctx = { map, x: 5, y: 5 };
        await Effect.fire(eff, ctx.map, ctx.x, ctx.y, ctx);
        expect(fn).toHaveBeenCalledWith(eff, map, ctx.x, ctx.y, ctx);
    });

    test('default make', async () => {
        const map = UTILS.mockMap(10, 10);
        const fn = jest.fn();
        const eff = Effect.make(fn);

        expect(eff).not.toBeNull();
        const ctx = { map, x: 5, y: 5 };
        await Effect.fire(eff, ctx.map, ctx.x, ctx.y, ctx);
        expect(fn).toHaveBeenCalledWith(eff, map, ctx.x, ctx.y, ctx);
    });

    // test('default make - with type', async () => {
    //     const map = UTILS.mockMap(10, 10);
    //     const fn = jest.fn();
    //     const eff = Effect.make(fn, 'fn');

    //     expect(eff).not.toBeNull();
    //     const ctx = { map, x: 5, y: 5 };
    //     await eff!.fire(ctx.map, ctx.x, ctx.y);
    //     expect(fn).toHaveBeenCalledWith(eff, ctx.x, ctx.y);
    // });
});
