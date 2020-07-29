import * as objects from '.';

describe('pick', () => {
  it('returns an object containing only the specified keys', () => {
    let obj = {
      foo: true,
      bar: true,
      baz: true
    };

    expect(objects.pick(obj, ['foo', 'bar'])).toEqual({ foo: true, bar: true})    
    expect(objects.pick(obj)).toEqual({})
    expect(objects.pick(undefined, ['foo', 'bar'])).toEqual({})
  });
});

describe('mapObject', () => {
    const obj = {
        foo: 1,
        bar: 2
    }

    it('correctly map keys', () => {
        expect(objects.mapObject(obj, undefined, key => key.toUpperCase())).toEqual({
            FOO: 1,
            BAR: 2
        })
    })
    
    it('correctly map values', () => {
        expect(objects.mapObject(obj, value => value * 2)).toEqual({
            foo: 2,
            bar: 4
        })
    })
})