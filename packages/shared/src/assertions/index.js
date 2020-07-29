export const isFunction = fn => fn && typeof fn === 'function';

export const isUndefined = value => value === undefined || value === null;

export const isDefined = value => !isUndefined(value);

export const isObject = obj =>
  typeof obj === 'object' && obj !== null && !Array.isArray(obj);

export const isEmptyObject = obj =>
  isObject(obj) && Object.keys(obj).length <= 0;

export const isString = value => typeof value === 'string';

export const isNumber = value => typeof value === 'number';

export const isBoolean = value => value === true || value === false;

export const isArray = value => Array.isArray(value);

export const isURL = value =>
  value.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );

export const isStringsArray = arr => isArray(arr) && arr.every(isString);

export const isNumbersArray = arr => isArray(arr) && arr.every(isNumber);

export const isObjectsArray = arr => isArray(arr) && arr.every(isObject);

export const isDev = process.env.NODE_ENV === 'development';

export const isProd = process.env.NODE_ENV === 'production';
