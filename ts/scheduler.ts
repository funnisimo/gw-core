interface Event {
    item: any;
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

    push(item: any, delay = 1) {
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
            let current = (this as unknown) as Event;
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

    pop(): any {
        const n = this.next;
        if (!n) return null;

        this.next = n.next;
        n.next = this.cache;
        this.cache = n;

        this.time = Math.max(n.time, this.time); // so you can schedule -1 as a time uint
        return n.item;
    }

    peek(): any {
        const n = this.next;
        if (!n) return null;
        return n.item;
    }

    remove(item: any) {
        if (!item || !this.next) return;
        if (this.next.item === item) {
            this.next = item.next;
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
