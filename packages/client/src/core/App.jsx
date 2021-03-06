import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query-devtools';
import { isDev } from '@c4/shared';

import { routes } from '@root/pages';
import { Route } from '@root/core/components/Route';
import { Store } from '@core/components/Store';

function App() {
  return (
    <Router>
      <Store>
        <Switch>
          {routes.map(route => (
            <Route key={route.name} {...route} />
          ))}
        </Switch>
      </Store>
      {isDev && <ReactQueryDevtools initialIsOpen={false} />}
    </Router>
  );
}

export default App;
