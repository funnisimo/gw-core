import * as UTILS from '../../test/utils';
// import * as GWU from 'gw-utils';
import * as Canvas from '../canvas';

import * as UI from './ui';
import { Layer } from './layer';

describe('UI', () => {
    let canvas: Canvas.BaseCanvas;
    let loop: UTILS.MockLoop;

    beforeEach(() => {
        loop = UTILS.mockLoop();
        canvas = (UTILS.mockCanvas(50, 30) as unknown) as Canvas.BaseCanvas;
    });

    afterEach(() => {
        loop.stop();
    });

    test('construct', () => {
        const ui = new UI.UI({ loop, canvas });
        expect(ui.loop).toBe(loop);
        expect(ui.canvas).toBe(canvas);
        expect(ui.layer).toBeNull();
    });

    // jest.setTimeout(10 * 60 * 1000);

    test('stop layer', async () => {
        const ui = new UI.UI({ loop, canvas });
        const layer = ui.startNewLayer();
        expect(ui.layer).toBe(layer);

        jest.spyOn(layer, 'click');

        const p = layer.run();

        await UTILS.pushEvent(ui.loop, UTILS.click(2, 2));
        expect(layer.click).toHaveBeenCalled();

        layer.finish();
        expect(ui.layer).toBeNull();

        ui.stop();
        expect(ui._done).toBeTruthy();

        await p;
    });

    async function runLayer(ui: UI.UI) {
        const layer = ui.startNewLayer();
        // console.log('start new layer');

        let result = '';
        return layer.run({
            async click(_e) {
                // console.log('click', e.x);
                result += await runLayer(ui);
            },
            async keypress(e) {
                // console.log('keypress', e.key);
                layer.finish(result + e.key);
            },
        });
    }

    test('multiple layers', async () => {
        const ui = new UI.UI({ loop, canvas });

        const p = runLayer(ui);
        await UTILS.pushEvent(ui.loop, UTILS.click(2, 2)); // 2 layers
        await UTILS.pushEvent(ui.loop, UTILS.click(3, 2)); // 3 layers

        await UTILS.pushEvent(ui.loop, UTILS.keypress('a')); // 2 layers
        await UTILS.pushEvent(ui.loop, UTILS.keypress('b')); // 1 layers
        await UTILS.pushEvent(ui.loop, UTILS.keypress('c')); // 0 layers

        expect(await p).toEqual('abc');
    });

    test('many layers', async () => {
        const ui = new UI.UI({ loop, canvas });

        const layers: Layer[] = [];
        for (let i = 0; i < 5; ++i) {
            layers.push(ui.startNewLayer());
        }
        expect(layers).toHaveLength(5);
        expect(ui.layer).toBe(layers[layers.length - 1]);

        while (layers.length) {
            const last = layers.pop();
            ui.finishLayer(last!);
            expect(ui.layer).toBe(layers[layers.length - 1] || null);
        }

        ui.stop();
        expect(ui._done).toBeTruthy();
    });

    test('stop multiple layers', async () => {
        const ui = new UI.UI({ loop, canvas });
        const layer = ui.startNewLayer();
        jest.spyOn(layer, 'click');
        expect(ui.layer).toBe(layer);

        const layer2 = ui.startNewLayer();
        jest.spyOn(layer2, 'click');
        expect(ui.layer).toBe(layer2);

        await ui.stop();

        expect(layer.result).toBeUndefined();
        expect(layer2.result).toBeUndefined();
    });
});
