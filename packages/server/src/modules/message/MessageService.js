import { withLog } from '@root/logger';
import { Message } from './MessageModel';
import { MessageSerializer } from './MessageSerializer';
import { constants } from '@c4/shared';

export class MessageService {
  constructor({ webSocketService }) {
    this.webSocketService = webSocketService;
  }

  @withLog()
  async findAll({ filter = {}, order, limit, offset } = {}) {
    return Message.query()
      .where(filter)
      .offset(offset || 0)
      .orderBy(order)
      .limit(limit)
  }

  @withLog(true)
  async create(data) {
    const rawMessage = await Message.query().insertAndFetch(
      MessageSerializer.toPersistence(data)
    );

    const eventName = data.game_id
      ? constants.EVENTS.NEW_GAME_MESSAGE
      : constants.EVENTS.NEW_LOBBY_MESSAGE;

    this.webSocketService.broadcast(
      eventName,
      MessageSerializer.toDTO(rawMessage)
    );

    return rawMessage;
  }
}
