import * as TEST from '../../test/utils';
import * as APP from '../app';
import * as CANVAS from '../canvas';

// import * as BORDER from './border';

describe('Body', () => {
    let canvas: CANVAS.CanvasType;
    let app: APP.App;
    let scene: APP.Scene;
    let buffer: CANVAS.Buffer;

    beforeEach(() => {
        canvas = TEST.mockCanvas(50, 30);
        app = APP.make({ canvas, start: false });
        scene = app.scene;
        buffer = canvas.buffer;
    });

    test('basic alert', () => {
        scene.build.text('testing testing testing', { x: 13, y: 15 });

        app._draw();
        expect(TEST.getBufferText(buffer, 13, 15, 25)).toEqual(
            'testing testing testing'
        );

        const pauseFn = jest.fn();
        const resumeFn = jest.fn();
        scene.on('pause', pauseFn);
        scene.on('resume', resumeFn);

        expect(app.scene).toBe(scene);

        app.alert('This is an alert.', { bg: 'green', border: 'ascii' });

        expect(pauseFn).toHaveBeenCalled();
        expect(resumeFn).not.toHaveBeenCalled();
        expect(app.scene).not.toBe(scene);

        expect(scene.paused).toEqual({
            draw: true,
            input: true,
            timers: true,
            tweens: true,
            update: true,
        });

        app._draw();
        // buffer.dump();
        expect(TEST.getBufferText(buffer, 13, 15, 25)).toEqual(
            '| This is an alert. |'
        );

        app._input(TEST.keypress('Enter'));

        expect(resumeFn).toHaveBeenCalled();
        expect(app.scene).toBe(scene);

        expect(scene.paused).toEqual({
            draw: false,
            input: false,
            timers: false,
            tweens: false,
            update: false,
        });

        app._draw();
        expect(TEST.getBufferText(buffer, 13, 15, 25)).toEqual(
            'testing testing testing'
        );
    });

    test('alert -> alert', () => {
        scene.build.text('testing testing testing', { x: 13, y: 15 });

        app._draw();
        expect(TEST.getBufferText(buffer, 13, 15, 25)).toEqual(
            'testing testing testing'
        );

        expect(app.scene).toBe(scene);

        app.alert('This is an alert.', { bg: 'green', border: 'ascii' });
        app._input(TEST.keypress('Enter'));
        app._draw();

        app.alert('ANOTHER ALERT!\nThis one has many lines!\nHow exciting!', {
            bg: 'green',
            border: 'ascii',
        });

        app._draw();
        // buffer.dump();
        app._input(TEST.keypress('Enter'));
        app._draw();

        expect(app.scene).toBe(scene);

        app._draw();
        expect(TEST.getBufferText(buffer, 13, 15, 25)).toEqual(
            'testing testing testing'
        );
    });
});
