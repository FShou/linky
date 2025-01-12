import { useState } from 'react';
import { z } from 'zod';
// @ts-ignore
import _ from "lodash"

type FormErrors<T extends z.ZodRawShape> = Partial<Record<keyof T, string >>;

export function useForm<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  const [errors, setErrors] = useState<FormErrors<T>>({});

  const validateField = (fieldName: keyof T, value: string | string[] | boolean) => {
    const fieldSchema = schema.shape[fieldName];
    const result = fieldSchema.safeParse(value);
    return result.success ? undefined : result.error.issues[0].message;
  };


const validate = (
  afterValidate?: (value: string | string[] | boolean) => void | Promise<void>
) => {
  const debouncedValidate = _.debounce(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | React.FocusEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value, type, checked } = e.target as HTMLInputElement;
      const fieldValue = type === 'checkbox' ? checked : value;
      let error = validateField(name as keyof T, fieldValue);
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));

      if (afterValidate) {
        afterValidate(fieldValue);
      }
    },
    500
  );

  return debouncedValidate;
};
  const handleSubmit = (onSubmit: (formData: FormData) => void) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let hasError = false;
    const tempErrors: FormErrors<T> = {};

    for (const [fieldName, value] of formData.entries()) {
      const result = schema.shape[fieldName].safeParse(value);
      if (!result.success) {
        tempErrors[fieldName as keyof T] = result.error.issues[0].message;
        hasError = true;
      } else {
        tempErrors[fieldName as keyof T] = undefined;
      }
    }

    setErrors(tempErrors);

    if (hasError) {
      return;
    }

    onSubmit(formData);
  };

  return { errors, validate, setErrors , handleSubmit };
}
