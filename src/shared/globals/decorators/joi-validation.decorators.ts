import { JoiRequestValidationError } from '@global/helpers/error-handler';
import { Request } from 'express';
import { ObjectSchema, ValidationErrorItem } from 'joi';

/**
 * A type definition for the Joi validation method decorator.
 */
type IJoiDecorator = (target: object, key: string, descriptor: PropertyDescriptor) => void;

/**
 * A method decorator for validating Express request body using a Joi schema.
 *
 * @param schema - The Joi schema to validate the request body against.
 * @returns A method decorator that validates req.body.
 */
export function joiValidation(schema: ObjectSchema): IJoiDecorator {
  return (_target: object, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: [Request, ...unknown[]]): Promise<unknown> {
      const req: Request = args[0];

      // Validate the body against the schema
      const { error } = await Promise.resolve(schema.validate(req.body, { abortEarly: false }));

      // If validation error exists, throw the first error message
      if (error?.details) {
        const firstError: ValidationErrorItem = error.details[0];
        throw new JoiRequestValidationError(firstError.message);
      }

      // Proceed to original method
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

// import { JoiRequestValidationError } from '@global/helpers/error-handler';
// import { Request } from 'express';
// import { ObjectSchema } from 'joi';

// type IJoiDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void;

// export function joiValidation(schema: ObjectSchema): IJoiDecorator {
//   return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
//     const originalMethod = descriptor.value;

//     descriptor.value = async function (...args: any[]) {
//       const req: Request = args[0];
//       const { error } = await Promise.resolve(schema.validate(req.body));
//       if (error?.details) {
//         throw new JoiRequestValidationError(error.details[0].message);
//       }
//       return originalMethod.apply(this, args);
//     };

//     return descriptor;
//   };
// }
