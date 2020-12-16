import * as Events from "./events";

describe("GW.events", () => {
  test("basic event", async () => {
    const listener = jest.fn();
    Events.on("test", listener);
    await Events.emit("test", 1, 2, 3);
    expect(listener).toHaveBeenCalledWith("test", 1, 2, 3);
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
  });
});
