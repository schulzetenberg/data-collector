import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';

import { Button, Form, SwitchForm2, TextField2, MultiSelect2 } from '@schulzetenberg/component-library';

const useStyles = makeStyles(() => ({
  textCenter: { textAlign: 'center' },
}));

type FormData = {
  active: boolean;
  visited: { value: string; label: string }[];
  options: { value: string; label: string }[];
  schedule: string;
  cloudinaryUpload: boolean;
};

const ParksSettings: React.FC<{ data: FormData; isLoading: boolean; submit: any }> = ({ data, isLoading, submit }) => {
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

      const { active, visited, schedule, cloudinaryUpload } = data;
      reset({ active, visited, schedule, cloudinaryUpload });
    }
  }, [data, reset]);

  return (
    <Form disabled={formProps.disabled} onSubmit={handleSubmit(submit)}>
      <div className={classes.textCenter}>
        <SwitchForm2 {...formProps} name="active" label="Active" />
      </div>
      <TextField2 {...formProps} name="schedule" label="Schedule" type="text" autoFocus />
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
