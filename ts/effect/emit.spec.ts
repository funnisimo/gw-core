import 'jest-extended';
import '../../test/matchers';
import * as UTILS from '../../test/utils';
import * as Effect from '.';
import * as Events from '../events';

describe('emit', () => {
    afterEach(() => {
        Events.removeAllListeners();
    });

    // test('not gonna happen', async () => {
    //     const eff = Effect.make({ emit: 'TEST' });
    //     await expect(Effect.effectEmit(eff, 3, 4)).resolves.toBeFalsy();
    // });

    test('make', () => {
        expect(() => Effect.make({ emit: null })).not.toThrow();
        expect(() => Effect.make({ emit: 1 })).toThrow();
    });

    test('emits', async () => {
        const map = UTILS.mockMap(10, 10);
        const eff = Effect.make({ emit: 'EMIT1' });

        expect(eff).not.toBeNull();
        const fn = jest.fn();
        Events.on('EMIT1', fn);
        const ctx = { map, x: 5, y: 5 };
        await Effect.fire(eff, map, ctx.x, ctx.y, ctx);
        expect(fn).toHaveBeenCalledWith('EMIT1', ctx.x, ctx.y, ctx);
    });

    // test('default make', async () => {
    //     const map = UTILS.mockMap(10, 10);
    //     const eff = Effect.make('EMIT2', 'emit');

    //     expect(eff).not.toBeNull();
    //     const fn = jest.fn();
    //     Events.on('EMIT2', fn);
    //     const ctx = { map, x: 5, y: 5 };
    //     await eff!.fire(ctx.map, ctx.x, ctx.y);
    //     expect(fn).toHaveBeenCalledWith('EMIT2', ctx.x, ctx.y, eff);
    // });

    test('emit', async () => {
        const te = Effect.install('TEST', {
            emit: 'TACO',
        });

        const fn = jest.fn();
        Events.on('TACO', fn);

        await Effect.fire(te, UTILS.mockMap(), 5, 5);
        expect(fn).toHaveBeenCalled();
    });
});
