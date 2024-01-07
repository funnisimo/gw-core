import 'jest-extended';
import * as GW from './index';

describe('GW', () => {
    test('exports', () => {
        expect(GW.NOOP).toBeDefined();
        expect(GW.range).toBeDefined();
        expect(GW.flag).toBeDefined();
        expect(GW.grid).toBeDefined();
        // expect(GW.io).toBeDefined();
        expect(GW.fov).toBeDefined();
        expect(GW.path).toBeDefined();
        // expect(GW.events).toBeDefined();
        expect(GW.frequency).toBeDefined();
        expect(GW.scheduler).toBeDefined();
        expect(GW.canvas).toBeDefined();
        expect(GW.color).toBeDefined();
        expect(GW.sprite).toBeDefined();
        expect(GW.text).toBeDefined();
        expect(GW.types).toBeDefined();
        expect(GW.message).toBeDefined();
        expect(GW.rng).toBeDefined();
        expect(GW.rng.random).toBeDefined();
        expect(GW.data).toBeObject();
        expect(GW.colors).toBeObject();
        // expect(GW.sprites).toBeObject();
    });
});
