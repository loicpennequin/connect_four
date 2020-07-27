import { withLog } from '@root/logger';
import { Game } from './GameModel';
import { GameSerializer } from './GameSerializer';

export class GameService {
  @withLog()
  async findAllByUser(id) {
    return await Game.query().where({ user1_id: id }).orWhere({ user2_id: id });
  }

  @withLog(true)
  async create(data) {
    return Game.query().insert(GameSerializer.toPersistence(data));
  }
}
