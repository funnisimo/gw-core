import * as IO from '../io';
import * as XY from '../xy';

export class IOQueue {
    _events: IO.Event[];
    lastClick: XY.XY = { x: -1, y: -1 };

    constructor() {
        this._events = [];
    }

    get length() {
        return this._events.length;
    }

    clear() {
        this._events.length = 0;
    }

    enqueue(ev: IO.Event) {
        if (this._events.length) {
            const last = this._events[this._events.length - 1];
            if (last.type === ev.type) {
                if (last.type === IO.MOUSEMOVE) {
                    last.x = ev.x;
                    last.y = ev.y;
                    IO.recycleEvent(ev);
                    return;
                }
            }
        }

        // Keep clicks down to one per cell if holding down mouse button
        if (ev.type === IO.CLICK) {
            if (this.lastClick.x == ev.x && this.lastClick.y == ev.y) {
                if (this._events.findIndex((e) => e.type === IO.CLICK) >= 0) {
                    IO.recycleEvent(ev);
                    return;
                }
            }
            this.lastClick.x = ev.x;
            this.lastClick.y = ev.y;
        } else if (ev.type == IO.MOUSEUP) {
            this.lastClick.x = -1;
            this.lastClick.y = -1;
            IO.recycleEvent(ev);
            return;
        }

        if (ev.type === IO.TICK) {
            const first = this._events[0];
            if (first && first.type === IO.TICK) {
                first.dt += ev.dt;
                IO.recycleEvent(ev);
                return;
            }
            this._events.unshift(ev); // ticks go first
        } else {
            this._events.push(ev);
        }
    }

    dequeue(): IO.Event | undefined {
        return this._events.shift();
    }

    peek(): IO.Event | undefined {
        return this._events[0];
    }
}
