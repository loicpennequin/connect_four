import { useEffect, useCallback, useContext } from 'react';
import { constants } from '@c4/shared';
import { useWebsockets } from '@core/hooks/useWebsockets';
import { useCurrentUser } from '@user/hooks/useCurrentUser';
import { challengeContext } from '@game/contexts/challengeContext';

const { EVENTS } = constants;

export function useChallenge({
  onChallengeInitiated,
  onChallengeCancelled,
  onChallengeAccepted,
  onChallengeDeclined
} = {}) {
  const { pendingChallenges, setPendingChallenges } = useContext(
    challengeContext
  );
  const currentUser = useCurrentUser();
  const { on, emit } = useWebsockets({ connectOnMount: false });

  const initiateChallenge = useCallback(
    challengedId => {
      if (pendingChallenges.find(c => c.challengedId === challengedId)) return;
      const data = { challengedId, challengerId: currentUser.data.id };
      emit(EVENTS.USER_INITIATED_CHALLENGE, data);
      setPendingChallenges(challenges => challenges.concat(data));
    },
    [emit, currentUser.data.id, pendingChallenges, setPendingChallenges]
  );

  const cancelChallenge = useCallback(
    challengedId => {
      emit(EVENTS.USER_CANCELLED_CHALLENGE, {
        challengedId,
        challengerId: currentUser.data.id
      });
      setPendingChallenges(challenges =>
        challenges.filter(c => c.challengedId !== challengedId)
      );
    },
    [emit, currentUser.data.id, setPendingChallenges]
  );

  const acceptChallenge = useCallback(
    challengerId => {
      emit(EVENTS.USER_ACCEPTED_CHALLENGE, {
        challengedId: currentUser.data.id,
        challengerId
      });
      setPendingChallenges(challenges =>
        challenges.filter(c => c.challengerId !== challengerId)
      );
    },
    [emit, currentUser.data.id, setPendingChallenges]
  );

  const declineChallenge = useCallback(
    challengerId => {
      emit(EVENTS.USER_REFUSED_CHALLENGE, {
        challengedId: currentUser.data.id,
        challengerId
      });

      setPendingChallenges(challenges =>
        challenges.filter(c => c.challengerId !== challengerId)
      );
    },
    [emit, currentUser.data.id, setPendingChallenges]
  );

  useEffect(() => {
    if (!onChallengeInitiated) return;

    const unsub = on(
      EVENTS.USER_INITIATED_CHALLENGE,
      ({ challenger, challenged }) => {
        onChallengeInitiated({ challenger, challenged });
      }
    );

    return unsub;
  }, [on, onChallengeInitiated]);

  useEffect(() => {
    if (!onChallengeCancelled) return;
    
    const unsub = on(
      EVENTS.USER_CANCELLED_CHALLENGE,
      ({ challenger, challenged }) => {
        onChallengeCancelled({ challenger, challenged });
      }
    );
    return unsub;
  }, [on, onChallengeCancelled]);

  useEffect(() => {
    if (!onChallengeAccepted) return;
    
    const unsub = on(
      EVENTS.USER_ACCEPTED_CHALLENGE,
      ({ challenger, challenged }) => {
        onChallengeAccepted({ challenger, challenged });
      }
    );
    return unsub;
  }, [on, onChallengeAccepted]);

  useEffect(() => {
    if (!onChallengeDeclined) return;
    
    const unsub = on(
      EVENTS.USER_REFUSED_CHALLENGE,
      ({ challenger, challenged }) => {
        onChallengeDeclined({ challenger, challenged });
      }
    );
    return unsub;
  }, [on, onChallengeDeclined]);

  return {
    pendingChallenges,
    initiateChallenge,
    cancelChallenge,
    acceptChallenge,
    declineChallenge
  };
}
