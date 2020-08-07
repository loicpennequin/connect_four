function flexMixin({
  direction,
  justify = 'flex-start',
  align = 'normal'
} = {}) {
  return `
        display: flex;
        flex-direction: ${direction};
        justify-content: ${justify};
        align-items: ${align};
    `;
}

export const horizontalFlex = opts => flexMixin({ direction: 'row', ...opts });
export const verticalFlex = opts => flexMixin({ direction: 'column', ...opts });

export const fromTheme = token => props =>
  token.split('.').reduce((result, key) => result?.[key], props.theme);

export const color = key => fromTheme(`color.${key}`);
export const spacing = key => fromTheme(`spacing.${key}`);
export const font = key => fromTheme(`font.${key}`);
export const fontSize = key => fromTheme(`font.size.${key}`);
export const borderRadius = key => fromTheme(`borderRadius.${key}`);
export const layout = key => fromTheme(`layout.${key}`);
export const breakpoint = key => fromTheme(`layout.breakpoint.${key}`);
export const zindex = key => fromTheme(`layout.zindexes.${key}`);

export const mobileOnly = () => props =>
  `(max-width: ${breakpoint('mobile.max')})`;
export const tabletOnly = () => props =>
  `(min-width: ${breakpoint('tablet.min')}) and (max-width: ${breakpoint(
    'tablet.max'
  )})`;
export const laptopOnly = () => props =>
  `(min-width: ${breakpoint('laptop.min')}) and (max-width: ${breakpoint(
    'laptop.max'
  )})`;
export const desktopOnly = () => props =>
  `(min-width: ${breakpoint('desktop.min')})`;

export const upToLaptop = () => props =>
  `(max-width: ${breakpoint('tablet.max')})`;
export const upToDesktop = () => props =>
  `(max-width: ${breakpoint('laptop.max')})`;

export const tabletAndUp = () => props =>
  `(min-width: ${breakpoint('tablet.min')})`;
export const laptopAndUp = () => props =>
  `(min-width: ${breakpoint('laptop².min')})`;
