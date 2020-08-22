import React from 'react';
import { ThemeProvider } from '@styles/ThemeProvider';
import { AuthProvider } from '@root/auth/components/AuthProvider';
import { ToastProvider } from '@root/core/components/Toast';
import { ChallengeProvider } from '@game/contexts/challengeContext';
import { CurrentGameProvider } from '@game/contexts/currentGameContext';
import { LobbyProvider } from '@game/contexts/lobbyContext';

export function Store({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <ChallengeProvider>
            <LobbyProvider>
              <CurrentGameProvider>{children}</CurrentGameProvider>
            </LobbyProvider>
          </ChallengeProvider>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
