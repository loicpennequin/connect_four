import { gameApi } from '@root/game/api';
import { useState, useEffect, useCallback } from 'react';

export function useGameApi() {
  const [state, setState] = useState(gameApi.state);

  useEffect(() => {
    function onUpdate(newState) {
      setState(Object.assign({}, newState));
    }
    gameApi.on('update', onUpdate);

    return () => {
      gameApi.off('update', onUpdate);
    };
  }, []);

  const addChecker = useCallback(
    column => {
      if (state.winner) return;
      gameApi.addChecker(column);
    },
    [state.winner]
  );

  return {
    state,
    gameApi,
    addChecker
  };
}
