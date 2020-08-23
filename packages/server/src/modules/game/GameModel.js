import Joi from '@hapi/joi';

import { BaseModel } from '@root/modules/core';

export class Game extends BaseModel {
  static get tableName() {
    return 'game';
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

      history: Joi.any().required()
    };
  }
}
