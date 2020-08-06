import React, { useCallback, useContext, useEffect } from 'react';
import { constants } from '@c4/shared';

import { useAuth } from '@root/auth/hooks/useAuth';
import { useChallenge } from '@game/hooks/useChallenge';
import { useCurrentUser } from '@root/user/hooks/useCurrentUser';
import { useHistory } from 'react-router';
import { useWebsockets } from '@core/hooks/useWebsockets';

import { ConnectedUsersList } from '@user/components/ConnectedUsersList';
import { LobbyProvider, lobbyContext } from '@root/game/contexts/lobbyContext';

const { EVENTS } = constants;

export default function LobbyPage() {
  return (
    <LobbyProvider>
      <Lobby />
    </LobbyProvider>
  );
}

function Lobby() {
  const { isGameLoading, setIsGameLoading } = useContext(lobbyContext);
  const { logout } = useAuth();
  const currentUser = useCurrentUser();
  const history = useHistory();
  const { on } = useWebsockets();

  const onChallengeAccepted = useCallback(() => {
    setIsGameLoading(true);
  }, [setIsGameLoading]);

  useChallenge({ onChallengeAccepted });

  useEffect(() => {
    on(EVENTS.GAME_HAS_BEEN_CREATED, game => {
      history.push(`/game/${game.id}`);
    });
  }, [on, history]);

  return (
    <>
      <h1>Hello, {currentUser.data?.username}</h1>
      <button onClick={logout}>Sign off</button>
      {isGameLoading ? (
        <div>Starting your Game...</div>
      ) : (
        <ConnectedUsersList />
      )}
    </>
  );
}
