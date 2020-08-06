import { useState, useCallback, useEffect } from 'react';
import { UserService } from '@user/api/UserService';
import { useQuery, useMutation, queryCache } from 'react-query';
import { constants, noop } from '@c4/shared';
import { useWebsockets } from '@core/hooks/useWebsockets';

const { EVENTS } = constants;
const CONNECTED_USER_LIST_UPDATE_DELAY = 1500;

export function useUsers({
  lazy = false,
  onUserJoined = noop,
  onUserLeft = noop
} = {}) {
  const { on } = useWebsockets();
  const [connectedUsersEnabled, setConnectedUsersEnabled] = useState(false);
  const [createUser] = useMutation(UserService.createUser, {
    onError(err) {
      throw err;
    }
  });

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
      setTimeout(() => {
        queryCache.invalidateQueries('connectedUsers');
        onUserLeft(id);
      }, CONNECTED_USER_LIST_UPDATE_DELAY);
    });
    return unsub;
  }, [on, onUserLeft, connectedUsers]);

  return {
    createUser,
    connectedUsers,
    getConnectedUsers
  };
}
