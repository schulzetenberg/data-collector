import React, { useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import useForm from 'react-hook-form';

import Button from '../../components/button/button';
import Form from '../../components/form/form';
import TextField from '../../components/text-field/text-field';

import SwitchForm from '../../components/switch/switch-form';

const useStyles = makeStyles((theme: Theme) => ({
  textCenter: { textAlign: 'center' },
}));

type FormData = {
  active: boolean;
  schedule: string;
  key: string;
  id: number;
  numDays: number;
};

const GoodreadsSettings: React.FC<{ data: FormData; isLoading: boolean; submit: any }> = ({
  data,
  isLoading,
  submit,
}) => {
  const classes = useStyles();

  const { handleSubmit, register, setValue, errors, reset } = useForm<FormData>();

  const formProps = { disabled: isLoading, errors, register, setValue, fullWidth: true };

  useEffect(() => {
    if (data) {
      const { active, schedule, key, id, numDays } = data;

      reset({
        active,
        schedule,
        key,
        id,
        numDays,
      });
    }
  }, [data, reset]);

  return (
    <Form disabled={formProps.disabled} onSubmit={handleSubmit(submit)}>
      <div className={classes.textCenter}>
        <SwitchForm {...formProps} name="active" label="Active" />
      </div>
      <TextField {...formProps} name="schedule" label="Schedule" type="text" autoFocus />
      <TextField {...formProps} name="key" label="Key" type="text" />
      <TextField {...formProps} name="id" label="ID" type="number" />
      <TextField {...formProps} name="numDays" label="Number Of Days" type="number" />
      <Button {...formProps} type="submit">
        Save
      </Button>
    </Form>
  );
};

export default GoodreadsSettings;
