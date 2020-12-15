import "jest-extended";
import * as Range from "./range";
import * as GW from "./gw";

describe("range", () => {
  test("constructor", () => {
    const r = new Range.Range(1, 3);
    expect(r.value()).toBeWithin(1, 4);
  });

  test("GW", () => {
    expect(GW.range).toBeDefined();
    expect(GW.range.make).toBeFunction();

    const r = GW.range.make("1-3");
    expect(r.value()).toBeWithin(1, 4);
  });
});
