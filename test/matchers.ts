// import { jsxEmptyExpression, JSXEmptyExpression } from "@babel/types";

// declare namespace global {
//   namespace jest {
//     interface Matchers<R> {
//       toFloatEqual(value: number): R;
//     }
//   }
// }

// expect.extend({
//   toFloatEqual(received: number, expected: number): jest.CustomMatcherResult {
//     const pass: boolean = Math.abs(received - expected) < 0.00001;
//     const message: () => string = () =>
//       pass
//         ? ""
//         : `Received float (${received}) is not the same as expected (${expected})`;

//     return {
//       message,
//       pass,
//     };
//   },
// });

// ensure this is parsed as a module.
export {};

declare global {
    namespace jest {
        interface Matchers<R> {
            toFloatEqual(value: number): CustomMatcherResult;
            toBeAtXY(x: number, y: number): CustomMatcherResult;
        }
    }
}
function toFloatEqual(received: number, expected: number) {
    if (typeof expected !== 'number') {
        return {
            pass: false,
            message: () => `Expected (${expected}) must be a number.`,
        };
    }
    if (typeof received !== 'number') {
        return {
            pass: false,
            message: () => `Received (${received}) must be a number.`,
        };
    }

    const diff = Math.abs(expected - received);

    let success = diff < 0.00001;

    return success
        ? {
              pass: true,
              message: () =>
                  `Expected ${received} not to float equal ${expected}`,
          }
        : {
              pass: false,
              message: () => `Expected ${received} to float equal ${expected}`,
          };
}

function toBeAtXY(received: any, x: number, y: number) {
    if (typeof x !== 'number') {
        throw new Error('expected x to be a number');
    }
    if (typeof y !== 'number') {
        throw new Error('expected y to be a number');
    }
    if (!received) {
        throw new Error('expected object to be at XY, but received none.');
    }
    if (typeof received.x !== 'number' || typeof received.y !== 'number') {
        throw new Error('expected value to be object with x and y members');
    }

    let success = received && received.x == x && received.y == y;

    const name = received && received.info ? received.info.id : 'object';

    return success
        ? {
              pass: true,
              message: () => `Expected ${name} not to be at location ${x},${y}`,
          }
        : {
              pass: false,
              message: () =>
                  `Expected ${name} @ ${received.x},${received.y} to be at location ${x},${y}`,
          };
}

expect.extend({
    toFloatEqual,
    toBeAtXY,
});
