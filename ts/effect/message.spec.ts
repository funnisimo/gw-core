import 'jest-extended';
import '../../test/matchers';
import * as UTILS from '../../test/utils';
import * as Effect from '.';
import * as MSG from '../message';

describe('message', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('make', () => {
        expect(() => Effect.make({ message: 1 })).toThrow();
        expect(() => Effect.make({ message: null })).not.toThrow();
    });

    test('logs', async () => {
        const map = UTILS.mockMap(10, 10);
        const eff = Effect.make({ message: 'MSG' });
        expect(eff).not.toBeNull();
        jest.spyOn(MSG, 'add');
        const ctx = { map, x: 5, y: 5 };
        await Effect.fire(eff, ctx.map, ctx.x, ctx.y, ctx);
        expect(MSG.add).toHaveBeenCalledWith('MSG', ctx);
    });

    // test('default make', async () => {
    //     const map = UTILS.mockMap(10, 10);
    //     const eff = Effect.make('MSG2', 'message');

    //     expect(eff).not.toBeNull();
    //     jest.spyOn(MSG, 'add');
    //     const ctx = { map, x: 5, y: 5 };
    //     await eff!.fire(ctx.map, ctx.x, ctx.y);
    //     expect(MSG.add).toHaveBeenCalledWith('MSG2', eff!.ctx);
    // });
});
