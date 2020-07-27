export function kebabToCamelCase(s) {
    return s.replace(/(-\w)/g, function(m) {
        return m[1].toUpperCase();
    });
}

export const camelToKebabCase = str =>
    str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export const upperCaseFirstLetter = str =>
    str.charAt(0).toUpperCase() + str.substring(1);
