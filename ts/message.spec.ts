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

    test('match', () => {
        const match = jest.fn().mockReturnValue(true);
        const handler = new MSG.MessageCache({ match });
        expect(handler.length).toEqual(0);

        expect(count(handler)).toEqual(0);
        MSG.add('test');
        expect(count(handler)).toEqual(1);
        expect(match).toHaveBeenCalledWith(-1, -1);

        match.mockClear();
        MSG.addAt(4, 3, 'test');
        expect(count(handler)).toEqual(2);
        expect(match).toHaveBeenCalledWith(4, 3);

        match.mockClear();
        MSG.addCombat(3, 1, 'test');
        expect(count(handler)).toEqual(3);
        expect(match).toHaveBeenCalledWith(3, 1);

        match.mockReturnValue(false);
        match.mockClear();
        MSG.add('test');
        expect(count(handler)).toEqual(3); // not added
        expect(match).toHaveBeenCalledWith(-1, -1);

        match.mockClear();
        MSG.addAt(4, 3, 'test');
        expect(count(handler)).toEqual(3);
        expect(match).toHaveBeenCalledWith(4, 3);

        match.mockClear();
        MSG.addCombat(3, 1, 'test');
        expect(count(handler)).toEqual(3);
        expect(match).toHaveBeenCalledWith(3, 1);

        expect(handler.length).toEqual(3);
    });
});
