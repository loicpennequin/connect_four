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

const GlobalStyles = createGlobalStyle`
    ${normalize()}
    :root{
        ${makeCustomProperties('color')}
        ${makeCustomProperties('spacing')}
        ${makeCustomProperties('font')}
        ${makeCustomProperties('layout')}
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
        text-decoration: none;
        &:hover, 
        &:active, 
        &:focus {
            color: ${color('linkHovered')};
        }
    }
`;

export default GlobalStyles;
