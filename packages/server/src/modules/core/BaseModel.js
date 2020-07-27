import { Model } from 'objection';
import { Validator } from '@root/modules/core/Validator';

export class BaseModel extends Model {
  static createValidator() {
    return new Validator();
  }

  $beforeValidate(args) {
    return args;
  }

  $afterValidate(args) {
    return args;
  }
}
