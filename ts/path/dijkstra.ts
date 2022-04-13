import * as DIJKSTRA from '../grid';
import * as XY from '../xy';
import * as UTILS from '../utils';

export type SimpleCostFn = (x: number, y: number) => number;
export type UpdateFn = (value: number, x: number, y: number) => number;
export type EachFn = (value: number, x: number, y: number) => void;

const DIRS = XY.DIRS;

export const OK = 1;
export const AVOIDED = 10;
export const BLOCKED = 10000;
export const OBSTRUCTION = 20000; // Blocks Diagonal
export const NOT_DONE = 30000;

interface Item {
    x: number;
    y: number;
    distance: number;
    next: Item | null;
    prev: Item | null;
}

function makeItem(x: number, y: number, distance = NOT_DONE): Item {
    return {
        x,
        y,
        distance,
        next: null,
        prev: null,
    };
}

export class DijkstraMap {
    _data: Item[] = [];
    _todo: Item = makeItem(-1, -1);
    _width = 0;
    _height = 0;

    constructor();
    constructor(width: number, height: number);
    constructor(width?: number, height?: number) {
        if (width !== undefined && height !== undefined) {
            this.reset(width, height);
        }
    }

    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }

    copy(other: DijkstraMap) {
        this.reset(other.width, other.height);
        const max = other.width * other.height;
        for (let index = 0; index < max; ++index) {
            this._data[index].distance = other._data[index].distance;
        }
    }

    hasXY(x: number, y: number): boolean {
        return x >= 0 && x < this._width && y >= 0 && y < this._height;
    }

    reset(width: number, height: number, distance = NOT_DONE) {
        this._width = width;
        this._height = height;
        while (this._data.length < width * height) {
            this._data.push(makeItem(-1, -1));
        }
        for (let y = 0; y < this._height; ++y) {
            for (let x = 0; x < this._width; ++x) {
                const item = this._get(x, y);
                item.x = x;
                item.y = y;
                item.distance = distance;
                item.next = item.prev = null;
            }
        }
        this._todo.next = this._todo.prev = null;
    }

    _get(pos: XY.Pos): Item;
    _get(x: number, y: number): Item;
    _get(...args: any[]): Item {
        if (args.length == 1) {
            const x = XY.x(args[0]);
            const y = XY.y(args[0]);
            return this._data[x + y * this._width];
        } else {
            return this._data[args[0] + args[1] * this._width];
        }
    }

    setGoal(pos: XY.Pos, cost?: number): void;
    setGoal(x: number, y: number, cost?: number): void;
    setGoal(...args: any[]): void {
        if (typeof args[0] === 'number') {
            this._add(args[0], args[1], args[2] || 0, 0);
        } else {
            this._add(XY.x(args[0]), XY.y(args[0]), args[1] || 0, 0);
        }
    }

    _add(x: number, y: number, distance: number, cost: number) {
        if (!this.hasXY(x, y)) return false;

        const item = this._get(x, y);
        if (
            Math.floor(item.distance * 100) <=
            Math.floor((cost + distance) * 100)
        ) {
            return false;
        }

        if (item.prev) {
            item.prev.next = item.next;
            item.next && (item.next.prev = item.prev);
        }
        item.prev = item.next = null;

        if (cost >= OBSTRUCTION) {
            item.distance = OBSTRUCTION;
            return false;
        } else if (cost >= BLOCKED) {
            item.distance = BLOCKED;
            return false;
        }

        item.distance = distance + cost;

        return this._insert(item);
    }

    _insert(item: Item) {
        let prev = this._todo;
        let current = prev.next;

        while (current && current.distance < item.distance) {
            prev = current;
            current = prev.next;
        }

        prev.next = item;
        item.prev = prev;
        item.next = current;
        current && (current.prev = item);
        return true;
    }

    calculate(costFn: SimpleCostFn, only4dirs = false) {
        let current: Item | null = this._todo.next;

        while (current) {
            let next = current.next;
            current.prev = current.next = null;
            this._todo.next = next;

            // console.log('current', current.x, current.y, current.distance);

            XY.eachNeighbor(
                current.x,
                current.y,
                (x, y, dir) => {
                    let mult = 1;
                    if (XY.isDiagonal(dir)) {
                        mult = 1.4;
                        // check to see if obstruction blocks this move
                        if (
                            costFn(x, current!.y) >= OBSTRUCTION ||
                            costFn(current!.x, y) >= OBSTRUCTION
                        ) {
                            return;
                        }
                    }
                    const cost = costFn(x, y) * mult;

                    if (this._add(x, y, current!.distance, cost)) {
                        // console.log('- add', x, y, current!.distance + cost);
                    }
                },
                only4dirs
            );

            current = this._todo.next;
        }
    }

    rescan(costFn: SimpleCostFn, only4dirs = false) {
        this._data.forEach((item) => {
            item.next = item.prev = null;
            if (item.distance < BLOCKED) {
                this._insert(item);
            }
        });

        this.calculate(costFn, only4dirs);
    }

    getDistance(x: number, y: number): number {
        if (!this.hasXY(x, y)) return NOT_DONE;
        return this._get(x, y).distance;
    }

    setDistance(x: number, y: number, distance: number): void {
        if (!this.hasXY(x, y)) return;
        this._get(x, y).distance = distance;
    }

    addObstacle(
        x: number,
        y: number,
        costFn: SimpleCostFn,
        radius: number,
        penalty = radius
    ) {
        const done: XY.Loc[] = [[x, y]];
        const todo: XY.Loc[] = [[x, y]];

        while (todo.length) {
            const item = todo.shift()!;

            const dist = XY.distanceBetween(x, y, item[0], item[1]);
            if (dist > radius) {
                continue;
            }

            const stepPenalty = penalty * ((radius - dist) / radius);
            const data = this._get(item);
            data.distance += stepPenalty;

            XY.eachNeighbor(item[0], item[1], (i, j) => {
                const stepCost = costFn(i, j);
                if (done.findIndex((e) => e[0] === i && e[1] === j) >= 0) {
                    return;
                }
                if (stepCost >= BLOCKED) {
                    return;
                }

                done.push([i, j]);
                todo.push([i, j]);
            });
        }
    }

    nextDir(
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

        if (!this.hasXY(fromX, fromY)) throw new Error('Invalid index.');

        const dist = this._get(fromX, fromY).distance;
        for (index = 0; index < (only4dirs ? 4 : 8); ++index) {
            const dir = DIRS[index];
            newX = fromX + dir[0];
            newY = fromY + dir[1];
            if (!this.hasXY(newX, newY)) continue;

            if (XY.isDiagonal(dir)) {
                if (
                    this._get(newX, fromY).distance >= OBSTRUCTION ||
                    this._get(fromX, newY).distance >= OBSTRUCTION
                ) {
                    continue; // diagonal blocked
                }
            }
            const newDist = this._get(newX, newY).distance;
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

        let dist = this._get(x, y).distance || 0;
        let count = 0;

        if (dist === 0) {
            pathFn(x, y);
            return count;
        }

        if (dist >= BLOCKED) {
            const locs = XY.closestMatchingLocs(x, y, (v) => {
                return v < BLOCKED;
            });
            if (!locs || locs.length === 0) return 0;

            // get the loc with the lowest distance
            const loc = locs.reduce((best, current) => {
                const bestItem = this._get(best);
                const currentItem = this._get(current);
                return bestItem.distance <= currentItem.distance
                    ? best
                    : current;
            });

            x = loc[0];
            y = loc[1];
            pathFn(x, y);
            ++count;
        }

        let dir;
        do {
            dir = this.nextDir(x, y, isBlocked, only4dirs);
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
        for (let y = 0; y < this._height; ++y) {
            for (let x = 0; x < this._width; ++x) {
                const item = this._get(x, y);
                item.distance = fn(item.distance, item.x, item.y);
            }
        }
    }

    add(other: DijkstraMap) {
        if (this._width !== other._width || this._height !== other._height)
            throw new Error('Not same size!');

        for (let index = 0; index < this._width * this._height; ++index) {
            this._data[index].distance += other._data[index].distance;
        }
    }

    forEach(fn: EachFn) {
        for (let y = 0; y < this._height; ++y) {
            for (let x = 0; x < this._width; ++x) {
                const item = this._get(x, y);
                fn(item.distance, item.x, item.y);
            }
        }
    }

    dump(fmtFn?: (v: number) => string, log = console.log) {
        this.dumpRect(0, 0, this.width, this.height, fmtFn, log);
    }

    dumpRect(
        left: number,
        top: number,
        width: number,
        height: number,
        fmtFn?: (v: number) => string,
        log = console.log
    ) {
        fmtFn = fmtFn || _format;

        const format = (x: number, y: number) => {
            return fmtFn!(this.getDistance(x, y));
        };

        return XY.dumpRect(left, top, width, height, format, log);
    }

    dumpAround(
        x: number,
        y: number,
        radius: number,
        fmtFn?: (v: number) => string,
        log = console.log
    ) {
        this.dumpRect(
            x - radius,
            y - radius,
            2 * radius,
            2 * radius,
            fmtFn,
            log
        );
    }

    _dumpTodo() {
        let current = this._todo.next;
        const out = [];

        while (current) {
            out.push(
                `${current.x},${current.y}=${current.distance.toFixed(2)}`
            );
            current = current.next;
        }
        return out;
    }
}

function _format(v: number) {
    if (v < BLOCKED) {
        return v.toFixed(1).padStart(3, ' ') + ' ';
        // } else if (v < 36) {
        //     return String.fromCharCode('a'.charCodeAt(0) + v - 10);
        // } else if (v < 62) {
        //     return String.fromCharCode('A'.charCodeAt(0) + v - 10 - 26);
    } else if (v >= OBSTRUCTION) {
        return ' ## ';
    } else if (v >= BLOCKED) {
        return ' XX ';
    } else {
        return ' >> ';
    }
}

export function computeDistances(
    grid: DIJKSTRA.NumGrid,
    from: XY.Pos,
    costFn: SimpleCostFn = UTILS.ONE,
    only4dirs = false
): void {
    const dm = new DijkstraMap();
    dm.reset(grid.width, grid.height);
    dm.setGoal(from);
    dm.calculate(costFn, only4dirs);

    dm.forEach((v, x, y) => (grid[x][y] = v));
}

const maps: DijkstraMap[] = [];

export function alloc(): DijkstraMap {
    let map = maps.pop();
    if (!map) {
        map = new DijkstraMap();
    }

    return map;
}

export function free(map: DijkstraMap) {
    maps.push(map);
}
