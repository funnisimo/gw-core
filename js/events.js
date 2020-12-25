import * as Utils from "./utils";
/**
 * Data for an event listener.
 */
export class Listener {
    /**
     * Creates a Listener.
     * @param {Function} fn The listener function.
     * @param {Object} [context=null] The context to invoke the listener with.
     * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
     */
    constructor(fn, context, once = false) {
        this.fn = fn;
        this.context = context || null;
        this.once = once || false;
        this.next = null;
    }
    /**
     * Compares this Listener to the parameters.
     * @param {Function} fn - The function
     * @param {Object} [context] - The context Object.
     * @param {Boolean} [once] - Whether or not it is a one time handler.
     * @returns Whether or not this Listener matches the parameters.
     */
    matches(fn, context, once) {
        return (this.fn === fn &&
            (once === undefined || once == this.once) &&
            (!context || this.context === context));
    }
}
var EVENTS = {};
/**
 * Add a listener for a given event.
 *
 * @param {String} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {Listener}
 */
export function addListener(event, fn, context, once = false) {
    if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
    }
    const listener = new Listener(fn, context || null, once);
    Utils.addToChain(EVENTS, event, listener);
    return listener;
}
/**
 * Add a listener for a given event.
 *
 * @param {String} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {Listener}
 */
export function on(event, fn, context, once = false) {
    return addListener(event, fn, context, once);
}
/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
export function once(event, fn, context) {
    return addListener(event, fn, context, true);
}
/**
 * Remove the listeners of a given event.
 *
 * @param {String} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
export function removeListener(event, fn, context, once = false) {
    if (!EVENTS[event])
        return false;
    if (!fn)
        return false;
    let success = false;
    Utils.eachChain(EVENTS[event], (obj) => {
        if (obj.matches(fn, context, once)) {
            Utils.removeFromChain(EVENTS, event, obj);
            success = true;
        }
    });
    return success;
}
/**
 * Remove the listeners of a given event.
 *
 * @param {String} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
export function off(event, fn, context, once = false) {
    return removeListener(event, fn, context, once);
}
/**
 * Clear event by name.
 *
 * @param {String} evt The Event name.
 */
export function clearEvent(event) {
    if (EVENTS[event]) {
        EVENTS[event] = null;
    }
}
/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
export function removeAllListeners(event) {
    if (event) {
        clearEvent(event);
    }
    else {
        EVENTS = {};
    }
}
/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {String} event The event name.
 * @param {...*} args The additional arguments to the event handlers.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
export async function emit(...args) {
    const event = args[0];
    if (!EVENTS[event])
        return false; // no events to send
    let listener = EVENTS[event];
    while (listener) {
        let next = listener.next;
        if (listener.once)
            Utils.removeFromChain(EVENTS, event, listener);
        await listener.fn.apply(listener.context, args);
        listener = next;
    }
    return true;
}
//# sourceMappingURL=events.js.map