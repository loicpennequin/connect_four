import React, { useMemo } from 'react';
import styled from 'styled-components';
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

  return !connectedUsers.data ? null : (
    <>
      <Title>Connected Users</Title>
      {otherUsers.length <= 0 && (
        <div>There are no other users connected at the moment.</div>
      )}
      <ul>
        {otherUsers.map(user => (
          <li key={user.id}>
            <ConnectedUsersListItem user={user} />
          </li>
        ))}
      </ul>
    </>
  );
}

const Title = styled.h3`
  margin-top: 0;
`;
