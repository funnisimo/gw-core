import * as Sprite from "./sprite";
import { colors } from "../color";

describe("Sprite", () => {
  test("make", () => {
    const a = Sprite.makeSprite();
    expect(a).toEqual({ ch: -1, fg: -1, bg: -1 });

    const b = Sprite.makeSprite("@", "green", "blue", 50);
    expect(b.ch).toEqual("@");
    expect(b.fg).toBe(colors.green);
    expect(b.bg).toBe(colors.blue);
    expect(b.opacity).toEqual(50);

    const d = Sprite.makeSprite("@", [100, 0, 0], [0,0,100], 50);
    expect(d.ch).toEqual("@");
    expect(d.fg).toEqual(colors.red);
    expect(d.fg).not.toBe(colors.red);
    expect(d.bg).toEqual(colors.blue);
    expect(d.bg).not.toBe(colors.blue);
    expect(d.opacity).toEqual(50);

    const e = Sprite.makeSprite(null, null, "green", 50);
    expect(e.ch).toEqual(-1);
    expect(e.fg).toEqual(-1);
    expect(e.bg).toBe(colors.green);
    expect(e.opacity).toEqual(50);

    const f = Sprite.makeSprite("@", null, null, 50);
    expect(f.ch).toEqual("@");
    expect(f.fg).toEqual(-1);
    expect(f.bg).toEqual(-1);
    expect(f.opacity).toEqual(50);

    const g = Sprite.makeSprite({ ch: "@", fg: "green" });
    expect(g.ch).toEqual("@");
    expect(g.fg).toBe(colors.green);
    expect(g.bg).toEqual(-1);
    expect(g.opacity).toBeUndefined();

    const h = Sprite.makeSprite({});
    expect(h.ch).toEqual(-1);
    expect(h.fg).toEqual(-1);
    expect(h.bg).toEqual(-1);
    expect(h.opacity).toBeUndefined();

    const i = Sprite.makeSprite(null, null, null);
    expect(i).toEqual({ ch: -1, fg: -1, bg: -1 });

    // const j = Sprite.makeSprite(undefined);
    // expect(j).toEqual({});

    const k = Sprite.makeSprite(["$", "blue"]);
    expect(k.ch).toEqual("$");
    expect(k.fg).toBe(colors.blue);
    expect(k.bg).toEqual(-1);
    expect(k.opacity).toBeUndefined();

    const l = Sprite.makeSprite(["blue"]);
    expect(l.ch).toEqual(-1);
    expect(l.fg).toEqual(-1);
    expect(l.bg).toBe(colors.blue);
    expect(l.opacity).toBeUndefined();

    const m = Sprite.makeSprite("@", "blue", -1);
    expect(m.ch).toEqual("@");
    expect(m.fg).toBe(colors.blue);
    expect(m.bg).toEqual(-1);
    expect(m.opacity).toBeUndefined();
  });

  test("install", () => {
    // const a = Sprite.installSprite("TEST");
    // expect(a).toEqual({});

    const b = Sprite.installSprite("TEST", "@", "green", "blue", 50);
    expect(b.ch).toEqual("@");
    expect(b.fg).toBe(colors.green);
    expect(b.bg).toBe(colors.blue);
    expect(b.opacity).toEqual(50);

    const d = Sprite.installSprite("TEST", "@", [100, 0, 0], null, 50);
    expect(d.ch).toEqual("@");
    expect(d.fg).toEqual(colors.red);
    expect(d.bg).toEqual(-1);
    expect(d.opacity).toEqual(50);

    const e = Sprite.installSprite("TEST", null, null, "green", 50);
    expect(e.ch).toEqual(-1);
    expect(e.fg).toEqual(-1);
    expect(e.bg).toBe(colors.green);
    expect(e.opacity).toEqual(50);

    const f = Sprite.installSprite("TEST", "@", null, null, 50);
    expect(f.ch).toEqual("@");
    expect(f.fg).toEqual(-1);
    expect(f.bg).toEqual(-1);
    expect(f.opacity).toEqual(50);

    const g = Sprite.installSprite("TEST", { ch: "@", fg: "green" });
    expect(g.ch).toEqual("@");
    expect(g.fg).toBe(colors.green);
    expect(g.bg).toEqual(-1);
    expect(g.opacity).toBeUndefined();

    // const h = Sprite.installSprite("TEST", colors.white);
    // expect(h.ch).toBeUndefined();
    // expect(h.bg).toBe(colors.white);
    // expect(h.fg).toBeUndefined();
    // expect(h.opacity).toBeUndefined();

    const i = Sprite.installSprite("TEST", null, null, null);
    expect(i).toEqual({ ch: -1, fg: -1, bg: -1, name: "TEST" });

    // const j = Sprite.installSprite("TEST", undefined);
    // expect(j).toEqual({});

    const k = Sprite.installSprite("TEST", ["$", "blue"]);
    expect(k.ch).toEqual("$");
    expect(k.fg).toBe(colors.blue);
    expect(k.bg).toEqual(-1);
    expect(k.opacity).toBeUndefined();

    const l = Sprite.installSprite("TEST", ["blue"]);
    expect(l.ch).toEqual(-1);
    expect(l.fg).toEqual(-1);
    expect(l.bg).toBe(colors.blue);
    expect(l.opacity).toBeUndefined();

    const m = Sprite.installSprite("miss", "green", 50);
    expect(m.ch).toEqual(-1);
    expect(m.fg).toEqual(-1);
    expect(m.bg).toBe(colors.green);
    expect(m.opacity).toEqual(50);

    debugger;

    const w = Sprite.installSprite("hilite", colors.white);
    expect(w.ch).toEqual(-1);
    expect(w.fg).toEqual(-1);
    expect(w.bg).toBe(colors.white);
    expect(w.opacity).toBeUndefined();
  });

  //   test("copy", () => {
  //     const b = new Sprite("@", "green", "blue", 50);

  //     b.copy({ ch: "!" });
  //     expect(b.ch).toEqual("!");
  //     expect(b.fg.isNull()).toBeTruthy();
  //     expect(b.bg.isNull()).toBeTruthy();
  //     expect(b.opacity).toEqual(100);

  //     b.copy({ fg: "red" });
  //     expect(b.ch).toEqual(" ");
  //     expect(b.fg).toEqual(colors.red);
  //     expect(b.bg.isNull()).toBeTruthy();

  //     b.copy({ fg: "white", bg: null });
  //     expect(b.ch).toEqual(" ");
  //     expect(b.fg).toEqual(colors.white);
  //     expect(b.bg.isNull()).toBeTruthy();

  //     b.copy({ fg: "red", bg: "blue" });
  //     expect(b.ch).toEqual(" ");
  //     expect(b.fg).toEqual(colors.red);
  //     expect(b.bg).toEqual(colors.blue);
  //   });

  //   test("plot", () => {
  //     const s = new Sprite("@", [100, 0, 0], [50, 50, 50]);
  //     const t = Sprite.makeSprite("$", [0, 100, 0], [0, 100, 50], 50);
  //     expect(t.opacity).toEqual(50);
  //     s.needsUpdate = false;

  //     s.drawSprite(t);
  //     expect(s.needsUpdate).toBeTruthy();

  //     expect(s.ch).toEqual("$");
  //     expect(s.fg.toString(true)).toEqual("#808000"); // mixes fgs
  //     expect(s.bg.toString(true)).toEqual("#40bf80"); // mixes bgs
  //   });

  //   test("plot with alpha", () => {
  //     const s = new Sprite("@", [100, 0, 0], [50, 50, 50]);
  //     const t = Sprite.makeSprite("$", [0, 100, 0], [0, 100, 50], 50);
  //     expect(t.opacity).toEqual(50);
  //     s.needsUpdate = false;

  //     expect(s.fg.toString(true)).toEqual("#ff0000");
  //     expect(s.bg.toString(true)).toEqual("#808080");

  //     expect(t.fg.toString(true)).toEqual("#00ff00");
  //     expect(t.bg.toString(true)).toEqual("#00ff80");

  //     s.drawSprite(t, 50);
  //     expect(s.needsUpdate).toBeTruthy();

  //     expect(s.ch).toEqual("$");
  //     expect(s.fg.toString(true)).toEqual("#808000"); // mixes 50% of t fg
  //     expect(s.bg.toString(true)).toEqual("#40bf80"); // mixes 50% of t bg
  //   });

  //   test("plotting w/o fg/bg", () => {
  //     const dest = new Sprite();
  //     const tile = Sprite.makeSprite(null, null, "green"); // bg
  //     const player = Sprite.makeSprite("@", "white", null);

  //     dest.drawSprite(tile);
  //     dest.drawSprite(player);

  //     expect(dest.ch).toEqual("@");
  //     expect(dest.fg.toString(true)).toEqual("#ffffff");
  //     expect(dest.bg.toString(true)).toEqual("#00ff00");
  //     expect(dest.opacity).toEqual(100);
  //     expect(dest.needsUpdate).toBeTruthy();
  //   });

  //   test("plotting with opacity", () => {
  //     const dest = new Sprite();
  //     const tile = Sprite.makeSprite("green"); // bg
  //     const player = Sprite.makeSprite("@", "white");
  //     const fx = Sprite.makeSprite("red", 50); // bg

  //     dest.drawSprite(tile);
  //     dest.drawSprite(player);
  //     dest.drawSprite(fx);

  //     expect(dest.ch).toEqual("@");
  //     expect(dest.fg.toString(true)).toEqual("#ffffff");
  //     expect(dest.bg.toString(true)).toEqual("#808000");
  //     expect(dest.opacity).toEqual(100);
  //     expect(dest.needsUpdate).toBeTruthy();
  //   });

  //   test("plotting just fg", () => {
  //     const dest = new Sprite();
  //     const tile = Sprite.makeSprite("green"); // bg
  //     const player = Sprite.makeSprite("@", "white");
  //     const fx = Sprite.makeSprite(null, "red", 50);

  //     dest.drawSprite(tile);
  //     dest.drawSprite(player);
  //     dest.drawSprite(fx);

  //     expect(dest.ch).toEqual("@");
  //     expect(dest.fg.toString(true)).toEqual("#ff8080"); // (white + red) / 2
  //     expect(dest.bg.toString(true)).toEqual("#00ff00");
  //     expect(dest.opacity).toEqual(100);
  //     expect(dest.needsUpdate).toBeTruthy();
  //   });

  // test('will track hanging letter changes in plotChar', () => {
  //   const s = Sprite.makeSprite('@', 'red');
  //   expect(s.wasHanging).toBeFalsy();
  //   s.draw('|');
  //   expect(s.wasHanging).toBeTruthy();
  //   s.draw('@');
  //   expect(s.wasHanging).toBeTruthy();
  //   s.draw('o');
  //   expect(s.wasHanging).toBeTruthy();  // does not get turned off automatically
  //   s.nullify();
  //   expect(s.wasHanging).toBeTruthy();  // does not get nullified
  //
  //   s.wasHanging = false;
  //   s.draw('|');
  //   expect(s.wasHanging).toBeTruthy();
  //   s.nullify();
  //   expect(s.wasHanging).toBeTruthy();  // gets set
  // });
  //
  // test('will track hanging letter changes in plot', () => {
  //   const s = Sprite.makeSprite('@', 'red');
  //   const t = Sprite.makeSprite('|', 'blue');
  //   const u = Sprite.makeSprite('o', 'orange');
  //
  //   expect(s.wasHanging).toBeFalsy();
  //   s.drawSprite(t);
  //   expect(s.wasHanging).toBeTruthy();
  //   s.drawSprite(u);
  //   expect(s.wasHanging).toBeTruthy();
  //   s.drawSprite(u);
  //   expect(s.wasHanging).toBeTruthy();  // Not auto turned off
  //   s.nullify();
  //   expect(s.wasHanging).toBeTruthy();  // does not get cleared
  // });
});
