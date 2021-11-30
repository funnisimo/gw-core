import * as Utils from './utils';
import * as XY from './xy';
import { Animator, Animation } from './tween';

export class Event {
    type!: string;
    target: any = null;

    // Used in UI
    defaultPrevented = false;
    propagationStopped = false;
    immediatePropagationStopped = false;

    // Key Event
    key = '';
    code = '';
    shiftKey = false;
    ctrlKey = false;
    altKey = false;
    metaKey = false;

    // Dir Event extends KeyEvent
    dir: XY.Loc | null = null;

    // Mouse Event
    x = -1;
    y = -1;
    clientX = -1;
    clientY = -1;

    // Tick Event
    dt = 0;

    constructor(type: string, opts?: Partial<Event>) {
        this.reset(type, opts);
    }

    preventDefault() {
        this.defaultPrevented = true;
    }

    stopPropagation() {
        this.propagationStopped = true;
    }

    stopImmediatePropagation() {
        this.immediatePropagationStopped = true;
    }

    reset(type: string, opts?: Partial<Event>) {
        this.type = type;
        this.target = null;
        this.defaultPrevented = false;

        this.shiftKey = false;
        this.ctrlKey = false;
        this.altKey = false;
        this.metaKey = false;

        this.key = '';
        this.code = '';
        this.x = -1;
        this.y = -1;
        this.dir = null;
        this.dt = 0;
        this.target = null;
        if (opts) {
            Object.assign(this, opts);
        }
    }
}

// export type CommandFn = (
//     event: Event
// ) => boolean | void | Promise<boolean | void>;
// export var commands: Record<string, CommandFn> = {};

// export function addCommand(id: string, fn: CommandFn) {
//     commands[id] = fn;
// }

export type ControlFn = () => void | Promise<void>;

export type EventFn = (
    event: Event
) => boolean | void | Promise<boolean | void>;

export type IOMap = Record<string, EventFn | ControlFn>;
export type EventMatchFn = (event: Event) => boolean;

let IOMAP: IOMap = {};

const DEAD_EVENTS: Event[] = [];

export const KEYPRESS = 'keypress';
export const MOUSEMOVE = 'mousemove';
export const CLICK = 'click';
export const TICK = 'tick';
export const MOUSEUP = 'mouseup';
export const STOP = 'stop';

const CONTROL_CODES = [
    'ShiftLeft',
    'ShiftRight',
    'ControlLeft',
    'ControlRight',
    'AltLeft',
    'AltRight',
    'MetaLeft',
    'MetaRight',
];

type EventHandler = (event: Event) => void;

export function setKeymap(keymap: IOMap) {
    IOMAP = keymap;
}

export function handlerFor(ev: Event, km: IOMap): EventFn | ControlFn | null {
    let c;
    if (ev.dir) {
        c = km.dir || km.keypress;
    } else if (ev.type === KEYPRESS) {
        c = km[ev.key] || km[ev.code] || km.keypress;
    } else if (km[ev.type]) {
        c = km[ev.type];
    }
    if (!c) {
        c = km.dispatch;
    }
    return c || null;
}

export async function dispatchEvent(ev: Event, km?: IOMap) {
    let result;

    km = km || IOMAP;

    if (ev.type === STOP) {
        recycleEvent(ev);
        return true; // Should stop loops, etc...
    }

    const handler = handlerFor(ev, km);

    if (handler) {
        // if (typeof c === 'function') {
        result = await handler.call(km, ev);
        // } else if (commands[c]) {
        //     result = await commands[c](ev);
        // } else {
        //     Utils.WARN('No command found: ' + c);
        // }
    }

    // TODO - what is this here for?
    // if ('next' in km && km.next === false) {
    //     result = false;
    // }

    recycleEvent(ev);
    return result;
}

function recycleEvent(ev: Event) {
    DEAD_EVENTS.push(ev);
}

// STOP

export function makeStopEvent() {
    return makeCustomEvent(STOP);
}

// CUSTOM

export function makeCustomEvent(type: string, opts?: Partial<Event>): Event {
    const ev = DEAD_EVENTS.pop() || null;
    if (!ev) return new Event(type, opts);

    ev.reset(type, opts);
    return ev;
}

// TICK

export function makeTickEvent(dt: number): Event {
    const ev = makeCustomEvent(TICK);
    ev.dt = dt;
    return ev;
}

// KEYBOARD

export function makeKeyEvent(e: KeyboardEvent) {
    let key = e.key;
    let code = e.code.toLowerCase();

    if (e.shiftKey) {
        key = key.toUpperCase();
        code = code.toUpperCase();
    }
    if (e.ctrlKey) {
        key = '^' + key;
        code = '^' + code;
    }
    if (e.metaKey) {
        key = '#' + key;
        code = '#' + code;
    }
    if (e.altKey) {
        code = '/' + code;
    }

    const ev: Event = DEAD_EVENTS.pop() || new Event(KEYPRESS);

    ev.shiftKey = e.shiftKey;
    ev.ctrlKey = e.ctrlKey;
    ev.altKey = e.altKey;
    ev.metaKey = e.metaKey;

    ev.type = KEYPRESS;
    ev.defaultPrevented = false;
    ev.key = key;
    ev.code = code;
    ev.x = -1;
    ev.y = -1;
    ev.clientX = -1;
    ev.clientY = -1;
    ev.dir = keyCodeDirection(e.code);
    ev.dt = 0;
    ev.target = null;

    return ev;
}

export function keyCodeDirection(key: string): XY.Loc | null {
    const lowerKey = key.toLowerCase();

    if (lowerKey === 'arrowup') {
        return [0, -1];
    } else if (lowerKey === 'arrowdown') {
        return [0, 1];
    } else if (lowerKey === 'arrowleft') {
        return [-1, 0];
    } else if (lowerKey === 'arrowright') {
        return [1, 0];
    }
    return null;
}

export function ignoreKeyEvent(e: KeyboardEvent) {
    return CONTROL_CODES.includes(e.code);
}

// MOUSE

export function makeMouseEvent(e: MouseEvent, x: number, y: number) {
    const ev: Event = DEAD_EVENTS.pop() || new Event(e.type);

    ev.shiftKey = e.shiftKey;
    ev.ctrlKey = e.ctrlKey;
    ev.altKey = e.altKey;
    ev.metaKey = e.metaKey;

    ev.type = e.type;
    if (e.buttons && e.type !== 'mouseup') {
        ev.type = CLICK;
    }
    ev.defaultPrevented = false;
    ev.key = '';
    ev.code = '';
    ev.x = x;
    ev.y = y;
    ev.clientX = e.clientX;
    ev.clientY = e.clientY;
    ev.dir = null;
    ev.dt = 0;
    ev.target = null;

    return ev;
}

export class Loop implements Animator {
    public running = true;
    public events: Event[] = [];
    public mouse: XY.XY = { x: -1, y: -1 };

    protected _handlers: EventHandler[] = [];
    protected PAUSED = false;
    protected LAST_CLICK: XY.XY = { x: -1, y: -1 };
    protected interval = 0;
    protected intervalCount = 0;
    protected ended = false;
    _animations: (Animation | null)[] = [];

    constructor() {}

    get CURRENT_HANDLER(): EventHandler | null {
        return this._handlers[this._handlers.length - 1] || null;
    }

    hasEvents() {
        return this.events.length;
    }

    clearEvents() {
        while (this.events.length) {
            const ev = this.events.shift()!;
            DEAD_EVENTS.push(ev);
        }
    }

    protected _startTicks() {
        ++this.intervalCount;
        if (this.interval) return;
        this.interval = (setInterval(() => {
            const e = makeTickEvent(16);
            this.pushEvent(e);
        }, 16) as unknown) as number;
    }

    protected _stopTicks() {
        if (!this.intervalCount) return; // too many calls to stop
        --this.intervalCount;
        if (this.intervalCount) return; // still have a loop running
        clearInterval(this.interval);
        this.interval = 0;
    }

    pushEvent(ev: Event) {
        if (this.ended) return;

        if (this.events.length) {
            const last = this.events[this.events.length - 1];
            if (last.type === ev.type) {
                if (last.type === MOUSEMOVE) {
                    last.x = ev.x;
                    last.y = ev.y;
                    recycleEvent(ev);
                    return;
                }
            }
        }

        // Keep clicks down to one per cell if holding down mouse button
        if (ev.type === CLICK) {
            if (this.LAST_CLICK.x == ev.x && this.LAST_CLICK.y == ev.y) {
                recycleEvent(ev);
                return;
            }
            this.LAST_CLICK.x = ev.x;
            this.LAST_CLICK.y = ev.y;
        } else if (ev.type == MOUSEUP) {
            this.LAST_CLICK.x = -1;
            this.LAST_CLICK.y = -1;
            recycleEvent(ev);
            return;
        }

        const h = this.CURRENT_HANDLER;
        if (h && !this.PAUSED) {
            h(ev);
        } else if (ev.type === TICK) {
            const first = this.events[0];
            if (first && first.type === TICK) {
                first.dt += ev.dt;
                recycleEvent(ev);
                return;
            }
            this.events.unshift(ev); // ticks go first
        } else {
            this.events.push(ev);
        }
    }

    nextEvent(ms = -1, match?: EventMatchFn): Promise<Event | null> {
        match = match || Utils.TRUE;
        let elapsed = 0;

        while (this.events.length) {
            const e: Event = this.events.shift()!;
            if (e.type === MOUSEMOVE) {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            }

            if (match(e)) {
                return Promise.resolve(e);
            }
            recycleEvent(e);
        }

        let done: Function;

        if (ms == 0 || this.ended) return Promise.resolve(null);

        // if (this.CURRENT_HANDLER) {
        //     throw new Error(
        //         'OVERWRITE HANDLER -- Check for a missing await around Loop function calls.'
        //     );
        // } else
        if (this.events.length) {
            console.warn('SET HANDLER WITH QUEUED EVENTS - nextEvent');
        }

        const h = (e: Event) => {
            if (e.type === MOUSEMOVE) {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            }

            if (e.type === TICK && ms! > 0) {
                elapsed += e.dt;
                if (elapsed < ms!) {
                    return;
                }
                e.dt = elapsed;
            } else if (!match!(e)) return;

            this._handlers.pop();
            done(e);
        };

        this._handlers.push(h);

        return new Promise((resolve) => (done = resolve));
    }

    async run(keymap: IOMap, ms = -1) {
        if (this.ended) return;

        this.running = true;
        this.clearEvents(); // ??? Should we do this?
        this._startTicks();

        if (keymap.start && typeof keymap.start === 'function') {
            await (<ControlFn>keymap.start)();
        }
        let running = true;
        while (this.running && running) {
            if (keymap.draw && typeof keymap.draw === 'function') {
                (<ControlFn>keymap.draw)();
            }
            if (this._animations.length) {
                const ev = await this.nextTick();
                if (ev && ev.dt) {
                    this._animations.forEach((a) => a && a.tick(ev.dt));
                    this._animations = this._animations.filter(
                        (a) => a && a.isRunning()
                    );
                }
            } else {
                const ev = await this.nextEvent(ms);
                if (ev && (await dispatchEvent(ev, keymap))) {
                    running = false;
                }
            }
        }

        if (keymap.stop && typeof keymap.stop === 'function') {
            await (<ControlFn>keymap.stop)();
        }

        this._stopTicks();
    }

    stop() {
        this.clearEvents();
        this.running = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = 0;
        }
        if (this.CURRENT_HANDLER) {
            this.pushEvent(makeStopEvent());
        }
        // this.CURRENT_HANDLER = null;
    }

    end() {
        this.stop();
        this.ended = true;
    }
    start() {
        this.ended = false;
    }

    // pauseEvents() {
    //     if (this.PAUSED) return;
    //     this.PAUSED = true;
    //     // io.debug('events paused');
    // }

    // resumeEvents() {
    //     if (!this.PAUSED) return;

    //     this.PAUSED = false;
    //     // io.debug('resuming events');

    //     if (this.events.length && this.CURRENT_HANDLER) {
    //         const e: Event = this.events.shift()!;
    //         // io.debug('- processing paused event', e.type);
    //         this.CURRENT_HANDLER(e);
    //         // io.recycleEvent(e);	// DO NOT DO THIS B/C THE HANDLER MAY PUT IT BACK ON THE QUEUE (see tickMs)
    //     }
    //     // io.debug('events resumed');
    // }

    // IO

    async tickMs(ms = 1) {
        let done: Function;
        setTimeout(() => done(), ms);
        return new Promise((resolve) => (done = resolve));
    }

    async nextTick(ms = -1) {
        return this.nextEvent(ms, (e) => e && e.type === TICK);
    }

    async nextKeyPress(ms?: number, match?: EventMatchFn) {
        if (ms === undefined) ms = -1;
        match = match || Utils.TRUE;
        function matchingKey(e: Event) {
            if (e.type !== KEYPRESS) return false;
            return match!(e);
        }
        return this.nextEvent(ms, matchingKey);
    }

    async nextKeyOrClick(ms?: number, matchFn?: EventMatchFn) {
        if (ms === undefined) ms = -1;
        matchFn = matchFn || Utils.TRUE;
        function match(e: Event) {
            if (e.type !== KEYPRESS && e.type !== CLICK) return false;
            return matchFn!(e);
        }
        return this.nextEvent(ms, match);
    }

    async pause(ms: number) {
        const e = await this.nextKeyOrClick(ms);
        return e && e.type !== TICK;
    }

    waitForAck() {
        return this.pause(5 * 60 * 1000); // 5 min
    }

    onkeydown(e: KeyboardEvent) {
        if (ignoreKeyEvent(e)) return;

        if (e.code === 'Escape') {
            this.clearEvents(); // clear all current events, then push on the escape
        }

        const ev = makeKeyEvent(e);
        this.pushEvent(ev);

        e.preventDefault();
    }

    // Animator

    addAnimation(a: Animation): void {
        this._animations.push(a);
    }
    removeAnimation(a: Animation): void {
        Utils.arrayNullify(this._animations, a);
    }
}

export function make() {
    return new Loop();
}

// Makes a default global loop that you access through these funcitons...
export const loop = make();
