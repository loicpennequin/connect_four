import React, { useMemo } from 'react';
import { useCurrentUser } from '@root/user/hooks/useCurrentUser';
import { useUsers } from '@root/user/hooks/useUsers';

import { ConnectedUsersListItem } from './ConnectedUsersListItem';
export function ConnectedUsersList() {
  const currentUser = useCurrentUser();
  const { connectedUsers } = useUsers();
  
  const otherUsers = useMemo(
    () =>
      connectedUsers.data?.filter?.(user => user.id !== currentUser.data?.id),
    [currentUser.data, connectedUsers.data]
  );

  return !otherUsers ? null : (
    <ul>
      {otherUsers.map(user => (
        <li key={user.id}>
          <ConnectedUsersListItem user={user} />
        </li>
      ))}
    </ul>
  );
}
