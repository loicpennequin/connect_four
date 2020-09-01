import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useRouteMatch } from 'react-router-dom';
import { isUndefined } from '@c4/shared';

import { useGameApi } from '@game/hooks/useGameApi';
import { useCurrentUser } from '@user/hooks/useCurrentUser';
import { useUser } from '@user/hooks/useUser';
import { useResponsive } from '@core/hooks/useResponsive';
import { useToast } from '@core/hooks/useToast';

import { color, spacing, mobileOnly } from '@styles/mixins';

import { Board } from '@game/components/Board';
import { GameOverModal } from '@game/components/GameOverModal';
import { Link } from '@core/components/Link';
import { Container } from '@core/components/Container';
import { Surface } from '@core/components/Surface';
import { MessageList } from '@message/components/MessageList';
import { Tabs } from '@core/components/Tabs';

export default function GamePage() {
  const match = useRouteMatch();
  const { state, actions } = useGameApi();
  const { data: currentUser } = useCurrentUser();
  const { show } = useToast();
  const { data: user1 } = useUser(state?.playerIds[0]);
  const { data: user2 } = useUser(state?.playerIds[1]);
  const { isMobile } = useResponsive();

  const handleColumnClick = colIndex => {
    if (state.winner) return;
    else if (state.currentPlayer !== currentUser.id) {
      show('Please wait for your turn ! 😀');
    } else {
      actions.addChecker(colIndex);
    }
  };

  useEffect(() => {
    actions.synchronizeState(match.params.id);
    //eslint-disable-next-line
  }, []);

  const activePlayerIndex = state?.playerIds?.findIndex?.(
    id => id === state.currentPlayer
  );

  if (isUndefined(state)) return <div>Loading...</div>;

  return (
    <Wrapper>
      <GameOverModal />
      <ContentWrapper>
        {state.isStale ? (
          <>
            <div>This game is already finished or does not exist.</div>
            <Link to="Lobby">Back to lobby</Link>
          </>
        ) : isMobile ? (
          <>
            <Title activePlayerIndex={activePlayerIndex}>
              <span>{user1?.username}</span> vs <span>{user2?.username}</span>
            </Title>
            <Tabs initialActiveTab={0}>
              <Tabs.Item label="Game">
                <Board boardState={state} onColumnClick={handleColumnClick} />
              </Tabs.Item>
              <Tabs.Item label="Messages">
                <StyledMessageList gameId={match.params.id} />
              </Tabs.Item>
            </Tabs>
          </>
        ) : (
          <Grid>
            <Title activePlayerIndex={activePlayerIndex}>
              <span>{user1?.username}</span> vs <span>{user2?.username}</span>
            </Title>
            <Board boardState={state} onColumnClick={handleColumnClick} />
            <StyledMessageList gameId={match.params.id} />
          </Grid>
        )}
      </ContentWrapper>
    </Wrapper>
  );
}

const Wrapper = styled(Container)`
  height: 100vh;
  overflow: hidden;
`;
const ContentWrapper = styled(Surface)`
  height: 100%;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr minmax(300px, 1fr);
  grid-template-rows: 5em auto;
  height: 100%;
  & > * {
    padding: ${spacing('sm')};
  }
`;

const StyledMessageList = styled(MessageList)`
  overflow-y: auto;
  @media screen and (${mobileOnly}) {
    height: 86%;
  }
`;

const Title = styled.h1`
  grid-column: 1 / -1;
  margin: 0;
  margin-bottom: ${spacing('sm')};
  padding: 0;

  span {
    text-transform: uppercase;
    border-bottom: solid 3px transparent;
    padding: ${spacing('xs')};
    transition: border-color 0.3s;

    &:nth-of-type(1) {
      color: ${color('redChecker')};
      ${props => props.activePlayerIndex === 0 && `border-color: currentColor;`}
    }
    &:nth-of-type(2) {
      color: ${color('yellowChecker')};
      ${props => props.activePlayerIndex === 1 && `border-color: currentColor;`}
    }
  }
`;
