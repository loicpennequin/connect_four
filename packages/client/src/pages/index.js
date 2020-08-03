import React, { Suspense } from 'react';
import { lazy } from 'react';
import { constants } from '@c4/shared';

const Loading = () => <div>Page Loading...</div>;

const pageComponentFactory = importFn => props => {
  const LazyComponent = lazy(importFn);

  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export const routes = [
  {
    name: 'Home',
    path: '/',
    exact: true,
    component: pageComponentFactory(() => import('@root/pages/home')),
    authLevel: constants.AUTH_LEVELS.PUBLIC_ONLY
  },
  {
    name: 'SignUp',
    path: '/signin',
    exact: true,
    component: pageComponentFactory(() => import('@root/pages/signUp')),
    authLevel: constants.AUTH_LEVELS.PUBLIC_ONLY
  },
  {
    name: 'Lobby',
    path: '/lobby',
    exact: true,
    component: pageComponentFactory(() => import('@root/pages/lobby')),
    authLevel: constants.AUTH_LEVELS.PRIVATE
  }
];
