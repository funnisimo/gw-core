import * as Utils from '.';

describe('Utils', () => {
    test('basics', () => {
        expect(Utils.NOOP()).toBeUndefined();
        expect(Utils.FALSE()).toBeFalsy();
        expect(Utils.TRUE()).toBeTruthy();
        expect(Utils.IDENTITY(4)).toEqual(4);
    });

    test('clamp', () => {
        expect(Utils.clamp(0, 1, 4)).toEqual(1);
        expect(Utils.clamp(1, 1, 4)).toEqual(1);
        expect(Utils.clamp(4, 1, 4)).toEqual(4);
        expect(Utils.clamp(5, 1, 4)).toEqual(4);
    });

    test('copyXY', () => {
        const dest = { x: 0, y: 0 };

        Utils.copyXY(dest, { x: 4, y: 5 });
        expect(dest).toEqual({ x: 4, y: 5 });

        Utils.copyXY(dest, [2, 3]);
        expect(dest).toEqual({ x: 2, y: 3 });
    });

    test('addXY', () => {
        const dest = { x: 0, y: 0 };

        Utils.addXY(dest, { x: 4, y: 5 });
        expect(dest).toEqual({ x: 4, y: 5 });

        Utils.addXY(dest, [2, 3]);
        expect(dest).toEqual({ x: 6, y: 8 });
    });

    test('equalsXY', () => {
        const dest = { x: 2, y: 3 };

        expect(Utils.equalsXY(dest, { x: 4, y: 5 })).toBeFalsy();
        expect(Utils.equalsXY(dest, { x: 4, y: 3 })).toBeFalsy();
        expect(Utils.equalsXY(dest, { x: 2, y: 5 })).toBeFalsy();
        expect(Utils.equalsXY(dest, { x: 2, y: 3 })).toBeTruthy();

        expect(Utils.equalsXY(dest, [4, 5])).toBeFalsy();
        expect(Utils.equalsXY(dest, [4, 3])).toBeFalsy();
        expect(Utils.equalsXY(dest, [2, 5])).toBeFalsy();
        expect(Utils.equalsXY(dest, [2, 3])).toBeTruthy();
    });

    test('distanceBetween', () => {
        expect(Utils.distanceBetween(5, 0, 10, 0)).toEqual(5);
        expect(Utils.distanceBetween(0, 5, 0, 10)).toEqual(5);
        expect(Utils.distanceBetween(5, 5, 10, 10)).toEqual(5 * 1.4);
    });

    test('distanceFromTo', () => {
        expect(Utils.distanceFromTo({ x: 5, y: 0 }, { x: 10, y: 0 })).toEqual(
            5
        );
        expect(Utils.distanceFromTo([5, 0], [10, 0])).toEqual(5);
    });

    test('dirBetween', () => {
        expect(Utils.dirBetween(0, 0, 3, 0)).toEqual([1, 0]);
        expect(Utils.dirBetween(0, 0, 0, -3)).toEqual([0, -1]);
        expect(Utils.dirBetween(0, 0, 10, 9)).toEqual([1, 1]);
        expect(Utils.dirBetween(0, 0, -10, 9)).toEqual([-1, 1]);
    });

    test('dirFromTo', () => {
        expect(Utils.dirFromTo({ x: 0, y: 0 }, { x: 5, y: -1 })).toEqual([
            1,
            0,
        ]);
        expect(Utils.dirFromTo([0, 0], { x: -5, y: -10 })).toEqual([0, -1]);
    });

    test('dirIndex', () => {
        expect(Utils.dirIndex([0, 0])).toEqual(Utils.NO_DIRECTION);
        expect(Utils.dirIndex([2, 0])).toEqual(Utils.NO_DIRECTION);
        expect(Utils.dirIndex([1, 0])).toEqual(Utils.RIGHT);
        expect(Utils.dirIndex([-1, 1])).toEqual(Utils.LEFT_DOWN);
    });

    test('stepFromTo', () => {
        const fn = jest.fn();
        Utils.stepFromTo([0, 0], [2, 4], fn);
        expect(fn).toHaveBeenCalledWith(0, 0);
        expect(fn).toHaveBeenCalledWith(0, 1);
        expect(fn).toHaveBeenCalledWith(1, 2);
        expect(fn).toHaveBeenCalledWith(1, 3);
        expect(fn).toHaveBeenCalledWith(2, 4);
        expect(fn).toHaveBeenCalledTimes(5);
    });

    test('assignOmitting', () => {
        const dest = {};
        Utils.assignOmitting(['a', 'b', 'c'], dest, {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
        });
        expect(dest).toEqual({ d: 4, e: 5 });

        Utils.assignOmitting('c, d, e', dest, {
            a: 10,
            b: 20,
            c: 30,
            d: 40,
            e: 50,
        });
        expect(dest).toEqual({ a: 10, b: 20, d: 4, e: 5 });
    });

    test('addToChain + removeFromChain', () => {
        const obj = {
            chain: null,
        };

        const a = { next: null };
        const b = { next: null };
        const c = { next: null };
        const d = { next: null };
        const e = { next: null };
        const f = { next: null };

        Utils.addToChain(obj, 'chain', a);
        Utils.addToChain(obj, 'chain', b);
        Utils.addToChain(obj, 'chain', c);
        Utils.addToChain(obj, 'chain', d);
        Utils.addToChain(obj, 'chain', e);
        Utils.addToChain(obj, 'chain', f);
        expect(obj.chain).toBe(f);
        expect(f.next).toBe(e);
        expect(e.next).toBe(d);
        expect(d.next).toBe(c);
        expect(c.next).toBe(b);
        expect(b.next).toBe(a);
        expect(a.next).toBeNull();
        expect(Utils.chainLength(obj.chain)).toEqual(6);

        Utils.removeFromChain(obj, 'chain', c);
        expect(c.next).toBeNull();
        expect(d.next).toBe(b);
        expect(Utils.chainLength(obj.chain)).toEqual(5);
    });

    describe('setDefaults', () => {
        test('null', () => {
            const dest = {} as any;
            Utils.setDefaults(dest, {
                test: null,
            });

            expect(dest.test).toBeNull();
        });
    });

    describe('setOptions', () => {
        test('basic', () => {
            const dest: any = { a: 1, d: { e: 1 } };
            Utils.setOptions(dest, {
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
            Utils.kindDefaults(dest, {
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
            Utils.kindDefaults(dest, {
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
            Utils.kindDefaults(dest, {
                flags: 'TEST',
            });
            expect(dest.flags).toEqual(['TEST']);
        });

        test('concats default value first', () => {
            const dest = {
                flags: 'VALUE',
            } as any;
            Utils.kindDefaults(dest, {
                flags: 'TEST',
            });
            expect(dest.flags).toEqual(['TEST', 'VALUE']);
        });

        test('works with # flags', () => {
            const dest = {
                flags: 8,
            };
            Utils.kindDefaults(dest, {
                flags: 32,
            });
            expect(dest.flags).toEqual([32, 8]);
        });

        test('works with array flags', () => {
            const dest = {
                flags: ['A', 'B'],
            };
            Utils.kindDefaults(dest, {
                flags: ['B', 'C'],
            });
            expect(dest.flags).toEqual(['B', 'C', 'A', 'B']);
        });

        test('works with string flags', () => {
            const dest = {
                flags: 'A, B',
            };
            Utils.kindDefaults(dest, {
                flags: 'B, C',
            });
            expect(dest.flags).toEqual(['B', 'C', 'A', 'B']);
        });
    });

    describe('getLine', () => {
        test('straight', () => {
            const a = Utils.getLine(2, 0, 6, 0);
            expect(a).toEqual([
                [3, 0],
                [4, 0],
                [5, 0],
                [6, 0],
            ]);

            const b = Utils.getLine(0, 2, 0, 6);
            expect(b).toEqual([
                [0, 3],
                [0, 4],
                [0, 5],
                [0, 6],
            ]);

            const c = Utils.getLine(6, 0, 2, 0);
            expect(c).toEqual([
                [5, 0],
                [4, 0],
                [3, 0],
                [2, 0],
            ]);

            const d = Utils.getLine(0, 6, 0, 2);
            expect(d).toEqual([
                [0, 5],
                [0, 4],
                [0, 3],
                [0, 2],
            ]);
        });

        test('diagonal', () => {
            const a = Utils.getLine(2, 0, 6, 4);
            expect(a).toEqual([
                [3, 1],
                [4, 2],
                [5, 3],
                [6, 4],
            ]);

            const b = Utils.getLine(0, 2, 4, 6);
            expect(b).toEqual([
                [1, 3],
                [2, 4],
                [3, 5],
                [4, 6],
            ]);

            const c = Utils.getLine(6, 4, 2, 0);
            expect(c).toEqual([
                [5, 3],
                [4, 2],
                [3, 1],
                [2, 0],
            ]);

            const d = Utils.getLine(4, 6, 0, 2);
            expect(d).toEqual([
                [3, 5],
                [2, 4],
                [1, 3],
                [0, 2],
            ]);
        });

        test('crooked', () => {
            const a = Utils.getLine(2, 0, 5, 5);
            expect(a).toEqual([
                [3, 1],
                [3, 2],
                [4, 3],
                [4, 4],
                [5, 5],
            ]);

            const b = Utils.getLine(0, 2, 5, 5);
            expect(b).toEqual([
                [1, 3],
                [2, 3],
                [3, 4],
                [4, 4],
                [5, 5],
            ]);

            const c = Utils.getLine(5, 5, 2, 0);
            expect(c).toEqual([
                [4, 4],
                [4, 3],
                [3, 2],
                [3, 1],
                [2, 0],
            ]);

            const d = Utils.getLine(5, 5, 0, 2);
            expect(d).toEqual([
                [4, 4],
                [3, 4],
                [2, 3],
                [1, 3],
                [0, 2],
            ]);
        });
    });
});
