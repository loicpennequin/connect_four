import { useState, useEffect } from 'react';
import { constants } from '@c4/shared';

import { httpClient, REQUEST, RESPONSE_ERROR } from '@core/api/httpClient';
import { AuthService } from '@root/auth/api/AuthService';
import { useInterval } from '@core/hooks/useInterval';

export const AuthProvider = ({ children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    httpClient.on(REQUEST, AuthService.onRequest);
    httpClient.on(RESPONSE_ERROR, AuthService.onResponseError);
  }, []);
  
  useInterval(() => {
    if (AuthService.jwt) {
      AuthService.refreshJwt();
    }
  }, (constants.JWT.MAXAGE - 10) * 1000); // constant is in seconds because the jsonwebtoken  library is dumb

  useEffect(() => {
    (async function() {
      try {
        await AuthService.refreshJwt();
      } finally {
        setReady(true);
      }
    })();
  }, []);

  return ready ? children : null;
};
