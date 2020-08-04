import { useEffect, useCallback } from 'react';
import { constants, noop } from '@c4/shared';
import { useWebsockets } from '@core/hooks/useWebsockets';
import { useCurrentUser } from '@user/hooks/useCurrentUser';

const { EVENTS } = constants;

export function useChallenge({
  onChallengeInitiated = noop,
  onChallengeCancelled = noop,
  onChallengeAccepted = noop,
  onChallengeDeclined = noop
} = {}) {
  const currentUser = useCurrentUser();
  const { on, emit } = useWebsockets();

  const initiateChallenge = useCallback(
    challengedId => {
      emit(EVENTS.USER_INITIATED_CHALLENGE, {
        challengedId,
        challengerId: currentUser.data.id
      });
    },
    [emit, currentUser.data.id]
  );

  const cancelChallenge = useCallback(
    challengedId => {
      emit(EVENTS.USER_CANCELLED_CHALLENGE, {
        challengedId,
        challengerId: currentUser.data.id
      });
    },
    [emit, currentUser.data.id]
  );

  const acceptChallenge = useCallback(
    challengerId => {
      emit(EVENTS.USER_ACCEPTED_CHALLENGE, {
        challengedId: currentUser.data.id,
        challengerId
      });
    },
    [emit, currentUser.data.id]
  );

  const declineChallenge = useCallback(
    challengerId => {
      emit(EVENTS.USER_REFUSED_CHALLENGE, {
        challengedId: currentUser.data.id,
        challengerId
      });
    },
    [emit, currentUser.data.id]
  );

  useEffect(() => {
    const unsub = on(EVENTS.USER_INITIATED_CHALLENGE, onChallengeInitiated);
    return unsub;
  }, [on, onChallengeInitiated]);

  useEffect(() => {
    const unsub = on(EVENTS.USER_CANCLELLED_CHALLENGE, onChallengeCancelled);
    return unsub;
  }, [on, onChallengeCancelled]);

  useEffect(() => {
    const unsub = on(EVENTS.USER_ACCEPTED_CHALLENGE, onChallengeAccepted);
    return unsub;
  }, [on, onChallengeAccepted]);

  useEffect(() => {
    const unsub = on(EVENTS.USER_DECLINED_CHALLENGE, onChallengeDeclined);
    return unsub;
  }, [on, onChallengeDeclined]);

  return {
    initiateChallenge,
    cancelChallenge,
    acceptChallenge,
    declineChallenge
  };
}
