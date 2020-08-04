import React, { useMemo } from 'react';
import { useChallenge } from '@game/hooks/useChallenge';

export function ConnectedUsersListItem({ user }) {
  const { initiateChallenge, pendingChallenges } = useChallenge();

  const isChallengable = useMemo(
    () =>
      pendingChallenges.every(challenge => challenge.challengedId !== user.id),
    [user, pendingChallenges]
  );
  return (
    <div>
      <span>{user.username}</span>
      {isChallengable && (
        <button onClick={() => initiateChallenge(user.id)}>Challenge</button>
      )}
    </div>
  );
}
