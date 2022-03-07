import * as MSG from './message';

describe('message', () => {
    test('add', () => {
        const handler = new MSG.Cache();
        expect(handler.length).toEqual(0);
        handler.add('test');
        expect(handler.length).toEqual(1);
    });
});
