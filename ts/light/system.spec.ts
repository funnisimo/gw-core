import 'jest-extended';
import '../../test/matchers';

import * as Light from '.';
import * as Color from '../color';
import * as Grid from '../grid';
import * as Utils from '../utils';
import { data as DATA } from '../gw';

interface TestLightSystem extends Light.LightSystemSite {
    grid: Grid.NumGrid;
    flags: Grid.NumGrid;
    ambientLight: Light.LightValue;

    glowLights: Light.StaticLightInfo[];
    dynamicLights: Light.StaticLightInfo[];
}

describe('light', () => {
    let site: TestLightSystem;
    let system: Light.LightSystem;

    function makeSite(w: number, h: number): TestLightSystem {
        const grid = Grid.alloc(w, h);
        Utils.forBorder(0, 0, w, h, (x, y) => (grid[x][y] = 1));

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

    describe('updateLighting', () => {
        test('defaults to having white light', () => {
            Utils.forRect(site.width, site.height, (x, y) => {
                expect(system.getLight(x, y)).toEqual([100, 100, 100]);
            });
        });

        test('will return to default from stable glow lights', () => {
            system.glowLightChanged = true;
            system.update();

            expect(system.glowLightChanged).toBeFalsy();
            expect(system.dynamicLightChanged).toBeFalsy();

            Utils.forRect(site.width, site.height, (x, y) => {
                expect(system.getLight(x, y)).toEqual([100, 100, 100]);
                expect(system.isInShadow(x, y)).toBeFalsy();
                expect(system.isLit(x, y)).toBeTruthy();
                expect(system.isDark(x, y)).toBeFalsy(); // Huh?
                expect(system.lightChanged(x, y)).toBeFalsy();
            });
        });

        test('will set ambient light', () => {
            expect(system.ambient).toEqual(Color.colors.white.toLight());

            system.setAmbient([0, 0, 100]);
            system.glowLightChanged = false;

            // stable glow lights will keep ambient light change from taking hold
            system.update();

            Utils.forRect(site.width, site.height, (x, y) => {
                expect(system.getLight(x, y)).toEqual([100, 100, 100]);
            });

            system.glowLightChanged = true;
            system.update();

            Utils.forRect(site.width, site.height, (x, y) => {
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

        system.setAmbient([0, 0, 0]);
        system.update();

        expect(system.getLight(3, 3)).toEqual([0, 0, 0]);
        DATA.player = { x: 3, y: 3 };

        system.glowLightChanged = true;
        system.update();

        expect(system.getLight(3, 3)).toEqual([100, 100, 100]);
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
