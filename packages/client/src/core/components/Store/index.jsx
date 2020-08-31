import React from 'react';
import { ThemeProvider } from '@styles/ThemeProvider';
import { AuthProvider } from '@root/auth/components/AuthProvider';
import { ToastProvider } from '@root/core/components/Toast';
import { ChallengeProvider } from '@game/contexts/challengeContext';
import { CurrentGameProvider } from '@game/contexts/currentGameContext';
import { LobbyProvider } from '@game/contexts/lobbyContext';
import { GlobalStyles } from '@root/core/GlobalStyles';
import { Layout } from '@core/components/Layout';

export function Store({ children }) {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <AuthProvider>
        <ToastProvider>
          <ChallengeProvider>
            <LobbyProvider>
              <CurrentGameProvider>
                <Layout>
                  {children}
                </Layout>
              </CurrentGameProvider>
            </LobbyProvider>
          </ChallengeProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
