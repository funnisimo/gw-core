import 'jest-extended';
import * as Color from './color';
import { cosmetic } from '../rng';

describe('Color', () => {
    beforeEach(() => {
        jest.spyOn(cosmetic, 'number').mockImplementation((n?: number) =>
            n ? Math.floor(n / 2) : 0
        );
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    test('make - color', () => {
        const c = new Color.Color(100, 50, 0);
        const d = Color.make(c);
        expect(c).not.toBe(d);
        expect(c.equals(d)).toBeTruthy();
        expect(c.css()).toEqual('#f80');

        // @ts-ignore
        expect(() => Color.make({})).toThrow();

        // @ts-ignore
        const e = Color.make();
        expect(e.isNull()).toBeTruthy();

        // @ts-ignore
        const f = Color.make(null);
        expect(f.isNull()).toBeTruthy();

        // @ts-ignore
        const g = Color.make(undefined);
        expect(g.isNull()).toBeTruthy();

        const h = Color.make(50, 100, 25);
        expect(h.css()).toEqual('#8f4');
    });

    test('install', () => {
        const c = Color.install('test', 50, 50, 100);
        expect(c.css()).toEqual('#88f');
        expect(Color.colors.test).toBe(c);

        const d = Color.install('test', [50, 50, 100]);
        expect(d.css()).toEqual('#88f');
        expect(Color.colors.test).toBe(d);

        const e = Color.install('test', '#88f');
        expect(e.css()).toEqual('#88f');
        expect(Color.colors.test).toBe(e);
    });

    test('fromArray', () => {
        const c = Color.fromArray([0, 50, 100]);
        expect(c.toString()).toEqual('#08f');

        const d = Color.fromArray([0, 128, 255], true);
        expect(d.toString()).toEqual('#08f');

        const e = Color.fromArray([-10, 200, 50]);
        expect(e.equals([-10, 200, 50])).toBeTruthy();

        const f = Color.fromArray([-50, 510, 255], true);
        expect(f.equals([-20, 200, 100])).toBeTruthy();

        // @ts-ignore
        expect(Color.fromArray([]).toString()).toEqual('#000');
    });

    test('make - array', () => {
        const c = Color.make([0, 50, 100]);
        expect(c.toString()).toEqual('#08f');

        const d = Color.make([0, 128, 255], true);
        expect(d.toString()).toEqual('#08f');
    });

    test('fromCss', () => {
        const c = Color.fromCss('#07F');
        expect(c.equals([0, 47, 100])).toBeTruthy();

        const d = Color.fromCss('#0080FF');
        expect(d.equals([0, 50, 100])).toBeTruthy();

        expect(() => Color.fromCss('black')).toThrow();
    });

    test('make - string', () => {
        const c = Color.make('#07F');
        expect(c.equals([0, 47, 100])).toBeTruthy();

        const d = Color.make('#0080FF');
        expect(d.equals([0, 50, 100])).toBeTruthy();
    });

    test('fromNumber', () => {
        const c = Color.fromNumber(0x07f);
        expect(c.equals([0, 47, 100])).toBeTruthy();

        const d = Color.fromNumber(0x0080ff, true);
        expect(d.equals([0, 50, 100])).toBeTruthy();
    });

    test('make - number', () => {
        const c = Color.make(0x07f);
        expect(c.equals([0, 47, 100])).toBeTruthy();

        const d = Color.make(0x0080ff, true);
        expect(d.equals([0, 50, 100])).toBeTruthy();

        const e = Color.make(0x202020); // automatic base256 detect (> 0xFFF)
        expect(e.toString()).toEqual('#222');
    });

    test('from', () => {
        const c = Color.from(-1);
        expect(c.isNull()).toBeTruthy();

        expect(Color.from('red')).toBe(Color.colors.red);
    });

    test('equals', () => {
        const a = new Color.Color(100, 50, 0);
        const b = new Color.Color(100, 50, 0);
        const c = new Color.Color(50, 50, 50);
        const d = new Color.Color();

        expect(a.equals(b)).toBeTruthy();
        expect(a.equals(c)).toBeFalsy();
        expect(a.equals([100, 50, 0])).toBeTruthy();
        expect(a.equals([50, 50, 50])).toBeFalsy();
        expect(a.equals('#f80')).toBeTruthy();
        expect(a.equals(0xf80)).toBeTruthy();
        expect(a.equals(0xff8000)).toBeTruthy();
        expect(a.toString(true)).toEqual('#ff8000');
        expect(a.equals('#ff8000')).toBeTruthy();

        // @ts-ignore
        expect(a.equals(null)).toBeFalsy();
        // @ts-ignore
        expect(a.equals()).toBeFalsy();
        expect(a.equals(d)).toBeFalsy();
        expect(d.equals(a)).toBeFalsy();

        expect(a.toInt()).toEqual(0xf80);
        expect(a.equals(0xf80)).toBeTruthy();

        expect(Color.colors.black.equals('black')).toBeTruthy();
        expect(Color.colors.black.equals('#000')).toBeTruthy();
        expect(Color.colors.black.equals('#000000')).toBeTruthy();
    });

    test('copy', () => {
        const a = new Color.Color();
        const b = new Color.Color(100, 50, 0);
        expect(a.equals(b)).toBeFalsy();
        a.copy(b);
        expect(a.equals(b)).toBeTruthy();

        a.copy([50, 50, 50]);
        expect(a.css()).toEqual('#888');

        a.copy([50, 50, 50, 10, 10, 10, 10, true]);
        expect(a.dances).toBeTruthy();

        b.copy(a);
        expect(b.dances).toBeTruthy();

        b.copy('red');
        expect(b.css()).toEqual('#f00');
    });

    test('clone', () => {
        const a = new Color.Color(100, 50, 0);
        const b = a.clone();
        expect(a.equals(b)).toBeTruthy();
    });

    test('assign', () => {
        const a = new Color.Color();
        a.assign(100, 50, 0);
        expect(a.dances).toBeFalsy();
        expect(a.equals([100, 50, 0])).toBeTruthy();

        a.assign(1, 2, 3, 4, 5, 6, 7, true);
        expect(a.equals([1, 2, 3, 4, 5, 6, 7])).toBeTruthy();
        expect(a.dances).toBeTruthy();

        a.assign();
        expect(a.toString()).toEqual('#000');
        expect(a.dances).toBeTruthy(); // does not change (should it?)
    });

    test('assignRGB', () => {
        const a = new Color.Color();
        a.assignRGB(255, 128, 0);
        expect(a.equals([100, 50, 0])).toBeTruthy();
        expect(a.dances).toBeFalsy();

        a.assignRGB(255, 255, 255, 255, 255, 255, 255, true);
        expect(a.equals([100, 100, 100, 100, 100, 100, 100])).toBeTruthy();
        expect(a.dances).toBeTruthy();

        a.assignRGB();
        expect(a.toString()).toEqual('#000');
        expect(a.dances).toBeTruthy(); // does not change (should it?)
    });

    test('nullify', () => {
        const c = Color.fromNumber(0xff0);
        expect(c.isNull()).toBeFalsy();
        c.nullify();
        expect(c.isNull()).toBeTruthy();
    });

    test('blackOut', () => {
        const a = new Color.Color(100, 50, 0);
        expect(a.toInt()).toEqual(0xf80);
        a.blackOut();
        expect(a.toInt()).toEqual(0x000);
    });

    test('toInt', () => {
        const c = new Color.Color(100, 47, 0);
        expect(c.toInt()).toEqual(0xf70);
        expect(c.toInt(true)).toEqual(0xff7800);

        const d = new Color.Color(100, 50, 0);
        expect(d.toInt()).toEqual(0xf80);
        expect(d.toInt(true)).toEqual(0xff8000);

        const e = new Color.Color();
        expect(e.isNull()).toBeTruthy();
        expect(e.toInt()).toEqual(-1);
    });

    // test('fromInt', () => {
    //     const c = new Color.Color().fromInt(0xF70);
    //     expect(c.toString()).toEqual('#f70')
    //
    //     const d = new Color.Color().fromInt(0xFF8000, true);
    //     expect(d.toString()).toEqual('#f80');
    //
    //     const e = new Color.Color(100,100,100).fromInt(-1);
    //     expect(e.isNull()).toBeTruthy();
    // });

    test('clamp', () => {
        const c = new Color.Color();
        expect(c.isNull()).toBeTruthy();
        c.clamp();
        expect(c.isNull()).toBeTruthy();

        c.assign(200, -100, 50);
        c.clamp();
        expect(c.equals([100, 0, 50])).toBeTruthy();
    });

    test('mix', () => {
        const c = new Color.Color();
        const white = new Color.Color(100, 100, 100);
        const black = new Color.Color(0, 0, 0);
        const red = new Color.Color(100, 0, 0);
        const blue = new Color.Color(0, 0, 100);
        const nullColor = new Color.Color();

        expect(c.isNull()).toBeTruthy();
        c.mix(nullColor, 50);
        expect(c.isNull()).toBeTruthy();

        c.mix(white, 50);
        expect(c.equals([50, 50, 50])).toBeTruthy();
        expect(c.isNull()).toBeFalsy();

        c.mix(red, 50);
        expect(c.toString()).toEqual('#b44');
        expect(c.toString(true)).toEqual('#bf4040');
        c.mix(black, 50);
        expect(c.toString()).toEqual('#622');
        c.mix(blue, 50);
        expect(c.toString()).toEqual('#319');
    });

    test('lighten', () => {
        const c = Color.fromNumber(0x840);
        c.lighten(0);
        expect(c.toString()).toEqual('#840');
        c.lighten(50);
        expect(c.toString()).toEqual('#ca8');

        const d = new Color.Color();
        expect(d.isNull()).toBeTruthy();
        d.lighten(50);
        expect(d.isNull()).toBeTruthy();
    });

    test('darken', () => {
        const c = Color.fromNumber(0x8bf);
        c.darken(0);
        expect(c.toString()).toEqual('#8bf');
        c.darken(50);
        expect(c.toString()).toEqual('#468');

        const d = new Color.Color();
        expect(d.isNull()).toBeTruthy();
        d.darken(50);
        expect(d.isNull()).toBeTruthy();
    });

    test('bake', () => {
        const c = new Color.Color(0, 0, 0, 20, 10, 10, 10);
        expect(c.css()).toEqual('#000');
        c.bake();
        expect(c.css()).not.toEqual('#000');
        expect(c.r).toBeGreaterThan(0);
        expect(c.r).toBeLessThan(256);
        expect(c.g).toBeGreaterThan(0);
        expect(c.g).toBeLessThan(256);
        expect(c.b).toBeGreaterThan(0);
        expect(c.b).toBeLessThan(256);

        const d = new Color.Color();
        expect(d.isNull()).toBeTruthy();
        d.bake();
        expect(d.isNull()).toBeTruthy();

        const e = Color.fromArray([50, 50, 50]);
        e.bake();
        expect(e.toString()).toEqual('#888');

        const f = Color.fromArray([50, 50, 50, 10, 10, 10, 10, true]);
        f.bake();
        expect(f.toString()).toEqual('#999'); // random is hard coded to n/2
        expect(f.r).toEqual(128);
        expect(f.g).toEqual(128);
        expect(f.b).toEqual(128);
    });

    test('add', () => {
        const c = Color.fromNumber(0x444);
        const nullColor = new Color.Color();
        c.add(nullColor);
        expect(c.toString()).toEqual('#444');

        const d = Color.fromNumber(0x222);
        c.add(d);
        expect(c.toString()).toEqual('#666');

        c.add([47, 47, 47]);
        expect(c.toString()).toEqual('#ddd');

        const e = new Color.Color();
        expect(e.isNull()).toBeTruthy();
        e.add(d, 50);
        expect(e.toString()).toEqual('#111');
        expect(e.isNull()).toBeFalsy();
    });

    test('scale', () => {
        const c = Color.fromNumber(0x222);
        c.scale(200);
        expect(c.toString()).toEqual('#444');

        const d = new Color.Color();
        expect(d.isNull()).toBeTruthy();
        d.scale(200);
        expect(d.isNull()).toBeTruthy();
    });

    test('multiply', () => {
        const c = Color.fromNumber(0x222);
        const nullColor = new Color.Color();
        c.multiply(nullColor);
        expect(c.toString()).toEqual('#222');

        c.multiply([200, 50, 100]);
        expect(c.toString()).toEqual('#412');

        const d = new Color.Color(100, 200, 50);
        c.multiply(d);
        expect(c.toString()).toEqual('#421');

        const e = new Color.Color();
        e.multiply(d);
        expect(e.isNull()).toBeTruthy();
    });

    test('normalize', () => {
        const c = Color.fromArray([200, 100, 50]);
        expect(c.toString()).toEqual('#ff8');
        c.normalize();
        expect(c.toString()).toEqual('#f84');

        const d = new Color.Color();
        expect(d.isNull()).toBeTruthy();
        d.normalize();
        expect(d.isNull()).toBeTruthy();

        const e = new Color.Color(50, 50, 50);
        e.normalize();
        expect(e.toString()).toEqual('#888');
    });

    test('toString', () => {
        const c = new Color.Color();
        expect(c.isNull()).toBeTruthy();
        expect(c.toString()).toEqual('null color');

        const d = Color.colors.teal;
        expect(d.toString()).toEqual('teal');
        expect(d.css()).toEqual('#5ff');
    });

    test('css', () => {
        const c = Color.from(-1);
        expect(c.css()).toEqual('transparent');
    })

    test('rgb hsl', () => {
        const c = Color.fromCss('#f80');
        expect(c.r).toEqual(255);
        expect(c.g).toEqual(135); // 256 vs 100 rounding
        expect(c.b).toEqual(0);

        expect(c.h).toEqual(32); // rounding
        expect(c.s).toEqual(100);
        expect(c.l).toEqual(50);
    });

    test('hsl', () => {
        const c = Color.from(0xfff);
        expect(c.s).toEqual(0);

        // (A) If R ≥ G ≥ B  |  H = 60° x [(G-B)/(R-B)]
        c.assignRGB(255, 128, 0);
        expect(c.h).toEqual(30);

        // (B) If G > R ≥ B  |  H = 60° x [2 - (R-B)/(G-B)]
        c.assignRGB(128, 255, 0);
        expect(c.h).toEqual(90);

        // (C) If G ≥ B > R  |  H = 60° x [2 + (B-R)/(G-R)]
        c.assignRGB(0, 255, 128);
        expect(c.h).toEqual(150);

        // (D) If B > G > R  |  H = 60° x [4 - (G-R)/(B-R)]
        c.assignRGB(0, 128, 255);
        expect(c.h).toEqual(210);

        // (E) If B > R ≥ G  |  H = 60° x [4 + (R-G)/(B-G)]
        c.assignRGB(128, 0, 255);
        expect(c.h).toEqual(270);

        // (F) If R ≥ B > G  |  H = 60° x [6 - (B-G)/(R-G)]
        c.assignRGB(255, 0, 128);
        expect(c.h).toEqual(330);
    });

    test('separate', () => {
        const a = Color.fromCss('#f80');
        const b = Color.fromCss('#d73');
        Color.separate(a, b);
        expect(a.toString()).toEqual('#fb6');
        expect(b.toString()).toEqual('#742');

        const c = new Color.Color();
        Color.separate(a, c);
        expect(a.toString()).toEqual('#fb6');
        expect(c.isNull()).toBeTruthy();

        Color.separate(c, b);
        expect(b.toString()).toEqual('#742');
        expect(c.isNull()).toBeTruthy();
    });

    test('separate - 2 (far enough apart)', () => {
        const a = Color.fromCss('#ff0');
        const b = Color.fromCss('#d79');
        Color.separate(a, b);
        expect(a.toString()).toEqual('#ff0');
        expect(b.toString()).toEqual('#d79');
    });

    test('separate - 3', () => {
        const a = Color.fromCss('#660');
        const b = Color.fromCss('#5f0');
        Color.separate(a, b);
        expect(a.toString()).toEqual('#550');
        expect(b.toString()).toEqual('#6f2');
    });

    test('separate 3', () => {
        const a = Color.fromCss('#33F');
        const b = Color.fromCss('#006');
        Color.separate(a, b);
        expect(a.toString()).toEqual('#33f');
        expect(b.toString()).toEqual('#006');
    });

    test('fromName', () => {
        expect(() => Color.from('taco')).toThrow();
        expect(() => Color.make('taco')).toThrow();
    });

    test('fromNumber', () => {
        const c = Color.from(-4);
        expect(c.isNull()).toBeTruthy();
    });

    test('swap', () => {
        const a = Color.make('brown');
        const b = Color.make('teal');
        Color.swap(a, b);
        expect(a.equals(Color.colors.teal)).toBeTruthy();
        expect(b.equals(Color.colors.brown)).toBeTruthy();
    });

    test('relativeLuminance', () => {
        const C = Color.colors;
        expect(Color.relativeLuminance(C.white, C.black)).toEqual(100);
        expect(Color.relativeLuminance(C.white, C.gray)).toEqual(25);
        expect(Color.relativeLuminance(C.white, C.red)).toEqual(79);
        expect(Color.relativeLuminance(C.white, C.green)).toEqual(28);
        expect(Color.relativeLuminance(C.white, C.blue)).toEqual(93);
        expect(Color.relativeLuminance(C.black, C.red)).toEqual(21);
        expect(Color.relativeLuminance(C.black, C.green)).toEqual(72);
        expect(Color.relativeLuminance(C.black, C.blue)).toEqual(7);
        expect(Color.relativeLuminance(C.red, C.red)).toEqual(0);
        expect(Color.relativeLuminance(C.red, C.green)).toEqual(93);
        expect(Color.relativeLuminance(C.red, C.blue)).toEqual(28);
        expect(Color.relativeLuminance(C.green, C.red)).toEqual(93);
        expect(Color.relativeLuminance(C.green, C.green)).toEqual(0);
        expect(Color.relativeLuminance(C.green, C.blue)).toEqual(79);
        expect(Color.relativeLuminance(C.blue, C.red)).toEqual(28);
        expect(Color.relativeLuminance(C.blue, C.green)).toEqual(79);
        expect(Color.relativeLuminance(C.blue, C.blue)).toEqual(0);
    });

    test('distance', () => {
        const C = Color.colors;
        expect(Color.distance(C.white, C.black)).toEqual(100);
        expect(Color.distance(C.white, C.gray)).toEqual(25);
        expect(Color.distance(C.white, C.red)).toEqual(67);
        expect(Color.distance(C.white, C.green)).toEqual(67);
        expect(Color.distance(C.white, C.blue)).toEqual(67);
        expect(Color.distance(C.black, C.red)).toEqual(33);
        expect(Color.distance(C.black, C.green)).toEqual(33);
        expect(Color.distance(C.black, C.blue)).toEqual(33);
        expect(Color.distance(C.red, C.red)).toEqual(0);
        expect(Color.distance(C.red, C.green)).toEqual(67);
        expect(Color.distance(C.red, C.blue)).toEqual(67);
        expect(Color.distance(C.green, C.red)).toEqual(67);
        expect(Color.distance(C.green, C.green)).toEqual(0);
        expect(Color.distance(C.green, C.blue)).toEqual(67);
        expect(Color.distance(C.blue, C.red)).toEqual(67);
        expect(Color.distance(C.blue, C.green)).toEqual(67);
        expect(Color.distance(C.blue, C.blue)).toEqual(0);
    });

    test('installSpread', () => {
        Color.installSpread('test', 75, 75, 25);
        expect(Color.colors.test).toBeObject();
        expect(Color.colors.dark_test).toBeObject();
        expect(Color.colors.light_test).toBeObject();
    });

    test('smoothScalar', () => {
        expect(Color.smoothScalar(255)).toEqual(0);
        expect(Color.smoothScalar(128)).toEqual(99);
        expect(Color.smoothScalar(0)).toEqual(0);

        expect(Color.smoothScalar(100, 100)).toEqual(0);
        expect(Color.smoothScalar(50, 100)).toEqual(100);
        expect(Color.smoothScalar(0, 100)).toEqual(0);

    });

    test('toLight', () => {
        const c = Color.from('#f00');
        expect(c.toLight()).toEqual([100,0,0]);
    });
});
