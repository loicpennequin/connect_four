export const isFunction = fn => fn && typeof fn === 'function';

export const isUndefined = x => x === undefined || x === null;

export const isDefined = x => !isUndefined(x);

export const isObject = obj =>
    typeof obj === 'object' && obj !== null && !Array.isArray(obj);

export const isEmptyObject = obj =>
    isObject(obj) && Object.keys(obj).length <= 0;
