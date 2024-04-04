import 'jest-extended';
import * as CALC from './calc';
import { random } from './rng';

describe('CALC', () => {
    beforeEach(() => {
        random.seed(12345);
    });

    test('can return constant values', () => {
        let fn = CALC.make(6);
        expect(fn(random)).toEqual(6);
        expect(fn.min).toEqual(6);
        expect(fn.max).toEqual(6);
        expect(fn.toString()).toEqual('6');

        expect(CALC.make(-6)(random)).toEqual(-6);
    });

    test('can return constant values from strings', () => {
        let fn = CALC.make('6');
        expect(fn(random)).toEqual(6);
        expect(fn.min).toEqual(6);
        expect(fn.max).toEqual(6);
        expect(fn.toString()).toEqual('6');

        expect(CALC.make('-6')(random)).toEqual(-6);
    });

    test('can do multiple constant values tailed together', () => {
        let fn = CALC.make('3+3-4');
        expect(fn(random)).toEqual(2);
        expect(fn.min).toEqual(2);
        expect(fn.max).toEqual(2);
        expect(fn.toString()).toEqual('2');
    });

    test('can do simple dice', () => {
        let fn = CALC.make('1d6');
        expect(fn(random)).toBeWithin(1, 7);
        expect(fn.min).toEqual(1);
        expect(fn.max).toEqual(6);
        expect(fn.toString()).toEqual('1-6');
    });

    test('can combine dice', () => {
        let fn = CALC.make('1d6+2d4');
        expect(fn(random)).toBeWithin(3, 15);
        expect(fn.min).toEqual(3);
        expect(fn.max).toEqual(14);
        expect(fn.toString()).toEqual('3-14');
    });

    test('can do multipliers', () => {
        let fn = CALC.make('6*2');
        expect(fn(random)).toEqual(12);
        expect(fn.min).toEqual(12);
        expect(fn.max).toEqual(12);
        expect(fn.toString()).toEqual('12');

        expect(CALC.make('1d6*2')(random)).toBeEven();
    });

    test('can do division to (for an unknown reason)', () => {
        let fn = CALC.make('6/2');
        expect(fn(random)).toEqual(3);
        expect(fn.min).toEqual(3);
        expect(fn.max).toEqual(3);
        expect(fn.toString()).toEqual('3');

        expect(CALC.make('2d6/2')(random)).toBeWithin(1, 7);
    });

    test('can do ranges', () => {
        expect(CALC.calc('3:6')).toBeWithin(3, 6);
        let fn = CALC.make('3:6');
        expect(fn.min).toEqual(3);
        expect(fn.max).toEqual(6);
        expect(fn.toString()).toEqual('3-6');
    });

    test('can handle a min/max range as an array', () => {
        expect(CALC.calc([2, 6])).toBeWithin(2, 6);
        const fn = CALC.make([2, 6]);
        expect(fn.min).toEqual(2);
        expect(fn.max).toEqual(6);
        expect(fn.toString()).toEqual('2-6');
    });

    test.todo('normal distributions?');
    test.todo('use rng in string config?');

    test('can handle null or undefined or empty/missing string', () => {
        // @ts-ignore
        expect(CALC.calc()).toEqual(0);
        // @ts-ignore
        expect(CALC.calc(null)).toEqual(0);
        // @ts-ignore
        expect(CALC.calc(undefined)).toEqual(0);
        expect(CALC.calc('')).toEqual(0);
    });

    test.todo('Allow variables');
});
