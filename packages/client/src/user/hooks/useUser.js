import { useEffect } from 'react';
import { constants } from '@c4/shared';

import { UserService } from '@user/api/UserService';
import { useQuery } from 'react-query';
import { useWebsockets } from '@core/hooks/useWebsockets';

const { EVENTS } = constants;

export function useUser(id) {
  const { on } = useWebsockets();
  const user = useQuery(
    ['user', id],
    async () => {
      if (!id) return null;
      return UserService.getUserById(id);
    },
    {
      retry: false
    }
  );

  useEffect(() => {
    const unsub = on(EVENTS.USER_ENTERED_LOBBY, user.refetch);

    return unsub;
  }, [on, user.refetch]);

  useEffect(() => {
    const unsub = on(EVENTS.USER_LEFT_LOBBY, user.refetch);

    return unsub;
  }, [on, user.refetch]);
  return user;
}
