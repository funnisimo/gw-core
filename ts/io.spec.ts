import 'jest-extended';
import * as UTILS from '../test/utils';
import * as IO from './io';

describe('IO', () => {
    // test('addCommand', () => {
    //     async function handler(_: IO.Event) {
    //         return true;
    //     }

    //     IO.addCommand('test', handler);
    //     expect(IO.commands.test).toBe(handler);
    // });

    test('loop', async () => {
        const keymap = {
            a(this: IO.Handler) {
                this.finish(123);
            },
        };

        const loop = IO.make();
        expect(loop.running).toBeFalsy();

        const ev = IO.makeKeyEvent({
            key: 'a',
            code: 'KEY_A',
        } as KeyboardEvent);

        const result = loop.run(keymap);
        expect(loop.running).toBeTruthy();

        IO.enqueue(ev);

        expect(await result).toEqual(123);
    });

    test('run - single loop', async () => {
        const loop = IO.make();

        const p = loop.run(
            {
                keypress: (e) => {
                    if (e.key === 'p') loop.finish();
                },
            },
            1000
        );

        loop.enqueue(
            IO.makeKeyEvent({ key: 'e', code: 'KEY_E' } as KeyboardEvent)
        );

        loop.enqueue(
            IO.makeKeyEvent({ key: 'p', code: 'KEY_P' } as KeyboardEvent)
        );

        await p;
    });

    test('simplest usage', async () => {
        const p = IO.nextEvent();

        const ev = IO.makeKeyEvent({
            key: 'e',
            code: 'KEY_E',
        } as KeyboardEvent);
        IO.enqueue(ev);

        expect(await p).toBe(ev);
    });

    test('custom event dispatch', async () => {
        const event = IO.makeCustomEvent('ACTION', { key: 'test' });

        const handler = jest.fn();

        await IO.dispatchEvent(event, { ACTION: handler });

        expect(handler).toHaveBeenCalledWith(event);
    });

    test('setTimeout', async () => {
        const handler = IO.make();
        // IO.loop.pushHandler(handler);

        const fn = jest.fn().mockImplementation(() => {
            handler.finish(123);
        });

        handler.setTimeout(fn, 200);
        const p = handler.run();

        IO.enqueue(UTILS.tick(100));
        IO.enqueue(UTILS.tick(100));

        expect(await p).toEqual(123);
    });
});
