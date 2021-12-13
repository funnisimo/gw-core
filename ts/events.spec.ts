import * as Events from './events';

describe('GW.events', () => {
    test('Listener', () => {
        const fn = jest.fn();
        const ctx = {};
        const a = new Events.EventListener(fn, ctx, true);
        expect(a.fn).toBe(fn);
        expect(a.context).toBe(ctx);
        expect(a.once).toBeTruthy();

        const b = new Events.EventListener(fn);
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

    interface TestEvents {
        test: (a: number, b: number, c: number) => void;
        other: () => void;
    }

    let events: Events.EventEmitter<TestEvents>;

    beforeEach(() => {
        events = new Events.EventEmitter<TestEvents>();
    });

    test('basic event', () => {
        const listener = jest.fn();
        events.on('test', listener);
        events.emit('test', 1, 2, 3);
        expect(listener).toHaveBeenCalledWith(1, 2, 3);
    });

    test('handler must be function', () => {
        // @ts-ignore
        expect(() => events.addListener('test', 'test')).toThrow();
    });

    test('basic event removing', () => {
        const listener = jest.fn();
        events.on('test', listener);
        events.off('test', listener);
        events.emit('test', 1, 2, 3);
        expect(listener).not.toHaveBeenCalled();
    });

    test('multiple calls', () => {
        const listener = jest.fn();
        events.on('test', listener);
        events.emit('test', 1, 2, 3);
        events.emit('test', 1, 2, 3);
        expect(listener).toHaveBeenCalledTimes(2);

        expect(events.emit('other')).toBeFalsy();
    });

    test('once', () => {
        const listener = jest.fn();
        events.on('test', listener, undefined, true);
        events.emit('test', 1, 2, 3);
        events.emit('test', 1, 2, 3);
        expect(listener).toHaveBeenCalledTimes(1);
    });

    test('multiple listeners', () => {
        const a = jest.fn();
        events.on('test', a);

        const b = jest.fn();
        events.on('test', b);

        const c = jest.fn();
        events.on('test', c);

        events.emit('test', 1, 2, 3);
        events.emit('test', 1, 2, 3);
        expect(a).toHaveBeenCalledTimes(2);
        expect(b).toHaveBeenCalledTimes(2);
        expect(c).toHaveBeenCalledTimes(2);

        // @ts-ignore
        events.removeListener('test');
        events.removeListener('test', a);
        events.removeListener('test', a);
        events.removeListener('test', c);
        events.removeListener('test', b);

        events.clearEvent('test');
        events.clearEvent('other');
    });

    test('multiple listeners, some with once', () => {
        const a = jest.fn();
        events.on('test', a);

        const b = jest.fn();
        events.once('test', b);

        const c = jest.fn();
        events.on('test', c);

        events.emit('test', 1, 2, 3);
        events.emit('test', 1, 2, 3);
        expect(a).toHaveBeenCalledTimes(2);
        expect(b).toHaveBeenCalledTimes(1);
        expect(c).toHaveBeenCalledTimes(2);

        events.clearEvent('test');
        events.removeListener('test', a);
        events.removeListener('test', b);
        events.removeListener('test', c);
    });

    test('multiple listeners, first with once', () => {
        const a = jest.fn();
        events.once('test', a);

        const b = jest.fn();
        events.on('test', b);

        const c = jest.fn();
        events.once('test', c);

        events.emit('test', 1, 2, 3);
        events.emit('test', 1, 2, 3);
        expect(a).toHaveBeenCalledTimes(1);
        expect(b).toHaveBeenCalledTimes(2);
        expect(c).toHaveBeenCalledTimes(1);

        events.removeAllListeners('test');
        events.removeListener('test', a);
        events.removeListener('test', b);
        events.removeListener('test', c);
    });

    test('multiple  listeners', () => {
        const a = jest.fn().mockResolvedValue(true);
        events.on('test', a);

        const b = jest.fn().mockResolvedValue(true);
        events.on('test', b);

        const c = jest.fn().mockResolvedValue(true);
        events.on('test', c);

        events.emit('test', 1, 2, 3);
        events.emit('test', 1, 2, 3);
        expect(a).toHaveBeenCalledTimes(2);
        expect(b).toHaveBeenCalledTimes(2);
        expect(c).toHaveBeenCalledTimes(2);

        events.removeAllListeners();
        events.removeListener('test', a);
        events.removeListener('test', b);
        events.removeListener('test', c);
    });
});
