import { withLog } from '@root/logger';
import { MessageSerializer } from './MessageSerializer.js';
import { wrapRequestDecorator as wrap } from '@root/modules/core/ErrorFactory';

export class MessageController {
  constructor({ messageService }) {
    this.messageService = messageService;
  }

  @withLog()
  @wrap()
  async findAllFromLobby(req, res) {
    const messages = await this.messageService.findAll({
      filter: { game_id: null },
      order: [{ column: 'created_at', order: 'desc' }]
    });

    res.send(messages.map(MessageSerializer.toDTO));
  }

  @withLog()
  @wrap()
  async create(req, res) {
    const user = await this.messageService.create(req.body);
    res.send(MessageSerializer.toDTO(user));
  }
}
