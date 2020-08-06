import React from 'react';
import { ThemeProvider } from '@styles/ThemeProvider';
import { AuthProvider } from '@root/auth/components/AuthProvider';
import { ToastProvider } from '@root/core/components/Toast';
import { ChallengeProvider } from '@game/contexts/challengeContext';
import { CurrentGameProvider } from '@game/contexts/currentGameContext';

export function Store({ children }) {
  return (
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <ChallengeProvider>
              <CurrentGameProvider>
                {children}
              </CurrentGameProvider>
            </ChallengeProvider>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
  );
}