import React, { useState, useEffect, createContext } from 'react';
import { useWebsockets } from '@core/hooks/useWebsockets';
import { constants } from '@c4/shared';

const { EVENTS } = constants;

export const lobbyContext = createContext(null);

export function LobbyProvider({ children }) {
  const [isGameLoading, setIsGameLoading] = useState(false);

  const { on } = useWebsockets();

  useEffect(() => {
    on(EVENTS.GAME_HAS_FINISHED, () => setIsGameLoading(false));
  }, [on]);

  return (
    <lobbyContext.Provider
      value={{ isGameLoading, setIsGameLoading }}
    >
      {children}
    </lobbyContext.Provider>
  );
}
