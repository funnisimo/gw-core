import * as TEST from '../../test/utils';
import * as APP from '../app';
import * as CANVAS from '../canvas';
import * as BUFFER from '../buffer';

// import * as BORDER from './border';

describe('Body', () => {
    let canvas: CANVAS.Canvas;
    let app: APP.App;
    let scene: APP.Scene;
    let buffer: BUFFER.Buffer;

    beforeEach(() => {
        canvas = TEST.mockCanvas(50, 30);
        app = APP.make({ canvas, start: false, scene: true });
        scene = app.scene;
    });

    test('async text', async () => {
        scene.build.pos(10, 10).text('testing testing testing');

        const r = app.prompt('What do you want to eat?');
        buffer = app.scene.buffer;

        app._draw();

        app._input(TEST.keypress('T'));
        app._input(TEST.keypress('a'));
        app._input(TEST.keypress('c'));
        app._input(TEST.keypress('o'));
        app._input(TEST.keypress('s'));

        app._draw();
        // buffer.dump();
        expect(TEST.getBufferText(buffer, 10, 13)).toEqual(
            '+--------------------------+'
        );
        expect(TEST.getBufferText(buffer, 10, 14)).toEqual(
            '| What do you want to eat? |'
        );
        expect(TEST.getBufferText(buffer, 10, 15)).toEqual(
            '| Tacos                    |'
        );
        expect(TEST.getBufferText(buffer, 10, 16)).toEqual(
            '+--------------------------+'
        );

        app._input(TEST.keypress('Enter'));

        expect(await r).toEqual('Tacos');
    });

    test('async cancel', async () => {
        scene.build.pos(10, 10).text('testing testing testing');

        const r = app.prompt('What do you want to eat?');

        app._draw();
        buffer = app.scene.buffer;

        app._input(TEST.keypress('T'));
        app._input(TEST.keypress('a'));
        app._input(TEST.keypress('c'));
        app._input(TEST.keypress('o'));
        app._input(TEST.keypress('s'));

        app._draw();
        // buffer.dump();
        expect(TEST.getBufferText(buffer, 10, 13)).toEqual(
            '+--------------------------+'
        );
        expect(TEST.getBufferText(buffer, 10, 14)).toEqual(
            '| What do you want to eat? |'
        );
        expect(TEST.getBufferText(buffer, 10, 15)).toEqual(
            '| Tacos                    |'
        );
        expect(TEST.getBufferText(buffer, 10, 16)).toEqual(
            '+--------------------------+'
        );

        app._input(TEST.keypress('Escape'));

        expect(await r).toEqual(null);
    });

    test('label', async () => {
        scene.build.pos(10, 10).text('testing testing testing');

        const r = app.prompt('What do you want to eat?', { label: 'Food:' });
        buffer = app.scene.buffer;

        app._draw();

        app._input(TEST.keypress('T'));
        app._input(TEST.keypress('a'));
        app._input(TEST.keypress('c'));
        app._input(TEST.keypress('o'));
        app._input(TEST.keypress('s'));

        app._draw();
        // buffer.dump();
        expect(TEST.getBufferText(buffer, 10, 13)).toEqual(
            '+--------------------------+'
        );
        expect(TEST.getBufferText(buffer, 10, 14)).toEqual(
            '| What do you want to eat? |'
        );
        expect(TEST.getBufferText(buffer, 10, 15)).toEqual(
            '| Food: Tacos              |'
        );
        expect(TEST.getBufferText(buffer, 10, 16)).toEqual(
            '+--------------------------+'
        );

        app._input(TEST.keypress('Enter'));

        expect(await r).toEqual('Tacos');
    });

    test('done text', async () => {
        scene.build.pos(10, 10).text('testing testing testing');

        const doneFn = jest.fn();

        app.prompt('What do you want to eat?', { done: doneFn });
        buffer = app.scene.buffer;

        app._draw();

        app._input(TEST.keypress('T'));
        app._input(TEST.keypress('a'));
        app._input(TEST.keypress('c'));
        app._input(TEST.keypress('o'));
        app._input(TEST.keypress('s'));

        app._draw();
        // buffer.dump();
        expect(TEST.getBufferText(buffer, 10, 13)).toEqual(
            '+--------------------------+'
        );
        expect(TEST.getBufferText(buffer, 10, 14)).toEqual(
            '| What do you want to eat? |'
        );
        expect(TEST.getBufferText(buffer, 10, 15)).toEqual(
            '| Tacos                    |'
        );
        expect(TEST.getBufferText(buffer, 10, 16)).toEqual(
            '+--------------------------+'
        );

        app._input(TEST.keypress('Enter'));

        expect(doneFn).toHaveBeenCalledWith('Tacos');
    });

    test('done cancel', async () => {
        scene.build.pos(10, 10).text('testing testing testing');

        const doneFn = jest.fn();

        app.prompt('What do you want to eat?', { done: doneFn });
        buffer = app.scene.buffer;

        expect(app.scene).not.toBe(scene);

        app._draw();

        app._input(TEST.keypress('T'));
        app._input(TEST.keypress('a'));
        app._input(TEST.keypress('c'));
        app._input(TEST.keypress('o'));
        app._input(TEST.keypress('s'));

        app._draw();
        // buffer.dump();
        expect(TEST.getBufferText(buffer, 10, 13)).toEqual(
            '+--------------------------+'
        );
        expect(TEST.getBufferText(buffer, 10, 14)).toEqual(
            '| What do you want to eat? |'
        );
        expect(TEST.getBufferText(buffer, 10, 15)).toEqual(
            '| Tacos                    |'
        );
        expect(TEST.getBufferText(buffer, 10, 16)).toEqual(
            '+--------------------------+'
        );

        app._input(TEST.keypress('Escape'));

        expect(doneFn).toHaveBeenCalledWith(null);
    });
});
