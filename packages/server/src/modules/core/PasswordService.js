import bcrypt from 'bcrypt';
import { withLog } from '@root/logger';

export class PasswordService {
  @withLog()
  static hash(password) {
    return bcrypt.hashSync(password, 12);
  }

  @withLog()
  static compare(password, hash) {
    const result = bcrypt.compareSync(password, hash);
    if (!result) throw new Error('invalid credentials');
  }
}
