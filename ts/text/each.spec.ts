import * as Each from "./each";
import * as Config from "./config";

describe("each", () => {
  describe("eachChar", () => {
    let output: string;
    let eachFn: jest.Mock<any, any>;

    beforeEach(() => {
      output = "";
      eachFn = jest.fn().mockImplementation((ch, fg, bg) => {
        if (!fg) fg = "";
        if (!bg) bg = "";
        if (fg || bg) {
          output += `#${fg}|${bg}#`;
        }
        output += ch;
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    test("Simple text", () => {
      const fn = jest.fn();

      Each.eachChar("test", fn);
      expect(fn).toHaveBeenCalledTimes(4);
      expect(fn).toHaveBeenCalledWith("t", null, null, 0, 0);
      expect(fn).toHaveBeenCalledWith("e", null, null, 1, 1);
      expect(fn).toHaveBeenCalledWith("s", null, null, 2, 2);
      expect(fn).toHaveBeenCalledWith("t", null, null, 3, 3);
    });

    test("starting fg color", () => {
      Each.eachChar("test", eachFn, "red");
      expect(eachFn).toHaveBeenCalledTimes(4);
      expect(output).toEqual("#red|#t#red|#e#red|#s#red|#t");
    });

    test("both starting colors", () => {
      Each.eachChar("test", eachFn, "red", "blue");
      expect(eachFn).toHaveBeenCalledTimes(4);
      expect(output).toEqual("#red|blue#t#red|blue#e#red|blue#s#red|blue#t");
    });

    test("inline color", () => {
      Each.eachChar("a ΩredΩtest∆ text", eachFn);
      expect(eachFn).toHaveBeenCalledTimes(11);
      expect(output).toEqual("a #red|#t#red|#e#red|#s#red|#t text");
    });

    test("inline color", () => {
      Each.eachChar("a ΩredΩtest∆ ∆text", eachFn, "teal");
      expect(eachFn).toHaveBeenCalledTimes(11);
      expect(output).toEqual(
        "#teal|#a#teal|# #red|#t#red|#e#red|#s#red|#t#teal|# #teal|#t#teal|#e#teal|#x#teal|#t"
      );
    });

    test("inline bg color", () => {
      Each.eachChar("a Ω|blueΩtest∆ text", eachFn);
      expect(eachFn).toHaveBeenCalledTimes(11);
      expect(output).toEqual("a #|blue#t#|blue#e#|blue#s#|blue#t text");
    });

    test("transform color", () => {
      const eachColor = jest.fn().mockImplementation((ctx) => {
        ctx.fg = ctx.fg ? 333 : 0;
      });

      Config.addHelper("eachColor", eachColor);

      Each.eachChar("a ΩredΩtest∆ text", eachFn);
      expect(eachFn).toHaveBeenCalledTimes(11);
      expect(output).toEqual("a #333|#t#333|#e#333|#s#333|#t text");
    });

    test("placing color marker char", () => {
      Each.eachChar("a ΩΩ horseshoe ∆∆!", eachFn);
      expect(eachFn).toHaveBeenCalledTimes(16);
      expect(output).toEqual("a Ω horseshoe ∆!");
    });

    test("Missing end of color", () => {
      jest.spyOn(console, "warn").mockReturnValue();
      Each.eachChar("a Ωred horseshoe ∆∆!", eachFn);
      expect(eachFn).toHaveBeenCalledTimes(2);
      expect(console.warn).toHaveBeenCalled();
      expect(output).toEqual("a ");
    });

    test("empty string", () => {
      Each.eachChar("", eachFn);
      expect(eachFn).toHaveBeenCalledTimes(0);
      expect(output).toEqual("");
    });

    test("null string", () => {
      let s = null;
      // @ts-ignore
      Each.eachChar(s, eachFn);
      expect(eachFn).toHaveBeenCalledTimes(0);
      expect(output).toEqual("");
    });

    test("undefined string", () => {
      let s = undefined;
      // @ts-ignore
      Each.eachChar(s, eachFn);
      expect(eachFn).toHaveBeenCalledTimes(0);
      expect(output).toEqual("");
    });

    test("number string", () => {
      let s = 0;
      // @ts-ignore
      Each.eachChar(s, eachFn);
      expect(eachFn).toHaveBeenCalledTimes(1);
      expect(output).toEqual("0");
    });

    test("no fn", () => {
      let fn = null;
      // @ts-ignore
      Each.eachChar("test", fn);
      expect(eachFn).toHaveBeenCalledTimes(0);
      expect(output).toEqual("");
    });
  });
});
