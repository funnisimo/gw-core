import 'jest-extended';
import { Schedule, TaskResult, TaskType, TurnBased } from './schedule';

describe('Schedule', () => {
    test('basic', () => {
        const s = new Schedule();
        const a = jest.fn();
        const b = jest.fn();
        const c = jest.fn();

        s.push(a, 10);
        s.push(b, 10);
        s.push(c, 10);

        expect(s.pop()).toEqual(a);
        expect(s.time).toEqual(10);
        s.push(a, 10);

        expect(s.pop()).toEqual(b);
        expect(s.time).toEqual(10);
        s.push(b, 10);

        expect(s.pop()).toEqual(c);
        expect(s.time).toEqual(10);
        s.push(c, 10);

        expect(s.pop()).toEqual(a);
        expect(s.time).toEqual(20);
        expect(s.pop()).toEqual(b);
        expect(s.time).toEqual(20);
        expect(s.pop()).toEqual(c);
        expect(s.time).toEqual(20);

        expect(s.pop()).toBeNull();
        expect(s.time).toEqual(20);
    });

    test('differnt times', () => {
        const s = new Schedule();
        const t10 = jest.fn();
        const t15 = jest.fn();
        const t25 = jest.fn();

        s.push(t10, 10);
        s.push(t15, 15);
        s.push(t25, 25);

        expect(s.pop()).toEqual(t10);
        expect(s.time).toEqual(10);
        s.push(t10, 10);

        expect(s.pop()).toEqual(t15);
        expect(s.time).toEqual(15);
        s.push(t15, 15);

        expect(s.pop()).toEqual(t10);
        expect(s.time).toEqual(20);
        s.push(t10, 10);

        expect(s.pop()).toEqual(t25);
        expect(s.time).toEqual(25);

        expect(s.pop()).toEqual(t15);
        expect(s.time).toEqual(30);

        expect(s.pop()).toEqual(t10);
        expect(s.time).toEqual(30);
    });
});

describe('TurnBased', () => {
    test('a + b', () => {
        const turn_over = (c: TaskType) => c === a;

        let s = new TurnBased(turn_over);
        let a = jest.fn().mockReturnValue(TaskResult.Ok(10));
        let b = jest.fn().mockReturnValue(TaskResult.Ok(10));

        s.add(a, 10);
        s.add(b, 10);

        s.update(16);

        expect(a).toHaveBeenCalledOnce();
        expect(b).not.toHaveBeenCalled();

        a.mockClear();

        s.update(16);
        expect(a).toHaveBeenCalledOnce();
        expect(b).toHaveBeenCalledOnce();

        a.mockClear();
        b.mockClear();

        s.update(16);
        expect(a).toHaveBeenCalledOnce();
        expect(b).toHaveBeenCalledOnce();
    });

    test('a needs input', () => {
        const turn_over = (c: TaskType) => c === a;

        let s = new TurnBased(turn_over);
        let a = jest.fn().mockReturnValue(TaskResult.Retry());
        let b = jest.fn().mockReturnValue(TaskResult.Ok(10));

        s.add(a, 10);
        s.add(b, 10);

        s.update(16);
        expect(a).toHaveBeenCalledOnce();
        expect(b).not.toHaveBeenCalled();

        a.mockClear();

        s.update(16);
        expect(a).toHaveBeenCalledOnce();
        expect(b).not.toHaveBeenCalled();

        a.mockClear();
    });
});
