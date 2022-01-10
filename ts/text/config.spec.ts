import 'jest-extended';
import * as Config from './config';

describe('Config', () => {
    const THIS = {
        get: jest.fn(),
    };

    it('will add helpers', () => {
        expect(Config.helpers).toBeObject();

        const fn = jest.fn();
        Config.addHelper('test', fn);
        expect(Config.helpers.test).toBe(fn);
    });

    test('default helper', () => {
        expect(Config.helpers.default).toBeFunction();
        expect(Config.helpers.default.call(THIS, 'test', {}, [])).toEqual(
            'test'
        );
    });

    test('debug helper', () => {
        expect(Config.helpers.debug).toBeFunction();
        expect(Config.helpers.debug.call(THIS, 'test', {}, [])).toEqual(
            '{{test}}'
        );
    });
});
