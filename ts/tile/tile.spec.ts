import 'jest-extended';
import * as Tile from './index';
import { colors as COLORS } from '../color';
import { GameObject as ObjectFlags, Depth } from '../gameObject/flags';

const NONE = COLORS.NONE;

describe('flags', () => {
    test('flags', () => {
        expect(Tile.flags.Tile.T_BRIDGE).toBeGreaterThan(0);
    });

    test('mechFlags', () => {
        const mechFlags = Tile.flags.TileMech;

        expect(mechFlags.TM_EXPLOSIVE_PROMOTE).toBeGreaterThan(0);
    });
});

describe('Tile', () => {
    test('can be created from an object', () => {
        const tile = new Tile.Tile({
            id: 'WALL',
            name: 'Stone Wall',
            ch: '#',
            fg: 'light_gray',
            bg: 'dark_gray',
            flags: {
                object: ObjectFlags.L_BLOCKS_EVERYTHING,
                tile: 0,
                tileMech: 0,
            },
            priority: 90,
        });

        expect(tile).toBeDefined();

        expect(tile.flags.object).toEqual(ObjectFlags.L_BLOCKS_EVERYTHING);
        expect(tile.flags.tileMech).toEqual(0);
        expect(tile.sprite).toMatchObject({
            ch: '#',
            fg: COLORS.light_gray,
            bg: COLORS.dark_gray,
        });
        expect(tile.depth).toEqual(Depth.GROUND);
        expect(tile.effects).toEqual({});
        expect(tile.priority).toEqual(90);
        expect(tile.name).toEqual('Stone Wall');

        expect(tile.getName()).toEqual('Stone Wall');
        expect(tile.getName('a')).toEqual('a Stone Wall');
        expect(tile.getName('the')).toEqual('the Stone Wall');
        expect(tile.getName(true)).toEqual('a Stone Wall');

        expect(tile.getName({ color: true })).toEqual(
            'Ωlight_grayΩStone Wall∆'
        );
        expect(tile.getName({ color: 0xfff })).toEqual('Ω#fffΩStone Wall∆');
        expect(tile.getName({ color: 'white' })).toEqual('ΩwhiteΩStone Wall∆');
        expect(tile.getName({ color: true, article: 'a' })).toEqual(
            'a Ωlight_grayΩStone Wall∆'
        );
        expect(tile.getName({ color: true, article: 'the' })).toEqual(
            'the Ωlight_grayΩStone Wall∆'
        );
        expect(tile.getName({ color: true, article: true })).toEqual(
            'a Ωlight_grayΩStone Wall∆'
        );

        expect(tile.getDescription()).toEqual(tile.getName());
    });

    test('can create without sprite field', () => {
        const tile = new Tile.Tile({
            id: 'TEST',
            name: 'TEST',
            ch: '#',
            fg: 'light_gray',
            bg: 'dark_gray',
            priority: 90,
        });

        expect(tile.sprite.ch).toEqual('#');
        expect(tile.sprite.fg).toBe(COLORS.light_gray);
        expect(tile.sprite.bg).toBe(COLORS.dark_gray);
    });

    test('can create tiles with see through bg', () => {
        const tile = new Tile.Tile({
            id: 'TEST',
            ch: '#',
            fg: 'light_gray',
            bg: null,
        });

        expect(tile.sprite.bg).toEqual(NONE);
    });

    test('can extend another tile', () => {
        const wall = Tile.install('WALL', {
            name: 'Stone Wall',
            ch: '#',
            fg: 'light_gray',
            bg: 'dark_gray',
            flags: 'L_BLOCKS_EVERYTHING',
            priority: 90,
        });

        expect(wall).toBeDefined();

        const glassWall = Tile.make({
            id: 'GLASS_WALL',
            name: 'Glass Wall',
            ch: '+',
            fg: 'teal',
            flags: ['!L_BLOCKS_VISION'],
            extends: 'WALL',
        });

        expect(glassWall).toBeDefined();

        expect(glassWall.flags.object).not.toEqual(wall.flags);
        expect(
            glassWall.flags.object & ObjectFlags.L_BLOCKS_VISION
        ).toBeFalsy();
        expect(glassWall.flags.object & ObjectFlags.L_BLOCKS_MOVE).toBeTruthy();
        expect(glassWall.flags.tile).toEqual(wall.flags.tile);
        expect(glassWall).not.toBe(wall);
        expect(glassWall.sprite).toMatchObject({
            ch: '+',
            fg: COLORS.teal,
            bg: wall.sprite.bg,
        });

        // expect(glassWall.getName()).toEqual('Glass Wall');
    });

    test('extend with light', () => {
        const tw = Tile.install('TORCH_WALL', {
            extends: 'WALL',
            light: { color: 'yellow', radius: 5, fadeTo: 50 },
        });

        expect(tw.light).not.toBeNull();
        expect(tw.light!.color).toEqual(COLORS.yellow);
        expect(tw.light!.radius.value()).toEqual(5);
        expect(tw.light!.fadeTo).toEqual(50);
    });

    test('can add multiple from an object', () => {
        Tile.installAll({
            WALL: {
                name: 'Stone Wall',
                ch: '#',
                fg: 'light_gray',
                bg: 'dark_gray',
                flags: ['L_BLOCKS_EVERYTHING'],
                priority: 90,
            },
            GLASS_WALL: {
                extends: 'WALL',
                name: 'Glass Wall',
                fg: 'teal',
                bg: 'silver',
                flags: ['!L_BLOCKS_VISION'],
            },
        });

        expect(Tile.tiles.WALL.getName()).toEqual('Stone Wall');
        expect(Tile.tiles.WALL.flags.object).toEqual(
            ObjectFlags.L_BLOCKS_EVERYTHING
        );
        expect(Tile.tiles.GLASS_WALL.getName()).toEqual('Glass Wall');
        expect(
            Tile.tiles.GLASS_WALL.flags.object & ObjectFlags.L_BLOCKS_VISION
        ).toBeFalsy();
        expect(
            Tile.tiles.GLASS_WALL.flags.object & ObjectFlags.L_BLOCKS_MOVE
        ).toBeTruthy();
    });

    test('can set the layer', () => {
        const carpet = Tile.make({
            id: 'CARPET',
            name: 'Carpet',
            ch: '+',
            fg: 'dark_red',
            bg: 'dark_teal',
            priority: 10,
            depth: 'SURFACE',
        });

        expect(carpet.depth).toEqual(Depth.SURFACE);
    });

    test('can use objects for activations', async () => {
        const carpet = Tile.install('CARPET', {
            ch: '+',
            fg: '#f66',
            bg: '#ff6',
            effects: {
                tick: { chance: 0, log: 'testing' },
            },
            depth: 'SURFACE',
        });

        expect(Tile.tiles.CARPET).toBe(carpet);
        expect(carpet.effects.tick).not.toBeNil();

        expect(carpet.hasEffect('tick')).toBeTruthy();
    });

    test('can be created by extending another tile', () => {
        const WALL = Tile.tiles.WALL;
        expect(WALL).toBeDefined();

        const custom = Tile.install('CUSTOM', 'WALL', {
            ch: '+',
            fg: 'white',
            name: 'Custom Wall',
        });

        expect(custom.sprite).toMatchObject({
            ch: '+',
            fg: COLORS.white,
            bg: Tile.tiles.WALL.sprite.bg,
        });
        expect(custom.name).toEqual('Custom Wall');
        expect(custom.id).toEqual('CUSTOM');
    });

    test('can have a glow light', () => {
        const tile = Tile.install('TEST', {
            light: 'white, 3',
            name: 'test',
        });

        expect(tile.light).toBeObject();
        expect(tile.light?.color).toEqual(COLORS.white);
        expect(tile.light?.radius.value()).toEqual(3);
        expect(tile.light?.fadeTo).toEqual(0);

        expect(() => {
            // @ts-ignore
            Tile.install('TEST', { light: 4 });
        }).toThrow();
    });

    test('hasFlag', () => {
        const tile = Tile.tiles.WALL;
        expect(tile.hasAllObjectFlags(ObjectFlags.L_BLOCKS_MOVE)).toBeTruthy();
        expect(tile.hasAllTileFlags(Tile.flags.Tile.T_BRIDGE)).toBeFalsy();
    });

    test.skip('hasMechFlag', () => {
        // const tile = Tile.tiles.DOOR;
        // expect(
        //   tile.hasAllMechFlags(Tile.MechFlags.TM_VISUALLY_DISTINCT)
        // ).toBeTruthy();
        // expect(
        //   tile.hasAllMechFlags(Tile.MechFlags.TM_EXTINGUISHES_FIRE)
        // ).toBeFalsy();
    });

    test('install - { extends }', () => {
        const glassWall = Tile.install('GLASS_WALL', {
            extends: 'WALL',
            ch: '+',
            fg: 'teal',
            bg: 'red',
            flags: ['!L_BLOCKS_VISION'],
        });

        expect(glassWall.name).toEqual('Stone Wall');
        expect(
            glassWall.hasAllObjectFlags(ObjectFlags.L_BLOCKS_MOVE)
        ).toBeTruthy();
    });

    test('install - { extends: Unknown }', () => {
        expect(() =>
            Tile.install('GLASS_WALL', {
                extends: 'UNKNOWN',
                ch: '+',
                fg: 'teal',
                bg: 'red',
                flags: ['!L_BLOCKS_VISION'],
            })
        ).toThrow();
    });

    test('install - {}', () => {
        const glassWall = Tile.install('GLASS_WALL', {
            name: 'glass wall',
            ch: '+',
            fg: 'teal',
            bg: 'red',
            flags: 'L_BLOCKS_EVERYTHING,!L_BLOCKS_VISION',
        });

        expect(glassWall.name).toEqual('glass wall');
        expect(
            glassWall.hasAllObjectFlags(ObjectFlags.L_BLOCKS_MOVE)
        ).toBeTruthy();
        expect(
            glassWall.hasAllObjectFlags(ObjectFlags.L_BLOCKS_VISION)
        ).toBeFalsy();
        expect(
            glassWall.hasAllObjectFlags(
                ObjectFlags.L_BLOCKS_VISION | ObjectFlags.L_BLOCKS_MOVE
            )
        ).toBeFalsy();
    });
});

// describe('tiles', () => {

//   let map;
//   let grid;
//   let feat;
//   let ctx;

//   beforeEach( () => {
//     map = GW.make.map(20, 20, { tile: 'FLOOR', boundary: 'WALL' });
//     ctx = { map, x: 10, y: 10 };
//     grid = null;
//   });

//   afterEach( () => {
//     if (grid) GW.grid.free(grid);
//     grid = null;
//   });

//   describe('BRIDGE', () => {
//     test('has see through bg', () => {
//       const tile = Tile.tiles.BRIDGE;
//       expect(tile.sprite.bg).toBeUndefined();
//     });
//   });

//   describe('DOOR', () => {

//     test('can do doors (open/close)', async () => {
//       map.setTile(10, 10, 'DOOR');
//       const cell = map.cell(10, 10);

//       expect(Tile.tiles.DOOR.events.enter).toBeDefined();
//       expect(Tile.tiles.DOOR.events.open).toBeDefined();

//       expect(Tile.tiles.DOOR_OPEN.events.tick).toBeDefined();
//       expect(Tile.tiles.DOOR_OPEN.events.enter).not.toBeDefined();
//       expect(Tile.tiles.DOOR_OPEN.events.open).not.toBeDefined();

//       expect(cell.ground).toEqual('DOOR');
//       await cell.fireEvent('enter', ctx);
//       expect(cell.ground).toEqual('DOOR_OPEN');

//       cell.clearFlags(0, GW.flags.cellMech.EVENT_FIRED_THIS_TURN);
//       await cell.fireEvent('tick', ctx);
//       expect(cell.ground).toEqual('DOOR');

//       const kind = new GW.types.ItemKind({ name: 'Thing' });
//       const item = GW.make.item(kind);

//       cell.clearFlags(0, GW.flags.cellMech.EVENT_FIRED_THIS_TURN);
//       await cell.fireEvent('enter', ctx);
//       expect(cell.ground).toEqual('DOOR_OPEN');

//       // drop item to block door
//       map.addItem(10, 10, item);
//       expect(cell.item).toBe(item);

//       cell.clearFlags(0, GW.flags.cellMech.EVENT_FIRED_THIS_TURN);
//       await cell.fireEvent('tick', ctx);
//       expect(cell.ground).toEqual('DOOR_OPEN');

//       map.removeItem(item);
//       expect(cell.item).toBeNull();

//       cell.clearFlags(0, GW.flags.cellMech.EVENT_FIRED_THIS_TURN);
//       await cell.fireEvent('tick', ctx);
//       expect(cell.ground).toEqual('DOOR');

//       cell.clearFlags(0, GW.flags.cellMech.EVENT_FIRED_THIS_TURN);
//       await cell.fireEvent('enter', ctx);
//       expect(cell.ground).toEqual('DOOR_OPEN');

//       const player = GW.make.player({ name: 'player' });
//       map.addActor(10, 10, player);
//       expect(cell.actor).toBe(player);

//       cell.clearFlags(0, GW.flags.cellMech.EVENT_FIRED_THIS_TURN);
//       await cell.fireEvent('tick', ctx);
//       expect(cell.ground).toEqual('DOOR_OPEN');

//     });

//   });
// });
