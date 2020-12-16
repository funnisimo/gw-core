import * as Utils from "./utils";

export type EventFn = (...args: any[]) => Promise<any>;

/**
 * Data for an event listener.
 */
export class Listener implements Utils.Chainable {
  public fn: EventFn;
  public context: any;
  public once: boolean;
  public next: Listener | null;

  /**
   * Creates a Listener.
   * @param {Function} fn The listener function.
   * @param {Object} [context=null] The context to invoke the listener with.
   * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
   */
  constructor(fn: EventFn, context?: any, once = false) {
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
  matches(fn: EventFn, context?: any, once?: boolean) {
    return (
      this.fn === fn &&
      (once === undefined || once == this.once) &&
      (!context || this.context === context)
    );
  }
}

var EVENTS: Record<string, Listener | null> = {};

/**
 * Add a listener for a given event.
 *
 * @param {String} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {Listener}
 */
export function addListener(
  event: string,
  fn: EventFn,
  context?: any,
  once = false
) {
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
export function on(event: string, fn: EventFn, context?: any, once = false) {
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
export function once(event: string, fn: EventFn, context?: any) {
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
export function removeListener(
  event: string,
  fn: EventFn,
  context?: any,
  once = false
) {
  if (!EVENTS[event]) return;
  if (!fn) {
    clearEvent(event);
    return;
  }

  Utils.eachChain(EVENTS[event], (obj: Utils.Chainable) => {
    const l: Listener = obj as Listener;
    if (l.matches(fn, context, once)) {
      Utils.removeFromChain(EVENTS, event, l);
    }
  });
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
export function off(event: string, fn: EventFn, context?: any, once = false) {
  removeListener(event, fn, context, once);
}

/**
 * Clear event by name.
 *
 * @param {String} evt The Event name.
 */
export function clearEvent(event: string) {
  EVENTS[event] = null;
}

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
export function removeAllListeners(event: string) {
  if (event) {
    if (EVENTS[event]) clearEvent(event);
  } else {
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
export async function emit(...args: any[]) {
  const event = args[0];
  if (!EVENTS[event]) return false; // no events to send
  let listener = EVENTS[event];

  while (listener) {
    let next = listener.next;
    if (listener.once) Utils.removeFromChain(EVENTS, event, listener);
    await listener.fn.apply(listener.context, args);
    listener = next;
  }
  return true;
}
