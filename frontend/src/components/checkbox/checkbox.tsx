import React from 'react';
import { RHFInput } from 'react-hook-form-input';
import { Checkbox as MaterialCheckbox, FormControlLabel } from '@material-ui/core';

const RHFInputAny = RHFInput as any; // TODO: Clean up

export interface CheckboxProps {
  name: string;
  label?: string;
  register?: Function;
  setValue?: Function;
  errors?: any;
  fullWidth?: boolean;
  [x: string]: any;
}

const Checkbox: React.FC<CheckboxProps> = ({ name, label, register, setValue, color = 'primary', errors, ...rest }) => {
  return (
    <FormControlLabel
      control={
        <RHFInputAny
          as={<MaterialCheckbox />}
          name={name}
          color={color}
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
