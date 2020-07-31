import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { GlobalStyles } from '@root/core/GlobalStyles';
import { ThemeProvider } from '@styles/ThemeProvider';
import { AuthProvider } from '@root/auth/components/AuthProvider';
import { routes } from '@root/pages';
import { Provider } from 'react-redux';
import { store } from '@root/core/store';
import { ToastProvider } from '@root/core/components/Toast';
function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <GlobalStyles />
              <Switch>
                {routes.map(route => (
                  <Route key={route.name} {...route} />
                ))}
              </Switch>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </Provider>
  );
}

export default App;
