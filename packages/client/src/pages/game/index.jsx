import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useRouteMatch } from 'react-router-dom';
import { isUndefined } from '@c4/shared';

import { useGameApi } from '@game/hooks/useGameApi';
import { useCurrentUser } from '@user/hooks/useCurrentUser';
import { useToast } from '@core/hooks/useToast';

import { fontSize } from '@styles/mixins';

import { Board } from '@game/components/Board';
import { GameOverModal } from '@game/components/GameOverModal';
import { Link } from '@core/components/Link';
import { Container } from '@core/components/Container';
import { Surface } from '@core/components/Surface';

export default function GamePage() {
  const { state, actions } = useGameApi();
  const { data: currentUser } = useCurrentUser();
  const { show } = useToast();
  const match = useRouteMatch();

  const handleColumnClick = colIndex => {
    if (state.winner) return;
    else if (state.currentPlayer !== currentUser.id) {
      show('Please wait for your turn ! 😀');
    } else {
      actions.addChecker(colIndex);
    }
  };

  useEffect(() => {
    actions.synchronizeState(match.params.id);
    //eslint-disable-next-line
  }, []);

  const turnIndicatorMessage = useMemo(
    () =>
      state?.currentPlayer === currentUser.id ? 'Your turn' : "Opponent's turn",
    [currentUser.id, state]
  );

  if (isUndefined(state)) return <div>Loading...</div>;

  return (
    <Container>
      <GameOverModal />
      <Surface>
        {state.isStale ? (
          <>
            <div>This game is already finished or does not exist.</div>
            <Link to="Lobby">Back to lobby</Link>
          </>
        ) : (
          <>
            <Board boardState={state} onColumnClick={handleColumnClick} />
            <TurnIndicator>{turnIndicatorMessage}</TurnIndicator>
          </>
        )}
      </Surface>
    </Container>
  );
}

const TurnIndicator = styled.p`
  text-align: center;
  font-size: ${fontSize('lg')};
`;
