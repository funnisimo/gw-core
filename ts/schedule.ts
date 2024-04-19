import { FALSE, arrayNullify } from './utils.js';

enum TaskResultType {
    OK,
    DONE,
    RETRY,
}

export class TaskResult {
    _time = 0;
    _result = TaskResultType.DONE;

    protected constructor(result: TaskResultType, time: number = 0) {
        this._result = result;
        this._time = Math.floor(time);
    }

    static Ok(time: number): TaskResult {
        return new TaskResult(TaskResultType.OK, time);
    }
    static Stop(): TaskResult {
        return new TaskResult(TaskResultType.DONE);
    }
    static Retry(): TaskResult {
        return new TaskResult(TaskResultType.RETRY);
    }

    isOk(): boolean {
        return this._result == TaskResultType.OK;
    }
    isStop(): boolean {
        return this._result == TaskResultType.DONE;
    }
    isRetry(): boolean {
        return this._result == TaskResultType.RETRY;
    }

    time(): number {
        return this._time;
    }

    toString() {
        if (this.isStop()) return 'ActResult.Stop';
        if (this.isRetry()) return 'ActResult.Retry';
        return `ActResult.Ok(${this._time})`;
    }

    valueOf() {
        if (this.isOk()) return this._time;
        return 0;
    }
}

export type TaskFn = (dt: number) => TaskResult;
export interface Task {
    update(dt: number): TaskResult;
    perform(): TaskResult;
}

export type TaskType = TaskFn | Task;

interface TaskInfo<T> {
    item: T | null;
    time: number;
    next: TaskInfo<T> | null;
}

export class Schedule<T> {
    private next: TaskInfo<T> | null;
    public time: number;
    private cache: TaskInfo<T> | null;

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

    push(item: T, delay = 1) {
        let entry;
        if (this.cache) {
            entry = this.cache;
            this.cache = entry.next;
            entry.next = null;
        } else {
            entry = { item: null, time: 0, next: null };
        }
        entry.item = item;
        entry.time = this.time + delay;
        if (!this.next) {
            this.next = entry;
        } else {
            let current = this as unknown as TaskInfo<T>;
            let next = current.next;
            while (next && next.time <= entry.time) {
                current = next;
                next = current.next;
            }
            entry.next = current.next;
            current.next = entry;
        }
        return entry;
    }

    pop(): T | null {
        const n = this.next;
        if (!n) return null;

        this.next = n.next;
        n.next = this.cache;
        this.cache = n;

        this.time = Math.max(n.time, this.time); // so you can schedule -1 as a time uint
        return n.item;
    }

    peek(): T | null {
        const n = this.next;
        if (!n) return null;
        return n.item;
    }

    remove(item: T) {
        if (!item || !this.next) return;
        if (this.next.item === item) {
            this.next = this.next.next;
            return;
        }
        let prev = this.next;
        let current = prev.next;
        while (current && current.item !== item) {
            prev = current;
            current = current.next;
        }

        if (current && current.item === item) {
            prev.next = current.next;
        }
    }
}

export type ShouldStopFn = (cur: TaskType) => boolean;

export interface Runner {
    add(task: TaskType, delay: number): void;
    remove(task: TaskType): void;
    update(dt: number): void;
}

export class TurnBased implements Runner {
    schedule: Schedule<TaskType> = new Schedule();
    interrupt: ShouldStopFn;

    constructor(interrupt?: ShouldStopFn) {
        this.interrupt = interrupt || FALSE;
    }

    add(task: TaskType, delay: number) {
        this.schedule.push(task, delay);
    }

    remove(task: TaskType) {
        this.schedule.remove(task);
    }

    update(dt: number) {
        let cur = this.schedule.peek();
        while (cur) {
            let res: TaskResult;
            if (typeof cur === 'function') {
                res = cur(dt);
            } else {
                res = cur.perform();
            }
            if (!res || res.isStop()) {
                this.schedule.pop();
            } else if (res.isOk()) {
                this.schedule.pop();
                this.schedule.push(cur, res.time());
            } else {
                // RETRY
                return;
            }
            if (this.interrupt(cur)) return;
            cur = this.schedule.peek();
        }
    }
}

export type ReadyFn = () => boolean;

export class TimeoutTurn implements Runner {
    schedule: Schedule<TaskType> = new Schedule();
    interrupt: ShouldStopFn;
    ready: ReadyFn;

    constructor(ready: ReadyFn, interrupt?: ShouldStopFn) {
        this.interrupt = interrupt || FALSE;
        this.ready = ready;
    }

    add(task: TaskType, delay: number) {
        this.schedule.push(task, delay);
    }

    remove(task: TaskType) {
        this.schedule.remove(task);
    }

    update(dt: number) {
        if (!this.ready()) return;

        let cur = this.schedule.peek();
        while (cur) {
            let res: TaskResult;
            if (typeof cur === 'function') {
                res = cur(dt);
            } else {
                res = cur.perform();
            }
            if (res.isOk()) {
                this.schedule.pop();
                this.schedule.push(cur, res.time());
            } else if (res.isStop()) {
                this.schedule.pop();
            } else {
                // RETRY
                return;
            }
            if (this.interrupt(cur)) return;
            cur = this.schedule.peek();
        }
    }
}

export class RealTime implements Runner {
    items: (TaskType | null)[] = [];
    interrupt: ShouldStopFn;

    constructor(interrupt?: ShouldStopFn) {
        this.interrupt = interrupt || FALSE;
    }

    add(task: TaskType, _delay: number) {
        let nullIndex = this.items.findIndex((a) => a === null);
        if (nullIndex >= 0) {
            this.items[nullIndex] = task;
            return;
        }
        this.items.push(task);
    }

    remove(task: TaskType) {
        arrayNullify(this.items, task);
    }

    update(dt: number) {
        let items = this.items;
        let done = false;
        this.items = [];

        items.forEach((cur, i) => {
            if (!cur || done) return;
            let res: TaskResult;
            if (typeof cur === 'function') {
                res = cur(dt);
            } else {
                res = cur.perform();
            }
            if (res.isStop()) {
                this.items[i] = null;
            }
            if (this.interrupt(cur)) {
                done = true;
            }
        });
    }
}
