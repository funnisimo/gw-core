import * as Color from "../color";
import { Mixer } from "./mixer";
import { cosmetic } from "../random";
import { make as Make } from "../gw";

describe("Mixer", () => {
    beforeEach(() => {
        jest
            .spyOn(cosmetic, "number")
            .mockImplementation((n?: number) => (n ? Math.floor(n / 2) : 5));
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    test("create", () => {
        const mixer = new Mixer();
        expect(mixer.ch).toEqual(-1);
        expect(mixer.fg.isNull()).toBeTruthy();
        expect(mixer.bg.isNull()).toBeTruthy();

        const b = Make.mixer();
        expect(b.ch).toEqual(-1);
        expect(b.fg.isNull()).toBeTruthy();
        expect(b.bg.isNull()).toBeTruthy();
    });

    test("copy", () => {
        const a = new Mixer();
        a.draw("@", 0xfff, 0x333);
        expect(a.ch).toEqual("@");
        expect(a.fg.css()).toEqual("#fff");
        expect(a.bg.css()).toEqual("#333");

        const b = new Mixer();
        b.copy(a);
        expect(b.ch).toEqual("@");
        expect(b.fg.css()).toEqual("#fff");
        expect(b.bg.css()).toEqual("#333");
        expect(b.equals(a)).toBeTruthy();
        expect(a.equals(b)).toBeTruthy();
    });

    test("clone", () => {
        const a = new Mixer();
        a.draw("@", 0xfff, 0x333);
        expect(a.ch).toEqual("@");
        expect(a.fg.css()).toEqual("#fff");
        expect(a.bg.css()).toEqual("#333");

        const b = a.clone();
        expect(b.ch).toEqual("@");
        expect(b.fg.css()).toEqual("#fff");
        expect(b.bg.css()).toEqual("#333");
    });

    test("nullify", () => {
        const a = new Mixer();
        a.draw("@", 0xfff, 0x333);
        expect(a.ch).toEqual("@");
        expect(a.fg.css()).toEqual("#fff");
        expect(a.bg.css()).toEqual("#333");

        a.nullify();
        expect(a.ch).toEqual(-1);
        expect(a.fg.toInt()).toEqual(-1);
        expect(a.bg.toInt()).toEqual(-1);
    });

    test("blackOut", () => {
        const a = new Mixer();
        a.draw("@", 0xfff, 0x333);
        expect(a.ch).toEqual("@");
        expect(a.fg.css()).toEqual("#fff");
        expect(a.bg.css()).toEqual("#333");

        a.blackOut();
        expect(a.ch).toEqual(0);
        expect(a.fg.toInt()).toEqual(0);
        expect(a.bg.toInt()).toEqual(0);
    });

    test("draw", () => {
        const mixer = new Mixer();
        mixer.draw("@", 0xf00, Color.fromCss("#00F"));
        expect(mixer.ch).toEqual("@");
        expect(mixer.fg.css()).toEqual("#f00");
        expect(mixer.bg.css()).toEqual("#00f");

        mixer.draw(-1, 0x00f, 0x666);
        expect(mixer.ch).toEqual("@");
        expect(mixer.fg.css()).toEqual("#00f");
        expect(mixer.bg.css()).toEqual("#666");

        mixer.draw("!");
        expect(mixer.ch).toEqual("!");
        expect(mixer.fg.css()).toEqual("#00f");
        expect(mixer.bg.css()).toEqual("#666");

        mixer.draw(); // does nothing (just to clear coverage report)
        expect(mixer.ch).toEqual("!");
        expect(mixer.fg.css()).toEqual("#00f");
        expect(mixer.bg.css()).toEqual("#666");
    });

    test("drawSprite", () => {
        const mixer = new Mixer();
        mixer.drawSprite({ ch: "@", fg: 0xf00, bg: Color.fromCss("#00F") });
        expect(mixer.ch).toEqual("@");
        expect(mixer.fg.css()).toEqual("#f00");
        expect(mixer.bg.css()).toEqual("#00f");

        mixer.drawSprite({ ch: 100, fg: Color.fromCss("#00F"), bg: 0xff0 });
        expect(mixer.ch).toEqual(100);
        expect(mixer.fg.css()).toEqual("#00f");
        expect(mixer.bg.css()).toEqual("#ff0");

        // no change if no opacity
        mixer.drawSprite({ ch: "@", fg: 0xf00, bg: Color.fromCss("#00F") }, 0);
        expect(mixer.ch).toEqual(100);
        expect(mixer.fg.css()).toEqual("#00f");
        expect(mixer.bg.css()).toEqual("#ff0");

        mixer.drawSprite({ ch: "@", fg: 0xf00, bg: Color.fromCss("#00F") }, 50);
        expect(mixer.ch).toEqual("@");
        expect(mixer.fg.css()).toEqual("#808");
        expect(mixer.bg.css()).toEqual("#888");

        // @ts-ignore
        mixer.drawSprite({});
        expect(mixer.ch).toEqual("@");
        expect(mixer.fg.css()).toEqual("#808");
        expect(mixer.bg.css()).toEqual("#888");

        // -1 means do not draw
        mixer.drawSprite({ ch: -1, fg: -1, bg: -1 });
        expect(mixer.ch).toEqual("@");
        expect(mixer.fg.css()).toEqual("#808");
        expect(mixer.bg.css()).toEqual("#888");
    });

    test("invert", () => {
        const mixer = new Mixer();
        mixer.draw("@", 0xf00, Color.fromCss("#00F"));
        expect(mixer.ch).toEqual("@");
        expect(mixer.fg.css()).toEqual("#f00");
        expect(mixer.bg.css()).toEqual("#00f");

        mixer.invert();
        expect(mixer.fg.css()).toEqual("#00f");
        expect(mixer.bg.css()).toEqual("#f00");
    });

    test("multiply", () => {
        const mixer = new Mixer();
        mixer.draw("@", 0xf00, Color.fromCss("#00F"));
        expect(mixer.ch).toEqual("@");
        expect(mixer.fg.css()).toEqual("#f00");
        expect(mixer.bg.css()).toEqual("#00f");

        const light = Color.fromArray([200, 50, 50]);
        mixer.multiply(light);
        expect(mixer.fg.css()).toEqual("#f00");
        expect(mixer.bg.css()).toEqual("#008");

        mixer.draw("@", 0xf00, Color.fromCss("#00F"));
        expect(mixer.ch).toEqual("@");
        expect(mixer.fg.css()).toEqual("#f00");
        expect(mixer.bg.css()).toEqual("#00f");

        mixer.multiply(light, false, true);
        expect(mixer.ch).toEqual("@");
        expect(mixer.fg.css()).toEqual("#f00");
        expect(mixer.bg.css()).toEqual("#008");

        mixer.draw("@", 0x800, Color.fromCss("#00F"));
        expect(mixer.ch).toEqual("@");
        expect(mixer.fg.css()).toEqual("#800");
        expect(mixer.bg.css()).toEqual("#00f");

        mixer.multiply(light, true, false);
        expect(mixer.ch).toEqual("@");
        expect(mixer.fg.css()).toEqual("#f00");
        expect(mixer.bg.css()).toEqual("#00f");
    });

    test("mix", () => {
        const mixer = new Mixer();
        mixer.draw("@", 0xf00, Color.fromCss("#00F"));
        expect(mixer.ch).toEqual("@");
        expect(mixer.fg.css()).toEqual("#f00");
        expect(mixer.bg.css()).toEqual("#00f");

        const water = Color.fromNumber(0x66f);
        mixer.mix(water);
        expect(mixer.ch).toEqual("@");
        expect(mixer.fg.css()).toEqual("#b38");
        expect(mixer.bg.css()).toEqual("#33f");

        mixer.draw("@", 0xf00, Color.fromCss("#00F"));
        mixer.mix(water, 0, 0); // does nothing
        expect(mixer.ch).toEqual("@");
        expect(mixer.fg.css()).toEqual("#f00");
        expect(mixer.bg.css()).toEqual("#00f");
    });

    test("add", () => {
        const mixer = new Mixer();
        mixer.draw("@", 0xf00, Color.fromCss("#00F"));
        expect(mixer.ch).toEqual("@");
        expect(mixer.fg.css()).toEqual("#f00");
        expect(mixer.bg.css()).toEqual("#00f");

        const water = Color.fromNumber(0x003);
        mixer.add(water);
        expect(mixer.fg.css()).toEqual("#f03");
        expect(mixer.bg.css()).toEqual("#00f");

        mixer.draw("@", 0xf00, Color.fromCss("#00F"));
        mixer.add(water, 0, 0); // does nothing
        expect(mixer.ch).toEqual("@");
        expect(mixer.fg.css()).toEqual("#f00");
        expect(mixer.bg.css()).toEqual("#00f");
    });

    test("separate", () => {
        const mixer = new Mixer();
        mixer.draw("@", Color.fromCss("#F80"), 0xd73);
        expect(mixer.ch).toEqual("@");
        expect(mixer.fg.css()).toEqual("#f80");
        expect(mixer.bg.css()).toEqual("#d73");

        mixer.separate();
        expect(mixer.fg.css()).toEqual("#fb6");
        expect(mixer.bg.css()).toEqual("#742");
    });

    test("bake", () => {
        const mixer = new Mixer();
        mixer.draw("@", 0xd73, Color.fromArray([50, 50, 50, 50, 10, 10, 10]));
        expect(mixer.ch).toEqual("@");
        expect(mixer.fg.css()).toEqual("#d73");
        expect(mixer.bg.css()).toEqual("#888");

        const data = mixer.bake();
        expect(data.ch).toEqual("@");
        expect(data.fg).toEqual(3443);
        expect(data.bg).toEqual(3276);
        expect(mixer.fg.css()).toEqual("#d73");
        expect(mixer.bg.css()).toEqual("#ccc");
    });

    test('toString', () => {
        const mixer = new Mixer({ ch: '@', fg: 'red', bg: 'black' });
        expect(mixer.toString()).toEqual('{ ch: @, fg: red, bg: black }');
    });
});
