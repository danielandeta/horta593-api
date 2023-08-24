import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { validateID } from '../validateID';

@ValidatorConstraint({ name: 'isValidNationalID', async: true })
export class IsValidNationalID implements ValidatorConstraintInterface {
  constructor() {}

  validate(nationalId: string) {
    return validateID(nationalId);
  }
}

export function ValidNationalID(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidNationalID',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidNationalID,
    });
  };
}
