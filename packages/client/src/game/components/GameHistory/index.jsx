import React from 'react';
import styled from 'styled-components';

import { useGameHistory } from '@game/hooks/useGameHistory';

import { spacing, color, fontWeight, mobileOnly } from '@styles/mixins';

import { GameHistoryMetrics } from './GameHistoryMetrics';
import { Flex } from '@core/components/Flex';
import { Link } from '@core/components/Link';
import { Button } from '@core/components/Button';

export function GameHistory({ userId }) {
  const { data: gameHistory, isLoading } = useGameHistory(userId);

  if (isLoading) return <div>Loading game history...</div>;

  return (
    <div>
      <GameHistoryMetrics gameHistory={gameHistory} />
      
      {gameHistory.games.length === 0 && (
        <p>This player has not played any game yet.</p>
      )}

      <HistoryTitle>Game History</HistoryTitle>
      <Flex as="ul" direction="column" align="center">
        {gameHistory.games.map(game => (
          <GameHistoryItem as="li" key={game.id}>
            <div>{game.getTimeAgo()}</div>
            <div>
              <Link to="Profile" params={{ id: game.opponent.id }}>
              VS {game.opponent.username}
              </Link>
            </div>
            <GameHistoryItemResult isWin={game.isWin}>
              {game.isWin ? 'WIN' : 'LOSS'}
            </GameHistoryItemResult>
            <Button as={Link} to="Replay" params={{id: game.id}}>Replay</Button>
           </GameHistoryItem>
        ))}
      </Flex>
    </div>
  );
}

const GameHistoryItem = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  justify-content: center;
  align-items: center;
  padding: ${spacing('sm')} ${spacing('md')};
  grid-gap: ${spacing('sm')};

  @media screen and (${mobileOnly}) {
    width: 100%;
  }

  a {
    text-decoration: none;
  }

  & > * {
    text-align: center;
  }
`;

const GameHistoryItemResult = styled.div`
  font-weight: ${fontWeight('bold')};
  color: ${props => color(props.isWin ? 'success' : 'danger')};
`;

const HistoryTitle = styled.h2`
  text-align: center;
`