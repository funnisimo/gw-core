import * as XY from '../xy.js';
import { ONE } from '../utils.js';
import { MoveCost } from './dijkstra.js';

interface Item {
    x: number;
    y: number;

    // Cost estimates
    cost: number;
    estRemaining: number;

    // type: string;

    prev: Item | null;
}

export type CostFn = (x: number, y: number) => number | MoveCost;

export function fromTo(
    from: XY.AnyPoint,
    to: XY.AnyPoint,
    costFn: CostFn = ONE,
    only4dirs = false
): XY.Loc[] {
    const search = new AStar(to, costFn);
    return search.from(from, only4dirs);
}

export class AStar {
    _todo: Item[] = [];
    _done: Item[] = [];
    goal: XY.Loc;
    costFn: CostFn;

    constructor(goal: XY.AnyPoint, costFn: CostFn = ONE) {
        this.goal = XY.asLoc(goal);
        this.costFn = costFn;
    }

    _add(loc: XY.AnyPoint, stepCost = 1, prev: Item | null = null) {
        const h = XY.distanceFromTo(loc, this.goal);
        let newItem = {
            x: XY.x(loc),
            y: XY.y(loc),
            prev: prev,
            cost: prev ? prev.cost + stepCost : 0,
            estRemaining: h,
            // type: 'move',
        } as Item;

        const f = newItem.cost + newItem.estRemaining;
        const existing = this._todo.findIndex((i) => XY.equals(i, newItem));
        if (existing > -1) {
            const oldItem = this._todo[existing];
            if (oldItem.cost + oldItem.estRemaining <= f) {
                return;
            }
            this._todo.splice(existing, 1); // this one is better
        }

        /* insert by distance */

        for (let i = 0; i < this._todo.length; i++) {
            const item = this._todo[i];
            const itemF = item.cost + item.estRemaining;
            if (f < itemF || (f == itemF && h < item.estRemaining)) {
                this._todo.splice(i, 0, newItem);
                return;
            }
        }

        this._todo.push(newItem);
    }

    from(from: XY.AnyPoint, only4dirs = false): XY.Loc[] {
        this._todo = [];
        this._done = [];

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
                            this.costFn(item!.x, y) === MoveCost.Obstruction ||
                            this.costFn(x, item!.y) === MoveCost.Obstruction
                        ) {
                            return;
                        }
                    }
                    const cost = this.costFn(x, y) * mult;
                    if (cost < 0 || cost >= MoveCost.Blocked) return;

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

// export type CostPlusFn = (
//     x: number,
//     y: number,
//     fromX: number,
//     fromY: number
// ) => number | MoveCost;
// export interface StepInfo {
//     x: number;
//     y: number;
//     type: string;
// }
// export type NextStepsFn = (
//     x: number,
//     y: number,
//     fromX: number,
//     fromY: number
// ) => StepInfo[];

// export class AStarPlus {
//     _todo: Item[] = [];
//     _done: Item[][] = [];
//     goal: XY.Loc;
//     costFn: CostPlusFn;
//     nextFn: NextStepsFn;

//     constructor(
//         goal: XY.AnyPoint,
//         costFn: CostPlusFn = ONE,
//         nextFn: NextStepsFn = (x, y) =>
//             XY.DIRS.map((d) => ({ x: d[0] + x, y: d[1] + y, type: 'move' }))
//     ) {
//         this.goal = XY.asLoc(goal);
//         this.nextFn = nextFn;
//         this.costFn = costFn;
//     }

//     _add(
//         loc: XY.AnyPoint,
//         stepCost = 1,
//         type: string = 'move',
//         prev: Item | null = null
//     ) {
//         const h = XY.distanceFromTo(loc, this.goal);
//         let newItem = {
//             x: XY.x(loc),
//             y: XY.y(loc),
//             prev: prev,
//             cost: prev ? prev.cost + stepCost : 0,
//             estRemaining: h,
//             type,
//         } as Item;

//         const f = newItem.cost + newItem.estRemaining;
//         const existing = this._todo.findIndex((i) => XY.equals(i, newItem));
//         if (existing > -1) {
//             const oldItem = this._todo[existing];
//             if (oldItem.cost + oldItem.estRemaining <= f) {
//                 return;
//             }
//             this._todo.splice(existing, 1); // this one is better
//         }

//         /* insert by distance */

//         for (let i = 0; i < this._todo.length; i++) {
//             const item = this._todo[i];
//             const itemF = item.cost + item.estRemaining;
//             if (f < itemF || (f == itemF && h < item.estRemaining)) {
//                 this._todo.splice(i, 0, newItem);
//                 return;
//             }
//         }

//         this._todo.push(newItem);
//     }

//     from(from: XY.AnyPoint): XY.Loc[] {
//         this._todo = [];
//         this._done = [];

//         this._add(from);

//         let item: Item | null = null;
//         while (this._todo.length) {
//             item = this._todo.shift() || null;
//             if (!item) break;
//             if (this._done.findIndex((i) => XY.equals(i, item)) > -1) {
//                 continue;
//             }
//             this._done.push(item);

//             if (XY.equals(item, this.goal)) {
//                 break;
//             }

//             const lastX = item.prev ? item.prev.x : item.x;
//             const lastY = item.prev ? item.prev.y : item.y;

//             for (let step of this.nextFn(item.x, item.y, lastX, lastY)) {
//                 let mult = 1;
//                 if (
//                     this._done.findIndex(
//                         (i) => i.x === step.x && i.y === step.y
//                     ) > -1
//                 ) {
//                     continue;
//                 }

//                 let dir = XY.dirFromTo(item, step);
//                 if (XY.isUnitDir(dir)) {
//                     if (XY.isDiagonal(dir)) {
//                         mult = 1.4;
//                         if (
//                             this.costFn(item!.x, step.y, lastX, lastY) ===
//                                 MoveCost.Obstruction ||
//                             this.costFn(step.x, item!.y, lastX, lastY) ===
//                                 MoveCost.Obstruction
//                         ) {
//                             continue;
//                         }
//                     }
//                 }
//                 const cost = this.costFn(step.x, step.y, lastX, lastY) * mult;
//                 if (cost < 0 || cost >= MoveCost.Blocked) continue;

//                 this._add(step, cost, step.type, item);
//             }
//         }

//         if (item && !XY.equals(item, this.goal)) return [];

//         let result: XY.Loc[] = [];
//         while (item) {
//             result.push([item.x, item.y]);
//             item = item.prev;
//         }
//         result.reverse();
//         return result;
//     }
// }
