import React from 'react';
import { RHFInput } from 'react-hook-form-input';
import Select from 'react-select';
import { InputLabel, FormControl, Theme, makeStyles, useTheme, FormHelperText } from '@material-ui/core';

const RHFInputAny = RHFInput as any; // TODO: Clean up

const useStyles = makeStyles((theme: Theme) => ({}));

const MultiSelect: React.FC<{
  name: string;
  label?: string;
  register?: Function;
  setValue?: Function;
  errors?: any;
  fullWidth?: boolean;
  [x: string]: any;
}> = ({ label, name, register, setValue, errors, options, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <FormControl>
      {/* TOO: Label is not showing up correctly */}
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <RHFInputAny
        as={<Select isMulti options={options} />}
        name={name}
        error={errors && errors[name] ? true : undefined}
        variant="outlined"
        margin="normal"
        register={register}
        setValue={setValue}
        {...rest}
      />
      <FormHelperText>{errors && errors[name] ? errors[name].message : undefined}</FormHelperText>
    </FormControl>
  );
};

export default MultiSelect;
