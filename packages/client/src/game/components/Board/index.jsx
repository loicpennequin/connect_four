import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

import { color } from '@styles/mixins';

export function Board({ boardState, onColumnClick = () => {} }) {
  const [highlightedColumn, setHghlightedColumn] = useState(null);

  const getCellColor = cell => cell.player === boardState.playerIds[0] ? 'redChecker' : 'yellowChecker';
  
  return (
    <div>
      <StyledBoard rows={boardState.rows} columns={boardState.columns}>
        {boardState.board.map((column, i) =>
          column.map((cell, j) => (
            <StyledCell
              key={`${i}${j}`}
              col={i + 1}
              row={boardState.rows - j}
              onClick={() => onColumnClick(i)}
              onMouseEnter={() => setHghlightedColumn(i)}
              onMouseLeave={() => setHghlightedColumn(null)}
              className={highlightedColumn === i ? 'highlighted' : ''}
            >
              {cell && (
                <StyledChecker
                  $color={getCellColor(cell)}
                  faded={boardState.winner && !cell.isWinningCell}
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
  --cell-size: 5em;
  position: relative;
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  grid-template-rows: repeat(${props => props.rows}, 1fr);
  height: calc(${props => props.rows} * var(--cell-size));
  width: calc(${props => props.columns} * var(--cell-size));
  max-width: 100%;
  @media screen and (max-width: 768px) {
    --cell-size: 4em;
  }
  &::after {
    background: linear-gradient(130deg, dodgerblue, navy);
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
    mask-size: calc(100% / 7) calc(100% / 6);
    pointer-events: none;
  }
`;

const StyledCell = styled.div`
  --board-bg-color: transparent;
  --offset: ${props => props.row * -100}%;
  grid-column: ${props => props.col};
  grid-row: ${props => props.row};
  position: relative;
  &.highlighted {
    @media screen and (min-width: 769px) {
      --board-bg-color: hsla(200, 85%, 75%, 0.35);
    }
  }
  &::after {
    background-color: var(--board-bg-color);
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    mask-image: radial-gradient(
      circle at center,
      transparent,
      transparent 49%,
      black 50%
    );
  }
`;

const StyledChecker = styled.div`
  background-color: ${props => color(props.$color)};
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
  opacity: ${props => (props.faded ? 0.35 : 1)};
`;
