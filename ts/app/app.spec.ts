import 'jest-extended';
import '../../test/matchers';

import * as TEST from '../../test/utils';
// import * as BUFFER from '../buffer';
// import * as COLOR from '../color';

import * as APP from '../app';
import * as CANVAS from '../canvas';
import * as BUILD from '../widgets/builder';

describe('App', () => {
    let canvas: CANVAS.Canvas;
    let app: APP.App;
    let scene: APP.Scene;

    beforeEach(() => {
        canvas = TEST.mockCanvas();
        app = APP.make({ canvas, start: false });
        scene = app.scene;
    });

    test('basic', () => {
        const enterFn = jest.fn();
        app = APP.make({
            canvas,
            start: false,
            scene: {
                bg: 'blue',
                create() {
                    const b = new BUILD.Builder(this);
                    b.pos(1, 1).text('Test');
                },
                on: {
                    Enter: enterFn,
                },
            },
        });

        scene = app.scene;

        expect(scene.children).toHaveLength(1);

        app._input(TEST.keypress('Enter'));
        expect(enterFn).toHaveBeenCalled();

        app._draw();
        expect(TEST.getBufferText(app.buffer, 1, 1, 10, true)).toEqual('Test');
    });
});
