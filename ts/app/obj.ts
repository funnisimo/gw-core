import * as EVENTS from './events';

export type Tag = string;

/**
 * Cancel the event.
 */

const uid = (() => {
    let id = 0;
    return () => id++;
})();

export interface Comp {
    /**
     * Component ID (if left out won't be treated as a comp).
     */
    id?: Tag;
    /**
     * What other comps this comp depends on.
     */
    require?: Tag[];
    /**
     * Event that runs when host game obj is added to scene.
     */
    add?: () => void;
    /**
     * Event that runs when host game obj is added to scene and game is loaded.
     */
    load?: () => void;
    /**
     * Event that runs every frame.
     */
    update?: () => void;
    /**
     * Event that runs every frame.
     */
    draw?: () => void;
    /**
     * Event that runs when obj is removed from scene.
     */
    destroy?: () => void;
    /**
     * Debug info for inspect mode.
     */
    inspect?: () => string;
}

export class CompObj implements Comp {
    /**
     * Component ID (if left out won't be treated as a comp).
     */
    id?: Tag;
    /**
     * What other comps this comp depends on.
     */
    require?: Tag[];
    /**
     * Event that runs when host game obj is added to scene.
     */
    add?: () => void;
    /**
     * Event that runs when host game obj is added to scene and game is loaded.
     */
    load?: () => void;
    /**
     * Event that runs every frame.
     */
    update?: () => void;
    /**
     * Event that runs every frame.
     */
    draw?: () => void;
    /**
     * Event that runs when obj is removed from scene.
     */
    destroy?: () => void;
    /**
     * Debug info for inspect mode.
     */
    inspect?: () => string;
}

export type GameObjID = number;

// TODO: understand this
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
    k: infer I
) => void
    ? I
    : never;
type Defined<T> = T extends any
    ? Pick<T, { [K in keyof T]-?: T[K] extends undefined ? never : K }[keyof T]>
    : never;
type Expand<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;
type MergeObj<T> = Expand<UnionToIntersection<Defined<T>>>;
type MergeComps<T> = Omit<MergeObj<T>, keyof Comp>;

export type CompList<T> = Array<T | Tag>;

/**
 * Inspect info for a character.
 */
export type GameObjInspect = Record<Tag, string | null>;

/**
 * Base interface of all game objects.
 */
export interface GameObjRaw {
    /**
     * Internal GameObj ID.
     */
    _id: number | null;

    /**
     * Events object.
     */
    events: EVENTS.Events;
    /**
     * If draw the game obj (run "draw" event or not).
     */
    hidden: boolean;
    /**
     * If update the game obj (run "update" event or not).
     */
    paused: boolean;
    /**
     * If game obj exists in scene.
     */
    exists(): boolean;
    /**
     * Add a child.
     *
     * @since v2000.2.0
     */
    add<T>(comps: CompList<T>): GameObj<T>;
    /**
     * Remove a child.
     *
     * @since v2000.2.0
     */
    remove(obj: GameObj): void;
    /**
     * Get the parent game obj, if have any.
     *
     * @since v2000.2.0
     */
    parent: GameObj | null;
    /**
     * Get all children game objects.
     *
     * @since v2000.2.0
     */
    children: GameObj[];
    /**
     * Update this game object and all children game objects.
     *
     * @since v2000.2.0
     */
    update(): void;
    /**
     * Draw this game object and all children game objects.
     *
     * @since v2000.2.0
     */
    draw(): void;
    /**
     * If there's certain tag(s) on the game obj.
     */
    is(tag: Tag | Tag[]): boolean;
    // TODO: update the GameObj type info
    /**
     * Add a component or tag.
     */
    use(comp: Comp | Tag): void;
    // TODO: update the GameObj type info
    /**
     * Remove a tag or a component with its id.
     */
    unuse(comp: Tag): void;
    /**
     * Register an event.
     */
    on(ev: string, action: () => void): EVENTS.CancelFn;
    /**
     * Trigger an event.
     */
    trigger(ev: string, ...args: any[]): void;
    /**
     * Remove the game obj from scene.
     */
    destroy(): void;
    /**
     * Get state for a specific comp.
     */
    c(id: Tag): Comp | undefined;
    /**
     * Gather debug info of all comps.
     */
    inspect(): GameObjInspect;
    /**
     * Register an event that runs every frame as long as the game obj exists.
     *
     * @since v2000.1
     */
    // onUpdate(action: () => void): EVENTS.CancelFn;
    /**
     * Register an event that runs every frame as long as the game obj exists (this is the same as `onUpdate()`, but all draw events are run after all update events).
     *
     * @since v2000.1
     */
    // onDraw(action: () => void): EVENTS.CancelFn;
    /**
     * Register an event that runs when the game obj is destroyed.
     *
     * @since v2000.1
     */
    // onDestroy(action: () => void): EVENTS.CancelFn;
    /**
     * Register an event that runs every frame as long as the game obj exists (alias to onUpdate).
     *
     * @deprecated v2000.1 Use onUpdate() instead.
     */
    // action: GameObjRaw["onUpdate"],
}

/**
 * The basic unit of object in Kaboom. The player, a butterfly, a tree, or even a piece of text.
 */
export type GameObj<T = any> = GameObjRaw & MergeComps<T>;

const COMP_DESC = new Set(['id', 'require']);

const COMP_EVENTS = new Set([
    'add',
    'load',
    'update',
    'draw',
    'destroy',
    'inspect',
]);

function onLoad(_cb: () => void): void {
    // if (game.loaded) {
    // 	cb();
    // } else {
    // 	game.on("load", cb);
    // }
}

interface CompState extends Comp {
    cleanups: Function[];
    [key: string]: any;
}

export function make<T>(comps: CompList<T>): GameObj<T> {
    const compStates: Map<string, CompState> = new Map();
    const customState = { cleanups: [] } as CompState;

    const obj = {
        _id: uid(),
        hidden: false,
        paused: false,
        children: [] as GameObj[],
        parent: null,
        events: new EVENTS.Events(),
        comps: compStates,

        add<T2>(comps: CompList<T2>): GameObj<T2> {
            const obj = make(comps);
            obj.parent = this;
            obj.trigger('add');
            onLoad(() => obj.trigger('load'));
            this.children.push(obj);
            return obj;
        },

        readd(obj: GameObj): GameObj {
            this.remove(obj);
            this.children.push(obj);
            return obj;
        },

        remove(obj: GameObj): void {
            const idx = this.children.indexOf(obj);
            if (idx !== -1) {
                obj.parent = null;
                obj.trigger('destroy');
                this.children.splice(idx, 1);
            }
        },

        removeAll(tag: Tag) {
            this.every(tag, (obj) => this.remove(obj));
        },

        update() {
            if (this.paused) return;
            this.revery((child) => child.update());
            this.trigger('update');
        },

        draw() {
            if (this.hidden) return;
            // gfx.pushTransform();
            // gfx.pushTranslate(this.pos);
            // gfx.pushScale(this.scale);
            // gfx.pushRotateZ(this.angle);
            this.trigger('draw');
            this.every((child) => child.draw());
            // gfx.popTransform();
        },

        // use a comp, or tag
        use(comp: Comp | Tag): void {
            if (!comp) {
                return;
            }

            // tag
            if (typeof comp === 'string') {
                return this.use({
                    id: comp,
                });
            }

            // clear if overwrite
            if (comp.id) {
                this.unuse(comp.id);
                compStates.set(comp.id, { cleanups: [] });
            }

            // state source location
            const state = comp.id ? compStates.get(comp.id)! : customState;

            state.cleanups = [];

            for (let k in comp) {
                if (COMP_DESC.has(k)) {
                    continue;
                }

                // event / custom method
                if (typeof comp[k as keyof Comp] === 'function') {
                    // @ts-ignore
                    const func = comp[k].bind(this);
                    if (COMP_EVENTS.has(k)) {
                        const cxl = this.on(k, func);
                        state.cleanups.push(cxl);
                        state[k] = func;
                        continue;
                    } else {
                        state[k] = func;
                    }
                } else {
                    // @ts-ignore (why?)
                    state[k] = comp[k];
                }

                // @ts-ignore
                if (this[k] === undefined) {
                    // assign comp fields to game obj
                    Object.defineProperty(this, k, {
                        get: () => {
                            return state[k];
                        },
                        set: (val) => {
                            state[k] = val;
                        },
                        configurable: true,
                        enumerable: true,
                    });
                }
            }

            const checkDeps = () => {
                if (!comp.require) {
                    return;
                }
                for (const dep of comp.require) {
                    if (!this.c(dep)) {
                        throw new Error(
                            `comp '${comp.id}' requires comp '${dep}'`
                        );
                    }
                }
            };

            // check deps or run add event
            if (this.exists()) {
                if (comp.add) {
                    comp.add.call(this);
                }
                if (comp.load) {
                    onLoad(() => comp.load!.call(this));
                }
                checkDeps();
            } else {
                if (comp.require) {
                    state.cleanups.push(
                        this.on('add', () => {
                            checkDeps();
                        })
                    );
                }
            }
        },

        unuse(id: Tag) {
            if (compStates.has(id)) {
                const comp = compStates.get(id)!;
                comp.cleanups.forEach((f) => f());
                for (const k in comp) {
                    delete comp[k];
                }
            }
            compStates.delete(id);
        },

        c(id: Tag): Comp | undefined {
            return compStates.get(id);
        },

        // TODO: a recursive variant
        get(t?: Tag | Tag[]): GameObj[] {
            return this.children.filter((child) => (t ? child.is(t) : true));
            // .sort((o1, o2) => {
            // 	// DEPRECATED: layers
            // 	const l1 = game.layers[o1.layer ?? game.defLayer] ?? 0;
            // 	const l2 = game.layers[o2.layer ?? game.defLayer] ?? 0;
            // 	// if on same layer, use "z" comp to decide which is on top, if given
            // 	if (l1 == l2) {
            // 		return (o1.z ?? 0) - (o2.z ?? 0);
            // 	} else {
            // 		return l1 - l2;
            // 	}
            // });
        },

        every<T>(
            t: Tag | Tag[] | ((obj: GameObj) => T),
            f?: (obj: GameObj) => T
        ) {
            if (typeof t === 'function' && f === undefined) {
                return this.get().forEach((obj) => t(obj));
            } else if (typeof t === 'string' || Array.isArray(t)) {
                return this.get(t).forEach((obj) => f!(obj));
            }
        },

        revery<T>(
            t: Tag | Tag[] | ((obj: GameObj) => T),
            f?: (obj: GameObj) => T
        ) {
            if (typeof t === 'function' && f === undefined) {
                return this.get()
                    .reverse()
                    .forEach((obj) => t(obj));
            } else if (typeof t === 'string' || Array.isArray(t)) {
                return this.get(t)
                    .reverse()
                    .forEach((obj) => f!(obj));
            }
        },

        exists(): boolean {
            // if (this.parent === game.root) {
            // 	return true;
            // } else {
            // @ts-ignore
            return this.parent?.exists();
            // }
        },

        is(tag: Tag | Tag[]): boolean {
            if (tag === '*') {
                return true;
            }
            if (Array.isArray(tag)) {
                for (const t of tag) {
                    if (!this.c(t)) {
                        return false;
                    }
                }
                return true;
            } else {
                return this.c(tag) != null;
            }
        },

        on(ev: string, cb: EVENTS.CallbackFn): EVENTS.CancelFn {
            return this.events.on(ev, cb);
        },

        // action(...args): EVENTS.CancelFn {
        // 	return this.onUpdate(...args);
        // },

        trigger(ev: string, ...args: any[]): void {
            this.events.trigger(ev, ...args);

            // const gEvents = game.objEvents[ev];

            // if (gEvents) {
            // 	gEvents.forEach((e) => {
            // 		if (this.is(e.tag)) {
            // 			e.cb(this, ...args);
            // 		}
            // 	});
            // }
        },

        destroy() {
            // @ts-ignore
            this.parent?.remove(this);
        },

        inspect() {
            const info: GameObjInspect = {};
            for (const [tag, comp] of compStates) {
                info[tag] = comp.inspect ? comp.inspect() : null;
            }
            return info;
        },

        onUpdate(cb: () => void): EVENTS.CancelFn {
            return this.on('update', cb);
        },

        onDraw(cb: () => void): EVENTS.CancelFn {
            return this.on('draw', cb);
        },

        onDestroy(action: () => void): EVENTS.CancelFn {
            return this.on('destroy', action);
        },
    };

    obj.events._ctx = obj;

    for (const comp of comps) {
        obj.use(comp);
    }

    return (obj as unknown) as GameObj<T>;
}

/////////////////////////////////
//

export interface LayerComp extends Comp {
    /**
     * Which layer this game obj belongs to.
     */
    layer: string;
}

export function layer(l: string): LayerComp {
    return {
        id: 'layer',
        layer: l,
        inspect() {
            return this.layer ?? 'default';
        },
    };
}

///////////////////////////////////
//

export interface Vec2 {
    x: number;
    y: number;
}

export function vec2(...args: any[]): Vec2 {
    if (args.length === 1) {
        if (Array.isArray(args[0])) {
            args = args[0];
        } else {
            return args[0];
        }
    }
    return { x: args[0] || 0, y: args[1] || 0 };
}

export interface Collision {}

export interface PosComp extends Comp {
    /**
     * Object's current world position.
     */
    pos: Vec2;

    /**
     * Move how many pixels, without multiplying dt, but still checking for 'solid'.
     */
    moveBy(dx: number, dy: number): void;
    moveBy(d: Vec2): void;

    /**
     * Move to a spot with a speed (pixels per second), teleports if speed is not given.
     */
    moveTo(dest: Vec2): void;
    moveTo(x: number, y: number): void;
}

// TODO: manage global velocity here?
export function pos(...args: any[]): PosComp {
    return {
        id: 'pos',
        pos: vec2(...args),

        // TODO: clean
        // moveBy(dx: number, dy: number): Collision | null;
        // moveBy(dxy: Vec2): Collision | null;
        moveBy(...args: any[]): Collision | null {
            const p = vec2(...args);
            let dx = p.x;
            let dy = p.y;
            let col = null;

            this.pos.x += dx;
            this.pos.y += dy;

            return col;
        },

        // move to a destination, with optional speed
        moveTo(...args: any[]): Collision | null {
            const p = vec2(...args);
            let x = p.x;
            let y = p.y;
            let col = null;

            this.pos.x = x;
            this.pos.y = y;

            return col;
        },

        inspect() {
            return `(${Math.round(this.pos.x)}, ${Math.round(this.pos.y)})`;
        },
    };
}
