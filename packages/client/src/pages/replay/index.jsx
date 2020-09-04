import React from 'react';
import styled from 'styled-components';
import { useRouteMatch } from 'react-router-dom';

import{ spacing } from '@styles/mixins'
import { useReplay } from '@game/hooks/useReplay';

import { Board } from '@game/components/Board';
import { Container } from '@core/components/Container';
import { Flex } from '@core/components/Flex';
import { Surface } from '@core/components/Surface';
import { ReplayControls } from '@game/components/ReplayControls';
import { ReplayTree } from '@game/components/ReplayTree';

export default function ReplayPage() {
  const match = useRouteMatch();
  const {
    isLoading,
    currentNode,
    tree,
    goToNode,
    addNode,
    ...controls
  } = useReplay(match.params.id);

  if (isLoading || !currentNode) return <div>Game loading, please wait...</div>;

  return (
    <Container>
      <Surface>
        <Grid>
          <Flex justify="center">
            <Board boardState={currentNode.value}  onColumnClick={addNode} />
            <ReplayControlsWrapper>
              <ReplayControls controls={controls} />
            </ReplayControlsWrapper>
          </Flex>
          <aside>
            <ReplayTree tree={tree} onClick={goToNode} currentNode={currentNode} />
          </aside>
        </Grid>
      </Surface>
    </Container>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
`

const ReplayControlsWrapper = styled.div`
flex-basis: 100%;
padding: ${spacing('md')};
`