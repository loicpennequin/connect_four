import { useEffect } from 'react';
import { httpClient, REQUEST } from '@core/api/httpClient';
import { AuthService } from '@root/auth/api/AuthService';

export const AuthProvider = ({ children }) => {
  useEffect(() => {
    httpClient.on(REQUEST, AuthService.onRequest);
  }, []);

  useEffect(() => {
    AuthService.refreshJwt();
  }, []);

  return children;
};
