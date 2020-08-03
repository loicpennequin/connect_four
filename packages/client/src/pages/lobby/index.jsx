import React from 'react';
import { useAuth } from '@root/auth/hooks/useAuth';
// import { useUsers } from '@root/user/hooks/useUsers';

export default function LobbyPage() {
  const { logout }= useAuth();

  const handleClick = async () => {
    await logout();
  }

  return <button onClick={handleClick}>Sign off</button>
}
