import * as List from './list';
import * as Utils from './utils';

interface TestItem {
    next: TestItem | null;
    id: string;
}

interface TestObj {
    chain: TestItem | null;
}

describe('list', () => {
    const obj: TestObj = {
        chain: null,
    };

    const a: TestItem = { next: null, id: 'a' };
    const b: TestItem = { next: null, id: 'b' };
    const c: TestItem = { next: null, id: 'c' };
    const d: TestItem = { next: null, id: 'd' };
    const e: TestItem = { next: null, id: 'e' };
    const f: TestItem = { next: null, id: 'f' };
    const g: TestItem = { next: null, id: 'g' };

    beforeEach(() => {
        obj.chain = null;
        List.push(obj, 'chain', a);
        List.push(obj, 'chain', b);
        List.push(obj, 'chain', c);
        List.push(obj, 'chain', d);
        List.push(obj, 'chain', e);
        List.push(obj, 'chain', f);
    });

    test('remove', () => {
        expect(obj.chain).toBe(f);
        expect(f.next).toBe(e);
        expect(e.next).toBe(d);
        expect(d.next).toBe(c);
        expect(c.next).toBe(b);
        expect(b.next).toBe(a);
        expect(a.next).toBeNull();
        expect(List.length(obj.chain)).toEqual(6);

        expect(List.remove(obj, 'chain', c)).toBeTruthy();
        expect(c.next).toBeNull();
        expect(d.next).toBe(b);
        expect(List.length(obj.chain)).toEqual(5);

        expect(List.remove(obj, 'chain', f)).toBeTruthy();
        expect(obj.chain).toBe(e);
        expect(List.length(obj.chain)).toEqual(4);

        expect(List.remove({}, 'chain', a)).toBeFalsy();
        expect(List.remove(obj, 'chain', g)).toBeFalsy();
    });

    test('at', () => {
        expect(obj.chain).toBe(f);
        expect(f.next).toBe(e);
        expect(e.next).toBe(d);
        expect(d.next).toBe(c);
        expect(c.next).toBe(b);
        expect(b.next).toBe(a);
        expect(a.next).toBeNull();
        expect(List.length(obj.chain)).toEqual(6);

        expect(List.at(obj.chain, 0)).toBe(f);
        expect(List.at(obj.chain, 1)).toBe(e);
        expect(List.at(obj.chain, 10)).toBeNull();

        //        expect(List.at(obj.chain, -1)).toBe(f);
    });

    test('includes', () => {
        expect(List.includes(obj.chain, a)).toBeTruthy();
        expect(List.includes(obj.chain, c)).toBeTruthy();
        expect(List.includes(obj.chain, f)).toBeTruthy();
        expect(List.includes(obj.chain, g)).toBeFalsy();
    });

    test('forEach', () => {
        const fn = jest.fn();
        List.forEach(obj.chain, fn);
        expect(fn).toHaveBeenCalledTimes(6);
        expect(fn).toHaveBeenCalledWith(a, 5);
        expect(fn).toHaveBeenCalledWith(b, 4);
        expect(fn).toHaveBeenCalledWith(c, 3);
        expect(fn).toHaveBeenCalledWith(d, 2);
        expect(fn).toHaveBeenCalledWith(e, 1);
        expect(fn).toHaveBeenCalledWith(f, 0);
    });

    test('find', () => {
        expect(List.find(obj.chain, (t) => t.id == 'b')).toBe(b);
        expect(List.find(obj.chain, Utils.FALSE)).toBeNull();
        expect(List.find(null, Utils.TRUE)).toBeNull();
    });

    test('insert', () => {
        // first item no sort fn
        while (obj.chain) {
            List.remove(obj, 'chain', obj.chain);
        }
        List.insert(obj, 'chain', a);
        expect(obj.chain).toBe(a);

        const sortFn = jest.fn().mockReturnValue(-1);

        // first item
        while (obj.chain) {
            List.remove(obj, 'chain', obj.chain);
        }

        List.insert(obj, 'chain', a, sortFn);
        expect(obj.chain).toBe(a);
        expect(a.next).toBeNull();
        expect(sortFn).not.toHaveBeenCalled();

        // add as root
        sortFn.mockReturnValue(-2);
        List.insert(obj, 'chain', b, sortFn);
        expect(obj.chain).toBe(b);
        expect(b.next).toBe(a);
        expect(a.next).toBeNull();

        // last item
        sortFn.mockReturnValue(1);
        List.insert(obj, 'chain', f, sortFn);
        expect(a.next).toBe(f);
        expect(f.next).toBeNull();

        // middle item
        sortFn.mockReturnValueOnce(1).mockReturnValueOnce(1).mockReturnValueOnce(-1);
        List.insert(obj, 'chain', e, sortFn);
        expect(a.next).toBe(e);
        expect(e.next).toBe(f);
    });

    test('reduce', () => {
        let count = 0;
        expect(List.reduce(obj.chain, (out) => out + 1, 0)).toEqual(6);

        while(obj.chain) {
            List.remove(obj, 'chain', obj.chain);
        }

        // empty
        expect( () => List.reduce(null, Utils.TRUE, false)).toThrow();


    });
});
