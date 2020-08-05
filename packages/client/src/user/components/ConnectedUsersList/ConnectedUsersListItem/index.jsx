import React, { useMemo, useContext } from 'react';
import { useChallenge } from '@game/hooks/useChallenge';
import { lobbyContext } from '@root/game/contexts/lobbyContext';

export function ConnectedUsersListItem({ user }) {
  const {
    initiateChallenge,
    cancelChallenge,
    acceptChallenge,
    declineChallenge,
    pendingChallenges
  } = useChallenge();
  const { setIsGameLoading } = useContext(lobbyContext);

  const isChallengeable = useMemo(
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

  const handleAccept = () => {
    acceptChallenge(user.id);
    setIsGameLoading(true);
  };

  return (
    <div>
      <span>{user.username}</span>
      {isChallengeable && (
        <button onClick={() => initiateChallenge(user.id)}>Challenge</button>
      )}
      {isCancellable && (
        <button onClick={() => cancelChallenge(user.id)}>Cancel</button>
      )}

      {isAnswerable && (
        <>
          <button onClick={handleAccept}>Accept</button>
          <button onClick={() => declineChallenge(user.id)}>Decline</button>
        </>
      )}
    </div>
  );
}
