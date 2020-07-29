import * as assertions from '.';

describe('isFunction', () => {
  it('correctly detects functions', () => {
    const fn = jest.fn();
    const notFn = 'not a function';

    expect(assertions.isFunction(fn)).toBe(true);
    expect(assertions.isFunction(notFn)).toBe(false);
  });

  it('does not execute the function being tested', () => {
    const fn = jest.fn();

    assertions.isFunction(fn);
    expect(fn).not.toHaveBeenCalled();
  });
});

describe('isUndefined', () => {
  it('correctly detects undefined', () => {
    expect(assertions.isUndefined(undefined)).toBe(true);
    expect(assertions.isUndefined('undefined')).toBe(false);
  });

  it('correctly detects null', () => {
    expect(assertions.isUndefined(null)).toBe(true);
  });
});

describe('isDefined', () => {
  it('correctly detects defined value', () => {
    expect(assertions.isDefined(undefined)).toBe(false);
    expect(assertions.isDefined('not undefined')).toBe(true);
  });
});

describe('isObject', () => {
  it('correctly detects objects', () => {
    expect(assertions.isObject({ foo: 'bar' })).toBe(true);
    expect(assertions.isObject({})).toBe(true);
    expect(assertions.isObject('not an object')).toBe(false);
    expect(assertions.isObject([])).toBe(false);
    expect(assertions.isObject(null)).toBe(false);
  });
});

describe('isEmptyObject', () => {
  it('correctly detects empty objects', () => {
    expect(assertions.isEmptyObject('not an object')).toBe(false);
    expect(assertions.isEmptyObject({ foo: 'bar' })).toBe(false);
    expect(assertions.isEmptyObject([])).toBe(false);
    expect(assertions.isEmptyObject(null)).toBe(false);
    expect(assertions.isEmptyObject({})).toBe(true);
  });
});
