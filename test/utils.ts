import { Random } from '../ts/random';
import * as Types from '../ts/types';

export function extractText(buffer: any, x: any, y: any, width: any) {
    let output = '';
    for (let i = x; i < x + width; ++i) {
        const data = buffer.get(i, y);
        const ch = String.fromCharCode(data.ch || 32);
        output += ch;
    }
    return output.trim();
}

export const rnd = jest.fn();

export var seed = 0;

export function mockRandom(s?: number) {
    seed = s || 0;
    rnd.mockImplementation(() => {
        seed = (seed + 17) % 100;
        return seed / 100;
    });
    const make = jest.fn().mockImplementation((s?: number) => {
        if (typeof s === 'number') {
            seed = s % 100;
        }
        return rnd;
    });
    Random.configure({ make });
    make.mockClear();
}

export function mockCell(): Types.CellType {
    return {
        flags: 0,
        mechFlags: 0,
        tileFlags: jest.fn().mockReturnValue(0),
        tileMechFlags: jest.fn().mockReturnValue(0),
        actor: null,
        item: null,
        storeMemory: jest.fn(),

        // isWall: jest.fn().mockReturnValue(false),
        // blocksEffects: jest.fn().mockReturnValue(false),
        // hasTile: jest.fn().mockReturnValue(false),
    };
}

export function mockMap(w = 10, h = 10): Types.MapType {
    return {
        width: w,
        height: h,
        // hasXY(x, y) {
        //     return x >= 0 && x < w && y >= 0 && y < h;
        // },
        // cell: jest.fn().mockImplementation(mockCell),
        // eachNeighbor: jest.fn(),
        isVisible: jest.fn().mockReturnValue(true),
        actorAt: jest.fn().mockReturnValue(null),
        itemAt: jest.fn().mockReturnValue(null),
    };
}
