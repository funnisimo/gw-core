import * as List from './list';

/*
Partially adapted from:
https://github.com/binier/tiny-typed-emitter
https://github.com/primus/eventemitter3
*/

export type EventFn = (...args: any[]) => void;

export type Listener<L> = {
    [event in keyof L]: EventFn;
};

export type Events = {
    [k: string]: (...args: any[]) => any;
};

/**
 * Data for an event listener.
 */
export class EventListener implements List.ListItem<EventListener> {
    public fn: EventFn;
    public context: any;
    public once: boolean;
    public next: EventListener | null;

    /**
     * Creates a Listener.
     * @param {EventFn} fn The listener function.
     * @param {any} [context=null] The context to invoke the listener with.
     * @param {boolean} [once=false] Specify if the listener is a one-time listener.
     */
    constructor(fn: EventFn, context?: any, once: boolean = false) {
        this.fn = fn;
        this.context = context || null;
        this.once = once || false;
        this.next = null;
    }

    /**
     * Compares this Listener to the parameters.
     * @param {EventFn} fn - The function
     * @param {any} [context] - The context Object.
     * @param {boolean} [once] - Whether or not it is a one time handler.
     * @returns Whether or not this Listener matches the parameters.
     */
    matches(fn: EventFn, context?: any, once?: boolean) {
        return (
            this.fn === fn &&
            (once === undefined || once == this.once) &&
            (!context || this.context === context)
        );
    }
}

export class EventEmitter<L extends Listener<L> = Events> {
    _events: Record<string, EventListener | null> = {};

    constructor() {}

    /**
     * Add a listener for a given event.
     *
     * @param {String} event The event name.
     * @param {EventFn} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {boolean} once Specify if the listener is a one-time listener.
     * @returns {Listener}
     */
    addListener<U extends keyof L>(
        event: U,
        fn: L[U],
        context?: any,
        once = false
    ): this {
        if (typeof fn !== 'function') {
            throw new TypeError('The listener must be a function');
        }

        const listener = new EventListener(fn, context || null, once);
        List.push(this._events, event as string, listener);
        return this;
    }

    /**
     * Add a listener for a given event.
     *
     * @param {String} event The event name.
     * @param {EventFn} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {boolean} once Specify if the listener is a one-time listener.
     * @returns {Listener}
     */
    on<U extends keyof L>(
        event: U,
        fn: L[U],
        context?: any,
        once = false
    ): this {
        return this.addListener(event, fn, context, once);
    }

    /**
     * Add a one-time listener for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {EventFn} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @public
     */
    once<U extends keyof L>(event: U, fn: L[U], context?: any): this {
        return this.addListener(event, fn, context, true);
    }

    /**
     * Remove the listeners of a given event.
     *
     * @param {String} event The event name.
     * @param {EventFn} fn Only remove the listeners that match this function.
     * @param {*} context Only remove the listeners that have this context.
     * @param {boolean} once Only remove one-time listeners.
     * @returns {EventEmitter} `this`.
     * @public
     */
    removeListener<U extends keyof L>(
        event: U,
        fn: L[U],
        context?: any,
        once = false
    ): this {
        if (!this._events[event as string]) return this;
        if (!fn) return this;

        List.forEach(this._events[event as string], (obj: EventListener) => {
            if (obj.matches(fn, context, once)) {
                List.remove(this._events, event as string, obj);
            }
        });
        return this;
    }

    /**
     * Remove the listeners of a given event.
     *
     * @param {String} event The event name.
     * @param {EventFn} fn Only remove the listeners that match this function.
     * @param {*} context Only remove the listeners that have this context.
     * @param {boolean} once Only remove one-time listeners.
     * @returns {EventEmitter} `this`.
     * @public
     */
    off<U extends keyof L>(
        event: U,
        fn: L[U],
        context?: any,
        once = false
    ): this {
        return this.removeListener(event, fn, context, once);
    }

    /**
     * Clear event by name.
     *
     * @param {String} evt The Event name.
     */
    clearEvent(event?: keyof L): this {
        if (this._events[event as string]) {
            this._events[event as string] = null;
        }
        return this;
    }

    /**
     * Remove all listeners, or those of the specified event.
     *
     * @param {(String|Symbol)} [event] The event name.
     * @returns {EventEmitter} `this`.
     * @public
     */
    removeAllListeners(event?: keyof L): this {
        if (event) {
            this.clearEvent(event);
        } else {
            this._events = {};
        }
        return this;
    }

    /**
     * Calls each of the listeners registered for a given event.
     *
     * @param {String} event The event name.
     * @param {...*} args The additional arguments to the event handlers.
     * @returns {boolean} `true` if the event had listeners, else `false`.
     * @public
     */
    emit<U extends keyof L>(event: U, ...args: Parameters<L[U]>): boolean {
        if (!this._events[event as string]) return false; // no events to send
        let listener = this._events[event as string];

        while (listener) {
            let next = listener.next;
            if (listener.once)
                List.remove(this._events, event as string, listener);
            listener.fn.apply(listener.context, args);
            listener = next;
        }
        return true;
    }
}
