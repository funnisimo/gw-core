import '../../test/matchers';

import * as Path from './dijkstra';

describe('Path', () => {
    test('scan with empty', () => {
        function costFn(_x: number, _y: number) {
            return Path.OK;
        }

        const dm = new Path.DijkstraMap(10, 10);
        dm.setGoal(4, 4);

        expect(dm._todo).toEqual([{ x: 4, y: 4, cost: 0 }]);

        dm.calculate(costFn);

        const distGrid = dm._data;

        expect(distGrid[4][4]).toEqual(0);
        expect(distGrid[4][5]).toEqual(1);
        expect(distGrid[5][5]).toFloatEqual(1.4); // diagonals cost sqrt(2)
        expect(distGrid[4][8]).toEqual(4);
        expect(distGrid[8][4]).toEqual(4);
        expect(distGrid[4][1]).toFloatEqual(3); // can cut corners around blocked
        expect(distGrid[4][9]).toEqual(5);
    });

    test('scan with blocked', () => {
        function costFn(x: number, y: number) {
            if (y != 2) return Path.OK;
            if (x >= 3 && x <= 6) return Path.BLOCKED;
            return Path.OK;
        }

        const dm = new Path.DijkstraMap(10, 10);
        dm.setGoal(4, 4);

        expect(dm._todo).toEqual([{ x: 4, y: 4, cost: 0 }]);

        dm.calculate(costFn);

        const distGrid = dm._data;

        expect(distGrid[4][4]).toEqual(0);
        expect(distGrid[4][5]).toEqual(1);
        expect(distGrid[5][5]).toFloatEqual(1.4); // diagonals cost sqrt(2)
        expect(distGrid[4][8]).toEqual(4);
        expect(distGrid[8][4]).toEqual(4);
        expect(distGrid[4][1]).toFloatEqual(5.2); // can cut corners around blocked
        expect(distGrid[4][9]).toEqual(5);
    });

    test('scan with obstruction', () => {
        function costFn(x: number, y: number) {
            if (y != 2) return Path.OK;
            if (x >= 3 && x <= 6) return Path.OBSTRUCTION;
            return Path.OK;
        }

        const dm = new Path.DijkstraMap(10, 10);
        dm.setGoal(4, 4);
        expect(dm._todo).toEqual([{ x: 4, y: 4, cost: 0 }]);

        dm.calculate(costFn);

        const distGrid = dm._data;

        expect(distGrid[4][4]).toEqual(0);
        expect(distGrid[4][5]).toEqual(1);
        expect(distGrid[5][5]).toFloatEqual(1.4); // diagonals cost sqrt(2)
        expect(distGrid[4][8]).toEqual(4);
        expect(distGrid[8][4]).toEqual(4);
        expect(distGrid[4][1]).toFloatEqual(6.4); // have to go around obstructions
        expect(distGrid[4][9]).toEqual(5);
    });

    test('gets path - around obstructions', () => {
        function costFn(x: number, y: number) {
            if (y != 2) return Path.OK;
            if (x >= 3 && x <= 6) return Path.OBSTRUCTION;
            return Path.OK;
        }

        function blockedFn() {
            return false;
        }

        const dm = new Path.DijkstraMap(10, 10);
        dm.setGoal(4, 4);
        expect(dm._todo).toEqual([{ x: 4, y: 4, cost: 0 }]);

        dm.calculate(costFn);

        expect(dm.getPath(4, 1, blockedFn)).toEqual([
            [4, 1],
            [3, 1],
            [2, 1],
            [2, 2],
            [2, 3],
            [3, 4],
            [4, 4],
        ]);
    });
});
