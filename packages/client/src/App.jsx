import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import GlobalStyles from '@root/GlobalStyles';
import ThemeProvider from '@styles/ThemeProvider';
import routes from '@root/pages/';

function App() {
  return (
    <Router>
        <ThemeProvider>
          <GlobalStyles />
          <Switch>
            {Object.values(routes).map(route => (
              <Route key={route.name} {...route} />
            ))}
          </Switch>
        </ThemeProvider>
    </Router>
  );
}

export default App;
