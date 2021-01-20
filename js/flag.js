///////////////////////////////////
// FLAG
export function fl(N) {
    return 1 << N;
}
export function toString(flagObj, value) {
    const inverse = Object.entries(flagObj).reduce((out, entry) => {
        const [key, value] = entry;
        if (typeof value === "number")
            out[value] = key;
        return out;
    }, []);
    const out = [];
    for (let index = 0; index < 32; ++index) {
        const fl = 1 << index;
        if (value & fl) {
            out.push(inverse[fl]);
        }
    }
    return out.join(" | ");
}
export function from(obj, ...args) {
    let result = 0;
    for (let index = 0; index < args.length; ++index) {
        let value = args[index];
        if (value === undefined)
            continue;
        if (typeof value == "number") {
            result |= value;
            continue; // next
        }
        else if (typeof value === "string") {
            value = value
                .split(/[,|]/)
                .map((t) => t.trim())
                .map((u) => {
                const n = Number.parseInt(u);
                if (n >= 0)
                    return n;
                return u;
            });
        }
        if (Array.isArray(value)) {
            value.forEach((v) => {
                if (typeof v == "string") {
                    v = v.trim();
                    if (v.startsWith("!")) {
                        // @ts-ignore
                        const f = obj[v.substring(1)];
                        result &= ~f;
                    }
                    else {
                        // @ts-ignore
                        const f = obj[v];
                        if (f) {
                            result |= f;
                        }
                    }
                }
                else if (v === 0) {
                    // to allow clearing flags when extending objects
                    result = 0;
                }
                else {
                    result |= v;
                }
            });
        }
    }
    return result;
}
//# sourceMappingURL=flag.js.map