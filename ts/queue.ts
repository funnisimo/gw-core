type AsyncQueueHandlerFn<T> = (obj: T) => void;

export class AsyncQueue<T> {
    _data: T[];
    _waiting: AsyncQueueHandlerFn<T> | null = null;

    constructor() {
        this._data = [];
    }

    get length(): number {
        return this._data.length;
    }

    clear() {
        this._data.length = 0;
    }

    get last(): T | undefined {
        return this._data[this._data.length - 1];
    }

    get first(): T | undefined {
        return this._data[0];
    }

    enqueue(obj: T): void {
        if (this._waiting) {
            const fn = this._waiting;
            this._waiting = null;
            fn(obj);
        } else {
            this._data.push(obj);
        }
    }

    prepend(obj: T): void {
        if (this._waiting) {
            this._waiting(obj);
            this._waiting = null;
        } else {
            this._data.unshift(obj);
        }
    }

    dequeue(): Promise<T> {
        const t = this._data.shift();
        if (t) {
            return Promise.resolve(t);
        }

        if (this._waiting) {
            throw new Error('Too many requesters.');
        }

        const p = new Promise((resolve) => {
            this._waiting = resolve;
        });

        return p as Promise<T>;
    }
}
