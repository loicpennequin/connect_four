import React, { useMemo, useContext } from 'react';
import styled from 'styled-components';

import { useChallenge } from '@game/hooks/useChallenge';
import { lobbyContext } from '@root/game/contexts/lobbyContext';

import { spacing, color } from '@styles/mixins';
import { Button } from '@core/components/Button';
import { Flex } from '@core/components/Flex';

export function ConnectedUsersListItem({ user }) {
  const {
    initiateChallenge,
    cancelChallenge,
    acceptChallenge,
    declineChallenge,
    pendingChallenges
  } = useChallenge();
  const { setIsGameLoading } = useContext(lobbyContext);

  const isChallengeable = useMemo(
    () =>
      pendingChallenges.every(
        challenge =>
          challenge.challengedId !== user.id &&
          challenge.challengerId !== user.id
      ),
    [user, pendingChallenges]
  );

  const isCancellable = useMemo(
    () =>
      pendingChallenges.some(challenge => challenge.challengedId === user.id),
    [user, pendingChallenges]
  );

  const isAnswerable = useMemo(
    () =>
      pendingChallenges.some(challenge => challenge.challengerId === user.id),
    [user, pendingChallenges]
  );

  const handleAccept = () => {
    acceptChallenge(user.id);
    setIsGameLoading(true);
  };

  return (
    <Wrapper>
      <span>{user.username}</span>
      <ActionList>
        {isChallengeable && (
          <Button variant="accent" onClick={() => initiateChallenge(user.id)}>
            Challenge
          </Button>
        )}

        {isCancellable && (
          <Button variant="danger" onClick={() => cancelChallenge(user.id)}>
            Cancel
          </Button>
        )}

        {isAnswerable && (
          <>
            <Button variant="success" onClick={handleAccept}>
              Accept
            </Button>
            <Button variant="danger" onClick={() => declineChallenge(user.id)}>
              Decline
            </Button>
          </>
        )}
      </ActionList>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: ${spacing('sm')} 0;
  color: ${color('brand')};
  display: grid;
  grid-template-columns: 2fr 1fr;
  align-items: center;
`;

const ActionList = styled(Flex)`
  & > * {
    margin: ${spacing('sm')};
  }
`;