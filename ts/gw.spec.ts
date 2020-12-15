
import 'jest-extended';
import * as GW from './gw';


describe('GW', () => {

    test('exports', () => {
        expect(GW.random).toBeDefined();
        expect(GW.cosmetic).toBeDefined();
        expect(GW.grid).toBeDefined();
        expect(GW.range).toBeDefined();
        expect(GW.flag).toBeDefined();
        expect(GW.data).toBeObject();
    });

});
