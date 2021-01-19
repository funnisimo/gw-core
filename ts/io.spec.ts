import 'jest-extended';
import * as IO from "./io";

describe("IO", () => {
    test("addCommand", () => {
        async function handler(_: IO.Event) {
            return true;
        }

        IO.addCommand("test", handler);
        expect(IO.commands.test).toBe(handler);
    });


    test('loop', async () => {
        const handler = jest.fn().mockResolvedValue(true);
        const keymap = {
            a: handler
        };

        const result = IO.loop(keymap);
        expect(handler).not.toHaveBeenCalled();

        const ev = IO.makeKeyEvent({ key: 'a', code: 'KEY_A' } as KeyboardEvent);
        IO.pushEvent(ev);

        await result;
        expect(handler).toHaveBeenCalledWith(ev);
    });
});
