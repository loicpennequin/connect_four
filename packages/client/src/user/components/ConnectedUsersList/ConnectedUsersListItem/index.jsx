import React, { useMemo, useContext } from 'react';
import styled from 'styled-components';
import { Transition } from 'react-transition-group';
import { enums } from '@c4/shared';

import { useChallenge } from '@game/hooks/useChallenge';
import { lobbyContext } from '@root/game/contexts/lobbyContext';

import { spacing, color } from '@styles/mixins';
import { Button } from '@core/components/Button';
import { Flex } from '@core/components/Flex';
import { Link } from '@core/components/Link';

export function ConnectedUsersListItem({ user, ...props }) {
  const {
    initiateChallenge,
    cancelChallenge,
    acceptChallenge,
    declineChallenge,
    pendingChallenges
  } = useChallenge();
  const { setIsGameLoading } = useContext(lobbyContext);
  const transitionDuration = 300;

  const isPlaying = useMemo(() => user.status === enums.USER_STATUSES.IN_GAME, [user.status]);

  const isChallengeable = useMemo(
    () =>
      !isPlaying && 
      pendingChallenges.every(
        challenge =>
          challenge.challengedId !== user.id &&
          challenge.challengerId !== user.id
      ),
    [isPlaying, pendingChallenges, user.id]
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
    <Transition appear={true} timeout={transitionDuration} {...props}>
      {state => (
        <Wrapper state={state} transitionDuration={transitionDuration}>
          <Username to="Profile" params={{id: user.id}}>{user.username}</Username>
          <ActionList>
            {isPlaying && <p>This player is currently in a game.</p>}

            {isChallengeable && (
              <Button
                variant="brand"
                onClick={() => initiateChallenge(user.id)}
              >
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
                <Button
                  variant="danger"
                  onClick={() => declineChallenge(user.id)}
                >
                  Decline
                </Button>
              </>
            )}
          </ActionList>
        </Wrapper>
      )}
    </Transition>
  );
}

const getTransitionStyles = state => {
  if (['entering', 'exiting'].includes(state))
    return `
    transform: translateY(33%);
    opacity: 0;
    `;

  return `
    transform: none;
    opacity: 1;
  `;
};

const Wrapper = styled.li`
  padding: ${spacing('sm')} 0;
  color: ${color('brand')};
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-items: center;
  transition: all ${props => props.transitionDuration}ms;
  ${props => getTransitionStyles(props.state)}
`;

const ActionList = styled(Flex)`
  & > * {
    margin: ${spacing('sm')};
  }
`;

const Username = styled(Link)`
  padding: ${spacing('sm')};
`;