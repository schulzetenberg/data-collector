import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Fade } from '@material-ui/core';
import classNames from 'classnames';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    '@keyframes fadeinout': {
      '50%': { opacity: 0.4 },
    },
    formDisabled: {
      animationName: '$fadeinout',
      animationDuration: '2s',
      animationTimingFunction: 'ease',
      animationIterationCount: 'infinite',
    },
  })
);

const Form = ({ children, onSubmit, disabled }: any): any => {
  const classes = useStyles();

  return (
    <Fade in timeout={750}>
      <form noValidate className={classNames(classes.form, { [classes.formDisabled]: disabled })} onSubmit={onSubmit}>
        {children}
      </form>
    </Fade>
  );
};

export default Form;
