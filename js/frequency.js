export function make(v) {
    if (v === undefined)
        return () => 100;
    if (v === null)
        return () => 0;
    if (typeof v === "number")
        return () => v;
    if (v && typeof v === "function")
        return v;
    let base = {};
    if (typeof v === "string") {
        const parts = v.split(/[,|]/).map((t) => t.trim());
        base = {};
        parts.forEach((p) => {
            let [level, weight] = p.split(":");
            base[level] = Number.parseInt(weight) || 100;
        });
    }
    else {
        base = v;
    }
    if (base && typeof base === "object") {
        const parts = Object.entries(base);
        const funcs = parts.map(([levels, frequency]) => {
            frequency = Number.parseInt(frequency);
            if (levels.includes("-")) {
                let [start, end] = levels
                    .split("-")
                    .map((t) => t.trim())
                    .map((v) => Number.parseInt(v));
                return (level) => level >= start && level <= end ? frequency : 0;
            }
            else if (levels.endsWith("+")) {
                const found = Number.parseInt(levels);
                return (level) => (level >= found ? frequency : 0);
            }
            else {
                const found = Number.parseInt(levels);
                return (level) => (level === found ? frequency : 0);
            }
        });
        if (funcs.length == 1)
            return funcs[0];
        return (level) => funcs.reduce((out, fn) => out || fn(level), 0);
    }
    return () => 0;
}
//# sourceMappingURL=frequency.js.map