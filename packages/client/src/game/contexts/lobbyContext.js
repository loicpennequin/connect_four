import React, { useState, createContext } from 'react';

export const lobbyContext = createContext(null);

export function LobbyProvider({ children }) {
  const [isGameLoading, setIsGameLoading] = useState(false);

  return (
    <lobbyContext.Provider
      value={{ isGameLoading, setIsGameLoading }}
    >
      {children}
    </lobbyContext.Provider>
  );
}
