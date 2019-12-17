import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Button as MaterialButton } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {},
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  })
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Button: React.FC<any> = ({ children, type, errors, register, setValue, ...rest }): any => {
  const classes = useStyles();

  return (
    <MaterialButton
      type={type}
      variant="contained"
      color="primary"
      {...rest}
      className={classNames(classes.button, { [classes.submit]: type === 'submit' })}
    >
      {children}
    </MaterialButton>
  );
};

export default Button;
