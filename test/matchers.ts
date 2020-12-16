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
    }
  }
}
function toFloatEqual(received: number, expected: number) {
  if (typeof expected !== "number") {
    return {
      pass: false,
      message: () => `Expected (${expected}) must be a number.`,
    };
  }
  if (typeof received !== "number") {
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
        message: () => `Expected ${received} not to float equal ${expected}`,
      }
    : {
        pass: false,
        message: () => `Expected ${received} to float equal ${expected}`,
      };
}

expect.extend({
  toFloatEqual,
});
