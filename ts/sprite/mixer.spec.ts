import * as Color from '../color';
import { Mixer, makeMixer } from './mixer';
import { cosmetic } from '../rng';

describe('Mixer', () => {
    beforeEach(() => {
        jest.spyOn(cosmetic, 'int').mockImplementation((n?: number) =>
            n ? Math.floor(n / 2) : 5
        );
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    test('create', () => {
        const mixer = new Mixer();
        expect(mixer.ch).toEqual(null);
        expect(mixer.fg.isNull()).toBeTruthy();
        expect(mixer.bg.isNull()).toBeTruthy();

        const b = makeMixer();
        expect(b.ch).toEqual(null);
        expect(b.fg.isNull()).toBeTruthy();
        expect(b.bg.isNull()).toBeTruthy();
    });

    test('copy', () => {
        const a = new Mixer();
        a.draw('@', 0xfff, 0x333);
        expect(a.ch).toEqual('@');
        expect(a.fg.css()).toEqual('#fff');
        expect(a.bg.css()).toEqual('#333');

        const b = new Mixer();
        b.copy(a);
        expect(b.ch).toEqual('@');
        expect(b.fg.css()).toEqual('#fff');
        expect(b.bg.css()).toEqual('#333');
        expect(b.equals(a)).toBeTruthy();
        expect(a.equals(b)).toBeTruthy();

        b.copy({});
        expect(b.ch).toEqual(null);
        expect(b.fg.css()).toEqual('transparent');
        expect(b.bg.css()).toEqual('transparent');
    });

    test('clone', () => {
        const a = new Mixer();
        a.draw('@', 0xfff, 0x333);
        expect(a.ch).toEqual('@');
        expect(a.fg.css()).toEqual('#fff');
        expect(a.bg.css()).toEqual('#333');

        const b = a.clone();
        expect(b.ch).toEqual('@');
        expect(b.fg.css()).toEqual('#fff');
        expect(b.bg.css()).toEqual('#333');
    });

    test('nullify', () => {
        const a = new Mixer();
        a.draw('@', 0xfff, 0x333);
        expect(a.ch).toEqual('@');
        expect(a.fg.css()).toEqual('#fff');
        expect(a.bg.css()).toEqual('#333');

        a.nullify();
        expect(a.ch).toEqual(null);
        expect(a.fg.toInt()).toEqual(0x0000);
        expect(a.bg.toInt()).toEqual(0x0000);
    });

    test('blackOut', () => {
        const a = new Mixer();
        a.draw('@', 0xfff, 0x333);
        expect(a.ch).toEqual('@');
        expect(a.fg.css()).toEqual('#fff');
        expect(a.bg.css()).toEqual('#333');

        a.blackOut();
        expect(a.ch).toEqual(null);
        expect(a.fg.toInt()).toEqual(0x000f);
        expect(a.bg.toInt()).toEqual(0x000f);
    });

    test('draw', () => {
        const mixer = new Mixer();
        mixer.draw('@', 0xf00, Color.fromCss('#00F'));
        expect(mixer.ch).toEqual('@');
        expect(mixer.fg.css()).toEqual('#f00');
        expect(mixer.bg.css()).toEqual('#00f');

        mixer.draw(null, 0x00f, 0x666);
        expect(mixer.ch).toEqual('@');
        expect(mixer.fg.css()).toEqual('#00f');
        expect(mixer.bg.css()).toEqual('#666');

        mixer.draw('!');
        expect(mixer.ch).toEqual('!');
        expect(mixer.fg.css()).toEqual('#00f');
        expect(mixer.bg.css()).toEqual('#666');

        mixer.draw(); // does nothing (just to clear coverage report)
        expect(mixer.ch).toEqual('!');
        expect(mixer.fg.css()).toEqual('#00f');
        expect(mixer.bg.css()).toEqual('#666');
    });

    test('drawSprite', () => {
        const mixer = new Mixer();
        mixer.drawSprite({ ch: '@', fg: 0xf00, bg: Color.fromCss('#00F') });
        expect(mixer.ch).toEqual('@');
        expect(mixer.fg.css()).toEqual('#f00');
        expect(mixer.bg.css()).toEqual('#00f');

        mixer.drawSprite({ ch: 'd', fg: Color.fromCss('#00F'), bg: 0xff0 });
        expect(mixer.ch).toEqual('d');
        expect(mixer.fg.css()).toEqual('#00f');
        expect(mixer.bg.css()).toEqual('#ff0');

        // no change if no opacity
        mixer.drawSprite({ ch: '@', fg: '#F000', bg: Color.fromCss('#00F0') });
        expect(mixer.ch).toEqual('d');
        expect(mixer.fg.css()).toEqual('#00f');
        expect(mixer.bg.css()).toEqual('#ff0');

        mixer.drawSprite({ ch: '@', fg: '#F008', bg: Color.fromCss('#00F8') });
        expect(mixer.ch).toEqual('@');
        expect(mixer.fg.css()).toEqual('#807b');
        expect(mixer.bg.css()).toEqual('#778b');

        // @ts-ignore
        mixer.drawSprite({});
        expect(mixer.ch).toEqual('@');
        expect(mixer.fg.css()).toEqual('#807b');
        expect(mixer.bg.css()).toEqual('#778b');

        // -1 means do not draw
        mixer.drawSprite({ ch: null, fg: -1, bg: -1 });
        expect(mixer.ch).toEqual('@');
        expect(mixer.fg.css()).toEqual('#807b');
        expect(mixer.bg.css()).toEqual('#778b');

        expect(mixer.drawSprite(mixer)).toBe(mixer);
    });

    test('swap', () => {
        const mixer = new Mixer();
        mixer.draw('@', 0xf00, Color.fromCss('#00F'));
        expect(mixer.ch).toEqual('@');
        expect(mixer.fg.css()).toEqual('#f00');
        expect(mixer.bg.css()).toEqual('#00f');

        mixer.swap();
        expect(mixer.fg.css()).toEqual('#00f');
        expect(mixer.bg.css()).toEqual('#f00');
    });

    test('multiply', () => {
        const mixer = new Mixer();
        mixer.draw('@', 0xf00, Color.fromCss('#00F'));
        expect(mixer.ch).toEqual('@');
        expect(mixer.fg.css()).toEqual('#f00');
        expect(mixer.bg.css()).toEqual('#00f');

        const light = Color.fromArray([200, 50, 50]);
        mixer.multiply(light);
        expect(mixer.fg.css()).toEqual('#f00');
        expect(mixer.bg.css()).toEqual('#008');

        mixer.draw('@', 0xf00, Color.fromCss('#00F'));
        expect(mixer.ch).toEqual('@');
        expect(mixer.fg.css()).toEqual('#f00');
        expect(mixer.bg.css()).toEqual('#00f');

        mixer.multiply(light, false, true);
        expect(mixer.ch).toEqual('@');
        expect(mixer.fg.css()).toEqual('#f00');
        expect(mixer.bg.css()).toEqual('#008');

        mixer.draw('@', 0x800, Color.fromCss('#00F'));
        expect(mixer.ch).toEqual('@');
        expect(mixer.fg.css()).toEqual('#800');
        expect(mixer.bg.css()).toEqual('#00f');

        mixer.multiply(light, true, false);
        expect(mixer.ch).toEqual('@');
        expect(mixer.fg.css()).toEqual('#f00');
        expect(mixer.bg.css()).toEqual('#00f');
    });

    test('mix', () => {
        const mixer = new Mixer();
        mixer.draw('@', 0xf00, Color.fromCss('#00F'));
        expect(mixer.ch).toEqual('@');
        expect(mixer.fg.css()).toEqual('#f00');
        expect(mixer.bg.css()).toEqual('#00f');

        const water = Color.fromNumber(0x66f);
        mixer.mix(water);
        expect(mixer.ch).toEqual('@');
        expect(mixer.fg.css()).toEqual('#b38');
        expect(mixer.bg.css()).toEqual('#33f');

        mixer.draw('@', 0xf00, Color.fromCss('#00F'));
        mixer.mix(water, 0, 0); // does nothing
        expect(mixer.ch).toEqual('@');
        expect(mixer.fg.css()).toEqual('#f00');
        expect(mixer.bg.css()).toEqual('#00f');
    });

    test('add', () => {
        const mixer = new Mixer();
        mixer.draw('@', 0xf00, Color.fromCss('#00F'));
        expect(mixer.ch).toEqual('@');
        expect(mixer.fg.css()).toEqual('#f00');
        expect(mixer.bg.css()).toEqual('#00f');

        const water = Color.fromNumber(0x003);
        mixer.add(water);
        expect(mixer.fg.css()).toEqual('#f03');
        expect(mixer.bg.css()).toEqual('#00f');

        mixer.draw('@', 0xf00, Color.fromCss('#00F'));
        mixer.add(water, 0, 0); // does nothing
        expect(mixer.ch).toEqual('@');
        expect(mixer.fg.css()).toEqual('#f00');
        expect(mixer.bg.css()).toEqual('#00f');
    });

    test('separate', () => {
        const mixer = new Mixer();
        mixer.draw('@', Color.fromCss('#F80'), 0xd73);
        expect(mixer.ch).toEqual('@');
        expect(mixer.fg.css()).toEqual('#f80');
        expect(mixer.bg.css()).toEqual('#d73');

        mixer.separate();
        expect(mixer.fg.css()).toEqual('#fb6');
        expect(mixer.bg.css()).toEqual('#742');
    });

    test('bake - dancing', () => {
        const mixer = new Mixer();
        mixer.draw(
            '@',
            0xd73,
            Color.fromArray([50, 50, 50]).dance(50, 10, 10, 10)
        );
        expect(mixer.ch).toEqual('@');
        expect(mixer.fg.css()).toEqual('#d73');
        expect(mixer.bg.rgb()).toEqual([128, 128, 128]);
        expect(mixer.dances).toBeTruthy();
        expect(mixer.bg.css(false)).toEqual('#888');
        expect(mixer.bg.css(true)).toEqual('#ccc');

        const baked = mixer.bake();
        expect(baked.ch).toEqual('@');
        expect(baked.fg.css()).toEqual('#d73');
        expect(baked.bg.css(false)).toEqual('#888');
        expect(baked.bg.css(true)).toEqual('#ccc');
        expect(baked.fg.toInt()).toEqual(0xd73f);
        expect(baked.bg.toInt(false)).toEqual(0x888f);
        expect(baked.bg.toInt(true)).toEqual(0xcccf);
        expect(baked.dances).toBeTruthy();
    });

    test('bake - rand', () => {
        const mixer = new Mixer();
        mixer.draw(
            '@',
            0xd73,
            Color.fromArray([50, 50, 50]).rand(50, 10, 10, 10)
        );
        expect(mixer.ch).toEqual('@');
        expect(mixer.fg.css()).toEqual('#d73');
        expect(mixer.bg.rgb()).toEqual([128, 128, 128]);
        expect(mixer.dances).toBeFalsy();
        expect(mixer.bg.css(false)).toEqual('#888');
        expect(mixer.bg.css(true)).toEqual('#ccc');

        const baked = mixer.bake();
        expect(baked.ch).toEqual('@');
        expect(baked.fg.css()).toEqual('#d73');
        expect(baked.bg.css(false)).toEqual('#ccc');
        expect(baked.bg.css(true)).toEqual('#ccc');
        expect(baked.fg.toInt()).toEqual(0xd73f);
        expect(baked.bg.toInt(false)).toEqual(0xcccf);
        expect(baked.bg.toInt(true)).toEqual(0xcccf);
        expect(baked.dances).toBeFalsy();
    });

    test('scale', () => {
        const mixer = new Mixer({ ch: '@', fg: 'red', bg: 'white' });
        expect(mixer.fg.css()).toEqual('#f00');
        expect(mixer.bg.css()).toEqual('#fff');
        mixer.scale(50);
        expect(mixer.fg.css()).toEqual('#800');
        expect(mixer.bg.css()).toEqual('#888');

        mixer.scale(200, false, false);
        expect(mixer.fg.css()).toEqual('#800');
        expect(mixer.bg.css()).toEqual('#888');
    });

    test('toString', () => {
        const mixer = new Mixer({ ch: '@', fg: 'red', bg: 'black' });
        expect(mixer.fg).toBe(Color.colors.red); // colors are const
        expect(mixer.fg.name).toEqual('red');
        expect(mixer.toString()).toEqual('{ ch: @, fg: red, bg: black }');
    });
});
