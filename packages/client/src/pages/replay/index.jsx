import React from 'react';
import styled from 'styled-components';
import { useRouteMatch } from 'react-router-dom';

import { spacing, mobileOnly } from '@styles/mixins';
import { useReplay } from '@game/hooks/useReplay';

import { useResponsive } from '@core/hooks/useResponsive';

import { Board } from '@game/components/Board';
import { Container } from '@core/components/Container';
import { Flex } from '@core/components/Flex';
import { Surface } from '@core/components/Surface';
import { ReplayControls } from '@game/components/ReplayControls';
import { ReplayTree } from '@game/components/ReplayTree';
import { Tabs } from '@core/components/Tabs';

export default function ReplayPage() {
  const { isMobile } = useResponsive();

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

  const desktopContent = (
    <Grid>
      <Flex justify="center">
        <Board boardState={currentNode.value} onColumnClick={addNode} />
        <ReplayControlsWrapper>
          <ReplayControls controls={controls} />
        </ReplayControlsWrapper>
      </Flex>
      <aside>
        <ReplayTree tree={tree} onClick={goToNode} currentNode={currentNode} />
      </aside>
    </Grid>
  );

  const mobileContent = (
    <>
      <Tabs initialActiveTab={0}>
        <Tabs.Item label="Board">
          <Board boardState={currentNode.value} onColumnClick={addNode} />
        </Tabs.Item>
        <Tabs.Item label="Tree">
          <ReplayTree
            tree={tree}
            onClick={goToNode}
            currentNode={currentNode}
          />
        </Tabs.Item>
      </Tabs>
      <ReplayControlsWrapper>
        <ReplayControls controls={controls} />
      </ReplayControlsWrapper>
    </>
  );

  return (
    <Container>
      <StyledSurface>{isMobile ? mobileContent : desktopContent}</StyledSurface>
    </Container>
  );
}

const StyledSurface = styled(Surface)`
  @media screen and (${mobileOnly}) {
    padding: 0;
    overflow-y: auto;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  @media screen and (${mobileOnly}) {
    display: block;
  }
`;

const ReplayControlsWrapper = styled.div`
  flex-basis: 100%;
  padding: ${spacing('md')};
`;
