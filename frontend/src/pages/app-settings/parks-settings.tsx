import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import makeStyles from '@mui/styles/makeStyles';

import { Button, Form, MultiSelect2, SwitchForm2 } from '@schulzetenberg/component-library';

const useStyles = makeStyles(() => ({
  textCenter: { textAlign: 'center' },
}));

type FormData = {
  visited: { value: string; label: string }[];
  options: { value: string; label: string }[];
  cloudinaryUpload: boolean;
};

const ParksSettings: React.FC<{ data: FormData; isLoading: boolean; submit: (formData: FormData) => void }> = ({
  data,
  isLoading,
  submit,
}) => {
  const classes = useStyles();
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

      const { visited, cloudinaryUpload } = data;
      reset({ visited, cloudinaryUpload });
    }
  }, [data, reset]);

  return (
    <Form disabled={formProps.disabled} onSubmit={handleSubmit(submit)}>
      <MultiSelect2 name="visited" options={options} {...formProps} />
      <div className={classes.textCenter}>
        <SwitchForm2 {...formProps} name="cloudinaryUpload" label="Upload Images to Cloudinary" />
      </div>
      <Button {...formProps} type="submit">
        Save
      </Button>
    </Form>
  );
};

export default ParksSettings;
