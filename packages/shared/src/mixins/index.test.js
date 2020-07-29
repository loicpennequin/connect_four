import * as mixins from '.';

describe('eventMixin', () => {
  let obj;

  beforeEach(() => {
    obj = mixins.eventsMixin();
  });

  it('should correctly register a listener', () => {
    const fn = () => {};
    const fn2 = () => {};
    obj.on('foo', fn);
    obj.once('foo', fn2);
    expect(obj.listeners.foo.length).toBe(2);
  });

  it('should fire all callbacks related to an event when that event is fired', async done => {
    const fn = jest.fn();
    const fn2 = jest.fn();
    const fn3 = jest.fn();

    obj.on('foo', fn);
    obj.on('foo', fn2);
    obj.on('bar', fn3);

    await obj.fireEvent('foo', 123, 456);
    expect(fn).toHaveBeenCalledWith(123, 456);
    expect(fn2).toHaveBeenCalledWith(123, 456);
    expect(fn3).not.toHaveBeenCalled();

    await obj.fireEvent('bar');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn3).toHaveBeenCalled();

    done();
  });

  it('should correctly clean up listeners', () => {
    const fn = jest.fn();

    obj.on('foo', fn);
    obj.off('foo', fn);
    expect(obj.listeners.foo.length).toBe(0);

    let unsubscribe = obj.on('foo', fn);
    unsubscribe();
    expect(obj.listeners.foo.length).toBe(0);

    unsubscribe = obj.once('foo', fn);
    unsubscribe();
    expect(obj.listeners.foo.length).toBe(0);
  });

  it('should self clean events register with .once()', done => {
    const fn = jest.fn();

    obj.once('foo', fn);
    obj.fireEvent('foo');
    expect(obj.listeners.foo.length).toBe(0);
    done();
  });

  it('should not throw when calling an event with no listeners', () => {
    expect(() => obj.fireEvent('foo')).not.toThrow();
  });
});
