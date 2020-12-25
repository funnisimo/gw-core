import * as GW from "./index";

const Fl = GW.flag.fl;

describe("flag", () => {
  test("enum", () => {
    enum Flag {
      A = Fl(0),
      B = Fl(1),
      C = Fl(2),
      D = Fl(3),
      AB = A | B,
      BC = B | C,
      AD = A | D,
    }

    expect(Flag.A).toEqual(1);
    expect(Flag.B).toEqual(2);
    expect(Flag.C).toEqual(4);
    expect(Flag.D).toEqual(8);
    expect(Flag.AB).toEqual(3);
    expect(Flag.BC).toEqual(6);
    expect(Flag.AD).toEqual(9);

    expect(GW.flag.toString(Flag, 11)).toEqual("A | B | D");
    expect(GW.flag.from(Flag, "A")).toEqual(Flag.A);
    expect(GW.flag.from(Flag, "UNKNOWN")).toEqual(0);
    expect(GW.flag.from(Flag, "A | B")).toEqual(Flag.AB);

    expect(GW.flag.from(Flag, "2 | A")).toEqual(Flag.AB);
    expect(GW.flag.from(Flag, Flag.D, "2 | A")).toEqual(
      Flag.D | Flag.A | Flag.B
    );
    expect(GW.flag.from(Flag, Flag.AB, "!A")).toEqual(Flag.B);
    expect(GW.flag.from(Flag, Flag.AB, "0, D")).toEqual(Flag.D);

    expect(GW.flag.toString(Flag, Flag.A | Flag.B | Flag.C | Flag.D)).toEqual(
      "A | B | C | D"
    );
  });
});
