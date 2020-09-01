import { removeEmptyKeys } from '@c4/shared';

export class UserSerializer {
  static toDomain(dto) {
    return {
      id: dto.id,
      username: dto.username,
      email: dto.email,
      status: dto.status,
      isOnline: dto.isOnline,
      createdAt: dto.createdAt
    }
  }
  
  static toDto(data) {
    return removeEmptyKeys({
      id: data.id,
      username: data.username,
      email: data.email,
      status: data.status,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
      createdAt: data.createdAt
    });
  }
}
