import './tiles';
import * as Tile from './tile';

describe('Tiles', () => {
    test('BRIDGE', () => {
        const tile = Tile.tiles.BRIDGE;
        expect(tile).toBeInstanceOf(Tile.Tile);
        expect(tile.groundTile).toEqual('LAKE');
    });
});
