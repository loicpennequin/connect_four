import React, { useMemo } from 'react';
import { useChallenge } from '@game/hooks/useChallenge';

export function ConnectedUsersListItem({ user }) {
  const {
    initiateChallenge,
    cancelChallenge,
    acceptChallenge,
    declineChallenge,
    pendingChallenges
  } = useChallenge();

  const isChallengable = useMemo(
    () =>
      pendingChallenges.every(
        challenge =>
          challenge.challengedId !== user.id &&
          challenge.challengerId !== user.id
      ),
    [user, pendingChallenges]
  );

  const isCancellable = useMemo(
    () =>
      pendingChallenges.some(challenge => challenge.challengedId === user.id),
    [user, pendingChallenges]
  );

  const isAnswerable = useMemo(
    () =>
      pendingChallenges.some(challenge => challenge.challengerId === user.id),
    [user, pendingChallenges]
  );

  return (
    <div>
      <span>{user.username}</span>
      {isChallengable && (
        <button onClick={() => initiateChallenge(user.id)}>Challenge</button>
      )}
      {isCancellable && (
        <button onClick={() => cancelChallenge(user.id)}>Cancel</button>
      )}

      {isAnswerable && (
        <>
          <button onClick={() => acceptChallenge(user.id)}>Accept</button>
          <button onClick={() => declineChallenge(user.id)}>Decline</button>
        </>
      )}
    </div>
  );
}
