import React, { useCallback, useContext, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { constants } from '@c4/shared';

import { useChallenge } from '@game/hooks/useChallenge';
import { useHistory } from 'react-router';
import { useWebsockets } from '@core/hooks/useWebsockets';

import { spacing } from '@styles/mixins';

import { Container } from '@core/components/Container';
import { Flex } from '@core/components/Flex';
import { Surface } from '@core/components/Surface';
import { ConnectedUsersList } from '@user/components/ConnectedUsersList';
import { lobbyContext } from '@root/game/contexts/lobbyContext';

const { EVENTS } = constants;

export default function LobbyPage() {
  const { isGameLoading, setIsGameLoading } = useContext(lobbyContext);
  const history = useHistory();
  const { on } = useWebsockets();

  const onChallengeAccepted = useCallback(() => {
    setIsGameLoading(true);
  }, [setIsGameLoading]);

  useEffect(() => {
    on(EVENTS.GAME_HAS_BEEN_CREATED, game => {
      history.push(`/game/${game.id}`);
    });
  }, [on, history]);

  useChallenge({ onChallengeAccepted });

  return (
    <Wrapper>
      <Surface>
        {isGameLoading ? (
          <LoadingWrapper direction="column" align="center">
            <Spinner>
              <FontAwesomeIcon icon={faSpinner} size="2x" />
            </Spinner>
            <div>Starting your Game...</div>
          </LoadingWrapper>
        ) : (
          <ConnectedUsersList />
        )}
      </Surface>
    </Wrapper>
  );
}

const Wrapper = styled(Container)`
  display: flex;
  & > * {
    flex-grow: 1;
  }
`;

const LoadingWrapper = styled(Flex)`
  padding: ${spacing('lg')};
`;

const spin = keyframes`
  from {
    transform: none
  } to {
    transform: rotateZ(1turn);
  }
`;

const Spinner = styled.div`
  animation: ${spin} 1.5s linear infinite;
`;
