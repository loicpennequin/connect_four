import React, { useState, createContext } from 'react';

export const challengeContext = createContext(null);

export function ChallengeProvider({ children }) {
  const [pendingChallenges, setPendingChallenges] = useState([]);

  return (
    <challengeContext.Provider
      value={{ pendingChallenges, setPendingChallenges }}
    >
      {children}
    </challengeContext.Provider>
  );
}
