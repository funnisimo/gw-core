// import { Random } from '../ts/random';
import { Buffer } from '../ts/buffer';
import * as Canvas from '../ts/canvas';
import * as IO from '../ts/app/io';
// import * as Layer from '../ts/ui/layer';
// import * as WidgetLayer from '../ts/widget/layer';
// import * as UI from '../ts/ui/ui';

const GLYPHS: string[] = [];
Canvas.initGlyphs({ draw: (n, ch) => (GLYPHS[n] = ch) });

export function extractBufferText(
    buffer: Buffer,
    x: number,
    y: number,
    width: number = 99,
    trim = true
) {
    let output = '';
    width = Math.min(buffer.width - x, width);
    for (let i = x; i < x + width; ++i) {
        const data = buffer.info(i, y);
        const ch = GLYPHS[data.glyph || 32] || ' ';
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

// @ts-ignore
export interface MockLoop extends IO.Loop {
    run: jest.Mock<Promise<void>, [IO.IOMap, number]>;
    stop: jest.Mock<void>;
}

export function mockLoop() {
    // @ts-ignore
    const loop: MockLoop = new IO.Loop();
    jest.spyOn(loop, 'run');
    jest.spyOn(loop, 'stop');
    return loop;
}

// export function bufferStack(w: number, h: number): Layer.BufferStack {
//     const target: Canvas.BufferTarget = {
//         width: w,
//         height: h,
//         copyTo: jest.fn(),
//         toGlyph(ch: string | number): number {
//             if (typeof ch === 'string') return GLYPHS.indexOf(ch);
//             return ch;
//         },
//         draw: jest.fn(),
//     };

//     const loop = new IO.Loop();

//     const buffer = new Canvas.Buffer(target);

//     return {
//         buffer,
//         parentBuffer: buffer,
//         pushBuffer() {
//             return buffer;
//         },
//         popBuffer() {},
//         loop,
//     };
// }

export function mockCanvas(width = 30, height = 30): Canvas.CanvasType {
    const target: Canvas.BufferTarget = {
        width,
        height,
        copyTo: jest.fn(),
        toGlyph(ch: string | number): number {
            if (typeof ch === 'string') return GLYPHS.indexOf(ch); // ch.charCodeAt(0);
            return ch;
        },
        draw: jest.fn().mockReturnValue(true),
    };

    const buffer = new Canvas.Buffer(target);
    const node = {} as HTMLCanvasElement;
    const glyphs = {} as Canvas.Glyphs;

    return Object.assign(target, {
        mouse: { x: -1, y: -1 },
        node,
        tileWidth: 16,
        tileHeight: 16,
        pxWidth: 16 * width,
        pxHeight: 16 * height,

        glyphs,

        buffer,
        parentBuffer: buffer,
        root: buffer,

        pushBuffer: jest.fn().mockReturnValue(buffer),
        popBuffer: jest.fn(),
        resize: jest.fn(),

        render: jest.fn(),
        hasXY(x: number, y: number) {
            return x >= 0 && y >= 0 && x < width && y < height;
        },

        onclick: null,
        onmousemove: null,
        onmouseup: null,
        onkeydown: null,
    }) as Canvas.CanvasType;
}

// export function mockUI(width = 100, height = 38) {
//     // @ts-ignore
//     const canvas = bufferStack(width, height);

//     const ui = new UI.UI({
//         loop: canvas.loop,
//         canvas: canvas as Canvas.BaseCanvas,
//         layer: false,
//     });

//     return ui;
// }

// export function mockLayer(w: number, h: number): Layer.Layer {
//     const canvas = mockUI(w, h);
//     const layer = new Layer.Layer(canvas);
//     return layer;
// }

// export function mockWidgetLayer(w: number, h: number): WidgetLayer.WidgetLayer {
//     const canvas = mockUI(w, h);
//     const layer = new WidgetLayer.WidgetLayer(canvas);
//     return layer;
// }

export function getBufferText(
    buffer: Buffer,
    x: number,
    y: number,
    width: number = 99
): string {
    let text = '';
    for (let i = 0; i < width; ++i) {
        const data = buffer.info(x + i, y);
        if (!data.glyph) data.glyph = 32;
        text += String.fromCharCode(data.glyph);
    }
    return text.trim();
}

export function getBufferFg(buffer: Buffer, x: number, y: number): number {
    const data = buffer.info(x, y);
    return data.fg;
}

export function getBufferBg(buffer: Buffer, x: number, y: number): number {
    const data = buffer.info(x, y);
    return data.bg;
}

export function keypress(key: string): IO.Event {
    let code = 'Key' + key.toUpperCase();
    if (key.length > 1) {
        code = key;
    } else if (key >= '0' && key <= '9') {
        code = 'Digit' + key;
    }

    return IO.makeKeyEvent({
        key,
        code,
    } as KeyboardEvent);
}

export function dir(name: 'up' | 'down' | 'left' | 'right'): IO.Event {
    return IO.makeKeyEvent({
        key: 'arrow' + name,
        code: 'ARROW' + name.toUpperCase(),
    } as KeyboardEvent);
}

export function click(x: number, y: number): IO.Event {
    return IO.makeMouseEvent({ buttons: 1 } as MouseEvent, x, y);
}

export function mousemove(x: number, y: number): IO.Event {
    return IO.makeMouseEvent({} as MouseEvent, x, y);
}

export function tick(dt = 16): IO.Event {
    return IO.makeTickEvent(dt);
}

export async function wait(dt = 1): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, dt));
}
