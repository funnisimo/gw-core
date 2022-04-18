import '../../test/matchers';

import * as DIJKSTRA from './dijkstra';
import * as XY from '../xy';
// import * as UTILS from '../utils';

describe('Path', () => {
    test('scan with empty', () => {
        function costFn(_x: number, _y: number) {
            return DIJKSTRA.OK;
        }

        const dm = new DIJKSTRA.DijkstraMap();
        dm.reset(10, 10);
        dm.setGoal(4, 4);

        expect(dm._todo.next).toMatchObject({
            x: 4,
            y: 4,
            distance: 0,
            next: null,
        });

        dm.calculate(costFn);

        expect(dm.getDistance(4, 4)).toEqual(0);
        expect(dm.getDistance(4, 5)).toEqual(1);
        expect(dm.getDistance(5, 5)).toFloatEqual(1.4); // diagonals cost sqrt(2)
        expect(dm.getDistance(4, 8)).toEqual(4);
        expect(dm.getDistance(8, 4)).toEqual(4);
        expect(dm.getDistance(4, 1)).toFloatEqual(3); // can cut corners around blocked
        expect(dm.getDistance(4, 9)).toEqual(5);
    });

    test('scan with blocked', () => {
        function costFn(x: number, y: number) {
            if (y != 2) return DIJKSTRA.OK;
            if (x >= 3 && x <= 6) return DIJKSTRA.BLOCKED;
            return DIJKSTRA.OK;
        }

        const dm = new DIJKSTRA.DijkstraMap();
        dm.reset(10, 10);
        dm.setGoal(4, 4);

        expect(dm._todo.next).toMatchObject({
            x: 4,
            y: 4,
            distance: 0,
            next: null,
        });

        dm.calculate(costFn);

        // dm.dump();

        expect(dm.getDistance(4, 4)).toEqual(0);
        expect(dm.getDistance(4, 5)).toEqual(1);
        expect(dm.getDistance(5, 5)).toFloatEqual(1.4); // diagonals cost sqrt(2)
        expect(dm.getDistance(4, 8)).toEqual(4);
        expect(dm.getDistance(8, 4)).toEqual(4);
        expect(dm.getDistance(4, 1)).toFloatEqual(5.2); // can cut corners around blocked
        expect(dm.getDistance(4, 9)).toEqual(5);
    });

    test('scan with obstruction', () => {
        function costFn(x: number, y: number) {
            if (y != 2) return DIJKSTRA.OK;
            if (x >= 3 && x <= 6) return DIJKSTRA.OBSTRUCTION;
            return DIJKSTRA.OK;
        }

        const dm = new DIJKSTRA.DijkstraMap();
        dm.reset(10, 10);
        dm.setGoal(4, 4);
        expect(dm._todo.next).toMatchObject({
            x: 4,
            y: 4,
            distance: 0,
            next: null,
        });

        dm.calculate(costFn);

        expect(dm.getDistance(4, 4)).toEqual(0);
        expect(dm.getDistance(4, 5)).toEqual(1);
        expect(dm.getDistance(5, 5)).toFloatEqual(1.4); // diagonals cost sqrt(2)
        expect(dm.getDistance(4, 8)).toEqual(4);
        expect(dm.getDistance(8, 4)).toEqual(4);
        expect(dm.getDistance(4, 1)).toFloatEqual(6.4); // have to go around obstructions
        expect(dm.getDistance(4, 9)).toEqual(5);
    });

    test('gets path - around obstructions', () => {
        function costFn(x: number, y: number) {
            if (y != 2) return DIJKSTRA.OK;
            if (x >= 3 && x <= 6) return DIJKSTRA.OBSTRUCTION;
            return DIJKSTRA.OK;
        }

        function blockedFn() {
            return false;
        }

        const dm = new DIJKSTRA.DijkstraMap();
        dm.reset(10, 10);
        dm.setGoal(4, 4);
        expect(dm._todo.next).toMatchObject({
            x: 4,
            y: 4,
            distance: 0,
            next: null,
        });

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

    test('rescan to create map to safety', () => {
        const obstacles: XY.Loc[] = [];
        const blocked: XY.Loc[] = [];
        const actors: XY.Loc[] = [];

        function getCost(x: number, y: number): number {
            const ob = obstacles.findIndex((o) => o[0] == x && o[1] == y);
            if (ob >= 0) return DIJKSTRA.OBSTRUCTION;
            const bl = blocked.findIndex((b) => b[0] == x && b[1] == y);
            if (bl >= 0) return DIJKSTRA.BLOCKED;
            const ac = actors.findIndex((a) => a[0] == x && a[1] == y);
            if (ac >= 0) return DIJKSTRA.AVOIDED;
            return DIJKSTRA.OK;
        }

        function isBlocked(x: number, y: number): boolean {
            return actors.findIndex((a) => a[0] == x && a[1] == y) >= 0;
        }

        actors.push([4, 4]); // our player

        const dm = new DIJKSTRA.DijkstraMap();
        dm.reset(10, 10);
        dm.setGoal(4, 4);
        dm.calculate(getCost);

        // dm.dump();

        dm.update((v) => -1.2 * v);
        dm.rescan(getCost);

        // dm.dump();

        expect(dm.nextDir(2, 4, isBlocked)).toEqual([-1, 1]);
        expect(dm.nextDir(4, 2, isBlocked)).toEqual([1, -1]);
        expect(dm.nextDir(6, 7, isBlocked)).toEqual([1, 1]);
        expect(dm.nextDir(9, 9, isBlocked)).toBeNull();
    });

    test('rescan to create map to safety', () => {
        const obstacles: XY.Loc[] = [
            [5, 0],
            [5, 1],
            [5, 2],
            [5, 3],
            [5, 4],
            [5, 5],
            [4, 5],
            [3, 5],
            [2, 5],
        ];
        const blocked: XY.Loc[] = [];
        const actors: XY.Loc[] = [];

        function getCost(x: number, y: number): number {
            const ob = obstacles.findIndex((o) => o[0] == x && o[1] == y);
            if (ob >= 0) return DIJKSTRA.OBSTRUCTION;
            const bl = blocked.findIndex((b) => b[0] == x && b[1] == y);
            if (bl >= 0) return DIJKSTRA.BLOCKED;
            const ac = actors.findIndex((a) => a[0] == x && a[1] == y);
            if (ac >= 0) return DIJKSTRA.AVOIDED;
            return DIJKSTRA.OK;
        }

        function isBlocked(x: number, y: number): boolean {
            return actors.findIndex((a) => a[0] == x && a[1] == y) >= 0;
        }

        actors.push([4, 4]); // our player

        const dm = new DIJKSTRA.DijkstraMap();
        dm.reset(10, 10);
        dm.setGoal(4, 4);
        dm.calculate(getCost);

        // dm.dump();

        dm.update((v) => (v >= DIJKSTRA.BLOCKED ? v : -1.2 * v));
        dm.rescan(getCost);

        // dm.dump();

        expect(dm.nextDir(2, 4, isBlocked)).toEqual([-1, 0]); // goto 1,4
        expect(dm.nextDir(1, 4, isBlocked)).toEqual([0, 1]); // goto 1,5
        expect(dm.nextDir(6, 7, isBlocked)).toEqual([1, 1]); // goto 7,8
        expect(dm.nextDir(9, 9, isBlocked)).toBeNull();
    });

    // test('obstacle', () => {
    //     const dm = new DIJKSTRA.DijkstraMap();
    //     dm.reset(10, 10);
    //     dm.setGoal(4, 4);
    //     dm.calculate(UTILS.ONE);
    //     expect(dm.getDistance(7, 7)).toFloatEqual(4.2);
    //     expect(dm.getDistance(8, 7)).toFloatEqual(5.2);

    //     dm.addObstacle(7, 7, UTILS.ONE, 2);
    //     // dm.dump();
    //     expect(dm.getDistance(7, 7)).toFloatEqual(6.2); // +2
    //     expect(dm.getDistance(8, 7)).toFloatEqual(6.2); // +1
    // });
});
