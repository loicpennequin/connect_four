import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query-devtools';
import { GlobalStyles } from '@root/core/GlobalStyles';
import { routes } from '@root/pages';

import { Route } from '@root/core/components/Route';
import { Store } from '@core/components/Store';
import { Layout } from '@core/components/Layout';

function App() {
  return (
    <Router>
      <ReactQueryDevtools initialIsOpen={false} />
      <Store>
        <GlobalStyles />
        <Layout>
          <Switch>
            {routes.map(route => (
              <Route key={route.name} {...route} />
            ))}
          </Switch>
        </Layout>
      </Store>
    </Router>
  );
}

export default App;
