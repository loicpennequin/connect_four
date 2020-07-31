import { UserSerializer } from './UserSerializer';
import { httpClient } from '@root/core/api/httpClient';

export class UserService {
  static async getAllUsers() {
    const json = await httpClient.get(`/users`);
    return json.map(UserSerializer.toDomain);
  }
  
  static async createUser(data) {
    return await httpClient.post(`/users`, {
      body: UserSerializer.toDto(data)
    });
  }
}