import 'jest-extended';
import '../../test/matchers';

import * as Light from '.';
import * as Color from '../color';

describe('light', () => {
    let light: Light.LightType;

    function makeSite(w: number, h: number): Light.PaintSite {
        return {
            width: w,
            height: h,

            calcFov: jest.fn(),
            addCellLight: jest.fn(),
        };
    }

    test('constructor', () => {
        const a = new Light.Light('red');
        expect(a.fadeTo).toEqual(0);
        expect(a.radius.toString()).toEqual('1');

        // @ts-ignore
        expect(() => Light.make(8)).toThrow();
    });

    test('paint - oddities', () => {
        const site = makeSite(10, 10);
        const light = Light.make('red', 0, 0);

        // @ts-ignore
        expect(light.paint(null)).toBeFalsy();
        expect(light.paint(site, 5, 5)).toBeFalsy();
    });

    test('paint', () => {
        const site = makeSite(10, 10);
        const light = Light.make('red', 3, 0);

        // @ts-ignore
        site.calcFov.mockImplementation((x, y, radius, pass, cb) => {
            const offset = Math.floor(radius / 2);
            for (let i = 0; i < radius; ++i) {
                cb(x + i - offset, y);
                cb(x, y + i - offset);
            }
        });

        expect(light.paint(site, 5, 5)).toBeTruthy();
    });

    test('will create lights', () => {
        light = Light.make({ color: 'blue', radius: 3, fadeTo: 50 });
        expect(light.color).toEqual(Color.colors.blue);
        expect(light.radius).toMatchObject({ clumps: 1, hi: 3, lo: 3 });
        expect(light.fadeTo).toEqual(50);
        expect(light.passThroughActors).toBeFalsy();

        light = Light.make('blue', 3, 50);
        expect(light.color).toEqual(Color.colors.blue);
        expect(light.radius).toMatchObject({ clumps: 1, hi: 3, lo: 3 });
        expect(light.fadeTo).toEqual(50);
        expect(light.passThroughActors).toBeFalsy();

        light = Light.make(['blue', 3, 50]);
        expect(light.color).toEqual(Color.colors.blue);
        expect(light.radius).toMatchObject({ clumps: 1, hi: 3, lo: 3 });
        expect(light.fadeTo).toEqual(50);
        expect(light.passThroughActors).toEqual(false);

        light = Light.make('blue, 3, 50, true');
        expect(light.color).toEqual(Color.colors.blue);
        expect(light.radius).toMatchObject({ clumps: 1, hi: 3, lo: 3 });
        expect(light.fadeTo).toEqual(50);
        expect(light.passThroughActors).toBeTruthy();

        light = Light.make('blue, 3, 50, false');
        expect(light.color).toEqual(Color.colors.blue);
        expect(light.radius).toMatchObject({ clumps: 1, hi: 3, lo: 3 });
        expect(light.fadeTo).toEqual(50);
        expect(light.passThroughActors).toBe(false);

        light = Light.make('red');
        expect(light.color).toEqual(Color.colors.red);
        expect(light.radius).toMatchObject({ clumps: 1, hi: 1, lo: 1 });
        expect(light.fadeTo).toEqual(0);
        expect(light.passThroughActors).toBe(false);
    });

    test('install', () => {
        let light: Light.Light;

        light = Light.install('TEST', 'red', 3, 0);
        expect(Light.make('TEST')).toBe(light);
        expect(Light.lights.TEST).toBe(light);
    });

    test('copy', () => {
        const a = Light.make('blue', 3, 0);
        const b = Light.make('red', 3, 0);

        expect(a).not.toMatchObject(b);
        a.copy(b);
        expect(a).toMatchObject(b);
    });

    // TODO -
    test('intensity', () => {
        const a = Light.make('white', 4, 0);
        expect(a.intensity).toEqual(100);

        const b = Light.make('green', 3, 0);
        expect(b.intensity).toEqual(100);

        const c = Light.make(0x888, 3, 0);
        expect(c.intensity).toEqual(53);

        const d = Light.make(0x000, 3, 0);
        expect(d.intensity).toEqual(0);
    });

    test('from', () => {
        light = Light.install('TEST', { color: 'teal', radius: 2 });

        expect(Light.from('TEST')).toBe(light);
        expect(Light.from('red, 3, 0')).toMatchObject({
            color: Color.colors.red,
            radius: { clumps: 1, hi: 3, lo: 3 },
            fadeTo: 0,
        });
        // @ts-ignore
        expect(() => Light.from('teal', 3, 50)).toThrow();
    });

    test('can add light kinds', () => {
        light = Light.install('TEST', {
            color: 'blue',
            radius: 3,
            fadeTo: 50,
        });
        expect(light).toBe(Light.lights.TEST);
        expect(light.id).toEqual('TEST');
        expect(light.color).toEqual(Color.colors.blue);
        expect(light.radius).toMatchObject({ clumps: 1, hi: 3, lo: 3 });
        expect(light.fadeTo).toEqual(50);
        expect(light.passThroughActors).toBeFalsy();

        light = Light.install('TEST2', 'blue', 3, 50);
        expect(light).toBe(Light.lights.TEST2);
        expect(light.id).toEqual('TEST2');
        expect(light.color).toEqual(Color.colors.blue);
        expect(light.radius).toMatchObject({ clumps: 1, hi: 3, lo: 3 });
        expect(light.fadeTo).toEqual(50);
        expect(light.passThroughActors).toBeFalsy();

        light = Light.install('TEST3', 'blue, 3, 50');
        expect(light).toBe(Light.lights.TEST3);
        expect(light.id).toEqual('TEST3');
        expect(light.color).toEqual(Color.colors.blue);
        expect(light.radius).toMatchObject({ clumps: 1, hi: 3, lo: 3 });
        expect(light.fadeTo).toEqual(50);
        expect(light.passThroughActors).toBeFalsy();
    });

    test('installAll', () => {
        Light.installAll({
            TEST4: { color: 'blue', radius: 3, fadeTo: 50 },
            TEST5: 'red, 4, 100',
            TEST6: ['green', 5, 0],
        });

        light = Light.lights.TEST4;
        expect(light.id).toEqual('TEST4');
        expect(light.color).toEqual(Color.colors.blue);
        expect(light.radius).toMatchObject({ clumps: 1, hi: 3, lo: 3 });
        expect(light.fadeTo).toEqual(50);
        expect(light.passThroughActors).toBeFalsy();

        light = Light.lights.TEST5;
        expect(light.id).toEqual('TEST5');
        expect(light.color).toEqual(Color.colors.red);
        expect(light.radius).toMatchObject({ clumps: 1, hi: 4, lo: 4 });
        expect(light.fadeTo).toEqual(100);
        expect(light.passThroughActors).toBeFalsy();

        light = Light.lights.TEST6;
        expect(light.id).toEqual('TEST6');
        expect(light.color).toEqual(Color.colors.green);
        expect(light.radius).toMatchObject({ clumps: 1, hi: 5, lo: 5 });
        expect(light.fadeTo).toEqual(0);
        expect(light.passThroughActors).toBeFalsy();

        expect(Light.make('TEST6')).toBe(light);
    });

    test('isDarkLight', () => {
        expect(Light.isDarkLight(Color.colors.black, 20)).toBeTruthy();
        expect(Light.isDarkLight(Color.colors.white)).toBeFalsy();
        expect(Light.isDarkLight(Color.from(0x444))).toBeFalsy();
    });

    test('isShadowLight', () => {
        expect(Light.isShadowLight(Color.colors.black, 20)).toBeTruthy();
        expect(Light.isShadowLight(Color.colors.white)).toBeFalsy();
        expect(Light.isShadowLight(Color.from(0x444))).toBeTruthy();
    });
});
