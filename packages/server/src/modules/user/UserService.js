import { withLog } from '@root/logger';
import { User } from './UserModel';
import { UserSerializer } from './UserSerializer';

export class UserService {
  @withLog()
  async findAll({ filter = {} } = {}) {
    return await User.query().where(filter);
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
  findById(id) {
    return User.query()
      .findById(id)
      .throwIfNotFound();
  }

  @withLog(true)
  async findByIds(ids) {
    const users = await User.query()
      .findByIds(ids)
      .throwIfNotFound();
    // Objections's .findById() doesn't guarantee The order of the returned items...
    // Todo : extend Objection's QueryBuilder in the BaseModel to add a FindByIdsAndSort() method
    return ids.map(id => users.find(user => user.id === id));
  }

  @withLog(true)
  create(data) {
    return User.query().insertAndFetch(UserSerializer.toPersistence(data));
  }

  @withLog(true)
  update(id, data) {
    return User.query()
      .patchAndFetchById(id, UserSerializer.toPersistence(data))
      .throwIfNotFound();
  }
}
