import 'jest-extended';
import '../../test/matchers';
import * as UTILS from '../../test/utils';

import { CellMemory } from './cellMemory';
import { Cell } from './cell';
import * as Tile from '../tile';
import * as Flags from './flags';

describe('CellMemory', () => {
    test('Snapshot', () => {
        const a = new CellMemory();
        const b = new CellMemory();

        a.snapshot.draw('a');
        a.flags.tile = 1;
        a.flags.cell = 1;

        b.snapshot.draw('b');
        b.flags.tile = 2;
        b.flags.cell = 2;

        expect(a.snapshot).not.toBe(b.snapshot);
        a.putSnapshot(b.snapshot);
        expect(a.snapshot).not.toBe(b.snapshot);
        expect(a.snapshot.ch).toEqual('b');

        a.clear();
        expect(a.snapshot.ch).toEqual(0);
        expect(a.snapshot.fg.toInt()).toEqual(0);
        expect(a.snapshot.bg.toInt()).toEqual(0);
    });

    test('memory', () => {
        const c: Cell = new Cell('FLOOR');
        expect(c.flags.cell).toEqual(Flags.Cell.NEEDS_REDRAW);
        expect(c.hasTile('FLOOR')).toBeTruthy();

        const mem: CellMemory = new CellMemory();
        mem.store(c);
        expect(mem.item).toBeNull();
        expect(mem.actor).toBeNull();
        expect(mem.tile).toBe(Tile.tiles.FLOOR);
        expect(mem.flags.cell).toEqual(Flags.Cell.NEEDS_REDRAW);
        expect(mem.flags.tile).toEqual(0);
        expect(mem.flags.tileMech).toEqual(0);

        const item = UTILS.mockItem();

        const actor = UTILS.mockActor();

        c.item = item;
        c.actor = actor;

        mem.store(c);
        expect(mem.item).toBe(item);
        expect(mem.actor).toBe(actor);
        expect(mem.tile).toBe(Tile.tiles.FLOOR);
        expect(mem.flags.cell).toEqual(
            Flags.Cell.NEEDS_REDRAW | Flags.Cell.HAS_ACTOR | Flags.Cell.HAS_ITEM
        );
        expect(mem.flags.tile).toEqual(0);
        expect(mem.flags.tileMech).toEqual(0);
    });
});
