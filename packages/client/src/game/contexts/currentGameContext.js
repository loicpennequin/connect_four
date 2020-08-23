import React, { useState, useEffect, createContext } from 'react';
import { useHistory } from 'react-router';
import { constants } from '@c4/shared';

import { useWebsockets } from '@core/hooks/useWebsockets';

const { EVENTS } = constants;
export const currentGameContext = createContext(null);

export function CurrentGameProvider({ children }) {
  const [gameState, setGameState] = useState(null);
    const history = useHistory();

  const { on } = useWebsockets({ connectOnMount: false });

  useEffect(() => {
    on(EVENTS.GAME_HAS_BEEN_CREATED, setGameState);
    on(EVENTS.GAME_ACTION, setGameState);
  }, [on]);

  useEffect(() => {
    const unsub = on(EVENTS.PLAYER_CONNECTED_TO_GAME, state => {
      if (!gameState) setGameState(state);
    });

    return unsub;
  }, [gameState, on]);

  useEffect(() => {
    const unsub = on(EVENTS.PLAYER_CONNECTED_TO_STALE_GAME, () => {
      setGameState({ isStale: true });
    });

    return unsub;
  });

    useEffect(() => {
      on(EVENTS.GAME_HAS_BEEN_CREATED, game => {
        history.push(`/game/${game.id}`);
      });
    }, [on, history]);
  return (
    <currentGameContext.Provider value={gameState}>
      {children}
    </currentGameContext.Provider>
  );
}
