import React from 'react';
import { RHFInput } from 'react-hook-form-input';
import { Checkbox as MaterialCheckbox, FormControlLabel } from '@material-ui/core';

const RHFInputAny = RHFInput as any; // TODO: Clean up

const Checkbox: React.FC<{
  name: string;
  label?: string;
  register: Function;
  setValue: Function;
  errors: any;
  [x: string]: any;
}> = ({ name, label, register, setValue, errors, ...rest }) => {
  return (
    <FormControlLabel
      control={
        <RHFInputAny
          as={<MaterialCheckbox />}
          name={name}
          type="checkbox"
          error={errors[name] ? true : undefined}
          register={register}
          setValue={setValue}
          {...rest}
        />
      }
      label={label}
    />
  );
};

export default Checkbox;
