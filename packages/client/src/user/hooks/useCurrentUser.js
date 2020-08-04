import { UserService } from '@user/api/UserService';
import { AuthService } from '@auth/api/AuthService';
import { useQuery } from 'react-query';

export function useCurrentUser(lazy = false) {
  const currentUser = useQuery(
    'currentUser',
    async () => {
      const userId = AuthService.getJwtPayload()?.sub;
      if (!userId) return null;
      return UserService.getUserById(userId);
    },
    {
      retry: false,
      enabled: lazy
    }
  );

  return currentUser;
}
