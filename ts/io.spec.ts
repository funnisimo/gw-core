import 'jest-extended';
import * as IO from './io';

describe('IO', () => {
    test('addCommand', () => {
        async function handler(_: IO.Event) {
            return true;
        }

        IO.addCommand('test', handler);
        expect(IO.commands.test).toBe(handler);
    });

    test('loop', async () => {
        const handler = jest.fn().mockResolvedValue(true);
        const keymap = {
            a: handler,
        };

        const loop = IO.make();

        expect(handler).not.toHaveBeenCalled();

        const ev = IO.makeKeyEvent({
            key: 'a',
            code: 'KEY_A',
        } as KeyboardEvent);
        const result = loop.run(keymap);
        loop.pushEvent(ev);

        await result;
        expect(handler).toHaveBeenCalledWith(ev);
    });

    test('run - single loop', async () => {
        const loop = IO.make();

        const p = loop.run(
            {
                keypress: (e) => {
                    // @ts-ignore
                    expect(loop.CURRENT_HANDLER).toBeNull();
                    if (e.key === 'p') return true;
                },
            },
            1000
        );

        loop.pushEvent(
            IO.makeKeyEvent({ key: 'e', code: 'KEY_E' } as KeyboardEvent)
        );

        loop.pushEvent(
            IO.makeKeyEvent({ key: 'p', code: 'KEY_P' } as KeyboardEvent)
        );

        await p;
    });
});
