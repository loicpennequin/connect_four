import { withLog } from '@root/logger';
import { UserSerializer } from './UserSerializer';
import { GameSerializer } from '@root/modules/game';

export class UserController {
  constructor({ userService, gameService }) {
    this.userService = userService;
    this.gameService = gameService;
  }

  @withLog()
  async findAll(_req, res) {
    const users = await this.userService.findAll();
    res.send(users.map(UserSerializer.toDTO));
  }

  @withLog()
  async create(req, res) {
    const user = await this.userService.create(req.body);

    res.send(UserSerializer.toDTO(user));
  }

  @withLog()
  async findGamesByUserId(req, res) {
    const games = await this.gameService.findAllByUser(req.params.id);
    res.send(games.map(GameSerializer.toDTO));
  }
}
