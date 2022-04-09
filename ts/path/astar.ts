import * as XY from '../xy';
import { ONE } from '../utils';
import { OBSTRUCTION } from './dijkstra';

interface Item {
    x: number;
    y: number;
    g: number;
    h: number;
    prev: Item | null;
}

export type Loc = XY.XY | XY.Loc;
export type CostFn = (x: number, y: number) => number;

export function fromTo(
    from: Loc,
    to: Loc,
    costFn: CostFn = ONE,
    only4dirs = false
): XY.Loc[] {
    const search = new AStar(to, costFn);
    return search.from(from, only4dirs);
}

class AStar {
    _todo: Item[] = [];
    _done: Item[] = [];
    goal: Loc;
    costFn: CostFn;

    constructor(goal: Loc, costFn: CostFn = ONE) {
        this.goal = goal;
        this.costFn = costFn;
    }

    _add(loc: Loc, cost = 1, prev: Item | null = null) {
        const h = XY.distanceFromTo(loc, this.goal);
        let newItem = {
            x: XY.x(loc),
            y: XY.y(loc),
            prev: prev,
            g: prev ? prev.g + cost : 0,
            h: h,
        } as Item;

        const f = newItem.g + newItem.h;
        const existing = this._todo.findIndex((i) => XY.equals(i, newItem));
        if (existing > -1) {
            const oldItem = this._todo[existing];
            if (oldItem.g + oldItem.h <= f) {
                return;
            }
            this._todo.splice(existing, 1); // this one is better
        }

        /* insert by distance */

        for (let i = 0; i < this._todo.length; i++) {
            const item = this._todo[i];
            const itemF = item.g + item.h;
            if (f < itemF || (f == itemF && h < item.h)) {
                this._todo.splice(i, 0, newItem);
                return;
            }
        }

        this._todo.push(newItem);
    }

    from(from: Loc, only4dirs = false): XY.Loc[] {
        this._add(from);

        let item: Item | null = null;
        while (this._todo.length) {
            item = this._todo.shift() || null;
            if (!item) break;
            if (this._done.findIndex((i) => XY.equals(i, item)) > -1) {
                continue;
            }
            this._done.push(item);

            if (XY.equals(item, this.goal)) {
                break;
            }

            XY.eachNeighbor(
                item.x,
                item.y,
                (x, y, dir) => {
                    if (
                        this._done.findIndex((i) => i.x === x && i.y === y) > -1
                    ) {
                        return;
                    }
                    // TODO - Handle OBSTRUCTION and diagonals
                    let mult = 1;
                    if (XY.isDiagonal(dir)) {
                        mult = 1.4;
                        if (
                            this.costFn(item!.x, y) === OBSTRUCTION ||
                            this.costFn(x, item!.y) === OBSTRUCTION
                        ) {
                            return;
                        }
                    }
                    const cost = this.costFn(x, y) * mult;
                    if (cost < 0 || cost >= 10000) return;

                    this._add([x, y], cost, item);
                },
                only4dirs
            );
        }

        if (item && !XY.equals(item, this.goal)) return [];

        let result: XY.Loc[] = [];
        while (item) {
            result.push([item.x, item.y]);
            item = item.prev;
        }
        result.reverse();
        return result;
    }
}
