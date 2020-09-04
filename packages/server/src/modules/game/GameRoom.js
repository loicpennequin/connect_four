import clone from 'clone';
import { constants, enums } from '@c4/shared';
import { container } from '@root/container';
import { withLog } from '@root/logger';
import { wrapDecorator as wrap } from '@root/modules/core/ErrorFactory';

const { EVENTS } = constants;

export class GameRoom {
  ROWS = 6;
  COLUMNS = 7;
  PLAYER_ONE = 'a';
  PLAYER_TWO = 'b';

  constructor({ playerIds }) {
    this.websocketService = container.resolve('webSocketService');
    this.gameService = container.resolve('gameService');
    this.userService = container.resolve('userService');
    this.logic = container.resolve('gameLogic');

    this.state = this.logic.initializeState(playerIds);
    this.history = [clone(this.state)];

    this.websocketService.emit(
      EVENTS.GAME_HAS_BEEN_CREATED,
      this.state,
      ...this.clients
    );

    this.websocketService.on(EVENTS.GAME_ACTION, this.onGameAction.bind(this));
  }

  get clients() {
    return this.state.playerIds.map(id =>
      this.websocketService.getSocketByUserId(id)
    );
  }

  @withLog()
  @wrap()
  async onGameAction(_ws, data) {
    if (data.gameId !== this.state.id) return;

    this.state = this.logic.handleGameAction(this.state, data.column);
    this.websocketService.emit(EVENTS.GAME_ACTION, this.state, ...this.clients);
    this.history.push(clone(this.state));

    if (this.state.winner) {
      await this.gameService.create({
        user1Id: this.state.playerIds[0],
        user2Id: this.state.playerIds[1],
        winnerId: this.state.winner,
        history: JSON.stringify(this.history)
      });

      this.state.playerIds.forEach(id =>
        this.userService.update(id, { status: enums.USER_STATUSES.READY })
      );
      
      this.websocketService.broadcast(
        EVENTS.GAME_HAS_FINISHED,
        {},
      );
      this.gameService.removeGameInstance(this.state.id);
    }
  }
}
