import { withLog } from '@root/logger';
import { Message } from './MessageModel';
import { MessageSerializer } from './MessageSerializer';

export class MessageService {
  @withLog()
  async findAll({filter = {}, order} = {}) {
    return await Message.query()
      .where(filter)
      .orderBy(order);
  }

  @withLog(true)
  create(data) {
    return Message.query().insertAndFetch(MessageSerializer.toPersistence(data));
  }
}
