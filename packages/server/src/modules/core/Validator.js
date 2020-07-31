import { Validator as ObjectionValidator } from 'objection';
import Joi from '@hapi/joi';

import { withLog } from '@root/logger';
import { pick } from '@c4/shared';

import errors from '@root/modules/core/ErrorFactory';
import { errorMonitor } from 'ws';

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
      .validate(json, { abortEarly: false });

    if (error)
      throw errors.validationError('Invalid input', this.formatErrors(error));

    return value;
  }

  formatErrors(errors) {
    return {
      violations: errors.details.map(error => ({
        field: error.context.key,
        type: error.type,
        message: error.message
      }))
    };
  }
}
