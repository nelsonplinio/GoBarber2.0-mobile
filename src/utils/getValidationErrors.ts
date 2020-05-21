import { ValidationError } from 'yup';

interface Errors {
  [path: string]: string;
}

export default function getValidationErros(error: ValidationError): Errors {
  return error.inner.reduce(
    (accumulator, err) => ({
      ...accumulator,
      [err.path]: err.message,
    }),
    {},
  );
}
