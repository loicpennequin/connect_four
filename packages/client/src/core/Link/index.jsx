import React, { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { createUrl } from '@utils';
import { routes } from '@root/pages/';

export default function Link({ params = {}, to, children, ...props }) {
  const route = useMemo(
    () => routes.find(route => route.name === to),
    [to]
  );
  const url = createUrl(route.path, params);
  
  return (
    <RouterLink to={url} {...props}>
      {children}
    </RouterLink>
  );
}
