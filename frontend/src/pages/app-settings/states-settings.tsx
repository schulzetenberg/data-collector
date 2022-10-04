import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Form, MultiSelect2 } from '@schulzetenberg/component-library';

type FormData = {
  visited: { value: string; label: string }[];
  options: { value: string; label: string }[];
};

const StatesSettings: React.FC<{ data: FormData; isLoading: boolean; submit: (formData: FormData) => void }> = ({
  data,
  isLoading,
  submit,
}) => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({});

  const formProps = { disabled: isLoading, control, errors, fullWidth: true };

  useEffect(() => {
    if (data) {
      setOptions(data.options);

      const { visited } = data;
      reset({ visited });
    }
  }, [data, reset]);

  return (
    <Form disabled={formProps.disabled} onSubmit={handleSubmit(submit)}>
      <MultiSelect2 name="visited" options={options} {...formProps} />
      <Button {...formProps} type="submit">
        Save
      </Button>
    </Form>
  );
};

export default StatesSettings;
