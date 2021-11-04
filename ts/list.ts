// CHAIN

export type ListEntry<T> = T | null;
export interface ListItem<T> {
    next: ListEntry<T>;
}
export type ListObject = any;

export type ListSort<T> = (a: T, b: T) => number;
export type ListMatch<T> = (val: T) => boolean;
export type ListEachFn<T> = (val: T, index: number) => any;
export type ListReduceFn<T> = (out: any, t: T) => any;

export function length<T extends ListItem<T>>(root: ListEntry<T>): number {
    let count = 0;
    while (root) {
        count += 1;
        root = root.next;
    }
    return count;
}

export function at<T extends ListItem<T>>(
    root: ListEntry<T>,
    index: number
): T | null {
    while (root && index) {
        root = root.next;
        --index;
    }
    return root;
}

export function includes<T extends ListItem<T>>(
    root: ListEntry<T>,
    entry: T
): boolean {
    while (root && root !== entry) {
        root = root.next;
    }
    return root === entry;
}

export function forEach<T extends ListItem<T>>(
    root: T | null,
    fn: ListEachFn<T>
) {
    let index = 0;
    while (root) {
        const next = root.next;
        fn(root, index++);
        root = next;
    }
    return index; // really count
}

export function push<T extends ListItem<T>>(
    obj: ListObject,
    name: string,
    entry: ListItem<T>
) {
    entry.next = obj[name] || null;
    obj[name] = entry as T;
    return true;
}

export function remove<T extends ListItem<T>>(
    obj: ListObject,
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

export function find<T extends ListItem<T>>(
    root: ListEntry<T>,
    cb: ListMatch<T>
) {
    while (root && !cb(root as T)) {
        root = root.next;
    }
    return root;
}

export function insert<T extends ListItem<T>>(
    obj: ListObject,
    name: string,
    entry: T,
    sort?: ListSort<T>
): boolean {
    let root = obj[name];
    sort = sort || (() => -1); // always insert first

    if (!root || sort(root, entry) < 0) {
        entry.next = root;
        obj[name] = entry;
        return true;
    }

    let prev = root;
    let current = root.next;

    while (current && sort(current, entry) > 0) {
        prev = current;
        current = current.next;
    }

    entry.next = current;
    prev.next = entry;
    return true;
}

export function reduce<T extends ListItem<T>>(
    root: ListEntry<T>,
    cb: ListReduceFn<T>,
    out?: any
): any {
    let current = root;

    if (out === undefined) {
        if (!current)
            throw new TypeError(
                'Empty list reduce without initial value not allowed.'
            );

        out = current;
        current = current.next;
    }

    while (current) {
        out = cb(out, current);
        current = current.next;
    }
    return out;
}

export function some<T extends ListItem<T>>(
    root: ListEntry<T>,
    cb: ListMatch<T>
): boolean {
    let current = root;
    while (current) {
        if (cb(current)) return true;
        current = current.next;
    }
    return false;
}

export function every<T extends ListItem<T>>(
    root: ListEntry<T>,
    cb: ListMatch<T>
): boolean {
    let current = root;
    while (current) {
        if (!cb(current)) return false;
        current = current.next;
    }
    return true;
}
