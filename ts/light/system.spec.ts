import 'jest-extended';
import '../../test/matchers';

import * as Light from '.';
import * as Color from '../color';
import * as Grid from '../grid';
import * as XY from '../xy';
import { data as DATA } from '../data';

interface TestLightSite extends Light.LightSystemSite {
    grid: Grid.NumGrid;
    flags: Grid.NumGrid;
    ambientLight: Color.LightValue;

    glowLights: Light.StaticLightInfo[];
    dynamicLights: Light.StaticLightInfo[];
}

describe('light system', () => {
    let site: TestLightSite;
    let system: Light.LightSystem;

    function makeSite(w: number, h: number): TestLightSite {
        const grid = Grid.alloc(w, h);
        XY.forBorder(0, 0, w, h, (x, y) => (grid[x][y] = 1));

        const flags = Grid.alloc(w, h);

        const glowLights: Light.StaticLightInfo[] = [];
        const dynamicLights: Light.StaticLightInfo[] = [];

        return {
            width: w,
            height: h,
            ambientLight: [100, 100, 100],

            grid,
            flags,

            glowLights,
            dynamicLights,

            hasXY(x: number, y: number): boolean {
                return grid.hasXY(x, y);
            },

            hasActor: jest.fn().mockReturnValue(false),
            blocksVision(x: number, y: number): boolean {
                return grid[x][y] > 0;
            },

            eachGlowLight: jest.fn().mockImplementation((cb: Light.LightCb) => {
                for (let i = 0; i < glowLights.length; ++i) {
                    const gl = glowLights[i];
                    cb(gl.x, gl.y, gl.light);
                }
            }),
            eachDynamicLight: jest
                .fn()
                .mockImplementation((cb: Light.LightCb) => {
                    for (let i = 0; i < dynamicLights.length; ++i) {
                        const gl = dynamicLights[i];
                        cb(gl.x, gl.y, gl.light);
                    }
                }),

            // setCellFlag(x: number, y: number, flag: number): void {
            //     flags[x][y] |= flag;
            // },
            // clearCellFlag(x: number, y: number, flag: number): void {
            //     flags[x][y] &= ~flag;
            // },
            // hasCellFlag(x: number, y: number, flag: number): boolean {
            //     return !!(flags[x][y] & flag);
            // },
        };
    }

    beforeEach(() => {
        site = makeSite(20, 20);
        system = new Light.LightSystem(site);
    });

    afterEach(() => {
        if (site) {
            Grid.free(site.grid);
            Grid.free(site.flags);
        }
    });

    test('copy', () => {
        const other = new Light.LightSystem(site);

        // @ts-ignore
        site.hasActor.mockImplementation((x, y) => x === 9 && y === 9);

        other.setAmbient(0x999);
        other.addStatic(10, 10, 'red,5,0');
        other.update();

        expect(other.getLight(10, 10)).not.toEqual(system.getLight(10, 10));
        expect(system.getAmbient()).not.toEqual(other.getAmbient());
        expect(system.staticLights).toBeNull();

        // Copy copies the data
        system.copy(other);
        expect(other.getLight(10, 10)).not.toEqual(system.getLight(10, 10));
        expect(system.getAmbient()).toEqual(other.getAmbient());
        expect(system.changed).toBeTruthy();
        expect(system.needsUpdate).toBeTruthy();
        expect(system.staticLights).not.toBeNull();
        expect(system.staticLights).toEqual(other.staticLights);

        // Update redoes the calculations
        system.update();
        expect(other.getLight(10, 10)).toEqual(system.getLight(10, 10));
        expect(system.getAmbient()).toEqual(other.getAmbient());
        expect(system.changed).toBeTruthy();
        expect(system.needsUpdate).toBeFalsy();

        system.update();
        expect(system.changed).toBeFalsy();
    });

    test('setLight', () => {
        expect(system.getLight(5, 5)).toEqual([100, 100, 100]);
        system.setLight(5, 5, [50, 50, 50]);
        expect(system.getLight(5, 5)).toEqual([50, 50, 50]);
    });

    describe('updateLighting', () => {
        test('defaults to having white light', () => {
            XY.forRect(site.width, site.height, (x, y) => {
                expect(system.getLight(x, y)).toEqual([100, 100, 100]);
            });
        });

        test('will return to default from stable glow lights', () => {
            system.glowLightChanged = true;
            system.update();

            expect(system.glowLightChanged).toBeFalsy();
            expect(system.dynamicLightChanged).toBeFalsy();

            XY.forRect(site.width, site.height, (x, y) => {
                expect(system.getLight(x, y)).toEqual([100, 100, 100]);
                expect(system.isInShadow(x, y)).toBeFalsy();
                expect(system.isLit(x, y)).toBeTruthy();
                expect(system.isDark(x, y)).toBeFalsy();
                expect(system.lightChanged(x, y)).toBeFalsy();
            });
        });

        test('will set ambient light', () => {
            expect(system.ambient).toEqual(Color.colors.white.toLight());

            system.setAmbient([0, 0, 100]);
            system.glowLightChanged = false;

            // stable glow lights will keep ambient light change from taking hold
            system.update();

            XY.forRect(site.width, site.height, (x, y) => {
                expect(system.getLight(x, y)).toEqual([100, 100, 100]);
            });

            system.glowLightChanged = true;
            system.update();

            XY.forRect(site.width, site.height, (x, y) => {
                expect(system.getLight(x, y)).toEqual([0, 0, 100]);
            });
        });

        test('will add lights from tiles', () => {
            const torch = Light.install('TORCH', {
                color: 'yellow',
                radius: 3,
                fadeTo: 50,
            });

            system.setAmbient(Color.colors.black);
            expect(system.dynamicLightChanged).toBeFalsy();
            expect(system.glowLightChanged).toBeTruthy();

            site.glowLights.push({
                x: 10,
                y: 10,
                light: torch,
                next: null,
            });

            expect(system.update()).toBeTruthy();

            expect(site.eachGlowLight).toHaveBeenCalled();

            expect(system.getLight(1, 1)).toEqual([0, 0, 0]);
            expect(system.getLight(10, 10)).toEqual([100, 100, 0]);
        });

        test('will add lights from tiles to ambient light', () => {
            Light.install('TORCH', {
                color: 'yellow',
                radius: 3,
                fadeTo: 50,
            });

            system.setAmbient(Color.make(0x202020, true));
            site.glowLights.push({
                x: 10,
                y: 10,
                light: Light.lights.TORCH,
                next: null,
            });

            system.update();

            expect(system.getLight(1, 1)).toEqual([13, 13, 13]); // ambient only

            expect(system.getLight(10, 10)).toEqual([113, 113, 13]); // ambient + 100% light
            expect(system.getLight(9, 10)).toEqual([96, 96, 13]); // ambient + 87% light
            expect(system.getLight(8, 10)).toEqual([79, 79, 13]); // ambient + 64% light
            expect(system.getLight(7, 10)).toEqual([63, 63, 13]); // ambient + 50% light
            expect(system.getLight(6, 10)).toEqual([13, 13, 13]); // ambient + 0% light
        });

        test('will handle static lights', () => {
            Light.install('TORCH', {
                color: 'yellow',
                radius: 3,
                fadeTo: 50,
            });

            system.setAmbient(Color.make(0x202020, true));

            system.glowLightChanged = false;
            system.addStatic(10, 10, Light.lights.TORCH);
            expect(system.glowLightChanged).toBeTruthy();

            system.update();

            expect(system.getLight(1, 1)).toEqual([13, 13, 13]); // ambient only

            expect(system.getLight(10, 10)).toEqual([113, 113, 13]); // ambient + 100% light
            expect(system.getLight(9, 10)).toEqual([96, 96, 13]); // ambient + 87% light
            expect(system.getLight(8, 10)).toEqual([79, 79, 13]); // ambient + 64% light
            expect(system.getLight(7, 10)).toEqual([63, 63, 13]); // ambient + 50% light
            expect(system.getLight(6, 10)).toEqual([13, 13, 13]); // ambient + 0% light

            system.removeStatic(10, 10, Light.lights.TORCH);
            expect(system.glowLightChanged).toBeTruthy();

            system.update();
            expect(system.getLight(1, 1)).toEqual([13, 13, 13]); // ambient only
            expect(system.getLight(10, 10)).toEqual([13, 13, 13]); // ambient only

            system.addStatic(10, 10, Light.lights.TORCH);
            system.addStatic(5, 5, Light.lights.TORCH);
            system.addStatic(15, 15, Light.lights.TORCH);

            system.removeStatic(15, 15, Light.lights.TORCH);
            system.removeStatic(10, 10, Light.lights.TORCH);
            system.removeStatic(5, 5, Light.lights.TORCH);

            expect(system.staticLights).toBeNull();
            system.removeStatic(5, 5, Light.lights.TORCH);
            expect(system.staticLights).toBeNull();
        });
    });

    test('dynamic lights', () => {
        system.setAmbient([0, 0, 0]);

        system.update();
        expect(system.getLight(3, 3)).toEqual([0, 0, 0]);

        site.dynamicLights.push({
            x: 3,
            y: 3,
            light: Light.make('white, 3, 100'),
            next: null,
        });
        system.dynamicLightChanged = true;

        system.update();
        expect(system.getLight(3, 3)).toEqual([100, 100, 100]);
    });

    test('PLAYERS_LIGHT', () => {
        Light.install('PLAYERS_LIGHT', 'white, 3, 100, true');

        // @ts-ignore
        site.hasActor.mockImplementation((x, y) => x === 3 && y === 3);
        system.setAmbient([0, 0, 0]);
        system.update();

        expect(system.getLight(3, 3)).toEqual([0, 0, 0]);
        DATA.player = { x: 3, y: 3 };

        system.glowLightChanged = true;
        system.update();

        expect(system.getLight(3, 3)).toEqual([100, 100, 100]);
    });

    test('Player - no light', () => {
        delete Light.lights.PLAYERS_LIGHT;

        system.setAmbient([0, 0, 0]);
        system.update();

        expect(system.getLight(3, 3)).toEqual([0, 0, 0]);
        DATA.player = { x: 3, y: 3 };

        system.glowLightChanged = true;
        system.update();

        expect(system.getLight(3, 3)).toEqual([0, 0, 0]);
    });

    test('shadow', () => {
        expect(system.isInShadow(10, 10)).toBeFalsy();

        system.setAmbient(0x444);
        system.update();

        expect(system.isInShadow(10, 10)).toBeTruthy();
    });

    // test('playerInDarkness', () => {
    //     const map = GW.make.map(10, 10, 'FLOOR');
    //     const cell = map.cell(3, 3);
    //     expect(cell.light).toEqual([100, 100, 100]);
    //     expect(Light.playerInDarkness(map, { x: 3, y: 3 })).toBeFalsy();
    //     cell.light = [10, 10, 10];
    //     expect(Light.playerInDarkness(map, { x: 3, y: 3 })).toBeTruthy();
    //     expect(
    //         Light.playerInDarkness(map, { x: 3, y: 3 }, Color.colors.black)
    //     ).toBeFalsy();
    // });
});
