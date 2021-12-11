import * as Utils from './utils';
import * as XY from './xy';
import * as Queue from './queue';
import { Animator, Animation } from './tween';

export class Event {
    type!: string;
    source: any = null; // original sourcing information
    target: any = null; // current handler information

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
        this.source = null;
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

// type EventHandler = (event: Event) => void;

export function setKeymap(keymap: IOMap) {
    IOMAP = keymap;
}

export function handlerFor(ev: Event, km: Record<string, any>): any | null {
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

export async function dispatchEvent(ev: Event, km: IOMap, thisArg?: any) {
    let result;

    km = km || IOMAP;

    if (ev.type === STOP) {
        recycleEvent(ev);
        return true; // Should stop loops, etc...
    }

    const handler = handlerFor(ev, km);

    if (handler) {
        // if (typeof c === 'function') {
        result = await handler.call(thisArg || km, ev);
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

////////////////////////////////
// HANDLER
export interface EventQueue extends Animator {
    enqueue(ev: Event): void;
    clearEvents(): void;
}

export type TimerFn = () => void;

export interface TimerInfo {
    action: TimerFn;
    time: number;
}

export interface IOHandler {
    nextEvent(ms?: number): Promise<Event | null>;
    nextTick(ms?: number): Promise<Event | null>;
    nextKeyOrClick(ms?: number, match?: EventMatchFn): Promise<Event | null>;
    nextKeyPress(ms?: number, match?: EventMatchFn): Promise<Event | null>;
    pause(ms: number): Promise<boolean>;
    waitForAck(): Promise<boolean>;

    setTimeout(fn: TimerFn, ms: number): void;
    clearTimeout(fn: TimerFn): void;

    run(keymap: IOMap, thisArg?: any): Promise<any>;
    finish(r: any): void;
}

export class Handler implements IOHandler, EventQueue, Animator {
    _running = false;
    _events: Queue.AsyncQueue<Event> = new Queue.AsyncQueue<Event>();
    _result: any = undefined;
    _tweens: Animation[] = [];
    _timers: TimerInfo[] = [];

    mouse: XY.XY = { x: -1, y: -1 };
    lastClick: XY.XY = { x: -1, y: -1 };

    constructor(loop?: Loop) {
        if (loop) {
            loop.pushHandler(this);
        }
    }

    get running() {
        return this._running;
    }

    hasEvents() {
        return this._events.length;
    }

    clearEvents() {
        while (this._events.length) {
            const ev = this._events._data.shift()!;
            DEAD_EVENTS.push(ev);
        }
    }

    enqueue(ev: Event) {
        if (this._events.length) {
            const last = this._events.last!;
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
            if (this.lastClick.x == ev.x && this.lastClick.y == ev.y) {
                recycleEvent(ev);
                return;
            }
            this.lastClick.x = ev.x;
            this.lastClick.y = ev.y;
        } else if (ev.type == MOUSEUP) {
            this.lastClick.x = -1;
            this.lastClick.y = -1;
            recycleEvent(ev);
            return;
        }

        if (ev.type === TICK) {
            const first = this._events.first;
            if (first && first.type === TICK) {
                first.dt += ev.dt;
                recycleEvent(ev);
                return;
            }
            this._events.prepend(ev); // ticks go first
        } else {
            this._events.enqueue(ev);
        }
    }

    async nextEvent(ms = -1, match?: EventMatchFn): Promise<Event | null> {
        match = match || Utils.TRUE;
        let elapsed = 0;

        while (ms < 0 || elapsed < ms) {
            const e: Event = await this._events.dequeue(); // important that ticks are regularly firing
            if (e.type === MOUSEMOVE) {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            }

            if (e.type === TICK) {
                this._tick(e.dt); // run animations and timers
                if (ms > 0) {
                    elapsed += e.dt;
                    if (elapsed > ms) {
                        return null;
                    }
                }
            }
            if (match!(e)) {
                return e;
            }

            recycleEvent(e);
        }
        return null;
    }

    async run(keymap: IOMap = {}, ms = -1, thisArg?: any) {
        if (this._running) throw new Error('IO Handler is already running!');

        thisArg = thisArg || this;
        this._running = true;
        this.clearEvents(); // ??? Should we do this?

        if (keymap.start && typeof keymap.start === 'function') {
            await (<ControlFn>keymap.start).call(thisArg);
        }
        while (this.running) {
            if (keymap.draw && typeof keymap.draw === 'function') {
                (<ControlFn>keymap.draw).call(thisArg);
            }
            const ev = await this.nextEvent(ms);
            if (ev) {
                await dispatchEvent(ev, keymap, thisArg);
            }
        }

        if (keymap.stop && typeof keymap.stop === 'function') {
            await (<ControlFn>keymap.stop).call(thisArg);
        }

        return this._result;
    }

    finish(result?: any) {
        this.clearEvents();
        this._running = false;
        this._result = result;
        this.enqueue(makeStopEvent());
        popHandler(this);
    }

    // IO

    // async tickMs(ms = 1) {
    //     let done: Function;
    //     setTimeout(() => done(), ms);
    //     return new Promise((resolve) => (done = resolve));
    // }

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
        return !!e && e.type !== TICK;
    }

    waitForAck() {
        return this.pause(5 * 60 * 1000); // 5 min
    }

    // Animator

    addAnimation(a: Animation): void {
        if (!a.isRunning()) {
            a.start();
        }
        this._tweens.push(a);
    }

    removeAnimation(a: Animation): void {
        Utils.arrayDelete(this._tweens, a);
    }

    // Timers

    setTimeout(action: TimerFn, time: number) {
        const slot = this._timers.findIndex((t) => t.time <= 0);
        if (slot < 0) {
            this._timers.push({ action, time });
        } else {
            this._timers[slot] = { action, time };
        }
    }

    clearTimeout(action: string | TimerFn) {
        const timer = this._timers.find((t) => t.action === action);
        if (timer) {
            timer.time = -1;
        }
    }

    _tick(dt: number): boolean {
        // fire animations
        this._tweens.forEach((tw) => tw.tick(dt));
        this._tweens = this._tweens.filter((tw) => tw.isRunning());

        for (let timer of this._timers) {
            if (timer.time <= 0) continue; // ignore fired timers
            timer.time -= dt;
            if (timer.time <= 0) {
                timer.action();
            }
        }

        return this._tweens.length > 0;
    }
}

export function make(andPush = true): Handler {
    const handler = new Handler();
    if (andPush) {
        pushHandler(handler);
    }
    return handler;
}

const defaultHandler = new Handler();

export async function nextEvent(ms?: number): Promise<Event | null> {
    pushHandler(defaultHandler);
    const r = await defaultHandler.nextEvent(ms);
    popHandler(defaultHandler);
    return r;
}

export async function nextTick(ms?: number): Promise<Event | null> {
    pushHandler(defaultHandler);
    const r = await defaultHandler.nextTick(ms);
    popHandler(defaultHandler);
    return r;
}

export async function nextKeyOrClick(
    ms?: number,
    match?: EventMatchFn
): Promise<Event | null> {
    pushHandler(defaultHandler);
    const r = await defaultHandler.nextKeyOrClick(ms, match);
    popHandler(defaultHandler);
    return r;
}

export async function nextKeyPress(
    ms?: number,
    match?: EventMatchFn
): Promise<Event | null> {
    pushHandler(defaultHandler);
    const r = await defaultHandler.nextKeyPress(ms, match);
    popHandler(defaultHandler);
    return r;
}

export async function pause(ms: number): Promise<boolean> {
    pushHandler(defaultHandler);
    const r = await defaultHandler.pause(ms);
    popHandler(defaultHandler);
    return r;
}

export async function waitForAck(): Promise<boolean> {
    pushHandler(defaultHandler);
    const r = await defaultHandler.waitForAck();
    popHandler(defaultHandler);
    return r;
}

/////////////////////////////
// LOOP

export interface IOLoop {
    pushHandler(handler: EventQueue): void;
    popHandler(handler: EventQueue): void;
    enqueue(ev: Event): void;
}

export class Loop implements Animator {
    handlers: EventQueue[] = [];
    currentHandler: EventQueue | null = null;
    _tickInterval = 0;

    constructor() {}

    pushHandler(handler: EventQueue): void {
        if (!this.handlers.includes(handler)) {
            this.handlers.push(handler);
        }
        this.currentHandler = handler;
        this._startTicks();
    }
    popHandler(handler: EventQueue): void {
        Utils.arrayDelete(this.handlers, handler);
        this.currentHandler = this.handlers[this.handlers.length - 1] || null;
        if (!this.currentHandler) {
            this._stopTicks();
        }
    }

    enqueue(ev: Event): void {
        if (this.currentHandler) {
            this.currentHandler.enqueue(ev);
        }
    }

    _startTicks() {
        if (this._tickInterval) return;
        this._tickInterval = (setInterval(() => {
            const e = makeTickEvent(16);
            this.enqueue(e);
        }, 16) as unknown) as number;
    }

    _stopTicks() {
        clearInterval(this._tickInterval);
        this._tickInterval = 0;
    }

    onkeydown(e: KeyboardEvent) {
        if (ignoreKeyEvent(e)) return;

        if (this.currentHandler) {
            if (e.code === 'Escape') {
                this.currentHandler.clearEvents(); // clear all current events, then push on the escape
            }

            const ev = makeKeyEvent(e);
            this.enqueue(ev);
        }

        e.preventDefault();
    }

    addAnimation(a: Animation): void {
        if (this.currentHandler) {
            this.currentHandler.addAnimation(a);
        }
    }
    removeAnimation(a: Animation): void {
        if (this.currentHandler) {
            this.currentHandler.removeAnimation(a);
        }
    }
}

export const loop = new Loop();

export function pushHandler(handler: EventQueue) {
    loop.pushHandler(handler);
}

export function popHandler(handler: EventQueue) {
    loop.popHandler(handler);
}

export function enqueue(ev: Event) {
    loop.enqueue(ev);
}
