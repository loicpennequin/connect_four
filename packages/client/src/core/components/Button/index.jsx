import React from 'react';
import styled from 'styled-components';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { color, borderRadius, spacing, fontSize } from '@styles/mixins';

export function Button({ children, ...props }) {

  return <Wrapper {...props}>{children}</Wrapper>
}
Button.defaultProps = {
  variant: 'brand'
};

const Wrapper = styled.button`
  background-color: ${props => props.theme.color[props.variant]};
  color: ${props => props.theme.color[props.variant + 'Invert']};
  border: none;
  padding: ${spacing('sm')} ${spacing('md')};
  cursor: pointer;
  border-radius: ${borderRadius('sm')};
  ${props =>
    props.cta &&
    `
    min-width: 10em;
    font-size: ${fontSize('lg')(props)};
  `}

  &:hover {
    background-color: ${props => props.theme.color[props.variant + 'Light']};
  }

  &[disabled] {
    background-color: ${color('grey')};
    color: ${color('white')};
  }
`;