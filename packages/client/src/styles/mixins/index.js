import { css } from 'styled-components';

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

export const fromTheme = token => css`${props =>
  token.split('.').reduce((result, key) => result?.[key], props.theme)}`;

export const color = key => fromTheme(`color.${key}`);
export const spacing = key => fromTheme(`spacing.${key}`);
export const font = key => fromTheme(`font.${key}`);
export const fontSize = key => fromTheme(`font.size.${key}`);
export const fontWeight = key => fromTheme(`font.weight.${key}`);
export const borderRadius = key => fromTheme(`borderRadius.${key}`);
export const layout = key => fromTheme(`layout.${key}`);
export const breakpoint = key => fromTheme(`layout.breakpoints.${key}`);
export const zindex = key => fromTheme(`layout.zindexes.${key}`);

export const mobileOnly = css`max-width: ${breakpoint('mobile.max')}`;