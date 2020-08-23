import React from 'react';
import { useUser } from '@user/hooks/useUser';

import { GameHistory } from '@game/components/GameHistory';
import { Surface } from '@core/components/Surface';
import { Container } from '@core/components/Container';

export default function ProfilePage({ match }) {
  const id = Number(match.params.id);
  const { data: user } = useUser(id);

  if (!user) return null;
  return (
    <Container>
      <Surface>
        <h1 style={{textAlign: 'center'}}>{user.username}</h1>
        <GameHistory userId={id} />
      </Surface>
    </Container>
  );
}
