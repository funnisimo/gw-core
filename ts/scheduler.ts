export type ScheduleFn = Function;

interface Event {
    fn: ScheduleFn | null;
    time: number;
    next: Event | null;
}

export class Scheduler {
    private next: Event | null;
    public time: number;
    private cache: Event | null;

    constructor() {
        this.next = null;
        this.time = 0;
        this.cache = null;
    }

    clear() {
        while (this.next) {
            const current = this.next;
            this.next = current.next;
            current.next = this.cache;
            this.cache = current;
        }
    }

    push(fn: ScheduleFn, delay = 1) {
        let item;
        if (this.cache) {
            item = this.cache;
            this.cache = item.next;
            item.next = null;
        } else {
            item = { fn: null, time: 0, next: null };
        }
        item.fn = fn;
        item.time = this.time + delay;
        if (!this.next) {
            this.next = item;
        } else {
            let current = (this as unknown) as Event;
            let next = current.next;
            while (next && next.time <= item.time) {
                current = next;
                next = current.next;
            }
            item.next = current.next;
            current.next = item;
        }
        return item;
    }

    pop() {
        const n = this.next;
        if (!n) return null;

        this.next = n.next;
        n.next = this.cache;
        this.cache = n;

        this.time = Math.max(n.time, this.time); // so you can schedule -1 as a time uint
        return n.fn;
    }

    remove(item: Event) {
        if (!item || !this.next) return;
        if (this.next === item) {
            this.next = item.next;
            return;
        }
        let prev = this.next;
        let current = prev.next;
        while (current && current !== item) {
            prev = current;
            current = current.next;
        }

        if (current === item) {
            prev.next = current.next;
        }
    }
}

// type AsyncQueueHandlerFn<T> = (obj: T) => void;

// export class AsyncQueue<T> {
//     _data: T[];
//     _handler: AsyncQueueHandlerFn<T> | null = null;

//     constructor() {
//         this._data = [];
//     }

//     get length(): number {
//         return this._data.length;
//     }

//     get last(): T | undefined {
//         return this._data[this._data.length - 1];
//     }

//     get first(): T | undefined {
//         return this._data[0];
//     }

//     enqueue(obj: T): void {
//         if (this._handler) {
//             this._handler(obj);
//             this._handler = null;
//         } else {
//             this._data.push(obj);
//         }
//     }

//     dequeue(): Promise<T> {
//         const t = this._data.shift();
//         if (t) {
//             return Promise.resolve(t);
//         }

//         const p = new Promise((resolve) => {
//             this._handler = resolve;
//         });

//         return p as Promise<T>;
//     }
// }
