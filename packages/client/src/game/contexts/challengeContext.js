import React, { useState, useEffect, createContext } from 'react';
import { constants } from '@c4/shared';
import { useWebsockets } from '@core/hooks/useWebsockets';

const { EVENTS } = constants;

export const challengeContext = createContext(null);

export function ChallengeProvider({ children }) {
  const [pendingChallenges, setPendingChallenges] = useState([]);

  const { on } = useWebsockets();

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
      }
    );

    return unsub;
  }, [on, pendingChallenges, setPendingChallenges]);

  useEffect(() => {
    const unsub = on(
      EVENTS.USER_CANCELLED_CHALLENGE,
      ({ challenger, challenged }) => {
        setPendingChallenges(challenges =>
          challenges.filter(
            challenge => challenge.challengerId !== challenger.id
          )
        );
      }
    );
    return unsub;
  }, [on, setPendingChallenges]);

  useEffect(() => {
    const unsub = on(
      EVENTS.USER_ACCEPTED_CHALLENGE,
      ({ challenger, challenged }) => {
        setPendingChallenges(challenges =>
          challenges.filter(
            challenge => challenge.challengedId !== challenged.id
          )
        );
      }
    );
    return unsub;
  }, [on, setPendingChallenges]);

  useEffect(() => {
    const unsub = on(
      EVENTS.USER_REFUSED_CHALLENGE,
      ({ challenger, challenged }) => {
        setPendingChallenges(challenges =>
          challenges.filter(
            challenge => challenge.challengedId !== challenged.id
          )
        );
      }
    );
    return unsub;
  }, [on, setPendingChallenges]);


  return (
    <challengeContext.Provider
      value={{ pendingChallenges, setPendingChallenges }}
    >
      {children}
    </challengeContext.Provider>
  );
}
