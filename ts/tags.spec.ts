import * as TAGS from './tags';

describe('tags', () => {
    test('make', () => {
        expect(TAGS.make('taco')).toEqual(['taco']);
        expect(TAGS.make('taco, food')).toEqual(['taco', 'food']);
        expect(TAGS.make('taco|food|cheesy')).toEqual([
            'taco',
            'food',
            'cheesy',
        ]);
    });

    test('match', () => {
        const tags = ['taco', 'food', 'cheesy'];

        expect(TAGS.match(tags, 'taco')).toBeTruthy();
        expect(TAGS.match(tags, '!taco')).toBeFalsy();
        expect(TAGS.match(tags, '!pudding')).toBeTruthy();
        expect(TAGS.match(tags, 'taco & !pudding')).toBeTruthy();
        expect(TAGS.match(tags, 'taco & !food')).toBeFalsy();
        expect(TAGS.match(tags, 'taco | !food')).toBeTruthy();
        expect(TAGS.match(tags, 'taco, !food')).toBeTruthy();
    });
});
