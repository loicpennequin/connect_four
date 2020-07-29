import bcrypt from 'bcrypt';
import { withLog } from '@root/logger';
import errors from '@root/modules/core/ErrorFactory';

export class PasswordService {
  @withLog()
  static hash(password) {
    return bcrypt.hashSync(password, 12);
  }

  @withLog()
  static compare(password, hash) {
    const result = bcrypt.compareSync(password, hash);
    if (!result) throw errors.unauthorized('Invalid credentials.');
  }
}
