import * as UTILS from '../../test/utils';
// import * as GWU from 'gw-utils';
import * as IO from '../io';

import * as Checkbox from './checkbox';
import * as Layer from './layer';

describe('Checkbox Widget', () => {
    let layer: Layer.WidgetLayer;

    beforeEach(() => {
        layer = UTILS.mockWidgetLayer(50, 30);
    });

    afterEach(() => {
        layer.finish();
    });

    test('create obj', () => {
        const e = new Checkbox.Checkbox(layer, { text: 'checkbox' });
        expect(e.tag).toEqual('checkbox');
        expect(e.attr('value')).toEqual('on');
        expect(e.attr('check')).toEqual('\u2612');
        expect(e.attr('uncheck')).toEqual('\u2610');
    });

    test('keypress', async () => {
        const el = new Checkbox.Checkbox(layer, { text: 'checkbox' });
        jest.spyOn(el, '_fireEvent');

        expect(el.prop('checked')).toBeFalsy();
        await el.keypress(UTILS.keypress(' '));
        expect(el._fireEvent).toHaveBeenCalledWith(
            'input',
            el,
            expect.any(IO.Event)
        );
        expect(el._fireEvent).not.toHaveBeenCalledWith(
            'change',
            el,
            expect.any(IO.Event)
        );
        expect(el.prop('checked')).toBeTruthy();

        // @ts-ignore
        el._fireEvent.mockClear();
        await el.keypress(UTILS.keypress(' '));
        expect(el._fireEvent).toHaveBeenCalledWith(
            'input',
            el,
            expect.any(IO.Event)
        );
        expect(el._fireEvent).not.toHaveBeenCalledWith(
            'change',
            el,
            expect.any(IO.Event)
        );
        expect(el.prop('checked')).toBeFalsy();
    });

    test('click', async () => {
        const el = new Checkbox.Checkbox(layer, { text: 'checkbox' });
        jest.spyOn(el, '_fireEvent');

        expect(el.contains(0, 0)).toBeTruthy();

        expect(el.prop('checked')).toBeFalsy();
        await el.click(UTILS.click(0, 0));
        expect(el._fireEvent).toHaveBeenCalledWith(
            'input',
            el,
            expect.any(IO.Event)
        );
        expect(el._fireEvent).not.toHaveBeenCalledWith(
            'change',
            el,
            expect.any(IO.Event)
        );
        expect(el.focused).toBeTruthy();
        expect(layer._focusWidget).toBe(el);
        expect(el.prop('checked')).toBeTruthy();

        // @ts-ignore
        el._fireEvent.mockClear();
        await el.click(UTILS.click(0, 0));
        expect(el._fireEvent).toHaveBeenCalledWith(
            'input',
            el,
            expect.any(IO.Event)
        );
        expect(el._fireEvent).not.toHaveBeenCalledWith(
            'change',
            el,
            expect.any(IO.Event)
        );
        expect(el.prop('checked')).toBeFalsy();
    });
});
