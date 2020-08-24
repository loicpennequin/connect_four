import Joi from '@hapi/joi';
import { BaseModel } from '@root/modules/core';

export class Message extends BaseModel {
  static get tableName() {
    return 'message';
  }

  get validationSchema() {
    return {
      id: Joi.number().positive(),

      content: Joi.string()
        .required(),

      author_id: Joi.number()
        .positive()
        .required(),

      game_id: Joi.string()
        .required().allow(null)
    };
  }
}
