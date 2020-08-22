import React from 'react';
import styled from 'styled-components';
import { color, borderRadius, spacing, fontSize } from '@styles/mixins';

export function Button({ children, ...props }) {
  if (props.plain) {
    return <PlainButton {...props}>{children}</PlainButton>;
  }
  return <BaseButton {...props}>{children}</BaseButton>
}
Button.defaultProps = {
  variant: 'brand'
};

const BaseButton = styled.button`
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
  
  &:focus {
    background-color: ${props => props.theme.color[props.variant + 'Lighter']};
  }

  &[disabled] {
    background-color: ${color('grey')};
    color: ${color('white')};
  }
`;

const PlainButton = styled.button`
  border: none;
  background: none;
  padding: ${spacing('sm')} ${spacing('md')};
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.color[props.variant + 'Light']};
  }

  &:focus {
    color: ${props => props.theme.color[props.variant + 'Lighter']};
  }
`;