import { createGlobalStyle } from 'styled-components';
import { normalize } from 'polished';
import { camelToKebabCase, isObject } from '@c4/shared';
import { color, font } from '@styles/mixins';

const makeCustomProperties = category => props => {
  function recursion(obj, prefix) {
    return Object.entries(obj).reduce(
      (output, [key, value]) => [
        ...output,
        ...(isObject(value)
          ? recursion(value, `${prefix}-${key}`)
          : [`--${prefix}-${camelToKebabCase(key)}: ${value};`])
      ],
      []
    );
  }

  return recursion(props.theme[category], category).join('\n');
};

export const GlobalStyles = createGlobalStyle`
    ${normalize()}

    :root{
        ${makeCustomProperties('color')}
        ${makeCustomProperties('spacing')}
        ${makeCustomProperties('font')}
        ${makeCustomProperties('layout')}
    }
    
    * {
        box-sizing: border-box;
    }

    body {
        font-family: ${font('primary')};
        background-color: ${color('background')};
        color: ${color('text')};
        width: 100vw;
        overflow-x: hidden;
    }

   ul {
        list-style: none;
        padding-left: 0;
        margin: 0;
    }
    
    a {
        color: var(--color-link);
        &:hover, 
        &:active, 
        &:focus {
            color: ${color('linkHovered')};
        }
    }

    * {
        /* Firefox */
    scrollbar-color: ${color('brand')};
    scrollbar-width: 8px;
    --scrollbar-thumb: ${color('brandHalf')};

    &:hover {
      --scrollbar-thumb: ${color('brand')};
    }
    /* Chrome */
    ::-webkit-scrollbar {
      width: 8px;
      background-color: transparent;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar-thumb {
      background-color: var(--scrollbar-thumb);
      border-radius: 10px;
    }
    }
`;
