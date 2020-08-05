import React from 'react';
import { useAuth } from '@root/auth/hooks/useAuth';
import { useCurrentUser } from '@root/user/hooks/useCurrentUser';
import { ConnectedUsersList } from '@user/components/ConnectedUsersList';

export default function LobbyPage() {
  const { logout } = useAuth();
  const currentUser = useCurrentUser();

  return (
    <>
      <h1>
        Hello, {currentUser.data?.username} (id: {currentUser.data.id})
      </h1>
      <ConnectedUsersList />
      <button onClick={logout}>Sign off</button>
    </>
  );
}
