import { ERROR } from './utils.js';

export type AnyObj = Record<string, any>;

// export function extend(obj, name, fn) {
//   const base = obj[name] || NOOP;
//   const newFn = fn.bind(obj, base.bind(obj));
//   newFn.fn = fn;
//   newFn.base = base;
//   obj[name] = newFn;
// }

// export function rebase(obj, name, newBase) {
//   const fns = [];
//   let fn = obj[name];

//   while(fn && fn.fn) {
//     fns.push(fn.fn);
//     fn = fn.base;
//   }

//   obj[name] = newBase;

//   while(fns.length) {
//     fn = fns.pop();
//     extend(obj, name, fn);
//   }
// }

// export function cloneObject(obj:object) {
//   const other = Object.create(obj.__proto__);
//   assignObject(other, obj);
//   return other;
// }

/// https://www.30secondsofcode.org/js/s/is-plain-object/
export function isPlainObject(val: any): boolean {
    return !!val && typeof val === 'object' && val.constructor === Object;
}

export function isObject(item: any): boolean {
    return !!item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Like lodash set, but without array index support.
 * @param obj
 * @param path
 * @returns
 */
export function getPath(
    obj: Record<string, any>,
    path: string
): any | undefined {
    const parts = path.split('.');
    let current: Record<string, any> = obj;
    while (parts.length > 0) {
        const part = parts.shift()!;
        current = current[part];
    }
    return current;
}

/**
 * Like lodash set, but without array index support.
 * @param obj
 * @param path
 * @param val
 * @returns
 */
export function setPath(obj: Record<string, any>, path: string, val: any) {
    const parts = path.split('.');
    if (parts.length == 0) return;

    let current: Record<string, any> = obj;
    while (parts.length > 1) {
        const part = parts.shift()!;
        if (!(part in current)) {
            current[part] = {};
        } else if (typeof current[part] !== 'object') {
            current[part] = {};
        }
        current = current[part];
    }
    current[parts.shift()!] = val;
}

// https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
//
// Modified to use: isPlainObject
// Modified to mergeDeep recursively if key is not in target
export function mergeDeep(
    target: { [id: string]: any },
    source: { [id: string]: any }
): { [id: string]: any } {
    let output = Object.assign({}, target);
    if (isPlainObject(target) && isPlainObject(source)) {
        Object.keys(source).forEach((key) => {
            if (isPlainObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, {
                        [key]: mergeDeep({}, source[key]),
                    });
                else output[key] = mergeDeep(target[key], source[key]);
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    } else {
        throw new Error('mergeDeep only works on plain objects, not classes.');
    }
    return output;
}
///

function assignField(dest: AnyObj, src: AnyObj, key: string) {
    const current = dest[key];
    const updated = src[key];
    if (current && current.copy && updated) {
        current.copy(updated);
    } else if (current && current.clear && !updated) {
        current.clear();
    } else if (current && current.nullify && !updated) {
        current.nullify();
    } else if (updated && updated.clone) {
        dest[key] = updated.clone(); // just use same object (shallow copy)
    } else if (updated && Array.isArray(updated)) {
        dest[key] = updated.slice();
    } else if (current && Array.isArray(current)) {
        current.length = 0;
    } else if (updated !== undefined) {
        dest[key] = updated;
    }
}

export function copyObject(dest: AnyObj, src: AnyObj) {
    Object.keys(dest).forEach((key) => {
        assignField(dest, src, key);
    });
    return dest;
}

export function assignObject(dest: AnyObj, src: AnyObj) {
    Object.keys(src).forEach((key) => {
        assignField(dest, src, key);
    });
    return dest;
}

export function assignOmitting(
    omit: string | string[],
    dest: AnyObj,
    src: AnyObj
) {
    if (typeof omit === 'string') {
        omit = omit.split(/[,|]/g).map((t) => t.trim());
    }
    Object.keys(src).forEach((key) => {
        if (omit.includes(key)) return;
        assignField(dest, src, key);
    });
    return dest;
}

export function setDefault(obj: AnyObj, field: string, val: any) {
    if (obj[field] === undefined) {
        obj[field] = val;
    }
}

export type AssignCallback = (
    dest: AnyObj,
    key: string,
    current: any,
    def: any
) => boolean;

export function setDefaults(
    obj: AnyObj,
    def: AnyObj | null | undefined,
    custom: AssignCallback | null = null
) {
    let dest;
    if (!def) return;
    Object.keys(def).forEach((key) => {
        const origKey = key;
        let defValue = def[key];
        dest = obj;

        // allow for => 'stats.health': 100
        const parts = key.split('.');
        while (parts.length > 1) {
            key = parts.shift()!;
            if (dest[key] === undefined) {
                dest = dest[key] = {};
            } else if (typeof dest[key] !== 'object') {
                ERROR(
                    'Trying to set default member on non-object config item: ' +
                        origKey
                );
            } else {
                dest = dest[key];
            }
        }

        key = parts.shift()!;
        let current = dest[key];

        // console.log('def - ', key, current, defValue, obj, dest);

        if (custom && custom(dest, key, current, defValue)) {
            // do nothing
        } else if (current === undefined) {
            if (defValue === null) {
                dest[key] = null;
            } else if (Array.isArray(defValue)) {
                dest[key] = defValue.slice();
            } else if (typeof defValue === 'object') {
                dest[key] = defValue; // Object.assign({}, defValue); -- this breaks assigning a Color object as a default...
            } else {
                dest[key] = defValue;
            }
        }
    });
}

export function setOptions(obj: AnyObj, opts: AnyObj | null | undefined) {
    setDefaults(obj, opts, (dest, key, _current, opt) => {
        if (opt === null) {
            dest[key] = null;
        } else if (Array.isArray(opt)) {
            dest[key] = opt.slice();
        } else if (typeof opt === 'object') {
            dest[key] = opt; // Object.assign({}, opt); -- this breaks assigning a Color object as a default...
        } else {
            dest[key] = opt;
        }
        return true;
    });
}

export function kindDefaults(obj: AnyObj, def: AnyObj | null | undefined) {
    function custom(dest: any, key: string, current: any, defValue: any) {
        if (key.search(/[fF]lags$/) < 0) return false;

        if (!current) {
            current = [];
        } else if (typeof current == 'string') {
            current = current.split(/[,|]/).map((t) => t.trim());
        } else if (!Array.isArray(current)) {
            current = [current];
        }

        if (typeof defValue === 'string') {
            defValue = defValue.split(/[,|]/).map((t) => t.trim());
        } else if (!Array.isArray(defValue)) {
            defValue = [defValue];
        }

        // console.log('flags', key, defValue, current);

        dest[key] = defValue.concat(current);
        return true;
    }

    return setDefaults(obj, def, custom);
}

export function pick(obj: AnyObj, ...fields: string[]) {
    const data: any = {};
    fields.forEach((f) => {
        const v = obj[f];
        if (v !== undefined) {
            data[f] = v;
        }
    });
    return data;
}

export function clearObject(obj: AnyObj) {
    Object.keys(obj).forEach((key) => (obj[key] = undefined));
}

export function getOpt(obj: AnyObj, member: string, _default: any) {
    const v = obj[member];
    if (v === undefined) return _default;
    return v;
}

export function firstOpt(field: string, ...args: any[]) {
    for (let arg of args) {
        if (typeof arg !== 'object' || Array.isArray(arg)) {
            return arg;
        }
        if (arg && arg[field] !== undefined) {
            return arg[field];
        }
    }
    return undefined;
}

export type MergeFn = (
    current: any,
    updated: any,
    key: string,
    target: AnyObj,
    source: AnyObj
) => any;
export type FieldMap = Record<string, MergeFn>;

export function defaultMergeFn(
    current: any,
    updated: any,
    _key: string,
    _target: AnyObj,
    _source: AnyObj
): any {
    if (Array.isArray(updated)) {
        if (Array.isArray(current)) {
            return current.concat(updated);
        }
        return updated.slice();
    }
    if (updated === null) {
        return updated;
    }
    if (typeof updated === 'object') {
        if (typeof current !== 'object' || !current) {
            return Object.assign({}, updated);
        }
        current = Object.assign({}, current);

        for (let key in updated) {
            const value = updated[key];
            if (value !== undefined) {
                current[key] = value;
            }
        }
        return current;
    }

    return updated;
}

export function makeMergeFn(): MergeFn;
export function makeMergeFn(defaultFn: MergeFn | FieldMap): MergeFn;
export function makeMergeFn(fieldMap: FieldMap, defaultFn?: MergeFn): MergeFn;
export function makeMergeFn(
    fieldMap?: MergeFn | FieldMap,
    defaultFn?: MergeFn
): MergeFn {
    if (!fieldMap) return defaultMergeFn;
    if (typeof fieldMap === 'function') return fieldMap;

    defaultFn = defaultFn || fieldMap._default || defaultMergeFn;

    return function (current, updated, key, target, source) {
        // console.log('custom: ' + key);
        if (fieldMap[key]) {
            const result = fieldMap[key](current, updated, key, target, source);
            return result;
        }
        return defaultFn!(current, updated, key, target, source);
    };
}

export function mergePropertiesWith(
    target: AnyObj,
    source: AnyObj,
    customizer: MergeFn
) {
    for (let key of Object.keys(source)) {
        // const updated = source[key];
        let updated = Object.getOwnPropertyDescriptor(source, key);
        if (!updated) continue;

        const current = target[key];
        // const value = customizer(current, updated, key, target, source);
        const value = customizer(current, updated.value, key, target, source);
        if (value === undefined) continue;
        // target[key] = value;
        updated.value = value;
        Object.defineProperty(target, key, updated);
    }
}

export function mergeWith(
    target: AnyObj,
    source: AnyObj | AnyObj[],
    customizer?: MergeFn | FieldMap
): AnyObj {
    customizer = makeMergeFn(customizer || defaultMergeFn);

    if (Array.isArray(source)) {
        source.forEach((src) => mergeWith(target, src, customizer));
        return target;
    }

    mergePropertiesWith(target, source, customizer);

    // for( let k of Reflect.ownKeys(source)) {
    // 	const current = target[k];
    //   const updated = source[k];
    //
    //   const value = customizer(current, updated, k, target, source);
    //   target[k] = value;
    // }

    return target;
}
