import { removeEmptyKeys } from '@c4/shared';

export class GameSerializer {
  static toDTO(data) {
    return removeEmptyKeys({
      user1Id: data.user1_id,
      user2Id: data.user2_id,
      winnerId: data.winner_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
  }

  static toPersistence(data) {
    return removeEmptyKeys({
      user1_id: data.user1Id,
      user2_id: data.user2Id,
      winner_id: data.winnerId
    });
  }
}
