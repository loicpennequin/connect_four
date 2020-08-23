import { withLog } from '@root/logger';
import { Game } from './GameModel';
import { GameSerializer } from './GameSerializer';
import { GameSubscribers } from './GameSubscribers';
import { GameRoom } from './GameRoom';

export class GameService {
  static gameRooms = [];

  static initialize(container) {
    new GameSubscribers(container);
  }

  @withLog()
  async findAllByUser(id) {
    return await Game.query()
      .where({ user1_id: id })
      .orWhere({ user2_id: id })
      .orderBy('created_at', 'desc');
  }
  
  @withLog()
  async findById(id) {
    return Game.query()
      .findById(id)
      .throwIfNotFound();
  }

  @withLog(true)
  async create(data) {
    return Game.query().insert(GameSerializer.toPersistence(data));
  }

  @withLog(true)
  createGameInstance(...playerIds) {
    const room = new GameRoom({
      playerIds
    });
    this.constructor.gameRooms.push(room);
  }

  @withLog(true)
  removeGameInstance(gameId) {
    this.constructor.gameRooms = this.constructor.gameRooms.filter(
      room => room.state.id !== gameId
    );
  }
}
