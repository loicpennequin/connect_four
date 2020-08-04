import { UserSerializer } from './UserSerializer';
import { httpClient } from '@root/core/api/httpClient';

export class UserService {
  static async getConnectedUsers() {
    const json = await httpClient.get('/users', {
      query: { filter: { is_online: true } }
    });

    return json.map(UserSerializer.toDomain);
  }

  static async getUserById(id) {
    const user = await httpClient.get(`/users/${id}`);
    return UserSerializer.toDomain(user);
  }

  static async createUser(data) {
    return await httpClient.post(`/users`, {
      body: UserSerializer.toDto(data)
    });
  }
}
