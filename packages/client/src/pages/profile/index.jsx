import React from 'react';
import styled from 'styled-components';

import { color, spacing } from '@styles/mixins';
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
        <Username>
          {user.username}
          <Status isOnline={user.isOnline}/>
        </Username>
        <GameHistory userId={id} />
      </Surface>
    </Container>
  );
}

const Username = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 8px;
`;

const Status = styled.div`
  --size: 0.5em;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background-color: ${props => color(props.isOnline ? 'success' : 'danger')};
  margin-left: ${spacing('sm')};
`;
