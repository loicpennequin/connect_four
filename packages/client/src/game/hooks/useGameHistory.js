import { useQuery } from 'react-query';

import {GameService} from '@game/api/GameService';

export function useGameHistory(userId) {
    const history = useQuery(
      ['games', userId],
      async () => {
        return GameService.getHistoryByUserId(userId);
      },
      {
        retry: false
      }
    );

    return history;
}