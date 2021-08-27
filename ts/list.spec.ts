import * as List from './list';

describe('list', () => {
    test('push + remove', () => {
        const obj = {
            chain: null,
        };

        const a = { next: null };
        const b = { next: null };
        const c = { next: null };
        const d = { next: null };
        const e = { next: null };
        const f = { next: null };

        List.push(obj, 'chain', a);
        List.push(obj, 'chain', b);
        List.push(obj, 'chain', c);
        List.push(obj, 'chain', d);
        List.push(obj, 'chain', e);
        List.push(obj, 'chain', f);
        expect(obj.chain).toBe(f);
        expect(f.next).toBe(e);
        expect(e.next).toBe(d);
        expect(d.next).toBe(c);
        expect(c.next).toBe(b);
        expect(b.next).toBe(a);
        expect(a.next).toBeNull();
        expect(List.length(obj.chain)).toEqual(6);

        List.remove(obj, 'chain', c);
        expect(c.next).toBeNull();
        expect(d.next).toBe(b);
        expect(List.length(obj.chain)).toEqual(5);
    });
});
