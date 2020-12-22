import React from 'react';
import { CircularProgress, Grid } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export interface SpinnerProps {
  isPage?: boolean;
  [x: string]: any;
}
const Spinner: React.FC<SpinnerProps> = ({ isPage = false, ...rest }) => {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      page: {
        marginTop: theme.spacing(3),
      },
    })
  );

  const classes = useStyles();
  const pageProps = isPage ? { size: 60 } : null;

  return (
    <Grid container justify="center">
      <CircularProgress className={isPage ? classes.page : ''} {...pageProps} {...rest} />
    </Grid>
  );
};

export default Spinner;
