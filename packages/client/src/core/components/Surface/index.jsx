import styled from 'styled-components';
import { color, spacing, mobileOnly } from '@styles/mixins';

export const Surface = styled.div`
  background-color: ${color('surface')};
  color: ${color('text')};
  margin: ${spacing('md')};
  padding: ${spacing('md')};
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.08);

  @media screen and (${mobileOnly}) {
    margin: 0;
  }
`;
