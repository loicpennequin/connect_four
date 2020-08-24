import { removeEmptyKeys } from '@c4/shared';

export class MessageSerializer {
  static toDTO(data) {
    return removeEmptyKeys({
      id: data.id,
      content: data.content,
      authorId: data.author_id,
      gameId: data.game_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }

  static toPersistence(data) {
    return removeEmptyKeys({
      content: data.content,
      author_id: data.authorId,
      game_id: data.gameId,
    });
  }
}
