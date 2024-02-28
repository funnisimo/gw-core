import * as ObjectFn from './object';

describe('Object functions', () => {
    test('assignOmitting', () => {
        const dest = {};
        ObjectFn.assignOmitting(['a', 'b', 'c'], dest, {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
        });
        expect(dest).toEqual({ d: 4, e: 5 });

        ObjectFn.assignOmitting('c, d, e', dest, {
            a: 10,
            b: 20,
            c: 30,
            d: 40,
            e: 50,
        });
        expect(dest).toEqual({ a: 10, b: 20, d: 4, e: 5 });
    });

    describe('setDefaults', () => {
        test('null', () => {
            const dest = {} as any;
            ObjectFn.setDefaults(dest, {
                test: null,
            });

            expect(dest.test).toBeNull();
        });
    });

    describe('setOptions', () => {
        test('basic', () => {
            const dest: any = { a: 1, d: { e: 1 } };
            ObjectFn.setOptions(dest, {
                test: null,
                a: 2,
                'b.c': 3,
                d: { f: 1 },
            });

            expect(dest.test).toBeNull();
            expect(dest.a).toEqual(2);
            expect(dest.b.c).toEqual(3);
            expect(dest.d.e).toBeUndefined();
            expect(dest.d.f).toEqual(1);
        });
    });

    describe('kindDefaults', () => {
        test('sets basic values', () => {
            const dest = {} as any;
            ObjectFn.kindDefaults(dest, {
                a: 1,
                b: 2,
                'c.d': 3,
                'e.f.g': 4,
            });

            expect(dest.a).toEqual(1);
            expect(dest.b).toEqual(2);
            expect(dest.c.d).toEqual(3);
            expect(dest.e.f.g).toEqual(4);
        });

        test('honors set values', () => {
            const dest = {
                b: 3,
                c: { h: 2 },
                e: { f: { g: 5 } },
            } as any;
            ObjectFn.kindDefaults(dest, {
                a: 1,
                b: 2,
                'c.d': 3,
                'e.f.g': 4,
            });

            expect(dest.a).toEqual(1);
            expect(dest.b).toEqual(3);
            expect(dest.c.d).toEqual(3);
            expect(dest.e.f.g).toEqual(5);
        });

        test('treats flags as an array', () => {
            const dest = {} as any;
            ObjectFn.kindDefaults(dest, {
                flags: 'TEST',
            });
            expect(dest.flags).toEqual(['TEST']);
        });

        test('concats default value first', () => {
            const dest = {
                flags: 'VALUE',
            } as any;
            ObjectFn.kindDefaults(dest, {
                flags: 'TEST',
            });
            expect(dest.flags).toEqual(['TEST', 'VALUE']);
        });

        test('works with # flags', () => {
            const dest = {
                flags: 8,
            };
            ObjectFn.kindDefaults(dest, {
                flags: 32,
            });
            expect(dest.flags).toEqual([32, 8]);
        });

        test('works with array flags', () => {
            const dest = {
                flags: ['A', 'B'],
            };
            ObjectFn.kindDefaults(dest, {
                flags: ['B', 'C'],
            });
            expect(dest.flags).toEqual(['B', 'C', 'A', 'B']);
        });

        test('works with string flags', () => {
            const dest = {
                flags: 'A, B',
            };
            ObjectFn.kindDefaults(dest, {
                flags: 'B, C',
            });
            expect(dest.flags).toEqual(['B', 'C', 'A', 'B']);
        });
    });

    describe('mergeWith', () => {
        test('simple objects', () => {
            const a = { a: 1, b: 2 };
            const b = { c: 3, d: 4, a: 5 };

            const r = ObjectFn.mergeWith(a, b);
            expect(r).toBe(a);
            expect(r.c).toEqual(b.c);
            expect(r.d).toEqual(b.d);
            expect(r.a).toEqual(b.a);
        });

        test('with functions', () => {
            const a = {
                a() {
                    return 1;
                },
                b: 2,
            };
            const b = {
                c: 3,
                d() {
                    return 4;
                },
                a: 5,
            };

            const r = ObjectFn.mergeWith(a, b);
            expect(r).toBe(a);
            expect(r.c).toEqual(b.c);
            expect(r.d()).toEqual(b.d());
            expect(r.a).toEqual(b.a);
            expect(r.b).toEqual(2);
        });

        test('customizer', () => {
            const a = { a: 1, b: 2 };
            const b = { c: 3, d: 4, a: 5 };

            const fieldMap: ObjectFn.FieldMap = {
                a(_c, u) {
                    return u + 1;
                },
                d() {
                    return () => 99;
                },
            };

            const r = ObjectFn.mergeWith(a, b, fieldMap);
            expect(r).toBe(a);
            expect(r.c).toEqual(b.c);
            expect(r.d()).toEqual(99);
            expect(r.a).toEqual(b.a + 1);
        });

        test.todo("Used defaults syntax?  e.g. { 'a.b.c': 4 } ");
    });
});
