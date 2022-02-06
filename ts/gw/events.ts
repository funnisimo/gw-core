import * as UTILS from '../utils';

export type CancelFn = () => void;

export type CallbackFn = (...args: any[]) => void;

export class Events {
    _events: Record<string, UTILS.DeleteArray<CallbackFn>> = {};
    _ctx: any;

    constructor(ctx?: any) {
        this._ctx = ctx;
    }

    on(ev: string, cb: CallbackFn): CancelFn {
        if (!(ev in this._events)) {
            this._events[ev] = new UTILS.DeleteArray<CallbackFn>();
        }
        return this._events[ev].pushd(cb);
    }

    trigger(ev: string, ...args: any[]): boolean {
        const events = this._events[ev];
        if (!events) {
            return false;
        }
        // newer events first (especially for input)
        UTILS.arrayRevEach(events, (fn) => fn.call(this._ctx, ...args));
        return events.length > 0;
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
