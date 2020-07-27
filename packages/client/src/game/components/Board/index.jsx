import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useGameApi } from '@root/game/hooks/useGameApi';

export default function Board() {
  const { gameApi, addChecker, state } = useGameApi()
  const [highlightedColumn, setHghlightedColumn] = useState(null);

  return (
    <div>
      <StyledBoard rows={gameApi.rows} columns={gameApi.columns}>
        {state.board.map((column, i) =>
          column.map((cell, j) => (
            <StyledCell
              key={`${i}${j}`}
              col={i + 1}
              row={gameApi.rows - j}
              onClick={() => addChecker(i)}
              onMouseEnter={() => setHghlightedColumn(i)}
              onMouseLeave={() => setHghlightedColumn(null)}
              className={highlightedColumn === i ? 'highlighted': ''}
            >
              {cell && (
                <StyledChecker
                  player={cell.player}
                  faded={state.winner && !cell.isWinningCell}
                />
              )}
            </StyledCell>
          ))
        )}
      </StyledBoard>
    </div>
  );
}

const drop = keyframes`
  from {
    transform: translateY(var(--offset));
  }
  
  50%, to{
    transform: none;
  }

  80% {
    transform: translateY(calc(var(--offset) / 10));
  }
`;

const StyledBoard = styled.div`
  --cell-size: 6em;
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  grid-template-rows: repeat(${props => props.rows}, 1fr);
  height: calc(${props => props.rows} * var(--cell-size));
  width: calc(${props => props.columns} * var(--cell-size));
  margin: 1em auto;
`;

const StyledCell = styled.div`
  --board-bg-color: dodgerBlue;
  --offset: ${props => props.row * -100}%;
  grid-column: ${props => props.col};
  grid-row: ${props => props.row};
  position: relative;
  &.highlighted {
    --board-bg-color: deepSkyBlue;
  }
  &::after {
    background-color: var(--board-bg-color);
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    mask-image: radial-gradient(
      circle at center,
      transparent,
      transparent 49%,
      black 50%
    );
  }
`;

const StyledChecker = styled.div`
  --bg-color: ${props => (props.player === 'a' ? 'orangeRed' : 'orange')};
  background-color: var(--bg-color);
  ${props => props.player && 'content: "";'}
  position: absolute;
  width: 100%;
  height: 100%;
  mask-image: radial-gradient(
    circle at center,
    black,
    black 49%,
    transparent 50%
  );
  animation: ${drop} 0.5s ease-in;
  z-index: -1;
  opacity: ${props => (props.faded ? 0.35 : 1)};
`;
