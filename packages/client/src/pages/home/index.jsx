import React, { useEffect } from 'react';
import Board from '@root/game/components/Board';
import { useUsers } from '@root/user/hooks/useUsers';

export default function HomePage() {
  const { users, getAllUsers, isLoading } = useUsers();

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>User count: {users.length}</div>
      )}
      <Board />
    </>
  );
}
