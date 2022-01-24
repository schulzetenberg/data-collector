import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';

import { Button, Form, SwitchForm, TextField, MultiSelect } from '@schulzetenberg/component-library';

const useStyles = makeStyles((theme: Theme) => ({
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

  const { handleSubmit, register, setValue, errors, reset } = useForm<FormData>({});

  const formProps = { disabled: isLoading, errors, register, setValue, fullWidth: true };

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
        <SwitchForm {...formProps} name="active" label="Active" />
      </div>
			<TextField {...formProps} name="schedule" label="Schedule" type="text" autoFocus />
      <MultiSelect name="visited" options={options} {...formProps} />
			<div className={classes.textCenter}>
        <SwitchForm {...formProps} name="cloudinaryUpload" label="Upload Images to Cloudinary" />
      </div>
      <Button {...formProps} type="submit">
        Save
      </Button>
    </Form>
  );
};

export default ParksSettings;
