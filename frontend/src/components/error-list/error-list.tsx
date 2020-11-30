import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  errorMessage: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(2),
  },
}));

const ErrorList: React.FC<{
  errors: string[];
}> = ({ errors }) => {
  const classes = useStyles();

  if (!errors || errors.length === 0) {
    return <></>;
  }

  return (
    <>
      {errors.map((error: string, index: number) => (
        <Typography className={classes.errorMessage} key={index} variant="body1" align="center">
          {error}
        </Typography>
      ))}
    </>
  );
};

export default ErrorList;
