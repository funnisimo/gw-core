// import { Random } from '../ts/random';
import { Actor } from '../ts/actor';
import { Item } from '../ts/item';
import * as Map from '../ts/map';

export function extractText(buffer: any, x: any, y: any, width: any) {
    let output = '';
    for (let i = x; i < x + width; ++i) {
        const data = buffer.get(i, y);
        const ch = String.fromCharCode(data.glyph || 32);
        output += ch;
    }
    return output.trim();
}

// export const rnd = jest.fn();

// export var seed = 0;

// export function mockRandom(s?: number) {
//     seed = s || 0;
//     rnd.mockImplementation(() => {
//         seed = (seed + 17) % 100;
//         return seed / 100;
//     });
//     const make = jest.fn().mockImplementation((s?: number) => {
//         if (typeof s === 'number') {
//             seed = s % 100;
//         }
//         return rnd;
//     });
//     Random.configure({ make });
//     make.mockClear();
// }

export function mockCell(): Map.Cell {
    const cell = new Map.Cell();
    jest.spyOn(cell, 'tileFlags').mockReturnValue(0);
    jest.spyOn(cell, 'tileMechFlags').mockReturnValue(0);
    return cell;
}

export function mockMap(w = 10, h = 10): Map.Map {
    const map = Map.make(w, h);
    jest.spyOn(map, 'isVisible').mockReturnValue(true);
    return map;
}

export function mockActor(): Actor {
    const actor = new Actor();
    actor.sprite.ch = 'a';
    jest.spyOn(actor, 'isPlayer').mockReturnValue(false);
    jest.spyOn(actor, 'forbidsCell').mockReturnValue(false);
    jest.spyOn(actor, 'blocksVision').mockReturnValue(false);
    return actor;
}

export function mockPlayer(): Actor {
    const player = mockActor();
    player.sprite.ch = '@';
    // @ts-ignore
    player.isPlayer.mockReturnValue(true);
    return player;
}

export function mockItem(): Item {
    const item = new Item();
    item.sprite.ch = '!';
    jest.spyOn(item, 'forbidsCell').mockReturnValue(false);
    jest.spyOn(item, 'blocksVision').mockReturnValue(false);
    return item;
}
