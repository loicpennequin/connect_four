import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Route } from '@root/core/components/Route';
import { GlobalStyles } from '@root/core/GlobalStyles';
import { routes } from '@root/pages';
import { ReactQueryDevtools } from 'react-query-devtools';
import { Store } from '@core/components/Store';

function App() {
  return (
    <Router>
      <ReactQueryDevtools initialIsOpen={false} />
      <Store>
        <GlobalStyles />
        <Switch>
          {routes.map(route => (
            <Route key={route.name} {...route} />
          ))}
        </Switch>
      </Store>
    </Router>
  );
}

export default App;
