export function getParamNames(func) {
    const STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/gm;
    const ARGUMENT_NAMES = /([^\s,]+)/g;
    let fnStr = func.toString().replace(STRIP_COMMENTS, '');
    let result = fnStr
        .slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
        .match(ARGUMENT_NAMES);
    if (result === null) result = [];
    return result;
}

export const debounce = (func, wait, immediate) => {
    let timeout;
    return function debounced() {
        return new Promise(async resolve => {
            const context = this;
            const args = arguments;

            const later = async () => {
                timeout = null;
                if (!immediate) resolve(await func.apply(context, args));
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) resolve(await func.apply(context, args));
        });
    };
};

export const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if (Date.now() - lastRan >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
};

export const promiseToObservable = (promise, ObservableConstructor) =>
    new ObservableConstructor(subscriber => {
        promise.then(
            value => {
                if (subscriber.closed) return;
                subscriber.next(value);
                subscriber.complete();
            },
            err => subscriber.error(err)
        );
        return subscriber;
    });

export const noop = () => void 0;
