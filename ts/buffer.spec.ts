import "jest-extended";
import { extractText } from "../test/utils";

import * as Buffer from "./buffer";
import { colors } from "./color";

describe("buffer", () => {
  describe("DataBuffer", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    test("constructor", () => {
      const b = new Buffer.DataBuffer(10, 8);
      expect(b.width).toEqual(10);
      expect(b.height).toEqual(8);
      expect(b.get(0, 0)).toEqual({ ch: 0, bg: 0, fg: 0 });
    });

    test("draw", () => {
      const b = new Buffer.DataBuffer(10, 8);
      b.draw(1, 2, 3, 0xf00, 0x0f0);
      expect(b.get(1, 2)).toEqual({ ch: 3, fg: 0xf00, bg: 0x0f0 });

      b.draw(1, 2);
      expect(b.get(1, 2)).toEqual({ ch: 3, fg: 0xf00, bg: 0x0f0 });

      b.draw(2, 3, "A", colors.white, colors.gray);
      expect(b.get(2, 3)).toEqual({ ch: 65, fg: 0xfff, bg: 0x888 });

      // @ts-ignore
      b.draw(2, 3, null, null, null);
      expect(b.get(2, 3)).toEqual({ ch: 65, fg: 0xfff, bg: 0x888 });
    });

    test("drawSprite", () => {
      const b = new Buffer.DataBuffer(10, 8);
      b.drawSprite(1, 2, { ch: 3, fg: 0xf00, bg: 0x0f0 });
      expect(b.get(1, 2)).toEqual({ ch: 3, fg: 0xf00, bg: 0x0f0 });

      // @ts-ignore
      b.drawSprite(1, 2, { ch: null, fg: null, bg: null });
      expect(b.get(1, 2)).toEqual({ ch: 3, fg: 0xf00, bg: 0x0f0 });

      b.drawSprite(1, 2, {});
      expect(b.get(1, 2)).toEqual({ ch: 3, fg: 0xf00, bg: 0x0f0 });

      b.drawSprite(1, 2, { ch: "A" });
      expect(b.get(1, 2)).toEqual({ ch: 65, fg: 0xf00, bg: 0x0f0 });

      b.drawSprite(1, 2, { fg: 0x0f0 });
      expect(b.get(1, 2)).toEqual({ ch: 65, fg: 0x0f0, bg: 0x0f0 });
    });

    test("blackOut", () => {
      const b = new Buffer.DataBuffer(10, 8);
      b.drawSprite(1, 2, { ch: 3, fg: 0xf00, bg: 0x0f0 });
      expect(b.get(1, 2)).toEqual({ ch: 3, fg: 0xf00, bg: 0x0f0 });

      b.blackOut(1, 2);
      expect(b.get(1, 2)).toEqual({ ch: 0, fg: 0, bg: 0 });

      b.drawSprite(1, 2, { ch: 3, fg: 0xf00, bg: 0x0f0 });
      expect(b.get(1, 2)).toEqual({ ch: 3, fg: 0xf00, bg: 0x0f0 });

      b.blackOut();
      expect(b.get(1, 2)).toEqual({ ch: 0, fg: 0, bg: 0 });
    });

    test("fill", () => {
      const b = new Buffer.DataBuffer(10, 8);
      expect(b.get(1, 2)).toEqual({ ch: 0, fg: 0, bg: 0 });

      b.fill("A", 0x321, 0x987);
      expect(b.get(1, 2)).toEqual({ ch: 65, fg: 0x321, bg: 0x987 });

      b.fill();
      expect(b.get(1, 2)).toEqual({ ch: 0, fg: 0xfff, bg: 0x000 });
    });

    test("copy", () => {
      const b = new Buffer.DataBuffer(10, 8);
      expect(b.get(1, 2)).toEqual({ ch: 0, fg: 0, bg: 0 });

      b.fill("A", 0x321, 0x987);
      expect(b.get(1, 2)).toEqual({ ch: 65, fg: 0x321, bg: 0x987 });

      const a = new Buffer.DataBuffer(10, 8);
      a.copy(b);
      expect(a.get(1, 2)).toEqual({ ch: 65, fg: 0x321, bg: 0x987 });
    });

    test("drawText", () => {
      const b = new Buffer.DataBuffer(10, 8);
      expect(b.drawText(0, 0, "test")).toEqual(1);
      expect(b.get(0, 0)).toEqual({ ch: "t".charCodeAt(0), fg: 0xfff, bg: 0 });
      expect(b.get(1, 0)).toEqual({ ch: "e".charCodeAt(0), fg: 0xfff, bg: 0 });
      expect(b.get(2, 0)).toEqual({ ch: "s".charCodeAt(0), fg: 0xfff, bg: 0 });
      expect(b.get(3, 0)).toEqual({ ch: "t".charCodeAt(0), fg: 0xfff, bg: 0 });

      expect(b.drawText(0, 1, "test", "red", "green")).toEqual(2);
      expect(b.get(0, 1)).toEqual({
        ch: "t".charCodeAt(0),
        fg: 0xf00,
        bg: 0x0f0,
      });
      expect(b.get(1, 1)).toEqual({
        ch: "e".charCodeAt(0),
        fg: 0xf00,
        bg: 0x0f0,
      });
      expect(b.get(2, 1)).toEqual({
        ch: "s".charCodeAt(0),
        fg: 0xf00,
        bg: 0x0f0,
      });
      expect(b.get(3, 1)).toEqual({
        ch: "t".charCodeAt(0),
        fg: 0xf00,
        bg: 0x0f0,
      });

      // it will not wrap
      expect(b.drawText(8, 2, "test", "#f00", "#0F0")).toEqual(3);
      expect(b.get(8, 2)).toEqual({
        ch: "t".charCodeAt(0),
        fg: 0xf00,
        bg: 0x0f0,
      });
      expect(b.get(9, 2)).toEqual({
        ch: "e".charCodeAt(0),
        fg: 0xf00,
        bg: 0x0f0,
      });
      expect(b.get(0, 3)).toEqual({ ch: 0, fg: 0, bg: 0 });
    });

    test("wrapText", () => {
      const b = new Buffer.DataBuffer(10, 10);
      expect(b.wrapText(0, 0, 10, "testing a wrapped text string")).toEqual(4);
      expect(b.get(0, 0)).toEqual({ ch: "t".charCodeAt(0), fg: 0xfff, bg: 0 });
      expect(b.get(0, 1)).toEqual({ ch: "w".charCodeAt(0), fg: 0xfff, bg: 0 });
      expect(b.get(0, 2)).toEqual({ ch: "t".charCodeAt(0), fg: 0xfff, bg: 0 });
      expect(b.get(0, 3)).toEqual({ ch: "s".charCodeAt(0), fg: 0xfff, bg: 0 });

      expect(
        b.wrapText(0, 5, 10, "testing a wrapped text string", "red", "blue")
      ).toEqual(9);
      expect(extractText(b, 0, 5, 10)).toEqual("testing a");
      expect(extractText(b, 0, 6, 10)).toEqual("wrapped");
      expect(extractText(b, 0, 7, 10)).toEqual("text");
      expect(extractText(b, 0, 8, 10)).toEqual("string");
      // it fills out the line to the full width with the bg color
      expect(b.get(9, 5)).toEqual({ ch: 0, fg: 0, bg: 0x00f });
      expect(b.get(9, 6)).toEqual({ ch: 0, fg: 0, bg: 0x00f });
      expect(b.get(9, 7)).toEqual({ ch: 0, fg: 0, bg: 0x00f });
      expect(b.get(9, 8)).toEqual({ ch: 0, fg: 0, bg: 0x00f });
    });

    test("fillRect", () => {
      const b = new Buffer.DataBuffer(10, 10);
      b.fillRect(2, 3, 3, 2, "A", "red", "blue");
      expect(extractText(b, 2, 3, 6)).toEqual("AAA");
      expect(extractText(b, 2, 4, 6)).toEqual("AAA");
      expect(extractText(b, 2, 5, 6)).toEqual("");
      expect(b.get(2, 3)).toEqual({ ch: 65, fg: 0xf00, bg: 0x00f });

      b.fillRect(2, 3, 3, 2, null, null, null);
      expect(extractText(b, 2, 3, 6)).toEqual("AAA");
      expect(extractText(b, 2, 4, 6)).toEqual("AAA");
      expect(extractText(b, 2, 5, 6)).toEqual("");
      expect(b.get(2, 3)).toEqual({ ch: 65, fg: 0xf00, bg: 0x00f });

      b.fillRect(2, 3, 3, 2, null, 0x0f0, null);
      expect(b.get(2, 3)).toEqual({ ch: 65, fg: 0x0f0, bg: 0x00f });

      b.fillRect(2, 3, 3, 2);
      expect(b.get(2, 3)).toEqual({ ch: 65, fg: 0x0f0, bg: 0x00f });
    });

    test("blackOutRect", () => {
      const b = new Buffer.DataBuffer(10, 10);
      b.fill("A", 0xf00, 0x00f);
      b.blackOutRect(1, 1, 2, 2);
      expect(b.get(0, 0)).toEqual({ ch: 65, fg: 0xf00, bg: 0x00f });
      expect(b.get(1, 1)).toEqual({ ch: 0, fg: 0, bg: 0 });
      expect(b.get(2, 2)).toEqual({ ch: 0, fg: 0, bg: 0 });
      expect(b.get(3, 3)).toEqual({ ch: 65, fg: 0xf00, bg: 0x00f });

      b.blackOutRect(2, 2, 2, 2, "green");
      expect(b.get(0, 0)).toEqual({ ch: 65, fg: 0xf00, bg: 0x00f });
      expect(b.get(1, 1)).toEqual({ ch: 0, fg: 0, bg: 0 });
      expect(b.get(2, 2)).toEqual({ ch: 0, fg: 0, bg: 0x0f0 });
      expect(b.get(3, 3)).toEqual({ ch: 0, fg: 0, bg: 0x0f0 });
    });

    test("highlight", () => {
      const b = new Buffer.DataBuffer(10, 10);
      b.fill("A", 0xf00, 0x00f);
      expect(b.get(0, 0)).toEqual({ ch: 65, fg: 0xf00, bg: 0x00f });
      // adds
      b.highlight(1, 1, "white", 50);
      expect(b.get(1, 1)).toEqual({ ch: 65, fg: 0xf88, bg: 0x88f });
      b.highlight(2, 2, 0x222, 50);
      expect(b.get(2, 2)).toEqual({ ch: 65, fg: 0xf11, bg: 0x11f });
    });

    test("mix", () => {
      const b = new Buffer.DataBuffer(10, 10);
      b.fill("A", 0xf00, 0x00f);
      // combines
      b.mix("green", 50);
      expect(b.get(0, 0)).toEqual({ ch: 65, fg: 0x880, bg: 0x088 });

      b.mix(0xfff, 50);
      expect(b.get(0, 0)).toEqual({ ch: 65, fg: 0xcc8, bg: 0x8cc });
    });

    test("dump", () => {
      const b = new Buffer.DataBuffer(5, 5);
      b.fill("A", 0xf00, 0x00f);
      jest.spyOn(console, "log").mockReturnValue();

      b.draw(2, 2, 0);
      b.dump();

      expect(console.log).toHaveBeenCalledWith(
        "     01234\n\n 0]  AAAAA\n 1]  AAAAA\n 2]  AA AA\n 3]  AAAAA\n 4]  AAAAA"
      );
    });
  });

  describe("Buffer", () => {
    let target: Buffer.BufferTarget;

    beforeEach(() => {
      target = {
        width: 10,
        height: 8,
        copyTo: jest.fn(),
        copy: jest.fn(),
        toGlyph: jest.fn().mockImplementation((ch) => ch.charCodeAt(0)),
      };
    });

    test("basics", () => {
      const b = new Buffer.Buffer(target);
      expect(b.width).toEqual(target.width);
      expect(b.height).toEqual(target.height);
      expect(target.copyTo).toHaveBeenCalled();

      // @ts-ignore
      target.copyTo.mockClear();
      // @ts-ignore
      target.copy.mockClear();

      b.render();
      expect(target.copy).toHaveBeenCalled();

      // @ts-ignore
      target.copyTo.mockClear();
      // @ts-ignore
      target.copy.mockClear();

      b.load();
      expect(target.copyTo).toHaveBeenCalled();

      b.draw(3, 2, "@", 0xfff);
      expect(target.toGlyph).toHaveBeenCalledWith("@");
    });
  });
});
