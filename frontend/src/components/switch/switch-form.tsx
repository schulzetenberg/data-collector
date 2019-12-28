import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Switch as MaterialSwitch, FormControlLabel } from '@material-ui/core';
import { RHFInput } from 'react-hook-form-input';

const RHFInputAny = RHFInput as any; // TODO: Clean up

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 42,
      height: 26,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 1,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: theme.palette.primary.main,
          opacity: 1,
          border: 'none',
        },
      },
    },
    thumb: {
      width: 24,
      height: 24,
    },
    track: {
      borderRadius: 26 / 2,
      border: `1px solid ${theme.palette.grey[300]}`,
      backgroundColor: theme.palette.grey[300],
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  })
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SwitchForm: React.FC<any> = ({ name, label, register, setValue, errors, fullWidth, ...rest }: any) => {
  const classes = useStyles();

  return (
    <FormControlLabel
      control={
        <RHFInputAny
          as={
            <MaterialSwitch
              focusVisibleClassName={classes.focusVisible}
              disableRipple
              classes={{
                root: classes.root,
                switchBase: classes.switchBase,
                thumb: classes.thumb,
                track: classes.track,
                checked: classes.checked,
              }}
            />
          }
          name={name}
          type="checkbox"
          error={errors[name] ? true : undefined}
          register={register}
          setValue={setValue}
          {...rest}
        />
      }
      label={label}
      labelPlacement="top"
    />
  );
};

export default SwitchForm;
