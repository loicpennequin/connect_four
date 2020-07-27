import { Validator as ObjectionValidator } from 'objection';
import Joi from '@hapi/joi';

import { withLog } from '@root/logger';
import { pick } from '@c4/shared';

export class Validator extends ObjectionValidator {
  @withLog()
  validate({ model, json, options, ctx }) {
    let schema;
    if (options.patch) {
        const keys = Object.keys(json);
        schema = pick(model.validationSchema, keys);
    } else {
        schema = model.validationSchema;
    }
    const { error, value } = Joi.object()
    .keys(schema)
    .validate(json);
    
    if (error) throw error;
    
    return value;
  }
}
