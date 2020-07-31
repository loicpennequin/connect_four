import { withLog } from '@root/logger';
import { User } from './UserModel';
import { UserSerializer } from './UserSerializer';

export class UserService {
  @withLog()
  async findAll() {
    return await User.query();
  }

  @withLog(true)
  async findByRefreshToken(refresh_token) {
    if (!refresh_token) return;

    return await User.query().findOne({ refresh_token });
  }

  @withLog(true)
  async findByUsername(username) {
    return await User.query().findOne({ username });
  }

  @withLog(true)
  async findById(id) {
    return await User.query().findById(id);
  }

  @withLog(true)
  async findByIds(ids) {
    return await User.query().findByIds(ids);
  }

  @withLog(true)
  async create(data) {
    return User.query().insert(UserSerializer.toPersistence(data));
  }

  @withLog(true)
  async update(id, data) {
    return User.query().patchAndFetchById(
      id,
      UserSerializer.toPersistence(data)
    );
  }
}
