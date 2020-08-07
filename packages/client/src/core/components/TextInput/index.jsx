import styled from 'styled-components';
import { color, spacing, borderRadius } from '@styles/mixins';

export const TextInput = styled.input`
  padding: ${spacing('sm')} ${spacing('md')};
  border-radius: ${borderRadius('md')};
  border: solid 1px ${color('brand')};
  margin-bottom: ${spacing('sm')};
  outline: none;
  &:focus {
    border-color: ${color('accent')};
    outline: none;
  }
`;
