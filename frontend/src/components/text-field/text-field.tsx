import React from 'react';
import { RHFInput } from 'react-hook-form-input';
import { TextField as MaterialTextField } from '@material-ui/core';

const RHFInputAny = RHFInput as any; // TODO: Clean up

const TextField: React.FC<{
  name: string;
  register?: Function;
  setValue?: Function;
  errors?: any;
  [x: string]: any;
}> = ({ name, register, setValue, errors, type, ...rest }) => {
  return (
    <RHFInputAny
      as={<MaterialTextField name={name} data-testid={name} />}
      name={name}
      error={errors && errors[name] ? true : undefined}
      defaultValue=""
      variant="outlined"
      margin="normal"
      register={register}
      setValue={setValue}
      InputProps={{ type }}
      helperText={errors && errors[name] ? errors[name].message : undefined}
      {...rest}
    />
  );
};

export default TextField;
