import React, { Suspense } from 'react';
import { lazy } from 'react';
import { constants } from '@c4/shared';
import { DefaultLayout } from '@core/components/Layout/DefaultLayout';
import { FullPageLayout } from '@core/components/Layout/FullPageLayout';

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
    authLevel: constants.AUTH_LEVELS.PUBLIC_ONLY,
    layout: DefaultLayout
  },
  {
    name: 'SignUp',
    path: '/signin',
    exact: true,
    component: pageComponentFactory(() => import('@root/pages/signUp')),
    authLevel: constants.AUTH_LEVELS.PUBLIC_ONLY,
    layout: DefaultLayout
  },
  {
    name: 'Lobby',
    path: '/lobby',
    exact: true,
    component: pageComponentFactory(() => import('@root/pages/lobby')),
    authLevel: constants.AUTH_LEVELS.PRIVATE,
    layout: DefaultLayout
  },
  {
    name: 'Game',
    path: '/game/:id',
    exact: true,
    component: pageComponentFactory(() => import('@root/pages/game')),
    authLevel: constants.AUTH_LEVELS.PRIVATE,
    layout: FullPageLayout
  },
  {
    name: 'Profile',
    path: '/user/:id',
    exact: true,
    component: pageComponentFactory(() => import('@root/pages/profile')),
    authLevel: constants.AUTH_LEVELS.PRIVATE,
    layout: DefaultLayout
  },
  {
    name: 'Replay',
    path: '/replay/:id',
    exact: true,
    component: pageComponentFactory(() => import('@root/pages/replay')),
    authLevel: constants.AUTH_LEVELS.PRIVATE,
    layout: DefaultLayout
  },
];
