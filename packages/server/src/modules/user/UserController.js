import { withLog } from '@root/logger';
import { UserSerializer } from './UserSerializer';
import { GameSerializer } from '@root/modules/game';
import { wrapRequestDecorator as wrap } from '@root/modules/core/ErrorFactory';
import errors from '@root/modules/core/ErrorFactory';

export class UserController {
  constructor({ userService, gameService }) {
    this.userService = userService;
    this.gameService = gameService;
  }

  @withLog()
  @wrap()
  async findAll(req, res) {
    const filter = req.query.filter && JSON.parse(req.query.filter);
    const users = await this.userService.findAll({ filter });
    res.send(users.map(UserSerializer.toDTO));
  }

  @withLog()
  @wrap()
  async create(req, res) {
    const user = await this.userService.create(req.body);
    res.send(UserSerializer.toDTO(user));
  }

  @withLog()
  @wrap()
  async findById(req, res) {
    const user = await this.userService.findById(req.params.id);
    if (!user) throw errors.notFound();
    res.send(UserSerializer.toDTO(user));
  }

  @withLog()
  @wrap()
  async findGamesByUserId(req, res) {
    const games = await this.gameService.findAllByUser(req.params.id);
    res.send(games.map(GameSerializer.toDTO));
  }
}
