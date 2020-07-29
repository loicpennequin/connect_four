import * as strings from '.';

describe('kebabToCamelCase', () => {
  it('converts to camel case', () => {
    expect(strings.kebabToCamelCase('my-kebab-cased-string')).toBe(
      'myKebabCasedString'
    );
  });
});

describe('camelToKebabCase', () => {
  it('converts to camel case', () => {
    expect(strings.camelToKebabCase('myCamelCasedString')).toBe(
      'my-camel-cased-string'
    );
  });
});

describe('uppercaseFirstLetter', () => {
  it('uppercases the frist letter of the string', () => {
    expect(strings.upperCaseFirstLetter('foo')).toBe('Foo');
  });
});
