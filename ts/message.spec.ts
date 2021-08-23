import * as MSG from './message';

describe('message', () => {
    function count(handler: MSG.MessageCache) {
        let c = 0;
        handler.forEach(() => ++c);
        return c;
    }

    test('add', () => {
        const handler = new MSG.MessageCache();
        expect(count(handler)).toEqual(0);
        MSG.add('test');
        expect(count(handler)).toEqual(1);
    });
});
