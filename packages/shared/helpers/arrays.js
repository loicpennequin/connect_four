import { isFunction } from './assertions';

export const filterEmpty = (arr = []) => arr.filter(x => !!x);

export const flatten = array =>
    array.reduce((output, current) => {
        if (Array.isArray(current)) {
            return [...output, ...current.reduce(flatten, current)];
        }
        return [...output, current];
    }, []);

export const arrayToObject = (arr, prop = 'id', valueMapper = val => val) =>
    arr.reduce((output, current) => {
        const keyName = isFunction(prop) ? prop(current) : prop;
        output[keyName] = valueMapper(current);
        return output;
    }, {});

export const intersection = (arrayA, arrayB) => {
    console.log(arrayA);
    console.log(arrayB);
    return arrayA.filter(x => arrayB.includes(x));
};
