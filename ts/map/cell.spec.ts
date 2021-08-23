import 'jest-extended';
import '../../test/matchers';
import * as UTILS from '../../test/utils';

import { random } from '../random';
import * as Flags from './flags';
import * as Tile from '../tile';
import * as Map from './map';
import { Cell } from './cell';

describe('Cell', () => {
    beforeAll(() => {
        Tile.install('TEST_FLOOR', {
            name: 'floor',
            ch: '.',
            fg: [80, 80, 80],
            bg: [20, 20, 20],
        });
        Tile.install('RED_LIQUID', {
            name: 'red liquid',
            article: 'some',
            bg: 'red',
            flags: 'T_EXTINGUISHES_FIRE, T_DEEP_WATER, TM_EXPLOSIVE_PROMOTE',
            depth: 'LIQUID',
        });
        Tile.install('BLUE_LIQUID', {
            name: 'blue liquid',
            article: 'some',
            bg: 'blue',
            flags: 'TM_STAND_IN_TILE',
            depth: 'LIQUID',
        });
        Tile.install('RED_GAS', {
            name: 'red gas',
            article: 'some',
            bg: 'red',
            flags:
                'T_SPONTANEOUSLY_IGNITES, T_IS_FLAMMABLE, T_CAUSES_EXPLOSIVE_DAMAGE, T_GAS',
            depth: 'GAS',
        });
        Tile.install('BLUE_GAS', {
            name: 'blue gas',
            article: 'some',
            bg: 'blue',
            flags: 'T_IS_FLAMMABLE, T_GAS',
            depth: 'GAS',
        });
        Tile.install('ENTER', {
            ch: '!',
            fg: 'red',
            effects: {
                enter: 'FLOOR',
            },
        });
        Tile.install('LOW_CHANCE', {
            ch: '!',
            fg: 'red',
            effects: {
                enter: { tile: 'FLOOR', chance: 1 },
            },
        });
    });

    afterAll(() => {
        delete Tile.tiles.TEST_FLOOR;
        delete Tile.tiles.RED_LIQUID;
        delete Tile.tiles.BLUE_LIQUID;
        delete Tile.tiles.RED_GAS;
        delete Tile.tiles.BLUE_GAS;
        delete Tile.tiles.ENTER;
        delete Tile.tiles.LOW_CHANCE;
    });

    test('dump', () => {
        const cell: Cell = new Cell('WALL');
        expect(cell.dump()).toEqual('#');

        cell.item = UTILS.mockItem();
        expect(cell.dump()).toEqual('!');

        cell.actor = UTILS.mockActor();
        expect(cell.dump()).toEqual('a');

        const empty: Cell = new Cell();
        expect(empty.dump()).toEqual(Tile.tiles.NULL.sprite.ch);
    });

    test('description + flavor + name', () => {
        const cell: Cell = new Cell('WALL');
        expect(cell.getDescription()).toEqual(
            'A wall made from rough cut stone.'
        );
        expect(cell.getFlavor()).toEqual('a rough stone wall');
        expect(cell.getName()).toEqual('stone wall');
        expect(cell.getName(true)).toEqual('a stone wall');
        expect(cell.getName('the')).toEqual('the stone wall');
    });

    // test('changed', () => {
    //     const cell: Cell = new Cell('FLOOR');
    //     expect(cell.changed).toBeTruthy();
    //     expect(cell.flags.cell & Flags.Cell.CELL_CHANGED).toBeTruthy();
    //     cell.changed = false;
    //     expect(cell.changed).toBeFalsy();
    //     expect(cell.flags.cell & Flags.Cell.CELL_CHANGED).toBeFalsy();
    //     cell.changed = true;
    //     expect(cell.changed).toBeTruthy();
    //     expect(cell.flags.cell & Flags.Cell.CELL_CHANGED).toBeTruthy();
    // });

    test('copy + clear', () => {
        const cell: Cell = new Cell('LAKE');
        cell.setTile(Tile.tiles.BRIDGE);

        const other: Cell = new Cell();
        expect(other.hasTile('LAKE')).toBeFalsy();
        expect(other.hasTile('BRIDGE')).toBeFalsy();

        other.copy(cell);
        expect(other.hasTile('LAKE')).toBeTruthy();
        expect(other.hasTile('BRIDGE')).toBeTruthy();
        expect(other.isEmpty()).toBeFalsy();

        other.clear();
        expect(other.hasTile('LAKE')).toBeFalsy();
        expect(other.isEmpty()).toBeTruthy();
    });

    // test('listInSidebar', () => {
    //     const cell: Cell = new Cell('UP_STAIRS');
    //     expect(cell.isAnyKindOfVisible()).toBeTruthy();
    //     expect(cell.listInSidebar()).toBeTruthy();
    //     cell.clearFlags(Flags.Cell.ANY_KIND_OF_VISIBLE);
    //     expect(cell.listInSidebar()).toBeFalsy(); // remembers clear cell
    //     cell.storeMemory(snapshot);
    //     expect(cell.listInSidebar()).toBeTruthy();
    // });

    // test('hasVisibleLight', () => {
    //     const cell: Cell = new Cell('FLOOR');
    //     expect(cell.light).toEqual([100, 100, 100]);
    //     expect(cell.hasVisibleLight()).toBeTruthy();
    //     cell.light = [0, 0, 0];
    //     expect(cell.hasVisibleLight()).toBeFalsy();
    // });

    // test('isDark', () => {
    //     const cell: Cell = new Cell('FLOOR');
    //     expect(cell.light).toEqual([100, 100, 100]);
    //     expect(cell.isDark()).toBeFalsy();
    //     cell.light = [0, 0, 0];
    //     expect(cell.isDark()).toBeTruthy();
    // });

    // test('lightChanged', () => {
    //     const cell: Cell = new Cell('FLOOR');
    //     expect(cell.flags.cell & Flags.Cell.LIGHT_CHANGED).toBeFalsy();
    //     expect(cell.lightChanged).toBeFalsy();
    //     cell.lightChanged = true;
    //     expect(cell.flags.cell & Flags.Cell.LIGHT_CHANGED).toBeTruthy();
    //     expect(cell.lightChanged).toBeTruthy();
    //     cell.lightChanged = false;
    //     expect(cell.flags.cell & Flags.Cell.LIGHT_CHANGED).toBeFalsy();
    //     expect(cell.lightChanged).toBeFalsy();
    // });

    test('objectFlags', () => {
        const cell: Cell = new Cell('WALL');

        expect(cell.objectFlags()).toEqual(Flags.GameObject.L_WALL_FLAGS);
    });

    test('tileFlags', () => {
        const tile = Tile.make({
            id: 'FIRE_TRAP',
            flags: 'T_SPONTANEOUSLY_IGNITES, T_IS_FLAMMABLE',
            ch: '.',
            fg: 'gray',
        });

        expect(tile.flags.tile).toEqual(
            Flags.Tile.T_SPONTANEOUSLY_IGNITES | Flags.Tile.T_IS_FLAMMABLE
        );
        const cell: Cell = new Cell(tile);

        expect(cell.tileFlags()).toEqual(
            Flags.Tile.T_SPONTANEOUSLY_IGNITES | Flags.Tile.T_IS_FLAMMABLE
        );
    });

    // test.skip('tileMechFlags', () => {
    // const cell : Cell = new Cell("UP_STAIRS");
    // cell.clearFlags(Flags.Cell.ANY_KIND_OF_VISIBLE);
    // expect(cell.tileMechFlags()).toEqual(
    //   Tile.MechFlags.TM_VISUALLY_DISTINCT |
    //     Tile.MechFlags.TM_LIST_IN_SIDEBAR
    // );
    // expect(cell.tileMechFlags(true)).toEqual(0);
    // cell.storeMemory(snapshot);
    // expect(cell.tileMechFlags()).toEqual(
    //   Tile.MechFlags.TM_VISUALLY_DISTINCT |
    //     Tile.MechFlags.TM_LIST_IN_SIDEBAR
    // );
    // expect(cell.tileMechFlags(true)).toEqual(
    //   Tile.MechFlags.TM_VISUALLY_DISTINCT |
    //     Tile.MechFlags.TM_LIST_IN_SIDEBAR
    // );
    // });

    test('hasObjectFlag + hasAllObjectFlags', () => {
        const cell: Cell = new Cell('WALL');
        expect(
            cell.hasObjectFlag(Flags.GameObject.L_SECRETLY_PASSABLE)
        ).toBeFalsy();
        expect(cell.hasObjectFlag(Flags.GameObject.L_BLOCKS_MOVE)).toBeTruthy();
        expect(
            cell.hasAllObjectFlags(
                Flags.GameObject.L_SECRETLY_PASSABLE |
                    Flags.GameObject.L_BLOCKS_MOVE
            )
        ).toBeFalsy();
        expect(
            cell.hasAllObjectFlags(
                Flags.GameObject.L_BLOCKS_VISION |
                    Flags.GameObject.L_BLOCKS_MOVE
            )
        ).toBeTruthy();
    });

    test('hasTileFlag + hasAllTileFlags', () => {
        const tile = Tile.make({
            id: 'FIRE_TRAP',
            flags: 'T_SPONTANEOUSLY_IGNITES, T_IS_FLAMMABLE',
            ch: '.',
            fg: 'gray',
        });

        expect(tile.flags.tile).toEqual(
            Flags.Tile.T_SPONTANEOUSLY_IGNITES | Flags.Tile.T_IS_FLAMMABLE
        );
        const cell: Cell = new Cell(tile);
        expect(
            cell.hasTileFlag(Flags.Tile.T_SPONTANEOUSLY_IGNITES)
        ).toBeTruthy();
        expect(cell.hasTileFlag(Flags.Tile.T_AUTO_DESCENT)).toBeFalsy();
        expect(
            cell.hasAllTileFlags(
                Flags.Tile.T_SPONTANEOUSLY_IGNITES | Flags.Tile.T_AUTO_DESCENT
            )
        ).toBeFalsy();
        expect(
            cell.hasAllTileFlags(
                Flags.Tile.T_SPONTANEOUSLY_IGNITES | Flags.Tile.T_IS_FLAMMABLE
            )
        ).toBeTruthy();
    });

    // test.skip('hasTileMechFlag + hasAllTileMechFlags', () => {
    // const cell : Cell = new Cell("UP_STAIRS");
    // expect(
    //   cell.hasTileMechFlag(Tile.MechFlags.TM_ALLOWS_SUBMERGING)
    // ).toBeFalsy();
    // expect(
    //   cell.hasTileMechFlag(Tile.MechFlags.TM_VISUALLY_DISTINCT)
    // ).toBeTruthy();
    // expect(
    //   cell.hasAllTileMechFlags(
    //     Tile.MechFlags.TM_ALLOWS_SUBMERGING |
    //       Tile.MechFlags.TM_VISUALLY_DISTINCT
    //   )
    // ).toBeFalsy();
    // expect(
    //   cell.hasAllTileMechFlags(
    //     Tile.MechFlags.TM_LIST_IN_SIDEBAR |
    //       Tile.MechFlags.TM_VISUALLY_DISTINCT
    //   )
    // ).toBeTruthy();
    // });

    test('hasCellFlag', () => {
        const cell: Cell = new Cell('FLOOR');
        expect(cell.hasCellFlag(Flags.Cell.HAS_DORMANT_MONSTER)).toBeFalsy();
        cell.setCellFlag(Flags.Cell.HAS_DORMANT_MONSTER);
        expect(cell.hasCellFlag(Flags.Cell.HAS_DORMANT_MONSTER)).toBeTruthy();
        cell.clearCellFlag(Flags.Cell.HAS_DORMANT_MONSTER);
        expect(cell.hasCellFlag(Flags.Cell.HAS_DORMANT_MONSTER)).toBeFalsy();
    });

    test('hasTile', () => {
        const cell: Cell = new Cell('BRIDGE');
        expect(cell.hasTile('WALL')).toBeFalsy();
        expect(cell.hasTile('LAKE')).toBeFalsy(); // groundTile not handled in Cell (see TileLayer);
        expect(cell.hasTile(Tile.tiles.BRIDGE)).toBeTruthy();
    });

    test('tileWithFlag', () => {
        const cell: Cell = new Cell('FLOOR');
        expect(cell.tileWithFlag(Flags.Tile.T_BRIDGE)).toBeNull();
        cell.setTile('BRIDGE');
        expect(cell.tileWithFlag(Flags.Tile.T_BRIDGE)).toBe(Tile.tiles.BRIDGE);
    });

    // test.skip('tileWithMechFlag', () => {
    // const cell : Cell = new Cell("FLOOR");
    // expect(
    //   cell.tileWithMechFlag(Tile.MechFlags.TM_VISUALLY_DISTINCT)
    // ).toBeNull();
    // cell.setTile("BRIDGE");
    // expect(cell.tileWithMechFlag(Tile.MechFlags.TM_VISUALLY_DISTINCT)).toBe(
    //   Tile.tiles.BRIDGE
    // );
    // });

    test('isEmpty - actor, item', () => {
        const cell: Cell = new Cell();
        expect(cell.isEmpty()).toBeTruthy();

        cell.actor = UTILS.mockActor();
        expect(cell.isEmpty()).toBeFalsy();

        cell.item = UTILS.mockItem();
        expect(cell.isEmpty()).toBeFalsy();

        cell.actor = null;
        expect(cell.isEmpty()).toBeFalsy();

        cell.item = null;
        expect(cell.isEmpty()).toBeTruthy();
    });

    // test('isWalkableNow + isMoveableNow - Bridge', () => {
    //     const cell: Cell = new Cell('LAKE');
    //     expect(cell.isAnyKindOfVisible()).toBeTruthy();
    //     expect(cell.isWalkableNow()).toBeFalsy();
    //     expect(cell.isWalkableNow(true)).toBeFalsy();
    //     expect(cell.isMoveableNow()).toBeTruthy();
    //     expect(cell.isMoveableNow(true)).toBeTruthy();
    //     cell.clearFlags(Flags.Cell.ANY_KIND_OF_VISIBLE);
    //     expect(cell.isAnyKindOfVisible()).toBeFalsy();
    //     expect(cell.isWalkableNow()).toBeFalsy();
    //     expect(cell.isWalkableNow(true)).toBeTruthy(); // remembers before 'LAKE' (clear cell)
    //     expect(cell.isMoveableNow()).toBeTruthy();
    //     expect(cell.isMoveableNow(true)).toBeTruthy();
    //     cell.storeMemory(snapshot);
    //     expect(cell.isWalkableNow()).toBeFalsy();
    //     expect(cell.isWalkableNow(true)).toBeFalsy();
    //     expect(cell.isMoveableNow()).toBeTruthy();
    //     expect(cell.isMoveableNow(true)).toBeTruthy();

    //     cell.flags.cell |= Flags.Cell.VISIBLE;
    //     cell.setTile('BRIDGE');
    //     expect(cell.isAnyKindOfVisible()).toBeTruthy();
    //     expect(cell.isWalkableNow()).toBeTruthy();
    //     expect(cell.isWalkableNow(true)).toBeTruthy();
    //     expect(cell.isMoveableNow()).toBeTruthy();
    //     expect(cell.isMoveableNow(true)).toBeTruthy();
    //     cell.clearFlags(Flags.Cell.ANY_KIND_OF_VISIBLE);
    //     expect(cell.isAnyKindOfVisible()).toBeFalsy();
    //     expect(cell.isWalkableNow()).toBeTruthy();
    //     expect(cell.isWalkableNow(true)).toBeFalsy(); // remembers LAKE only
    //     expect(cell.isMoveableNow()).toBeTruthy();
    //     expect(cell.isMoveableNow(true)).toBeTruthy();
    //     cell.storeMemory(snapshot);
    //     expect(cell.isWalkableNow()).toBeTruthy();
    //     expect(cell.isWalkableNow(true)).toBeTruthy();
    //     expect(cell.isMoveableNow()).toBeTruthy();
    //     expect(cell.isMoveableNow(true)).toBeTruthy();
    // });

    // test('isWalkableNow + canBeWalked', () => {
    //     const cell: Cell = new Cell('FLOOR');
    //     expect(cell.isAnyKindOfVisible()).toBeTruthy();
    //     expect(cell.isWalkableNow()).toBeTruthy();
    //     expect(cell.isWalkableNow(true)).toBeTruthy();
    //     expect(cell.canBeWalked()).toBeTruthy();
    //     expect(cell.canBeWalked(true)).toBeTruthy();
    //     cell.clearFlags(Flags.Cell.ANY_KIND_OF_VISIBLE);
    //     expect(cell.isAnyKindOfVisible()).toBeFalsy();
    //     expect(cell.isWalkableNow()).toBeTruthy();
    //     expect(cell.isWalkableNow(true)).toBeTruthy();
    //     expect(cell.canBeWalked()).toBeTruthy();
    //     expect(cell.canBeWalked(true)).toBeTruthy();
    //     cell.storeMemory(snapshot);
    //     expect(cell.isWalkableNow()).toBeTruthy();
    //     expect(cell.isWalkableNow(true)).toBeTruthy();
    //     expect(cell.canBeWalked()).toBeTruthy();
    //     expect(cell.canBeWalked(true)).toBeTruthy();

    //     cell.flags.cell |= Flags.Cell.VISIBLE;
    //     cell.setTile('WALL');
    //     expect(cell.isAnyKindOfVisible()).toBeTruthy();
    //     expect(cell.isWalkableNow()).toBeFalsy();
    //     expect(cell.isWalkableNow(true)).toBeFalsy();
    //     expect(cell.canBeWalked()).toBeFalsy();
    //     expect(cell.canBeWalked(true)).toBeFalsy();
    //     cell.clearFlags(Flags.Cell.ANY_KIND_OF_VISIBLE);
    //     expect(cell.isAnyKindOfVisible()).toBeFalsy();
    //     expect(cell.isWalkableNow()).toBeFalsy();
    //     expect(cell.isWalkableNow(true)).toBeTruthy(); // remembers FLOOR
    //     expect(cell.canBeWalked()).toBeFalsy();
    //     expect(cell.canBeWalked(true)).toBeTruthy();
    //     cell.storeMemory(snapshot);
    //     expect(cell.isWalkableNow()).toBeFalsy();
    //     expect(cell.isWalkableNow(true)).toBeFalsy();
    //     expect(cell.canBeWalked()).toBeFalsy();
    //     expect(cell.canBeWalked(true)).toBeFalsy();

    //     const SECRET_DOOR = new Tile({
    //         id: 'SECRET_DOOR',
    //         Extends: 'DOOR',
    //         flags: 'L_SECRETLY_PASSABLE, L_BLOCKS_MOVE, L_BLOCKS_VISION',
    //         effects: {
    //             discover: { tile: 'DOOR' },
    //             open: null,
    //             enter: null,
    //         },
    //     });

    //     cell.flags.cell |= Flags.Cell.VISIBLE;
    //     cell.setTile(SECRET_DOOR);
    //     expect(cell.isAnyKindOfVisible()).toBeTruthy();
    //     expect(cell.isWalkableNow()).toBeFalsy();
    //     expect(cell.isWalkableNow(true)).toBeFalsy();
    //     expect(cell.canBeWalked()).toBeTruthy();
    //     expect(cell.canBeWalked(true)).toBeTruthy();
    //     cell.clearFlags(Flags.Cell.ANY_KIND_OF_VISIBLE);
    //     expect(cell.isAnyKindOfVisible()).toBeFalsy();
    //     expect(cell.isWalkableNow()).toBeFalsy();
    //     expect(cell.isWalkableNow(true)).toBeFalsy(); // Remembers WALL
    //     expect(cell.canBeWalked()).toBeTruthy();
    //     expect(cell.canBeWalked(true)).toBeFalsy(); // Remembers WALL
    //     cell.storeMemory(snapshot);
    //     expect(cell.isWalkableNow()).toBeFalsy();
    //     expect(cell.isWalkableNow(true)).toBeFalsy();
    //     expect(cell.canBeWalked()).toBeTruthy();
    //     expect(cell.canBeWalked(true)).toBeTruthy();
    // });

    // test('isWall', () => {
    //     const cell: Cell = new Cell('FLOOR');
    //     expect(cell.isAnyKindOfVisible()).toBeTruthy();
    //     expect(cell.isWall()).toBeFalsy();
    //     expect(cell.isWall(true)).toBeFalsy();
    //     cell.clearFlags(Flags.Cell.ANY_KIND_OF_VISIBLE);
    //     expect(cell.isAnyKindOfVisible()).toBeFalsy();
    //     expect(cell.isWall()).toBeFalsy();
    //     expect(cell.isWall(true)).toBeFalsy();
    //     cell.storeMemory(snapshot);
    //     expect(cell.isWall()).toBeFalsy();
    //     expect(cell.isWall(true)).toBeFalsy();

    //     cell.flags.cell |= Flags.Cell.VISIBLE;
    //     cell.setTile('WALL');
    //     expect(cell.isAnyKindOfVisible()).toBeTruthy();
    //     expect(cell.isWall()).toBeTruthy();
    //     expect(cell.isWall(true)).toBeTruthy();
    //     cell.clearFlags(Flags.Cell.ANY_KIND_OF_VISIBLE);
    //     expect(cell.isAnyKindOfVisible()).toBeFalsy();
    //     expect(cell.isWall()).toBeTruthy();
    //     expect(cell.isWall(true)).toBeFalsy(); // remembers a FLOOR
    //     cell.storeMemory(snapshot);
    //     expect(cell.isWall()).toBeTruthy();
    //     expect(cell.isWall(true)).toBeTruthy();

    //     cell.flags.cell |= Flags.Cell.VISIBLE;
    //     cell.setTile('DOOR');
    //     expect(cell.isAnyKindOfVisible()).toBeTruthy();
    //     expect(cell.isWall()).toBeFalsy();
    //     expect(cell.isWall(true)).toBeFalsy();
    //     cell.clearFlags(Flags.Cell.ANY_KIND_OF_VISIBLE);
    //     expect(cell.isAnyKindOfVisible()).toBeFalsy();
    //     expect(cell.isWall()).toBeFalsy();
    //     expect(cell.isWall(true)).toBeTruthy(); // remembers a WALL
    //     cell.storeMemory(snapshot);
    //     expect(cell.isWall()).toBeFalsy();
    //     expect(cell.isWall(true)).toBeFalsy();
    // });

    // test('isObstruction', () => {
    //     const cell: Cell = new Cell('FLOOR');
    //     expect(cell.isAnyKindOfVisible()).toBeTruthy();
    //     expect(cell.isObstruction()).toBeFalsy();
    //     expect(cell.isObstruction(true)).toBeFalsy();
    //     cell.clearFlags(Flags.Cell.ANY_KIND_OF_VISIBLE);
    //     expect(cell.isAnyKindOfVisible()).toBeFalsy();
    //     expect(cell.isObstruction()).toBeFalsy();
    //     expect(cell.isObstruction(true)).toBeFalsy();
    //     cell.storeMemory(snapshot);
    //     expect(cell.isObstruction()).toBeFalsy();
    //     expect(cell.isObstruction(true)).toBeFalsy();

    //     cell.flags.cell |= Flags.Cell.VISIBLE;
    //     cell.setTile('WALL');
    //     expect(cell.isAnyKindOfVisible()).toBeTruthy();
    //     expect(cell.isObstruction()).toBeTruthy();
    //     expect(cell.isObstruction(true)).toBeTruthy();
    //     cell.clearFlags(Flags.Cell.ANY_KIND_OF_VISIBLE);
    //     expect(cell.isAnyKindOfVisible()).toBeFalsy();
    //     expect(cell.isObstruction()).toBeTruthy();
    //     expect(cell.isObstruction(true)).toBeFalsy(); // remembers a FLOOR
    //     cell.storeMemory(snapshot);
    //     expect(cell.isObstruction()).toBeTruthy();
    //     expect(cell.isObstruction(true)).toBeTruthy();
    // });

    // test('isDoorway', () => {
    //     const cell: Cell = new Cell('FLOOR');
    //     expect(cell.isAnyKindOfVisible()).toBeTruthy();
    //     expect(cell.isDoorway()).toBeFalsy();
    //     expect(cell.isDoorway(true)).toBeFalsy();
    //     cell.clearFlags(Flags.Cell.ANY_KIND_OF_VISIBLE);
    //     expect(cell.isAnyKindOfVisible()).toBeFalsy();
    //     expect(cell.isDoorway()).toBeFalsy();
    //     expect(cell.isDoorway(true)).toBeFalsy();
    //     cell.storeMemory(snapshot);
    //     expect(cell.isDoorway()).toBeFalsy();
    //     expect(cell.isDoorway(true)).toBeFalsy();

    //     cell.flags.cell |= Flags.Cell.VISIBLE;
    //     cell.setTile('DOOR');
    //     expect(cell.isAnyKindOfVisible()).toBeTruthy();
    //     expect(cell.isDoorway()).toBeTruthy();
    //     expect(cell.isDoorway(true)).toBeTruthy();
    //     cell.clearFlags(Flags.Cell.ANY_KIND_OF_VISIBLE);
    //     expect(cell.isAnyKindOfVisible()).toBeFalsy();
    //     expect(cell.isDoorway()).toBeTruthy();
    //     expect(cell.isDoorway(true)).toBeFalsy(); // remembers a FLOOR
    //     cell.storeMemory(snapshot);
    //     expect(cell.isDoorway()).toBeTruthy();
    //     expect(cell.isDoorway(true)).toBeTruthy();
    // });

    // test('isSecretDoorway', () => {
    //     const cell: Cell = new Cell('FLOOR');

    //     expect(cell.isAnyKindOfVisible()).toBeTruthy();
    //     expect(cell.isSecretDoorway()).toBeFalsy();
    //     expect(cell.isSecretDoorway(true)).toBeFalsy();

    //     cell.storeMemory(snapshot);
    //     cell.clearFlags(Flags.Cell.ANY_KIND_OF_VISIBLE);

    //     expect(cell.isAnyKindOfVisible()).toBeFalsy();
    //     expect(cell.isSecretDoorway()).toBeFalsy();
    //     expect(cell.isSecretDoorway(true)).toBeFalsy();

    //     const SECRET_DOOR = new Tile({
    //         id: 'SECRET_DOOR',
    //         Extends: 'DOOR',
    //         flags: 'L_SECRETLY_PASSABLE, L_BLOCKS_MOVE, L_BLOCKS_VISION',
    //         effects: {
    //             discover: { tile: 'DOOR' },
    //             open: null,
    //             enter: null,
    //         },
    //     });

    //     expect(
    //         SECRET_DOOR.flags.layer & Flags.GameObject.L_SECRETLY_PASSABLE
    //     ).toBeTruthy();

    //     cell.setTile(SECRET_DOOR);
    //     cell.setFlags(Flags.Cell.VISIBLE);
    //     expect(cell.isAnyKindOfVisible()).toBeTruthy();
    //     expect(cell.isSecretDoorway()).toBeTruthy();
    //     expect(cell.isSecretDoorway(true)).toBeFalsy(); // memory is of 'FLOOR'

    //     cell.storeMemory(snapshot);
    //     cell.clearFlags(Flags.Cell.ANY_KIND_OF_VISIBLE);

    //     expect(
    //         cell.memory.flags.layer & Flags.GameObject.L_SECRETLY_PASSABLE
    //     ).toBeTruthy();

    //     expect(cell.isAnyKindOfVisible()).toBeFalsy();
    //     expect(cell.isSecretDoorway()).toBeTruthy();
    //     expect(cell.isSecretDoorway(true)).toBeFalsy(); // If you know it is a secret door then you have discovered it and it is no longer a secret door!
    // });

    test('blocksPathing', () => {
        const cell: Cell = new Cell('FLOOR');
        expect(cell.blocksPathing()).toBeFalsy();
        expect(cell.blocksMove()).toBeFalsy();
        cell.setTile('WALL');
        expect(cell.blocksPathing()).toBeTruthy();
        expect(cell.blocksMove()).toBeTruthy();
    });

    test('blocksVision', () => {
        const cell: Cell = new Cell('FLOOR');
        expect(cell.blocksVision()).toBeFalsy();
        cell.setTile('WALL');
        expect(cell.blocksVision()).toBeTruthy();
    });

    // test('isLiquid', () => {
    //     const cell: Cell = new Cell('FLOOR');

    //     expect(cell.isLiquid()).toBeFalsy();
    //     expect(cell.isLiquid(true)).toBeFalsy();

    //     cell.setTile('BLUE_LIQUID', 100);
    //     expect(
    //         Tile.tiles.BLUE_LIQUID.flags.tile & Flags.Tile.T_IS_DEEP_LIQUID
    //     ).toBeFalsy();
    //     expect(cell.isAnyKindOfVisible()).toBeTruthy();
    //     expect(cell.isLiquid()).toBeFalsy();
    //     expect(cell.isLiquid(true)).toBeFalsy();

    //     cell.setTile('LAKE');
    //     expect(
    //         Tile.tiles.LAKE.flags.tile & Flags.Tile.T_IS_DEEP_LIQUID
    //     ).toBeTruthy();
    //     expect(cell.isLiquid()).toBeTruthy();
    //     expect(cell.isLiquid(true)).toBeTruthy();

    //     cell.flags.cell &= ~Flags.Cell.ANY_KIND_OF_VISIBLE;
    //     expect(cell.isAnyKindOfVisible()).toBeFalsy();
    //     expect(cell.isLiquid()).toBeTruthy();
    //     expect(cell.isLiquid(true)).toBeFalsy();

    //     cell.storeMemory(snapshot);
    //     expect(cell.isLiquid()).toBeTruthy();
    //     expect(cell.isLiquid(true)).toBeTruthy();
    // });

    // test('hasGas', () => {
    //     const cell: Cell = new Cell('FLOOR');

    //     expect(cell.hasGas()).toBeFalsy();
    //     expect(cell.hasGas(true)).toBeFalsy();

    //     cell.setTile('RED_GAS', 100);
    //     expect(cell.isAnyKindOfVisible()).toBeTruthy();
    //     expect(cell.hasGas()).toBeTruthy();
    //     expect(cell.hasGas(true)).toBeTruthy();

    //     cell.flags.cell &= ~Flags.Cell.ANY_KIND_OF_VISIBLE;
    //     expect(cell.isAnyKindOfVisible()).toBeFalsy();
    //     expect(cell.hasGas()).toBeTruthy();
    //     expect(cell.hasGas(true)).toBeFalsy();

    //     cell.storeMemory(snapshot);
    //     expect(cell.hasGas()).toBeTruthy();
    //     expect(cell.hasGas(true)).toBeTruthy();
    // });

    // test('markRevealed', () => {
    //     const cell: Cell = new Cell('FLOOR');
    //     expect(cell.flags.cell & Flags.Cell.REVEALED).toBeFalsy();
    //     expect(cell.markRevealed()).toBeTruthy();
    //     expect(cell.flags.cell & Flags.Cell.REVEALED).toBeTruthy();

    //     cell.flags.cell |= Flags.Cell.STABLE_MEMORY;
    //     expect(cell.markRevealed()).toBeFalsy();
    //     expect(cell.flags.cell & Flags.Cell.STABLE_MEMORY).toBeFalsy();

    //     cell.setTile('WALL');
    //     cell.flags.cell = 0;
    //     expect(cell.flags.cell & Flags.Cell.REVEALED).toBeFalsy();
    //     expect(cell.markRevealed()).toBeFalsy(); // no open space revealed
    //     expect(cell.flags.cell & Flags.Cell.REVEALED).toBeTruthy();
    // });

    // test('setTile(null) - can clear tile', () => {
    //     const c: Cell = new Cell();
    //     expect(c.ground).toBeNull();
    //     c.needsRedraw = false;

    //     c.setTile('FLOOR');
    //     expect(c.ground).toEqual('FLOOR');
    //     expect(c.needsRedraw).toBeTruthy();
    //     c.needsRedraw = false;

    //     c.setTile(null);
    //     expect(c.ground).toEqual(null);
    //     expect(c.needsRedraw).toBeTruthy();
    // });

    test('setTile(BRIDGE) will also set ground if null', () => {
        const cell: Cell = new Cell();
        expect(cell.isEmpty()).toBeTruthy();

        cell.setTile('BRIDGE');
        // groundTile not handled in cell - look in layer
        expect(cell.depthTile(Flags.Depth.GROUND)).toEqual(Tile.tiles.NULL);
        expect(cell.depthTile(Flags.Depth.SURFACE)).toEqual(Tile.tiles.BRIDGE);
        expect(cell.isEmpty()).toBeFalsy();
    });

    test('setTile(FIRE) - sets caught fire flag', () => {
        const fire = Tile.make({
            id: 'FIRE',
            flags: 'T_IS_FIRE',
            ch: '^',
            fg: 'red',
        });

        const cell: Cell = new Cell('FLOOR');
        cell.setTile(fire);
        // Fire handled in TileLayer...
        expect(cell.hasCellFlag(Flags.Cell.CAUGHT_FIRE_THIS_TURN)).toBeFalsy();
    });

    test('setTile(UNKNOWN) - will be ignored', () => {
        const cell: Cell = new Cell('FLOOR');
        expect(Tile.tiles.UNKNOWN).not.toBeDefined();
        cell.setTile('UNKNOWN');
        expect(cell.hasTile('UNKNOWN')).toBeFalsy();
        expect(cell.hasTile('FLOOR')).toBeTruthy();
    });

    test('setTile', () => {
        const c: Cell = new Cell();

        expect(Tile.tiles.FLOOR.priority).toBeLessThan(
            Tile.tiles.DOOR.priority
        );

        const floor = 'FLOOR';
        const wall = 'WALL';

        c.setTile(floor);
        expect(c.depthTile(Flags.Depth.GROUND)).toBe(Tile.tiles.FLOOR);
        c.setTile(wall);
        expect(c.depthTile(Flags.Depth.GROUND)).toBe(Tile.tiles.WALL);
        // c.setTile(floor, true); // checks priority
        // expect(c.ground).toEqual(wall);  // 2 has better priority
        c.setTile(floor);
        expect(c.depthTile(Flags.Depth.GROUND)).toBe(Tile.tiles.FLOOR); // ignored priority
    });

    test('item', () => {
        const cell: Cell = new Cell('FLOOR');
        expect(cell.item).toBeNull();

        const item = UTILS.mockItem();

        cell.needsRedraw = false;
        expect(cell.hasItem()).toBeFalsy();

        cell.item = item;
        expect(cell.hasItem()).toBeTruthy();
        expect(cell.needsRedraw).toBeTruthy();

        cell.needsRedraw = false;
        cell.item = null;
        expect(cell.hasItem()).toBeFalsy();
        expect(cell.needsRedraw).toBeTruthy();
    });

    test('actor', () => {
        const cell: Cell = new Cell('FLOOR');
        expect(cell.actor).toBeNull();

        const actor = UTILS.mockActor();
        cell.needsRedraw = false;
        expect(cell.hasActor()).toBeFalsy();

        cell.actor = actor;
        expect(cell.hasActor()).toBeTruthy();
        expect(cell.needsRedraw).toBeTruthy();

        cell.needsRedraw = false;
        cell.actor = null;
        expect(cell.hasActor()).toBeFalsy();
        expect(cell.needsRedraw).toBeTruthy();
    });

    test('activatesOn', () => {
        const cell: Cell = new Cell('ENTER');
        expect(cell.hasEffect('enter')).toBeTruthy();
        expect(cell.hasEffect('fire')).toBeFalsy();
    });

    test('activate', async () => {
        const map: Map.Map = Map.make(10, 10);
        const cell: Cell = new Cell('LOW_CHANCE');
        // UTILS.mockRandom();
        random.seed(12345);
        expect(await cell.activate('enter', map, 5, 5, {})).toBeFalsy();
    });

    // test('clearLayer', () => {
    //     const cell: Cell = new Cell('FLOOR');
    //     cell.setTile('RED_LIQUID', 100);
    //     expect(cell.ground).toEqual('FLOOR');
    //     expect(cell.liquid).toEqual('RED_LIQUID');
    //     expect(cell.liquidVolume).toEqual(100);
    //     cell.clearLayer(Map.entity.Layer.LIQUID);
    //     expect(cell.ground).toEqual('FLOOR');
    //     expect(cell.liquid).toBeNull();
    //     expect(cell.liquidVolume).toEqual(0);

    //     cell.setTile('RED_GAS', 100);
    //     expect(cell.gas).toEqual('RED_GAS');
    //     expect(cell.gasVolume).toEqual(100);
    //     cell.clearLayer(Map.entity.Layer.GAS);
    //     expect(cell.ground).toEqual('FLOOR');
    //     expect(cell.gas).toBeNull();
    //     expect(cell.gasVolume).toEqual(0);
    // });

    // test('clearLayersExcept', () => {
    //     const cell: Cell = new Cell('ENTER');
    //     cell.setTile('BRIDGE');
    //     cell.setTile('RED_LIQUID', 100);
    //     cell.setTile('RED_GAS', 100);

    //     expect(cell.groundTile).toBe(Tile.tiles.ENTER);
    //     expect(cell.surfaceTile).toBe(Tile.tiles.BRIDGE);
    //     expect(cell.liquidTile).toBe(Tile.tiles.RED_LIQUID);
    //     expect(cell.gasTile).toBe(Tile.tiles.RED_GAS);

    //     cell.clearLayersExcept(); // does not clear gas
    //     expect(cell.ground).toBe('ENTER');
    //     expect(cell.surface).toBeNull();
    //     expect(cell.liquid).toBeNull();
    //     expect(cell.gas).toEqual('RED_GAS');

    //     cell.setTile('BRIDGE');
    //     cell.setTile('RED_LIQUID', 100);
    //     cell.setTile('RED_GAS', 100);
    //     expect(cell.groundTile).toBe(Tile.tiles.ENTER);
    //     expect(cell.surfaceTile).toBe(Tile.tiles.BRIDGE);
    //     expect(cell.liquidTile).toBe(Tile.tiles.RED_LIQUID);
    //     expect(cell.gasTile).toBe(Tile.tiles.RED_GAS);

    //     cell.clearLayersExcept(Map.entity.Layer.SURFACE, 'FLOOR');
    //     expect(cell.groundTile).toBe(Tile.tiles.FLOOR);
    //     expect(cell.surfaceTile).toBe(Tile.tiles.BRIDGE);
    //     expect(cell.liquid).toBeNull();
    //     expect(cell.gasTile).toBe(Tile.tiles.RED_GAS);
    // });

    // test('clearLayerWithFlags', () => {
    //     const cell: Cell = new Cell('ENTER');
    //     cell.setTile('BRIDGE');
    //     cell.setTile('RED_LIQUID', 100);
    //     cell.setTile('RED_GAS', 100);

    //     expect(cell.groundTile).toBe(Tile.tiles.ENTER);
    //     expect(cell.surfaceTile).toBe(Tile.tiles.BRIDGE);
    //     expect(cell.liquidTile).toBe(Tile.tiles.RED_LIQUID);
    //     expect(cell.gasTile).toBe(Tile.tiles.RED_GAS);

    //     cell.clearLayersWithFlags(Flags.Tile.T_BRIDGE);
    //     expect(cell.groundTile).toBe(Tile.tiles.ENTER);
    //     expect(cell.surface).toBeNull();
    //     expect(cell.liquidTile).toBe(Tile.tiles.RED_LIQUID);
    //     expect(cell.gasTile).toBe(Tile.tiles.RED_GAS);

    //     cell.setTile('BRIDGE');
    //     cell.clearLayersWithFlags(
    //         Flags.Tile.T_DEEP_WATER,
    //         Tile.MechFlags.TM_EXPLOSIVE_PROMOTE
    //     );
    //     expect(cell.groundTile).toBe(Tile.tiles.ENTER);
    //     expect(cell.surfaceTile).toBe(Tile.tiles.BRIDGE);
    //     expect(cell.liquid).toBeNull();
    //     expect(cell.gasTile).toBe(Tile.tiles.RED_GAS);

    //     cell.setTile('RED_LIQUID', 100);
    //     cell.clearLayersWithFlags(0, Tile.MechFlags.TM_EXPLOSIVE_PROMOTE);
    //     expect(cell.groundTile).toBe(Tile.tiles.ENTER);
    //     expect(cell.surfaceTile).toBe(Tile.tiles.BRIDGE);
    //     expect(cell.liquid).toBeNull();
    //     expect(cell.gasTile).toBe(Tile.tiles.RED_GAS);
    // });
});
