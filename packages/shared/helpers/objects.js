import { isDefined } from './assertions';

export function mapObject(obj, valueMapFn, keyMapFn = key => key) {
  return Object.entries(obj).reduce(
    (output, [key, value], ...args) => ({
      ...output,
      [keyMapFn(key, value, ...args)]: valueMapFn(value, key, ...args)
    }),
    {}
  );
}

export function pick(obj = {}, keys = []) {
  const result = {};
  keys.forEach(key => {
    result[key] = obj[key];
  });

  return result;
}

export function removeEmptyKeys(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => isDefined(value))
  );
}
