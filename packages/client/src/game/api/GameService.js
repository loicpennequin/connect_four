import { GameSerializer } from './GameSerializer';
import { GameHistory } from './GameHistoryModel';
import { UserService } from '@user/api/UserService';
import { httpClient } from '@root/core/api/httpClient';

export class GameService {
  static async getHistoryByUserId(id) {
    const rawGames = await httpClient.get(`/users/${id}/games`);
    const games = await Promise.all(
      rawGames.map(async game => {
        const [user1, user2] = await Promise.all([
          await UserService.getUserById(game.user1Id),
          await UserService.getUserById(game.user2Id)
        ]);
        game.user1 = user1;
        game.user2 = user2;

        game.winner = [user1, user2].find(u => u.id === game.winnerId);
        return GameSerializer.toDomain(game);
      })
    );
    return new GameHistory({ games, ownerId : id });
  }
}
