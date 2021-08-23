import 'jest-extended';
import * as Tile from './index';
import { colors as COLORS } from '../color';
import { GameObject as ObjectFlags, Depth } from '../gameObject/flags';
import * as Map from '../map';

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

    test('PORTCULLIS', async () => {
        // Portcullis (closed, dormant)
        // [WALL_CHAR,		gray,					floorBackColor,		10,	0,	DF_PLAIN_FIRE,	0,			DF_OPEN_PORTCULLIS,	0,			NO_LIGHT,		(T_OBSTRUCTS_PASSABILITY | T_OBSTRUCTS_ITEMS), (TM_STAND_IN_TILE | TM_VANISHES_UPON_PROMOTION | TM_IS_WIRED | TM_LIST_IN_SIDEBAR | TM_VISUALLY_DISTINCT | TM_CONNECTS_LEVEL), "a heavy portcullis",	"The iron bars rattle but will not budge; they are firmly locked in place."],
        // [FLOOR_CHAR,	floorForeColor,		floorBackColor,		95,	0,	DF_PLAIN_FIRE,	0,			DF_ACTIVATE_PORTCULLIS,0,		NO_LIGHT,		(0), (TM_VANISHES_UPON_PROMOTION | TM_IS_WIRED),                                                    "the ground",			""],

        // Effects - Portcullis (activate, open)
        // [PORTCULLIS_CLOSED,			DUNGEON,	0,		0,		DFF_EVACUATE_CREATURES_FIRST,	"with a heavy mechanical sound, an iron portcullis falls from the ceiling!", GENERIC_FLASH_LIGHT],
        // [PORTCULLIS_DORMANT,		DUNGEON,	0,		0,		0,  "the portcullis slowly rises from the ground into a slot in the ceiling.", GENERIC_FLASH_LIGHT],

        const portcullis = Tile.install('PORTCULLIS_CLOSED', {
            extends: 'WALL',
            priority: '+1',
            fg: 0x800,
            bg: Tile.tiles.FLOOR.sprite.bg,
            flavor: 'a heavy portcullis',
            description:
                'The iron bars rattle but will not budge; they are firmly locked in place.',
            flags:
                '!L_BLOCKS_VISION, !L_BLOCKS_GAS, L_LIST_IN_SIDEBAR, L_VISUALLY_DISTINCT, T_CONNECTS_LEVEL',
            effects: {
                machine: {
                    tile: 'PORTCULLIS_DORMANT',
                    message:
                        'the portcullis slowly rises from the ground into a slot in the ceiling.',
                    flash: true,
                    flags: 'E_SUPERPRIORITY',
                },
            },
        });
        expect(portcullis.blocksVision()).toBeFalsy();
        expect(portcullis.blocksMove()).toBeTruthy();
        expect(portcullis.priority).toEqual(Tile.tiles.WALL.priority + 1);

        const portcullisOpen = Tile.install('PORTCULLIS_DORMANT', {
            extends: 'FLOOR',
            priority: '+1',
            effects: {
                machine: {
                    tile: 'PORTCULLIS_CLOSED',
                    message:
                        'with a heavy mechanical sound, an iron portcullis falls from the ceiling!',
                    flash: true,
                    flags: 'E_EVACUATE_CREATURES_FIRST',
                },
            },
        });
        expect(portcullisOpen.blocksVision()).toBeFalsy();
        expect(portcullisOpen.blocksMove()).toBeFalsy();
        expect(portcullisOpen.priority).toEqual(Tile.tiles.FLOOR.priority + 1);

        const map = Map.make(10, 10, { tile: 'FLOOR', boundary: 'WALL' });
        expect(map.cellInfo(5, 5).blocksMove()).toBeFalsy();
        map.setTile(5, 5, 'PORTCULLIS_CLOSED');
        expect(map.hasTile(5, 5, 'PORTCULLIS_CLOSED')).toBeTruthy();
        expect(map.cellInfo(5, 5).blocksMove()).toBeTruthy();
        expect(map.cellInfo(5, 5).blocksVision()).toBeFalsy();

        await map.fire('machine', 5, 5);
        expect(map.hasTile(5, 5, 'PORTCULLIS_DORMANT')).toBeTruthy();
        expect(map.cellInfo(5, 5).blocksMove()).toBeFalsy();
        expect(map.cellInfo(5, 5).blocksVision()).toBeFalsy();

        await map.fire('machine', 5, 5);
        expect(map.hasTile(5, 5, 'PORTCULLIS_CLOSED')).toBeTruthy();
        expect(map.cellInfo(5, 5).blocksMove()).toBeTruthy();
        expect(map.cellInfo(5, 5).blocksVision()).toBeFalsy();
    });

    test('WALL_LEVER', async () => {
        // Wall Lever - (lever, pulled)
        // [LEVER_CHAR,	wallForeColor,			wallBackColor,			0,	0,	DF_PLAIN_FIRE,	0,			DF_PULL_LEVER,  0,				NO_LIGHT,		(T_OBSTRUCTS_EVERYTHING), (TM_STAND_IN_TILE | TM_VANISHES_UPON_PROMOTION | TM_IS_WIRED | TM_PROMOTES_ON_PLAYER_ENTRY | TM_LIST_IN_SIDEBAR | TM_VISUALLY_DISTINCT | TM_INVERT_WHEN_HIGHLIGHTED),"a lever", "The lever moves."],
        // [LEVER_PULLED_CHAR,wallForeColor,		wallBackColor,			0,	0,	DF_PLAIN_FIRE,	0,			0,				0,				NO_LIGHT,		(T_OBSTRUCTS_EVERYTHING), (TM_STAND_IN_TILE),                                                       "an inactive lever",    "The lever won't budge."],
        // Effects - pull lever
        // [WALL_LEVER_PULLED,         DUNGEON,    0,      0,      0],

        const lever = Tile.install('WALL_LEVER', {
            extends: 'WALL',
            priority: '+1',
            ch: '\\',
            fg: 0x800,
            flavor: 'a lever',
            description: 'The lever moves.',
            flags: 'L_LIST_IN_SIDEBAR, L_VISUALLY_DISTINCT, T_CONNECTS_LEVEL',
            effects: {
                playerEnter: {
                    tile: 'WALL_LEVER_PULLED',
                    activateMachine: true,
                    message: 'the lever moves.',
                },
            },
        });
        expect(lever.blocksVision()).toBeTruthy();
        expect(lever.blocksMove()).toBeTruthy();
        expect(lever.priority).toEqual(Tile.tiles.WALL.priority + 1);

        const leverPulled = Tile.install('WALL_LEVER_PULLED', {
            extends: 'WALL',
            priority: '+1',
            ch: '/',
            fg: 0x800,
            flavor: 'an inactive lever',
            description: "The lever won't budge.",
        });
        expect(leverPulled.blocksVision()).toBeTruthy();
        expect(leverPulled.blocksMove()).toBeTruthy();
        expect(leverPulled.priority).toEqual(Tile.tiles.WALL.priority + 1);

        const map = Map.make(10, 10, { tile: 'FLOOR', boundary: 'WALL' });
        const cell = map.cell(5, 5);
        expect(cell.blocksMove()).toBeFalsy();
        map.setTile(5, 5, 'WALL_LEVER', { machine: 4 });
        expect(map.hasTile(5, 5, 'WALL_LEVER')).toBeTruthy();
        expect(cell.machineId).toEqual(4);

        jest.spyOn(map, 'activateMachine');

        await map.fire('playerEnter', 5, 5);
        expect(map.hasTile(5, 5, 'WALL_LEVER_PULLED')).toBeTruthy();

        expect(map.activateMachine).toHaveBeenCalledWith(
            4,
            5,
            5,
            expect.anything()
        );
    });
});
