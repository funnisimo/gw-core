import * as IO from './io';
import * as UTILS from '../utils';

export type CancelFn = () => void;

export type CallbackFn = (...args: any[]) => void;

interface CallbackInfo {
    fn: CallbackFn;
    ctx?: any;
    once?: boolean;
}

export type UnhandledFn = (ev: string, ...args: any[]) => void;

export class Events {
    _events: Record<string, (CallbackInfo | null)[]> = {};
    _ctx: any;

    onUnhandled: UnhandledFn | null = null;

    constructor(ctx?: any) {
        this._ctx = ctx;
    }

    on(ev: string | string[], fn: CallbackFn): CancelFn {
        if (Array.isArray(ev)) {
            const cleanup = ev.map((e) => this.on(e, fn));
            return () => {
                cleanup.forEach((c) => c());
            };
        }

        if (!(ev in this._events)) {
            this._events[ev] = [];
        }
        const info = { fn };
        this._events[ev].push(info);
        return () => {
            UTILS.arrayNullify(this._events[ev], info);
        };
    }

    once(ev: string | string[], fn: CallbackFn): CancelFn {
        if (Array.isArray(ev)) {
            const cleanup = ev.map((e) => this.on(e, fn));
            return () => {
                cleanup.forEach((c) => c());
            };
        }

        if (!(ev in this._events)) {
            this._events[ev] = [];
        }
        const info = { fn, once: true };
        this._events[ev].push(info);
        return () => {
            UTILS.arrayNullify(this._events[ev], info);
        };
    }

    off(ev: string | string[], cb: CallbackFn): void {
        if (Array.isArray(ev)) {
            ev.forEach((e) => this.off(e, cb));
            return;
        }

        const events = this._events[ev];
        if (!events) return;

        const current = events.findIndex((i) => i && i.fn === cb);
        if (current > -1) {
            events[current] = null;
        }
    }

    trigger(ev: string | string[], ...args: any[]): boolean {
        if (Array.isArray(ev)) {
            let success = false;
            for (let name of ev) {
                success = this.trigger(name, ...args) || success;
            }
            return success;
        }

        const events = this._events[ev];
        if (!events || events.length == 0) {
            return this._unhandled(ev, args);
        }
        // newer events first (especially for input)
        UTILS.arrayRevEach(events, (info) => {
            info && info.fn.call(this._ctx, ...args);
        });

        this._events[ev] = events.filter((i) => i && !i.once);
        return true;
    }

    _unhandled(ev: string, args: any[]): boolean {
        if (!this.onUnhandled) return false;
        this.onUnhandled(ev, ...args);
        return true;
    }

    dispatch(e: IO.Event) {
        if (e.type === IO.KEYPRESS) {
            const evs = [e.code, 'keypress'];
            if (e.key !== e.code) {
                evs.unshift(e.key);
            }
            if (e.dir) {
                evs.unshift('dir');
            }
            this.trigger(evs, e);
        } else {
            this.trigger(e.type, e);
        }
    }

    clear() {
        this._events = {};
        this.onUnhandled = null;
    }

    restart() {
        Object.keys(this._events).forEach((ev) => {
            this._events[ev] = this._events[ev].filter((i) => i && !i.once);
        });
        this.onUnhandled = null;
    }
}

/*
        let fired = false;
        next = next || UTILS.NOOP;
        const events = this._events[ev];
        if (!events) {
            next();
            return fired;
        }
        let index = -1;

        const ctx = this._ctx;
        function _next() {
            ++index;
            if (index >= events.length) return next!();
            events[index].call(ctx, args, _next);
            fired = true;
        }
        _next();
        return fired;
*/
