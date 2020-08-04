import { useEffect, useCallback, useContext } from 'react';
import { constants, noop } from '@c4/shared';
import { useWebsockets } from '@core/hooks/useWebsockets';
import { useCurrentUser } from '@user/hooks/useCurrentUser';
import { challengeContext } from '@game/contexts/challengeContext';

const { EVENTS } = constants;

export function useChallenge({
  onChallengeInitiated = noop,
  onChallengeCancelled = noop,
  onChallengeAccepted = noop,
  onChallengeDeclined = noop
} = {}) {
  const { pendingChallenges, setPendingChallenges } = useContext(
    challengeContext
  );
  const currentUser = useCurrentUser();
  const { on, emit } = useWebsockets();

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
        challenges.filter(c => c.challengedId === challengedId)
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
        challenges.filter(c => c.challengerId === challengerId)
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
        challenges.filter(c => c.challengerId === challengerId)
      );
    },
    [emit, currentUser.data.id, setPendingChallenges]
  );

  useEffect(() => {
    const unsub = on(
      EVENTS.USER_INITIATED_CHALLENGE,
      ({ challenger, challenged }) => {
        if (pendingChallenges.find(c => c.challengerId === challenger.id))
          return;

        setPendingChallenges(challenges =>
          challenges.concat({
            challengerId: challenger.id,
            challengedId: challenged.id
          })
        );
        onChallengeInitiated({ challenger, challenged });
      }
    );

    return unsub;
  }, [on, onChallengeInitiated, pendingChallenges, setPendingChallenges]);

  useEffect(() => {
    const unsub = on(
      EVENTS.USER_CANCLELLED_CHALLENGE,
      ({ challenger, challenged }) => {
        setPendingChallenges(challenges =>
          challenges.filter(
            challenge => challenge.challengerId !== challenger.id
          )
        );
        onChallengeCancelled({ challenger, challenged });
      }
    );
    return unsub;
  }, [on, onChallengeCancelled, setPendingChallenges]);

  useEffect(() => {
    const unsub = on(
      EVENTS.USER_ACCEPTED_CHALLENGE,
      ({ challenger, challenged }) => {
        setPendingChallenges(challenges =>
          challenges.filter(
            challenge => challenge.challengedId !== challenged.id
          )
        );
        onChallengeAccepted({ challenger, challenged });
      }
    );
    return unsub;
  }, [on, onChallengeAccepted, setPendingChallenges]);

  useEffect(() => {
    const unsub = on(
      EVENTS.USER_REFUSED_CHALLENGE,
      ({ challenger, challenged }) => {
        setPendingChallenges(challenges =>
          challenges.filter(
            challenge => challenge.challengedId !== challenged.id
          )
        );
        onChallengeDeclined({ challenger, challenged });
      }
    );
    return unsub;
  }, [on, onChallengeDeclined, setPendingChallenges]);

  return {
    pendingChallenges,
    initiateChallenge,
    cancelChallenge,
    acceptChallenge,
    declineChallenge
  };
}
