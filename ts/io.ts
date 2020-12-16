import * as Utils from "./utils";

export interface Event {
  shiftKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;

  type: string;
  key: string | null;
  code: string | null;
  x: number;
  y: number;
  clientX: number;
  clientY: number;
  dir: Utils.Loc | null;
  dt: number;
}

export type CommandFn = (event: Event) => Promise<boolean>;
export var commands: Record<string, CommandFn> = {};

export function addCommand(id: string, fn: CommandFn) {
  commands[id] = fn;
}

export type KeyMap = Record<string, CommandFn | boolean>;
export type EventMatchFn = (event: Event) => boolean;

let KEYMAP: KeyMap = {};

const EVENTS: Event[] = [];
const DEAD_EVENTS: Event[] = [];

const LAST_CLICK: Utils.XY = { x: -1, y: -1 };

export const KEYPRESS = "keypress";
export const MOUSEMOVE = "mousemove";
export const CLICK = "click";
export const TICK = "tick";
export const MOUSEUP = "mouseup";

const CONTROL_CODES = [
  "ShiftLeft",
  "ShiftRight",
  "ControlLeft",
  "ControlRight",
  "AltLeft",
  "AltRight",
  "MetaLeft",
  "MetaRight",
];

type EventHandler = (event: Event) => void;
var CURRENT_HANDLER: EventHandler | null = null;
var PAUSED: EventHandler | null = null;

export function setKeymap(keymap: KeyMap) {
  KEYMAP = keymap;
}

export function hasEvents() {
  return EVENTS.length;
}

export function clearEvents() {
  while (EVENTS.length) {
    const ev = EVENTS.shift()!;
    DEAD_EVENTS.push(ev);
  }
}

export function pushEvent(ev: Event) {
  if (PAUSED) {
    console.log("PAUSED EVENT", ev.type);
  }

  if (EVENTS.length) {
    const last = EVENTS[EVENTS.length - 1];
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
    if (LAST_CLICK.x == ev.x && LAST_CLICK.y == ev.y) {
      recycleEvent(ev);
      return;
    }
    LAST_CLICK.x = ev.x;
    LAST_CLICK.y = ev.y;
  } else if (ev.type == MOUSEUP) {
    LAST_CLICK.x = -1;
    LAST_CLICK.y = -1;
    recycleEvent(ev);
    return;
  }

  if (CURRENT_HANDLER) {
    CURRENT_HANDLER(ev);
  } else if (ev.type === TICK) {
    const first = EVENTS[0];
    if (first && first.type === TICK) {
      first.dt += ev.dt;
      recycleEvent(ev);
      return;
    }
    EVENTS.unshift(ev); // ticks go first
  } else {
    EVENTS.push(ev);
  }
}

export async function dispatchEvent(ev: Event, km?: KeyMap | CommandFn) {
  let result;
  let command;

  km = km || KEYMAP;

  if (typeof km === "function") {
    command = km;
  } else if (ev.dir) {
    command = km.dir;
  } else if (ev.type === KEYPRESS) {
    // @ts-ignore
    command = km[ev.key] || km[ev.code] || km.keypress;
  } else if (km[ev.type]) {
    command = km[ev.type];
  }

  if (command) {
    if (typeof command === "function") {
      result = await command.call(km, ev);
    } else if (commands[command]) {
      result = await commands[command](ev);
    } else {
      Utils.WARN("No command found: " + command);
    }
  }

  if ("next" in km && km.next === false) {
    result = false;
  }

  recycleEvent(ev);
  return result;
}

function recycleEvent(ev: Event) {
  DEAD_EVENTS.push(ev);
}

// TICK

export function makeTickEvent(dt: number) {
  const ev: Event = DEAD_EVENTS.pop() || ({} as Event);

  ev.shiftKey = false;
  ev.ctrlKey = false;
  ev.altKey = false;
  ev.metaKey = false;

  ev.type = TICK;
  ev.key = null;
  ev.code = null;
  ev.x = -1;
  ev.y = -1;
  ev.dir = null;
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
    key = "^" + key;
    code = "^" + code;
  }
  if (e.metaKey) {
    key = "#" + key;
    code = "#" + code;
  }
  if (e.altKey) {
    code = "/" + code;
  }

  const ev: Event = DEAD_EVENTS.pop() || ({} as Event);

  ev.shiftKey = e.shiftKey;
  ev.ctrlKey = e.ctrlKey;
  ev.altKey = e.altKey;
  ev.metaKey = e.metaKey;

  ev.type = KEYPRESS;
  ev.key = key;
  ev.code = code;
  ev.x = -1;
  ev.y = -1;
  ev.clientX = -1;
  ev.clientY = -1;
  ev.dir = keyCodeDirection(e.code);
  ev.dt = 0;

  return ev;
}

export function keyCodeDirection(key: string): Utils.Loc | null {
  const lowerKey = key.toLowerCase();

  if (lowerKey === "arrowup") {
    return [0, -1];
  } else if (lowerKey === "arrowdown") {
    return [0, 1];
  } else if (lowerKey === "arrowleft") {
    return [-1, 0];
  } else if (lowerKey === "arrowright") {
    return [1, 0];
  }
  return null;
}

export function ignoreKeyEvent(e: KeyboardEvent) {
  return CONTROL_CODES.includes(e.code);
}

// MOUSE

export var mouse: Utils.XY = { x: -1, y: -1 };

export function makeMouseEvent(e: MouseEvent, x: number, y: number) {
  const ev: Event = DEAD_EVENTS.pop() || ({} as Event);

  ev.shiftKey = e.shiftKey;
  ev.ctrlKey = e.ctrlKey;
  ev.altKey = e.altKey;
  ev.metaKey = e.metaKey;

  ev.type = e.type;
  if (e.buttons && e.type !== "mouseup") {
    ev.type = CLICK;
  }
  ev.key = null;
  ev.code = null;
  ev.x = x;
  ev.y = y;
  ev.clientX = e.clientX;
  ev.clientY = e.clientY;
  ev.dir = null;
  ev.dt = 0;

  return ev;
}

// IO

export function pauseEvents() {
  if (PAUSED) return;
  PAUSED = CURRENT_HANDLER;
  CURRENT_HANDLER = null;
  // io.debug('events paused');
}

export function resumeEvents() {
  if (!PAUSED) return;

  if (CURRENT_HANDLER) {
    console.warn("overwrite CURRENT HANDLER!");
  }

  CURRENT_HANDLER = PAUSED;
  PAUSED = null;
  // io.debug('resuming events');

  if (EVENTS.length && CURRENT_HANDLER) {
    const e: Event = EVENTS.shift()!;
    // io.debug('- processing paused event', e.type);
    CURRENT_HANDLER(e);
    // io.recycleEvent(e);	// DO NOT DO THIS B/C THE HANDLER MAY PUT IT BACK ON THE QUEUE (see tickMs)
  }
  // io.debug('events resumed');
}

export function nextEvent(
  ms?: number,
  match?: EventMatchFn
): Promise<Event | null> {
  match = match || Utils.TRUE;
  let elapsed = 0;

  while (EVENTS.length) {
    const e: Event = EVENTS.shift()!;
    if (e.type === MOUSEMOVE) {
      mouse.x = e.x;
      mouse.y = e.y;
    }

    if (match(e)) {
      return Promise.resolve(e);
    }
    recycleEvent(e);
  }

  let done: Function;

  if (ms === undefined) {
    ms = -1; // wait forever
  }
  if (ms == 0) return Promise.resolve(null);

  if (CURRENT_HANDLER) {
    console.warn("OVERWRITE HANDLER - nextEvent");
  } else if (EVENTS.length) {
    console.warn("SET HANDLER WITH QUEUED EVENTS - nextEvent");
  }

  CURRENT_HANDLER = (e) => {
    if (e.type === MOUSEMOVE) {
      mouse.x = e.x;
      mouse.y = e.y;
    }

    if (e.type === TICK && ms! > 0) {
      elapsed += e.dt;
      if (elapsed < ms!) {
        return;
      }
    } else if (!match!(e)) return;

    CURRENT_HANDLER = null;
    e.dt = elapsed;
    done(e);
  };

  return new Promise((resolve) => (done = resolve));
}

export async function tickMs(ms = 1) {
  let done: Function;

  setTimeout(() => done(), ms);

  return new Promise((resolve) => (done = resolve));
}

export async function nextKeyPress(ms?: number, match?: EventMatchFn) {
  if (ms === undefined) ms = -1;
  match = match || Utils.TRUE;
  function matchingKey(e: Event) {
    if (e.type !== KEYPRESS) return false;
    return match!(e);
  }
  return nextEvent(ms, matchingKey);
}

export async function nextKeyOrClick(ms?: number, matchFn?: EventMatchFn) {
  if (ms === undefined) ms = -1;
  matchFn = matchFn || Utils.TRUE;
  function match(e: Event) {
    if (e.type !== KEYPRESS && e.type !== CLICK) return false;
    return matchFn!(e);
  }
  return nextEvent(ms, match);
}

export async function pause(ms: number) {
  const e = await nextKeyOrClick(ms);
  return e && e.type !== TICK;
}

export function waitForAck() {
  return pause(5 * 60 * 1000); // 5 min
}

export async function loop(keymap: KeyMap) {
  let running = true;
  while (running) {
    const ev = await nextEvent();
    if (ev && (await dispatchEvent(ev, keymap))) {
      running = false;
    }
  }
}
