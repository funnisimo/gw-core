import 'jest-extended';
import '../../test/matchers';
// import * as UTILS from '../../test/utils';
import * as Map from '.';
import * as Effect from '../effect';
import * as Grid from '../grid';
import { data as DATA } from '../gw';
import { random } from '../random';
import * as Events from '../events';
import * as Tile from '../tile';
import * as Utils from '../utils';

import * as MapEffect from './effect';
import { Depth } from '../gameObject/flags';
import { Actor } from '../actor';
import { Item } from '../item';

describe('tile effect', () => {
    let map: Map.Map;
    let ctx: any;
    let effect: Effect.EffectInfo;
    let grid: Grid.NumGrid;

    beforeEach(() => {
        map = Map.make(20, 20, 'FLOOR', 'WALL');

        DATA.gameHasEnded = false;
        effect = {} as Effect.EffectInfo;

        random.seed(12345);
        Events.removeAllListeners();
        grid = Grid.alloc(20, 20);
        ctx = { x: 10, y: 10, grid };
    });

    afterEach(() => {
        Grid.free(grid);
    });

    describe('spread', () => {
        test('tile', () => {
            effect = Effect.make({
                tile: 'WALL,0,0',
            });

            expect(effect.tile.grow).toEqual(0);
            expect(effect.tile.decrement).toEqual(0);

            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();

            expect(grid.count((v) => !!v)).toEqual(1);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
            grid.eachNeighbor(ctx.x, ctx.y, (v) => expect(v).toEqual(0), true);
        });

        test('tile and neighbors', () => {
            effect = Effect.make({
                tile: { id: 'WALL', grow: 100, decrement: 100 },
            });

            expect(effect.tile.grow).toEqual(100);
            expect(effect.tile.decrement).toEqual(100);

            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();

            expect(grid.count((v) => !!v)).toEqual(5);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
            grid.eachNeighbor(ctx.x, ctx.y, (v) => expect(v).toEqual(2), true);
        });

        test('2 levels', () => {
            effect = Effect.make({
                tile: { tile: 'WALL', grow: 200, decrement: 100 },
            });

            expect(effect.tile.grow).toEqual(200);
            expect(effect.tile.decrement).toEqual(100);

            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();

            expect(grid.count((v) => !!v)).toEqual(1 + 4 + 8);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
            grid.eachNeighbor(ctx.x, ctx.y, (v) => expect(v).toEqual(2), true);
            expect(grid.count(3)).toEqual(8);
        });

        test('build in walls', () => {
            // not on a wall
            effect = Effect.make({
                tile: { id: 'WALL' },
                flags: 'E_BUILD_IN_WALLS',
            });
            expect(effect.flags & Effect.Flags.E_BUILD_IN_WALLS).toBeTruthy();
            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeFalsy();
            expect(grid.count(1)).toEqual(0);
            expect(grid.count(0)).toEqual(map.width * map.height);

            // wall
            map.setTile(ctx.x, ctx.y, 'WALL');

            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();

            expect(grid.count(1)).toEqual(1);
            expect(grid.count(0)).toEqual(map.width * map.height - 1);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
        });

        test('must touch walls', () => {
            // not near a wall
            effect = Effect.make({
                tile: { id: 'WALL' },
                flags: 'E_MUST_TOUCH_WALLS',
            })!;
            expect(effect.flags & Effect.Flags.E_MUST_TOUCH_WALLS).toBeTruthy();
            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeFalsy();
            expect(grid.count(1)).toEqual(0);
            expect(grid.count(0)).toEqual(map.width * map.height);

            // not on a wall
            map.setTile(ctx.x, ctx.y, 'WALL');
            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeFalsy();
            expect(grid.count(1)).toEqual(0);
            expect(grid.count(0)).toEqual(map.width * map.height);
            expect(grid[ctx.x][ctx.y]).toEqual(0);

            // next to a wall
            map.setTile(ctx.x, ctx.y, 'FLOOR');
            map.setTile(ctx.x, ctx.y - 1, 'WALL');
            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();
            expect(grid.count(1)).toEqual(1);
            expect(grid.count(0)).toEqual(map.width * map.height - 1);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
        });

        test('no touch walls', () => {
            effect = Effect.make({
                tile: { id: 'WALL', grow: 100, decrement: 100 },
                flags: 'E_NO_TOUCH_WALLS',
            });
            expect(effect.flags & Effect.Flags.E_NO_TOUCH_WALLS).toBeTruthy();

            // no walls - ok
            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();
            expect(grid.count(1)).toEqual(1);
            expect(grid.count((v) => !!v)).toEqual(5);
            expect(grid[ctx.x][ctx.y]).toEqual(1);

            // on a wall - no
            map.setTile(ctx.x, ctx.y, 'WALL');
            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeFalsy();
            expect(grid.count(1)).toEqual(0);
            expect(grid.count(0)).toEqual(map.width * map.height);
            expect(grid[ctx.x][ctx.y]).toEqual(0);

            // next to a wall - no
            map.setTile(ctx.x, ctx.y, 'FLOOR');
            map.setTile(ctx.x, ctx.y - 1, 'WALL');
            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeFalsy();
            expect(grid.count(1)).toEqual(0);
            expect(grid.count(0)).toEqual(map.width * map.height);
            expect(grid[ctx.x][ctx.y]).toEqual(0);
        });

        test('spawn map - blocks effects', () => {
            effect = Effect.make({
                tile: 'WALL, 100, 100',
                flags: 'E_NO_TOUCH_WALLS',
            });

            // ok
            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();
            expect(grid.count(1)).toEqual(1);
            expect(grid.count(2)).toEqual(4);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
            grid.eachNeighbor(ctx.x, ctx.y, (v) => expect(v).toEqual(2), true);

            // blocks effects
            const tile = Tile.make({
                id: 'TEST',
                ch: '!',
                fg: 'green',
                flags: 'L_BLOCKS_EFFECTS',
            });

            map.setTile(ctx.x, ctx.y - 1, tile);
            map.setTile(ctx.x - 1, ctx.y, tile);

            expect(
                map
                    .cellInfo(ctx.x, ctx.y - 1)
                    .hasObjectFlag(Map.flags.GameObject.L_BLOCKS_EFFECTS)
            ).toBeTruthy();
            expect(
                map
                    .cellInfo(ctx.x - 1, ctx.y)
                    .hasObjectFlag(Map.flags.GameObject.L_BLOCKS_EFFECTS)
            ).toBeTruthy();

            let cell = map.cell(ctx.x - 1, ctx.y);
            expect(cell.blocksEffects()).toBeTruthy();
            cell = map.cell(ctx.x, ctx.y - 1);
            expect(cell.blocksEffects()).toBeTruthy();

            expect(effect.matchTile).toBeFalsy();

            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();
            expect(grid.count(1)).toEqual(1);
            expect(grid.count(2)).toEqual(2);
            expect(grid[ctx.x][ctx.y]).toEqual(1);
            expect(grid[ctx.x - 1][ctx.y]).toEqual(0);
            expect(grid[ctx.x + 1][ctx.y]).toEqual(2);
            expect(grid[ctx.x][ctx.y - 1]).toEqual(0);
            expect(grid[ctx.x][ctx.y + 1]).toEqual(2);
        });

        // { spread: 50 }
        test('{ spread: 50 }', () => {
            random.seed(12345);
            effect = Effect.make({
                tile: 'WALL, 50, 0',
            });

            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();

            // grid.dump();
            expect(grid.count((v) => !!v)).toEqual(3);
            expect(grid[10][10]).toEqual(1);
            expect(grid[10][9]).toEqual(2);
            expect(grid[10][11]).toEqual(0);
        });

        // { spread: 100, decrement: 100, matchTile: "DOOR" }
        test('{ spread: 100, decrement: 100, matchTile: "DOOR" }', () => {
            random.seed(12345);
            effect = Effect.make({
                tile: {
                    id: 'WALL',
                    grow: 100,
                    decrement: 10,
                    matchTile: 'DOOR',
                },
            });

            expect(effect.tile.matchTile).toEqual('DOOR');

            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();

            // grid.dump();
            expect(grid.count((v) => !!v)).toEqual(1); // There are no doors!

            map.setTile(9, 10, 'DOOR');
            // map.setTile(11, 10, 'DOOR');
            map.setTile(10, 9, 'DOOR');
            // map.setTile(10, 11, 'DOOR');

            grid.fill(0);

            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();
            // grid.dump();
            expect(grid.count((v) => !!v)).toEqual(3); // match some doors
        });

        // { spread: 50, decrement: 10 }
        test('{ spread: 50, decrement: 10 }', () => {
            random.seed(12345);
            effect = Effect.make({
                tile: { id: 'WALL', grow: 50, decrement: 10 },
            });

            expect(
                MapEffect.computeSpawnMap(effect, map, ctx.x, ctx.y, ctx)
            ).toBeTruthy();
            // grid.dump();
            expect(grid.count((v) => !!v)).toEqual(5);
            expect(grid[10][10]).toEqual(1);
            expect(grid[9][8]).toEqual(0);
            expect(grid[10][8]).toEqual(3);
        });

        // // DFF_SPREAD_CIRCLE
        // test('{ spread: 90, decrement: 10, spread circle }', () => {
        //     random.seed(1234567);
        //     feat = GW.make.tileEvent({
        //         tile: 'WALL',
        //         spread: 90,
        //         decrement: 10,
        //         flags: 'DFF_SPREAD_CIRCLE',
        //     })!;

        //     expect(feat.flags).toEqual(Map.tileEvent.Flags.DFF_SPREAD_CIRCLE);
        //     Map.tileEvent.computeSpawnMap(feat, grid, ctx);
        //     // grid.dump();
        //     expect(grid.count((v) => !!v)).toEqual(137);
        //     grid.forCircle(10, 10, 6, (v) => expect(v).toEqual(1));
        // });

        // // DFF_SPREAD_CIRCLE - big spread
        // test('{ spread: 150, decrement: 50, spread circle }', () => {
        //     random.seed(1234567);
        //     feat = GW.make.tileEvent({
        //         tile: 'WALL',
        //         spread: 150,
        //         decrement: 50,
        //         flags: 'DFF_SPREAD_CIRCLE',
        //     })!;

        //     expect(feat.flags).toEqual(Map.tileEvent.Flags.DFF_SPREAD_CIRCLE);
        //     Map.tileEvent.computeSpawnMap(feat, grid, ctx);
        //     // grid.dump();
        //     expect(grid.count((v) => !!v)).toEqual(37);
        //     grid.forCircle(10, 10, 3, (v) => expect(v).toEqual(1));
        // });

        // test.todo(
        //     'Add some walls and test that circle does not pass through them.'
        // );

        // // { radius: 3 }
        // test('{ radius: 3 }', () => {
        //     random.seed(12345);
        //     feat = GW.make.tileEvent({ tile: 'WALL', radius: 3 })!;
        //     // console.log(feat);
        //     Map.tileEvent.computeSpawnMap(feat, grid, ctx);
        //     // grid.dump();
        //     expect(grid.count((v) => !!v)).toEqual(37);
        //     expect(grid[10][10]).toEqual(1);
        //     expect(grid[8][11]).toEqual(1);
        // });

        // // { radius: 3, spread: 75 }
        // test('{ radius: 3, spread: 75 }', () => {
        //     random.seed(12345);
        //     feat = GW.make.tileEvent({ tile: 'WALL', radius: 3, spread: 75 })!;
        //     // console.log(feat);

        //     Map.tileEvent.computeSpawnMap(feat, grid, ctx);
        //     // grid.dump();
        //     expect(grid.count((v) => !!v)).toEqual(30);
        //     expect(grid[10][10]).toEqual(1);
        //     expect(grid[9][10]).toEqual(0);
        //     expect(grid[8][10]).toEqual(1);
        // });

        // // { radius: 3, spread: 75, decrement: 20 }
        // test('{ radius: 3, spread: 75, decrement: 20 }', () => {
        //     random.seed(12345);
        //     feat = GW.make.tileEvent({
        //         tile: 'WALL',
        //         radius: 3,
        //         spread: 75,
        //         decrement: 20,
        //     })!;
        //     // console.log(feat);
        //     Map.tileEvent.computeSpawnMap(feat, grid, ctx);
        //     // grid.dump();
        //     expect(grid.count((v) => !!v)).toEqual(12);
        //     expect(grid[10][10]).toEqual(1);
        //     expect(grid[10][11]).toEqual(0);
        //     expect(grid[10][12]).toEqual(1);
        // });

        // // { tile: 'DOOR', line }
        // test('{ tile: "DOOR", line }', async () => {
        //     random.seed(12345);
        //     const feat = GW.make.tileEvent({
        //         tile: 'DOOR',
        //         flags: 'DFF_SPREAD_LINE',
        //         spread: 200,
        //         decrement: 50,
        //     })!;

        //     await Map.tileEvent.spawn(feat, ctx);

        //     // map.dump();

        //     expect(map.hasTile(10, 10, 'DOOR')).toBeTruthy();
        //     expect(map.hasTile(10, 11, 'DOOR')).toBeTruthy();
        //     expect(map.hasTile(10, 12, 'DOOR')).toBeTruthy();
        //     expect(map.hasTile(10, 13, 'DOOR')).toBeTruthy();
        //     // expect(map.hasTile(10, 14, "DOOR")).toBeTruthy();

        //     expect(map.cells.count((c) => c.hasTile('DOOR'))).toEqual(4);
        // });
    });

    describe('spawnTiles', () => {
        test('will fill a map with a spawn map', async () => {
            grid.fillRect(5, 5, 3, 3, 1);

            Utils.forRect(5, 5, 3, 3, (x, y) => {
                const cell = map.cell(x, y);
                expect(cell.hasTile('WALL')).toBeFalsy();
            });
            MapEffect.spawnTiles(0, grid, map, Tile.tiles.WALL);
            Utils.forRect(5, 5, 3, 3, (x, y) => {
                const cell = map.cell(x, y);
                expect(cell.hasTile('WALL')).toBeTruthy();
                // expect(cell.mechFlags & Map.cell.MechFlags.EVENT_FIRED_THIS_TURN).toBeTruthy();
            });
        });

        // test('gas adds volume', async () => {
        //     grid.fillRect(5, 5, 3, 3, 1);
        //     Tile.install('RED_GAS', {
        //         bg: 'red',
        //         depth: 'GAS',
        //     });

        //     Utils.forRect(5, 5, 3, 3, (x, y) => {
        //         const cell = map.cell(x, y);
        //         expect(cell.hasTile('RED_GAS')).toBeFalsy();
        //     });
        //     MapEffect.spawnTiles(0, grid, map, Tile.tiles.RED_GAS, 10);
        //     Utils.forRect(5, 5, 3, 3, (x, y) => {
        //         const cell = map.cell(x, y);
        //         expect(cell.hasTile('RED_GAS')).toBeTruthy();
        //         expect(cell.gasVolume).toEqual(10);
        //     });
        //     MapEffect.spawnTiles(0, grid, map, Tile.tiles.RED_GAS, 10);
        //     Utils.forRect(5, 5, 3, 3, (x, y) => {
        //         const cell = map.cell(x, y);
        //         expect(cell.hasTile('RED_GAS')).toBeTruthy();
        //         expect(cell.gasVolume).toEqual(20);
        //     });
        // });

        // test('liquid adds volume', async () => {
        //     grid.fillRect(5, 5, 3, 3, 1);
        //     Tile.install('RED_LIQUID', {
        //         bg: 'red',
        //         depth: 'LIQUID',
        //     });

        //     Utils.forRect(5, 5, 3, 3, (x, y) => {
        //         const cell = map.cell(x, y);
        //         expect(cell.hasTile('RED_LIQUID')).toBeFalsy();
        //     });
        //     MapEffect.spawnTiles(0, grid, map, Tile.tiles.RED_LIQUID, 10);
        //     Utils.forRect(5, 5, 3, 3, (x, y) => {
        //         const cell = map.cell(x, y);
        //         expect(cell.hasTile('RED_LIQUID')).toBeTruthy();
        //         expect(cell.liquidVolume).toEqual(10);
        //     });
        //     MapEffect.spawnTiles(0, grid, map, Tile.tiles.RED_LIQUID, 10);
        //     Utils.forRect(5, 5, 3, 3, (x, y) => {
        //         const cell = map.cell(x, y);
        //         expect(cell.hasTile('RED_LIQUID')).toBeTruthy();
        //         expect(cell.liquidVolume).toEqual(20);
        //     });
        // });
    });

    describe('fire', () => {
        test('tile', async () => {
            effect = Effect.make({ tile: 'WALL' });
            expect(map.cellInfo(ctx.x, ctx.y).hasTile('WALL')).toBeFalsy();
            await expect(
                Effect.fire(effect, map, ctx.x, ctx.y, ctx)
            ).resolves.toBeTruthy();
            expect(map.cellInfo(ctx.x, ctx.y).hasTile('WALL')).toBeTruthy();
            Utils.eachNeighbor(ctx.x, ctx.y, (x, y) => {
                const cell = map.cell(x, y);
                expect(cell.hasTile('WALL')).toBeFalsy();
            });
        });

        test('tile and neighbors - string', async () => {
            effect = Effect.make({ tile: 'WALL,100,100' })!;
            expect(map.cellInfo(ctx.x, ctx.y).hasTile('WALL')).toBeFalsy();
            await expect(
                Effect.fire(effect, map, ctx.x, ctx.y, ctx)
            ).resolves.toBeTruthy();
            expect(map.cellInfo(ctx.x, ctx.y).hasTile('WALL')).toBeTruthy();
            Utils.eachNeighbor(
                ctx.x,
                ctx.y,
                (x, y) => {
                    const cell = map.cell(x, y);
                    expect(cell.hasTile('WALL')).toBeTruthy();
                },
                true
            );
        });

        test('tile and neighbors - object', async () => {
            effect = Effect.make({
                tile: { id: 'WALL', spread: 100, decrement: 100 },
            });

            expect(map.cellInfo(ctx.x, ctx.y).hasTile('WALL')).toBeFalsy();
            await expect(
                Effect.fire(effect, map, ctx.x, ctx.y, ctx)
            ).resolves.toBeTruthy();
            expect(map.cellInfo(ctx.x, ctx.y).hasTile('WALL')).toBeTruthy();
            Utils.eachNeighbor(
                ctx.x,
                ctx.y,
                (x, y) => {
                    const c = map.cell(x, y);
                    expect(c.hasTile('WALL')).toBeTruthy();
                },
                true
            );
        });

        test('can clear extra tiles from the cell', async () => {
            effect = Effect.make({ flags: 'E_CLEAR_CELL', tile: 'FLOOR' })!;

            expect(effect.flags & Effect.Flags.E_CLEAR_CELL).toBeTruthy();
            map.setTile(ctx.x, ctx.y, 'BRIDGE');
            const cell = map.cell(ctx.x, ctx.y);
            expect(cell.depthTile(Depth.SURFACE)!.id).toEqual('BRIDGE');
            expect(cell.depthTile(Depth.GROUND)!.id).toEqual('FLOOR');

            await expect(
                Effect.fire(effect, map, ctx.x, ctx.y, ctx)
            ).resolves.toBeTruthy();
            expect(cell.depthTile(Depth.GROUND)!.id).toEqual('FLOOR');
            expect(cell.depthTile(Depth.SURFACE)).toBeNull();
        });

        // test('Will add liquids with volume', async () => {
        //     Tile.install('RED_LIQUID', {
        //         name: 'red liquid',
        //         article: 'some',
        //         bg: 'red',
        //         depth: 'LIQUID',
        //     });

        //     effect = Effect.make({
        //         tile: { id: 'RED_LIQUID', volume: 50 },
        //     })!;
        //     await expect(
        //         Effect.fire(effect, map, ctx.x, ctx.y, ctx)
        //     ).resolves.toBeTruthy();

        //     const cell = map.cell(ctx.x, ctx.y);
        //     expect(cell.liquid).toEqual('RED_LIQUID');
        //     expect(cell.liquidVolume).toEqual(50);
        // });
    });

    describe('cell effects', () => {
        test('effect fn', async () => {
            const fn = jest.fn().mockReturnValue(true);
            Tile.install('ALTAR', {
                name: 'altar',
                article: 'the',
                bg: 'red',
                depth: 'SURFACE',
                effects: {
                    fire: { fn },
                },
            });

            const cell = map.cell(ctx.x, ctx.y);
            map.setTile(ctx.x, ctx.y, 'ALTAR');

            await expect(
                cell.activate('fire', map, ctx.x, ctx.y, ctx)
            ).resolves.toBeTruthy();
            expect(fn).toHaveBeenCalledTimes(1);
        });

        test('evacuateCreatures', async () => {
            Tile.install('ALTAR', {
                name: 'altar',
                article: 'the',
                bg: 'red',
                depth: 'SURFACE',
                effects: {
                    fire: { flags: 'E_EVACUATE_CREATURES', tile: 'FLOOR' },
                },
            });

            const cell = map.cell(ctx.x, ctx.y);
            map.setTile(ctx.x, ctx.y, 'ALTAR');
            const actor = new Actor();
            jest.spyOn(actor, 'forbidsCell');

            map.addActor(ctx.x, ctx.y, actor);
            expect(actor).toBeAtXY(ctx.x, ctx.y);
            expect(cell.hasActor()).toBeTruthy();
            grid[ctx.x][ctx.y] = 1;

            await cell.activate('fire', map, ctx.x, ctx.y);
            expect(actor.forbidsCell).toHaveBeenCalled();
            expect(actor).not.toBeAtXY(ctx.x, ctx.y);
            expect(cell.hasActor()).toBeFalsy();
        });

        test('evacuateItems', async () => {
            Tile.install('ALTAR', {
                name: 'altar',
                article: 'some',
                bg: 'red',
                depth: 'SURFACE',
                effects: {
                    fire: { flags: 'E_EVACUATE_ITEMS', tile: 'FLOOR' },
                },
            });

            const cell = map.cell(ctx.x, ctx.y);
            map.setTile(ctx.x, ctx.y, 'ALTAR');

            const item = new Item();
            jest.spyOn(item, 'forbidsCell');

            map.addItem(ctx.x, ctx.y, item);
            expect(item).toBeAtXY(ctx.x, ctx.y);
            expect(cell.hasItem()).toBeTruthy();
            grid[ctx.x][ctx.y] = 1;

            await cell.activate('fire', map, ctx.x, ctx.y, ctx);
            expect(item.forbidsCell).toHaveBeenCalled();
            expect(item).not.toBeAtXY(ctx.x, ctx.y);
            expect(cell.hasItem()).toBeFalsy();
        });
    });

    // describe('waves', () => {
    //     beforeAll(() => {
    //         Tile.install('WAVE_DONE', {
    //             ch: 'X',
    //             fg: 'blue',
    //             bg: 'green',
    //             priority: 70,
    //             flags: 'T_DEEP_WATER',
    //             name: 'water',
    //             article: 'some',
    //             effects: {
    //                 tick: {
    //                     tile: 'LAKE',
    //                     flags: 'E_SUPERPRIORITY, E_PROTECTED',
    //                 },
    //             },
    //         });
    //         Tile.install('WAVE', {
    //             ch: 'W',
    //             fg: 'white',
    //             bg: 'blue',
    //             priority: 60,
    //             flags: 'T_DEEP_WATER',
    //             name: 'wave crest',
    //             article: 'the',
    //             effects: {
    //                 tick: {
    //                     tile: {
    //                         id: 'WAVE',
    //                         match: 'LAKE',
    //                         spread: 100,
    //                         decrement: 100,
    //                     },
    //                     flags: 'E_NEXT_ALWAYS',
    //                     next: { tile: 'WAVE_DONE' },
    //                 },
    //             },
    //         });
    //     });

    //     afterAll(() => {
    //         delete Tile.tiles.WAVE_DONE;
    //         delete Tile.tiles.WAVE;
    //     });

    //     test('tiles installed', () => {
    //         expect(Tile.tiles.WAVE).toBeDefined();
    //         expect(Tile.tiles.WAVE.effects.tick).toBeDefined();
    //         expect(Tile.tiles.WAVE_DONE).toBeDefined();
    //         expect(Tile.tiles.WAVE_DONE.effects.tick).toBeDefined();
    //     });

    //     test('can do waves', async () => {
    //         map.fill('LAKE');
    //         map.setTile(10, 10, 'WAVE');

    //         await map.tick();
    //         // map.dump();
    //         expect(map.hasTile(10, 10, 'WAVE_DONE')).toBeTruthy();
    //         expect(map.count((c) => c.hasTile('WAVE_DONE'))).toEqual(1);
    //         expect(map.count((c) => c.hasTile('WAVE'))).toEqual(4);

    //         await map.tick();
    //         // map.dump();
    //         expect(map.cell(10, 10).depthTile(Depth.GROUND).id).toEqual('LAKE');
    //         expect(map.count((c) => c.hasTile('WAVE_DONE'))).toEqual(4);
    //         expect(map.count((c) => c.hasTile('WAVE'))).toEqual(8);

    //         await map.tick();
    //         // map.dump();
    //         expect(map.cell(10, 10).depthTile(Depth.GROUND).id).toEqual('LAKE');
    //         expect(map.count((c) => c.hasTile('WAVE_DONE'))).toEqual(8);
    //         expect(map.count((c) => c.hasTile('WAVE'))).toEqual(12);

    //         await map.tick();
    //         // map.dump();
    //         expect(map.hasTile(10, 10, 'LAKE')).toBeTruthy();
    //         expect(map.count((c) => c.hasTile('WAVE_DONE'))).toEqual(12);
    //         expect(map.count((c) => c.hasTile('WAVE'))).toEqual(16);

    //         for (let i = 0; i < 5; ++i) {
    //             await map.tick();
    //         }

    //         // map.dump();
    //         await map.tick();
    //         // map.dump();

    //         expect(map.hasTile(19, 10, 'WAVE_DONE')).toBeTruthy();

    //         // expect(map.count( (c) => c.hasTile(WAVE)).toEqual(0);
    //     });
    // });
});
