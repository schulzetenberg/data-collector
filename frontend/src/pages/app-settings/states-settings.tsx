import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';

import { InputLabel, Select, MenuItem, FormControl, Input } from '@material-ui/core';
import Button from '../../components/button/button';
import Form from '../../components/form/form';
import TextField from '../../components/text-field/text-field';

import SwitchForm from '../../components/switch/switch-form';
import MultiSelect from '../../components/multi-select/multi-select';

const useStyles = makeStyles((theme: Theme) => ({
  textCenter: { textAlign: 'center' },
}));

type FormData = {
  visited: { value: string; label: string }[];
  options: { value: string; label: string }[];
};

const StatesSettings: React.FC<{ data: FormData; isLoading: boolean; submit: any }> = ({ data, isLoading, submit }) => {
  const classes = useStyles();
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  const { handleSubmit, register, setValue, errors, reset } = useForm<FormData>({});

  const formProps = { disabled: isLoading, errors, register, setValue, fullWidth: true };

  useEffect(() => {
    if (data) {
      setOptions(data.options);

      const { visited } = data;
      reset({ visited });
    }
  }, [data, reset]);

  return (
    <Form disabled={formProps.disabled} onSubmit={handleSubmit(submit)}>
      <div className={classes.textCenter}>
        <SwitchForm {...formProps} name="active" label="Active" />
      </div>
      <MultiSelect name="visited" options={options} {...formProps} />
      <Button {...formProps} type="submit">
        Save
      </Button>
    </Form>
  );
};

export default StatesSettings;
