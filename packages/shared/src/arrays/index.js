import { isString, isNumber, isObject, isFunction, isDefined } from '../assertions';

export const filterEmpty = (arr = []) => arr.filter(isDefined);

export const arrayToObject = (
  arr = [],
  keyMapper = val => val.id,
  valueMapper = val => val
) =>
  Object.fromEntries(
    arr.map(value => [
      isFunction(keyMapper) ? keyMapper(value) : value[keyMapper],
      valueMapper(value)
    ])
  );

export const intersection = (arrayA, arrayB) => {
  return arrayA.filter(value => arrayB.includes(value));
};

