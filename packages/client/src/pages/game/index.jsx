import React, { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { isUndefined } from '@c4/shared';

import { useGameApi } from '@game/hooks/useGameApi';
import { useCurrentUser } from '@user/hooks/useCurrentUser';
import { useToast } from '@core/hooks/useToast';

import { Board } from '@game/components/Board';
import { GameOverModal } from '@game/components/GameOverModal';
import { Link } from '@core/components/Link';
import { Container } from '@core/components/Container';

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

  if (isUndefined(state)) return <div>Loading...</div>;

  return (
    <Container>
      <GameOverModal />
      {state.isStale ? (
        <>
        <div>This game is already finished or does not exist.</div>
        <Link to="Lobby">Back to lobby</Link>
        </>
      ) : (
        <Board boardState={state} onColumnClick={handleColumnClick} />
      )}
    </Container>
  );
}
