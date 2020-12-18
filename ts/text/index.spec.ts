
import * as Text from './index';

describe('text', () => {

  test('configure', () => {
    expect(Text.configure).toBeDefined();
    expect(Text.compile).toBeDefined();
    expect(Text.eachChar).toBeDefined();
  });
});
