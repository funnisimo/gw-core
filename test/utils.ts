// import { Random } from '../ts/random';
import { DataBuffer } from '../ts/canvas/buffer';

export function extractBufferText(
    buffer: DataBuffer,
    x: number,
    y: number,
    width: number,
    trim = true
) {
    let output = '';
    for (let i = x; i < x + width; ++i) {
        const data = buffer.get(i, y);
        const ch = String.fromCharCode(data.glyph || 32);
        output += ch;
    }
    if (!trim) return output;
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
