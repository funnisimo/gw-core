import * as IO from "./io";

describe("IO", () => {
  test("addCommand", () => {
    async function handler(_: IO.Event) {
      return true;
    }

    IO.addCommand("test", handler);
    expect(IO.commands.test).toBe(handler);
  });
});
