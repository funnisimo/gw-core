import '../../test/matchers';

import * as UTILS from '../../test/utils';
// import * as GWU from 'gw-utils';
import * as Buffer from '../buffer';
import * as Color from '../color';

import * as Button from './button';
import * as Layer from './layer';

describe('Button Widget', () => {
    let layer: Layer.WidgetLayer;

    beforeEach(() => {
        layer = UTILS.mockWidgetLayer(50, 30);
    });

    test('create', () => {
        let widget = new Button.Button(layer, { id: 'ID', text: 'Button' });
        expect(widget.bounds.x).toEqual(0);
        expect(widget.bounds.y).toEqual(0);
        expect(widget.bounds.width).toEqual(6);
        expect(widget.bounds.height).toEqual(1);
        expect(widget.text()).toEqual('Button');

        widget.bounds.x = widget.bounds.y = 0;

        const buffer = new Buffer.Buffer(40, 40);
        widget.draw(buffer);
        expect(UTILS.getBufferText(buffer, 0, 0, 10)).toEqual('Button');
        expect(buffer.info(0, 0).fg).toEqual(Color.colors.white);
        expect(buffer.info(0, 0).bg).toEqual(Color.colors.black);
    });

    test('hover', () => {
        let widget = new Button.Button(layer, {
            id: 'ID',
            text: 'Button',
            fg: 'red',
            bg: 'gray',
            x: 0,
            y: 0,
        });
        expect(widget.bounds.x).toEqual(0);
        expect(widget.bounds.y).toEqual(0);
        expect(widget.bounds.width).toEqual(6);
        expect(widget.bounds.height).toEqual(1);

        const buffer = new Buffer.Buffer(40, 40);
        widget.draw(buffer);
        expect(UTILS.getBufferText(buffer, 0, 0, 10)).toEqual('Button');
        expect(buffer.info(0, 0).fg).toEqual(Color.colors.red);
        expect(buffer.info(0, 0).bg).toEqual(Color.colors.gray);

        widget.mouseenter(UTILS.mousemove(0, 0), widget);
        widget.mousemove(UTILS.mousemove(0, 0));
        expect(widget.hovered).toBeTruthy();
        widget.draw(buffer);
        expect(UTILS.getBufferText(buffer, 0, 0, 10)).toEqual('Button');
        expect(buffer.info(0, 0).fg).toEqual(Color.colors.red);
        expect(buffer.info(0, 0).bg).toEqual(Color.colors.gray);

        widget.mouseleave(UTILS.mousemove(10, 10));
        expect(widget.hovered).toBeFalsy();
        widget.draw(buffer);
        expect(UTILS.getBufferText(buffer, 0, 0, 10)).toEqual('Button');
        expect(buffer.info(0, 0).fg).toEqual(Color.colors.red);
        expect(buffer.info(0, 0).bg).toEqual(Color.colors.gray);
    });

    test('hover - wide + tall', () => {
        let widget = new Button.Button(layer, {
            id: 'ID',
            text: 'Button',
            fg: 'red',
            bg: 'gray',
            width: 10,
            height: 2,
            x: 0,
            y: 0,
        });

        const buffer = new Buffer.Buffer(40, 40);
        widget.draw(buffer);
        expect(UTILS.getBufferText(buffer, 0, 0, 10)).toEqual('Button');
        expect(buffer.info(0, 0).fg).toEqual(Color.colors.red.toInt());
        expect(buffer.info(0, 0).bg).toEqual(Color.colors.gray.toInt());
        expect(buffer.info(0, 1).bg).toEqual(Color.colors.gray.toInt());

        widget.mouseenter(UTILS.mousemove(0, 0), widget);
        widget.mousemove(UTILS.mousemove(0, 0));
        expect(widget.hovered).toBeTruthy();
        widget.draw(buffer);
        expect(UTILS.getBufferText(buffer, 0, 0, 10)).toEqual('Button');
        expect(buffer.info(0, 0).fg).toEqual(Color.colors.red.toInt());
        expect(buffer.info(0, 0).bg).toEqual(Color.colors.gray.toInt());
        expect(buffer.info(0, 1).bg).toEqual(Color.colors.gray.toInt());

        widget.mouseleave(UTILS.mousemove(10, 10));
        expect(widget.hovered).toBeFalsy();
        widget.draw(buffer);
        expect(UTILS.getBufferText(buffer, 0, 0, 10)).toEqual('Button');
        expect(buffer.info(0, 0).fg).toEqual(Color.colors.red.toInt());
        expect(buffer.info(0, 0).bg).toEqual(Color.colors.gray.toInt());
        expect(buffer.info(0, 1).bg).toEqual(Color.colors.gray.toInt());
    });

    test('Enter', async () => {
        let widget = new Button.Button(layer, {
            id: 'ID',
            width: 10,
            text: 'Test',
            x: 0,
            y: 0,
        });

        // @ts-ignore
        jest.spyOn(widget, '_fireEvent');

        expect(widget.keypress(UTILS.keypress('Enter'))).toBeTruthy();
        // @ts-ignore
        expect(widget._fireEvent).toHaveBeenCalledWith('ID', widget, undefined);

        // @ts-ignore
        widget._fireEvent.mockClear();
        // @ts-ignore
        widget._fireEvent.mockReturnValue(false);

        expect(await widget.keypress(UTILS.keypress('Enter'))).toBeTruthy();
        expect(widget._fireEvent).toHaveBeenCalledWith('ID', widget, undefined);

        // @ts-ignore
        widget._fireEvent.mockClear();
        // @ts-ignore
        widget._fireEvent.mockReturnValue(false);

        widget = new Button.Button(layer, {
            id: 'ID',
            width: 10,
            text: 'Test',
            action: 'DONE',
        });

        // @ts-ignore
        jest.spyOn(widget, '_fireEvent');

        expect(await widget.keypress(UTILS.keypress('Enter'))).toBeTruthy();
        expect(widget._fireEvent).toHaveBeenCalledWith(
            'DONE',
            widget,
            undefined
        );
    });

    test('Click', async () => {
        let widget = new Button.Button(layer, {
            id: 'ID',
            width: 10,
            text: 'Test',
            x: 0,
            y: 0,
        });

        jest.spyOn(widget, '_fireEvent');

        expect(await widget.keypress(UTILS.keypress('Enter'))).toBeTruthy();
        expect(widget._fireEvent).toHaveBeenCalledWith('ID', widget, undefined);

        // @ts-ignore
        widget._fireEvent.mockClear();
        // @ts-ignore
        widget._fireEvent.mockReturnValue(false);

        expect(await widget.click(UTILS.click(0, 0))).toBeFalsy();
        // @ts-ignore
        expect(widget._fireEvent).toHaveBeenCalledWith('ID', widget, undefined);

        // @ts-ignore
        widget._fireEvent.mockClear();
        // @ts-ignore
        widget._fireEvent.mockReturnValue(false);

        widget = new Button.Button(layer, {
            id: 'ID',
            width: 10,
            text: 'Test',
            action: 'DONE',
            x: 0,
            y: 0,
        });
        jest.spyOn(widget, '_fireEvent');

        expect(await widget.click(UTILS.click(0, 0))).toBeFalsy();
        expect(widget._fireEvent).toHaveBeenCalledWith(
            'DONE',
            widget,
            undefined
        );
    });
});