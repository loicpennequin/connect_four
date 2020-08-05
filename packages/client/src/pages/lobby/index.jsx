import React, { useCallback, useContext } from 'react';
import { useAuth } from '@root/auth/hooks/useAuth';
import { useCurrentUser } from '@root/user/hooks/useCurrentUser';
import { ConnectedUsersList } from '@user/components/ConnectedUsersList';
import { useChallenge } from '@game/hooks/useChallenge';
import { LobbyProvider, lobbyContext } from '@root/game/contexts/lobbyContext';

export default function LobbyPage() {
  return (
    <LobbyProvider>
      <Lobby/>
    </LobbyProvider>  
  )
}

function Lobby() {
  const {isGameLoading, setIsGameLoading } = useContext(lobbyContext);
  
  const { logout } = useAuth();

  const currentUser = useCurrentUser();
  const onChallengeAccepted = useCallback(() => {
    setIsGameLoading(true);
  }, [setIsGameLoading]);

  useChallenge({ onChallengeAccepted });

  return (
    <>
      <h1>
        Hello, {currentUser.data?.username} (id: {currentUser.data.id})
      </h1>
      <button onClick={logout}>Sign off</button>
      {isGameLoading ? (
        <div>Starting your Game...</div>
      ) : (
        <ConnectedUsersList />
      )}
    </>
  );
}
