import { isUndefined } from '@c4/shared';
import { MessageSerializer } from './MessageSerializer';
import { UserService } from '@user/api/UserService';
import { httpClient } from '@root/core/api/httpClient';
import { queryCache } from 'react-query';

export class MessageService {
  static async _getMessageAuthor(message) {
    return queryCache.prefetchQuery(['user', message.authorId], () =>
      UserService.getUserById(message.authorId)
    );
  }

  static async _getMessages(url, { offset }) {
    const json = await httpClient.get(url, {
      query: { offset, limit: 30 }
    });
    const messagesWithAuthor = await Promise.all(
      json.map(async message => ({
        ...message,
        author: await MessageService._getMessageAuthor(message)
      }))
    );

    return messagesWithAuthor.map(MessageSerializer.toDomain);
  }
  
  static async getLobbyMessages({ offset = 0 }) {
    return MessageService._getMessages('/messages', { offset });
  }

  static async getGameMessages(id, { offset }) {
    return MessageService._getMessages(`/games/${id}/messages`, { offset });
  }

  static async createMessage(data) {
    if (isUndefined(data.gameId)) data.gameId = null;

    return await httpClient.post(`/messages`, {
      body: MessageSerializer.toDto(data)
    });
  }

  static async processDTO(dto) {
    dto.author = await MessageService._getMessageAuthor(dto);
    return MessageSerializer.toDomain(dto);
  }
}
