import React, { useState, useEffect } from 'react';
import { constants } from '@c4/shared';

import { httpClient, REQUEST } from '@core/api/httpClient';
import { AuthService } from '@auth/api/AuthService';
import { useInterval } from '@core/hooks/useInterval';
import { useCurrentUser } from '@user/hooks/useCurrentUser';

import { FullPageLoading } from '@core/components/FullPageLoading';

export const AuthProvider = ({ children }) => {
  const [getCurrentUserReady, setGetCurrentUserReady] = useState(false);
  const currentUser = useCurrentUser(getCurrentUserReady);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    httpClient.on(REQUEST, AuthService.onRequest);
    // httpClient.on(RESPONSE_ERROR, AuthService.onResponseError);
  }, []);

  useEffect(() => {
    if (currentUser.status === 'success') {
      setTimeout(() => {
        setReady(true);
      }, 500);
    }
  }, [currentUser.status])

  useInterval(() => {
    if (AuthService.jwt) {
      AuthService.refreshJwt();
    }
  }, (constants.JWT.MAXAGE - 10) * 1000); // constant is in seconds because the jsonwebtoken library is dumb

  useEffect(() => {
    (async function() {
      try {
        await AuthService.refreshJwt();
      } catch {
      } finally {
        setGetCurrentUserReady(true);
      }
    })();
  }, []);
  

  return ready ? (
    children
  ) : (
    <FullPageLoading />
  );
};
