import * as UTILS from '../../test/utils';
import * as Canvas from '../canvas';

import * as UI from './ui';
// import { Layer, BufferStack } from './layer';
import { Loop } from '../io';

describe('UI', () => {
    let canvas: Canvas.BaseCanvas;
    let loop: Loop;
    beforeEach(() => {
        canvas = UTILS.bufferStack(50, 30) as Canvas.BaseCanvas;
        loop = canvas.loop;
    });

    afterEach(() => {
        loop.finish();
    });

    test('construct', () => {
        const ui = new UI.UI({ loop, canvas: canvas });
        expect(ui.loop).toBe(loop);
        expect(ui.canvas).toBe(canvas);

        ui.finish();
    });
});
