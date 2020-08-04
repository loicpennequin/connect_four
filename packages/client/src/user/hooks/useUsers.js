import { useState, useCallback, useEffect } from 'react';
import { UserService } from '@user/api/UserService';
import { useQuery, useMutation, queryCache } from 'react-query';
import { constants, noop } from '@c4/shared';
import { useWebsockets } from '@core/hooks/useWebsockets';

const { EVENTS } = constants;

export function useUsers({
  lazy = false,
  onUserJoined = noop,
  onUserLeft = noop
} = {}) {
  const { on } = useWebsockets();
  const [connectedUsersEnabled, setConnectedUsersEnabled] = useState(false);
  const createUser = useMutation(UserService.createUser);

  const connectedUsers = useQuery(
    'connectedUsers',
    UserService.getConnectedUsers,
    {
      retry: false,
      enabled: !lazy || connectedUsersEnabled
    }
  );

  const getConnectedUsers = useCallback(() => {
    setConnectedUsersEnabled(true);
  }, []);

  useEffect(() => {
    const unsub = on(EVENTS.USER_ENTERED_LOBBY, newUser => {
      if (connectedUsers.isIdle || connectedUsers.isFetching) return;

      queryCache.setQueryData('connectedUsers', oldUsers =>
        oldUsers.filter(user => user.id !== newUser.id).concat(newUser)
      );

      onUserJoined(newUser);
    });
    return unsub;
  }, [on, onUserJoined, connectedUsers]);

  useEffect(() => {
    const unsub = on(EVENTS.USER_LEFT_LOBBY, ({ id }) => {
      if (connectedUsers.isIdle || connectedUsers.isFetching) return;

      queryCache.setQueryData('connectedUsers', oldUsers =>
        oldUsers.filter(user => user.id !== id)
      );

      onUserLeft(id);
    });
    return unsub;
  }, [on, onUserLeft, connectedUsers]);

  return {
    createUser,
    connectedUsers,
    getConnectedUsers
  };
}
