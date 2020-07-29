import { isObject, isDefined } from '../assertions';

export function mapObject(
  obj,
  valueMapFn = value => value,
  keyMapFn = key => key
) {
  const result = {};

  Object.entries(obj).forEach(([key, value], ...args) => {
    result[keyMapFn(key, value, ...args)] = valueMapFn(value, key, ...args);
  });

  return result;
}

export function pick(obj = {}, keys = []) {
  const result = {};
  keys.forEach(key => {
    result[key] = obj[key];
  });

  return result;
}

export function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

// export function getProperty(obj, propertyPath) {
//   return propertyPath
//     .split('.')
//     .reduce((acc, step) => acc?.[step], obj);
// }

export function hasKey(obj, keyPath) {
  let result = true;
  const steps = keyPath.split('.');
  
  for (let step of steps) {
    if (!obj.hasOwnProperty(step)) {
      result = false;
      break;
    };
    obj = obj[step];
  }

  return result;
}

export function removeEmptyKeys(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => isDefined(value))
  );
}