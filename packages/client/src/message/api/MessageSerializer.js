import { removeEmptyKeys } from '@c4/shared';
import { UserSerializer } from '@user/api/UserSerializer';

export class MessageSerializer {
  static toDomain(dto) {
    return {
      id: dto.id,
      content: dto.content,
      gameId: dto.gameId,
      author: UserSerializer.toDomain(dto.author),
      createdAt: dto.createdAt
    };
  }

  static toDto(data) {
    return removeEmptyKeys({
      id: data.id,
      content: data.content,
      gameId: data.gameId,
      authorId: data.authorId
    });
  }
}
