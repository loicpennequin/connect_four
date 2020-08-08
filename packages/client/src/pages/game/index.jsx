import React, { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { isUndefined } from '@c4/shared';
import { useGameApi } from '@game/hooks/useGameApi';
import { useCurrentUser } from '@user/hooks/useCurrentUser';
import { useToast } from '@core/hooks/useToast';

import { Board } from '@game/components/Board';

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
    // actions.synchronizeState(match.params.id)
    console.log(match.params.id)
  }, [actions, match.params.id]);

  if (isUndefined(state)) return <div>Loading...</div>;

  return (
    <>
      <h1>
        {state.currentPlayer === currentUser.id ? 'Your' : "Opponent's"} turn
      </h1>
      <Board boardState={state} onColumnClick={handleColumnClick} />
    </>
  );
}
