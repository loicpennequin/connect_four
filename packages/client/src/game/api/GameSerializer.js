import { UserSerializer } from '@user/api/UserSerializer';

export class GameSerializer {
  static toDomain(dto) {
    return {
      id: dto.id,
      user1: UserSerializer.toDomain(dto.user1),
      user2: UserSerializer.toDomain(dto.user2),
      winner: UserSerializer.toDomain(dto.winner),
      createdAt: dto.createdAt
    };
  }
}
