import React, { useMemo, useContext } from 'react';
import styled from 'styled-components';
import { Transition } from 'react-transition-group';

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
    <Transition appear={true} timeout={transitionDuration} {...props}>
      {state => (
        <Wrapper state={state} transitionDuration={transitionDuration}>
          <Link to="Profile" params={{id: user.id}}>{user.username}</Link>
          <ActionList>
            {isChallengeable && (
              <Button
                variant="accent"
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
  grid-template-columns: 2fr 1fr;
  align-items: center;
  transition: all ${props => props.transitionDuration}ms;
  ${props => getTransitionStyles(props.state)}
`;

const ActionList = styled(Flex)`
  & > * {
    margin: ${spacing('sm')};
  }
`;
