import Joi from '@hapi/joi';

import { BaseModel } from '@root/modules/core';
import { withLog } from '@root/logger';

export class Game extends BaseModel {
  static get tableName() {
    return 'user';
  }

  get validationSchema() {
    return {
      id: Joi.number().positive(),

      user1_id: Joi.number()
        .positive()
        .required(),

      user2_id: Joi.number()
        .positive()
        .required(),

      winner_id: Joi.number()
        .positive()
        .required(),

    };
  }
}
