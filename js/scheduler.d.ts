export declare type ScheduleFn = Function;
interface Event {
    fn: ScheduleFn | null;
    time: number;
    next: Event | null;
}
export declare class Scheduler {
    private next;
    time: number;
    private cache;
    constructor();
    clear(): void;
    push(fn: ScheduleFn, delay?: number): Event;
    pop(): Function | null;
    remove(item: Event): void;
}
export {};
