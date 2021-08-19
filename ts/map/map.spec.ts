import * as Map from './map';
import * as Tile from '../tile';
import { Mixer } from '../sprite';

describe('Map', () => {
    test('from', () => {
        Tile.install('GRASS', {
            depth: 'SURFACE',
            ch: '"',
            fg: 'green',
        });

        Tile.install('TREE', {
            depth: 'SURFACE',
            ch: 'T',
            fg: 'green',
            flags: 'L_BLOCKS_MOVE, L_BLOCKS_VISION',
        });

        const charToTile = {
            '"': 'GRASS',
            T: 'TREE',
            '.': 'FLOOR',
            '#': 'WALL',
            '+': 'DOOR',
            '~': 'LAKE',
            '=': 'BRIDGE',
        };

        const prefab = [
            '##########',
            '#....."..#',
            '##.."T"..#',
            '#...TT"..#',
            '#.TT~~..##',
            '#.."~~~".#',
            '#...==...#',
            '#."~~~"..#',
            '#.."~~~".#',
            '##########',
        ];

        const map = Map.from(prefab, charToTile, {
            fov: true,
            revealed: true,
        });

        const mixer = new Mixer();

        map.getAppearanceAt(0, 0, mixer);
        expect(mixer.fg.toInt()).toBeGreaterThan(0);
        expect(mixer.bg.toInt()).toBeGreaterThan(0);

        expect(Tile.tiles.BRIDGE.groundTile).toEqual('LAKE');
        expect(Tile.tiles.LAKE).toBeDefined();

        expect(map.cell(4, 6).hasTile('BRIDGE')).toBeTruthy();
        expect(map.cell(4, 6).hasTile('LAKE')).toBeTruthy();
    });
});
