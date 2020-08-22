import React, { useCallback, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { constants } from '@c4/shared';

import { useChallenge } from '@game/hooks/useChallenge';
import { useHistory } from 'react-router';
import { useWebsockets } from '@core/hooks/useWebsockets';

import { Container } from '@core/components/Container';
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
          <div>Starting your Game...</div>
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
