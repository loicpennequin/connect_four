import { removeEmptyKeys } from '@c4/shared';
import { withLog } from '@root/logger';

export class UserSerializer {
  @withLog()
  static toDTO(data) {
    return removeEmptyKeys({
      username: data.username,
      email: data.email,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    })
  }
  
  @withLog()
  static toPersistence(data) {
    return removeEmptyKeys({
      username: data.username,
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
      refresh_token: data.refreshToken
    })
  }
}