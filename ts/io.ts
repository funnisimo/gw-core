import * as Utils from "./utils";
import { make as Make } from "./gw";

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

const DEAD_EVENTS: Event[] = [];

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

export function setKeymap(keymap: KeyMap) {
  KEYMAP = keymap;
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

export class Loop {
  public running = false;
  public events: Event[] = [];
  protected CURRENT_HANDLER: EventHandler | null = null;
  protected PAUSED: EventHandler | null = null;
  protected LAST_CLICK: Utils.XY = { x: -1, y: -1 };

  constructor() {}

  hasEvents() {
    return this.events.length;
  }

  clearEvents() {
    while (this.events.length) {
      const ev = this.events.shift()!;
      DEAD_EVENTS.push(ev);
    }
  }

  pushEvent(ev: Event) {
    if (this.PAUSED) {
      console.log("PAUSED EVENT", ev.type);
    }

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

    if (this.CURRENT_HANDLER) {
      this.CURRENT_HANDLER(ev);
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

  nextEvent(ms?: number, match?: EventMatchFn): Promise<Event | null> {
    match = match || Utils.TRUE;
    let elapsed = 0;

    while (this.events.length) {
      const e: Event = this.events.shift()!;
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

    if (this.CURRENT_HANDLER) {
      console.warn("OVERWRITE HANDLER - nextEvent");
    } else if (this.events.length) {
      console.warn("SET HANDLER WITH QUEUED EVENTS - nextEvent");
    }

    this.CURRENT_HANDLER = (e) => {
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

      this.CURRENT_HANDLER = null;
      e.dt = elapsed;
      done(e);
    };

    return new Promise((resolve) => (done = resolve));
  }

  async run(keymap: KeyMap, ms = -1) {
    const interval = (setInterval(() => {
      const e = makeTickEvent(16);
      this.pushEvent(e);
    }, 16) as unknown) as number;

    this.running = true;
    while (this.running) {
      const ev = await this.nextEvent(ms);
      if (ev && (await dispatchEvent(ev, keymap))) {
        this.running = false;
      }
    }

    clearInterval(interval);
  }

  stop() {
    this.running = false;
  }

  pauseEvents() {
    if (this.PAUSED) return;
    this.PAUSED = this.CURRENT_HANDLER;
    this.CURRENT_HANDLER = null;
    // io.debug('events paused');
  }

  resumeEvents() {
    if (!this.PAUSED) return;

    if (this.CURRENT_HANDLER) {
      console.warn("overwrite CURRENT HANDLER!");
    }

    this.CURRENT_HANDLER = this.PAUSED;
    this.PAUSED = null;
    // io.debug('resuming events');

    if (this.events.length && this.CURRENT_HANDLER) {
      const e: Event = this.events.shift()!;
      // io.debug('- processing paused event', e.type);
      this.CURRENT_HANDLER(e);
      // io.recycleEvent(e);	// DO NOT DO THIS B/C THE HANDLER MAY PUT IT BACK ON THE QUEUE (see tickMs)
    }
    // io.debug('events resumed');
  }

  // IO

  async tickMs(ms = 1) {
    let done: Function;
    setTimeout(() => done(), ms);
    return new Promise((resolve) => (done = resolve));
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
}

export function make() {
  return new Loop();
}

Make.loop = make;

// Makes a default global loop that you access through these funcitons...
export const loop = make();
