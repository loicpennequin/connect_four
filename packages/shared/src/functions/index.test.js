import * as functions from '.'

describe('noop', () => {
    it('returns void(0)', () => {
        expect(functions.noop()).toEqual(void(0))
    })
})

describe('getParamsNames', () => {
    it('correctly returns an array of parameter names', () => {
        let fn = function(foo, bar, baz) {}
        expect(functions.getParamNames(fn)).toEqual(['foo', 'bar', 'baz'])
    })
    
    it('returns an empty array when the function has no arguments', () => {
        let fn = function() {}
        expect(functions.getParamNames(fn)).toEqual([])
    })
})

describe('debounce', () => {
    it('runs only the function once after one second', () => {
        jest.useFakeTimers()
        const fn = jest.fn();
        const debounced = functions.debounce(fn, 1000);
        debounced()
        debounced()
        jest.runAllTimers()
        expect(fn).toHaveBeenCalledTimes(1)
    })
    
    it('runs the function immediately when passing the immediate parameter', () => {
        jest.useFakeTimers()
        const fn = jest.fn();
        const debounced = functions.debounce(fn, 1000, true);
        debounced()
        debounced()
        jest.runAllTimers()
        expect(fn).toHaveBeenCalledTimes(1)
    })
})

describe('throttle', () => {
    it('runs only the function once immediately', () => {
        const fn = jest.fn();
        const throttled = functions.throttle(fn, 1000);
        throttled()
        throttled()
        expect(fn).toHaveBeenCalledTimes(1)
    })
})