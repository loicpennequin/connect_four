import { isUndefined } from './assertions';

export function parseVersion(version) {
    if (typeof version === 'string') {
        const [major, minor, patch] = version.split('.');
        return {
            full: version,
            major: Number(major),
            minor: Number(minor),
            patch: Number(patch)
        };
    } else {
        return version;
    }
}

export function parseVersionRange(version) {
    const regex = /^(\[|\()[^(\[|\]|\(|\))]+(\]|\))$/;
    if (!regex.test(version)) {
        throw new Error(`Invalid version range,  ${version}`);
    }
    const [min, max] = version.replace(/\s/g, '').split(',');
    return {
        min: parseVersion(min.slice(1)),
        max: parseVersion(max.slice(0, max.length - 1)),
        minExcluded: version.startsWith('('),
        maxExcluded: version.endsWith(')')
    };
}

export function getHighestVersion(a, b) {
    if (isUndefined(b)) return a;
    if (a.major > b.major) return a;
    else if (a.major === b.major && a.minor > b.minor) return a;
    else if (a.major === b.major && a.minor === b.minor && a.patch > b.patch)
        return a;
    else return b;
}

export function isInVersionRange(version, range) {
    return (
        version.major > range.max.major ||
        version.major < range.min.major ||
        version.minor > range.max.minor ||
        version.minor < range.min.minor ||
        version.patch > range.min.patch ||
        version.patch < range.min.patch ||
        (version.patch === range.max.patch && range.maxExcluded) ||
        (version.patch === range.min.patch && range.minExcluded)
    );
}
