import { removeEmptyKeys } from '@c4/shared';
import { withLog } from '@root/logger';

export class GameSerializer {
  @withLog()
  static toDTO(data) {
    return removeEmptyKeys({
      user1Id: data.user1_id,
      user2Id: data.user2_id,
      winnerId: data.winner_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
  }

  @withLog()
  static toPersistence(data) {
    return removeEmptyKeys({
      user1_Id: data.user1Id,
      user2_Id: data.user2Id,
      winner_Id: data.winnerId
    });
  }
}
