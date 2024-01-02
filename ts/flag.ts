///////////////////////////////////
// FLAG

type FlagSource = number | string;
export type FlagBase = FlagSource | FlagSource[] | null;

export function fl(N: number) {
    return 2 ** N;
}

export function toString<T extends {}>(flagObj: T, value: number): string {
    const inverse = Object.entries(flagObj).reduce(
        (out: string[], entry: [string, unknown]) => {
            const [key, value] = entry as [string, number];
            if (typeof value === 'number') {
                if (out[value]) {
                    out[value] += ' | ' + key;
                } else {
                    out[value] = key;
                }
            }
            return out;
        },
        []
    );

    const out = [];
    for (let index = 0; index < 32; ++index) {
        const fl = 1 << index;
        if (value & fl) {
            out.push(inverse[fl]);
        }
    }
    return out.join(' | ');
}

function from_base<T>(
    obj: T,
    throws: boolean,
    ...args: (FlagBase | undefined)[]
): number {
    let result = 0;
    for (let index = 0; index < args.length; ++index) {
        let value = args[index];
        if (value === undefined) continue;
        if (typeof value == 'number') {
            result |= value;
            continue; // next
        } else if (typeof value === 'string') {
            value = value
                .split(/[,|]/)
                .map((t) => t.trim())
                .map((u) => {
                    const n = Number.parseInt(u);
                    if (n >= 0) return n;
                    return u;
                });
        }

        if (Array.isArray(value)) {
            value.forEach((v) => {
                if (typeof v == 'string') {
                    v = v.trim();
                    const parts = v.split(/[,|]/);
                    if (parts.length > 1) {
                        result = from_base(obj, throws, result, parts);
                    } else if (v.startsWith('!')) {
                        // @ts-ignore
                        const f = obj[v.substring(1)];
                        result &= ~f;
                    } else {
                        const n = Number.parseInt(v);
                        if (n >= 0) {
                            result |= n;
                            return;
                        }

                        // @ts-ignore
                        const f = obj[v];
                        if (f) {
                            result |= f;
                        } else {
                            if (throws) {
                                throw new Error(`Unknown flag - ${v}`);
                            }
                        }
                    }
                } else if (v === 0) {
                    // to allow clearing flags when extending objects
                    result = 0;
                } else {
                    result |= v;
                }
            });
        }
    }
    return result;
}

/**
 * Converts from a flag base to a flag.
 *
 * @param {Object} flagObj - The flag we are getting values from
 * @param {...FlagSource | FlagSource[]} args - The args to concatenate from flagObj
 * @returns {number}
 * @throws {Error} - If it encounters an unknown flag in args
 */
export function from<T>(obj: T, ...args: (FlagBase | undefined)[]): number {
    return from_base(obj, true, ...args);
}

/**
 * Converts from a flag base to a flag.  Will not throw if an unknown flag is encountered.
 *
 * @param {Object} flagObj - The flag we are getting values from
 * @param {...FlagSource | FlagSource[]} args - The args to concatenate from flagObj
 * @returns {number}
 */
export function from_safe<T>(
    flagObj: T,
    ...args: (FlagBase | undefined)[]
): number {
    return from_base(flagObj, false, ...args);
}

export function make(
    obj: Record<string, FlagBase> | string[] | string
): Record<string, number> {
    const out: Record<string, number> = {};

    if (typeof obj === 'string') {
        obj = obj.split(/[|,]/).map((v) => v.trim());
    }
    if (Array.isArray(obj)) {
        const arr = obj;
        const flags: Record<string, number> = {};
        let nextIndex = 0;
        let used: number[] = [];
        arr.forEach((v) => {
            if (v.includes('=')) {
                const [name, value] = v.split('=').map((t) => t.trim());
                const values = value.split('|').map((t) => t.trim());
                // console.log(`flag: ${v} >> ${name} = ${value} >> ${values}`);

                let i = 0;
                for (let n = 0; n < values.length; ++n) {
                    const p = values[n];
                    if (flags[p]) {
                        i |= flags[p];
                    } else {
                        const num = Number.parseInt(p);
                        if (num) {
                            i |= num;
                            for (let x = 0; x < 32; ++x) {
                                if (i & (1 << x)) {
                                    used[x] = 1;
                                }
                            }
                        } else {
                            throw new Error(`Failed to parse flag = ${v}`);
                        }
                    }
                }
                flags[name] = i;
            } else {
                while (used[nextIndex]) {
                    ++nextIndex;
                }
                if (nextIndex > 31) {
                    throw new Error('Flag uses too many bits! [Max=32]');
                }
                flags[v] = fl(nextIndex);
                used[nextIndex] = 1;
            }
        });
        return flags;
    }

    Object.entries(obj).forEach(([key, value]) => {
        out[key] = from(out, value);
    });

    return out;
}
