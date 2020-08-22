import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import { createUrl } from '@utils';
import { routes } from '@root/pages/';

export function Link({ params = {}, to, children, ...props }) {
  const route = useMemo(
    () => routes.find(route => route.name === to),
    [to]
  );
  const url = createUrl(route.path, params);
  
  return (
    <Wrapper to={url} {...props}>
      {children}
    </Wrapper>
  );
}

const Wrapper = styled(RouterLink)`
  &:focus {
    outline: none;
  }
`