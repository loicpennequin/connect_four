import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import { useReplay } from '@game/hooks/useReplay';

import { Board } from '@game/components/Board';
import { Container } from '@core/components/Container';
import { ReplayControls } from '@game/components/ReplayControls';

export default function ReplayPage() {
  const match = useRouteMatch();
  const { isLoading, state, ...controls } = useReplay(match.params.id);

  if (isLoading) return <div>Game loading, please wait...</div>;

  return (
    <Container>
      <Board boardState={state} />
      <ReplayControls controls={controls} />
    </Container>
  );
}
