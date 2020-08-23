import { withLog } from '@root/logger';
import { GameSerializer } from './GameSerializer.js';
import errors, {
  wrapRequestDecorator as wrap
} from '@root/modules/core/ErrorFactory';

export class GameController {
  constructor({ gameService }) {
    this.gameService = gameService;
  }

  @withLog()
  @wrap()
  async findById(req, res) {
    const game = await this.gameService.findById(req.params.id);
    if (!game) throw errors.notFound();

    res.send(GameSerializer.toDTO(game));
  }
}
