import styled from 'styled-components';
import { spacing, color } from '@styles/mixins';

export const Label = styled.label`
  color: ${color('brand')};
  margin-bottom: ${spacing('sm')};
  font-weight: 600;
`;
