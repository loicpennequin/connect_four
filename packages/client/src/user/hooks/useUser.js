import { UserService } from '@user/api/UserService';
import { useQuery } from 'react-query';

export function useUser(id) {
  const user = useQuery(
    ['user', id],
    async () => {
      return UserService.getUserById(id);
    },
    {
      retry: false,
    }
  );

  return user;
}
