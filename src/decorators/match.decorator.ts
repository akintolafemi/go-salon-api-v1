import { ClassConstructor } from "class-transformer";
import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export const Match = <T>(
  type: ClassConstructor<T>,
  property: (o: T) => any,
  fieldName: string,
  validationOptions?: ValidationOptions,
) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [fn] = args.constraints;
          return fn(args.object) === value;
        },
      
        defaultMessage(args: ValidationArguments) {
          const [constraintProperty]: (() => any)[] = args.constraints;
          console.log(constraintProperty);
          return `${fieldName} and ${args.property} do not match`;
        },
      }
    });
  };
};