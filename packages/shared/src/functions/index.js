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

export const debounce = (cb, timer) => {
  let timeout;
  return function debounced(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => cb.apply(context, args), timer);
  };
};

export const throttle = (fn, threshhold, scope = this) => {
  let last;
  let deferTimer;

  return function throttled(...args) {
    const now = Date.now();
    if (last && now < last + threshhold) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(() => {
        last = now;
        fn.apply(scope, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(scope, args);
    }
  };
};
export const noop = () => void 0;
