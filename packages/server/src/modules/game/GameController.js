import { withLog } from '@root/logger';
import { GameSerializer } from './GameSerializer';

export class GameController {
  constructor({ gameService }) {
    this.gameService = gameService;
  }
}
