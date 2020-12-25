import * as Events from "./events";

describe("GW.events", () => {
  test("constructor", () => {
    const fn = jest.fn();
    const ctx = {};
    const a = new Events.Listener(fn, ctx, true);
    expect(a.fn).toBe(fn);
    expect(a.context).toBe(ctx);
    expect(a.once).toBeTruthy();

    const b = new Events.Listener(fn);
    expect(b.fn).toBe(fn);
    expect(b.context).toBeNull();
    expect(b.once).toBeFalsy();

    const fn2 = jest.fn();
    const ctx2 = {};
    expect(a.matches(fn, ctx, true)).toBeTruthy();
    expect(a.matches(fn)).toBeTruthy();
    expect(a.matches(fn, ctx)).toBeTruthy();
    expect(a.matches(fn, ctx2)).toBeFalsy();
    expect(a.matches(fn2)).toBeFalsy();
  });

  test("basic event", async () => {
    const listener = jest.fn();
    Events.on("test", listener);
    await Events.emit("test", 1, 2, 3);
    expect(listener).toHaveBeenCalledWith("test", 1, 2, 3);
  });

  test("handler must be function", () => {
    // @ts-ignore
    expect(() => Events.addListener("test", "test")).toThrow();
  });

  test("basic event removing", async () => {
    const listener = jest.fn();
    Events.on("test", listener);
    Events.off("test", listener);
    await Events.emit("test", 1, 2, 3);
    expect(listener).not.toHaveBeenCalled();
  });

  test("multiple calls", async () => {
    const listener = jest.fn();
    Events.on("test", listener);
    await Events.emit("test", 1, 2, 3);
    await Events.emit("test", 1, 2, 3);
    expect(listener).toHaveBeenCalledTimes(2);

    expect(await Events.emit("other")).toBeFalsy();
  });

  test("once", async () => {
    const listener = jest.fn();
    Events.on("test", listener, undefined, true);
    await Events.emit("test", 1, 2, 3);
    await Events.emit("test", 1, 2, 3);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  test("multiple listeners", async () => {
    const a = jest.fn();
    Events.on("test", a);

    const b = jest.fn();
    Events.on("test", b);

    const c = jest.fn();
    Events.on("test", c);

    await Events.emit("test", 1, 2, 3);
    await Events.emit("test", 1, 2, 3);
    expect(a).toHaveBeenCalledTimes(2);
    expect(b).toHaveBeenCalledTimes(2);
    expect(c).toHaveBeenCalledTimes(2);

    // @ts-ignore
    expect(Events.removeListener("test")).toBeFalsy();
    expect(Events.removeListener("test", a)).toBeTruthy();
    expect(Events.removeListener("test", a)).toBeFalsy();
    expect(Events.removeListener("test", c)).toBeTruthy();
    expect(Events.removeListener("test", b)).toBeTruthy();

    Events.clearEvent("test");
    Events.clearEvent("other");
  });

  test("multiple listeners, some with once", async () => {
    const a = jest.fn();
    Events.on("test", a);

    const b = jest.fn();
    Events.once("test", b);

    const c = jest.fn();
    Events.on("test", c);

    await Events.emit("test", 1, 2, 3);
    await Events.emit("test", 1, 2, 3);
    expect(a).toHaveBeenCalledTimes(2);
    expect(b).toHaveBeenCalledTimes(1);
    expect(c).toHaveBeenCalledTimes(2);

    Events.clearEvent("test");
    expect(Events.removeListener("test", a)).toBeFalsy();
    expect(Events.removeListener("test", b)).toBeFalsy();
    expect(Events.removeListener("test", c)).toBeFalsy();
  });

  test("multiple listeners, first with once", async () => {
    const a = jest.fn();
    Events.once("test", a);

    const b = jest.fn();
    Events.on("test", b);

    const c = jest.fn();
    Events.once("test", c);

    await Events.emit("test", 1, 2, 3);
    await Events.emit("test", 1, 2, 3);
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(2);
    expect(c).toHaveBeenCalledTimes(1);

    Events.removeAllListeners("test");
    expect(Events.removeListener("test", a)).toBeFalsy();
    expect(Events.removeListener("test", b)).toBeFalsy();
    expect(Events.removeListener("test", c)).toBeFalsy();
  });

  test("multiple async listeners", async () => {
    const a = jest.fn().mockResolvedValue(true);
    Events.on("test", a);

    const b = jest.fn().mockResolvedValue(true);
    Events.on("test", b);

    const c = jest.fn().mockResolvedValue(true);
    Events.on("test", c);

    await Events.emit("test", 1, 2, 3);
    await Events.emit("test", 1, 2, 3);
    expect(a).toHaveBeenCalledTimes(2);
    expect(b).toHaveBeenCalledTimes(2);
    expect(c).toHaveBeenCalledTimes(2);

    Events.removeAllListeners();
    expect(Events.removeListener("test", a)).toBeFalsy();
    expect(Events.removeListener("test", b)).toBeFalsy();
    expect(Events.removeListener("test", c)).toBeFalsy();
  });
});
