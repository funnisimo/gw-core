import 'jest-extended';
import * as Text from './index';

describe('text', () => {

  afterEach( () => {
    Text.configure({
      fg: null,
      bg: null,
      colorStart: 'Ω',
      colorEnd: '∆',
      field: '§'
    });
  });

  test('exports', () => {
    expect(Text.configure).toBeFunction();
    expect(Text.compile).toBeFunction();
    expect(Text.apply).toBeFunction();
    expect(Text.eachChar).toBeFunction();
    expect(Text.length).toBeFunction();
    expect(Text.padStart).toBeFunction();
    expect(Text.padEnd).toBeFunction();
    expect(Text.center).toBeFunction();
    expect(Text.firstChar).toBeFunction();
    expect(Text.capitalize).toBeFunction();
    expect(Text.removeColors).toBeFunction();
    expect(Text.wordWrap).toBeFunction();
    expect(Text.splitIntoLines).toBeFunction();
    expect(Text.addHelper).toBeFunction();
    expect(Text.configure).toBeFunction();
  });

  test('default options', () => {
    expect(Text.options).toBeObject();
    expect(Text.options.defaultFg).toBeNull();
    expect(Text.options.defaultBg).toBeNull();
    expect(Text.options.colorStart).toEqual('Ω');
    expect(Text.options.colorEnd).toEqual('∆');
    expect(Text.options.field).toEqual('§');
  });

  test('configure', () => {
    Text.configure({
      fg: 'blue',
      bg: 0x333,
      colorStart: '!',
      colorEnd: '#',
      field: '$'
    });

    expect(Text.options.defaultFg).toEqual('blue');
    expect(Text.options.defaultBg).toEqual(0x333);
    expect(Text.options.colorStart).toEqual('!');
    expect(Text.options.colorEnd).toEqual('#');
    expect(Text.options.field).toEqual('$');
  });

  test('not configuring anything', () => {
    Text.configure();
    expect(Text.options).toBeObject();
    expect(Text.options.defaultFg).toBeNull();
    expect(Text.options.defaultBg).toBeNull();
    expect(Text.options.colorStart).toEqual('Ω');
    expect(Text.options.colorEnd).toEqual('∆');
    expect(Text.options.field).toEqual('§');
  });

});
