import 'jest-extended';
import '../test/matchers';
import * as UTILS from '../test/utils';
import * as Effect from './effect';
import * as Events from './events';
import * as MSG from './message';
import { data as DATA } from './gw';

describe('Effect', () => {
    afterEach(() => {
        DATA.gameHasEnded = false;
        jest.restoreAllMocks();
    });

    test('flags', () => {
        expect(Effect.Flags.E_BUILD_IN_WALLS).toBeGreaterThan(0);
    });

    test('install', () => {
        const te = Effect.install('TEST', {
            emit: 'FLOOR',
        });

        expect(Effect.effects.TEST).toBe(te);

        const te2 = Effect.install('TEST2', te);
        expect(te2).toBe(te);
        expect(Effect.effects.TEST2).toBe(te);

        expect(Effect.make('TEST2')).toBe(te2);
        expect(() => Effect.make('INVALID')).toThrow();
    });

    test('make', () => {
        const eff = Effect.make({
            emit: 'TEST',
            next: { message: 'YES!' }
        });

        expect(eff.next).not.toBeNull();
        expect(eff.next).toBeObject();
    });

    test('from', () => {
        const eff = Effect.install('T', {
            emit: 'TEST',
        });

        expect(Effect.from('T')).toBe(eff);

        const e2 = Effect.from(eff);
        expect(e2).toBe(eff);

        expect(() => Effect.from('INVALID')).toThrow();
    });

    test('resetAll', () => {
        Effect.installAll({
            TEST: { emit: 'FLOOR' },
            TEST2: { emit: 'WALL' },
        });

        Effect.effects.TEST.flags |= Effect.Flags.E_FIRED;
        Effect.effects.TEST2.flags |= Effect.Flags.E_FIRED;

        Effect.resetAll();

        expect(Effect.effects.TEST.flags & Effect.Flags.E_FIRED).toBeFalsy();
        expect(Effect.effects.TEST2.flags & Effect.Flags.E_FIRED).toBeFalsy();
    });

    describe('fn', () => {
        test('fn', async () => {
            const map = UTILS.mockMap(10, 10);
            const fn = jest.fn();
            const eff = Effect.make({ fn });

            expect(eff).not.toBeNull();
            const ctx = { map, x: 5, y: 5 };
            await eff!.fire(ctx.map, ctx.x, ctx.y);
            expect(fn).toHaveBeenCalledWith(eff, ctx.x, ctx.y);
        });

        test('default make', async () => {
            const map = UTILS.mockMap(10, 10);
            const fn = jest.fn();
            const eff = Effect.make(fn);

            expect(eff).not.toBeNull();
            const ctx = { map, x: 5, y: 5 };
            await eff!.fire(ctx.map, ctx.x, ctx.y);
            expect(fn).toHaveBeenCalledWith(eff, ctx.x, ctx.y);
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

    describe('emit', () => {
        afterEach(() => {
            Events.removeAllListeners();
        });

        test('not gonna happen', async () => {
            const eff = Effect.make({ emit: 'TEST' });
            await expect(Effect.effectEmit(eff, 3, 4)).resolves.toBeFalsy();
        });

        test('make', () => {
            expect(() => Effect.make({ emit: null })).toThrow();
        });

        test('emits', async () => {
            const map = UTILS.mockMap(10, 10);
            const eff = Effect.make({ emit: 'EMIT1' });

            expect(eff).not.toBeNull();
            const fn = jest.fn();
            Events.on('EMIT1', fn);
            const ctx = { map, x: 5, y: 5 };
            await eff!.fire(ctx.map, ctx.x, ctx.y);
            expect(fn).toHaveBeenCalledWith('EMIT1', ctx.x, ctx.y, eff);
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

            await te.fire(UTILS.mockMap(), 5, 5);
            expect(fn).toHaveBeenCalled();
        });
    });

    describe('next', () => {
        test('unknown next', async () => {
            const te = Effect.install('TEST', {
                emit: 'TACO',
                next: 'INVALID', // Not called
            });

            await expect(te.fire(UTILS.mockMap(), 5, 5)).rejects.toThrow();
        });

        test('gameHasEnded - stops before next', async () => {
            const te = Effect.install('TEST', {
                emit: 'TACO',
                next: 'INVALID', // Not called
            });

            const fn = jest.fn().mockImplementation(() => {
                DATA.gameHasEnded = true;
            });
            Events.on('TACO', fn);

            await expect(te.fire(UTILS.mockMap(), 5, 5)).resolves.toBeTruthy();
            expect(fn).toHaveBeenCalled();
        });

        test('E_NEXT_ALWAYS', async () => {
            const nextFn = jest.fn().mockReturnValue(true);
            Effect.install('NEXT', {
                fn: nextFn,
            });

            const firstFn = jest.fn().mockReturnValue(false); // did nothing
            const te2 = Effect.install('FIRST', {
                flags: 'E_NEXT_ALWAYS',
                fn: firstFn,
                next: 'NEXT',
            });

            expect(te2.next).toEqual('NEXT');
            expect(Effect.effects.NEXT).toBeObject();

            await expect(te2.fire(UTILS.mockMap(), 5, 5)).resolves.toBeTruthy();

            expect(firstFn).toHaveBeenCalled();
            expect(nextFn).toHaveBeenCalled();
        });

        test('E_NEXT_EVERYWHERE', async () => {
            const nextFn = jest.fn().mockReturnValue(true);
            Effect.install('NEXT', {
                fn: nextFn,
            });

            const firstFn = jest
                .fn()
                .mockImplementation(
                    (eff: Effect.Effect, x: number, y: number) => {
                        eff.grid[x][y] = 1;
                        eff.grid.eachNeighbor(x, y, (_v, i, j, g) => {
                            g[i][j] = 1;
                        });
                        return true;
                    }
                );
            const te2 = Effect.install('FIRST', {
                flags: 'E_NEXT_EVERYWHERE',
                fn: firstFn,
                next: 'NEXT',
            });

            expect(te2.next).toEqual('NEXT');
            expect(Effect.effects.NEXT).toBeObject();

            await expect(te2.fire(UTILS.mockMap(), 5, 5)).resolves.toBeTruthy();
            expect(firstFn).toHaveBeenCalled();
            expect(nextFn).toHaveBeenCalledTimes(9);
        });
    });

    describe('message', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('make', () => {
            expect(() => Effect.make({ message: null })).toThrow();
        });

        test('logs', async () => {
            const map = UTILS.mockMap(10, 10);
            const eff = Effect.make({ message: 'MSG' });
            expect(eff).not.toBeNull();
            jest.spyOn(MSG, 'add');
            const ctx = { map, x: 5, y: 5 };
            await eff!.fire(ctx.map, ctx.x, ctx.y);
            expect(MSG.add).toHaveBeenCalledWith('MSG', eff!.ctx);
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

    describe('multiple effects', () => {
        afterEach(() => {
            jest.restoreAllMocks();
            Events.removeAllListeners();
        });

        test('emits', async () => {
            const map = UTILS.mockMap(10, 10);
            const eff = Effect.make({ message: 'MSG3', emit: 'EMIT3' });
            expect(eff).not.toBeNull();

            jest.spyOn(MSG, 'add');

            const fn = jest.fn();
            Events.on('EMIT3', fn);

            const ctx = { map, x: 5, y: 5 };
            await eff!.fire(ctx.map, ctx.x, ctx.y);

            expect(fn).toHaveBeenCalledWith('EMIT3', ctx.x, ctx.y, eff);
            expect(MSG.add).toHaveBeenCalledWith('MSG3', eff!.ctx);

            // @ts-ignore
            MSG.add.mockClear();
            fn.mockClear();

            // Message already logged, so do not do it again...
            await eff!.fire(ctx.map, ctx.x, ctx.y);

            expect(fn).toHaveBeenCalledWith('EMIT3', ctx.x, ctx.y, eff);
            expect(MSG.add).not.toHaveBeenCalledWith('MSG3', eff!.ctx);

            // reset the effect - so message will be logged
            eff!.reset();

            // @ts-ignore
            MSG.add.mockClear();
            fn.mockClear();

            // Message already logged, so do not do it again...
            await eff!.fire(ctx.map, ctx.x, ctx.y);

            expect(fn).toHaveBeenCalledWith('EMIT3', ctx.x, ctx.y, eff);
            expect(MSG.add).toHaveBeenCalledWith('MSG3', eff!.ctx);
        });
    });
});
