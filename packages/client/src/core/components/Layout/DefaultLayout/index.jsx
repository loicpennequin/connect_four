import React from 'react';
import styled from 'styled-components';

import { DefaultLayoutHeader } from './DefaultLayoutHeader';

export function DefaultLayout({ children }) {
  return (
    <Wrapper>
      <DefaultLayoutHeader />
      <main>{children}</main>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;

  main > * {
    height: 100%;
  }
`;
