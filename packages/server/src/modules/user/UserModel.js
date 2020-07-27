import Joi from '@hapi/joi';

import { BaseModel, PasswordService } from '@root/modules/core';
import { withLog } from '@root/logger';

export class User extends BaseModel {
  static get tableName() {
    return 'user';
  }

  get validationSchema() {
    return {
      id: Joi.number().positive(),

      username: Joi.string()
        .min(4)
        .max(16)
        .required(),

      email: Joi.string()
        .email()
        .required(),

      password: Joi.string()
        .min(4)
        .required(),

      passwordConfirm: Joi.string()
        .valid(Joi.ref('password'))
        .required(),

      refresh_token: Joi.string()
        .allow(null)
        .optional()
    };
  }

  @withLog()
  generateHashedPassword() {
    if (
      this.hasOwnProperty('password') &&
      this.hasOwnProperty('passwordConfirm')
    ) {
      this.password_hash = PasswordService.hash(this.password);
      delete this.password;
      delete this.passwordConfirm;
    }
  }

  $beforeInsert() {
    this.generateHashedPassword();
  }

  $beforeUpdate() {
    this.generateHashedPassword();
  }
}
