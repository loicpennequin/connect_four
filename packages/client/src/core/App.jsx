import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Route } from '@root/core/components/Route';
import { GlobalStyles } from '@root/core/GlobalStyles';
import { ThemeProvider } from '@styles/ThemeProvider';
import { AuthProvider } from '@root/auth/components/AuthProvider';
import { routes } from '@root/pages';
import { ToastProvider } from '@root/core/components/Toast';
import { ReactQueryDevtools } from 'react-query-devtools';
import { ChallengeProvider } from '@game/contexts/challengeContext';

function App() {
  return (
    <Router>
      <ReactQueryDevtools initialIsOpen={false} />
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <ChallengeProvider>
              <GlobalStyles />
              <Switch>
                {routes.map(route => (
                  <Route key={route.name} {...route} />
                ))}
              </Switch>
            </ChallengeProvider>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
