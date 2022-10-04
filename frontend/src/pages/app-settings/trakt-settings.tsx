import React, { useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useForm } from 'react-hook-form';

import { Button, Form, TextField2, SwitchForm2 } from '@schulzetenberg/component-library';

const useStyles = makeStyles(() => ({
  textCenter: { textAlign: 'center' },
}));

type FormData = {
  active: boolean;
  schedule: string;
  user: string;
  id: string;
  key: string;
};

const TraktSettings: React.FC<{ data: FormData; isLoading: boolean; submit: (formData: FormData) => void }> = ({
  data,
  isLoading,
  submit,
}) => {
  const classes = useStyles();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const formProps = { disabled: isLoading, control, errors, fullWidth: true };

  useEffect(() => {
    if (data) {
      const { active, schedule, user, id, key } = data;

      reset({
        active,
        schedule,
        user,
        id,
        key,
      });
    }
  }, [data, reset]);

  return (
    <Form disabled={formProps.disabled} onSubmit={handleSubmit(submit)}>
      <div className={classes.textCenter}>
        <SwitchForm2 {...formProps} name="active" label="Active" />
      </div>
      <TextField2 {...formProps} name="schedule" label="Schedule" type="text" autoFocus />
      <TextField2 {...formProps} name="user" label="User" type="text" />
      <TextField2 {...formProps} name="id" label="ID" type="text" />
      <TextField2 {...formProps} name="key" label="Key" type="text" />
      <Button {...formProps} type="submit">
        Save
      </Button>
    </Form>
  );
};

export default TraktSettings;
