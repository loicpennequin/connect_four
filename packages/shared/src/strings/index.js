export function kebabToCamelCase(str) {
  return str.replace(/(-\w)/g, match => match[1].toUpperCase());
}

export const camelToKebabCase = str =>
  str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export const upperCaseFirstLetter = str =>
  str.charAt(0).toUpperCase() + str.substring(1);
