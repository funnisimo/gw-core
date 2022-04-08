import * as GRID from '../grid';
import * as XY from '../xy';
import { Loc } from './astar';
import * as UTILS from '../utils';

export type SimpleCostFn = (x: number, y: number) => number;
export type UpdateFn = GRID.GridUpdate<number>;

const DIRS = XY.DIRS;

export const OK = 1;
export const AVOIDED = 10;
export const BLOCKED = 10000;
export const OBSTRUCTION = 20000; // Blocks Diagonal
export const NOT_DONE = 30000;

interface Item {
    x: number;
    y: number;
    cost: number;
}

export class DijkstraMap {
    _data: GRID.NumGrid;
    _todo: Item[] = [];
    _maxDistance = 999;

    constructor(grid: GRID.NumGrid);
    constructor(width: number, height: number);
    constructor(...args: any[]) {
        if (args.length === 1) {
            this._data = args[0];
            this.clear();
        } else {
            this._data = GRID.alloc(args[0], args[1], NOT_DONE);
        }
    }

    free() {
        GRID.free(this._data);
        // @ts-ignore
        this._data = null;
    }

    get width() {
        return this._data.width;
    }
    get height() {
        return this._data.height;
    }

    hasXY(x: number, y: number): boolean {
        return this._data.hasXY(x, y);
    }

    clear(maxDistance = 999) {
        this._data.fill(NOT_DONE);
        this._maxDistance = maxDistance;
        this._todo.length = 0;
    }

    setGoal(xy: Loc, cost?: number): void;
    setGoal(x: number, y: number, cost?: number): void;
    setGoal(...args: any[]): void {
        if (typeof args[0] === 'number') {
            this._add(args[0], args[1], args[2] || 0);
        } else {
            this._add(XY.x(args[0]), XY.y(args[0]), args[1] || 0);
        }
    }

    _add(x: number, y: number, cost: number) {
        if (!this._data.hasXY(x, y)) return;

        const current = this._data[x][y];
        if (current < cost) return;

        if (cost >= OBSTRUCTION) {
            this._data[x][y] = OBSTRUCTION;
            return;
        } else if (cost >= BLOCKED) {
            this._data[x][y] = BLOCKED;
            return;
        } else if (cost > this._maxDistance) return;

        this._data[x][y] = cost;

        let newItem = {
            x,
            y,
            cost,
        } as Item;

        const existing = this._todo.findIndex((i) => XY.equals(i, newItem));
        if (existing > -1) {
            const oldItem = this._todo[existing];
            if (oldItem.cost <= cost) {
                return;
            }
            this._todo.splice(existing, 1); // this one is better
        }

        /* insert by distance */
        const higher = this._todo.findIndex((i) => i.cost > cost);
        if (higher > -1) {
            this._todo.splice(higher, 0, newItem);
        } else {
            this._todo.push(newItem);
        }
    }

    calculate(costFn: SimpleCostFn, only4dirs = false) {
        let item: Item | null = null;
        while (this._todo.length) {
            item = this._todo.shift() || null;
            if (!item) break;

            XY.eachNeighbor(
                item.x,
                item.y,
                (x, y, dir) => {
                    let mult = 1;
                    if (XY.isDiagonal(dir)) {
                        mult = 1.4;
                        // check to see if obstruction blocks this move
                        if (
                            costFn(x, item!.y) >= OBSTRUCTION ||
                            costFn(item!.x, y) >= OBSTRUCTION
                        ) {
                            return;
                        }
                    }
                    const cost = costFn(x, y) * mult;
                    this._add(x, y, item!.cost + cost);
                },
                only4dirs
            );
        }
    }

    getDistance(x: number, y: number): number {
        return this._data[x][y];
    }

    nextStep(
        fromX: number,
        fromY: number,
        isBlocked: XY.XYMatchFunc,
        only4dirs = false
    ): XY.Loc | null {
        let newX, newY, bestScore;
        let index;

        // brogueAssert(coordinatesAreInMap(x, y));

        bestScore = 0;
        let bestDir = XY.NO_DIRECTION;

        const dist = this._data[fromX][fromY];
        for (index = 0; index < (only4dirs ? 4 : 8); ++index) {
            const dir = DIRS[index];
            newX = fromX + dir[0];
            newY = fromY + dir[1];
            if (!this._data.hasXY(newX, newY)) continue;

            if (XY.isDiagonal(dir)) {
                if (
                    this._data[newX][fromY] >= OBSTRUCTION ||
                    this._data[fromX][newY] >= OBSTRUCTION
                ) {
                    continue; // diagonal blocked
                }
            }
            const newDist = this._data[newX][newY];
            if (newDist < dist) {
                const diff = dist - newDist;
                if (
                    diff > bestScore &&
                    (newDist === 0 || !isBlocked(newX, newY))
                ) {
                    bestDir = index;
                    bestScore = diff;
                }
            }
        }
        return DIRS[bestDir] || null;
    }

    getPath(
        fromX: number,
        fromY: number,
        isBlocked: XY.XYMatchFunc,
        only4dirs = false
    ): XY.Loc[] | null {
        const path: XY.Loc[] = [];

        this.forPath(
            fromX,
            fromY,
            isBlocked,
            (x, y) => {
                path.push([x, y]);
            },
            only4dirs
        );

        return path.length ? path : null;
    }

    // Populates path[][] with a list of coordinates starting at origin and traversing down the map. Returns the path.
    forPath(
        fromX: number,
        fromY: number,
        isBlocked: XY.XYMatchFunc,
        pathFn: XY.XYFunc,
        only4dirs = false
    ): number {
        // actor = actor || GW.PLAYER;
        let x = fromX;
        let y = fromY;

        let dist = this._data.get(x, y) || 0;
        let count = 0;

        if (dist === 0) {
            pathFn(x, y);
            return count;
        }

        if (dist >= BLOCKED) {
            const loc = this._data.closestMatchingLoc(x, y, (v) => {
                return v < BLOCKED;
            });
            if (!loc || loc[0] < 0) return 0;
            x = loc[0];
            y = loc[1];
            pathFn(x, y);
            ++count;
        }

        let dir;
        do {
            dir = this.nextStep(x, y, isBlocked, only4dirs);
            if (dir) {
                pathFn(x, y);
                ++count;
                x += dir[0];
                y += dir[1];
                // path[steps][0] = x;
                // path[steps][1] = y;
                // brogueAssert(coordinatesAreInMap(x, y));
            }
        } while (dir);

        pathFn(x, y);
        return count;
    }

    // allows you to transform the data - for flee calcs, etc...
    update(fn: UpdateFn) {
        this._data.update(fn);
    }
}

export function computeDistances(
    grid: GRID.NumGrid,
    from: Loc,
    costFn: SimpleCostFn = UTILS.ONE,
    only4dirs = false
): void {
    const dm = new DijkstraMap(grid);
    dm.clear();
    dm.setGoal(from);
    dm.calculate(costFn, only4dirs);
}
