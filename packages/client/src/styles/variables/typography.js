const ratio = 1.3;

export default {
  primary: '"Open Sans", Arial',
  secondary: 'Times New Roman',
  monospace: 'monospace',
  size: {
    base: '1em',
    xs: `calc(1em / ${ratio ** 2})`,
    sm: `calc(1em / ${ratio})`,
    md: `1em`,
    lg: `calc(1em * ${ratio})`,
    xl: `calc(1em * ${ratio ** 2})`,
    xxl: `calc(1em * ${ratio ** 3})`,
    xxxl: `calc(1em * ${ratio ** 4})`
  },
  weight: {
    normal: 400,
    bold: 600
  }
};
