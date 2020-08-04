import React, { useMemo } from 'react';
import { useCurrentUser } from '@root/user/hooks/useCurrentUser';
import { useUsers } from '@root/user/hooks/useUsers';
import { useChallenge } from '@game/hooks/useChallenge';


export function ConnectedUsersList() {
  const currentUser = useCurrentUser();
  const { connectedUsers } = useUsers();
  const { initiateChallenge } = useChallenge();
  
  const otherUsers = useMemo(
    () =>
      connectedUsers.data?.filter?.(user => user.id !== currentUser.data?.id),
    [currentUser.data, connectedUsers.data]
  );

  const handleClick = userId => {
    initiateChallenge(userId);
  };

  return !otherUsers ? null : (
    <ul>
      {otherUsers.map(user => (
        <li key={user.id}>
          <span>{user.username}</span>
          <button onClick={() => handleClick(user.id)}>Challenge</button>
        </li>
      ))}
    </ul>
  );
}
