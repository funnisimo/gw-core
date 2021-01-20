import "jest-extended";
import * as GW from "./gw";

describe("GW", () => {
  test("exports", () => {
    expect(GW.data).toBeObject();
    expect(GW.config).toBeObject();
    expect(GW.make).toBeObject();
  });
});
