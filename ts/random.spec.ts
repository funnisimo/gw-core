import 'jest-extended';
import { random, cosmetic, configure, RandomFunction, SeedFunction } from './random';


function always(testFn: () => any, count=1000) {
    for(let i = 0; i < count; ++i) {
      testFn();
    }
  }
  
describe('random', () => {

    let rnd: jest.Mock<RandomFunction>;
    let make: jest.Mock<SeedFunction>;

    function setupMocks() {
        rnd = jest.fn().mockReturnValue(0.50);
        make = jest.fn().mockReturnValue(rnd);
        // @ts-ignore
        configure({ make });
        make.mockClear();
    }

    test('works with a seed', () => {
        setupMocks();

        random.seed(12345);
        expect(make).toHaveBeenCalledWith(12345);
        expect(random.number(100)).toEqual(50);
        expect(rnd).toHaveBeenCalled();
        make.mockClear();
        rnd.mockClear();

        const rnd2 = jest.fn().mockReturnValue(0.70);
        make.mockReturnValue(rnd2);

        random.seed(12345);
        expect(make).toHaveBeenCalledWith(12345);
        expect(random.number(100)).toEqual(70);
        expect(rnd2).toHaveBeenCalled();
    });
  
    test('gives random percents => [0, 1)', () => {
      always( () => expect(random.value()).toBeWithin(0, 1) );
    });
  
    test('can give a random key from an object', () => {
        setupMocks();
        random.seed(12345);
        const source = {
            a: 1, b: 2, c: 3, d: 4
        };
    
        expect(random.key(source)).toEqual('c');
    });
  
});
  
describe('cosmetic', () => {  
    test('can give random numbers', () => {
      always( () => expect(cosmetic.value()).toBeWithin(0, 1) );
    });
});

