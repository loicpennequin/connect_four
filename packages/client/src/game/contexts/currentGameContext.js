import React, { useState, useEffect, createContext } from 'react';
import { useWebsockets } from '@core/hooks/useWebsockets';
import { constants } from '@c4/shared';

const { EVENTS } = constants;
export const currentGameContext = createContext(null);

export function CurrentGameProvider({ children }) {
  const [gameState, setGameState] = useState(null);
  const { on } = useWebsockets({ connectOnMount: false});

  useEffect(() => {
    on(EVENTS.GAME_HAS_BEEN_CREATED, setGameState);
    on(EVENTS.PLAYER_CONNECTED_TO_GAME, setGameState);
    on(EVENTS.GAME_ACTION, setGameState);
  }, [on]);
  
  return (
    <currentGameContext.Provider value={gameState}>
      {children}
    </currentGameContext.Provider>
  );
}