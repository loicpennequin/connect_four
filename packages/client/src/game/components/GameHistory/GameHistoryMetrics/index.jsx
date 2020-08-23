import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

import { color, fontSize, fontWeight } from '@styles/mixins';

import { Flex } from '@core/components/Flex';

export function GameHistoryMetrics({ gameHistory }) {

  const winRatePercentage = useMemo(
    () => gameHistory && gameHistory.winRate * 100 + '%',
    [gameHistory]
  );

  return (
      <Flex justify="space-around">
        <Flex direction="column">
          <InfoLabel>Games played</InfoLabel>
          <GameCount justify="center" align="center">
            {gameHistory.games.length}
          </GameCount>
        </Flex>
        <div>
          <h3 style={{ textAlign: 'center' }}>Win rate</h3>
          <WinRate
            justify="center"
            align="center"
            winRatePercentage={winRatePercentage}
            winRate={gameHistory.winRate}
          >
            <div>{winRatePercentage}</div>
          </WinRate>
        </div>
      </Flex>
  );
}

if (CSS.registerProperty) {
  CSS.registerProperty({
    name: '--progress',
    syntax: '<percentage>',
    inherits: false,
    initialValue: '0%'
  });
  CSS.registerProperty({
    name: '--progress-color',
    syntax: '<color>',
    inherits: false,
    initialValue: 'transparent'
  });
}

const progress = props => keyframes`
  from {
    --progress-color: hsl(0, 80%, 75%);
    --progress: 0%; 

  } to {
    --progress-color: hsl(${props.winRate * 100}, 90%, 70%);
    --progress: ${props.winRatePercentage}; 
  }
`;

const WinRate = styled(Flex)`
  --size: 5em;
  --size-inner: calc(var(--size) * 0.8);
  --progress: ${props => props.winRatePercentage};
  --progress-color: hsl(${props => props.winRate * 100}, 90%, 70%);
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  position: relative;
  background: conic-gradient(
    var(--progress-color) var(--progress),
    transparent var(--progress)
  );
  animation: ${props => progress(props)} 1.2s ease-out;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.08);
  font-size: ${fontSize('xl')};

  & > * {
    background-color: ${color('surface')};
    font-weight: ${fontWeight('bold')};
    border-radius: 50%;
    width: var(--size-inner);
    height: var(--size-inner);
    display: inherit;
    justify-content: inherit;
    align-items: inherit;
  }
`;

const GameCount = styled(Flex)`
  font-weight: ${fontWeight('bold')};
  font-size: ${fontSize('xl')};
  flex-grow: 1;
`;

const InfoLabel = styled.h3`
  text-align: center;
`;
