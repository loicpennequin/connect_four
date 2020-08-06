import { AuthService } from '@auth/api/AuthService';
import { useMutation, queryCache } from 'react-query';

export function useAuth() {
  const [login] = useMutation(AuthService.login, {
    onSuccess() {
      queryCache.invalidateQueries('currentUser');
    },
    onError(err) {
      throw err;
    }
  });

  const [logout] = useMutation(AuthService.logout, {
    onSuccess() {
      queryCache.invalidateQueries('currentUser');
    }
  });

  return {
    login,
    logout
  };
}
