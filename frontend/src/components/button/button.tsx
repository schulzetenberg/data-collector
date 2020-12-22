/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Button as MaterialButton } from '@material-ui/core';
import Spinner from '../spinner/spinner';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {},
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  })
);

const Button: React.FC<any> = ({
  children,
  type,
  errors,
  name,
  register,
  color = 'primary',
  variant = 'contained',
  setValue,
  loading = false,
  ...rest
}): any => {
  const classes = useStyles();

  const content = loading ? <Spinner color="inherit" size={24} /> : children;

  return (
    <MaterialButton
      type={type}
      variant={variant}
      color={color}
      data-testid={name}
      name={name}
      {...rest}
      className={classNames(classes.button, { [classes.submit]: type === 'submit' })}
    >
      {content}
    </MaterialButton>
  );
};

export default Button;
