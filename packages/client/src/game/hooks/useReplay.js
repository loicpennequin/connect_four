import { useState, useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';

import { GameService } from '@game/api/GameService';

export function useReplay(gameId) {
  const [currentStep, setCurrentStep] = useState(0);

  const game = useQuery(
    ['game', gameId],
    async () => {
      return GameService.getGameById(gameId);
    },
    {
      retry: false
    }
  );

  const goToNextStep = useCallback(() => {
    if (currentStep >= game.data.history.length - 1) return;
    setCurrentStep(s => s + 1);
  }, [currentStep, game.data]);
  const goToPreviousStep = useCallback(
    () => setCurrentStep(s => (s === 0 ? s : s - 1)),
    []
  );
  const goToFirstStep = useCallback(() => setCurrentStep(0), []);
  const goToLastStep = useCallback(
    () => setCurrentStep(game.data.history.length - 1),
    [game.data]
  );

  const state = useMemo(() => {
    if (game.isLoading) return null;
    return game.data.history[currentStep];
  }, [currentStep, game]);

  return useMemo(
    () => ({
      isLoading: game.isLoading,
      state,
      goToFirstStep,
      goToPreviousStep,
      goToNextStep,
      goToLastStep
    }),
    [
      game.isLoading,
      goToFirstStep,
      goToLastStep,
      goToNextStep,
      goToPreviousStep,
      state
    ]
  );
}
