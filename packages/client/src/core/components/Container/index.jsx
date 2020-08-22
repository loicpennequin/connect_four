import styled from 'styled-components';
import { mobileOnly } from '@styles/mixins';

export const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 980px;

  @media screen and (${mobileOnly}) {
    width: 100%;
    max-width: none;
  }
`;
