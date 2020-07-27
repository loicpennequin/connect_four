import React, { Suspense } from 'react';
import { lazy } from 'react';

const Loading = () => <div>Page Loading...</div>;

const pageComponentFactory = importFn => props => {
  const LazyComponent = lazy(importFn);

  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default {
  Home: {
    name: 'Home',
    path: '/',
    exact: true,
    component: pageComponentFactory(() => import('@root/pages/home')),
    private: false
  },
  Lobby: {
    name: 'Lobby',
    path: '/lobby',
    exact: true,
    component: pageComponentFactory(() => import('@root/pages/lobby')),
    private: true
  }
};
