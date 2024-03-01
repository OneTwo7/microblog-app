import { ChangeEvent, useState } from 'react';
import { FieldError } from '@/gql/graphql';

export function useForm<FormErrors>() {
  const [formData, setFormData] = useState<{ [key: string]: string | undefined }>({});
  const [formErrors, setFormErrors] = useState<FormErrors>();

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: event.target.value,
    }));
    setFormErrors(
      (prevErrors) =>
        ({
          ...prevErrors,
          [name]: '',
        } as FormErrors),
    );
  };

  const mapErrors = (errors?: FieldError[]) => {
    if (!errors) {
      setFormErrors(undefined);
      return;
    }

    setFormErrors(
      errors.reduce(
        (agg, cur) => ({
          ...agg,
          [cur.field]: cur.message,
        }),
        {} as FormErrors,
      ),
    );
  };

  return {
    formData,
    formErrors,
    onChange,
    mapErrors,
  };
}
