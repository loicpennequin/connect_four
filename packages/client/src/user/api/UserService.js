import { UserSerializer } from './UserSerializer';
import { httpClient } from '@root/core/api/httpClient';

export class UserService {
  static async getAllUsers() {
    const json = await httpClient.get(`/users`);
    return json.map(UserSerializer.toDomain);
  }
}