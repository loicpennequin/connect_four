import { removeEmptyKeys } from '@c4/shared';

export class UserSerializer {
  static toDTO(data) {
    return removeEmptyKeys({
      id: data.id,
      username: data.username,
      email: data.email,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      isOnline: !!data.is_online
    });
  }

  static toPersistence(data) {
    return removeEmptyKeys({
      username: data.username,
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
      refresh_token: data.refreshToken,
      is_online: data.isOnline
    });
  }
}
