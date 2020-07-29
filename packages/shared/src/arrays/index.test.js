import * as arrays from '.';

describe('filterEmpty', () => {
  it('should return an empty array when no argument is provided', () => {
    expect(arrays.filterEmpty().length).toBe(0);
  });
  it('should correctly removes undefined and null values from array', () => {
    const arr = [1, 2, 3, undefined, null];
  });

  it('should not filter out other falsy values', () => {
    const arr = [0, '', false];
    expect(arrays.filterEmpty(arr).length).toBe(3);
  });
});

describe('intersection', () => {
  const arrayA = [1, 2, 3, 4, 5];
  const arrayB = [3, 4, 5, 6];

  expect(arrays.intersection(arrayA, arrayB)).toEqual(
    expect.arrayContaining([3, 4, 5])
  );
});

describe('arrayToObject', () => {
  const foo = { id: 1, name: 'foo' };
  const bar = { id: 2, name: 'bar' };
  const array = [foo, bar];
  it('Correctly maps an array of objects to an object', () => {
    let mapped = arrays.arrayToObject(array);
    expect(Object.keys(mapped)).toEqual(expect.arrayContaining(['1', '2']));
    expect(mapped['1']).toEqual(expect.objectContaining(foo));
    expect(mapped['2']).toEqual(expect.objectContaining(bar));

    mapped = arrays.arrayToObject(array, 'id');
    expect(Object.keys(mapped)).toEqual(expect.arrayContaining(['1', '2']));
    expect(mapped['1']).toEqual(expect.objectContaining(foo));
    expect(mapped['2']).toEqual(expect.objectContaining(bar));
  });

  it('Correctly apply keyMapping function to resulting object', () => {
    const mapped = arrays.arrayToObject(array, val => val.name);
    expect(Object.keys(mapped)).toEqual(expect.arrayContaining(['foo', 'bar']));
  });

  it('Correctly apply valueMapping function to resulting object', () => {
    const mapped = arrays.arrayToObject(array, undefined, val =>
      val.name.toUpperCase()
    );

    expect(mapped['1']).toEqual('FOO');
    expect(mapped['2']).toEqual('BAR');
  });
});
