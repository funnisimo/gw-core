// CHAIN

export interface Chainable<T> {
    next: T | null;
}

export type ChainSort<T> = (a: T, b: T) => number;
export type ChainMatch<T> = (val: T) => boolean;
export type ChainFn<T> = (val: T) => any;

export function chainLength<T extends Chainable<T>>(root: T | null) {
    let count = 0;
    while (root) {
        count += 1;
        root = root.next;
    }
    return count;
}

export function chainIncludes<T extends Chainable<T>>(
    chain: T | null,
    entry: T
) {
    while (chain && chain !== entry) {
        chain = chain.next;
    }
    return chain === entry;
}

export function eachChain<T extends Chainable<T>>(
    item: T | null,
    fn: (item: T, index: number) => any
) {
    let index = 0;
    while (item) {
        const next = item.next;
        fn(item, index++);
        item = next;
    }
    return index; // really count
}

export function addToChain<T extends Chainable<T>>(
    obj: any,
    name: string,
    entry: T
) {
    entry.next = obj[name] || null;
    obj[name] = entry;
    return true;
}

export function removeFromChain<T extends Chainable<T>>(
    obj: any,
    name: string,
    entry: T
) {
    const root = obj[name];
    if (root === entry) {
        obj[name] = entry.next || null;
        entry.next = null;
        return true;
    } else if (!root) {
        return false;
    } else {
        let prev = root;
        let current = prev.next;
        while (current && current !== entry) {
            prev = current;
            current = prev.next;
        }
        if (current === entry) {
            prev.next = current.next || null;
            entry.next = null;
            return true;
        }
    }
    return false;
}

export function findInChain<T extends Chainable<T>>(
    root: T | null,
    cb: ChainMatch<T>
) {
    while (root && !cb(root)) {
        root = root.next;
    }
    return root;
}

export type ChainChangeFn = () => any;
export type ChainReduceFn<T> = (out: any, t: T) => any;

export class Chain<T extends Chainable<T>> {
    data: T | null;
    sort: ChainSort<T>;
    onchange: ChainChangeFn;

    constructor(sort?: ChainSort<T>, onchange?: ChainChangeFn) {
        this.data = null;
        this.sort = sort || (() => -1);
        this.onchange = onchange || (() => {});
    }

    copy(other: Chain<T>) {
        this.data = other.data;
        this.sort = other.sort;
        this.onchange = other.onchange;
    }

    get length(): number {
        let count = 0;
        this.forEach(() => ++count);
        return count;
    }

    add(obj: T): boolean {
        if (!this.data || this.sort(this.data, obj) < 0) {
            obj.next = this.data;
            this.data = obj;
            return true;
        }

        let prev = this.data;
        let current = this.data.next;

        while (current && this.sort(current, obj) < 0) {
            prev = current;
            current = current.next;
        }

        obj.next = current;
        prev.next = obj;
        this.onchange();
        return true;
    }

    has(obj: T): boolean {
        return this.find((o) => o === obj) !== null;
    }

    remove(obj: T): boolean {
        if (!removeFromChain(this, 'data', obj)) {
            return false;
        }
        this.onchange();
        return true;
    }

    find(cb: ChainMatch<T>): T | null {
        return findInChain(this.data, cb);
    }

    forEach(cb: ChainFn<T>) {
        return eachChain(this.data, cb);
    }

    reduce(cb: ChainReduceFn<T>, out?: any): any {
        let current = this.data;
        if (!current) return out;

        if (out === undefined) {
            out = current;
            current = current.next;
        }

        while (current) {
            cb(out, current);
            current = current.next;
        }
        return out;
    }

    some(cb: ChainMatch<T>): boolean {
        let current = this.data;
        while (current) {
            if (cb(current)) return true;
            current = current.next;
        }
        return false;
    }

    every(cb: ChainMatch<T>): boolean {
        let current = this.data;
        while (current) {
            if (!cb(current)) return false;
            current = current.next;
        }
        return true;
    }
}
