import { isDefined, isString } from '../assertions';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isRequired = val => isDefined(val) && val !== '';
export const minLength = (val, length) => isString(val) && val.length >= length;
export const maxLength = (val, length) => isString(val) && val.length <= length;
export const pattern = (val, regexp) => regexp.test(val);
export const isEmail = val => pattern(val, EMAIL_REGEX);
export const isIn = (...values) => val => values.includes(val);