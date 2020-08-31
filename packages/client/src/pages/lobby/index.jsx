import React, { useCallback, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useChallenge } from '@game/hooks/useChallenge';
import { useResponsive } from '@core/hooks/useResponsive';
import { lobbyContext } from '@root/game/contexts/lobbyContext';

import { spacing, mobileOnly } from '@styles/mixins';

import { Container } from '@core/components/Container';
import { Flex } from '@core/components/Flex';
import { Surface } from '@core/components/Surface';
import { Tabs } from '@core/components/Tabs';
import { ConnectedUsersList } from '@user/components/ConnectedUsersList';
import { MessageList } from '@message/components/MessageList';

export default function LobbyPage() {
  const { isMobile } = useResponsive();
  const { isGameLoading, setIsGameLoading } = useContext(lobbyContext);

  const onChallengeAccepted = useCallback(() => {
    setIsGameLoading(true);
  }, [setIsGameLoading]);

  useChallenge({ onChallengeAccepted });

  return (
    <Wrapper>
      <Surface>
        {isGameLoading ? (
          <LoadingWrapper direction="column" align="center">
            <Spinner>
              <FontAwesomeIcon icon={faSpinner} size="2x" />
            </Spinner>
            <div>Starting your Game...</div>
          </LoadingWrapper>
        ) : isMobile ? (
          <Tabs>
            <Tabs.Item label="Messages">
              <MessageList />
            </Tabs.Item>
            <Tabs.Item label="Users">
              <ConnectedUsersList />
            </Tabs.Item>
          </Tabs>
        ) : (
          <Grid>
            <div>
              <MessageList />
            </div>
            <aside>
              <ConnectedUsersList />
            </aside>
          </Grid>
        )}
      </Surface>
    </Wrapper>
  );
}

const Wrapper = styled(Container)`
  display: flex;
  height: 100%;
  overflow-y: hidden;

  & > * {
    flex-grow: 1;
  }
`;

const LoadingWrapper = styled(Flex)`
  padding: ${spacing('lg')};
`;

const spin = keyframes`
  from {
    transform: none
  } to {
    transform: rotateZ(1turn);
  }
`;

const Spinner = styled.div`
  animation: ${spin} 1.5s linear infinite;
`;

const Grid = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 2fr 1fr;

  & > *,
  & > * > * {
    height: 100%;
    overflow-y: hidden;
  }

  @media screen and (${mobileOnly}) {
    display: block;
  }
`;
