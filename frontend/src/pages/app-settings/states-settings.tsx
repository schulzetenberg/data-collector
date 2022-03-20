import React, { useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';

import { Button, Form, SwitchForm2, MultiSelect2 } from '@schulzetenberg/component-library';

const useStyles = makeStyles((theme: Theme) => ({
  textCenter: { textAlign: 'center' },
}));

type FormData = {
  visited: { value: string; label: string }[];
  options: { value: string; label: string }[];
};

const StatesSettings: React.FC<{ data: FormData; isLoading: boolean; submit: any }> = ({
	data,
	isLoading,
	submit
}) => {
  const classes = useStyles();
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  const { handleSubmit, control, formState: { errors }, reset } = useForm<FormData>({});

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
      <div className={classes.textCenter}>
        <SwitchForm2 {...formProps} name="active" label="Active" />
      </div>
      <MultiSelect2 name="visited" options={options} {...formProps} />
      <Button {...formProps} type="submit">
        Save
      </Button>
    </Form>
  );
};

export default StatesSettings;
