import * as MSG from "./message";

describe("message", () => {
  function count() {
    let c = 0;
    MSG.forEach(() => ++c);
    return c;
  }

  test("add", () => {
    expect(count()).toEqual(0);
    MSG.add("test");
    expect(count()).toEqual(1);
  });
});
