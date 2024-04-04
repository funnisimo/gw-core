export type TagBase = string | string[];
export type Tags = string[];

export type TagMatchFn = (tags: Tags) => boolean;

export interface TagMatchOptions {
    tags: string | string[];
    forbidTags?: string | string[];
}

export function make(base: TagBase): Tags {
    if (!base) return [];
    if (typeof base === 'string') {
        base = base.split(/[|,]/g);
    }
    return base.map((t) => t.trim()).filter((v) => v && v.length);
}

// TACO & !CHICKEN  << A -AND- NOT B
// FOOD
// TACO & STEAK << A -AND- B
// TACO | STEAK << A -OR- B
// TACO, STEAK  << SPLITS GROUPS - groups are -OR-
// TACO; STEAK  << SPLITS GROUPS - groups are -OR-
export function makeMatch(rules: string | TagMatchOptions): TagMatchFn {
    if (!rules) return () => true;

    const fns: ((tags: Tags) => boolean)[] = [];

    if (typeof rules === 'string') {
        const groups = rules.split(/[,;]/g).map((t) => t.trim());

        groups.forEach((info) => {
            const ors = info.split(/[|]/).map((t) => t.trim());

            ors.forEach((orPart) => {
                const ands = orPart.split(/[&]/).map((t) => t.trim());

                const andFns = ands.map((v) => {
                    if (v.startsWith('!')) {
                        const id = v.substring(1);
                        return (tags: Tags) => !tags.includes(id);
                    }
                    return (tags: Tags) => tags.includes(v);
                });

                fns.push((tags: Tags) => andFns.every((f) => f(tags)));
            });
        });
        return (tags) => fns.some((f) => f(tags));
    } else {
        if (typeof rules.tags === 'string') {
            // TODO - colon?
            rules.tags = rules.tags.split(/[:,|]/g).map((t) => t.trim());
        }
        if (typeof rules.forbidTags === 'string') {
            rules.forbidTags = rules.forbidTags
                .split(/[:,|]/g)
                .map((t) => t.trim());
        }

        const needTags = rules.tags;
        const forbidTags = rules.forbidTags || [];
        return (tags) => {
            return (
                needTags.every((t) => tags.includes(t)) &&
                !forbidTags.some((t) => tags.includes(t))
            );
        };
    }
}

export function match(tags: Tags, matchRules: string): boolean {
    const matchFn = makeMatch(matchRules);
    return matchFn(tags);
}

export function merge(current: Tags, updated: TagBase): Tags {
    const updatedTags = make(updated);
    const out = current.slice();
    updatedTags.forEach((t) => {
        if (t.startsWith('!')) {
            const index = out.indexOf(t.slice(1));
            if (index >= 0) {
                out.splice(index, 1);
            }
        } else {
            out.push(t);
        }
    });
    return out;
}
