import 'jest-extended';
import { random, cosmetic } from './rng';

function always(testFn: () => any, count = 1000) {
    for (let i = 0; i < count; ++i) {
        testFn();
    }
}

describe('random', () => {
    // let rnd: jest.Mock<RandomFunction>;
    // let make: jest.Mock<SeedFunction>;

    // function setupMocks() {
    //   rnd = jest.fn().mockReturnValue(0.5);
    //   make = jest.fn().mockReturnValue(rnd);
    //   // @ts-ignore
    //   Random.configure({ make });
    //   make.mockClear();
    // }

    afterEach(() => {
        // jest.resetAllMocks();
        // Random.configure({ make: () => Math.random.bind(Math) });
    });

    test('works with a seed', () => {
        // setupMocks();

        random.seed(12345);
        // expect(make).toHaveBeenCalledWith(12345);
        expect(random.number(100)).toEqual(1);
        expect(random.number(100)).toEqual(86);
        expect(random.number(100)).toEqual(63);
        // expect(rnd).toHaveBeenCalled();
        // make.mockClear();
        // rnd.mockClear();

        // const rnd2 = jest.fn().mockReturnValue(0.7);
        // make.mockReturnValue(rnd2);

        random.seed(12345);
        // expect(make).toHaveBeenCalledWith(12345);
        expect(random.number(100)).toEqual(1);
        expect(random.number(100)).toEqual(86);
        expect(random.number(100)).toEqual(63);
        // expect(rnd2).toHaveBeenCalled();
    });

    test('number', () => {
        // setupMocks();
        random.seed(12345);
        expect(random.number(100)).toEqual(1);
        expect(random.number(0)).toEqual(0);
        expect(random.number()).toEqual(7789004359467007);
    });

    test('gives random percents => [0, 1)', () => {
        always(() => expect(random.value()).toBeWithin(0, 1));
    });

    test('can give a random key from an object', () => {
        // setupMocks();
        random.seed(12345);
        const source = {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
        };

        expect(random.key(source)).toEqual('a');
        expect(random.key(source)).toEqual('d');
        expect(random.key(source)).toEqual('c');
    });
});

describe('cosmetic', () => {
    test('can give random numbers', () => {
        always(() => expect(cosmetic.value()).toBeWithin(0, 1));
    });
});
