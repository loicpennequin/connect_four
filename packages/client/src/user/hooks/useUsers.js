import { UserService } from '@user/api/UserService';
import { AuthService } from '@auth/api/AuthService';
import { useQuery, useMutation } from 'react-query';

export function useUsers() {
  const currentUser = useQuery(
    'currentUser',
    async () => {
      const userId = AuthService.getJwtPayload()?.sub;
      if (!userId) return null;
      return UserService.getUserById(userId);
    },
    {
      retry: false
    }
  );

  const createUser = useMutation(UserService.createUser);

  return {
    currentUser,
    createUser
  };
}
