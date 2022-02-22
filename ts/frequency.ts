export type FrequencyFn = (danger: number) => number;
export type FrequencyConfig =
    | FrequencyFn
    | number
    | string
    | Record<string, number>
    | null;

export function make(v?: FrequencyConfig) {
    if (v === undefined) return () => 100;
    if (v === null) return () => 0;
    if (typeof v === 'number') return () => v;
    if (typeof v === 'function') return v;

    let base: Record<string, string | number> = {};
    if (typeof v === 'string') {
        const parts = v.split(/[,|]/).map((t) => t.trim());
        base = {};
        parts.forEach((p: string) => {
            let [level, weight] = p.split(':');
            base[level] = Number.parseInt(weight) || 100;
        });
    } else {
        base = v;
    }

    const parts: [string, string | number][] = Object.entries(base);

    const funcs: FrequencyFn[] = parts.map(([levels, frequency]) => {
        let value = 0;
        if (typeof frequency === 'string') {
            value = Number.parseInt(frequency);
        } else {
            value = frequency;
        }

        if (levels.includes('-')) {
            let [start, end] = levels
                .split('-')
                .map((t) => t.trim())
                .map((v) => Number.parseInt(v));
            return (level: number) =>
                level >= start && level <= end ? value : 0;
        } else if (levels.endsWith('+')) {
            const found = Number.parseInt(levels);
            return (level: number) => (level >= found ? value : 0);
        } else {
            const found = Number.parseInt(levels);
            return (level: number) => (level === found ? value : 0);
        }
    });

    if (funcs.length == 1) return funcs[0];

    return (level: number) => funcs.reduce((out, fn) => out || fn(level), 0);
}
