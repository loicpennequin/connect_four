import { GameSerializer } from './GameSerializer';
import { GameHistory } from './GameHistoryModel';
import { UserService } from '@user/api/UserService';
import { httpClient } from '@root/core/api/httpClient';
import { queryCache } from 'react-query';

export class GameService {
  static async _getUsersFromGame(game) {
    const prefetchUser = id =>
      queryCache.prefetchQuery(['user', id], () => UserService.getUserById(id));

    const [user1, user2] = await Promise.all([
      prefetchUser(game.user1Id),
      prefetchUser(game.user2Id)
    ]);

    game.user1 = user1;
    game.user2 = user2;

    game.winner = [user1, user2].find(u => u.id === game.winnerId);
    return GameSerializer.toDomain(game);
  }

  static async getHistoryByUserId(id) {
    const rawGames = await httpClient.get(`/users/${id}/games`);
    const games = await Promise.all(
      rawGames.map(GameService._getUsersFromGame)
    );

    return new GameHistory({ games, ownerId: id });
  }

  static async getGameById(id) {
    const game = await httpClient.get(`/games/${id}`);

    return GameService._getUsersFromGame(game);
  }
}
