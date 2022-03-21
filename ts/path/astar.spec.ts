import * as ASTAR from './astar';

describe('AStar', () => {
    test('easy', () => {
        expect(ASTAR.fromTo([0, 0], [0, 5])).toEqual([
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 3],
            [0, 4],
            [0, 5],
        ]);
    });
});
