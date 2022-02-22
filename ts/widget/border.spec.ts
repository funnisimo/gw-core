import * as TEST from '../../test/utils';
import * as APP from '../app';
import * as CANVAS from '../canvas';

// import * as BORDER from './border';

describe('Body', () => {
    let canvas: CANVAS.Canvas;
    let app: APP.App;
    let scene: APP.Scene;

    beforeEach(() => {
        canvas = TEST.mockCanvas();
        app = APP.make({ canvas, start: false, scene: true });
        scene = app.scene;
    });

    test('basic', () => {
        scene.build.border({
            scene,
            ascii: true,
            width: scene.width,
            height: scene.height,
        });

        scene.build.text('Test');

        app._draw();
        // canvas.buffer.dump();

        expect(TEST.getBufferText(scene.buffer, 0, 0, 30)).toEqual(
            '+----------------------------+'
        );
        expect(TEST.getBufferText(scene.buffer, 0, 1, 30)).toEqual(
            '|Test                        |'
        );
    });
});
