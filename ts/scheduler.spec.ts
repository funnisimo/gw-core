import { Scheduler } from './scheduler';

describe('Scheduler', () => {
    test('basic', () => {
        const s = new Scheduler();

        s.push('a', 10);
        s.push('b', 10);
        s.push('c', 10);

        expect(s.pop()).toEqual('a');
        expect(s.time).toEqual(10);
        s.push('a', 10);

        expect(s.pop()).toEqual('b');
        expect(s.time).toEqual(10);
        s.push('b', 10);

        expect(s.pop()).toEqual('c');
        expect(s.time).toEqual(10);
        s.push('c', 10);

        expect(s.pop()).toEqual('a');
        expect(s.time).toEqual(20);
        expect(s.pop()).toEqual('b');
        expect(s.time).toEqual(20);
        expect(s.pop()).toEqual('c');
        expect(s.time).toEqual(20);

        expect(s.pop()).toBeNull();
        expect(s.time).toEqual(20);
    });

    test('differnt times', () => {
        const s = new Scheduler();

        s.push('10', 10);
        s.push('15', 15);
        s.push('25', 25);

        expect(s.pop()).toEqual('10');
        expect(s.time).toEqual(10);
        s.push('10', 10);

        expect(s.pop()).toEqual('15');
        expect(s.time).toEqual(15);
        s.push('15', 15);

        expect(s.pop()).toEqual('10');
        expect(s.time).toEqual(20);
        s.push('10', 10);

        expect(s.pop()).toEqual('25');
        expect(s.time).toEqual(25);

        expect(s.pop()).toEqual('15');
        expect(s.time).toEqual(30);

        expect(s.pop()).toEqual('10');
        expect(s.time).toEqual(30);
    });
});
