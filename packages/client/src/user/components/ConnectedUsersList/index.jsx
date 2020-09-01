import React, { useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { TransitionGroup } from 'react-transition-group';
import { constants } from '@c4/shared';
import { useCurrentUser } from '@root/user/hooks/useCurrentUser';
import { useUsers } from '@root/user/hooks/useUsers';
import { useWebsockets } from '@core/hooks/useWebsockets';

import { spacing } from '@styles/mixins';
import { ConnectedUsersListItem } from './ConnectedUsersListItem';

const { EVENTS } = constants;

export function ConnectedUsersList() {
  const currentUser = useCurrentUser();
  const { connectedUsers } = useUsers();
  const { on } = useWebsockets();

  useEffect(() => {
    on(EVENTS.GAME_HAS_FINISHED, connectedUsers.refetch);
  }, [connectedUsers.refetch, on]);

  const otherUsers = useMemo(
    () =>
      connectedUsers.data?.filter?.(user => user.id !== currentUser.data?.id),
    [currentUser.data, connectedUsers.data]
  );

  return !connectedUsers.data ? null : (
    <Wrapper>
      <Title>Connected Users</Title>
      {otherUsers.length <= 0 && (
        <div>
          There are no other users connected at the moment. Maybe wait for a bit
          or come back later !
        </div>
      )}
      <TransitionGroup component="ul">
        {otherUsers.map(user => (
          <ConnectedUsersListItem key={user.id} user={user} />
        ))}
      </TransitionGroup>
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const Title = styled.h3`
  margin-top: 0;
  padding: ${spacing('sm')};
`;
