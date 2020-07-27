const values = {
    xs: 0.25,
    sm: 0.5,
    md: 1,
    lg: 1.5,
    xl: 2.25,
    xxl: 3.5
};

function suffix(toAppend) {
    const output = {};

    for (let key in values) {
        output[key] = values[key] + toAppend;
    }

    return output;
}

export default {
    ...suffix('em'),
    fixed: suffix('rem')
};
