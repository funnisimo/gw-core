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

    test('async text', async () => {
        scene.build.pos(10, 10).text('testing testing testing');

        const r = app.prompt('What do you want to eat?');

        app._draw();

        app._input(TEST.keypress('T'));
        app._input(TEST.keypress('a'));
        app._input(TEST.keypress('c'));
        app._input(TEST.keypress('o'));
        app._input(TEST.keypress('s'));

        app._draw();
        // buffer.dump();
        expect(TEST.extractBufferText(buffer, 10, 13)).toEqual(
            '+--------------------------+'
        );
        expect(TEST.extractBufferText(buffer, 10, 14)).toEqual(
            '| What do you want to eat? |'
        );
        expect(TEST.extractBufferText(buffer, 10, 15)).toEqual(
            '| Tacos                    |'
        );
        expect(TEST.extractBufferText(buffer, 10, 16)).toEqual(
            '+--------------------------+'
        );

        app._input(TEST.keypress('Enter'));

        expect(await r).toEqual('Tacos');
    });

    test('async cancel', async () => {
        scene.build.pos(10, 10).text('testing testing testing');

        const r = app.prompt('What do you want to eat?');

        app._draw();

        app._input(TEST.keypress('T'));
        app._input(TEST.keypress('a'));
        app._input(TEST.keypress('c'));
        app._input(TEST.keypress('o'));
        app._input(TEST.keypress('s'));

        app._draw();
        // buffer.dump();
        expect(TEST.extractBufferText(buffer, 10, 13)).toEqual(
            '+--------------------------+'
        );
        expect(TEST.extractBufferText(buffer, 10, 14)).toEqual(
            '| What do you want to eat? |'
        );
        expect(TEST.extractBufferText(buffer, 10, 15)).toEqual(
            '| Tacos                    |'
        );
        expect(TEST.extractBufferText(buffer, 10, 16)).toEqual(
            '+--------------------------+'
        );

        app._input(TEST.keypress('Escape'));

        expect(await r).toEqual(null);
    });

    test('label', async () => {
        scene.build.pos(10, 10).text('testing testing testing');

        const r = app.prompt('What do you want to eat?', { label: 'Food:' });

        app._draw();

        app._input(TEST.keypress('T'));
        app._input(TEST.keypress('a'));
        app._input(TEST.keypress('c'));
        app._input(TEST.keypress('o'));
        app._input(TEST.keypress('s'));

        app._draw();
        // buffer.dump();
        expect(TEST.extractBufferText(buffer, 10, 13)).toEqual(
            '+--------------------------+'
        );
        expect(TEST.extractBufferText(buffer, 10, 14)).toEqual(
            '| What do you want to eat? |'
        );
        expect(TEST.extractBufferText(buffer, 10, 15)).toEqual(
            '| Food: Tacos              |'
        );
        expect(TEST.extractBufferText(buffer, 10, 16)).toEqual(
            '+--------------------------+'
        );

        app._input(TEST.keypress('Enter'));

        expect(await r).toEqual('Tacos');
    });

    test('done text', async () => {
        scene.build.pos(10, 10).text('testing testing testing');

        const doneFn = jest.fn();

        app.prompt('What do you want to eat?', { done: doneFn });

        app._draw();

        app._input(TEST.keypress('T'));
        app._input(TEST.keypress('a'));
        app._input(TEST.keypress('c'));
        app._input(TEST.keypress('o'));
        app._input(TEST.keypress('s'));

        app._draw();
        // buffer.dump();
        expect(TEST.extractBufferText(buffer, 10, 13)).toEqual(
            '+--------------------------+'
        );
        expect(TEST.extractBufferText(buffer, 10, 14)).toEqual(
            '| What do you want to eat? |'
        );
        expect(TEST.extractBufferText(buffer, 10, 15)).toEqual(
            '| Tacos                    |'
        );
        expect(TEST.extractBufferText(buffer, 10, 16)).toEqual(
            '+--------------------------+'
        );

        app._input(TEST.keypress('Enter'));

        expect(doneFn).toHaveBeenCalledWith('Tacos');
    });

    test('done cancel', async () => {
        scene.build.pos(10, 10).text('testing testing testing');

        const doneFn = jest.fn();

        app.prompt('What do you want to eat?', { done: doneFn });

        expect(app.scene).not.toBe(scene);

        app._draw();

        app._input(TEST.keypress('T'));
        app._input(TEST.keypress('a'));
        app._input(TEST.keypress('c'));
        app._input(TEST.keypress('o'));
        app._input(TEST.keypress('s'));

        app._draw();
        // buffer.dump();
        expect(TEST.extractBufferText(buffer, 10, 13)).toEqual(
            '+--------------------------+'
        );
        expect(TEST.extractBufferText(buffer, 10, 14)).toEqual(
            '| What do you want to eat? |'
        );
        expect(TEST.extractBufferText(buffer, 10, 15)).toEqual(
            '| Tacos                    |'
        );
        expect(TEST.extractBufferText(buffer, 10, 16)).toEqual(
            '+--------------------------+'
        );

        app._input(TEST.keypress('Escape'));

        expect(doneFn).toHaveBeenCalledWith(null);
    });
});
