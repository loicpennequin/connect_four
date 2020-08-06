import { useContext, useMemo } from 'react';
import { currentGameContext } from '@game/contexts/currentGameContext';
import { useCurrentUser } from '@user/hooks/useCurrentUser';
import { useWebsockets } from '@core/hooks/useWebsockets';
import { constants } from '@c4/shared';

const { EVENTS } = constants;

export function useGameApi() {
  const state = useContext(currentGameContext);
  const { data: currentUser } = useCurrentUser();

  const { emit } = useWebsockets();

  const actions = useMemo(
    () => ({
      addChecker(column) {
        emit(EVENTS.GAME_ACTION, {
          column,
          gameId: state.id,
          player: currentUser.id
        });
      }
    }),
    [emit, currentUser.id, state.id]
  );
  return {
    state,
    actions
  };
}
